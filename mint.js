const { ethers } = require("ethers");
const fs = require("fs");

async function main() {
    // 1. Read the identity file you just verified
    const identity = JSON.parse(fs.readFileSync('./.well-known/ai-agent.json', 'utf8'));
    console.log(`🤖 Deploying Agent Identity: ${identity.identity_domain}`);

    // 2. Connect to the BNB Smart Chain network
    // We use a free, public BNB Chain connection point (RPC)
    const bnbRpcUrl = "https://binance.org";
    const provider = new ethers.JsonRpcProvider(bnbRpcUrl);
    
    // 3. Link your private keys securely from your server environment
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

    // 4. Set up the target platform details for ptah.trade
    // Note: We will update this address with Ptah's exact live contract later
    const ptahContractAddress = "0xPtahTradeSmartContractAddressHere"; 
    const ptahAbi = [
        "function mint(address recipient) public payable returns (uint256)"
    ];

    const contract = new ethers.Contract(ptahContractAddress, ptahAbi, wallet);
    console.log("Sending automated mint transaction to ptah.trade...");
    
    // 5. Execute the mint directly to your agent's wallet
    const tx = await contract.mint(identity.wallet_address);
    console.log(`Transaction broadcasted! Hash: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`🎉 NFT successfully minted on BNB Chain at block: ${receipt.blockNumber}`);
}

main().catch((error) => {
    console.error("Minting failed:", error);
    process.exit(1);
});
