// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import {PublicMint} from "../util/PublicMint.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockPublicMint is PublicMint {
    constructor() Ownable(msg.sender) {}

    //solhint-disable-next-line no-empty-blocks
    function whenPublicMintIsActiveTest() public whenPublicMintIsActive {}
}
