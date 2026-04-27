import assert from 'node:assert/strict'
import { polkadotHubMainnet, polkadotHubTestnet } from '../src/wagmi.config.js'
import { resolveNetworkState } from '../src/networkState.js'

// 这个脚本只测纯状态判断，避免为了验证 UI 文案去连真实钱包或 RPC。
assert.equal(typeof resolveNetworkState, 'function', 'resolveNetworkState should be exported')

const unknown = resolveNetworkState(null)
assert.equal(unknown.chain, null)
assert.equal(unknown.chainId, null)
assert.equal(unknown.isSupported, false)
assert.equal(unknown.name, 'Unknown network')
assert.equal(unknown.kind, null)

const unsupported = resolveNetworkState(1)
assert.equal(unsupported.chain, null)
assert.equal(unsupported.chainId, 1)
assert.equal(unsupported.isSupported, false)
assert.equal(unsupported.name, 'Unsupported 1')
assert.equal(unsupported.kind, null)

const supported = resolveNetworkState(polkadotHubTestnet.id)
assert.equal(supported.chain, polkadotHubTestnet)
assert.equal(supported.chainId, polkadotHubTestnet.id)
assert.equal(supported.isSupported, true)
assert.equal(supported.name, polkadotHubTestnet.name)
assert.equal(supported.kind, 'testnet')

const mainnet = resolveNetworkState(polkadotHubMainnet.id)
assert.equal(mainnet.chain, polkadotHubMainnet)
assert.equal(mainnet.chainId, polkadotHubMainnet.id)
assert.equal(mainnet.isSupported, true)
assert.equal(mainnet.name, polkadotHubMainnet.name)
assert.equal(mainnet.kind, 'mainnet')

console.log('Network state checks passed.')
