/**
 * Example 4: Reading and Updating Contract State
 */

import { BlockchainConfig } from '../utils/client';
import { readState, updateState, getStateSnapshot } from '../state';
import { COUNTER_ABI, ERC20_ABI } from '../contracts/abi';

export async function exampleReadAndUpdateState(
  config: BlockchainConfig,
  contractAddress: string
) {
  console.log('=== Example 4: Reading and Updating Contract State ===\n');

  try {
    const contract = contractAddress as `0x${string}`;

    // Example 4a: Read counter state
    console.log('📖 Reading contract state...');
    console.log(`Reading count from ${contract}...\n`);

    const currentCount = await readState(config, {
      contract,
      functionName: 'count',
      abi: COUNTER_ABI,
    });

    console.log(`Current count: ${currentCount}\n`);

    // Example 4b: Update counter state
    console.log('✍️  Updating contract state...');
    console.log('Calling increment()...\n');

    try {
      const updateReceipt = await updateState(config, {
        contract,
        functionName: 'increment',
        abi: COUNTER_ABI,
      });

      console.log(`✅ State updated!`);
      console.log(`Transaction Hash: ${updateReceipt.transactionHash}`);
      console.log(`Block Number: ${updateReceipt.blockNumber}\n`);

      // Read updated state
      const updatedCount = await readState(config, {
        contract,
        functionName: 'count',
        abi: COUNTER_ABI,
      });

      console.log(`Updated count: ${updatedCount}\n`);
    } catch (error) {
      console.warn('⚠️  State update requires write permission (private key)');
      console.log('Continuing with read-only examples...\n');
    }

    // Example 4c: Get state snapshot
    console.log('📸 Getting state snapshot...');
    const snapshot = await getStateSnapshot(config, {
      contract,
      stateVars: [
        {
          name: 'count',
          functionName: 'count',
          abi: COUNTER_ABI,
        },
      ],
    });

    console.log('State Snapshot:');
    console.log(JSON.stringify(snapshot, null, 2));
    console.log();

    // Example 4d: Query ERC20 token state (if contract is ERC20)
    console.log('🔍 ERC20 Contract State Example:');
    console.log('(This example shows how to query ERC20 state)\n');

    const erc20StateVars = [
      {
        name: 'totalSupply',
        functionName: 'totalSupply',
        abi: ERC20_ABI,
      },
      {
        name: 'balanceOf',
        functionName: 'balanceOf',
        abi: ERC20_ABI,
        args: ['0x0000000000000000000000000000000000000000'],
      },
    ];

    try {
      const erc20Snapshot = await getStateSnapshot(config, {
        contract,
        stateVars: erc20StateVars,
      });

      console.log('ERC20 State:');
      console.log(JSON.stringify(erc20Snapshot, null, 2));
    } catch {
      console.log('(Contract is not ERC20 or state unavailable)\n');
    }

    console.log('✅ Example 4 completed successfully!\n');
  } catch (error) {
    console.error('❌ Error in Example 4:', error);
    throw error;
  }
}
