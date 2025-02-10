// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {PublicMint} from "../util/PublicMint.sol";
import {AllowListMint} from "../util/AllowListMint.sol";
import {UtilBase} from "../util/UtilBase.sol";

/**
 * @title ERC721Contract
 * @author BigDaddyArrow
 * @notice An ERC721 contract with additional functionalities.
 */
contract ERC721Contract is ERC721, ERC721Enumerable, Ownable, PublicMint, AllowListMint, UtilBase {
    /* 
        Constant variables
    */

    uint256 private constant MAX_SUPPLY = 100;

    /* 
        State variables
    */

    uint256 private _nextTokenId;
    string private _baseUri;

    uint256 public price;

    error MaxSupplyExceeded();

    constructor(
        address _initialOwner,
        string memory _name,
        string memory _symbol,
        string memory _metadataUri,
        uint256 _price
    ) ERC721(_name, _symbol) Ownable(_initialOwner) {
        price = _price;
        _baseUri = _metadataUri;
    }

    receive() external payable {}

    fallback() external payable {}

    /*
        Exertnal methods
    */

    /**
     * @notice Mints a token with next available token id. Requires
     * to pass value as price for token
     */
    function publicMint() external payable whenPublicMintIsActive {
        _checkPayment();
        _internalMint();
    }

    /**
     * @notice Mints a token to the caller using the allowlist minting functionality. In this implementation accounts in allow list can only mint one free token. They can mint free more if added to allow list again
     */
    function allowListMint() external payable whenAllowListMintIsActive isInAllowList(msg.sender) {
        _internalMint();
        allowList[msg.sender] = false;
    }

    /*
        View and pure methods
    */

    function maxSupply() external pure returns (uint256) {
        return MAX_SUPPLY;
    }

    /*
        Internal methods
    */

    /**
     * @dev Internal function that handles all common mint processes.
     */
    function _internalMint() internal {
        uint256 tokenId = _nextTokenId++;

        // first token has id 0
        if (tokenId >= MAX_SUPPLY) {
            revert MaxSupplyExceeded();
        }
        _safeMint(msg.sender, tokenId);
        if (msg.value != 0) {
            emit FundsTransfered(msg.sender, address(this), msg.value, "ETH");
        }
    }

    /**
     * @dev Internal function that checks if payment is required and * valid
     */
    function _checkPayment() internal view {
        if (price > 0 && msg.value < price) {
            revert NotEnoughFunds(msg.sender, price, msg.value);
        }
    }

    /* 
        Override methods
    */

    /**
     * @dev See {ERC721}.
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {ERC721}.
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev See {ERC721}.
     */
    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    /**
     * @dev See {ERC721}.
     */
    function _baseURI() internal view override(ERC721) returns (string memory) {
        return _baseUri;
    }
}
