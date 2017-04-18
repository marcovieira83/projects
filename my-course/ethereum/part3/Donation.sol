pragma solidity 0.4.10;

contract Donation {

  event Deposit(address sender, uint value);
  event Withdrawal(address recipient, uint value);

  function Donation() payable {
    Deposit(msg.sender, msg.value);
  }

  function withdrawal() payable returns (bool) {
    uint amount = this.balance / 2;
    Withdrawal(msg.sender, amount);
    if (!msg.sender.send(amount)) throw;
    return true;
  }

  function getBalance() constant returns (uint) {
    return this.balance;
  }

  // recebe ETH
  function () payable {
    Deposit(msg.sender, msg.value);
  }
}
