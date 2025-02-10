// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import {ERC721Contract} from "../ERC721/ERC721Contract.sol";

contract MockToken is ERC721Contract {
    constructor() ERC721Contract(msg.sender, "Token Mock", "MOCK", "ipfs://", 0) {}

    function increaseBalanceTest(address account, uint128 value) public {
        _increaseBalance(account, value);
    }
}
