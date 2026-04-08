/**
 * 工具模块 - 提供 ethers/viem Provider 和 PAPI API 的连接。
 * 连接到 Westend Asset Hub 测试网。
 */
import { ethers } from "ethers";
import { createPublicClient, http, defineChain } from "viem";
import { getWsProvider } from "polkadot-api/ws-provider";
import { createClient, TypedApi } from "polkadot-api";
import { wah } from "@polkadot-api/descriptors";

// ========== Paseo Asset Hub 测试网 RPC 配置 ==========
// EVM RPC (eth JSON-RPC via pallet-revive proxy)
const ETH_RPC_URL = "https://services.polkadothub-rpc.com/testnet";
// Substrate WebSocket RPC
const WS_RPC_URL = "wss://asset-hub-paseo-rpc.n.dwellir.com";

// ========== viem chain 定义 ==========
export const paseoAssetHub = defineChain({
  id: 420420417,
  name: "Paseo Asset Hub",
  nativeCurrency: { name: "Paseo", symbol: "PAS", decimals: 10 },
  rpcUrls: {
    default: { http: [ETH_RPC_URL] },
  },
  testnet: true,
});

// ========== Provider / Client 工厂 ==========

/** 获取 ethers.js JsonRpcProvider */
export function getEthersProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(ETH_RPC_URL);
}

/** 获取 viem PublicClient */
export function getViemClient() {
  return createPublicClient({
    chain: paseoAssetHub,
    transport: http(ETH_RPC_URL),
  });
}

/** 获取 PAPI TypedApi（Paseo Asset Hub） */
export function getPapiApi() {
  const provider = getWsProvider(WS_RPC_URL);
  const client = createClient(provider);
// 这里使用 dynamic import 或者使用生成的 descriptor，我们在代码中使用 any 或者强类型取决于生成。
  const { pah } = require("@polkadot-api/descriptors");
  return client.getTypedApi(pah);
}

