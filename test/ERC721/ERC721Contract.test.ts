import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ERC721Contract } from "../../typechain-types";
import { NOT_ENOUGH_FUNDS, NULL_ADDRESS, OWNABLE_INVALID_OWNER, PUBLIC_MINT_NOT_ACTIVE } from "../Errors";
import { OWNERSHIP_TRANSFERED } from "../Events";

async function fixture() {
    const [owner, ...accounts] = await ethers.getSigners();
    let params = [owner, "Test Token", "TEST", "metadata", 10000, ethers.parseEther("0.1")];
    const token: ERC721Contract = await ethers.deployContract("ERC721Contract", params);
    return { owner, accounts, params, token };
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
    });
});
