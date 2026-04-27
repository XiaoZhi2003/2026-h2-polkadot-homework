# 🔴 Polkadot EVM DApp

> **Vue 3 + viem + @wagmi/core + vue-i18n** 全栈 DApp  
> 支持合约部署、钱包连接、合约执行调用、余额查询、状态更新、事件读取等完整功能

---

## 📦 技术栈

| 库 | 版本 | 用途 |
|----|------|------|
| Vue 3 | ^3.5 | 框架（Composition API） |
| viem | ^2.30 | EVM 底层 RPC 调用 |
| @wagmi/core | ^2.16 | 钱包连接 / 交易管理 |
| @wagmi/connectors | ^5.7 | MetaMask / Talisman 连接器 |
| vue-i18n | ^9.14 | 中英文国际化 |
| vue-router | ^4.5 | 多页面路由 |
| OpenZeppelin Contracts | ^5.1 | BKC ERC20 / ERC1363 合约依赖 |
| solc | ^0.8 | 本地生成 ABI / Bytecode |
| Vite | ^6 | 构建工具 |

---

## 🌐 支持的 Polkadot EVM 网络

| 网络 | Chain ID | 代币 | 类型 |
|------|----------|------|------|
| **Polkadot Hub TestNet** | 420420417 | PAS | Testnet ✓ 推荐测试 |

---

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器访问
http://localhost:5173
```

---

## 📁 项目结构

```
src/
├── main.js                       # 应用入口
├── App.vue                       # 根组件（含 Topbar / Footer）
├── style.css                     # 全局设计系统
│
├── i18n/
│   ├── index.js                  # createI18n + toggleLang
│   ├── zh.js                     # 中文翻译
│   └── en.js                     # English translations
│
├── router/
│   └── index.js                  # vue-router 路由配置
│
├── wagmi.config.js               # 链定义 + wagmi config + ABI + Bytecode
├── contracts/
│   ├── BKCERC1363Token.sol       # BKC ERC1363 代币源码
│   └── BKCERC1363Token.compiled.js # solc 生成的 ABI + Bytecode
│
├── composables/
│   ├── useWallet.js              # 钱包连接 / 切链 / 余额 composable
│   ├── useContract.js            # 读合约 / 写合约 / 部署 / 事件 composable
│   └── useToast.js               # 全局 toast 通知
│
├── components/
│   ├── NavBar.vue                # 侧边栏导航 + 钱包 Modal
│   └── ToastContainer.vue        # Toast 容器
│
└── views/
    ├── DashboardView.vue         # 仪表盘（余额/网络/快速操作）
    ├── DeployView.vue            # 合约部署
    ├── InteractView.vue          # 合约交互（读取/写入/事件）
    └── TransferView.vue          # 原生代币转账
```

---

## ⚡ 功能详解

### 1. 钱包连接（useWallet.js）

```js
import { useWallet } from '@/composables/useWallet.js'

const { wallet, chain, shortAddr, connectWallet, disconnectWallet, switchNetwork } = useWallet()

// 连接 MetaMask
await connectWallet('metaMask')

// 切换到 Polkadot Hub TestNet
await switchNetwork(420420417)

// 钱包状态
wallet.value.address     // '0x...'
wallet.value.balance     // '1.2345'
wallet.value.chainId     // 420420417
wallet.value.isConnected // true
```

### 2. 合约部署（useContract.js）

```js
import { useContract } from '@/composables/useContract.js'
import { BKC_TOKEN_ABI, BKC_TOKEN_BYTECODE } from '@/wagmi.config.js'

const { deploy, loading, txHash } = useContract()

// 部署合约（传入构造函数参数）
const { contractAddress, receipt } = await deploy(BKC_TOKEN_ABI, BKC_TOKEN_BYTECODE, [
  'BKC Token',
  'BKC',
  1000000n,
  wallet.value.address,
])
console.log('合约地址:', contractAddress)
```

### 3. 读取合约状态

```js
const { read } = useContract()

// 调用 view 函数
const name = await read(contractAddress, BKC_TOKEN_ABI, 'name')
const symbol = await read(contractAddress, BKC_TOKEN_ABI, 'symbol')
const totalSupply = await read(contractAddress, BKC_TOKEN_ABI, 'totalSupply')
const frozen = await read(contractAddress, BKC_TOKEN_ABI, 'isFrozen', [wallet.value.address])
```

### 4. 更新合约状态（发送交易）

```js
const { write, txHash, receipt } = useContract()

// transfer(address,uint256)
await write(contractAddress, BKC_TOKEN_ABI, 'transfer', ['0xRecipient...', 1000000000000000000n])

// approve(address,uint256)
await write(contractAddress, BKC_TOKEN_ABI, 'approve', ['0xSpender...', 1000000000000000000n])

// mint(address,uint256) - owner only
await write(contractAddress, BKC_TOKEN_ABI, 'mint', ['0xRecipient...', 1000000000000000000n])

// freeze(address) / unfreeze(address) - owner only
await write(contractAddress, BKC_TOKEN_ABI, 'freeze', ['0xAccount...'])
await write(contractAddress, BKC_TOKEN_ABI, 'unfreeze', ['0xAccount...'])
```

### 5. 查询历史事件

```js
const { fetchEvents } = useContract()

const logs = await fetchEvents(contractAddress, BKC_TOKEN_ABI, 'Transfer', 0n)
// logs[i] = { eventName, args, blockNumber, txHash }
```

### 6. 转账原生代币

```js
const { sendNative, loading, receipt } = useContract()

await sendNative('0xRecipient...', '0.01') // 0.01 PAS
```

---

## 🔤 国际化（vue-i18n）

```js
import { useI18n } from 'vue-i18n'
import { toggleLang } from '@/i18n/index.js'

const { t, locale } = useI18n()

t('wallet.connect')   // 连接钱包 / Connect Wallet
t('nav.deploy')       // 部署合约 / Deploy

// 切换语言（中英互换）
toggleLang()
```

语言配置文件：
- `src/i18n/zh.js` — 中文
- `src/i18n/en.js` — English

---

## 📄 BKCERC1363Token 合约（内置）

```bash
# 修改 src/contracts/BKCERC1363Token.sol 后重新生成 ABI / Bytecode
npm run compile:contract

# 检查 ABI / Bytecode 是否包含页面依赖的关键函数
npm run verify:contract
```

合约能力：ERC20、ERC1363 `transferAndCall/approveAndCall`、Owner 铸造、批量等额铸造、账户冻结/解冻。

---

## 🦊 支持的钱包

- **MetaMask** — 最广泛的 EVM 钱包
- **Talisman** — Polkadot 原生多链钱包（同时支持 EVM + Substrate）
- **SubWallet** — Polkadot 生态专属钱包
- **任意注入钱包** — 支持 EIP-1193 接口的浏览器钱包

---

## 🚰 获取测试代币

Polkadot Hub TestNet (ChainID: 420420417) 使用 PAS 测试币：  
👉 https://docs.polkadot.com/smart-contracts/faucet/

---

## 🔗 相关文档

- [Polkadot wagmi 文档](https://docs.polkadot.com/smart-contracts/libraries/wagmi/)
- [viem 文档](https://viem.sh/)
- [wagmi 文档](https://wagmi.sh/)
- [vue-i18n 文档](https://vue-i18n.intlify.dev/)
- [Polkadot EVM Overview](https://wiki.polkadot.network/docs/learn-smart-contracts)
