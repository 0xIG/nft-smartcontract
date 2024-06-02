// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0

/**
 * @author BigDaddyArrow
 * @title Errors
 * @dev Interface for error handling
 */
pragma solidity ^0.8.20;

interface Errors {
    /**
     * @dev Error thrown when a null address is encountered
     */
    error NullAddress();

    /**
     * @dev Error thrown when there are not enough funds
     * @param _account The account address
     * @param _required The required amount
     * @param _amount The actual amount
     */
    error NotEnoughFunds(address _account, uint256 _required, uint256 _amount);

    /**
     * @dev Error thrown when attempting to transfer zero value;
     * @param _from The sender address
     * @param _to The recipient address
     */
    error NullTransferAmount(address _from, address _to);

    /**
     * @dev Error thrown when a funds transfer fails
     * @param _from The sender address
     * @param _to The recipient address
     * @param _value The transfer amount
     */
    error FundsTransferFailed(address _from, address _to, uint256 _value);
}
