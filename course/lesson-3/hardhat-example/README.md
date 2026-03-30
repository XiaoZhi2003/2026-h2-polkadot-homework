# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

## hub

```shell
npx hardhat ignition deploy ./ignition/modules/Lock.ts --network polkadotTestnet
npx hardhat verify --network polkadotTestnet 0x4cd91c69fc2a67033F0C5C25AdB23a5Ca3a97a6b

npx hardhat verify --network polkadotTestnet 0x4cd91c69fc2a67033F0C5C25AdB23a5Ca3a97a6b "arg1" "arg2"
```

## config for ts

```shell
    "rootDir": ".",
```
