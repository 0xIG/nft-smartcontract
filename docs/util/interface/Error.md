# Solidity API

## Error

_Interface for error handling_

### NullAddress

```solidity
error NullAddress()
```

_Error thrown when a null address is encountered_

### NotEnoughFunds

```solidity
error NotEnoughFunds(address _account, uint256 _required, uint256 _amount)
```

_Error thrown when there are not enough funds_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _account | address | The account address |
| _required | uint256 | The required amount |
| _amount | uint256 | The actual amount |

### NullTransferAmount

```solidity
error NullTransferAmount(address _from, address _to)
```

_Error thrown when attempting to transfer zero value;_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _from | address | The sender address |
| _to | address | The recipient address |

### FundsTransferFailed

```solidity
error FundsTransferFailed(address _from, address _to, uint256 _value, string _currency)
```

_Error thrown  when a funds transfer fails_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _from | address | The sender address |
| _to | address | The recipient address |
| _value | uint256 | The transfer amount |
| _currency | string | Currency name |

