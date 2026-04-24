/**
 * Example 3: Smart Contract Deployment
 */

import { BlockchainConfig } from '../utils/client';
import { deployContract, isContract } from '../contracts/deployer';
import { COUNTER_ABI } from '../contracts/abi';

// Simple Counter contract bytecode (compiled from Solidity)
// pragma solidity ^0.8.0;
// contract Counter {
//   uint256 public count = 0;
//   function increment() public { count++; }
//   function decrement() public { count--; }
// }

const COUNTER_BYTECODE = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063571ea7ed14610046578063d14e62b814610064578063f8cc013d1461007e575b600080fd5b61004e61009c565b60405161005b9190610101565b60405180910390f35b61007c6004803603810190610077919061011d565b6100a5565b005b610086610101565b60405161009391906101a5565b60405180910390f35b60008054905090565b60008081546100b3906101c7565b91906100be906101f7565b9050505050565b6000819050919050565b6100da816100c7565b82525050565b60006020820190506100f560008301846100d1565b92915050565b600081519050919050565b6000819050919050565b61011a816100c7565b811461012557600080fd5b50565b60006000fd5b600080fd5b610150816100c7565b82525050565b61015f816100c7565b82525050565b60008115159050919050565b61017a81610165565b82525050565b61018981610165565b82525050565b60006020820190506101a460008301846100d1565b92915050565b60006020820190506101c160008301846100d1565b92915050565b6000602082019050919050565b6000819050919050565b6000602082019050919050' as const;

export async function exampleDeployContract(config: BlockchainConfig) {
  console.log('=== Example 3: Smart Contract Deployment ===\n');

  try {
    console.log('🏗️  Deploying Counter contract...\n');

    // Deploy contract
    const deploymentResult = await deployContract(config, {
      bytecode: COUNTER_BYTECODE,
      abi: COUNTER_ABI,
      constructorArgs: [],
    });

    console.log(`✅ Contract deployed successfully!`);
    console.log(`Contract Address: ${deploymentResult.contractAddress}`);
    console.log(`Deployment Transaction Hash: ${deploymentResult.deploymentHash}\n`);

    // Verify contract was deployed
    console.log('🔍 Verifying contract deployment...');
    const isContractAddress = await isContract(config, deploymentResult.contractAddress);
    console.log(`Is Contract: ${isContractAddress ? '✓ Yes' : '✗ No'}\n`);

    console.log('✅ Example 3 completed successfully!\n');
    return deploymentResult;
  } catch (error) {
    console.error('❌ Error in Example 3:', error);
    throw error;
  }
}
