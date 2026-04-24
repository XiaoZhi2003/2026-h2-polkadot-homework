# Viem Blockchain Development Project

A comprehensive TypeScript project demonstrating blockchain development operations using Viem.

## Features

### 1. **Blockchain Connection** 
- Connect to any EVM-compatible blockchain
- Support for different networks (Mainnet, Sepolia, etc.)
- Public and wallet client setup

### 2. **Basic Data Queries**
- Get latest block information
- Query block by number
- Get transaction details and receipts
- Query account balances and nonces
- Get current gas prices
- Estimate gas for transactions
- Get block transaction counts

### 3. **Transaction Sending**
- Send simple ETH transfers
- Send custom transactions
- Estimate transaction costs
- Wait for transaction confirmation
- Contract interaction transactions

### 4. **Smart Contract Deployment**
- Deploy new contracts
- Verify contract deployment
- Get contract bytecode
- Check if address is a contract

### 5. **State Management**
- Read contract state variables
- Update contract state
- Batch state operations
- Get state snapshots
- Watch for state changes
- Support for standard ABIs (ERC20)

## Project Structure

```
├── src/
│   ├── utils/
│   │   ├── client.ts           # Blockchain client setup
│   │   ├── queries.ts          # Data query functions
│   │   ├── transactions.ts     # Transaction operations
│   │   ├── contracts.ts        # Contract interactions
│   │   └── index.ts            # Utils exports
│   ├── contracts/
│   │   ├── deployer.ts         # Contract deployment
│   │   └── abi.ts              # Standard contract ABIs
│   ├── state/
│   │   └── index.ts            # State management
│   ├── examples/
│   │   ├── 1-connection.ts     # Connection examples
│   │   ├── 2-transactions.ts   # Transaction examples
│   │   ├── 3-deployment.ts     # Deployment examples
│   │   └── 4-state.ts          # State management examples
│   └── index.ts                # Main entry point
├── package.json
├── tsconfig.json
├── .env                        # Environment variables
├── .env.example                # Example environment variables
└── README.md
```

## Installation

### Prerequisites
- Node.js >= 18
- npm or yarn

### Steps

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:

### RPC URL Options (选择一个RPC端点)
```env
# 免费的Sepolia测试网RPC (推荐用于测试)
RPC_URL=https://rpc.sepolia.org

# 其他免费RPC选项:
# RPC_URL=https://ethereum-sepolia.publicnode.com
# RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
# RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# 主网 (需要API密钥):
# RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
# RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
```

### Private Key (私钥配置)
```env
# ⚠️  重要安全警告 ⚠️
# 永远不要使用真实的以太坊私钥进行测试！
# 下面是测试用的私钥，仅用于开发环境

# Hardhat默认账户私钥 (测试用)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb476c6b8d8d7a8b8b8b8b8b8b8b

# 如何获得测试私钥:
# 1. 使用MetaMask创建新账户 (测试网)
# 2. 导出私钥 (仅用于测试!)
# 3. 或者使用在线工具生成测试账户
```

### Chain ID (网络ID)
```env
# Sepolia测试网
CHAIN_ID=11155111

# Ethereum主网
# CHAIN_ID=1
```

## Getting Test Resources (获取测试资源)

### 1. RPC Endpoints (RPC端点)
由于你本地不运行区块链节点，你需要使用公共RPC服务：

**免费选项 (推荐用于学习):**
- `https://rpc.sepolia.org` - Sepolia测试网
- `https://ethereum-sepolia.publicnode.com` - 另一个免费的Sepolia节点

**商业RPC服务 (需要注册):**
- **Infura**: https://infura.io/ (免费额度)
- **Alchemy**: https://alchemy.com/ (免费额度)
- **QuickNode**: https://quicknode.com/ (免费额度)

### 2. Test ETH (测试代币)
要在Sepolia测试网上发送交易，你需要测试ETH：

**Sepolia Faucet (水龙头):**
- https://sepoliafaucet.com/
- https://faucet.quicknode.com/
- https://infura.io/faucet/sepolia

### 3. Private Keys (私钥)
**⚠️ 安全警告:**
- 永远不要使用真实的以太坊私钥进行测试
- 测试私钥应该只用于开发环境
- 不要在代码中硬编码真实私钥

**获取测试私钥的方法:**
1. **使用MetaMask:**
   - 安装MetaMask浏览器扩展
   - 创建新账户 (专门用于测试)
   - 切换到Sepolia测试网
   - 从账户设置中导出私钥

2. **使用在线工具:**
   - 访问 https://vanity-eth.tk/ 生成新地址
   - 或者使用 https://iancoleman.io/bip39/ 生成测试账户

3. **使用Hardhat默认账户:**
   - 项目中已配置了Hardhat的默认测试私钥
   - 仅用于本地开发和测试

## Usage

### Build the project

```bash
npm run build
```

### Run examples

```bash
npm run dev
```

This will run all examples demonstrating:
- Blockchain connection and data queries
- Transaction sending (if private key is configured)
- Smart contract deployment (if private key is configured)
- State reading and updating

## API Documentation

### Client Functions

#### `getPublicClient(config: BlockchainConfig)`
Creates a public client for read-only operations.

#### `getWalletClient(config: BlockchainConfig)`
Creates a wallet client for write operations (requires private key).

### Query Functions

