/**
 * Example 1: Blockchain Connection and Data Queries
 */

import { BlockchainConfig } from '../utils/client';
import {
  getLatestBlock,
  getBalance,
  getNonce,
  getChainId,
  getGasPrice,
} from '../utils/queries';

export async function exampleBlockchainConnection(config: BlockchainConfig) {
  console.log('=== Example 1: Blockchain Connection and Data Queries ===\n');

  try {
    // Get latest block
    console.log('📦 Getting latest block...');
    const latestBlock = await getLatestBlock(config);
    console.log(`Latest Block Number: ${latestBlock.number}`);
    console.log(`Block Hash: ${latestBlock.hash}`);
    console.log(`Block Timestamp: ${latestBlock.timestamp}`);
    console.log(`Transactions in block: ${latestBlock.transactions.length}\n`);

    // Get chain ID
    console.log('🔗 Getting chain info...');
    const chainId = await getChainId(config);
    console.log(`Chain ID: ${chainId}\n`);

    // Get gas price
    console.log('⛽ Getting gas price...');
    const gasPrice = await getGasPrice(config);
    console.log(`Current Gas Price: ${gasPrice} wei`);
    console.log(`Current Gas Price: ${gasPrice / BigInt(1e9)} gwei\n`);

    // Get account balance (using a sample address)
    const sampleAddress = '0x0000000000000000000000000000000000000000' as const;
    console.log(`💰 Getting balance for ${sampleAddress}...`);
    const balance = await getBalance(config, sampleAddress);
    console.log(`Balance: ${balance} wei`);
    console.log(`Balance: ${balance / BigInt(1e18)} ETH\n`);

    // Get account nonce
    console.log(`📍 Getting nonce for ${sampleAddress}...`);
    const nonce = await getNonce(config, sampleAddress);
    console.log(`Nonce: ${nonce}\n`);

    console.log('✅ Example 1 completed successfully!\n');
  } catch (error) {
    console.error('❌ Error in Example 1:', error);
    throw error;
  }
}
