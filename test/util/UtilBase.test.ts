import hre from "hardhat";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";

use(chaiAsPromised);

let { ethers } = hre;

describe("UtilBase", function () {
    let utilBase: any;
    let accounts: any;
    beforeEach(async function () {
        accounts = await ethers.getSigners();
        utilBase = await ethers.deployContract("$UtilBase", [accounts[0]]);
    });
    describe("_checkNullAddress", function () {
        it("Must revert NullAddress", async function () {
            await expect(utilBase.$_checkNullAddress(ethers.ZeroAddress)).to.be.revertedWithCustomError(
                utilBase,
                "NullAddress",
            );
        });
        it("Must pass successfuly", async function () {
            await utilBase.$_checkNullAddress(accounts[0]);
        });
    });
});
