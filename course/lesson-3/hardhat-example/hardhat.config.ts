import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";

// If you want to use a variable for your private key
import { vars } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    polkadotTestnet: {
      url: 'https://services.polkadothub-rpc.com/testnet',
      chainId: 420420417,
      accounts: [vars.get('PRIVATE_KEY')],
    },
  },
  etherscan: {
    apiKey: {
      polkadotTestnet: 'no-api-key-needed',
    },
    customChains: [
      {
        network: 'polkadotTestnet',
        chainId: 420420417,
        urls: {
          apiURL: 'https://blockscout-testnet.polkadot.io/api',
          browserURL: 'https://blockscout-testnet.polkadot.io/',
        },
      },
    ],
  },
};

export default config;
