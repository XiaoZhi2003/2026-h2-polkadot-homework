/**
 * State Management Utils
 * Functions for reading and updating contract state
 */

import { getPublicClient, getWalletClient, BlockchainConfig } from '../utils/client';
import { Address, encodeFunctionData } from 'viem';

/**
 * Read a single state variable from contract
 */
export async function readState(
  config: BlockchainConfig,
  params: {
    contract: Address;
    functionName: string;
    abi: any;
    args?: any[];
  }
) {
  const client = getPublicClient(config);

  try {
    const result = await client.call({
      to: params.contract,
      data: encodeFunctionData({
        abi: params.abi,
        functionName: params.functionName,
        args: params.args || [],
      }),
    });

    return result.data;
  } catch (error) {
    console.error(`Error reading state for ${params.functionName}:`, error);
    throw error;
  }
}

/**
 * Update contract state (write operation)
 */
export async function updateState(
  config: BlockchainConfig,
  params: {
    contract: Address;
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

  try {
    const hash = await (client as any).sendTransaction({
      to: params.contract,
      data: encodeFunctionData({
        abi: params.abi,
        functionName: params.functionName,
        args: params.args || [],
      }),
      value: params.value,
    });

    const receipt = await (client as any).waitForTransactionReceipt({ hash });
    return receipt;
  } catch (error) {
    console.error(`Error updating state for ${params.functionName}:`, error);
    throw error;
  }
}

/**
 * Watch for state changes (listen to events)
 */
export async function watchStateChanges(
  config: BlockchainConfig,
  params: {
    contract: Address;
    event: any;
    abi: any;
    onLogs?: (logs: any[]) => void;
    poll?: boolean;
  }
) {
  const client = getPublicClient(config);

  if (params.poll) {
    // Polling mode
    const unwatch = client.watchContractEvent({
      address: params.contract,
      abi: params.abi,
      eventName: params.event,
      onLogs: (logs) => {
        if (params.onLogs) {
          params.onLogs(logs);
        }
      },
    });

    return unwatch;
  }

  return () => {};
}

/**
 * Read multiple state variables at once
 */
export async function readMultipleStates(
  config: BlockchainConfig,
  calls: Array<{
    contract: Address;
    functionName: string;
    abi: any;
    args?: any[];
  }>
) {
  const results = await Promise.all(
    calls.map((call) =>
      readState(config, {
        contract: call.contract,
        functionName: call.functionName,
        abi: call.abi,
        args: call.args,
      }).catch((error) => {
        console.error(`Failed to read ${call.functionName}:`, error);
        return null;
      })
    )
  );

  return results;
}

/**
 * Batch state updates
 */
export async function batchUpdateStates(
  config: BlockchainConfig,
  updates: Array<{
    contract: Address;
    functionName: string;
    abi: any;
    args?: any[];
    value?: bigint;
  }>
) {
  const results = await Promise.all(
    updates.map((update) =>
      updateState(config, {
        contract: update.contract,
        functionName: update.functionName,
        abi: update.abi,
        args: update.args,
        value: update.value,
      }).catch((error) => {
        console.error(`Failed to update ${update.functionName}:`, error);
        return null;
      })
    )
  );

  return results;
}

/**
 * Get current state snapshot
 */
export async function getStateSnapshot(
  config: BlockchainConfig,
  params: {
    contract: Address;
    stateVars: Array<{
      name: string;
      functionName: string;
      abi: any;
      args?: any[];
    }>;
  }
) {
  const snapshot: Record<string, any> = {};

  for (const stateVar of params.stateVars) {
    try {
      const value = await readState(config, {
        contract: params.contract,
        functionName: stateVar.functionName,
        abi: stateVar.abi,
        args: stateVar.args,
      });
      snapshot[stateVar.name] = value;
    } catch (error) {
      snapshot[stateVar.name] = null;
    }
  }

  return snapshot;
}
