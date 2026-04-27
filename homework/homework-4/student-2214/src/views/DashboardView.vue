<template>
  <div class="page-inner">
    <!-- 页面头部：未连接时提供一个直接连接入口 -->
    <div class="page-header">
      <div class="header-row">
        <div>
          <h1>{{ t('dashboard.title') }}</h1>
          <p>{{ t('dashboard.subtitle') }}</p>
        </div>
        <button
          v-if="!wallet.isConnected"
          class="btn btn-primary btn-lg"
          :disabled="walletLoading"
          @click="handleConnect"
        >
          🔗 {{ t('wallet.connect') }}
        </button>
        <button
          v-else
          class="btn btn-secondary"
          :disabled="refreshing"
          @click="refreshDashboard"
        >
          {{ t('dashboard.refresh') }}
        </button>
      </div>
    </div>

    <!-- 连接提示：没有钱包状态时保留明确引导 -->
    <div v-if="!wallet.isConnected" class="connect-banner">
      <div class="cb-content">
        <span class="cb-icon">🔗</span>
        <div>
          <div class="cb-title">{{ t('wallet.connectFirst') }}</div>
          <div class="cb-sub">{{ t('wallet.noWallet') }}</div>
        </div>
      </div>
    </div>

    <!-- 钱包已连接后展示链上数据 -->
    <div v-if="wallet.isConnected" class="stats-row">
      <!-- 余额卡片 -->
      <div class="stat-card stat-balance">
        <div class="sc-label">{{ t('wallet.balance') }}</div>
        <div class="sc-value">
          <span class="sc-big">{{ wallet.balance ?? '—' }}</span>
          <span class="sc-unit">{{ wallet.balanceSymbol }}</span>
        </div>
        <div class="sc-sub mono">{{ wallet.address ? shortAddr : '' }}</div>
      </div>

      <!-- 网络卡片 -->
      <div class="stat-card stat-chain">
        <div class="sc-label">{{ t('dashboard.overview') }}</div>
        <div class="sc-chainname">{{ networkName }}</div>
        <div class="sc-meta">
          <span class="badge badge-gray">ID: {{ networkChainId }}</span>
          <span class="badge" :class="networkKindClass">
            {{ networkKindLabel }}
          </span>
        </div>
        <div class="sc-token">{{ chain?.nativeCurrency?.symbol ?? '—' }}</div>
      </div>

      <!-- Gas 与区块高度卡片 -->
      <div class="stat-card stat-gas">
        <div class="sc-label">{{ t('dashboard.gasPrice') }}</div>
        <div class="sc-value">
          <span class="sc-big">{{ gasPrice ?? '—' }}</span>
          <span class="sc-unit" v-if="gasPrice">{{ t('dashboard.gwei') }}</span>
        </div>
        <div class="sc-label" style="margin-top:.7rem">{{ t('dashboard.latestBlock') }}</div>
        <div class="sc-block">{{ blockNumber ?? '—' }}</div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="section-title-row">
      <h2>{{ t('dashboard.quickActions') }}</h2>
    </div>
    <div class="actions-grid">
      <RouterLink to="/deploy" class="action-card ac-deploy">
        <div class="ac-icon">🚀</div>
        <div class="ac-name">{{ t('dashboard.goDeploy') }}</div>
        <div class="ac-desc">{{ t('deploy.subtitle') }}</div>
        <span class="ac-arrow">→</span>
      </RouterLink>
      <RouterLink to="/interact" class="action-card ac-interact">
        <div class="ac-icon">⚡</div>
        <div class="ac-name">{{ t('dashboard.goInteract') }}</div>
        <div class="ac-desc">{{ t('interact.subtitle') }}</div>
        <span class="ac-arrow">→</span>
      </RouterLink>
      <RouterLink to="/transfer" class="action-card ac-transfer">
        <div class="ac-icon">💸</div>
        <div class="ac-name">{{ t('dashboard.goTransfer') }}</div>
        <div class="ac-desc">{{ t('transfer.subtitle') }}</div>
        <span class="ac-arrow">→</span>
      </RouterLink>
    </div>

    <!-- 支持网络列表 -->
    <div class="section-title-row" style="margin-top:2rem">
      <h2>{{ t('dashboard.supported') }}</h2>
    </div>
    <div class="chains-table">
      <div class="ct-head">
        <span>Network</span><span>Chain ID</span><span>Token</span><span>Type</span><span>Explorer</span>
      </div>
      <div
        v-for="c in supportedChains"
        :key="c.id"
        :class="['ct-row', { 'ct-row-active': wallet.chainId === c.id }]"
      >
        <span class="ct-name">
          <span v-if="wallet.chainId === c.id" class="ct-active-dot"></span>
          {{ c.name }}
        </span>
        <span class="mono ct-id">{{ c.id }}</span>
        <span class="ct-token">{{ c.nativeCurrency?.symbol }}</span>
        <span>
          <span class="badge" :class="c.testnet ? 'badge-yellow' : 'badge-cyan'">
            {{ c.testnet ? t('dashboard.testnet') : t('dashboard.mainnet') }}
          </span>
        </span>
        <a
          v-if="c.blockExplorers?.default"
          :href="c.blockExplorers.default.url"
          target="_blank"
          class="ct-link"
        >{{ c.blockExplorers.default.name }} ↗</a>
        <span v-else class="ct-na">—</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWallet } from '@/composables/useWallet.js'
