# Solidity API

## ERC721Contract

_An ERC721 contract with additional functionalities._

### maxSupply

```solidity
uint256 maxSupply
```

### price

```solidity
uint256 price
```

### MaxSupplyExceeded

```solidity
error MaxSupplyExceeded()
```

### constructor

```solidity
constructor(address _initialOwner, string _name, string _symbol, string _metadataUri, uint256 _maxSupply, uint256 _price) public
```

### receive

```solidity
receive() external payable
```

### fallback

```solidity
fallback() external payable
```

### publicMint

```solidity
function publicMint() external payable
```

_Mints a token with next available token id. Requres
to pass value as price for token_

### allowListMint

```solidity
function allowListMint() external payable
```

_Mints a token to the caller using the allowlist minting functionality. In this implementation accounts in allow list can only mint one free token. They can mint free more if added to allow list again_

### _internalMint

```solidity
function _internalMint() internal
```

_Internal function that handles all common mint processes._

### _checkPayment

```solidity
function _checkPayment() internal view
```

_Internal function that checks if payment is required and * valid_

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view returns (bool)
```

_See {ERC721}._

### _update

```solidity
function _update(address to, uint256 tokenId, address auth) internal returns (address)
```

_See {ERC721}._

### _increaseBalance

```solidity
function _increaseBalance(address account, uint128 value) internal
```

_See {ERC721}._

### _baseURI

```solidity
function _baseURI() internal view returns (string)
```

_See {ERC721}._

