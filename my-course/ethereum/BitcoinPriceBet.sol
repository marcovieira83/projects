pragma solidity 0.4.18;

contract BitcoinPriceBet {
    enum Sides { Below, Above }
    struct Bet {
        address who;
        uint value;
        Sides side;
    }
    address public owner;
    Bet[] below;
    Bet[] above;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function BitcoinPriceBet() public {
        owner = msg.sender;
    }

    function betBelow10k() payable public {
        require(msg.value > 1 ether);
        below.push(Bet(msg.sender, msg.value, Sides.Below));
    }

    function betAbove10k() payable public {
        require(msg.value >= 1 ether);
        above.push(Bet(msg.sender, msg.value, Sides.Above));
    }

    function bla(uint bitcoinPrice) onlyOwner public {
        Bet[] winner;
        if (bitcoinPrice < 10000) {
            winner = below;
        } else {
            winner = above;
        }
        for (uint i = 0; i < winner.length; i++) {
            // winner.
        }
    }

    function betAmount() public view returns (uint) {
        return this.balance;
    }
}
