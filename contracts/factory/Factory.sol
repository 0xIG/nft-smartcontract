// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721Contract} from "../ERC721/ERC721Contract.sol";
import {UtilBase} from "../util/UtilBase.sol";

enum ContractType {
    ERC721,
    ERC1155,
    ERC404
}

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
