/**
 * Contract Deployment Utils
 * Functions for deploying smart contracts
 */

import { getWalletClient, BlockchainConfig } from '../utils/client';
import { Address } from 'viem';

export interface DeploymentParams {
  bytecode: `0x${string}`;
  abi: any;
  constructorArgs?: any[];
  value?: bigint;
}

export interface DeploymentResult {
  contractAddress: Address;
  deploymentHash: string;
}

/**
 * Deploy a contract
 */
export async function deployContract(
  config: BlockchainConfig,
  params: DeploymentParams
): Promise<DeploymentResult> {
  const client = getWalletClient(config);
  if (!client) {
    throw new Error('Wallet client not initialized. Private key is required.');
  }

  const hash = await (client as any).deployContract({
    abi: params.abi,
    bytecode: params.bytecode,
    args: params.constructorArgs,
    value: params.value,
  });

  // Wait for deployment confirmation
  const receipt = await (client as any).waitForTransactionReceipt({ hash });

  if (!receipt.contractAddress) {
    throw new Error('Contract deployment failed: No contract address returned');
  }

  return {
    contractAddress: receipt.contractAddress,
    deploymentHash: hash,
  };
}

/**
 * Verify if an address is a contract
 */
export async function isContract(config: BlockchainConfig, address: Address): Promise<boolean> {
  const client = getWalletClient(config);
  if (!client) {
    throw new Error('Wallet client not initialized.');
  }

  const code = await (client as any).getCode({ address });
  return code !== '0x';
}

/**
 * Get contract bytecode
 */
export async function getContractBytecode(config: BlockchainConfig, address: Address) {
  const client = getWalletClient(config);
  if (!client) {
    throw new Error('Wallet client not initialized.');
  }

  const bytecode = await (client as any).getCode({ address });
  return bytecode;
}

/**
 * Encode contract constructor call
 */
export function encodeConstructor(abi: any, args?: any[]): `0x${string}` {
  // Find constructor in ABI
  const constructor = abi.find((item: any) => item.type === 'constructor');
  if (!constructor) {
    return '0x';
  }

  // In a production app, you'd use proper encoding
  // This is a simplified version
  return '0x';
}
