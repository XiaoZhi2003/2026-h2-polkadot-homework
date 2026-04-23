import "dotenv/config"
import { createPublicClient, createWalletClient, http, parseEther } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { polkadot } from "./chain.ts"
import { log } from "console"



async function main() {
  const account = privateKeyToAccount(process.env.PRIVATE_KEY)

  const publicClient = createPublicClient({
    chain: polkadot,
    transport: http(process.env.RPC_URL)
  })

  const walletClient = createWalletClient({
    account,
    chain: polkadot,
    transport: http(process.env.RPC_URL)
  })

  const hash = await walletClient.sendTransaction({
    account,
    to: "0xd0a3e4257D8326160FcE3ac37f233Afc9fe86673",
    value: parseEther("1")
  });
  log("tx hash = ", hash)

  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  log("status = ", receipt.status)
}

main().catch(console.error)
