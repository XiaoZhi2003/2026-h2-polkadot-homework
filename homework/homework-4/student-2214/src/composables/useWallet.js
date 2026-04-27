import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  connect, disconnect, getAccount, getBalance,
  switchChain, watchAccount, watchChainId, getConnectors,
  getPublicClient,
} from '@wagmi/core'
import { formatEther, formatGwei } from 'viem'
import { wagmiConfig, SUPPORTED_CHAINS } from '@/wagmi.config.js'
import { getSupportedChainId, resolveNetworkState } from '@/networkState.js'

// 钱包状态放在模块级，导航栏、仪表盘和业务页面看到的是同一份连接结果。
export const wallet = ref({
  address: null, chainId: null, isConnected: false,
  status: 'disconnected', connector: null,
  balance: null, balanceRaw: 0n, balanceSymbol: '',
})

export const useWallet = () => {
  const loading  = ref(false)
  const error    = ref('')
  let unwatchAcc = null, unwatchChain = null

  const networkState = computed(() => resolveNetworkState(wallet.value.chainId))
  const chain       = computed(() => networkState.value.chain)
  // 地址展示只做中间截断，复制和交易仍然使用完整地址。
  const shortAddr   = computed(() => {
    const a = wallet.value.address
    return a ? `${a.slice(0,6)}…${a.slice(-4)}` : ''
  })
  const isSupported = computed(() => networkState.value.isSupported)

  async function refreshBalance() {
    const { address, chainId } = wallet.value
    const supportedChainId = getSupportedChainId(chainId)
    if (!address || supportedChainId === null) {
      wallet.value.balance = null
      wallet.value.balanceRaw = 0n
      wallet.value.balanceSymbol = ''
      return
    }
    try {
      const b = await getBalance(wagmiConfig, { address, chainId: supportedChainId })
      wallet.value.balance       = parseFloat(formatEther(b.value)).toFixed(4)
      wallet.value.balanceRaw    = b.value
      wallet.value.balanceSymbol = b.symbol
    } catch {
      wallet.value.balance = null
      wallet.value.balanceRaw = 0n
      wallet.value.balanceSymbol = ''
    }
  }

  function sync(acc) {
    // wagmi 的 account watcher 有时先于 chain watcher 触发，这里优先吃掉账号快照里的 chainId。
    wallet.value.address     = acc.address ?? null
    wallet.value.chainId     = acc.chainId ?? (acc.isConnected ? wallet.value.chainId : null)
    wallet.value.isConnected = acc.isConnected
    wallet.value.status      = acc.status
    wallet.value.connector   = acc.connector?.name ?? null
    if (acc.isConnected) refreshBalance()
  }

  async function refreshWalletState() {
    // 手动刷新时重新读取 wagmi 快照，避免链切换 watcher 偶发延迟导致页面信息落后。
    sync(getAccount(wagmiConfig))
    await refreshBalance()
  }

  function start() {
    // 每个使用该 composable 的组件只监听自己生命周期内的变化，卸载时会清理 watcher。
    sync(getAccount(wagmiConfig))
    unwatchAcc   = watchAccount(wagmiConfig, { onChange: sync })
    unwatchChain = watchChainId(wagmiConfig, {
      onChange(id) { wallet.value.chainId = id ?? null; refreshBalance() },
    })
  }

  onMounted(start)
  onUnmounted(() => { unwatchAcc?.(); unwatchChain?.() })

  async function connectWallet(connectorId = 'injected') {
    loading.value = true; error.value = ''
    try {
      const list = getConnectors(wagmiConfig)
      // 钱包按钮传入的是语义 id，这里兼容不同 connector 的真实 id 命名。
      const conn = list.find(c => c.id.toLowerCase().includes(connectorId.toLowerCase())) ?? list[0]
      if (!conn) throw new Error('No connector found')
      await connect(wagmiConfig, { connector: conn })
      sync(getAccount(wagmiConfig))
    } catch (e) { error.value = e.shortMessage ?? e.message; throw e }
    finally { loading.value = false }
  }

  async function disconnectWallet() {
    loading.value = true
    try {
      await disconnect(wagmiConfig)
      // 断开后主动清空共享状态，避免下个页面还看到旧链和旧余额。
      wallet.value.address = null
      wallet.value.chainId = null
      wallet.value.isConnected = false
      wallet.value.status = 'disconnected'
      wallet.value.connector = null
      wallet.value.balance = null
      wallet.value.balanceRaw = 0n
      wallet.value.balanceSymbol = ''
    }
    catch (e) { error.value = e.message }
    finally { loading.value = false }
  }

  async function switchNetwork(chainId) {
    loading.value = true; error.value = ''
    try {
      const switched = await switchChain(wagmiConfig, { chainId })
      wallet.value.chainId = switched?.id ?? chainId
      await refreshBalance()
    }
    catch (e) { error.value = e.shortMessage ?? e.message; throw e }
    finally { loading.value = false }
  }

  async function fetchGasPrice() {
    const chainId = getSupportedChainId(wallet.value.chainId)
    if (chainId === null) return null
    try {
      const client = getPublicClient(wagmiConfig, { chainId })
      if (!client) return null
      const gp = await client.getGasPrice()
      return formatGwei(gp)
    } catch { return null }
  }

  async function fetchBlockNumber() {
    const chainId = getSupportedChainId(wallet.value.chainId)
    if (chainId === null) return null
    try {
      const client = getPublicClient(wagmiConfig, { chainId })
      if (!client) return null
      return (await client.getBlockNumber()).toString()
    } catch { return null }
  }

  return {
    wallet, chain, networkState, shortAddr, isSupported, loading, error,
    supportedChains: SUPPORTED_CHAINS,
    connectWallet, disconnectWallet, switchNetwork, refreshBalance, refreshWalletState,
    fetchGasPrice, fetchBlockNumber,
  }
}
