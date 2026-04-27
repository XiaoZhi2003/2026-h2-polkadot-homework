<template>
  <div class="page-inner">
    <div class="page-header">
      <div class="header-row">
        <div>
          <h1>{{ t('deploy.title') }}</h1>
          <p>{{ t('deploy.subtitle') }}</p>
        </div>
        <a href="https://faucet.polkadot.io/" target="_blank" class="btn btn-secondary">
          🚰 {{ t('deploy.faucet') }}
        </a>
      </div>
    </div>

    <div class="deploy-layout">
      <!-- 合约信息和部署表单 -->
      <div class="deploy-main">
        <div class="card glow contract-card">
          <div class="card-head">
            <div class="card-title"><span class="card-icon">📋</span> {{ t('deploy.contractInfo') }}</div>
            <span class="badge badge-purple">Solidity 0.8.20</span>
          </div>

          <div class="ci-grid">
            <div class="ci-item">
              <div class="ci-label">{{ t('deploy.contractName') }}</div>
              <div class="ci-val">BKCERC1363Token</div>
            </div>
            <div class="ci-item">
              <div class="ci-label">Constructor Args</div>
              <div class="ci-val mono">name, symbol, initialSupply, owner</div>
            </div>
          </div>

          <!-- 函数列表 -->
          <div class="fn-list">
            <div class="fn-head">{{ t('deploy.functions') }}</div>
            <div v-for="fn in functions" :key="fn.key" class="fn-item">
              <span :class="['badge', badgeClassFor(fn.type)]">
                {{ fn.type }}
              </span>
              <span class="fn-sig mono">{{ fn.sig }}</span>
              <span class="fn-desc">{{ fn.desc }}</span>
            </div>
          </div>

          <!-- 构造参数输入 -->
          <div class="divider"></div>
          <div class="field">
            <label class="label">Token Name</label>
            <input v-model="tokenName" class="input" placeholder="BKC Token" />
          </div>
          <div class="field">
            <label class="label">Token Symbol</label>
            <input v-model="tokenSymbol" class="input" placeholder="BKC" />
          </div>
          <div class="field">
            <label class="label">Initial Supply <span style="color:var(--t3)">(whole tokens; contract applies 18 decimals)</span></label>
            <input v-model="initialSupply" type="number" min="0" step="1" class="input" placeholder="1000000" />
          </div>
          <div class="field">
            <label class="label">Owner <span style="color:var(--t3)">(blank uses current wallet)</span></label>
            <input v-model="ownerAddress" class="input monoinput" :placeholder="wallet.address || '0x…'" />
          </div>

          <!-- 部署按钮 -->
          <button
            class="btn btn-primary btn-full btn-lg"
            :disabled="!canDeploy || loading"
            @click="handleDeploy"
          >
            <span v-if="loading" class="spinner"></span>
            <span>{{ loading ? t('deploy.deploying') : t('deploy.deployBtn') }}</span>
          </button>
          <p v-if="!wallet.isConnected" class="connect-warn">⚠ {{ t('wallet.connectFirst') }}</p>

          <!-- 交易状态 -->
          <Transition name="slide-up">
            <div v-if="loading && txHash" class="tx-status pending" style="margin-top:.8rem">
              <span class="spinner"></span>
              <div>
                <div>{{ t('deploy.deploying') }}</div>
                <a :href="getTxUrl(txHash)" target="_blank" class="mono tx-link">{{ txHash }}</a>
              </div>
            </div>
          </Transition>
        </div>

      </div>

      <!-- 源码预览：和合约信息卡片同宽，避免右侧窄栏压缩代码展示。 -->
      <div class="deploy-side">
        <div class="card source-card">
          <div class="card-head">
            <div class="card-title"><span>📄</span> {{ t('deploy.sourceCode') }}</div>
          </div>
          <pre class="code-block">{{ BKC_TOKEN_SOURCE }}</pre>
        </div>

      </div>

      <!-- 部署结果 -->
      <div class="deploy-results">
        <Transition name="slide-up">
          <div v-if="deployResult" class="card result-card">
            <div class="card-head">
              <div class="card-title"><span>✅</span> {{ t('deploy.result') }}</div>
              <RouterLink to="/interact" class="btn btn-cyan btn-sm">
                {{ t('deploy.useInInteract') }}
              </RouterLink>
            </div>

            <div class="result-grid">
              <div class="rg-item rg-addr">
                <div class="rg-label">{{ t('deploy.contractAddr') }}</div>
                <div class="rg-val-row">
                  <code class="rg-addr-val mono">{{ deployResult.contractAddress }}</code>
                  <button class="btn btn-sm btn-ghost" @click="copyText(deployResult.contractAddress)">⎘</button>
                  <a :href="getAddrUrl(deployResult.contractAddress)" target="_blank" class="btn btn-sm btn-ghost">↗</a>
                </div>
              </div>
              <div class="rg-item">
                <div class="rg-label">{{ t('deploy.txHash') }}</div>
                <a :href="getTxUrl(deployResult.hash)" target="_blank" class="rg-hash mono">
                  {{ deployResult.hash }}
                </a>
              </div>
              <div class="rg-cols">
                <div class="rg-item">
                  <div class="rg-label">{{ t('deploy.blockNumber') }}</div>
                  <div class="rg-val">{{ deployResult.receipt?.blockNumber?.toString() }}</div>
                </div>
                <div class="rg-item">
                  <div class="rg-label">{{ t('deploy.gasUsed') }}</div>
                  <div class="rg-val">{{ deployResult.receipt?.gasUsed?.toString() }}</div>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- 错误提示 -->
        <Transition name="fade">
          <div v-if="error" class="error-box">⚠ {{ error }}</div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { isAddress } from 'viem'
