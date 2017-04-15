pragma solidity 0.4.8;

contract Escrow {

  address public owner;
  uint256 public value;

  function Escrow() payable {
    owner = msg.sender;
    value = msg.value;
  }

  function claimValue() payable returns (bool) {
    if (!msg.sender.send(value)) throw;
    return true;
  }

  // recebe ETH
  function () payable {
    value += msg.value;
  }
}
