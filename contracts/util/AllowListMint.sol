// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @author BigDaddyArrow
 * @title AllowListMint
 * @dev Contract for enabling allow list mint functionality
 */
abstract contract AllowListMint is Ownable {
    bool public allowListMintActive;

    error NotInAllowList(address account);
    error AllowListNotActive();

    mapping(address => bool) public allowList;

    /**
     * @dev Modifier to check if address is in allow list
     * @param _account The address to check
     */
    modifier isInAllowList(address _account) {
        if (!allowList[_account]) {
            revert NotInAllowList(_account);
        }
        _;
    }

    /**
     * @dev Modifier to check if allow list mint is active
     */
    modifier whenAllowListMintIsActive() {
        if (!allowListMintActive) {
            revert AllowListNotActive();
        }
        _;
    }

    /**
     * @dev Toggles the allow list minting status
     */
    function toggleAllowListMint() external virtual onlyOwner {
        allowListMintActive = !allowListMintActive;
    }

    /**
     * @dev Adds multiple addresses to the allowlist.
     * @param _accounts The addresses to add to the allow list.
     */
    function addToAllowlist(address[] calldata _accounts) external virtual onlyOwner {
        for (uint256 i = 0; i < _accounts.length; i++) {
            allowList[_accounts[i]] = true;
        }
    }

    /**
     * @dev Removes multiple addresses from the allowlist.
     * @param _accounts The addresses to remove from the allow list.
     */
    function removeFromAllowList(address[] calldata _accounts) external virtual onlyOwner {
        for (uint256 i = 0; i < _accounts.length; i++) {
            delete allowList[_accounts[i]];
        }
    }
}
