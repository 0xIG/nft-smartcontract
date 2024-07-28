// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import {UtilBase} from "../util/UtilBase.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockUtilBase is UtilBase {
    constructor() Ownable(msg.sender) {}

    function checkNullAddress(address _account) external pure {
        _checkNullAddress(_account);
    }

    receive() external payable {}
}
