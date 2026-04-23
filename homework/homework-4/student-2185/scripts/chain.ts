import { defineChain } from 'viem'

export const polkadot = defineChain({
  id: 420420417,
  name: 'polkadot',
  nativeCurrency: {
    name: "PAS",
    symbol: "PAS",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://eth-rpc-testnet.polkadot.io/"]
    }
  },
  blockExplorers: {
    default: {
      name: "explorer",
      url: "https://blockscout-testnet.polkadot.io/"
    }
  }
})
