<template>
  <div class="page-inner">
    <div class="page-header">
      <div class="header-row">
        <div><h1>{{ t('interact.title') }}</h1><p>{{ t('interact.subtitle') }}</p></div>
      </div>
    </div>

    <!-- 合约地址输入栏 -->
    <div class="addr-bar card">
      <div class="ab-left">
        <span class="ab-icon">🪙</span>
        <div class="field" style="margin:0; flex:1">
          <label class="label">{{ t('interact.contractAddr') }}</label>
          <input
            v-model="contractAddr"
            class="input monoinput"
            :placeholder="t('interact.addrPlaceholder')"
          />
        </div>
      </div>
      <button
        class="btn btn-primary"
        :disabled="!canInteract || readLoading"
        @click="handleLoad"
      >
        {{ t('interact.loadContract') }}
      </button>
    </div>

    <div v-if="!wallet.isConnected" class="warn-banner">
      ⚠ {{ t('wallet.connectFirst') }}
    </div>

    <div v-if="loaded" class="interact-grid">
      <!-- 读取代币状态 -->
      <div class="card section-card">
        <div class="card-head">
          <div class="card-title">{{ t('interact.readSection') }}</div>
          <button class="btn btn-sm btn-ghost" :disabled="readLoading" @click="refreshAll">
            <span v-if="readLoading" class="spinner"></span>
            {{ t('interact.refreshAll') }}
          </button>
        </div>

        <div class="info-panels">
          <div class="info-panel">
            <div class="ip-label">name</div>
            <div class="ip-value ip-str">{{ token.name || '—' }}</div>
          </div>
          <div class="info-panel">
            <div class="ip-label">symbol</div>
            <div class="ip-value">{{ token.symbol || '—' }}</div>
          </div>
          <div class="info-panel">
            <div class="ip-label">totalSupply</div>
            <div class="ip-value ip-str">{{ token.totalSupply || '—' }}</div>
          </div>
          <div class="info-panel">
            <div class="ip-label">decimals</div>
            <div class="ip-value">{{ token.decimals ?? '—' }}</div>
          </div>
        </div>

        <div class="info-panel ip-owner" style="margin-top:.7rem">
          <div class="ip-label">{{ t('interact.owner') }}</div>
          <div class="ip-addr mono">{{ token.owner || '—' }}</div>
        </div>

        <div class="divider"></div>
        <div class="field">
          <label class="label">Balance / Freeze Query <span style="color:var(--t3)">(blank uses current wallet)</span></label>
          <div class="query-row">
            <input v-model="queryAccount" class="input monoinput" :placeholder="wallet.address || '0x…'" />
            <button class="btn btn-sm btn-ghost" :disabled="!validQueryAccount || readLoading" @click="refreshAccountState">↻</button>
          </div>
        </div>

        <div class="info-panels">
          <div class="info-panel">
            <div class="ip-label">{{ t('wallet.balance') }}</div>
            <div class="ip-value ip-str">{{ token.queryBalance || '—' }}</div>
          </div>
          <div class="info-panel">
            <div class="ip-label">frozen</div>
            <div :class="['status-pill', token.queryFrozen ? 'status-danger' : 'status-ok']">
              {{ token.queryFrozen ? 'Frozen' : 'Active' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 写入代币状态 -->
      <div class="card section-card">
        <div class="card-head">
          <div class="card-title">{{ t('interact.writeSection') }}</div>
          <span v-if="writeLoading" class="badge badge-yellow">
            <span class="spinner"></span> pending
          </span>
        </div>

        <div class="write-actions">
          <div class="wa-row">
            <div class="wa-info">
              <span class="badge badge-pink">ERC20</span>
              <span class="wa-name mono">transfer(address,uint256)</span>
            </div>
            <div class="wa-inputs wide">
              <input v-model="transferTo" class="input wa-input addr-input" placeholder="to 0x…" />
              <input v-model="transferAmount" type="number" min="0" step="0.000001" class="input wa-input amount-input" placeholder="amount" />
              <button class="btn btn-primary btn-sm" :disabled="!canWrite || !validTransfer" @click="callTransfer">
                transfer
              </button>
            </div>
          </div>

          <div class="wa-row">
            <div class="wa-info">
              <span class="badge badge-pink">ERC20</span>
              <span class="wa-name mono">approve(address,uint256)</span>
            </div>
            <div class="wa-inputs wide">
              <input v-model="approveSpender" class="input wa-input addr-input" placeholder="spender 0x…" />
              <input v-model="approveAmount" type="number" min="0" step="0.000001" class="input wa-input amount-input" placeholder="amount" />
              <button class="btn btn-secondary btn-sm" :disabled="!canWrite || !validApprove" @click="callApprove">
                approve
              </button>
            </div>
          </div>

          <div class="wa-row">
            <div class="wa-info">
              <span class="badge badge-cyan">ERC1363</span>
              <span class="wa-name mono">transferAndCall(address,uint256,bytes)</span>
            </div>
            <div class="wa-inputs wide">
              <input v-model="transferCallTo" class="input wa-input addr-input" placeholder="to contract 0x…" />
              <input v-model="transferCallAmount" type="number" min="0" step="0.000001" class="input wa-input amount-input" placeholder="amount" />
              <input v-model="transferCallData" class="input wa-input data-input" placeholder="0x data" />
              <button class="btn btn-cyan btn-sm" :disabled="!canWrite || !validTransferCall" @click="callTransferAndCall">
                transferAndCall
              </button>
            </div>
          </div>

          <div class="wa-row">
            <div class="wa-info">
              <span class="badge badge-cyan">ERC1363</span>
              <span class="wa-name mono">approveAndCall(address,uint256,bytes)</span>
            </div>
            <div class="wa-inputs wide">
              <input v-model="approveCallSpender" class="input wa-input addr-input" placeholder="spender contract 0x…" />
              <input v-model="approveCallAmount" type="number" min="0" step="0.000001" class="input wa-input amount-input" placeholder="amount" />
              <input v-model="approveCallData" class="input wa-input data-input" placeholder="0x data" />
              <button class="btn btn-cyan btn-sm" :disabled="!canWrite || !validApproveCall" @click="callApproveAndCall">
                approveAndCall
              </button>
            </div>
          </div>

          <div class="wa-row">
            <div class="wa-info">
              <span class="badge badge-yellow">owner only</span>
              <span class="wa-name mono">mint(address,uint256)</span>
            </div>
            <div class="wa-inputs wide">
              <input v-model="mintTo" class="input wa-input addr-input" placeholder="to 0x…" />
              <input v-model="mintAmount" type="number" min="0" step="0.000001" class="input wa-input amount-input" placeholder="amount" />
              <button class="btn btn-primary btn-sm" :disabled="!canWrite || !validMint" @click="callMint">
                mint
              </button>
            </div>
          </div>

          <div class="wa-row">
            <div class="wa-info">
              <span class="badge badge-yellow">owner only</span>
              <span class="wa-name mono">freeze / unfreeze</span>
            </div>
            <div class="wa-inputs wide">
              <input v-model="freezeAccount" class="input wa-input addr-input" placeholder="account 0x…" />
              <button class="btn btn-danger btn-sm" :disabled="!canWrite || !validFreezeAccount" @click="callFreeze">
                freeze
              </button>
              <button class="btn btn-secondary btn-sm" :disabled="!canWrite || !validFreezeAccount" @click="callUnfreeze">
                unfreeze
              </button>
            </div>
          </div>

          <div class="wa-row block-row">
            <div class="wa-info">
              <span class="badge badge-yellow">owner only</span>
              <span class="wa-name mono">batchMintEqual(address[],uint256)</span>
            </div>
            <textarea
              v-model="batchRecipients"
              class="textarea monoinput"
              placeholder="One recipient address per line or comma-separated"
            ></textarea>
            <div class="wa-inputs">
              <input v-model="batchAmount" type="number" min="0" step="0.000001" class="input wa-input amount-input" placeholder="amount each" />
              <button class="btn btn-primary btn-sm" :disabled="!canWrite || !validBatchMint" @click="callBatchMintEqual">
                batchMintEqual
              </button>
            </div>
          </div>
        </div>

        <Transition name="slide-up">
          <div v-if="lastTx" class="tx-result">
            <div class="tx-status success">
              <span>✓</span>
              <span>{{ t('interact.txSuccess') }}</span>
              <span class="tr-gas">Gas: {{ lastTx.receipt?.gasUsed?.toString() }}</span>
            </div>
            <div class="tr-hash">
              <span class="label">{{ t('interact.txHash') }}</span>
              <a :href="getTxUrl(lastTx.hash)" target="_blank" class="tr-link mono">
                {{ lastTx.hash }}
              </a>
            </div>
            <div v-if="logs.length" class="tr-logs">
              <div class="log-head">Emitted Events</div>
              <div v-for="(log, i) in logs" :key="i" class="log-row">
                <span class="badge badge-pink">{{ log.eventName }}</span>
                <span class="log-args mono">{{ formatArgs(log.args) }}</span>
              </div>
            </div>
          </div>
        </Transition>

        <Transition name="fade">
          <div v-if="writeError" class="error-box">⚠ {{ writeError }}</div>
        </Transition>
      </div>

      <!-- ABI 方法清单 -->
      <div class="card section-card abi-card">
        <div class="card-head">
          <div class="card-title">ABI Functions</div>
          <span class="badge badge-purple">{{ abiFunctions.length }} methods</span>
        </div>
        <div class="abi-list">
          <div v-for="fn in abiFunctions" :key="fn.key" class="abi-row">
            <span :class="['badge', badgeClassFor(fn.type)]">{{ fn.type }}</span>
            <span class="abi-sig mono">{{ fn.sig }}</span>
            <span class="abi-desc">{{ fn.desc }}</span>
          </div>
        </div>
      </div>

      <!-- 历史事件 -->
      <div class="card section-card events-card">
        <div class="card-head">
          <div class="card-title">{{ t('interact.eventsSection') }}</div>
          <div class="ev-controls">
            <select v-model="selectedEvent" class="ev-select">
              <option value="Transfer">Transfer</option>
              <option value="Approval">Approval</option>
              <option value="AccountFreeze">AccountFreeze</option>
              <option value="BatchMint">BatchMint</option>
              <option value="OwnershipTransferred">OwnershipTransferred</option>
            </select>
            <button class="btn btn-sm btn-cyan" :disabled="!canInteract || readLoading" @click="loadEvents">
              {{ t('interact.loadEvents') }}
            </button>
          </div>
        </div>

        <div v-if="events.length === 0" class="no-events">{{ t('interact.noEvents') }}</div>
        <div v-else class="events-list">
          <div v-for="(ev, i) in events" :key="i" class="ev-item">
            <span class="badge badge-pink">{{ ev.eventName }}</span>
            <span class="ev-block mono">#{{ ev.blockNumber?.toString() }}</span>
            <span class="ev-args mono">{{ formatArgs(ev.args) }}</span>
            <a :href="getTxUrl(ev.txHash)" target="_blank" class="ev-tx">↗</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n }      from 'vue-i18n'
import { formatUnits, isAddress, parseUnits } from 'viem'
import { useWallet }    from '@/composables/useWallet.js'
import { useContract }  from '@/composables/useContract.js'
import { useToast }     from '@/composables/useToast.js'
import { BKC_TOKEN_ABI, getExplorerTxUrl } from '@/wagmi.config.js'
import { listContractFunctions } from '@/contractFunctions.js'

const { t } = useI18n()
const { wallet } = useWallet()
const { success, error: toastError } = useToast()

const contractAddr = ref('')
const loaded       = ref(false)
const selectedEvent= ref('Transfer')
const events       = ref([])
const lastTx       = ref(null)

const queryAccount = ref('')
const transferTo = ref('')
const transferAmount = ref('')
const approveSpender = ref('')
const approveAmount = ref('')
const transferCallTo = ref('')
const transferCallAmount = ref('')
const transferCallData = ref('0x')
const approveCallSpender = ref('')
const approveCallAmount = ref('')
const approveCallData = ref('0x')
const mintTo = ref('')
const mintAmount = ref('')
const freezeAccount = ref('')
const batchRecipients = ref('')
const batchAmount = ref('')

const token = ref({
  name: '',
  symbol: '',
  decimals: null,
  totalSupply: '',
  owner: '',
  queryBalance: '',
  queryFrozen: false,
})

const readHook  = useContract()
const writeHook = useContract()

const readLoading  = readHook.loading
const writeLoading = writeHook.loading
const writeError   = writeHook.error
const logs         = writeHook.logs

// ABI 方法清单直接从编译产物生成，避免交互页只展示手写白名单。
const abiFunctions = computed(() => listContractFunctions(BKC_TOKEN_ABI))

// 交互前必须同时有钱包和有效合约地址，避免把空地址传给链上读取。
const canInteract = computed(() =>
  wallet.value.isConnected && isAddress(contractAddr.value)
)

// 写操作要等上一笔交易完成后再开放，减少重复签名和状态覆盖。
const canWrite = computed(() => canInteract.value && !writeLoading.value)

// 查询账户留空时默认查当前钱包，方便用户先看自己的余额和冻结状态。
const accountForQuery = computed(() => queryAccount.value.trim() || wallet.value.address || '')

// 读取余额和冻结状态必须用有效地址，否则合约调用会直接失败。
const validQueryAccount = computed(() => isAddress(accountForQuery.value))

// transfer 需要正数金额，避免用户发出没有意义的 0 金额交易。
const validTransfer = computed(() => isAddress(transferTo.value) && Number(transferAmount.value) > 0)

// ERC20 approve 允许授权 0，用于清理已有授权。
const validApprove = computed(() => isAddress(approveSpender.value) && Number(approveAmount.value) >= 0)

// ERC1363 回调数据必须是偶数字节的 hex，防止钱包侧编码失败。
const validTransferCall = computed(() =>
  isAddress(transferCallTo.value) &&
  Number(transferCallAmount.value) > 0 &&
  isHexData(transferCallData.value)
)

// approveAndCall 同样允许金额为 0，但回调 data 仍要是合法 hex。
const validApproveCall = computed(() =>
  isAddress(approveCallSpender.value) &&
  Number(approveCallAmount.value) >= 0 &&
  isHexData(approveCallData.value)
)

// mint 是 owner 操作，前端这里只校验地址和金额，权限交给合约最终判断。
const validMint = computed(() => isAddress(mintTo.value) && Number(mintAmount.value) > 0)

// 冻结和解冻共用同一个账户输入，减少用户重复填写。
const validFreezeAccount = computed(() => isAddress(freezeAccount.value))

// 批量地址支持换行、英文逗号和中文逗号，方便从表格里直接粘贴。
const parsedBatchRecipients = computed(() =>
  batchRecipients.value
    .split(/[\s,，]+/)
    .map(item => item.trim())
    .filter(Boolean)
)

// 批量铸造必须保证每个地址都有效，否则整笔交易会回滚。
const validBatchMint = computed(() =>
  parsedBatchRecipients.value.length > 0 &&
  parsedBatchRecipients.value.every(isAddress) &&
  Number(batchAmount.value) > 0
)

// 代币合约的 mint/batchMint 入参是原始单位，页面输入按普通代币数量处理后统一补精度。
function toRawAmount(value) {
  return parseUnits(String(value || '0'), token.value.decimals ?? 18)
}

// 读取结果按合约 decimals 还原成人类可读数量，避免直接展示原始整数。
function formatTokenAmount(value) {
  return `${formatUnits(value, token.value.decimals ?? 18)} ${token.value.symbol || ''}`.trim()
}

// bytes 参数只接受 0x 开头的完整字节串，奇数字符长度会被挡掉。
function isHexData(value) {
  return /^0x([0-9a-fA-F]{2})*$/.test(value || '0x')
}

// 空 data 默认传 0x，保持 ERC1363 调用参数类型稳定。
function normalizeHexData(value) {
  return value || '0x'
}

// ABI 列表里的方法类型复用同一套颜色，读写权限更容易分辨。
function badgeClassFor(type) {
  if (type === 'view') return 'badge-cyan'
  if (type === 'owner') return 'badge-yellow'
  return 'badge-pink'
}

// 加载合约时先读取基础状态，成功后才展开后续交互面板。
async function handleLoad() {
  if (!canInteract.value) return
  try {
    await refreshAll()
    loaded.value = true
    success(t('interact.loaded'))
  } catch (e) { toastError(e.message) }
}

// 基础信息并发读取，减少用户每次刷新等待的时间。
async function refreshAll() {
  const addr = contractAddr.value
  const [name, symbol, decimals, totalSupply, owner] = await Promise.all([
    readHook.read(addr, BKC_TOKEN_ABI, 'name'),
    readHook.read(addr, BKC_TOKEN_ABI, 'symbol'),
    readHook.read(addr, BKC_TOKEN_ABI, 'decimals'),
    readHook.read(addr, BKC_TOKEN_ABI, 'totalSupply'),
    readHook.read(addr, BKC_TOKEN_ABI, 'owner'),
  ])

  token.value.name = name
  token.value.symbol = symbol
  token.value.decimals = Number(decimals)
  token.value.totalSupply = formatTokenAmount(totalSupply)
  token.value.owner = owner

  await refreshAccountState()
}

// 账户状态单独刷新，方便用户切换查询地址时不用重读整个合约。
async function refreshAccountState() {
  if (!validQueryAccount.value) return
  const addr = contractAddr.value
  const account = accountForQuery.value
  const [balance, frozen] = await Promise.all([
    readHook.read(addr, BKC_TOKEN_ABI, 'balanceOf', [account]),
    readHook.read(addr, BKC_TOKEN_ABI, 'isFrozen', [account]),
  ])
  token.value.queryBalance = formatTokenAmount(balance)
  token.value.queryFrozen = frozen
}

// 所有写操作都走同一个入口，确保交易回执、日志和刷新逻辑一致。
async function doWrite(fn, args = []) {
  try {
    const result = await writeHook.write(contractAddr.value, BKC_TOKEN_ABI, fn, args)
    lastTx.value = result
    success(t('toast.txSuccess'))
    await refreshAll()
  } catch (e) { toastError(t('toast.txFailed', { msg: e.message })) }
}

// 普通转账按页面输入补齐精度后再发给 ERC20。
const callTransfer = () => doWrite('transfer', [transferTo.value, toRawAmount(transferAmount.value)])

// 授权金额也按代币精度转换，0 授权用于清理 allowance。
const callApprove = () => doWrite('approve', [approveSpender.value, toRawAmount(approveAmount.value)])

// ERC1363 转账回调需要同时传目标合约、金额和 bytes 数据。
const callTransferAndCall = () => doWrite('transferAndCall', [
  transferCallTo.value,
  toRawAmount(transferCallAmount.value),
  normalizeHexData(transferCallData.value),
])

// ERC1363 授权回调会触发 spender 合约逻辑，data 统一在这里兜底。
const callApproveAndCall = () => doWrite('approveAndCall', [
  approveCallSpender.value,
  toRawAmount(approveCallAmount.value),
  normalizeHexData(approveCallData.value),
])

// 单次铸造是 owner-only，前端发起后仍以合约权限检查为准。
const callMint = () => doWrite('mint', [mintTo.value, toRawAmount(mintAmount.value)])

// 冻结账户会影响转入和转出，操作前只负责传入目标账户。
const callFreeze = () => doWrite('freeze', [freezeAccount.value])

// 解冻和冻结共用输入，保持 owner 管理操作入口一致。
const callUnfreeze = () => doWrite('unfreeze', [freezeAccount.value])

// 批量等额铸造把已解析地址数组直接传给合约，金额统一补精度。
const callBatchMintEqual = () => doWrite('batchMintEqual', [
  parsedBatchRecipients.value,
  toRawAmount(batchAmount.value),
])

// 事件查询从创世区块开始拉取，适合测试网小范围验证合约行为。
async function loadEvents() {
  events.value = await readHook.fetchEvents(contractAddr.value, BKC_TOKEN_ABI, selectedEvent.value, 0n)
  if (events.value.length === 0) success('No events found')
}

// 交易链接只按当前链生成，未知链时不跳转到错误浏览器。
const getTxUrl = (h) => getExplorerTxUrl(wallet.value.chainId, h) ?? '#'

// 事件参数统一格式化，避免 bigint 和数组在模板里显示不稳定。
function formatArgs(args) {
  if (!args) return ''
  return Object.entries(args)
    .map(([k, v]) => `${k}=${formatValue(v)}`)
    .join(', ')
}

// 事件值里可能混有 bigint、数组和普通类型，这里统一转成可读文本。
function formatValue(value) {
  if (typeof value === 'bigint') return value.toString()
  if (Array.isArray(value)) return `[${value.map(formatValue).join(', ')}]`
  return value?.toString?.() ?? String(value)
}
</script>

<style scoped>
/* 地址栏 */
.addr-bar {
  display: flex; align-items: flex-end; gap: 1rem;
  margin-bottom: 1.2rem; padding: 1.2rem 1.4rem;
}
.ab-left { display: flex; align-items: flex-end; gap: .8rem; flex: 1; }
.ab-icon { font-size: 1.4rem; padding-bottom: .5rem; flex-shrink: 0; }

.warn-banner {
  background: var(--yellow-dim); border: 1px solid rgba(245,197,24,.25);
  border-radius: var(--r); padding: .85rem 1rem;
  font-size: .82rem; color: var(--yellow); margin-bottom: 1rem;
}

/* 内容网格 */
.interact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1rem;
}
.events-card { grid-column: 1 / -1; }
.abi-card { grid-column: 1 / -1; }
.section-card {}

