import { createWalletClient, createPublicClient, encodeFunctionData, http, parseEther } from 'viem'

import { privateKeyToAccount } from 'viem/accounts'
import dotenv from 'dotenv'
dotenv.config()

// 配置Polkadot Hub链信息
const POLKADOT_HUB = {
    id: 420420417,
    name: 'Polkadot Hub TestNet',
    network: 'Polkadot Hub TestNet',
    nativeCurrency: {
        decimals: 18,
        name: 'PAS',
        symbol: 'PAS',
    },
    rpcUrls: {
        default: {
            http: ['https://eth-rpc-testnet.polkadot.io'],
        },
    },
}

async function main() {

    // 私钥推导账户地址
    const account = privateKeyToAccount(process.env.PRIVATE_KEY)

    console.log('Account Address:', account.address)

    // 创建客户端实例，连接到Polkadot Hub测试网络
    const client = createPublicClient({
        chain: POLKADOT_HUB,
        transport: http(),
    })

    // 获取账户余额
    const balance = await client.getBalance({
        address: account.address,
    })

    console.log('Account Balance:', balance)

}

main().catch((error) => {
    console.error('Error executing main function:', error);
    process.exit(1);
});


