import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ERC721Contract } from "../../typechain-types";
import {
    MAX_SUPPLEY_EXEEDED,
    NOT_ENOUGH_FUNDS,
    NULL_ADDRESS,
    OWNABLE_INVALID_OWNER,
    PUBLIC_MINT_NOT_ACTIVE,
} from "../Errors";
import { FUNDS_TRANSFERED, OWNERSHIP_TRANSFERED, TRANSFER } from "../Events";

async function fixture() {
    const [owner, ...accounts] = await ethers.getSigners();
    let params = [owner, "Test Token", "TEST", "metadata", 10000, ethers.parseEther("0.1")];
    let paramsFree = [owner, "Test Token", "TEST", "metadata", ethers.toNumber(5), 0];
    const token: ERC721Contract = await ethers.deployContract("ERC721Contract", params);
    const tokenFree: ERC721Contract = await ethers.deployContract("ERC721Contract", paramsFree);
    return { owner, accounts, params, token, tokenFree };
}

describe("ERC732Contract", function () {
    describe("Deploy", function () {
        it(`Initial owner is null address: Should revert ${OWNABLE_INVALID_OWNER}`, async function () {
            let { token } = await loadFixture(fixture);
            await expect(
                ethers.deployContract("ERC721Contract", [
                    ethers.ZeroAddress,
                    "Test Token",
                    "TEST",
                    "metadata",
                    10000,
                    ethers.parseEther("0.1"),
                ]),
            ).to.be.revertedWithCustomError(token, OWNABLE_INVALID_OWNER);
        });
        it(`Check owner event: Should emit ${OWNERSHIP_TRANSFERED}`, async function () {
            let { owner, token } = await loadFixture(fixture);
            console.log(ethers.ZeroAddress);
            console.log(owner.address);
            await expect(token.deploymentTransaction())
                .to.emit(token, OWNERSHIP_TRANSFERED)
                .withArgs(ethers.ZeroAddress, owner.address);
        });
        it("Chech owner, name, symbol, price, maxSupply", async function () {
            let { owner, token } = await loadFixture(fixture);
            expect(await token.owner()).to.be.equal(owner.address);
            expect(await token.name()).to.be.equal("Test Token");
            expect(await token.symbol()).to.be.equal("TEST");
            expect(await token.maxSupply()).itself.be.equal(10000);
            expect(await token.price()).to.be.equal(ethers.parseEther("0.1"));
        });
    });
    describe("receive and fallback", function () {
        it("Check receive", async function () {
            let { owner, token } = await loadFixture(fixture);
            await owner.sendTransaction({ to: token, value: ethers.parseEther("0.1") });
            expect(await ethers.provider.getBalance(token)).to.be.equal(ethers.parseEther("0.1"));
        });
        it("Check fallback", async function () {
            let { owner, token } = await loadFixture(fixture);
            await owner.sendTransaction({
                to: token,
                value: ethers.parseEther("0.1"),
                data: "0x",
            });
            expect(await ethers.provider.getBalance(token)).to.be.equal(ethers.parseEther("0.1"));
        });
    });
    describe("PublicMint", function () {
        it(`Public mint is not active: Shuold rever ${PUBLIC_MINT_NOT_ACTIVE}`, async function () {
            let { token } = await loadFixture(fixture);
            await expect(token.publicMint()).to.be.revertedWithCustomError(token, PUBLIC_MINT_NOT_ACTIVE);
        });
        it(`Not enough funds: Should return ${NOT_ENOUGH_FUNDS}`, async function () {
            let { owner, token } = await loadFixture(fixture);
            await token.togglePublicMint();
            await expect(token.publicMint())
                .to.be.revertedWithCustomError(token, NOT_ENOUGH_FUNDS)
                .withArgs(owner, ethers.parseEther("0.1"), 0);
        });
        it(`Max supply exeeded: Should revert ${MAX_SUPPLEY_EXEEDED}`, async function () {
            let { tokenFree: token } = await loadFixture(fixture);
            await token.togglePublicMint();
            for (let i = 0; i < 5; i++) {
                await token.publicMint();
            }
            expect(await token.totalSupply()).to.be.equal(await token.maxSupply());
            await expect(token.publicMint()).to.be.revertedWithCustomError(token, MAX_SUPPLEY_EXEEDED);
        });
        it(`Check free tokens mint: Should emit ${TRANSFER}`, async function () {
            let { accounts, tokenFree: token } = await loadFixture(fixture);
            let wallet = accounts[0];
            await token.togglePublicMint();
            await expect(token.connect(wallet).publicMint())
                .to.emit(token, TRANSFER)
                .withArgs(ethers.ZeroAddress, wallet, 0);
            expect(await token.ownerOf(0)).to.be.equal(wallet.address);
        });
        it(`Check token mint: Should emit ${TRANSFER} and ${FUNDS_TRANSFERED}`, async function () {
            let { accounts, tokenFree: token } = await loadFixture(fixture);
            let wallet = accounts[0];
            await token.togglePublicMint();
            await expect(token.connect(wallet).publicMint({ value: ethers.parseEther("0.1") }))
                .to.emit(token, TRANSFER)
                .withArgs(ethers.ZeroAddress, wallet, 0)
                .and.to.emit(token, FUNDS_TRANSFERED)
                .withArgs(wallet, token, ethers.parseEther("0.1"), "ETH");
            expect(await token.ownerOf(0)).to.be.equal(wallet.address);
        });
    });
});
