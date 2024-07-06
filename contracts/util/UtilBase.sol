// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import {Error} from "./interface/Error.sol";
import {Event} from "./interface/Event.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @author BigDaddyArrow
 * @title UtilBase
 * @dev Contract for basic utility
 */
abstract contract UtilBase is Error, Event, Ownable {
    /**
     * @dev Checks if the given address is zero address
     * @param _account The address to check
     */
    function _checkNullAddress(address _account) internal view virtual {
        if (_account == address(0)) {
            revert NullAddress();
        }
    }

    /**
     * @dev Withdraws the contract balance to the specified address.
     * @param _to The address to withdraw the balance to.
     */
    function withdraw(address payable _to) external virtual onlyOwner {
        _checkNullAddress(_to);
        uint256 amount = address(this).balance;
        if (amount == 0) {
            revert NullTransferAmount(address(this), _to);
        }
        (bool success, ) = _to.call{value: amount}("");
        if (!success) {
            revert FundsTransferFailed(address(this), _to, amount, "ETH");
        }
        emit FundsTransfered(address(this), _to, amount, "ETH");
    }
}
