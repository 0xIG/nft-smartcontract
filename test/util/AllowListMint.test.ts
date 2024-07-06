import hre from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

async function fixture() {
    const [owner, ...accounts] = await hre.ethers.getSigners();
    const publicMint = await hre.ethers.deployContract("$PublicMint", [owner]);
    const publicMintMock = await hre.ethers.deployContract("MockPublicMint");
    return { owner, accounts, publicMint, publicMintMock };
}

describe("AllowListMint", function () {
	
})