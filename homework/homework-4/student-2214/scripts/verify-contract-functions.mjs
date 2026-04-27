import { BKC_TOKEN_ABI } from '../src/wagmi.config.js'
import {
  formatFunctionSignature,
  listContractFunctions,
} from '../src/contractFunctions.js'

/**
 * 合约方法清单必须从 ABI 生成，不能再手写少量白名单。
 * 这个校验会把 ABI 里的重载方法也算进去，防止页面漏展示。
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const abiFunctions = BKC_TOKEN_ABI.filter(item => item.type === 'function')
const generatedFunctions = listContractFunctions(BKC_TOKEN_ABI)
const abiSignatures = new Set(abiFunctions.map(formatFunctionSignature))
const generatedSignatures = new Set(generatedFunctions.map(item => item.sig))

assert(
  generatedFunctions.length === abiFunctions.length,
  `Expected ${abiFunctions.length} functions, got ${generatedFunctions.length}.`
)

for (const signature of abiSignatures) {
  assert(
    generatedSignatures.has(signature),
    `Missing function signature: ${signature}`
  )
}

for (const signature of [
  'MAX_BATCH_SIZE() -> uint256',
  'allowance(address,address) -> uint256',
  'batchFreeze(address[])',
  'batchMint(address[],uint256[])',
  'transferFrom(address,address,uint256) -> bool',
  'transferFromAndCall(address,address,uint256,bytes) -> bool',
  'renounceOwnership()',
  'transferOwnership(address)',
  'supportsInterface(bytes4) -> bool',
]) {
  assert(
    generatedSignatures.has(signature),
    `Required contract method is not shown: ${signature}`
  )
}

console.log(`Contract function list verified: ${generatedFunctions.length} methods.`)
