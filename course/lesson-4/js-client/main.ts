import { createPublicClient, defineChain, http, hexToBigInt, createWalletClient, parseEther, getContract } from "viem"
import { ABI, BYTECODE } from "./erc20"
import { privateKeyToAccount } from "viem/accounts"

import dotenv from "dotenv"
dotenv.config()
export const localChain = (url: string) => defineChain({
    id: 420420420,
    name: 'Polkadot Hub TestNet',
    network: 'Polkadot Hub TestNet',
    nativeCurrency: {
        name: 'PAS',
        symbol: 'PAS',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: [url],
        },
    },
    testnet: true,
})
async function main() {
    const privateKey = "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133"
    const url = "http://localhost:8545"
    const account = privateKeyToAccount(privateKey)
    const publicClient = createPublicClient({ chain: localChain(url), transport: http() })
    const walletClient = createWalletClient({ chain: localChain(url), transport: http(), account: account })
    const to = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

    const tx = await walletClient.deployContract({
        abi: ABI,
        bytecode: BYTECODE,
        args: ["name", "symbol", 18, 123]
    })
    console.log(`tx is ${tx}`)
    const receipt = await publicClient.waitForTransactionReceipt({ hash: tx })
    console.log(`receipt is ${receipt?.blockNumber}`)
    const contractAddress = receipt?.contractAddress
    console.log(`contractAddress is ${contractAddress}`)

    const contract = getContract({
        address: contractAddress as `0x${string}`,
        abi: ABI,
        client: walletClient
    })
    const transfer = await contract.write.transfer([to, 123])
    console.log(`transfer is ${transfer}`)
    const receipt2 = await publicClient.waitForTransactionReceipt({ hash: transfer })
    console.log(`receipt2 is ${receipt2?.blockNumber}`)
    const balance = await contract.read.balanceOf([to])
    console.log(`balance is ${balance}`)
}

main().catch((error) => {
    console.error(error)
})
