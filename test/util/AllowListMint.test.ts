import hre from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ALLOW_LIST_MINT_NOT_ACTIVE, NOT_IN_ALLOW_LIST, OWNABLE_UNAUTHORIZED_ACCOUNT } from "../Errors";

async function fixture() {
    const [owner, ...accounts] = await hre.ethers.getSigners();
    const allowListMint = await hre.ethers.deployContract("$AllowListMint", [owner]);
    const allowListMintMock = await hre.ethers.deployContract("MockAllowListMint");
    return { owner, accounts, allowListMint, allowListMintMock };
}

describe("AllowListMint", function () {
    describe("allowListMintActive", function () {
        it("Default value should be false", async function () {
            let { allowListMint } = await loadFixture(fixture);
            expect(await allowListMint.allowListMintActive()).to.be.false;
        });
        it("Default value should be not true", async function () {
            let { allowListMint } = await loadFixture(fixture);
            expect(await allowListMint.allowListMintActive()).to.be.not.true;
        });
    });
    describe("toggleAllowListMint", function () {
        it(`Caller address is not owner address: Should revert ${OWNABLE_UNAUTHORIZED_ACCOUNT}`, async function () {
            let { allowListMint, accounts } = await loadFixture(fixture);
            let wallet = accounts[0];
            await expect(allowListMint.connect(wallet).getFunction("toggleAllowListMint").send())
                .to.be.revertedWithCustomError(allowListMint, OWNABLE_UNAUTHORIZED_ACCOUNT)
                .withArgs(wallet);
        });
        it("Switch to active: Should pass successfully", async function () {
            let { allowListMint } = await loadFixture(fixture);
            expect(await allowListMint.allowListMintActive()).to.be.false;
            await allowListMint.toggleAllowListMint();
            expect(await allowListMint.allowListMintActive()).to.be.true;
        });
        it("Switch to not active: Should pass successfully", async function () {
            let { allowListMint } = await loadFixture(fixture);
            expect(await allowListMint.allowListMintActive()).to.be.false;
            await allowListMint.toggleAllowListMint();
            expect(await allowListMint.allowListMintActive()).to.be.true;
            await allowListMint.toggleAllowListMint();
            expect(await allowListMint.allowListMintActive()).to.be.false;
        });
    });
    describe("addToAllowList", function () {
        it(`Caller address is not an owner address: Should revert ${OWNABLE_UNAUTHORIZED_ACCOUNT}`, async function () {
            let { allowListMint, accounts } = await loadFixture(fixture);
            let wallet = accounts[0];
            await expect(allowListMint.connect(wallet).getFunction("addToAllowList").send([wallet]))
                .to.be.revertedWithCustomError(allowListMint, OWNABLE_UNAUTHORIZED_ACCOUNT)
                .withArgs(wallet);
        });
        it("Add one account: Should pass successfully", async function () {
            let { allowListMint, accounts } = await loadFixture(fixture);
            let wallet = accounts[0];
            expect(await allowListMint.allowList(wallet)).to.be.false;
            await allowListMint.addToAllowList([wallet]);
            expect(await allowListMint.allowList(wallet)).to.be.true;
        });
        it("Add multipple accounts: Should pass successfully", async function () {
            let { allowListMint, accounts } = await loadFixture(fixture);
            expect(await allowListMint.allowList(accounts[0])).to.be.false;
            expect(await allowListMint.allowList(accounts[1])).to.be.false;
            expect(await allowListMint.allowList(accounts[2])).to.be.false;
            await allowListMint.addToAllowList(accounts.slice(0, 3).map(wallet => wallet.address));
            expect(await allowListMint.allowList(accounts[0])).to.be.true;
            expect(await allowListMint.allowList(accounts[1])).to.be.true;
            expect(await allowListMint.allowList(accounts[2])).to.be.true;
        });
    });
    describe("removeFromAllowList", function () {
        it(`Caller address is not an owner address: Should revert ${OWNABLE_UNAUTHORIZED_ACCOUNT}`, async function () {
            let { allowListMint, accounts } = await loadFixture(fixture);
            let wallet = accounts[0];
            await allowListMint.addToAllowList([wallet]);
            expect(await allowListMint.allowList(wallet)).to.be.true;
            await expect(allowListMint.connect(wallet).getFunction("removeFromAllowList").send([wallet]))
                .to.be.revertedWithCustomError(allowListMint, OWNABLE_UNAUTHORIZED_ACCOUNT)
                .withArgs(wallet);
        });
        it("Remove one account: Should pass successfully", async function () {
            let { allowListMint, accounts } = await loadFixture(fixture);
            let wallet = accounts[0];
            await allowListMint.addToAllowList([wallet]);
            expect(await allowListMint.allowList(wallet)).to.be.true;
            await allowListMint.removeFromAllowList([wallet]);
            expect(await allowListMint.allowList(wallet)).to.be.false;
        });
        it("Remove multiple accounts: Should pass successfully", async function () {
            let { allowListMint, accounts } = await loadFixture(fixture);
            let wallets = accounts.slice(0, 3).map(wallet => wallet.address);
            await allowListMint.addToAllowList(wallets);
            expect(await allowListMint.allowList(accounts[0])).to.be.true;
            expect(await allowListMint.allowList(accounts[1])).to.be.true;
            expect(await allowListMint.allowList(accounts[2])).to.be.true;
            await allowListMint.removeFromAllowList(wallets);
            expect(await allowListMint.allowList(accounts[0])).to.be.false;
            expect(await allowListMint.allowList(accounts[1])).to.be.false;
            expect(await allowListMint.allowList(accounts[2])).to.be.false;
        });
    });
    describe("whenAllowListIsActive", function () {
        it(`Allow list mint is not active: Revert ${ALLOW_LIST_MINT_NOT_ACTIVE}`, async function () {
            let { allowListMintMock } = await loadFixture(fixture);
            await expect(allowListMintMock.whenAllowListMintIsActiveTest()).to.be.revertedWithCustomError(
                allowListMintMock,
                ALLOW_LIST_MINT_NOT_ACTIVE,
            );
        });
        it("Should pass successfully", async function () {
            let { allowListMintMock } = await loadFixture(fixture);
            await allowListMintMock.toggleAllowListMint();
            expect(await allowListMintMock.allowListMintActive()).to.be.true;
            await allowListMintMock.whenAllowListMintIsActiveTest();
        });
    });
    describe("isInAllowList", function () {
        it(`Account is not in allow list: Should revert ${NOT_IN_ALLOW_LIST}`, async function () {
            let { allowListMintMock, accounts } = await loadFixture(fixture);
            let wallet = accounts[0];
            expect(await allowListMintMock.allowList(wallet)).to.be.false;
            await expect(allowListMintMock.isInAllowListTest(wallet))
                .to.be.revertedWithCustomError(allowListMintMock, NOT_IN_ALLOW_LIST)
                .withArgs(wallet);
        });
        it("Should pass successfully", async function () {
            let { allowListMintMock, accounts } = await loadFixture(fixture);
            let wallet = accounts[0];
            await allowListMintMock.addToAllowList([wallet]);
            expect(await allowListMintMock.allowList(wallet)).to.be.true;
            await allowListMintMock.isInAllowListTest(wallet);
        });
    });
});