/* 信息面板 */
.info-panels { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; }
.info-panel {
  background: var(--bg-3); border: 1px solid var(--border);
  border-radius: var(--r); padding: .9rem 1rem;
  position: relative;
}
.ip-label { font-size: .65rem; color: var(--t3); text-transform: uppercase; letter-spacing: .07em; margin-bottom: .4rem; }
.ip-value { font-size: 2rem; font-weight: 800; color: var(--cyan); line-height: 1; }
.ip-str   { font-size: 1rem; color: var(--yellow); font-weight: 600; overflow-wrap: anywhere; }
.ip-addr  { font-size: .7rem; color: var(--t2); word-break: break-all; }
.ip-owner { display: flex; align-items: center; gap: .7rem; }
.ip-owner .ip-label { margin-bottom: 0; flex-shrink: 0; }
.ip-owner .ip-addr  { flex: 1; }

.query-row { display: flex; gap: .5rem; align-items: center; }
.query-row .input { flex: 1; }
.status-pill {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 32px; padding: .25rem .65rem;
  border-radius: var(--r-sm); font-size: .82rem; font-weight: 700;
}
.status-ok { color: var(--cyan); background: rgba(0,212,170,.08); border: 1px solid rgba(0,212,170,.2); }
.status-danger { color: var(--red); background: var(--red-dim); border: 1px solid rgba(255,69,96,.25); }

