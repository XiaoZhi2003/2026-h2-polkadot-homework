/**
 * Data Query Utils
 * Functions for querying blockchain data
 */

import { getPublicClient, BlockchainConfig } from './client';
import { Address, GetBlockReturnType, Block } from 'viem';

/**
 * Get the latest block information
 */
export async function getLatestBlock(config: BlockchainConfig) {
  const client = getPublicClient(config);
  const block = await client.getBlock({ blockTag: 'latest' });
  return block;
}

/**
 * Get block by block number
 */
export async function getBlockByNumber(config: BlockchainConfig, blockNumber: bigint) {
  const client = getPublicClient(config);
  const block = await client.getBlock({ blockNumber });
  return block;
}

/**
 * Get transaction by hash
 */
export async function getTransaction(config: BlockchainConfig, hash: string) {
  const client = getPublicClient(config);
  const tx = await client.getTransaction({ hash: hash as `0x${string}` });
  return tx;
}

/**
 * Get transaction receipt
 */
export async function getTransactionReceipt(config: BlockchainConfig, hash: string) {
  const client = getPublicClient(config);
  const receipt = await client.getTransactionReceipt({ hash: hash as `0x${string}` });
  return receipt;
}

/**
 * Get account balance
 */
export async function getBalance(config: BlockchainConfig, address: Address) {
  const client = getPublicClient(config);
  const balance = await client.getBalance({ address });
  return balance;
}

/**
 * Get account nonce
 */
export async function getNonce(config: BlockchainConfig, address: Address) {
  const client = getPublicClient(config);
  const nonce = await client.getTransactionCount({ address });
  return nonce;
}

/**
 * Get gas price
 */
export async function getGasPrice(config: BlockchainConfig) {
  const client = getPublicClient(config);
  const gasPrice = await client.getGasPrice();
  return gasPrice;
}

/**
 * Get network ID
 */
export async function getChainId(config: BlockchainConfig) {
  const client = getPublicClient(config);
  const chainId = await client.getChainId();
  return chainId;
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(
  config: BlockchainConfig,
  params: {
    to: Address;
    from: Address;
    value?: bigint;
    data?: `0x${string}`;
  }
) {
  const client = getPublicClient(config);
  const gas = await client.estimateGas(params);
  return gas;
}

/**
 * Get block transaction count
 */
export async function getBlockTransactionCount(config: BlockchainConfig, blockNumber: bigint) {
  const client = getPublicClient(config);
  const count = await client.getBlockTransactionCount({ blockNumber });
  return count;
}
