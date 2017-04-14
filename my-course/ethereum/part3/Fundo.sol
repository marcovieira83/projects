pragma solidity ^0.4.0;

contract Fundo {
  // TODO colocar enum, e struct

  address public owner;
  uint public value;
  address[] public claims;
  mapping(address => uint) public votes;
  uint public totalVotes;
  address public winner;
  uint public winnerNumberOfVotes = 0;

  modifier notOwner() {
    if (msg.sender == owner) throw;
    _;
  }

  modifier onlyOwner() {
    if (msg.sender != owner) throw;
    _;
  }

  modifier onlyWinner() {
    if (msg.sender != winner) throw;
    _;
  }

  function Fundo() payable {
    if (msg.value < 1 ether) throw;
    owner = msg.sender;
    value = msg.value;
  }

  function claim() notOwner {
    claims.push(msg.sender);
  }

  function vote(address claimer) notOwner {
    votes[claimer] += 1;
    totalVotes += 1;
  }

  function finish() onlyOwner {
    for (uint i = 0; i < claims.length; i++) {
      address claimer = claims[i];
      uint numberOfVotes = votes[claimer];
      if (numberOfVotes > winnerNumberOfVotes) {
        winnerNumberOfVotes = numberOfVotes;
        winner = claims[i];
      }
    }
  }

  function withdrawal() payable onlyWinner {
    if (msg.sender != winner) throw;
    if (!msg.sender.send(value)) throw;
  }
}
