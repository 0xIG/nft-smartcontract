# Solidity API

## AllowListMint

_Contract for enabling allow list mint functionality_

### allowListMintActive

```solidity
bool allowListMintActive
```

### NotInAllowList

```solidity
error NotInAllowList(address _account)
```

_Error thrown when account is not in the allow list_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _account | address | The account address |

### AllowListNotActive

```solidity
error AllowListNotActive()
```

_Error thrown when allow list minting is not active_

### allowList

```solidity
mapping(address => bool) allowList
```

### isInAllowList

```solidity
modifier isInAllowList(address _account)
```

_Modifier to check if address is in allow list_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _account | address | The address to check |

### whenAllowListMintIsActive

```solidity
modifier whenAllowListMintIsActive()
```

_Modifier to check if allow list mint is active_

### toggleAllowListMint

```solidity
function toggleAllowListMint() external virtual
```

_Toggles the allow list minting status_

### addToAllowList

```solidity
function addToAllowList(address[] _accounts) external virtual
```

_Adds multiple addresses to the allowlist._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _accounts | address[] | The addresses to add to the allow list. |

### removeFromAllowList

```solidity
function removeFromAllowList(address[] _accounts) external virtual
```

_Removes multiple addresses from the allowlist._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _accounts | address[] | The addresses to remove from the allow list. |

