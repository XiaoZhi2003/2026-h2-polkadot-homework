# Homework 2 - student-1964

使用 `ethers` / `viem` / `PAPI` 连接 **Polkadot Testnet (Westend Asset Hub)**，完成：

1. 地址转换（H160 <-> SS58）
2. 余额一致性测试（ethers vs viem vs PAPI）
3. 选择并调用一个 precompile（SHA256 预编译 `0x...02`）

## 目录结构

```
student-1964/
├── src/
│   ├── utils.ts
│   ├── address.ts
│   ├── task1-address-and-balance.ts
│   └── task2-precompile.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 网络配置

- EVM RPC fallback 列表（按顺序自动重试）:
  - `https://westend-asset-hub-eth-rpc.polkadot.io`
  - `https://westend-asset-hub-rpc.polkadot.io`
  - `https://westend-asset-hub-rpc.dwellir.com`
- Substrate WS RPC: `wss://westend-asset-hub-rpc.polkadot.io`
- Chain: Westend Asset Hub

## 安装

```bash
cd /root/2026-h2-building-production-grade-dApps/homework/homework-2/student-1964
npm install
```

本作业中 PAPI 使用 `@polkadot/api` 直接通过 WS 连接链上节点读取 `system.account`。

## 运行

### Task 1: 地址转换 + 余额一致性

```bash
npm run task1
```

输出会包含：

- H160 -> SS58
- SS58 -> H160 回转校验
- ethers / viem / PAPI 余额
- 一致性判断结果

> 注意：不同链实现下 EVM 单位与 Substrate balance 单位可能存在精度差（本示例按 `18 vs 12` 缩放后比对，并设置容差）。

### Task 2: precompile 调用

```bash
npm run task2
```

本实现选择：

- `0x0000000000000000000000000000000000000002`（SHA256 precompile）

并分别通过：

- `ethersProvider.call(...)`
- `viemClient.call(...)`

调用同一 precompile，再与本地 `sha256` 计算结果进行对比。

当某个 RPC 返回错误时，脚本会自动切换到下一个 endpoint（fallback），并在输出中打印每次失败原因与最终成功的 RPC。

## 可修改项

- `src/task1-address-and-balance.ts` 中的 `TEST_H160` 可以改为你自己的测试地址（建议有余额）。