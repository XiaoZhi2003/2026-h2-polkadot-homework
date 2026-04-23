import test from "node:test";
import assert from "node:assert/strict";
import { deployCounter } from "../scripts/deploy-counter.ts";

test("deploy script deploys Counter on the simulated hardhat chain", async () => {
  process.env.HOME = "/tmp/codex-home";
  process.env.XDG_CACHE_HOME = "/tmp";

  const { contract, hash, receipt } = await deployCounter("hardhatMainnet");

  assert.match(contract.address, /^0x[a-fA-F0-9]{40}$/);
  assert.match(hash, /^0x[a-fA-F0-9]+$/);
  assert.equal(receipt.blockNumber, 1n);
});
