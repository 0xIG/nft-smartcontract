// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @author BigDaddyArrow
 * @title PublicMint
 * @notice Contract for enabling public minting functionality
 */
abstract contract PublicMint is Ownable {
    bool public publicMintActive;

    /**
     * @notice Error thrown when public minting is not active
     */
    error PublicMintNotActive();

    /**
     * @notice Modifier to check if public minting is active
     */
    modifier whenPublicMintIsActive() {
        if (!publicMintActive) {
            revert PublicMintNotActive();
        }
        _;
    }

    /**
     * @notice Function to toggle public minting status
     */
    function togglePublicMint() external virtual onlyOwner {
        publicMintActive = !publicMintActive;
    }
}
