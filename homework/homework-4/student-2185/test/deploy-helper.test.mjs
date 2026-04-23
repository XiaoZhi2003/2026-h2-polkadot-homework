import test from "node:test";
import assert from "node:assert/strict";

import { deployContractAndWait } from "../scripts/deploy-helper.ts";

test("deployContractAndWait deploys by waiting for the receipt instead of querying the tx by hash", async () => {
  const calls = [];
  const abi = [];
  const bytecode = "0x6000";
  const deploymentHash = "0x1234";
  const contractAddress = "0x1111111111111111111111111111111111111111";
  const deployedContract = { address: contractAddress };

  const walletClient = {
    deployContract: async (request) => {
      calls.push({ type: "deployContract", request });
      return deploymentHash;
    },
  };

  const publicClient = {
    waitForTransactionReceipt: async ({ hash }) => {
      calls.push({ type: "waitForTransactionReceipt", hash });
      return {
        blockNumber: 42n,
        contractAddress,
      };
    },
  };

  const getContractAt = async (name, address) => {
    calls.push({ type: "getContractAt", name, address });
    return deployedContract;
  };

  const result = await deployContractAndWait({
    abi,
    bytecode,
    contractName: "Counter",
    getContractAt,
    publicClient,
    walletClient,
  });

  assert.equal(result.hash, deploymentHash);
  assert.equal(result.receipt.blockNumber, 42n);
  assert.equal(result.contract, deployedContract);
  assert.deepEqual(calls, [
    {
      type: "deployContract",
      request: {
        abi,
        args: [],
        bytecode,
        gasPrice: undefined,
      },
    },
    {
      type: "waitForTransactionReceipt",
      hash: deploymentHash,
    },
    {
      type: "getContractAt",
      name: "Counter",
      address: contractAddress,
    },
  ]);
});

test("deployContractAndWait fails clearly when the receipt has no contract address", async () => {
  const walletClient = {
    deployContract: async () => "0x5678",
  };

  const publicClient = {
    waitForTransactionReceipt: async () => ({
      blockNumber: 7n,
      contractAddress: null,
    }),
  };

  await assert.rejects(
    () =>
      deployContractAndWait({
        abi: [],
        bytecode: "0x6000",
        contractName: "Counter",
        getContractAt: async () => {
          throw new Error("should not be called");
        },
        publicClient,
        walletClient,
      }),
    /Deployment receipt did not include a contract address/,
  );
});
