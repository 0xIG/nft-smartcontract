import hre from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { FUNDS_TRANSFER_FAILED, NULL_ADDRESS, NULL_TRANSFER_AMOUNT, OWNABLE_UNAUTHORIZED_ACCOUNT } from "../Errors";
import { FUNDS_TRANSFERED } from "../Events";

async function fixture() {
    const [owner, ...accounts] = await hre.ethers.getSigners();
    const utilBase = await hre.ethers.deployContract("$UtilBase", [owner]);
    const mockNoReceive = await hre.ethers.deployContract("MockNoReceive");
    return { owner, accounts, utilBase, mockNoReceive };
}

describe("UtilBase", function () {
    describe("_checkNullAddress", function () {
        it(`Address is address of zero: Should revert ${NULL_ADDRESS}`, async function () {
            let { utilBase } = await loadFixture(fixture);
            await expect(utilBase.$_checkNullAddress(hre.ethers.ZeroAddress)).to.be.revertedWithCustomError(
                utilBase,
                NULL_ADDRESS,
            );
        });
        it("Should pass successfuly", async function () {
            let { accounts, utilBase } = await loadFixture(fixture);
            await utilBase.$_checkNullAddress(accounts[0]);
        });
    });
    describe("withdraw", function () {
        it(`Address is address of zero: Should revert ${NULL_ADDRESS}`, async function () {
            let { utilBase } = await loadFixture(fixture);
            await expect(utilBase.withdraw(hre.ethers.ZeroAddress)).to.be.revertedWithCustomError(
                utilBase,
                `${NULL_ADDRESS}`,
            );
        });
        it(`Contract balance is zero: Should revert ${NULL_TRANSFER_AMOUNT}`, async function () {
            let { accounts, utilBase } = await loadFixture(fixture);
            await expect(utilBase.withdraw(accounts[0]))
                .to.be.revertedWithCustomError(utilBase, NULL_TRANSFER_AMOUNT)
                .withArgs(utilBase, accounts[0]);
        });
        it(`Fail to transfer ether: Should revert ${FUNDS_TRANSFER_FAILED}`, async function () {
            let { owner, utilBase, mockNoReceive } = await loadFixture(fixture);
            let value = hre.ethers.parseEther("1.0");
            await owner.sendTransaction({ to: utilBase, value });
            await expect(utilBase.withdraw(mockNoReceive))
                .to.be.revertedWithCustomError(utilBase, FUNDS_TRANSFER_FAILED)
                .withArgs(utilBase, mockNoReceive, value, "ETH");
        });
        it(`Caller address is not owner address: Should revert ${OWNABLE_UNAUTHORIZED_ACCOUNT}`, async function () {
            let { accounts, utilBase } = await loadFixture(fixture);
            await expect(utilBase.connect(accounts[0]).getFunction("withdraw").send(accounts[0]))
                .to.be.revertedWithCustomError(utilBase, OWNABLE_UNAUTHORIZED_ACCOUNT)
                .withArgs(accounts[0]);
        });
        it(`Transfer passed successfully to owner account: Should emit ${FUNDS_TRANSFERED}`, async function () {
            let { owner, utilBase } = await loadFixture(fixture);
            let value = hre.ethers.parseEther("1.0");
            await owner.sendTransaction({ to: utilBase, value });
            await expect(utilBase.withdraw(owner))
                .to.emit(utilBase, FUNDS_TRANSFERED)
                .withArgs(utilBase, owner, value, "ETH");
        });
        it(`Transfer passed successfully to not owner account: Should emit ${FUNDS_TRANSFERED}`, async function () {
            let { owner, accounts, utilBase } = await loadFixture(fixture);
            let wallet = accounts[0];
            let value = hre.ethers.parseEther("1.0");
            await owner.sendTransaction({ to: utilBase, value });
            await expect(utilBase.withdraw(wallet))
                .to.emit(utilBase, FUNDS_TRANSFERED)
                .withArgs(utilBase, wallet, value, "ETH");
        });
    });
});
