// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import {ERC721Contract} from "../../ERC721/ERC721Contract.sol";

contract ERC721Token is ERC721Contract {
    constructor(
        address _initialOwner,
        string memory _name,
        string memory _symbol,
        string memory _metadataUri,
        uint256 _maxSupply,
        uint256 _price
    ) ERC721Contract(_initialOwner, _name, _symbol, _metadataUri, _maxSupply, _price) {}
}
