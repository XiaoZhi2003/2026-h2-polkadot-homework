import "dotenv/config"
import { createPublicClient, http } from 'viem'
import type { Hex } from 'viem'
import { privateKeyToAccount } from "viem/accounts"
import { polkadot } from "./chain.ts";
import { log } from "console";


async function main() {
  const publicClient = createPublicClient({
    chain: polkadot,
    transport: http(process.env.RPC_URL)
  })
  // get block
  const latestBlock = await publicClient.getBlockNumber()
  log("latestBlock = ", latestBlock.toString())

  const account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)
  // get balance
  const balance = await publicClient.getBalance({ address: account.address })
  log(`address :${account.address} balance:${balance}`)
}

main().catch(console.error)
