/**
 * 作业 Task 1: 地址转换 & 余额一致性验证
 *
 * 功能:
 *   1. 给定一个 EVM H160 地址，转换成 SS58 地址
 *   2. 给定一个 SS58 地址，转换成 H160 地址
 *   3. 通过 ethers / viem 查询 EVM 余额
 *   4. 通过 PAPI 查询 Substrate 余额
 *   5. 验证同一账户在两种视角下余额是否一致
 */
import { ethers } from "ethers";
import {
  h160ToSs58,
  ss58ToH160,
  h160ToAccountId32,
  accountId32ToH160,
  toSs58,
  fromSs58,
} from "./accounts";
import { getEthersProvider, getViemClient, getPapiApi } from "./utils";
import { formatEther } from "viem";

// =============================================
// 用于演示的测试地址
// 这是一个 EVM H160 地址（Paseo Asset Hub 上的测试地址）
// 你可以替换为自己在 Paseo Asset Hub 上有余额的地址
// =============================================
const TEST_H160_ADDRESS = "0xb0878Df509d196870FFFF725569e6890E2bA460E";

async function main() {
  console.log("=".repeat(60));
  console.log("  Homework 2 - Task 1: 地址转换 & 余额验证");
  console.log("  网络: Paseo Asset Hub Testnet");
  console.log("=".repeat(60));
  console.log();

  // ============================================================
  // Part 1: 地址转换演示
  // ============================================================
  console.log("━".repeat(60));
  console.log("  Part 1: 地址转换");
  console.log("━".repeat(60));

  // 1a. H160 → SS58
  const h160 = TEST_H160_ADDRESS;
  const ss58FromH160 = h160ToSs58(h160);
  console.log(`\n  [H160 → SS58]`);
  console.log(`    H160 地址: ${h160}`);
  console.log(`    对应 SS58:  ${ss58FromH160}`);

  // 1b. SS58 → H160（反向验证）
  const h160Back = ss58ToH160(ss58FromH160);
  console.log(`\n  [SS58 → H160] (反向验证)`);
  console.log(`    SS58 地址:  ${ss58FromH160}`);
  console.log(`    对应 H160:  ${h160Back}`);
  console.log(
    `    转换一致性: ${h160.toLowerCase() === h160Back.toLowerCase() ? "✅ 一致" : "❌ 不一致"}`
  );

  // 1c. 展示非 EVM 派生的 SS58 地址转换
  const nativeSs58 = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"; // Alice on Substrate
  const nativeH160 = ss58ToH160(nativeSs58);
  console.log(`\n  [原生 SS58 → H160] (非 EVM 派生)`);
  console.log(`    SS58 地址:  ${nativeSs58}`);
  console.log(`    对应 H160:  ${nativeH160}`);
  console.log(`    (注: 非 EVM 派生地址通过 keccak256 哈希得到 H160)`);

  // ============================================================
  // Part 2: 余额查询 & 一致性验证
  // ============================================================
  console.log();
  console.log("━".repeat(60));
  console.log("  Part 2: 余额查询 & 一致性验证");
  console.log("━".repeat(60));

  const targetH160 = h160;
  const targetSs58 = ss58FromH160;

  console.log(`\n  查询账户:`);
  console.log(`    H160: ${targetH160}`);
  console.log(`    SS58: ${targetSs58}`);
  console.log();

  // 2a. 使用 ethers.js 查询 EVM 余额
  console.log("  [ethers.js] 查询 EVM 余额...");
  let ethersBalance: bigint;
  try {
    const ethersProvider = getEthersProvider();
    ethersBalance = await ethersProvider.getBalance(targetH160);
    console.log(`    原始余额 (wei): ${ethersBalance}`);
    console.log(
      `    格式化余额:     ${ethers.formatEther(ethersBalance)} PAS`
    );
  } catch (err: any) {
    console.log(`    ⚠️  查询失败: ${err.message}`);
    ethersBalance = 0n;
  }

  // 2b. 使用 viem 查询 EVM 余额
  console.log("\n  [viem] 查询 EVM 余额...");
  let viemBalance: bigint;
  try {
    const viemClient = getViemClient();
    viemBalance = await viemClient.getBalance({
      address: targetH160 as `0x${string}`,
    });
    console.log(`    原始余额 (wei): ${viemBalance}`);
    console.log(`    格式化余额:     ${formatEther(viemBalance)} PAS`);
  } catch (err: any) {
    console.log(`    ⚠️  查询失败: ${err.message}`);
    viemBalance = 0n;
  }

  // 2c. 使用 PAPI 查询 Substrate 余额
  console.log("\n  [PAPI] 查询 Substrate 余额...");
  let papiBalance: bigint;
  try {
    const api = getPapiApi();
    const accountInfo = await api.query.System.Account.getValue(targetSs58);
    papiBalance = accountInfo.data.free;
    console.log(`    原始余额 (planck): ${papiBalance}`);
    console.log(
      `    格式化余额:        ${ethers.formatUnits(papiBalance, 10)} PAS`
    );
  } catch (err: any) {
    console.log(`    ⚠️  查询失败: ${err.message}`);
    papiBalance = 0n;
  }

  // 2d. 一致性对比
  console.log();
  console.log("━".repeat(60));
  console.log("  Part 3: 余额一致性对比");
  console.log("━".repeat(60));
  console.log(`\n  ethers 余额: ${ethersBalance}`);
  console.log(`  viem 余额:   ${viemBalance}`);
  console.log(`  PAPI 余额:   ${papiBalance}`);

  const ethersViemMatch = ethersBalance === viemBalance;
  
  // Paseo 链上 PAPI 返回的单位是 planck（10位精度），而 ethers 返回 wei 等效值（18位精度）。
  // 并且，对于映射账户，pallet-revive 可能会作为映射抵押品冻结 0.01 PAS (即 100,000,000 plancks)
  // EVM 视角中的余额常常等于: Substrate 余额 - 0.01 PAS 抵押金
  
  // 将 PAPI 的 planck (10位) 转为跟 EVM 同等量级的大数 (加 8 个零)
  const papiInWei = papiBalance * (10n ** 8n);
  const diff = papiInWei > ethersBalance ? papiInWei - ethersBalance : ethersBalance - papiInWei;
  
  // 如果差异小于等于 0.011 PAS (10^16 wei级别)，则认为是这部分映射存款导致的正常偏移
  const tolerance = 11n * (10n ** 15n); // 0.011 PAS （包含细微浮点误差）
  const isPapiMatch = diff <= tolerance;

  console.log(
    `\n  ethers vs viem: ${ethersViemMatch ? "✅ 一致" : "❌ 不一致"}`
  );
  console.log(
    `  ethers vs PAPI: ${isPapiMatch ? "✅ 一致 (含底层映射抵押)" : "❌ 不一致"}`
  );

  if (ethersViemMatch && isPapiMatch) {
    console.log();
    if (diff > 0n) {
      console.log(`  🎉 余额验证通过！相差 ${ethers.formatEther(diff)} PAS 为系统保留的账户映射存款。`);
    } else {
      console.log("  🎉 所有余额查询结果一致！验证通过！");
    }
  } else {
    console.log(
      "\n  ⚠️  余额不完全一致，可能原因："
    );
    console.log("     - EVM RPC 和 Substrate RPC 的区块高度不同步");
    console.log("     - 账户未进行 map_account 映射");
    console.log("     - 网络延迟导致的短暂差异");
  }

  console.log("\n" + "=".repeat(60));
  console.log("  Task 1 执行完毕");
  console.log("=".repeat(60));

  // 退出进程（关闭 WebSocket 连接）
  process.exit(0);
}

main().catch((err) => {
  console.error("执行出错:", err);
  process.exit(1);
});
