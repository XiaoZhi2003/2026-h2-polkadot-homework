/**
 * Blockchain Connection Utils
 * Handles connection setup and client creation
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  publicActions,
  walletActions,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet, sepolia } from 'viem/chains';

export interface BlockchainConfig {
  rpcUrl: string;
  chainId: number;
  privateKey?: string;
}

// Singleton public client
let publicClient: ReturnType<typeof createPublicClient> | null = null;

// Singleton wallet client
let walletClient: any = null;

/**
 * Initialize and get public client for read-only operations
 */
export function getPublicClient(config: BlockchainConfig) {
  if (!publicClient) {
    publicClient = createPublicClient({
      chain: config.chainId === 1 ? mainnet : sepolia,
      transport: http(config.rpcUrl),
    });
  }
  return publicClient;
}

/**
 * Initialize and get wallet client for write operations
 */
export function getWalletClient(config: BlockchainConfig) {
  if (!walletClient && config.privateKey) {
    const account = privateKeyToAccount(`0x${config.privateKey}`);
    const baseClient = createWalletClient({
      account,
      chain: config.chainId === 1 ? mainnet : sepolia,
      transport: http(config.rpcUrl),
    });
    walletClient = baseClient.extend(publicActions);
  }
  return walletClient;
}

/**
 * Reset clients (useful for testing)
 */
export function resetClients() {
  publicClient = null;
  walletClient = null;
}
