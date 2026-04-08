# Homework 2 - Student 2204

## 作业要求

使用 ethers/viem 和 PAPI 连接到 Polkadot Testnet（Westend Asset Hub），完成:

1. **地址转换 & 余额验证** — SS58 ↔ H160 地址互转，并验证 balance 一致性
2. **调用 Precompile** — 选择 EVM 预编译合约进行调用

## 技术栈

| 工具 | 用途 |
|------|------|
| **ethers.js** | EVM JSON-RPC 交互 |
| **viem** | EVM JSON-RPC 交互（替代方案） |
| **polkadot-api (PAPI)** | Substrate 原生 API 交互 |
| **@polkadot/util-crypto** | SS58 编解码 |
| **tsx** | TypeScript 直接执行 |

## 网络配置

- **网络**: Westend Asset Hub (Testnet)
- **EVM RPC**: `https://westend-asset-hub-eth-rpc.polkadot.io`
- **WS RPC**: `wss://westend-asset-hub-rpc.polkadot.io`
- **Chain ID**: 420420421

## 安装 & 运行

```bash
# 安装依赖
npm install

# 运行 Task 1: 地址转换 & 余额验证
npm run task1

# 运行 Task 2: 调用 Precompile
npm run task2
```

## 项目结构

```
src/
├── accounts.ts                 # 地址转换模块 (SS58 ↔ H160)
├── utils.ts                    # 工具模块 (Provider / Client 工厂)
├── task1-address-conversion.ts # Task 1 主程序
└── task2-precompile.ts         # Task 2 主程序
```

## Task 1: 地址转换

### 转换规则 (pallet-revive)

- **H160 → AccountId32**: `[20 bytes H160] + [12 bytes 0xEE padding]`
- **AccountId32 → H160**:
  - 如果后 12 字节全为 `0xEE`（EVM 派生）: 取前 20 字节
  - 否则: `keccak256(AccountId32)` 取后 20 字节

### 余额验证

分别使用 ethers.js、viem、PAPI 查询同一账户余额，验证一致性。

## Task 2: Precompile 调用

调用了 3 个标准 EVM 预编译合约:

| 地址 | 名称 | 功能 |
|------|------|------|
| `0x01` | ecRecover | 从签名恢复地址 |
| `0x02` | SHA-256 | 计算 SHA-256 哈希 |
| `0x04` | Identity | 原样返回输入数据 |

每个预编译都使用 ethers.js 和 viem 两种方式调用并验证结果。
