import { deployCounter } from "./deploy-counter.ts";

async function main() {
  const { contract: counter, hash, receipt } = await deployCounter();

  console.log("Counter deployed to", counter.address);
  console.log("Deployment tx hash", hash);
  console.log("Deployment block", receipt.blockNumber.toString());
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
