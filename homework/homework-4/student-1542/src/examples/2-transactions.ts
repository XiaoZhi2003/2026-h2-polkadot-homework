/**
 * Example 2: Sending Transactions
 */

import { BlockchainConfig } from '../utils/client';
import {
  sendETH,
  waitForTransactionReceipt,
  estimateTransactionCost,
} from '../utils/transactions';

export async function exampleSendTransaction(config: BlockchainConfig, recipientAddress: string) {
  console.log('=== Example 2: Sending Transactions ===\n');

  try {
    // Convert address to checksummed format
    const recipient = recipientAddress as `0x${string}`;

    // Amount to send (0.01 ETH in wei)
    const amountInWei = BigInt(10000000000000000); // 0.01 ETH

    console.log(`📤 Preparing to send ${amountInWei / BigInt(1e18)} ETH to ${recipient}...\n`);

    // Estimate transaction cost
    console.log('💸 Estimating transaction cost...');
    const estimate = await estimateTransactionCost(config, {
      to: recipient,
      value: amountInWei,
    });
    console.log(`Gas Required: ${estimate.gas}`);
    const gweiBigInt = Number(estimate.gasPrice) / Number(1000000000);
    const ethBigInt = Number(estimate.totalCost) / Number(1000000000000000000);
    console.log(`Gas Price: ${gweiBigInt} gwei`);
    console.log(`Total Cost: ${ethBigInt} ETH\n`);

    // Send transaction
    console.log('🚀 Sending transaction...');
    const txHash = await sendETH(config, recipient, amountInWei);
    console.log(`Transaction Hash: ${txHash}\n`);

    // Wait for confirmation
    console.log('⏳ Waiting for transaction confirmation...');
    const receipt = await waitForTransactionReceipt(config, txHash);
    console.log(`✅ Transaction confirmed!`);
    console.log(`Block Number: ${receipt.blockNumber}`);
    console.log(`Transaction Status: ${receipt.status === 'success' ? '✓ Success' : '✗ Failed'}`);
    console.log(`Gas Used: ${receipt.gasUsed}`);
    console.log(`Block Hash: ${receipt.blockHash}\n`);

    console.log('✅ Example 2 completed successfully!\n');
    return receipt;
  } catch (error) {
    console.error('❌ Error in Example 2:', error);
    throw error;
  }
}
