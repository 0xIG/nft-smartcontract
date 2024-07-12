# Solidity API

## UtilBase

_Contract for basic utility_

### _checkNullAddress

```solidity
function _checkNullAddress(address _account) internal view virtual
```

_Checks if the given address is zero address_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _account | address | The address to check |

### withdraw

```solidity
function withdraw(address payable _to) external virtual
```

_Withdraws the contract balance to the specified address._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _to | address payable | The address to withdraw the balance to. |

