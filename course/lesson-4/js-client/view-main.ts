import { createPublicClient, defineChain, http, hexToBigInt, createWalletClient, getContract } from "viem"
import { ABI, BYTECODE } from "./erc20"
import { privateKeyToAccount } from "viem/accounts"

import dotenv from "dotenv"
dotenv.config()
export const localChain = (url: string) => defineChain({
    id: 420420417,
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
    const url = "https://services.polkadothub-rpc.com/testnet"
    const publicClient = createPublicClient({ chain: localChain(url), transport: http() })
    const privateKey = dotenv.config().parsed?.PRIVATE_KEY
    if (!privateKey) {
        throw new Error("PRIVATE_KEY is not set")
    }
    const wallet = privateKeyToAccount(privateKey as `0x${string}`)

    const balance = await publicClient.getBalance({ address: wallet.address })
    console.log(`balance is ${balance}`)

    const walletClient = createWalletClient({ account: wallet, chain: localChain(url), transport: http() })
    const txHash = await walletClient.sendTransaction({ to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", value: hexToBigInt('0x10000') })
    console.log(`txHash is ${txHash}`)
    // const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
    // console.log(`receipt is ${receipt.logs}`)

    // deploy
    const contract = await walletClient.deployContract({
        abi: ABI,
        bytecode: BYTECODE,
        args: ["name", "symbol", 18, 123]
    })

    const receipt = await publicClient.waitForTransactionReceipt({ hash: contract })
    const contractAddress = receipt.contractAddress
    console.log(`contractAddress is ${contractAddress}`)
    if (typeof contractAddress !== 'string' || !contractAddress.startsWith('0x')) {
        throw new Error(`Invalid contract address: ${contractAddress}`);
    }

    // const totalSupply = await publicClient.readContract({ address: contractAddress, abi: ABI, functionName: "totalSupply", args: [] })

    // const deployedContract = getContract({ address: contractAddress, abi: ABI, client: walletClient })
    // const tx2 = await deployedContract.write.transfer(["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 10000])
    // const receipt2 = await publicClient.waitForTransactionReceipt({ hash: tx2 })

    // const erc20Balance = await publicClient.readContract({ address: contractAddress, abi: ABI, functionName: "balanceOf", args: ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"] })

    // console.log(`result is ${erc20Balance}`)

    // publicClient.watchBlockNumber({
    //     onBlockNumber: (blockNumber) => {
    //         console.log(`block is ${blockNumber}`)
    //     },
    //     onError: (error) => {
    //         console.error(`error is ${error}`)
    //     }
    // })
}
main().catch((error) => {
    console.error(error)
})
