# Solidity API

## PublicMint

_Contract for enabling public minting functionality_

### publicMintActive

```solidity
bool publicMintActive
```

### PublicMintNotActive

```solidity
error PublicMintNotActive()
```

_Error thrown when public minting is not active_

### whenPublicMintIsActive

```solidity
modifier whenPublicMintIsActive()
```

_Modifier to check if public minting is active_

### togglePublicMint

```solidity
function togglePublicMint() external virtual
```

_Function to toggle public minting status_

