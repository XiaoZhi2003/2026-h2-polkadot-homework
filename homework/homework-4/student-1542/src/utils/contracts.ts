/**
 * Contract Utils
 * Functions for interacting with smart contracts
 */

import { getPublicClient, getWalletClient, BlockchainConfig } from './client';
import { Address, parseAbi, encodeFunctionData, decodeFunctionResult } from 'viem';

/**
 * Read contract state (call a view/pure function)
 */
export async function readContract(
  config: BlockchainConfig,
  params: {
    address: Address;
    functionName: string;
    abi: any;
    args?: any[];
  }
) {
  const client = getPublicClient(config);

  const result = await client.call({
    account: client.account,
    to: params.address,
    data: encodeFunctionData({
      abi: params.abi,
      functionName: params.functionName,
      args: params.args,
    }),
  });

  return result.data;
}

/**
 * Write to contract state (send a transaction to a function)
 */
export async function writeContract(
  config: BlockchainConfig,
  params: {
    address: Address;
    functionName: string;
    abi: any;
    args?: any[];
    value?: bigint;
  }
) {
  const client = getWalletClient(config);
  if (!client) {
    throw new Error('Wallet client not initialized. Private key is required.');
  }

  const txHash = await (client as any).writeContract({
    address: params.address,
    abi: params.abi,
    functionName: params.functionName,
    args: params.args,
    value: params.value,
  });

  return txHash;
}

/**
 * Get contract code at address
 */
export async function getContractCode(config: BlockchainConfig, address: Address) {
  const client = getPublicClient(config);
  const code = await client.getCode({ address });
  return code;
}

/**
 * Get contract storage at position
 */
export async function getStorageAt(
  config: BlockchainConfig,
  address: Address,
  slot: `0x${string}`,
  blockNumber?: bigint
) {
  const client = getPublicClient(config);
  const storage = await client.getStorageAt({
    address,
    slot,
    blockTag: blockNumber ? 'latest' : undefined,
  });
  return storage;
}

/**
 * Call contract function (read-only, no state change)
 */
export async function callContractFunction(
  config: BlockchainConfig,
  params: {
    address: Address;
    functionName: string;
    abi: any;
    args?: any[];
    account?: Address;
  }
) {
  const client = getPublicClient(config);

  const result = await client.call({
    to: params.address,
    data: encodeFunctionData({
      abi: params.abi,
      functionName: params.functionName,
      args: params.args,
    }),
  });

  return result.data;
}

/**
 * Multiplex calls (batch read operations)
 */
export async function multicall(
  config: BlockchainConfig,
  params: {
    calls: Array<{
      address: Address;
      functionName: string;
      abi: any;
      args?: any[];
    }>;
    blockNumber?: bigint;
  }
) {
  const client = getPublicClient(config);

  // Since Viem doesn't have native multicall, we perform calls sequentially
  const results = await Promise.all(
    params.calls.map((call) =>
      callContractFunction(config, {
        address: call.address,
        functionName: call.functionName,
        abi: call.abi,
        args: call.args,
      })
    )
  );

  return results;
}
