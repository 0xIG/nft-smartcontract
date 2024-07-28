import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { OWNABLE_UNAUTHORIZED_ACCOUNT, PUBLIC_MINT_NOT_ACTIVE } from "../Errors";
import { MockPublicMint } from "../../typechain-types";

async function fixture() {
    const [owner, ...accounts] = await ethers.getSigners();
    const publicMint: MockPublicMint = await ethers.deployContract("MockPublicMint");
    return { owner, accounts, publicMint };
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
        it(`Caller address is not owner address: Should revert ${OWNABLE_UNAUTHORIZED_ACCOUNT}`, async function () {
            let { accounts, publicMint } = await loadFixture(fixture);
            let wallet = accounts[0];
            await expect(publicMint.connect(wallet).getFunction("togglePublicMint").send())
                .to.be.revertedWithCustomError(publicMint, OWNABLE_UNAUTHORIZED_ACCOUNT)
                .withArgs(wallet);
        });
        it("Switch to active: Should pass successfully", async function () {
            let { publicMint } = await loadFixture(fixture);
            expect(await publicMint.publicMintActive()).to.be.false;
            await publicMint.togglePublicMint();
            expect(await publicMint.publicMintActive()).to.be.true;
        });
        it("Switch to not active: Should pass successfully", async function () {
            let { publicMint } = await loadFixture(fixture);
            expect(await publicMint.publicMintActive()).to.be.false;
            await publicMint.togglePublicMint();
            expect(await publicMint.publicMintActive()).to.be.true;
            await publicMint.togglePublicMint();
            expect(await publicMint.publicMintActive()).to.be.false;
        });
    });
    describe("whenPublicMintIsActive", function () {
        it(`Public mint is not active: Revert ${PUBLIC_MINT_NOT_ACTIVE}`, async function () {
            let { publicMint } = await loadFixture(fixture);
            await expect(publicMint.whenPublicMintIsActiveTest()).to.be.revertedWithCustomError(
                publicMint,
                PUBLIC_MINT_NOT_ACTIVE,
            );
        });
        it("Should pass successfully", async function () {
            let { publicMint } = await loadFixture(fixture);
            await publicMint.togglePublicMint();
            expect(await publicMint.publicMintActive()).to.be.true;
            await publicMint.whenPublicMintIsActiveTest();
        });
    });
});
