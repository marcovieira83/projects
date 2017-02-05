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

  mapping (address => uint256) public balanceOf;
  event Transfer(address indexed from, address indexed to, uint256 value);

  function MyToken(uint256 initialSupply, string tokenName,
    string tokenSymbol, uint8 decimalUnits) {
    balanceOf[msg.sender] = initialSupply;
    name = tokenName;
    symbol = tokenSymbol;
    decimals = decimalUnits;
  }

  function transfer(address to, uint256 value) {
    if (balanceOf[msg.sender] < value) throw;
    if (balanceOf[to] + value < balanceOf[to]) throw;
    balanceOf[msg.sender] -= value;
    balanceOf[to] += value;

    Transfer(msg.sender, to, value);
  }
}
