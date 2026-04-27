import assert from 'node:assert/strict'

import {
  BKC_TOKEN_ABI,
  BKC_TOKEN_BYTECODE,
  BKC_TOKEN_SOURCE,
} from '../src/contracts/BKCERC1363Token.compiled.js'

// 页面依赖这些函数名；合约升级后缺任意一个都应该尽早失败。
const requiredFunctions = [
  'name',
  'symbol',
  'decimals',
  'totalSupply',
  'balanceOf',
  'owner',
  'isFrozen',
  'transfer',
  'approve',
  'transferAndCall',
  'approveAndCall',
  'mint',
  'batchMint',
  'batchMintEqual',
  'freeze',
  'unfreeze',
]

assert.match(BKC_TOKEN_SOURCE, /contract\s+BKCERC1363Token\b/)
assert.ok(BKC_TOKEN_BYTECODE.startsWith('0x'), 'bytecode should be hex-prefixed')
assert.ok(BKC_TOKEN_BYTECODE.length > 1000, 'bytecode should contain deployable contract code')

const abiFunctionNames = new Set(
  BKC_TOKEN_ABI
    .filter(item => item.type === 'function')
    .map(item => item.name)
)

for (const name of requiredFunctions) {
  assert.ok(abiFunctionNames.has(name), `ABI missing function: ${name}`)
}

const constructor = BKC_TOKEN_ABI.find(item => item.type === 'constructor')
assert.deepEqual(
  constructor.inputs.map(input => input.name),
  ['name', 'symbol', 'initialSupply', 'owner']
)
