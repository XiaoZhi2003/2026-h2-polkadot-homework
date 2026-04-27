const OWNER_ONLY_NAMES = new Set([
  'batchFreeze',
  'batchMint',
  'batchMintEqual',
  'freeze',
  'mint',
  'renounceOwnership',
  'transferOwnership',
  'unfreeze',
])

const METHOD_LABELS = {
  MAX_BATCH_SIZE: 'Batch limit',
  allowance: 'ERC20 allowance',
  approve: 'ERC20 approve',
  approveAndCall: 'ERC1363 approve callback',
  balanceOf: 'ERC20 balance',
  batchFreeze: 'Batch freeze accounts',
  batchMint: 'Batch mint custom amounts',
  batchMintEqual: 'Batch mint equal amounts',
  decimals: 'Token decimals',
  freeze: 'Freeze account',
  isFrozen: 'Freeze status',
  mint: 'Mint tokens',
  name: 'Token name',
  owner: 'Contract owner',
  renounceOwnership: 'Renounce ownership',
  supportsInterface: 'ERC165 interface check',
  symbol: 'Token symbol',
  totalSupply: 'Total supply',
  transfer: 'ERC20 transfer',
  transferAndCall: 'ERC1363 transfer callback',
  transferFrom: 'ERC20 delegated transfer',
  transferFromAndCall: 'ERC1363 delegated callback',
  transferOwnership: 'Transfer ownership',
  unfreeze: 'Unfreeze account',
}

const FUNCTION_TYPE_ORDER = {
  view: 0,
  write: 1,
  owner: 2,
  payable: 3,
}

/**
 * ABI 里 tuple 类型会带 components，这里递归拼出签名需要的类型。
 * 只用 type 会把 tuple 细节丢掉，后续合约如果加结构体参数也能正确展示。
 */
export function formatAbiType(param) {
  if (!param?.type?.startsWith('tuple')) {
    return param?.type ?? ''
  }

  const suffix = param.type.slice('tuple'.length)
  const innerTypes = (param.components ?? []).map(formatAbiType).join(',')
  return `(${innerTypes})${suffix}`
}

/**
 * 把单个 ABI function 转成页面展示签名。
 * 输出参数为空时不追加返回值，保证展示和 Solidity 常见签名一致。
 */
export function formatFunctionSignature(item) {
  const inputs = (item.inputs ?? []).map(formatAbiType).join(',')
  const outputs = (item.outputs ?? []).map(formatAbiType).join(',')
  return `${item.name}(${inputs})${outputs ? ` -> ${outputs}` : ''}`
}

/**
 * 根据合约语义给方法分组。
 * ABI 不会标记 onlyOwner，所以 owner-only 方法要在这里显式列出。
 */
export function classifyFunction(item) {
  if (OWNER_ONLY_NAMES.has(item.name)) return 'owner'
  if (item.stateMutability === 'view' || item.stateMutability === 'pure') return 'view'
  if (item.stateMutability === 'payable') return 'payable'
  return 'write'
}

/**
 * 从 ABI 生成完整方法清单，页面只消费这个结果。
 * 保留 index 是为了重载方法 key 稳定，不会因为同名函数互相覆盖。
 */
export function listContractFunctions(abi) {
  return abi
    .filter(item => item.type === 'function')
    .map((item, index) => {
      const sig = formatFunctionSignature(item)
      const type = classifyFunction(item)
      return {
        key: `${sig}-${index}`,
        name: item.name,
        sig,
        type,
        desc: METHOD_LABELS[item.name] ?? item.stateMutability,
        stateMutability: item.stateMutability,
      }
    })
    .sort((a, b) => {
      const typeDiff = FUNCTION_TYPE_ORDER[a.type] - FUNCTION_TYPE_ORDER[b.type]
      if (typeDiff !== 0) return typeDiff
      return a.sig.localeCompare(b.sig)
    })
}
