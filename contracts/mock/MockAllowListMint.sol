// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import {AllowListMint} from "../util/AllowListMint.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockAllowListMint is AllowListMint {
    constructor() Ownable(msg.sender) {}

    //solhint-disable-next-line no-empty-blocks
    function whenAllowListMintIsActiveTest() public whenAllowListMintIsActive {}

    //solhint-disable-next-line no-empty-blocks
    function isInAllowListTest(address _account) public isInAllowList(_account) {}
}
