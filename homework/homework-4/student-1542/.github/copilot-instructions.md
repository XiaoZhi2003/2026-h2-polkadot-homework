# Viem Blockchain Development Project

This is a TypeScript project demonstrating comprehensive blockchain operations using Viem.

## Project Overview

Viem blockchain application for:
- Blockchain connection and network management
- Basic data queries (blocks, transactions, accounts)
- Transaction sending
- Smart contract deployment
- State reading and updating

## Setup Progress

- [x] Create project structure
- [x] Install dependencies
- [x] Implement blockchain utilities
- [x] Create contract deployment module
- [x] Add example implementations
- [x] Verify compilation
- [x] Configure environment variables
- [x] Test blockchain connection ✅

## Quick Start

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file with your configuration:
```env
RPC_URL=https://ethereum-sepolia.publicnode.com
CHAIN_ID=11155111
PRIVATE_KEY=your_private_key_here
```

### Build
```bash
npm run build
```

### Run Examples
```bash
npm run dev
```

## Features Implemented

### 1. Blockchain Connection (`src/utils/client.ts`)
- Public client for read-only operations
- Wallet client for write operations
- Support for Mainnet and Sepolia networks

### 2. Data Queries (`src/utils/queries.ts`)
- Get latest block information
- Query block by number
- Get transaction details and receipts
- Query account balances and nonces
- Get gas prices and chain ID
- Estimate gas requirements
- Get block transaction counts

### 3. Transaction Operations (`src/utils/transactions.ts`)
- Send simple ETH transfers
- Send custom transactions
- Wait for transaction confirmation
- Send contract transactions
- Estimate transaction costs

### 4. Smart Contract Deployment (`src/contracts/deployer.ts`)
- Deploy new contracts
- Verify contract deployment
- Get contract bytecode
- Check if address is a contract

### 5. Contract Interactions (`src/utils/contracts.ts`)
- Read contract state
- Write to contract state
- Get contract code
- Get storage values
- Call contract functions
- Batch operations (multicall)

### 6. State Management (`src/state/index.ts`)
- Read contract state variables
- Update contract state
- Watch for state changes
- Batch state operations
- Get state snapshots
- Read multiple states at once

### 7. Examples (`src/examples/`)
- Example 1: Blockchain connection and data queries
- Example 2: Sending transactions
- Example 3: Smart contract deployment
- Example 4: Reading and updating contract state

## Project Structure

```
src/
├── utils/
│   ├── client.ts          # Blockchain client setup
│   ├── queries.ts         # Data query functions
│   ├── transactions.ts    # Transaction operations
│   ├── contracts.ts       # Contract interactions
│   └── index.ts           # Utils exports
├── contracts/
│   ├── deployer.ts        # Contract deployment
│   └── abi.ts             # Standard contract ABIs
├── state/
│   └── index.ts           # State management
├── examples/
│   ├── 1-connection.ts    # Connection examples
│   ├── 2-transactions.ts  # Transaction examples
│   ├── 3-deployment.ts    # Deployment examples
│   └── 4-state.ts         # State management examples
└── index.ts               # Main entry point
```

## Standard ABIs Included

- ERC20 Token Standard ABI
- Counter Contract ABI (for demonstration)
- Minimal ABI template

## Environment Variables

- `RPC_URL`: Blockchain RPC endpoint (default: https://ethereum-sepolia.publicnode.com)
- `CHAIN_ID`: Network chain ID (default: 11155111 for Sepolia)
- `PRIVATE_KEY`: Private key for signing transactions (optional)
- `DEPLOYER_ADDRESS`: Address for contract deployment (optional)

## Notes

- The project uses Viem for blockchain interactions
- TypeScript compilation generates JavaScript output even with ox library type warnings (expected)
- All functionality is demonstrated in the examples
- Private key is optional for read-only operations
- The project is production-ready for blockchain development

## Next Steps

1. Configure `.env` with your blockchain network settings
2. Run `npm run build` to compile the TypeScript code
3. Run `npm run dev` to execute the examples
4. Extend the utilities with your custom functionality
5. Use the examples as templates for your blockchain operations

