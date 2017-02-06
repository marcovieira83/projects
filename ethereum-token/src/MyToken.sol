pragma solidity ^0.4.6;

contract owned {
  address public owner;

  function owned() {
    owner = msg.sender;
  }

  modifier onlyOwner {
    if (msg.sender != owner) throw;
    _;
  }

  function transferOwnership(address newOwner) onlyOwner {
    owner = newOwner;
  }
}

contract MyToken is owned {
  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;

  mapping (address => uint256) public balanceOf;
  mapping (address => bool) public frozenAcount;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event FrozenFunds(address target, bool frozen);

  function MyToken(uint256 initialSupply, string tokenName,
    uint8 decimalUnits, string tokenSymbol, address centralMinter) {
    if (centralMinter != 0) owner = centralMinter;
    totalSupply = initialSupply;
    balanceOf[msg.sender] = initialSupply;
    name = tokenName;
    symbol = tokenSymbol;
    decimals = decimalUnits;
  }

  function transfer(address to, uint256 value) {
    if (frozenAcount[msg.sender]) throw;
    if (balanceOf[msg.sender] < value) throw;
    if (balanceOf[to] + value < balanceOf[to]) throw;
    balanceOf[msg.sender] -= value;
    balanceOf[to] += value;

    Transfer(msg.sender, to, value);
  }

  function mintToken(address target, uint256 mintedAmount) onlyOwner {
    balanceOf[target] += mintedAmount;
    totalSupply += mintedAmount;
    Transfer(0, owner, mintedAmount);
    Transfer(owner, target, mintedAmount);
  }

  function freezeAccount(address target, bool freeze) onlyOwner {
    frozenAcount[target] = freeze;
    FrozenFunds(target, freeze);
  }
}
