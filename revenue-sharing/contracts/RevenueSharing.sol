pragma solidity ^0.4.8;

contract RevenueSharing {

  uint public percentage;
  uint public consumed;
  address public author;

  event Deposit(uint amount, uint balance);
  event NewSale(uint amount, uint comission, uint consumed, uint balance);
  event Withdrawal(uint amount, uint balance, uint newBalance);

  function RevenueSharing(uint _perc) payable {
    if (msg.value < 1 ether) throw;
    percentage = _perc;
    author = msg.sender;
    Deposit(msg.value, this.balance);
  }

  modifier notAuthor() {
    if (msg.sender == author) throw;
    _;
  }

  modifier onlyAuthor() {
     if (msg.sender != author) throw;
     _;
  }

  function newSale(uint _amount) notAuthor {
    uint comission = _amount * percentage / 100 * 1000000000000000000;
    consumed += comission;
    if (consumed >= this.balance) throw;
    NewSale(_amount, comission, consumed, this.balance);
  }

  function withdrawal() onlyAuthor returns (uint transferValue) {
    transferValue = consumed;
    consumed = 0;
    uint newBalance = this.balance - transferValue;
    Withdrawal(transferValue, this.balance, newBalance);
    if (!author.send(transferValue)) throw;
    return transferValue;
  }

  function () payable {
    Deposit(msg.value, this.balance);
  }
}