import { useWallet } from '@/composables/useWallet.js'
import { useContract } from '@/composables/useContract.js'
import { useToast }    from '@/composables/useToast.js'
import { BKC_TOKEN_ABI, BKC_TOKEN_BYTECODE, BKC_TOKEN_SOURCE, getExplorerTxUrl, getExplorerAddrUrl } from '@/wagmi.config.js'
import { listContractFunctions } from '@/contractFunctions.js'

const { t } = useI18n()
const { wallet, isSupported } = useWallet()
const { deploy, loading, txHash, error } = useContract()
const { success, error: toastError } = useToast()

const tokenName = ref('BKC Token')
const tokenSymbol = ref('BKC')
const initialSupply = ref('1000000')
const ownerAddress = ref('')
const deployResult = ref(null)

// 函数列表直接从 ABI 生成，避免合约新增方法或重载方法后页面漏展示。
const functions = computed(() => listContractFunctions(BKC_TOKEN_ABI))

// owner 留空时默认使用当前钱包地址，减少部署前重复复制地址。
const ownerForDeploy = computed(() => ownerAddress.value.trim() || wallet.value.address || '')

// 初始供应量是构造函数里的整币数量，只允许非负整数。
const validInitialSupply = computed(() => /^\d+$/.test(initialSupply.value || '0'))

// 部署交易只允许发到项目配置过的链，避免钱包在其他链时误部署。
const canDeploy = computed(() =>
  wallet.value.isConnected &&
  isSupported.value &&
  tokenName.value.trim() &&
  tokenSymbol.value.trim() &&
  validInitialSupply.value &&
  isAddress(ownerForDeploy.value)
)

// 不同方法类型用不同颜色，用户扫一眼就能区分读、写和 owner 操作。
function badgeClassFor(type) {
  if (type === 'view') return 'badge-cyan'
  if (type === 'owner') return 'badge-yellow'
  return 'badge-pink'
}

// 部署前清空旧结果，避免用户把上一次合约地址误当成这次部署结果。
async function handleDeploy() {
  try {
    deployResult.value = null
    const result = await deploy(BKC_TOKEN_ABI, BKC_TOKEN_BYTECODE, [
      tokenName.value.trim(),
      tokenSymbol.value.trim(),
      BigInt(initialSupply.value || '0'),
      ownerForDeploy.value,
    ])
    deployResult.value = result
    success(t('toast.deploySuccess', { addr: result.contractAddress?.slice(0, 10) + '…' }))
  } catch (e) {
    toastError(t('toast.txFailed', { msg: e.message }))
  }
}

