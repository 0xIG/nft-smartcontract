// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @author BigDaddyArrow
 * @title AllowListMint
 * @notice Contract for enabling allow list mint functionality
 */
abstract contract AllowListMint is Ownable {
    bool public allowListMintActive;

    /**
     * @notice Error thrown when account is not in the allow list
     * @param _account The account address
     */
    error NotInAllowList(address _account);

    /**
     * @notice Error thrown when allow list minting is not active
     */
    error AllowListNotActive();

    mapping(address => bool) public allowList;

    /**
     * @notice Modifier to check if address is in allow list
     * @param _account The address to check
     */
    modifier isInAllowList(address _account) {
        if (!allowList[_account]) {
            revert NotInAllowList(_account);
        }
        _;
    }

    /**
     * @notice Modifier to check if allow list mint is active
     */
    modifier whenAllowListMintIsActive() {
        if (!allowListMintActive) {
            revert AllowListNotActive();
        }
        _;
    }

    /**
     * @notice Toggles the allow list minting status
     */
    function toggleAllowListMint() external virtual onlyOwner {
        allowListMintActive = !allowListMintActive;
    }

    /**
     * @notice Adds multiple addresses to the allowlist.
     * @param _accounts The addresses to add to the allow list.
     */
    function addToAllowList(address[] calldata _accounts) external virtual onlyOwner {
        for (uint256 i = 0; i < _accounts.length; i++) {
            allowList[_accounts[i]] = true;
        }
    }

    /**
     * @notice Removes multiple addresses from the allowlist.
     * @param _accounts The addresses to remove from the allow list.
     */
    function removeFromAllowList(address[] calldata _accounts) external virtual onlyOwner {
        for (uint256 i = 0; i < _accounts.length; i++) {
            delete allowList[_accounts[i]];
        }
    }
}
