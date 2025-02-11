// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721Contract} from "../ERC721/ERC721Contract.sol";

/**
 * @title Factory
 * @author BigDaddyArrow
 * @notice This contract serves as a factory for deploying NFT contracts.
 */

contract Factory is Ownable {
    struct DeployedContract {
        address owner;
        address contractAddress;
        string contractType;
        string name;
        string symbol;
    }

    mapping(address => DeployedContract[]) public deployedContracts;

    event ContractDeployed(
        address indexed onwer,
        address contractAddress,
        string contractType,
        string name,
        string symbol
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Deploys a new ERC721 contract.
     * @param _name The name of the ERC721 contract.
     * @param _symbol The symbol of the ERC721 contract.
     * @param _metadataUri The metadata URI of the ERC721 contract.
     * @param _price The price for minting NFT.
     */
    function deployERC721(
        string memory _name,
        string memory _symbol,
        string memory _metadataUri,
        uint256 _price
    ) external {
        ERC721Contract newContract = new ERC721Contract(msg.sender, _name, _symbol, _metadataUri, _price);
        deployedContracts[msg.sender].push(
            DeployedContract({
                owner: msg.sender,
                contractAddress: address(newContract),
                contractType: "ERC721",
                name: _name,
                symbol: _symbol
            })
        );
        emit ContractDeployed(msg.sender, address(newContract), "ERC721", _name, _symbol);
    }
}
