pragma solidity ^0.4.0;

contract MyToken {
    // XXX mapping
    // XXX public
    // XXX address
    mapping (address => uint256) public balanceOf;

    HoldersSet.Data holdersSet;

    string name;

    // XXX eventos
    event Transfer(address from, address to, uint256 value);

    function MyToken(uint256 initialSupply, string tokenName) {
        // XXX msg.sender
        balanceOf[msg.sender] = initialSupply;
        name = tokenName;
        HoldersSet.add(holdersSet, msg.sender);
    }

    function transfer(address _to, uint256 _value) {
        // XXX throw
        if (balanceOf[msg.sender] < _value) throw;
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        Transfer(msg.sender, _to, _value);
        HoldersSet.add(holdersSet, _to);
    }

    // constant - read only
    function getTokenName() constant returns (string) {
      return name;
    }

    function getHolders() constant returns (address[]) {
      return holdersSet.holders;
    }
}

library HoldersSet {
    struct Data { address[] holders; }

    function add(Data storage self, address newHolder)  returns (bool) {
        for (uint i = 0; i < self.holders.length; i++) {
            address current = self.holders[i];
            if (current == newHolder) return false;
        }
        self.holders.push(newHolder);
        return true;
    }
}
