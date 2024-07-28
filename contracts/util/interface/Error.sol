// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

/**
 * @author BigDaddyArrow
 * @title Error
 * @notice Interface for error handling
 */
interface Error {
    /**
     * @notice Error thrown when a null address is encountered
     */
    error NullAddress();

    /**
     * @notice Error thrown when there are not enough funds
     * @param _account The account address
     * @param _required The required amount
     * @param _amount The actual amount
     */
    error NotEnoughFunds(address _account, uint256 _required, uint256 _amount);

    /**
     * @notice Error thrown when attempting to transfer zero value;
     * @param _from The sender address
     * @param _to The recipient address
     */
    error NullTransferAmount(address _from, address _to);

    /**
     * @notice Error thrown  when a funds transfer fails
     * @param _from The sender address
     * @param _to The recipient address
     * @param _value The transfer amount
     * @param _currency Currency name
     */
    error FundsTransferFailed(address _from, address _to, uint256 _value, string _currency);
}
