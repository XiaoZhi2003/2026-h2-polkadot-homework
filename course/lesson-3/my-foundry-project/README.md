## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## install nightly for hub

```shell
$ foundryup --install nightly
```

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

### for hub

```shell
$ forge create src/Counter.sol:Counter \
    --chain polkadot-testnet \
    --rpc-url https://services.polkadothub-rpc.com/testnet \
    --private-key $PRIVATE_KEY \
    --broadcast

$ forge script script/Counter.s.sol:CounterScript \
    --chain polkadot-testnet \
    --broadcast

$ forge verify-contract 0xD053CA7021fD301FeAF109Afb8e031F998B47A88 \
    src/Counter.sol:Counter \
    --chain polkadot-testnet

$ forge verify-contract INSERT_CONTRACT_ADDRESS \
    src/Counter.sol:Counter \
    --chain polkadot-testnet \
    --constructor-args $(cast abi-encode "constructor(uint256,address)" 42 INSERT_DEPLOYER_ADDRESS)
```
