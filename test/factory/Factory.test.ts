import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { CONTRACT_DEPLOYED } from "../Events";

async function fixture() {
    let [owner, ...accounts] = await ethers.getSigners();
    let factory = await ethers.deployContract("Factory");
    return { owner, accounts, factory };
}

describe("Factory", function () {
    describe("deploy", function () {
        it("Successful deploy", async function () {
            let { owner, factory } = await loadFixture(fixture);
            expect(await factory.owner()).to.be.equal(owner.address);
        });
    });
    describe("deploy ERC721", function () {
        it(`Successful deploy: Should emit ${CONTRACT_DEPLOYED}`, async function () {
            let { owner, accounts, factory } = await loadFixture(fixture);
            let wallet = accounts[0];
            let tx = await factory
                .connect(wallet)
                .deployERC721("Test token", "TEST", "ipfs://somedata", ethers.parseEther("0.1"));
            let res = await tx.wait();
            let event = (res?.logs[1] as any).args;
            expect(event[0]).to.be.equal(wallet.address);
            expect(event[2]).to.be.equal("ERC721");
            expect(event[3]).to.be.equal("Test token");
            expect(event[4]).to.be.equal("TEST");

            let tokenAddress = event[1];
            let token = await ethers.getContractAt("ERC721Contract", tokenAddress);
            expect(await token.owner()).to.be.equal(wallet.address);
            expect(await token.name()).to.be.equal("Test token");
            expect(await token.symbol()).to.be.equal("TEST");

            await token.connect(wallet).togglePublicMint();
            let wallet2 = accounts[1];
            await token.connect(wallet2).publicMint({ value: ethers.parseEther("0.1") });
            expect(await token.totalSupply()).to.be.equal(1);
            expect(await token.ownerOf(0)).to.be.equal(wallet2.address);
        });
    });
});
