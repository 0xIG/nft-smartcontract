import { ethers } from "hardhat";

async function main() {
    console.log("Deploying NFT Factory...");
    const factory = await ethers.deployContract("Factory");
    console.log(`Factory deployed to: ${await factory.getAddress()}`);
}

main();
