import { artifacts, network } from "hardhat";
import type { Hex } from "viem";

import { deployContractAndWait } from "./deploy-helper.ts";

export async function deployCounter(networkName?: string) {
  const { viem } =
    networkName === undefined
      ? await network.create()
      : await network.create(networkName);

  const [publicClient, walletClients, artifact] = await Promise.all([
    viem.getPublicClient(),
    viem.getWalletClients(),
    artifacts.readArtifact("Counter"),
  ]);
  const [walletClient] = walletClients;

  if (walletClient === undefined) {
    throw new Error("No wallet client is available for deployment.");
  }

  return deployContractAndWait({
    abi: artifact.abi,
    bytecode: artifact.bytecode as Hex,
    contractName: "Counter",
    getContractAt: (name, address) => viem.getContractAt(name, address),
    publicClient,
    walletClient,
  });
}
