import dotenv from 'dotenv';
dotenv.config();

console.log('Environment Variables:');
console.log(`RPC_URL: ${process.env.RPC_URL}`);
console.log(`CHAIN_ID: ${process.env.CHAIN_ID}`);
console.log(`PRIVATE_KEY: ${process.env.PRIVATE_KEY ? 'Set (length: ' + process.env.PRIVATE_KEY.length + ')' : 'Not set'}`);
console.log();

const config = {
  rpcUrl: process.env.RPC_URL || 'http://localhost:8545',
  chainId: parseInt(process.env.CHAIN_ID || '1'),
  privateKey: process.env.PRIVATE_KEY,
};

console.log('Config object:');
console.log(`rpcUrl: ${config.rpcUrl}`);
console.log(`chainId: ${config.chainId}`);
console.log(`privateKey: ${config.privateKey ? 'Set' : 'Not set'}`);
console.log();

async function testConnection() {
  console.log('Testing blockchain connection...');

  try {
    const { createPublicClient, http } = await import('viem');
    const { sepolia } = await import('viem/chains');

    const client = createPublicClient({
      chain: config.chainId === 11155111 ? sepolia : sepolia, // Default to sepolia
      transport: http(config.rpcUrl),
    });

    console.log('✅ Public client created successfully');

    // Test basic connection
    const chainId = await client.getChainId();
    console.log(`✅ Connected to network with chain ID: ${chainId}`);

    const blockNumber = await client.getBlockNumber();
    console.log(`✅ Latest block number: ${blockNumber}`);

  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();