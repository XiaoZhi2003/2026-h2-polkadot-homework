<template>
  <nav class="nav">
    <!-- 标识区 -->
    <div class="nav-logo">
      <div class="logo-mark">
        <span class="dot dot-a"></span>
        <span class="dot dot-b"></span>
        <span class="dot dot-c"></span>
      </div>
      <div class="logo-text">
        <span class="logo-name">DOT</span>
        <span class="logo-sub">EVM DApp</span>
      </div>
    </div>

    <!-- 钱包状态简版入口 -->
    <div class="nav-wallet" @click="showWalletModal = true">
      <div v-if="wallet.isConnected" class="wallet-connected">
        <span class="w-dot"></span>
        <span class="w-addr">{{ shortAddr }}</span>
        <span class="w-bal" v-if="wallet.balance">{{ wallet.balance }} <em>{{ wallet.balanceSymbol }}</em></span>
      </div>
      <div v-else class="wallet-disconnected">
        <span class="w-icon">🔗</span>
        <span>{{ t('wallet.connect') }}</span>
      </div>
    </div>

    <!-- 当前网络 -->
    <div class="nav-network" v-if="wallet.isConnected">
      <div class="net-label">{{ t('wallet.network') }}</div>
      <div class="net-row">
        <span :class="['badge', chain ? 'badge-pink' : 'badge-yellow']">
          {{ networkName }}
        </span>
        <span class="badge" :class="networkKindClass">{{ networkKindLabel }}</span>
      </div>
      <select class="net-select" @change="e => handleSwitchNetwork(+e.target.value)">
        <option value="">{{ t('wallet.switchNetwork') }}</option>
        <option v-for="c in supportedChains" :key="c.id" :value="c.id">
          {{ c.name }}{{ c.testnet ? ' ✦' : '' }}
        </option>
      </select>
    </div>

    <!-- 导航入口 -->
    <div class="nav-links">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-link">
        <span class="nl-icon">{{ item.icon }}</span>
        <span class="nl-label">{{ t(item.labelKey) }}</span>
        <span class="nl-active-bar"></span>
      </RouterLink>
    </div>

    <!-- 底部语言切换 -->
    
    <div class="nav-footer">
      <button class="btn-lang" @click="toggleLang()">
        {{ t('common.switchLang') }}
      </button>
    </div>
    

    <!-- 钱包弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showWalletModal" class="modal-overlay" @click.self="showWalletModal = false">
          <div class="modal-box">
            <div class="modal-head">
              <h3>{{ wallet.isConnected ? t('wallet.connected') : t('wallet.selectWallet') }}</h3>
              <button class="modal-close" @click="showWalletModal = false">✕</button>
            </div>

            <!-- 已连接状态 -->
            <div v-if="wallet.isConnected" class="modal-connected">
              <div class="mc-addr">
                <span class="label">{{ t('wallet.address') }}</span>
                <div class="mc-addr-row">
                  <code class="mono mc-addr-val">{{ wallet.address }}</code>
                  <button class="btn btn-sm btn-ghost" @click="copyAddr">⎘</button>
                </div>
              </div>
              <div class="mc-balance">
                <span class="label">{{ t('wallet.balance') }}</span>
                <span class="mc-bal-val">{{ wallet.balance ?? '—' }} {{ wallet.balanceSymbol }}</span>
              </div>
              <div class="mc-actions">
                <button class="btn btn-secondary" @click="handleRefreshWallet">
                  {{ t('wallet.refresh') }}
                </button>
                <button class="btn btn-danger" @click="handleDisconnect">
                  {{ t('wallet.disconnect') }}
                </button>
              </div>
            </div>

            <!-- 钱包选择列表 -->
            <div v-else class="modal-select">
              <button
                v-for="w in walletOptions"
                :key="w.id"
                class="wallet-option"
                :disabled="loading"
                @click="handleConnect(w.id)"
              >
                <span class="wo-icon">{{ w.icon }}</span>
                <div class="wo-info">
                  <span class="wo-name">{{ w.name }}</span>
                  <span class="wo-desc">{{ w.desc }}</span>
                </div>
                <span class="wo-arrow">→</span>
              </button>
              <p v-if="error" class="modal-error">⚠ {{ error }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { toggleLang } from '@/i18n/index.js'
import { useWallet } from '@/composables/useWallet.js'
import { useToast }  from '@/composables/useToast.js'

const { t }   = useI18n()
const { wallet, chain, networkState, shortAddr, supportedChains, loading, error,
        connectWallet, disconnectWallet, switchNetwork, refreshWalletState } = useWallet()
const { success, error: toastError } = useToast()

const showWalletModal = ref(false)

// 侧边栏是用户判断当前链的第一入口，所以未知链必须明确标出来。
const networkName = computed(() => {
  if (chain.value) return chain.value.name
  if (wallet.value.chainId === null || wallet.value.chainId === undefined) return t('wallet.unknownNetwork')
  return t('wallet.unsupportedNetwork', { id: wallet.value.chainId })
})

// 网络类型必须跟随当前 chainId，不能把未知链误标成主网。
const networkKindLabel = computed(() => {
  if (!networkState.value.isSupported) return t('wallet.unsupported')
  return networkState.value.kind === 'testnet' ? t('dashboard.testnet') : t('dashboard.mainnet')
})

// 徽标颜色和网络类型保持同源，避免文案和颜色表达互相打架。
const networkKindClass = computed(() => {
  if (!networkState.value.isSupported) return 'badge-gray'
  return networkState.value.kind === 'testnet' ? 'badge-yellow' : 'badge-cyan'
})

const navItems = [
  { to: '/',         icon: '◈', labelKey: 'nav.dashboard' },
  { to: '/deploy',   icon: '🚀', labelKey: 'nav.deploy'    },
  { to: '/interact', icon: '⚡', labelKey: 'nav.interact'  },
  { to: '/transfer', icon: '💸', labelKey: 'nav.transfer'  },
]

const walletOptions = [
  { id: 'metaMask',  icon: '🦊', name: 'MetaMask',    desc: 'Most popular EVM wallet'        },
  { id: 'talisman',  icon: '🌐', name: 'Talisman',    desc: 'Polkadot native multi-chain'    },
  { id: 'subwallet', icon: '🔵', name: 'SubWallet',   desc: 'Polkadot & EVM wallet'          },
  { id: 'injected',  icon: '💳', name: 'Other Wallet','desc': 'Any injected browser wallet'  },
]

// 钱包连接完成后关闭弹窗，让用户立刻回到当前页面继续操作。
async function handleConnect(id) {
  try {
    await connectWallet(id)
    success(t('toast.walletConnected'))
    showWalletModal.value = false
  } catch (e) {
    toastError(t('toast.connectFailed', { msg: e.message }))
  }
}

// 断开连接会清理共享钱包状态，弹窗也要同步关闭。
async function handleDisconnect() {
  await disconnectWallet()
  success(t('toast.walletDisconnected'))
  showWalletModal.value = false
}

// 弹窗里的刷新也重新读取钱包快照，避免只刷新余额导致网络信息落后。
async function handleRefreshWallet() {
  await refreshWalletState()
}

// 网络切换只允许选择项目配置过的链，失败时保留钱包原状态给用户重试。
async function handleSwitchNetwork(chainId) {
  if (!chainId) return
  try {
    await switchNetwork(chainId)
    const name = supportedChains.find(c => c.id === chainId)?.name ?? chainId
    success(t('toast.networkSwitched', { name }))
  } catch (e) {
    toastError(e.message)
  }
}

// 复制使用完整地址，界面上的短地址只负责展示。
function copyAddr() {
  navigator.clipboard.writeText(wallet.value.address ?? '')
  success(t('toast.copySuccess'))
}
</script>

<style scoped>
/* 导航外壳 */
.nav {
  width: var(--nav-w);
  min-height: 100vh;
  position: fixed; left: 0; top: 0;
  display: flex; flex-direction: column;
  background: var(--bg-1);
  border-right: 1px solid var(--border);
  padding: 0;
  z-index: 200;
}

/* 标识区 */
.nav-logo {
  display: flex; align-items: center; gap: .8rem;
  padding: 1.2rem 1.2rem 1rem;
  border-bottom: 1px solid var(--border);
}
.logo-mark {
  display: grid; grid-template-columns: 1fr 1fr; gap: 3px;
  width: 28px; height: 28px;
}
.dot {
  border-radius: 50%; display: block;
}
.dot-a { background: var(--pink);  width: 10px; height: 10px; grid-column: 1/2; grid-row: 1; box-shadow: 0 0 8px var(--pink-glow); }
.dot-b { background: var(--cyan);  width: 10px; height: 10px; grid-column: 2/3; grid-row: 1; }
.dot-c { background: var(--pink);  width: 10px; height: 10px; grid-column: 1/3; grid-row: 2; opacity: .45; }
.logo-name { font-size: 1.1rem; font-weight: 800; letter-spacing: .04em; color: var(--t1); line-height: 1; }
.logo-sub  { font-size: .6rem;  color: var(--t3); letter-spacing: .08em; text-transform: uppercase; line-height: 1; }
.logo-text { display: flex; flex-direction: column; gap: 2px; }

/* 钱包简版状态 */
.nav-wallet {
  margin: .8rem .8rem .4rem;
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: var(--r); padding: .7rem .9rem;
  cursor: pointer; transition: border-color .2s;
}
.nav-wallet:hover { border-color: var(--border-h); }
.wallet-connected { display: flex; flex-direction: column; gap: .25rem; }
.w-dot {
  display: inline-block; width: 7px; height: 7px;
  border-radius: 50%; background: var(--cyan);
  box-shadow: 0 0 6px var(--cyan); margin-bottom: .2rem;
}
.w-addr { font-family: var(--font-mono); font-size: .72rem; color: var(--t2); }
.w-bal  { font-size: .85rem; font-weight: 700; color: var(--cyan); }
.w-bal em { font-style: normal; font-size: .68rem; color: var(--t3); margin-left: .2rem; }
.wallet-disconnected {
  display: flex; align-items: center; gap: .5rem;
  font-size: .8rem; color: var(--t2);
}
.w-icon { font-size: 1rem; }

/* 网络切换区 */
.nav-network {
  padding: .5rem .9rem .6rem;
  border-bottom: 1px solid var(--border);
}
.net-label { font-size: .65rem; color: var(--t3); text-transform: uppercase; letter-spacing: .07em; margin-bottom: .35rem; }
.net-row { display: flex; gap: .35rem; flex-wrap: wrap; margin-bottom: .4rem; }
.net-select {
  width: 100%;
  background: var(--bg-3); border: 1px solid var(--border);
  border-radius: var(--r-sm); color: var(--t2);
  font-family: var(--font-mono); font-size: .7rem;
  padding: .35rem .5rem; cursor: pointer; outline: none;
}
.net-select:focus { border-color: var(--pink); }

/* 导航链接 */
.nav-links {
  flex: 1; display: flex; flex-direction: column;
  gap: .15rem; padding: .8rem .6rem 0;
}
.nav-link {
  display: flex; align-items: center; gap: .7rem;
  padding: .6rem .75rem; border-radius: var(--r-sm);
  color: var(--t2); text-decoration: none;
  font-size: .84rem; font-weight: 500;
  position: relative; transition: all .18s;
}
.nav-link:hover { background: var(--bg-3); color: var(--t1); }
.nav-link.router-link-active {
  background: var(--pink-dim); color: var(--pink);
}
.nav-link.router-link-active .nl-active-bar {
  position: absolute; right: 0; top: 20%; bottom: 20%;
  width: 3px; background: var(--pink); border-radius: 2px;
  box-shadow: 0 0 8px var(--pink);
}
.nl-icon  { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }
.nl-label { flex: 1; }
.nav-link-ext { opacity: .6; }

/* 底部操作 */
.nav-footer {
  border-top: 1px solid var(--border);
  padding: .7rem .6rem;
  display: flex; flex-direction: column; gap: .3rem;
}
.btn-lang {
  display: block; width: 100%;
  background: var(--bg-3); border: 1px solid var(--border);
  border-radius: var(--r-sm); color: var(--t2);
  font-family: var(--font-mono); font-size: .72rem;
  padding: .4rem; cursor: pointer; transition: all .18s;
  letter-spacing: .08em;
}
.btn-lang:hover { border-color: var(--pink); color: var(--pink); }

/* 弹窗 */
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,.7); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
}
.modal-box {
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: var(--r-lg); width: min(420px, 95vw);
  box-shadow: 0 32px 80px rgba(0,0,0,.6);
  overflow: hidden;
}
.modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--border);
}
.modal-head h3 { font-size: 1rem; }
.modal-close {
  background: none; border: none; color: var(--t3);
  font-size: 1rem; cursor: pointer;
  transition: color .15s;
}
.modal-close:hover { color: var(--t1); }

