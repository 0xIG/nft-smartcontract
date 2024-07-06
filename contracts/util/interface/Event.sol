// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0

pragma solidity ^0.8.26;

/**
 * @author BigDaddyArrow
 * @title Event
 * @dev Interface with events
 */
interface Event {
    /**
     * @dev Event emitted when funds are trasfered
     * @param _from Sender address
     * @param _to Recepient address
     * @param _amount Funds amount
     * @param _currency Currency name
     */
    event FundsTransfered(address indexed _from, address indexed _to, uint256 _amount, string indexed _currency);
}
