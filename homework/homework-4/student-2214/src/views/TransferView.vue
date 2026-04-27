<template>
  <div class="page-inner">
    <div class="page-header">
      <div class="header-row">
        <div><h1>{{ t('transfer.title') }}</h1><p>{{ t('transfer.subtitle') }}</p></div>
      </div>
    </div>

    <div class="transfer-layout">
      <!-- 转账表单 -->
      <div class="card main-card">
        <div class="card-head">
          <div class="card-title"><span>💸</span> {{ t('transfer.title') }}</div>
          <div class="avail-bal" v-if="wallet.balance">
            <span class="label" style="margin:0">{{ t('transfer.availBal') }}:</span>
            <span class="bal-val">{{ wallet.balance }} {{ wallet.balanceSymbol }}</span>
          </div>
        </div>

        <!-- 接收地址 -->
        <div class="field">
          <label class="label">{{ t('transfer.to') }}</label>
          <input v-model="toAddr" class="input monoinput" :placeholder="t('transfer.toPlaceholder')" />
          <div v-if="toAddr && !validAddr" class="field-error">⚠ {{ t('transfer.invalidAddress') }}</div>
        </div>

        <!-- 转账金额 -->
        <div class="field">
          <label class="label">
            {{ t('transfer.amount') }}
            <span class="label-hint">{{ t('transfer.amountHint', { symbol: wallet.balanceSymbol || 'PAS' }) }}</span>
          </label>
          <div class="amount-row">
            <input v-model="amount" type="number" min="0" step="0.001" class="input" placeholder="0.01" />
            <button class="btn btn-ghost btn-sm" @click="setMax">MAX</button>
          </div>
        </div>

        <!-- Gas 预估 -->
        <div class="gas-row" v-if="gasEst !== null">
          <span class="gas-label">{{ t('transfer.gasEstimate') }}</span>
          <span class="gas-val mono">{{ gasEst }} {{ t('transfer.gasWei') }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="action-row">
          <button
            class="btn btn-secondary"
            :disabled="!canSend || loading"
            @click="handleEstimate"
          >
            {{ t('transfer.estimateGas') }}
          </button>
          <button
            class="btn btn-primary btn-lg"
            :disabled="!canSend || loading || !amount"
            @click="handleSend"
          >
            <span v-if="loading" class="spinner"></span>
            {{ loading ? t('transfer.sending') : t('transfer.send') }}
          </button>
        </div>

        <!-- 待确认状态 -->
        <Transition name="slide-up">
          <div v-if="loading && txHash" class="tx-status pending" style="margin-top:.9rem">
            <span class="spinner"></span>
            <div>
              <div>{{ t('transfer.pendingConfirm') }}</div>
              <a :href="getTxUrl(txHash)" target="_blank" class="link-hash mono">{{ txHash }}</a>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 交易结果卡片 -->
      <Transition name="slide-up">
        <div v-if="txReceipt" class="card result-card">
          <div class="card-head">
            <div class="card-title"><span>✅</span> {{ t('transfer.result') }}</div>
            <span :class="['badge', txReceipt.status === 'success' ? 'badge-cyan' : 'badge-red']">
              {{ txReceipt.status }}
            </span>
          </div>

          <div class="result-rows">
            <div class="rr-item">
              <div class="rr-label">{{ t('transfer.txHash') }}</div>
              <a :href="getTxUrl(txHash)" target="_blank" class="rr-hash mono">{{ txHash }}</a>
            </div>
            <div class="rr-cols">
              <div class="rr-item">
                <div class="rr-label">{{ t('transfer.blockNumber') }}</div>
                <div class="rr-val">{{ txReceipt.blockNumber?.toString() }}</div>
              </div>
              <div class="rr-item">
                <div class="rr-label">{{ t('transfer.gasUsed') }}</div>
                <div class="rr-val">{{ txReceipt.gasUsed?.toString() }}</div>
              </div>
            </div>
            <!-- 转账摘要 -->
            <div class="tx-summary">
              <span class="ts-from mono">{{ shortAddr }}</span>
              <span class="ts-arrow">→</span>
              <span class="ts-to mono">{{ toAddr?.slice(0,10) }}…{{ toAddr?.slice(-8) }}</span>
              <span class="ts-amount">{{ amount }} {{ wallet.balanceSymbol }}</span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- 错误提示 -->
      <Transition name="fade">
        <div v-if="error" class="error-box">⚠ {{ error }}</div>
      </Transition>

      <!-- 说明卡片 -->
      <div class="card info-side">
        <div class="card-title" style="margin-bottom:1rem"><span>ℹ</span> {{ t('transfer.infoTitle') }}</div>
        <ul class="info-ul">
          <li>{{ t('transfer.infoNative', { symbol: wallet.balanceSymbol || 'PAS' }) }}</li>
          <li>{{ t('transfer.infoConfirm') }}</li>
          <li>{{ t('transfer.infoGas') }}</li>
          <li>{{ t('transfer.infoNetwork') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { estimateGas } from '@wagmi/core'
import { isAddress, parseEther } from 'viem'
import { wagmiConfig, getExplorerTxUrl } from '@/wagmi.config.js'
import { requireSupportedChainId } from '@/networkState.js'
import { useI18n }     from 'vue-i18n'
import { useWallet }   from '@/composables/useWallet.js'
import { useContract } from '@/composables/useContract.js'
import { useToast }    from '@/composables/useToast.js'

const { t } = useI18n()
const { wallet, shortAddr, isSupported, refreshBalance } = useWallet()
const { sendNative, loading, txHash, receipt: txReceipt, error } = useContract()
const { success, error: toastError } = useToast()

const toAddr = ref('')
const amount = ref('')
const gasEst = ref(null)

// 地址输入为空时不立刻报错，避免用户刚开始输入就看到错误状态。
const validAddr = computed(() => toAddr.value.length === 0 || isAddress(toAddr.value))

// 转账和 Gas 预估都依赖真实 chainId，未知链不开放操作。
const canSend   = computed(() =>
  wallet.value.isConnected &&
  isSupported.value &&
  isAddress(toAddr.value) &&
  Number(amount.value) > 0
)

// MAX 使用页面已缓存余额，真正发送时钱包仍会按链上余额校验。
function setMax() {
  if (wallet.value.balance) amount.value = wallet.value.balance
}

// 预估 Gas 前再次确认支持链，防止 wagmi 回落到默认链给出假结果。
async function handleEstimate() {
  if (!canSend.value) return
  try {
    const chainId = requireSupportedChainId(wallet.value.chainId)
    const gas = await estimateGas(wagmiConfig, {
      to: toAddr.value, value: parseEther(amount.value),
      chainId,
    })
    gasEst.value = gas.toString()
  } catch (e) { toastError(e.message) }
}

// 转账成功后刷新余额，保证用户看到的是交易后的余额。
async function handleSend() {
  try {
    await sendNative(toAddr.value, amount.value)
    success(t('transfer.success'))
    await refreshBalance()
  } catch (e) {
    toastError(t('toast.txFailed', { msg: e.message }))
  }
}

// 交易链接只从当前链配置生成，避免不同网络的浏览器地址混用。
const getTxUrl = (h) => getExplorerTxUrl(wallet.value.chainId, h) ?? '#'
</script>

<style scoped>
.transfer-layout {
  display: flex; flex-direction: column; gap: 1rem;
  max-width: 620px; margin: 0 auto;
}
.main-card { padding: 1.6rem; }

.avail-bal { display: flex; align-items: center; gap: .5rem; }
.bal-val   { font-size: .88rem; font-weight: 700; color: var(--cyan); }

.label-hint { font-size: .65rem; color: var(--t3); text-transform: none; letter-spacing: 0; margin-left: .4rem; }
.field-error { font-size: .72rem; color: var(--red); margin-top: .3rem; }

.amount-row { display: flex; gap: .5rem; align-items: stretch; }
.amount-row .input { flex: 1; }

.gas-row {
  display: flex; align-items: center; gap: .7rem;
  background: var(--bg-3); border: 1px solid var(--border);
  border-radius: var(--r-sm); padding: .6rem .9rem;
  margin-bottom: .8rem; font-size: .8rem;
}
.gas-label { color: var(--t2); }
.gas-val   { color: var(--yellow); font-size: .8rem; }

.action-row { display: flex; gap: .7rem; margin-top: .3rem; }
.action-row .btn-primary { flex: 1; }

.link-hash {
  display: block; font-size: .7rem; color: var(--cyan); word-break: break-all; margin-top: .3rem; text-decoration: none;
}

/* 交易结果 */
.result-card { border-color: rgba(0,212,170,.25); }
.result-rows { display: flex; flex-direction: column; gap: .9rem; }
.rr-item {}
.rr-label { font-size: .68rem; color: var(--t3); text-transform: uppercase; letter-spacing: .07em; margin-bottom: .3rem; }
.rr-hash {
  display: block; font-size: .72rem; color: var(--pink); word-break: break-all; text-decoration: none;
}
.rr-hash:hover { text-decoration: underline; }
.rr-cols { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; }
.rr-val  { font-family: var(--font-mono); font-size: .85rem; font-weight: 700; color: var(--t1); }

.tx-summary {
  display: flex; align-items: center; gap: .7rem; flex-wrap: wrap;
  background: var(--bg-3); border: 1px solid var(--border);
  border-radius: var(--r-sm); padding: .75rem 1rem;
}
.ts-from, .ts-to { font-size: .76rem; color: var(--t2); }
.ts-arrow { color: var(--pink); font-size: 1rem; }
.ts-amount { margin-left: auto; font-size: .9rem; font-weight: 700; color: var(--cyan); }

/* 错误提示 */
.error-box {
  font-size: .8rem; color: var(--red); background: var(--red-dim);
  border: 1px solid rgba(255,69,96,.25); border-radius: var(--r); padding: .85rem 1rem;
}

/* 说明卡片 */
.info-side { border-color: var(--border); }
.info-ul { list-style: none; display: flex; flex-direction: column; gap: .5rem; padding: 0; }
.info-ul li {
  padding: .45rem .75rem;
  background: var(--bg-3); border-radius: var(--r-sm);
  font-size: .8rem; color: var(--t2);
  display: flex; align-items: flex-start; gap: .5rem;
}
.info-ul li::before { content: '•'; color: var(--pink); flex-shrink: 0; }
</style>