/* 已连接状态 */
.modal-connected { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.mc-addr { }
.mc-addr-row { display: flex; align-items: center; gap: .5rem; margin-top: .4rem; }
.mc-addr-val { font-size: .7rem; color: var(--t2); word-break: break-all; flex: 1; }
.mc-balance { display: flex; align-items: center; gap: .7rem; flex-wrap: wrap; }
.mc-balance .label { margin-bottom: 0; }
.mc-bal-val { font-size: 1rem; font-weight: 700; color: var(--cyan); flex: 1; }
.mc-actions { display: flex; gap: .7rem; }

/* 钱包选择 */
.modal-select { padding: 1rem 1.2rem 1.2rem; display: flex; flex-direction: column; gap: .5rem; }
.wallet-option {
  display: flex; align-items: center; gap: .9rem;
  padding: .85rem 1rem; border-radius: var(--r);
  background: var(--bg-3); border: 1px solid var(--border);
  cursor: pointer; transition: all .18s; text-align: left;
}
.wallet-option:hover { border-color: var(--pink); background: var(--pink-dim); }
.wallet-option:disabled { opacity: .4; }
.wo-icon { font-size: 1.4rem; flex-shrink: 0; }
.wo-info { flex: 1; }
.wo-name { display: block; font-size: .88rem; font-weight: 600; color: var(--t1); }
.wo-desc { display: block; font-size: .72rem; color: var(--t3); margin-top: 2px; }
.wo-arrow { color: var(--t3); transition: color .15s; }
.wallet-option:hover .wo-arrow { color: var(--pink); }

.modal-error {
  font-size: .78rem; color: var(--red);
  background: var(--red-dim); border: 1px solid rgba(255,69,96,.2);
  border-radius: var(--r-sm); padding: .6rem .9rem;
}

/* 弹窗过渡 */
.modal-enter-active, .modal-leave-active { transition: all .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box, .modal-leave-to .modal-box {
  transform: scale(.95) translateY(10px);
}

@media (max-width: 768px) {
  .nav {
    bottom: 0; top: auto; right: 0;
    width: 100%; height: 60px;
    flex-direction: row;
    border-right: none; border-top: 1px solid var(--border);
    min-height: unset;
    overflow: hidden;
  }
  .nav-logo, .nav-wallet, .nav-network, .nav-footer { display: none; }
  .nav-links { flex-direction: row; padding: 0; gap: 0; flex: 1; }
  .nav-link {
    flex: 1; flex-direction: column; gap: .15rem;
    justify-content: center; padding: .4rem .2rem;
    font-size: .62rem; border-radius: 0;
  }
  .nl-icon { font-size: .9rem; width: auto; }
  .nav-link.router-link-active .nl-active-bar {
    top: 0; left: 20%; right: 20%; bottom: auto;
    height: 2px; width: auto;
  }
}
</style>
