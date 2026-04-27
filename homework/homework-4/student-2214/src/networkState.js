import { CHAIN_MAP } from './wagmi.config.js'

/**
 * 把钱包返回的 chainId 统一解析成 UI 和请求层都能复用的状态。
 * 空 chainId 只能算未知网络，不能默认成主网；未知 chainId 也不能回落到默认链。
 */
export function resolveNetworkState(chainId) {
  const hasChainId = chainId !== null && chainId !== undefined && chainId !== ''
  const normalizedChainId = hasChainId ? Number(chainId) : null
  const safeChainId = Number.isFinite(normalizedChainId) ? normalizedChainId : null
  const chain = safeChainId === null ? null : CHAIN_MAP[safeChainId] ?? null

  return {
    chain,
    chainId: safeChainId,
    isSupported: !!chain,
    name: chain?.name ?? (safeChainId === null ? 'Unknown network' : `Unsupported ${safeChainId}`),
    kind: chain ? (chain.testnet ? 'testnet' : 'mainnet') : null,
  }
}

/**
 * RPC 或签名请求必须拿到受支持的链 ID 后再发起。
 * 这里直接返回 null，调用方就不会被 wagmi 的默认链兜底误导。
 */
export function getSupportedChainId(chainId) {
  const state = resolveNetworkState(chainId)
  return state.isSupported ? state.chainId : null
}

/**
 * 交易和合约读写不能静默回落到默认链，否则用户看着是 A 链，实际会访问 B 链。
 */
export function requireSupportedChainId(chainId) {
  const state = resolveNetworkState(chainId)
  if (state.isSupported) return state.chainId
  const suffix = state.chainId === null ? '' : ` (${state.chainId})`
  throw new Error(`Unsupported network${suffix}`)
}
