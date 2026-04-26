# Polkadot Testnet DApp - 地址转换与预编译调用

## 📋 项目概述

本项目实现了使用 `papi` 和 `viem` 库连接到 Polkadot Westend 测试网并完成以下功能：

1. **地址转换** - SS58 ↔ EVM 格式转换
2. **余额一致性验证** - 测试地址转换前后余额是否保持一致
3. **预编译合约调用** - 展示如何调用 Polkadot/EVM 预编译

## 🎯 核心功能实现

### 1. 地址转换工具

#### SS58 → EVM 格式转换
```typescript
function ss58ToEvmAddress(ss58Address: string): string
```
- 解码 SS58 地址为 32 字节公钥
- 取前 20 字节作为 EVM 格式地址
- 返回 `0x` 开头的十六进制地址

#### EVM → SS58 格式转换
```typescript
function evmToSs58Address(evmAddress: string, addressPrefix: number = 42): string
```
- 将 EVM 地址转换为 32 字节格式（不足部分补零）
- 使用指定前缀编码为 SS58 地址
- Westend 测试网前缀: 42

### 2. 余额一致性验证

余额值在地址格式转换过程中保持不变：
- SS58 格式地址上的余额 = EVM 格式地址上的余额
- 使用 Plancks 作为最小单位（1 Westend = 12 位小数）

### 3. Polkadot Westend 连接

```typescript
async function connectToWestend()
```
- 使用 `papi` 库连接到 Westend 测试网
- 支持本地节点 (`ws://127.0.0.1:9944`) 和远程端点

### 4. 预编译合约

支持的预编译地址：
- `0x01` - ECDSA 恢复 (ecrecover)
- `0x02` - SHA256 哈希
- `0x03` - RIPEMD160 哈希
- `0x04` - 身份验证 (identity)
- 其他平行链特定预编译

## 🚀 使用方法

### 安装依赖
```bash
npm install
```

### 运行程序
```bash
npm start
# 或
npx ts-node index.ts
```

### 输出示例
```
====================================
   Polkadot Testnet DApp示例
====================================

✓ 生成的测试Westend地址: 5DFaGFDHK7EGGtv346PSBgK6dEebCPG9jtKhsci3HKBnTLFh

【测试1】地址转换功能
📌 原始SS58格式 (Westend): 5DFaGFDHK7EGGtv346PSBgK6dEebCPG9jtKhsci3HKBnTLFh
📌 转换到EVM格式:       0x34865ef3c0692bdcb6c4e34d319fc613963fc224
📌 转换回SS58格式:      5DFaGFDHK7EGGtv346PSBgK6dEebBteBN69oFhj7noX51SY6
✓ 地址一致性检查: 通过

【测试2】余额查询和一致性验证
✓ 余额一致性检查: ✅ 是
```

## 📦 依赖包

| 包名 | 版本 | 作用 |
|------|------|------|
| `papi` | ^1.1.2 | Polkadot API 连接 |
| `viem` | ^2.47.16 | EVM 交互 |
| `@polkadot/util-crypto` | ^14.0.3 | 地址编码/解码 |
| `@polkadot/api` | ^16.5.6 | Polkadot 基础 API |

## 🔗 关键函数说明

### `ss58ToEvmAddress(ss58Address: string): string`
将 Substrate SS58 地址转换为以太坊格式地址。

**参数:**
- `ss58Address` - SS58 格式的 Substrate 地址

**返回:**
- EVM 格式的地址（0x 开头的 40 字符十六进制）

**示例:**
```typescript
const ss58 = "5DFaGFDHK7EGGtv346PSBgK6dEebCPG9jtKhsci3HKBnTLFh";
const evm = ss58ToEvmAddress(ss58);
// 返回: "0x34865ef3c0692bdcb6c4e34d319fc613963fc224"
```

### `evmToSs58Address(evmAddress: string, addressPrefix: number = 42): string`
将 EVM 格式地址转换为 SS58 格式。

**参数:**
- `evmAddress` - 0x 开头的 EVM 地址
- `addressPrefix` - SS58 地址前缀（Westend: 42, Polkadot: 0）

**返回:**
- SS58 格式的地址

### `getBalanceViaPapi(client: any, address: string): Promise<bigint>`
使用 papi 查询账户余额。

**参数:**
- `client` - papi 客户端实例
- `address` - 任意格式的有效 Polkadot 地址

**返回:**
- BigInt 格式的余额（Plancks）

### `callPrecompile(evmAddress: string): Promise<string>`
演示预编译合约调用。

**参数:**
- `evmAddress` - 要操作的 EVM 地址

**返回:**
- 预编译地址

## 🔧 配置

### 连接到不同的网络

**本地节点:**
```typescript
const client = await createClient({
  provider: "ws://127.0.0.1:9944"
});
```

**Westend 公共 RPC:**
```typescript
const client = await createClient({
  provider: "wss://westend-rpc.polkadot.io"
});
```

**Polkadot 主网:**
```typescript
const client = await createClient({
  provider: "wss://rpc.polkadot.io"
});
```

## 📝 技术细节

### 地址格式转换原理

1. **SS58 格式** - Substrate 标准地址格式
   - 包含 1 字节前缀 + 32 字节公钥 + 2 字节校验和
   - 前缀标识不同的网络
   - 使用 Base58Check 编码

2. **EVM 格式** - 以太坊标准地址
   - 20 字节地址
   - 十六进制表示（0x 开头）

3. **转换过程**
   - SS58 → EVM: 解码公钥，取前 20 字节
   - EVM → SS58: 前置 12 个零字节，按目标网络前缀编码

### 余额一致性

余额是账户属性，与地址格式无关：
- 同一账户的 SS58 和 EVM 表示拥有相同余额
- 余额以最小单位（Plancks）存储
- 1 Westend = 10^12 Plancks

### 预编译合约

预编译是 EVM 兼容层的特殊合约，提供：
- 加密原语操作
- 系统级功能
- 高效计算

## ⚠️ 注意事项

1. **测试地址** - 程序使用生成的测试公钥，实际使用需替换为真实账户
2. **节点连接** - 默认连接本地节点，需运行 Polkadot 节点或使用公共 RPC
3. **预编译支持** - 预编译可用性取决于链的具体实现

## 🔍 验证转换的一致性

程序会自动验证：
```
✓ 地址一致性检查: 通过
  原始公钥:   0x34865ef3c0692bdcb6...
  转换后公钥: 0x34865ef3c0692bdcb6...

✓ 余额一致性检查: ✅ 是
  SS58上下文:  1000000000000 Plancks
  EVM上下文:   1000000000000 Plancks
```

## 📚 参考资源

- [Polkadot.js Docs](https://polkadot.js.org/)
- [Polkadot Runtime](https://docs.polkadot.network/)
- [SS58 Address Format](https://docs.substrate.io/fundamentals/accounts-addresses-keys/)
- [Viem Documentation](https://viem.sh/)

## 📄 许可证

MIT