/* 写入操作 */
.write-actions { display: flex; flex-direction: column; gap: .5rem; margin-bottom: .8rem; }
.wa-row {
  display: flex; align-items: center; gap: .8rem; flex-wrap: wrap;
  padding: .6rem .8rem; background: var(--bg-3);
  border: 1px solid var(--border); border-radius: var(--r-sm);
}
.block-row { align-items: stretch; flex-direction: column; }
.wa-info { display: flex; align-items: center; gap: .5rem; flex: 1; flex-wrap: wrap; }
.wa-name { font-size: .76rem; color: var(--t2); }
.wa-inputs { display: flex; gap: .4rem; align-items: center; flex-wrap: wrap; }
.wa-inputs.wide { flex: 1; justify-content: flex-end; }
.wa-input { width: 120px; padding: .4rem .6rem; font-size: .8rem; }
.addr-input { width: min(260px, 100%); }
.amount-input { width: 110px; }
.data-input { width: 120px; }
.textarea {
  width: 100%; min-height: 88px; resize: vertical;
  background: var(--bg-1); border: 1px solid var(--border);
  border-radius: var(--r-sm); color: var(--t1);
  padding: .7rem .8rem; outline: none;
}
.textarea:focus { border-color: var(--pink); }

/* 交易结果 */
.tx-result { margin-top: .8rem; }
.tr-gas    { margin-left: auto; font-size: .72rem; color: var(--t3); }
.tr-hash   { margin-top: .6rem; }
.tr-link   { display: block; font-size: .72rem; color: var(--pink); word-break: break-all; text-decoration: none; }
.tr-link:hover { text-decoration: underline; }
.tr-logs   { margin-top: .8rem; background: var(--bg-3); border: 1px solid var(--border); border-radius: var(--r-sm); padding: .7rem; }
.log-head  { font-size: .65rem; color: var(--t3); text-transform: uppercase; letter-spacing: .07em; margin-bottom: .5rem; }
.log-row   { display: flex; align-items: center; gap: .6rem; padding: .25rem 0; }
.log-args  { font-size: .72rem; color: var(--t2); word-break: break-all; }

