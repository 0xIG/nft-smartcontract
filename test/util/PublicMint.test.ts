import hre from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

async function fixture() {
    const [owner, ...accounts] = await hre.ethers.getSigners();
    const publicMint = await hre.ethers.deployContract("$PublicMint", [owner]);
    const publicMintMock = await hre.ethers.deployContract("MockPublicMint");
    return { owner, accounts, publicMint, publicMintMock };
}

describe("PublicMint", function () {
    describe("publicMintActive", function () {
        it("Default value should be false", async function () {
            let { publicMint } = await loadFixture(fixture);
            expect(await publicMint.publicMintActive()).to.be.false;
        });
        it("Default value should be not true", async function () {
            let { publicMint } = await loadFixture(fixture);
            expect(await publicMint.publicMintActive()).not.to.be.true;
        });
    });
    describe("togglePublicMint", function () {
        it("Caller address is not owner address: Should revert OwnableUnauthorizedAccount", async function () {
            let { accounts, publicMint } = await loadFixture(fixture);
            let wallet = accounts[0];
            await expect(publicMint.connect(wallet).getFunction("togglePublicMint").send())
                .to.be.revertedWithCustomError(publicMint, "OwnableUnauthorizedAccount")
                .withArgs(wallet);
        });
        it("Switch to active: Should pass successfully", async function () {
            let { publicMint } = await loadFixture(fixture);
            expect(await publicMint.publicMintActive()).to.be.false;
            await publicMint.togglePublicMint();
            expect(await publicMint.publicMintActive()).to.be.true;
        });
    });
    describe("whenPublicMintIsActive", function () {
        it("Public mint is not active: Revert PublicMintNotActive", async function () {
            let { publicMintMock } = await loadFixture(fixture);
            await expect(publicMintMock.whenPublicMintIsActiveTest()).to.be.revertedWithCustomError(
                publicMintMock,
                "PublicMintNotActive",
            );
        });
        it("Should pass successfully", async function () {
            let { publicMintMock } = await loadFixture(fixture);
            await publicMintMock.togglePublicMint();
            expect(await publicMintMock.publicMintActive()).to.be.true;
            await publicMintMock.whenPublicMintIsActiveTest();
        });
    });
});
