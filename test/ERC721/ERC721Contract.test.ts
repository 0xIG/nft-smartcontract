import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ERC721Contract, MockToken } from "../../typechain-types";
import {
    ALLOW_LIST_MINT_NOT_ACTIVE,
    MAX_SUPPLEY_EXEEDED,
    NOT_ENOUGH_FUNDS,
    NOT_IN_ALLOW_LIST,
    OWNABLE_INVALID_OWNER,
    PUBLIC_MINT_NOT_ACTIVE,
} from "../Errors";
import { FUNDS_TRANSFERED, OWNERSHIP_TRANSFERED, TRANSFER } from "../Events";

async function fixture() {
    const [owner, ...accounts] = await ethers.getSigners();
    let params = [owner, "Test Token", "TEST", "metadata", ethers.parseEther("0.1")];
    let paramsFree = [owner, "Test Token", "TEST", "metadata", 0];
    const token: ERC721Contract = await ethers.deployContract("ERC721Contract", params);
    const tokenFree: ERC721Contract = await ethers.deployContract("ERC721Contract", paramsFree);
    const mockToken: MockToken = await ethers.deployContract("MockToken");
    return { owner, accounts, params, token, tokenFree, mockToken };
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
            expect(await token.maxSupply()).itself.be.equal(100);
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
                data: "0x1234",
            });
            await expect(await ethers.provider.getBalance(token)).to.be.equal(ethers.parseEther("0.1"));
        });
    });
    describe("Public Mint", function () {
        it(`Public mint is not active: Shuold revert ${PUBLIC_MINT_NOT_ACTIVE}`, async function () {
            let { token } = await loadFixture(fixture);
            await expect(token.publicMint()).to.be.revertedWithCustomError(token, PUBLIC_MINT_NOT_ACTIVE);
        });
        it(`Not enough funds: Should revert ${NOT_ENOUGH_FUNDS}`, async function () {
            let { owner, token } = await loadFixture(fixture);
            await token.togglePublicMint();
            await expect(token.publicMint())
                .to.be.revertedWithCustomError(token, NOT_ENOUGH_FUNDS)
                .withArgs(owner, ethers.parseEther("0.1"), 0);
        });
        it(`Max supply exeeded: Should revert ${MAX_SUPPLEY_EXEEDED}`, async function () {
            let { tokenFree: token } = await loadFixture(fixture);
            await token.togglePublicMint();
            for (let i = 0; i < 100; i++) {
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
    describe("Allow List Mint", function () {
        it(`Allow list mint is not active: Should revert: ${ALLOW_LIST_MINT_NOT_ACTIVE}`, async function () {
            let { token } = await loadFixture(fixture);
            await expect(token.allowListMint()).to.be.revertedWithCustomError(token, ALLOW_LIST_MINT_NOT_ACTIVE);
        });
        it(`Caller is not in allow list: Should revert: ${NOT_IN_ALLOW_LIST}`, async function () {
            let { owner, token } = await loadFixture(fixture);
            await token.toggleAllowListMint();
            await expect(token.allowListMint())
                .to.be.revertedWithCustomError(token, NOT_IN_ALLOW_LIST)
                .withArgs(owner.address);
        });
        it(`Max supply exeeded: Should revert ${MAX_SUPPLEY_EXEEDED}`, async function () {
            let { owner, tokenFree: token } = await loadFixture(fixture);
            await token.togglePublicMint();
            for (let i = 0; i < 100; i++) {
                await token.publicMint({ value: ethers.parseEther("0.1") });
            }
            expect(await token.totalSupply()).to.be.equal(await token.maxSupply());
            await token.toggleAllowListMint();
            await token.addToAllowList([owner.address]);
            await expect(token.allowListMint()).to.be.revertedWithCustomError(token, MAX_SUPPLEY_EXEEDED);
        });
        it(`Check allow list mint token: Should emit ${TRANSFER}`, async function () {
            let { accounts, token } = await loadFixture(fixture);
            let wallet = accounts[0];
            await token.toggleAllowListMint();
            await token.addToAllowList([wallet]);
            expect(await token.allowList(wallet)).to.be.true;
            let tx = token.connect(wallet).allowListMint();
            await expect(tx).to.emit(token, TRANSFER).withArgs(ethers.ZeroAddress, wallet.address, 0);
            expect(await token.ownerOf(0)).to.be.equal(wallet.address);
            expect(await token.allowList(wallet.address)).to.be.false;
        });
    });
    describe("Override methods", function () {
        it("_increaseBalance", async function () {
            let { owner, mockToken } = await loadFixture(fixture);
            expect(await mockToken.balanceOf(owner)).to.be.equal(0);
            await mockToken.increaseBalanceTest(owner.address, 0);
            expect(await mockToken.balanceOf(owner)).to.be.equal(0);
        });
        it("supportsInterface", async function () {
            let { token } = await loadFixture(fixture);
            let id = ethers.FunctionFragment.getSelector("supportsInterface", ["bytes4"]);
            expect(await token.supportsInterface(id)).to.be.true;
        });
        it("_baseURI", async function () {
            let { owner, token, params } = await loadFixture(fixture);
            await token.togglePublicMint();
            await token.publicMint({ value: ethers.parseEther("0.1") });
            expect(await token.ownerOf(0)).to.be.equal(owner.address);
            expect(await token.tokenURI(0)).to.be.equal("metadata" + 0);
        });
    });
});