.error-box {
  margin-top: .8rem; font-size: .78rem; color: var(--red);
  background: var(--red-dim); border: 1px solid rgba(255,69,96,.25);
  border-radius: var(--r-sm); padding: .7rem .9rem;
}

/* ABI 方法清单 */
.abi-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .45rem .8rem;
}
.abi-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-areas:
    "badge sig"
    "badge desc";
  align-items: center;
  gap: .18rem .6rem;
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  padding: .55rem .7rem;
}
.abi-row .badge { grid-area: badge; }
.abi-sig {
  grid-area: sig;
  color: var(--t2);
  font-size: .74rem;
  overflow-wrap: anywhere;
}
.abi-desc {
  grid-area: desc;
  color: var(--t3);
  font-size: .7rem;
}

/* 事件列表 */
.ev-controls { display: flex; gap: .5rem; align-items: center; }
.ev-select {
  background: var(--bg-3); border: 1px solid var(--border);
  border-radius: var(--r-sm); color: var(--t2);
  font-family: var(--font-mono); font-size: .75rem;
  padding: .35rem .6rem; outline: none; cursor: pointer;
}
.ev-select:focus { border-color: var(--pink); }

.no-events { font-size: .8rem; color: var(--t3); font-style: italic; padding: .5rem 0; }
.events-list { display: flex; flex-direction: column; gap: .4rem; max-height: 300px; overflow-y: auto; }
.ev-item {
  display: flex; align-items: center; gap: .6rem; flex-wrap: wrap;
  background: var(--bg-3); border: 1px solid var(--border);
  border-radius: var(--r-sm); padding: .5rem .8rem; font-size: .76rem;
}
.ev-block { color: var(--t3); flex-shrink: 0; }
.ev-args  { color: var(--t2); flex: 1; word-break: break-all; }
.ev-tx    { color: var(--pink); text-decoration: none; flex-shrink: 0; }
.ev-tx:hover { text-decoration: underline; }

@media (max-width: 700px) {
  .interact-grid { grid-template-columns: 1fr; }
  .events-card { grid-column: auto; }
  .abi-card { grid-column: auto; }
  .abi-list { grid-template-columns: 1fr; }
  .addr-bar { flex-wrap: wrap; }
  .info-panels { grid-template-columns: 1fr; }
  .wa-inputs.wide { justify-content: flex-start; }
}
</style>
