import { ref } from 'vue'
import {
  readContract, writeContract, waitForTransactionReceipt,
  deployContract, sendTransaction, getPublicClient,
} from '@wagmi/core'
import { decodeEventLog, parseEther } from 'viem'
import { wagmiConfig } from '@/wagmi.config.js'
import { wallet } from '@/composables/useWallet.js'
import { requireSupportedChainId } from '@/networkState.js'

// 合约读写共用这一层，页面只负责准备 ABI、参数和展示结果。
export const useContract = () => {
  const loading   = ref(false)
  const txHash    = ref(null)
  const receipt   = ref(null)
  const error     = ref('')
  const logs      = ref([])

  function reset() { txHash.value = null; receipt.value = null; error.value = ''; logs.value = [] }

  // 读操作不需要钱包签名，但这里仍按当前链 ID 读；未知链直接报错，避免读到默认链。
  async function read(address, abi, fn, args = []) {
    loading.value = true; error.value = ''
    try {
      const chainId = requireSupportedChainId(wallet.value.chainId)
      return await readContract(wagmiConfig, {
        address, abi, functionName: fn, args,
        chainId,
      })
    } catch (e) { error.value = e.shortMessage ?? e.message; throw e }
    finally { loading.value = false }
  }

  // 写操作统一等待 receipt，页面拿到结果后就能展示交易哈希、Gas 和事件。
  async function write(address, abi, fn, args = [], value) {
    reset(); loading.value = true
    try {
      const chainId = requireSupportedChainId(wallet.value.chainId)
      const hash = await writeContract(wagmiConfig, {
        address, abi, functionName: fn, args,
        chainId,
        ...(value !== undefined ? { value } : {}),
      })
      txHash.value = hash
      const rec = await waitForTransactionReceipt(wagmiConfig, { hash, chainId })
      receipt.value = rec
      // ABI 能解出来的日志才展示，避免其他合约日志把页面打崩。
      if (abi && rec.logs?.length) {
        logs.value = rec.logs.flatMap(log => {
          try {
            const d = decodeEventLog({ abi, data: log.data, topics: log.topics })
            return [{ ...d, address: log.address, blockNumber: rec.blockNumber, txHash: hash }]
          } catch { return [] }
        })
      }
      return { hash, receipt: rec }
    } catch (e) { error.value = e.shortMessage ?? e.message; throw e }
    finally { loading.value = false }
  }

  // 部署合约也按交易处理，返回 contractAddress 给部署页跳转交互。
  async function deploy(abi, bytecode, args = []) {
    reset(); loading.value = true
    try {
      const chainId = requireSupportedChainId(wallet.value.chainId)
      const hash = await deployContract(wagmiConfig, {
        abi, bytecode, args, chainId,
      })
      txHash.value = hash
      const rec = await waitForTransactionReceipt(wagmiConfig, { hash, chainId })
      receipt.value = rec
      return { hash, receipt: rec, contractAddress: rec.contractAddress }
    } catch (e) { error.value = e.shortMessage ?? e.message; throw e }
    finally { loading.value = false }
  }

  // 原生代币转账和合约写入分开，避免把 value 参数误传给普通合约调用。
  async function sendNative(to, amount) {
    reset(); loading.value = true
    try {
      const chainId = requireSupportedChainId(wallet.value.chainId)
      const hash = await sendTransaction(wagmiConfig, {
        to, value: parseEther(amount), chainId,
      })
      txHash.value = hash
      const rec = await waitForTransactionReceipt(wagmiConfig, { hash, chainId })
      receipt.value = rec
      return { hash, receipt: rec }
    } catch (e) { error.value = e.shortMessage ?? e.message; throw e }
    finally { loading.value = false }
  }

  // 事件查询从页面指定的起始区块开始，失败时返回空数组让 UI 保持可用。
  async function fetchEvents(address, abi, eventName, fromBlock = 0n) {
    loading.value = true; error.value = ''
    try {
      const chainId = requireSupportedChainId(wallet.value.chainId)
      const client = getPublicClient(wagmiConfig, { chainId })
      if (!client) throw new Error('Unsupported network')
      const ev = abi.find(i => i.type === 'event' && i.name === eventName)
      if (!ev) throw new Error(`Event ${eventName} not found in ABI`)
      const raw = await client.getLogs({ address, event: ev, fromBlock, toBlock: 'latest' })
      return raw.map(log => {
        try {
          const d = decodeEventLog({ abi, data: log.data, topics: log.topics })
          return { ...d, blockNumber: log.blockNumber, txHash: log.transactionHash }
        } catch { return { blockNumber: log.blockNumber, txHash: log.transactionHash, eventName } }
      })
    } catch (e) { error.value = e.message; return [] }
    finally { loading.value = false }
  }

  return {
    loading, txHash, receipt, error, logs,
    read, write, deploy, sendNative, fetchEvents, reset,
  }
}
