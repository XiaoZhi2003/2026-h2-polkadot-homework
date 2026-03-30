import { ethers, JsonRpcProvider } from "ethers";

async function main() {
    const url = "http://localhost:8545";
    const testUrl = "https://services.polkadothub-rpc.com/testnet";
    const provider = new JsonRpcProvider(url);
    const privateKey = "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133";
    const wallet = new ethers.Wallet(privateKey, provider);
    const address = wallet.address;
    const balance = await provider.getBalance(wallet.address);
    console.log(`Balance of ${address}: ${ethers.formatEther(balance)} ETH`);

    const toAddress = "0x7072056494a815425895c743e50c37a1b232a00a";
    const tx = await wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther("0.001"),
    });
    console.log("tx: ", tx);
    const receipt = await tx.wait();
    console.log("receipt: ", receipt);
}

main();
