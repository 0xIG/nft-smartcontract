// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721Contract} from "../ERC721/ERC721Contract.sol";
import {UtilBase} from "../util/UtilBase.sol";

/**
 * @dev Enum defining the types of contracts that can be deployed by the Factory.
 */
enum ContractType {
    ERC721,
    ERC1155,
    ERC404
}

/**
 * @title Factory
 * @author BigDaddyArrow
 * @dev This contract serves as a factory for deploying NFT contracts.
 */

contract Factory is Ownable, UtilBase {
    struct DeployedContract {
        address owner;
        address contractAddress;
        ContractType contractType;
        string name;
        string symbol;
    }

    uint256 public deployPrice;

    mapping(address => DeployedContract[]) public deployedContracts;

    event ContractDeployed(
        address indexed onwer,
        address contractAddress,
        ContractType indexed contractType,
        string name,
        string symbol
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Deploys a new ERC721 contract.
     * @param _name The name of the ERC721 contract.
     * @param _symbol The symbol of the ERC721 contract.
     * @param _metadataUri The metadata URI of the ERC721 contract.
     * @param _maxSupply The maximum supply of the ERC721 contract.
     * @param _price The price for minting NFT.
     */
    function deployERC721(
        string memory _name,
        string memory _symbol,
        string memory _metadataUri,
        uint256 _maxSupply,
        uint256 _price
    ) external payable {
        if (msg.value < deployPrice) {
            revert NotEnoughFunds(msg.sender, deployPrice, msg.value);
        }
        ERC721Contract newContract = new ERC721Contract(msg.sender, _name, _symbol, _metadataUri, _maxSupply, _price);
        deployedContracts[msg.sender].push(
            DeployedContract({
                owner: msg.sender,
                contractAddress: address(newContract),
                contractType: ContractType.ERC721,
                name: _name,
                symbol: _symbol
            })
        );
        emit ContractDeployed(msg.sender, address(newContract), ContractType.ERC721, _name, _symbol);
    }
}