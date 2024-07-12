# Solidity API

## ContractType

_Enum defining the types of contracts that can be deployed by the Factory._

```solidity
enum ContractType {
  ERC721,
  ERC1155,
  ERC404
}
```

## Factory

_This contract serves as a factory for deploying NFT contracts._

### DeployedContract

```solidity
struct DeployedContract {
  address owner;
  address contractAddress;
  enum ContractType contractType;
  string name;
  string symbol;
}
```

### deployPrice

```solidity
uint256 deployPrice
```

### deployedContracts

```solidity
mapping(address => struct Factory.DeployedContract[]) deployedContracts
```

### ContractDeployed

```solidity
event ContractDeployed(address onwer, address contractAddress, enum ContractType contractType, string name, string symbol)
```

### constructor

```solidity
constructor() public
```

### deployERC721

```solidity
function deployERC721(string _name, string _symbol, string _metadataUri, uint256 _maxSupply, uint256 _price) external payable
```

_Deploys a new ERC721 contract._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _name | string | The name of the ERC721 contract. |
| _symbol | string | The symbol of the ERC721 contract. |
| _metadataUri | string | The metadata URI of the ERC721 contract. |
| _maxSupply | uint256 | The maximum supply of the ERC721 contract. |
| _price | uint256 | The price for minting NFT. |