import { useToast } from '@/composables/useToast.js'

const { t } = useI18n()
const {
  wallet, chain, networkState, shortAddr, supportedChains, loading: walletLoading,
  connectWallet, refreshWalletState, fetchGasPrice, fetchBlockNumber,
} = useWallet()
const { success, error: toastError } = useToast()

const gasPrice   = ref(null)
const blockNumber = ref(null)
const refreshing = ref(false)

// 网络名和类型只从当前 chainId 推导，空值或未知链都不能被当成主网。
const networkName = computed(() => {
  if (chain.value) return chain.value.name
  if (wallet.value.chainId === null || wallet.value.chainId === undefined) return t('wallet.unknownNetwork')
  return t('wallet.unsupportedNetwork', { id: wallet.value.chainId })
})

// 链 ID 空值用占位符展示，避免页面出现 null 这类内部状态。
const networkChainId = computed(() => networkState.value.chainId ?? '—')

// 网络类型只在支持链里展示测试网或主网，未知链统一提示不支持。
const networkKindLabel = computed(() => {
  if (!networkState.value.isSupported) return t('wallet.unsupported')
  return networkState.value.kind === 'testnet' ? t('dashboard.testnet') : t('dashboard.mainnet')
})

// 徽标颜色和网络类型共用同一份状态，避免误导用户。
const networkKindClass = computed(() => {
  if (!networkState.value.isSupported) return 'badge-gray'
  return networkState.value.kind === 'testnet' ? 'badge-yellow' : 'badge-cyan'
})

// 刷新链上统计时先清空旧值，防止网络切换后短暂显示上一条链的数据。
async function fetchStats() {
  // 不支持的链直接清空链上统计，避免沿用上一次或默认链的 GAS/区块数据。
  gasPrice.value = null
  blockNumber.value = null
  if (!wallet.value.isConnected || !networkState.value.isSupported) return
  ;[gasPrice.value, blockNumber.value] = await Promise.all([fetchGasPrice(), fetchBlockNumber()])
}

// 仪表盘手动刷新要同步钱包快照、余额和链上统计，避免只刷新局部数据。
async function refreshDashboard() {
  refreshing.value = true
  try {
    await refreshWalletState()
    await fetchStats()
  } finally {
    refreshing.value = false
  }
}

// 仪表盘的快捷连接只使用注入钱包，具体钱包类型交给浏览器注入层识别。
async function handleConnect() {
  try {
    await connectWallet('injected')
    success(t('toast.walletConnected'))
    await refreshDashboard()
  } catch (e) {
    toastError(t('toast.connectFailed', { msg: e.message }))
  }
}

onMounted(fetchStats)
watch(() => [wallet.value.isConnected, wallet.value.chainId], fetchStats)
</script>

<style scoped>
/* 提示横幅 */
.connect-banner {
  background: var(--pink-dim); border: 1px solid rgba(230,0,122,.25);
  border-radius: var(--r-lg); padding: 1.2rem 1.5rem; margin-bottom: 1.5rem;
}
.cb-content { display: flex; align-items: flex-start; gap: 1rem; }
.cb-icon { font-size: 1.6rem; }
.cb-title { font-size: .95rem; font-weight: 600; color: var(--t1); margin-bottom: .2rem; }
.cb-sub   { font-size: .8rem; color: var(--t2); }

