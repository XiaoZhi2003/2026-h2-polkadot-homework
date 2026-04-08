/**
 * 地址转换模块
 *
 * Polkadot 使用 32 字节的 AccountId32（SS58 编码），
 * 而 EVM 使用 20 字节的 H160 地址。
 *
 * 在 pallet-revive / AssetHub 中，两种地址的映射规则如下：
 *
 * 1. H160 → AccountId32:
 *    将 20 字节的 H160 放到前 20 字节，后 12 字节用 0xEE 填充。
 *
 * 2. AccountId32 → H160:
 *    - 如果后 12 字节全部是 0xEE（说明是 EVM 派生账户），
 *      则直接取前 20 字节作为 H160 地址。
 *    - 否则对整个 32 字节做 keccak256 哈希，取后 20 字节。
 */
import { keccak256, getBytes, getAddress } from "ethers";
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto";
import { u8aToHex, hexToU8a } from "@polkadot/util";

// Westend Asset Hub 的 SS58 prefix 为 42（通用 Substrate prefix）
const SS58_PREFIX = 42;

export type AccountId32 = Uint8Array;

// ========== SS58 编解码 ==========

/** 将 32 字节公钥/AccountId 编码为 SS58 地址 */
export function toSs58(accountId: Uint8Array): string {
  return encodeAddress(accountId, SS58_PREFIX);
}

/** 将 SS58 地址解码为 32 字节 AccountId */
export function fromSs58(ss58: string): Uint8Array {
  return decodeAddress(ss58);
}

// ========== H160 ↔ AccountId32 转换 ==========

/** 判断一个 AccountId32 是否为 EVM 派生地址（后 12 字节全为 0xEE） */
function isEthDerived(accountId: AccountId32): boolean {
  if (accountId.length !== 32) return false;
  for (let i = 20; i < 32; i++) {
    if (accountId[i] !== 0xee) return false;
  }
  return true;
}

/**
 * H160 (EVM 地址) → AccountId32
 * 填充规则: [20 bytes H160] + [12 bytes 0xEE]
 */
export function h160ToAccountId32(h160Address: string): AccountId32 {
  const normalizedAddress = getAddress(h160Address); // checksum 化
  const addressBytes = getBytes(normalizedAddress);
  if (addressBytes.length !== 20) {
    throw new Error(`H160 地址必须是 20 字节, 实际为 ${addressBytes.length}`);
  }
  const accountId = new Uint8Array(32);
  accountId.fill(0xee);
  accountId.set(addressBytes, 0);
  return accountId;
}

/**
 * AccountId32 → H160 (EVM 地址)
 * 如果是 EVM 派生 → 取前 20 字节
 * 否则 → keccak256(accountId32) 取后 20 字节
 */
export function accountId32ToH160(accountId: AccountId32): string {
  if (accountId.length !== 32) {
    throw new Error(`AccountId32 必须是 32 字节, 实际为 ${accountId.length}`);
  }
  if (isEthDerived(accountId)) {
    const h160Bytes = accountId.slice(0, 20);
    const hex = "0x" + Buffer.from(h160Bytes).toString("hex");
    return getAddress(hex);
  } else {
    const hash = keccak256(accountId);
    const hashBytes = getBytes(hash);
    const h160Bytes = hashBytes.slice(12, 32);
    const hex = "0x" + Buffer.from(h160Bytes).toString("hex");
    return getAddress(hex);
  }
}

// ========== 便捷组合转换 ==========

/** SS58 地址 → H160 地址 */
export function ss58ToH160(ss58: string): string {
  const accountId = fromSs58(ss58);
  return accountId32ToH160(accountId);
}

/** H160 地址 → SS58 地址 */
export function h160ToSs58(h160: string): string {
  const accountId = h160ToAccountId32(h160);
  return toSs58(accountId);
}