// 浏览器链接必须跟随当前链，未知链时返回占位链接避免跳错浏览器。
const getTxUrl   = (h)    => getExplorerTxUrl(wallet.value.chainId, h) ?? '#'

// 合约地址浏览器链接也按当前链生成，和交易链接保持一致。
const getAddrUrl = (addr) => getExplorerAddrUrl(wallet.value.chainId, addr) ?? '#'

// 复制部署结果时只处理明确传入的文本，避免读到页面上的截断展示值。
function copyText(text) {
  navigator.clipboard.writeText(text)
  success(t('toast.copySuccess'))
}
</script>

<style scoped>
.deploy-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(420px, .92fr);
  grid-template-areas:
    "main side"
    "results results";
  gap: 1.2rem;
  align-items: stretch;
}
.deploy-main,
.deploy-side,
.deploy-results {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
}
.deploy-main { grid-area: main; }
.deploy-side { grid-area: side; min-width: 0; }
.deploy-results { grid-area: results; }
.deploy-results { gap: 1rem; }

/* 源码卡片和合约信息卡片并排等高，右侧宽度略小一点，长代码在内部滚动。 */
.contract-card {
  height: 100%;
}
.source-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
}
.source-card .code-block {
  flex: 1 1 0;
  width: 100%;
  height: 0;
  min-height: 0;
  max-height: none;
  overflow: auto;
}

/* 合约信息 */
.ci-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; margin-bottom: 1.2rem;
}
.ci-item { background: var(--bg-3); border: 1px solid var(--border); border-radius: var(--r); padding: .8rem; }
.ci-label { font-size: .65rem; color: var(--t3); text-transform: uppercase; letter-spacing: .07em; margin-bottom: .3rem; }
.ci-val   { font-size: .9rem; font-weight: 600; color: var(--t1); }
.ci-val.mono { font-family: var(--font-mono); font-size: .78rem; color: var(--cyan); }

/* 函数列表 */
.fn-list { margin-bottom: 1.2rem; }
.fn-head { font-size: .68rem; color: var(--t3); text-transform: uppercase; letter-spacing: .07em; margin-bottom: .5rem; }
.fn-item {
  display: flex; align-items: center; gap: .7rem;
  padding: .45rem .6rem; border-radius: var(--r-sm);
  transition: background .15s;
}
.fn-item:hover { background: var(--bg-3); }
.fn-sig  { font-family: var(--font-mono); font-size: .75rem; color: var(--t2); flex: 1; }
.fn-desc { font-size: .72rem; color: var(--t3); }

.connect-warn { font-size: .76rem; color: var(--yellow); text-align: center; margin-top: .6rem; }
.tx-link { font-family: var(--font-mono); font-size: .7rem; color: var(--cyan); word-break: break-all; display: block; margin-top: .2rem; }

/* 部署结果 */
.result-card { border-color: rgba(0,212,170,.25); }
.result-grid { display: flex; flex-direction: column; gap: .9rem; }
.rg-item {}
.rg-label { font-size: .68rem; color: var(--t3); text-transform: uppercase; letter-spacing: .07em; margin-bottom: .3rem; }
.rg-addr { background: var(--bg-3); border: 1px solid var(--border); border-radius: var(--r); padding: .9rem; }
.rg-val-row { display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
.rg-addr-val { font-size: .72rem; color: var(--cyan); word-break: break-all; flex: 1; min-width: 0; }
.rg-hash { font-family: var(--font-mono); font-size: .72rem; color: var(--pink); word-break: break-all; text-decoration: none; }
.rg-hash:hover { text-decoration: underline; }
.rg-cols { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; }
.rg-val  { font-family: var(--font-mono); font-size: .82rem; color: var(--t1); font-weight: 600; }

/* 错误提示 */
.error-box {
  font-size: .8rem; color: var(--red); background: var(--red-dim);
  border: 1px solid rgba(255,69,96,.25); border-radius: var(--r); padding: .85rem 1rem;
}

@media (max-width: 980px) {
  .deploy-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "main"
      "side"
      "results";
  }

  .source-card {
    height: auto;
  }

  .source-card .code-block {
    max-height: 520px;
  }
}
</style>