- `getLatestBlock(config)` - Get latest block
- `getBlockByNumber(config, blockNumber)` - Get block by number
- `getTransaction(config, hash)` - Get transaction
- `getTransactionReceipt(config, hash)` - Get transaction receipt
- `getBalance(config, address)` - Get account balance
- `getNonce(config, address)` - Get account nonce
- `getGasPrice(config)` - Get current gas price
- `getChainId(config)` - Get network chain ID
- `estimateGas(config, params)` - Estimate gas requirement
- `getBlockTransactionCount(config, blockNumber)` - Get transaction count

### Transaction Functions

- `sendTransaction(config, params)` - Send a transaction
- `sendETH(config, to, amount)` - Send ETH
- `waitForTransactionReceipt(config, txHash)` - Wait for confirmation
- `sendContractTransaction(config, params)` - Send contract transaction
- `estimateTransactionCost(config, params)` - Estimate cost

### Contract Deployment Functions

- `deployContract(config, params)` - Deploy a contract
- `isContract(config, address)` - Check if address is contract
- `getContractBytecode(config, address)` - Get contract bytecode

### Contract Interaction Functions

- `readContract(config, params)` - Read contract state
- `writeContract(config, params)` - Write to contract
- `getContractCode(config, address)` - Get contract code
- `getStorageAt(config, address, slot)` - Get storage value
- `callContractFunction(config, params)` - Call contract function
- `multicall(config, params)` - Batch read calls

### State Management Functions

- `readState(config, params)` - Read contract state variable
- `updateState(config, params)` - Update contract state
- `watchStateChanges(config, params)` - Watch for state changes
- `readMultipleStates(config, calls)` - Read multiple states
- `batchUpdateStates(config, updates)` - Batch update states
- `getStateSnapshot(config, params)` - Get state snapshot

## Examples

### Example 1: Connect and Query

```typescript
import { getPublicClient, getLatestBlock, getBalance } from './utils';

const config = {
  rpcUrl: 'http://localhost:8545',
  chainId: 1,
};

// Get latest block
const block = await getLatestBlock(config);
console.log(`Latest block: ${block.number}`);

// Get account balance
const balance = await getBalance(config, '0x...');
console.log(`Balance: ${balance} wei`);
```

### Example 2: Send Transaction

```typescript
import { sendETH, waitForTransactionReceipt } from './utils';

const config = {
  rpcUrl: 'http://localhost:8545',
  chainId: 1,
  privateKey: 'your_private_key',
};

// Send 1 ETH
const txHash = await sendETH(config, '0x...', BigInt(1e18));

// Wait for confirmation
const receipt = await waitForTransactionReceipt(config, txHash);
console.log(`Transaction confirmed: ${receipt.blockNumber}`);
```

### Example 3: Deploy Contract

```typescript
import { deployContract } from './contracts';

const deploymentResult = await deployContract(config, {
  bytecode: '0x...',
  abi: CONTRACT_ABI,
  constructorArgs: [arg1, arg2],
});

console.log(`Contract: ${deploymentResult.contractAddress}`);
```

### Example 4: Read and Update State

```typescript
import { readState, updateState } from './state';

// Read state
const value = await readState(config, {
  contract: '0x...',
  functionName: 'getValue',
  abi: CONTRACT_ABI,
});

// Update state
const receipt = await updateState(config, {
  contract: '0x...',
  functionName: 'setValue',
  abi: CONTRACT_ABI,
  args: [newValue],
});
```

## Configuration

### Environment Variables

- `RPC_URL` - Blockchain RPC endpoint (default: `http://localhost:8545`)
- `CHAIN_ID` - Network chain ID (default: `1` for mainnet)
- `PRIVATE_KEY` - Private key for signing transactions (optional)
- `DEPLOYER_ADDRESS` - Address for contract deployment (optional)

### Supported Networks

- Ethereum Mainnet (chainId: 1)
- Sepoliatest (chainId: 11155111)
- Custom networks via RPC configuration

## Testing

To test with a local blockchain:

```bash
# Using Hardhat
npx hardhat node

# In another terminal, run the project
npm run dev
```

## Common Issues

### "No private key configured"
You need to add `PRIVATE_KEY` to `.env` for transaction sending and contract deployment.

### "Contract not found"
- Ensure the contract address is correct
- Verify the contract is deployed at the specified address
- Check the ABI matches the deployed contract

### "Insufficient funds"
Ensure your account has enough ETH for transactions and gas fees.

## Best Practices

1. **Never commit private keys** - Use `.env` files and add to `.gitignore`
2. **Always estimate gas** - Use `estimateGas()` before sending transactions
3. **Handle errors gracefully** - Wrap blockchain calls in try-catch
4. **Use checksummed addresses** - Viem handles address validation
5. **Test on testnets first** - Use Sepolia before mainnet
6. **Monitor gas prices** - Get current gas prices before sending transactions

## Advanced Usage

### Custom RPC Providers

```typescript
const config = {
  rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
  chainId: 1,
};
```

### Multiple Networks

```typescript
const mainnetConfig = { rpcUrl: '...', chainId: 1 };
const sepoliaConfig = { rpcUrl: '...', chainId: 11155111 };
```

## Resources

- [Viem Documentation](https://viem.sh)
- [Ethereum JSON-RPC](https://ethereum.org/en/developers/docs/apis/json-rpc/)
- [Smart Contract Best Practices](https://ethereum.org/en/developers/tutorials/)

## License

MIT

## Author

Blockchain Development Project

---

**Note**: This project is for educational purposes. Always test thoroughly on testnets before deploying to mainnet.
