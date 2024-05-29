// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract NFTContract is ERC721, ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;

    uint256 public maxSupply;
    uint256 public price;
    bool public allowListMintActive;
    bool public publicMintActive;

    mapping(address => bool) public allowList;

    constructor(
        address _initialOwner,
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        uint256 _price
    ) ERC721(_name, _symbol) Ownable(_initialOwner) {
        maxSupply = _maxSupply;
        price = _price;
    }

    receive() external payable {}

    fallback() external payable {}

    modifier onlyAllowList(address _address) {
        require(allowList[_address], "Not in Allow List!");
        require(allowListMintActive, "Allow List mint is not active!");
        _;
    }

    modifier whenPublicMintIsActive() {
        require(publicMintActive, "Public mint is not active!");
        _;
    }

    function publicMint() external payable whenPublicMintIsActive {
        require(msg.value >= price, "Not enough funds!");
        _internalMint();
    }

    function allowListMint() external payable onlyAllowList(msg.sender) {
        _internalMint();
        allowList[msg.sender] = false;
    }

    function toggleAllowListMint() external onlyOwner {
        allowListMintActive = !allowListMintActive;
    }

    function togglePublicMint() external onlyOwner {
        publicMintActive = !publicMintActive;
    }

    function withdraw(address payable _to) external onlyOwner {
        (bool success, ) = _to.call{value: address(this).balance}("");
        require(success, "Failed to transfer funds!");
    }

    function addToAllowlist(address[] calldata _addresses) external onlyOwner {
        for (uint256 i = 0; i < _addresses.length; i++) {
            allowList[_addresses[i]] = true;
        }
    }

    function removeFromAllowList(address[] calldata _addresses) external onlyOwner {
        for (uint256 i = 0; i < _addresses.length; i++) {
            delete allowList[_addresses[i]];
        }
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // The following functions are overrides required by Solidity.

    function _internalMint() internal {
        uint256 tokenId = _nextTokenId++;
        require(tokenId < maxSupply, "Maximum Supply is exeded!");
        _safeMint(msg.sender, tokenId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
}