/* 链上状态卡片 */
.stats-row {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem; margin-bottom: 2rem;
}
.stat-card {
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: var(--r-lg); padding: 1.3rem 1.4rem;
  position: relative; overflow: hidden;
  transition: border-color .2s;
}
.stat-card:hover { border-color: rgba(255,255,255,.12); }
.stat-balance { border-color: rgba(0,212,170,.2); }
.sc-label   { font-size: .68rem; color: var(--t3); text-transform: uppercase; letter-spacing: .07em; margin-bottom: .5rem; }
.sc-value   { display: flex; align-items: baseline; gap: .4rem; margin-bottom: .5rem; }
.sc-big     { font-size: 1.8rem; font-weight: 800; color: var(--cyan); line-height: 1; }
.sc-unit    { font-size: .8rem; color: var(--t3); }
.sc-sub     { font-size: .7rem; color: var(--t3); word-break: break-all; }
.sc-chainname { font-size: 1.2rem; font-weight: 700; color: var(--t1); margin-bottom: .6rem; }
.sc-meta    { display: flex; gap: .4rem; flex-wrap: wrap; margin-bottom: .6rem; }
.sc-token   { font-size: 2rem; font-weight: 800; color: var(--pink); }
.sc-block   { font-family: var(--font-mono); font-size: 1.2rem; font-weight: 700; color: var(--yellow); }

/* 区块标题 */
.section-title-row { display: flex; align-items: center; gap: .8rem; margin-bottom: 1rem; }
.section-title-row::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* 快捷操作卡片 */
.actions-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem; margin-bottom: .5rem;
}
.action-card {
  display: flex; flex-direction: column; gap: .4rem;
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: var(--r-lg); padding: 1.4rem;
  text-decoration: none; cursor: pointer;
  transition: all .2s; position: relative; overflow: hidden;
}
.action-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.35); }
.ac-deploy:hover   { border-color: rgba(230,0,122,.45); box-shadow: 0 8px 28px var(--pink-glow); }
.ac-interact:hover { border-color: rgba(0,212,170,.35); }
.ac-transfer:hover { border-color: rgba(245,197,24,.3); }
.ac-icon { font-size: 1.8rem; margin-bottom: .3rem; }
.ac-name { font-size: 1rem; font-weight: 700; color: var(--t1); }
.ac-desc { font-size: .76rem; color: var(--t3); line-height: 1.5; flex: 1; }
.ac-arrow {
  position: absolute; right: 1.2rem; bottom: 1.2rem;
  font-size: 1.1rem; color: var(--t3);
  transition: transform .2s;
}
.action-card:hover .ac-arrow { transform: translateX(4px); color: var(--t1); }

/* 支持网络表格 */
.chains-table {
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: var(--r-lg); overflow: hidden;
}
.ct-head, .ct-row {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: .5rem; padding: .7rem 1.2rem; align-items: center;
}
.ct-head {
  background: var(--bg-3); font-size: .68rem;
  color: var(--t3); text-transform: uppercase; letter-spacing: .07em;
}
.ct-row { border-top: 1px solid var(--border); font-size: .82rem; transition: background .15s; }
.ct-row:hover { background: var(--bg-3); }
.ct-row-active { background: var(--pink-dim) !important; }
.ct-name { display: flex; align-items: center; gap: .5rem; font-weight: 600; color: var(--t1); }
.ct-active-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--pink); box-shadow: 0 0 6px var(--pink); flex-shrink: 0;
}
.ct-id    { color: var(--t2); }
.ct-token { font-weight: 700; color: var(--cyan); }
.ct-link  { color: var(--pink); font-size: .75rem; text-decoration: none; }
.ct-link:hover { text-decoration: underline; }
.ct-na    { color: var(--t4); }

@media (max-width: 600px) {
  .ct-head, .ct-row { grid-template-columns: 1fr 1fr; }
  .ct-head span:nth-child(n+3),
  .ct-row span:nth-child(n+3) { display: none; }
}
</style>
