/**
 * Main Entry Point
 * Demonstrates all Viem blockchain operations
 */

import dotenv from 'dotenv';
import { exampleBlockchainConnection } from './examples/1-connection';
import { exampleSendTransaction } from './examples/2-transactions';
import { exampleDeployContract } from './examples/3-deployment';
import { exampleReadAndUpdateState } from './examples/4-state';
import { BlockchainConfig } from './utils/client';

// Load environment variables
dotenv.config();

const config: BlockchainConfig = {
  rpcUrl: process.env.RPC_URL || 'http://localhost:8545',
  chainId: parseInt(process.env.CHAIN_ID || '1'),
  privateKey: process.env.PRIVATE_KEY,
};

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║           Viem Blockchain Comprehensive Example              ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log(`RPC URL: ${config.rpcUrl}`);
  console.log(`Chain ID: ${config.chainId}`);
  console.log(`Has Private Key: ${config.privateKey ? 'Yes' : 'No'}\n`);

  try {
    // Example 1: Blockchain Connection and Data Queries
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    await exampleBlockchainConnection(config);

    // Example 2: Sending Transactions (requires private key)
    if (config.privateKey) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      const recipientAddress = '0x0000000000000000000000000000000000000000';
      try {
        await exampleSendTransaction(config, recipientAddress);
      } catch (error) {
        console.log(
          '⚠️  Transaction example skipped (may require funded account on real network)\n'
        );
      }
    } else {
      console.log(
        '⏭️  Example 2 skipped (requires PRIVATE_KEY in .env for transaction sending)\n'
      );
    }

    // Example 3: Smart Contract Deployment (requires private key)
    if (config.privateKey) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      try {
        const deploymentResult = await exampleDeployContract(config);

        // Example 4: Reading and Updating State
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        await exampleReadAndUpdateState(config, deploymentResult.contractAddress);
      } catch (error) {
        console.log(
          '⚠️  Contract deployment example skipped (may require funded account on real network)\n'
        );
      }
    } else {
      console.log('⏭️  Example 3 & 4 skipped (requires PRIVATE_KEY in .env)\n');
    }

    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║               ✅ All Examples Completed Successfully!         ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run main function
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
