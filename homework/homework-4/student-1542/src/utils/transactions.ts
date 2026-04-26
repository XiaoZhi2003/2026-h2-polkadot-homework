/**
 * Transaction Utils
 * Functions for sending and managing transactions
 */

import { getWalletClient, BlockchainConfig } from './client';
import { Address } from 'viem';

export interface SendTransactionParams {
  to: Address;
  value?: bigint;
  data?: `0x${string}`;
  gasLimit?: bigint;
}

/**
 * Send a simple ETH transaction
 */
export async function sendTransaction(config: BlockchainConfig, params: SendTransactionParams) {
  const client = getWalletClient(config);
  if (!client) {
    throw new Error('Wallet client not initialized. Private key is required.');
  }

  const txHash = await (client as any).sendTransaction({
    to: params.to,
    value: params.value || BigInt(0),
    data: params.data,
  });

  return txHash;
}

/**
 * Send ETH to an address
 */
export async function sendETH(config: BlockchainConfig, to: Address, amountInWei: bigint) {
  return sendTransaction(config, {
    to,
    value: amountInWei,
  });
}

/**
 * Get transaction confirmation with receipt
 */
export async function waitForTransactionReceipt(config: BlockchainConfig, txHash: string) {
  const client = getWalletClient(config);
  if (!client) {
    throw new Error('Wallet client not initialized.');
  }

  const receipt = await (client as any).waitForTransactionReceipt({ hash: txHash as `0x${string}` });
  return receipt;
}

/**
 * Send transaction with custom parameters (for contract calls)
 */
export async function sendContractTransaction(
  config: BlockchainConfig,
  params: {
    to: Address;
    data: `0x${string}`;
    value?: bigint;
  }
) {
  return sendTransaction(config, {
    to: params.to,
    value: params.value,
    data: params.data,
  });
}

/**
 * Estimate transaction cost
 */
export async function estimateTransactionCost(
  config: BlockchainConfig,
  params: SendTransactionParams
) {
  const client = getWalletClient(config);
  if (!client) {
    throw new Error('Wallet client not initialized.');
  }

  const gasPrice = await (client as any).getGasPrice();
  const gas = await (client as any).estimateGas({
    to: params.to,
    value: params.value || BigInt(0),
    data: params.data,
    account: (client as any).account,
  });

  const totalCost = gas * gasPrice;
  return {
    gas,
    gasPrice,
    totalCost,
  };
}
