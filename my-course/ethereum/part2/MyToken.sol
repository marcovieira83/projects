pragma solidity 0.4.8;

contract MyToken {
    // XXX mapping
    // XXX public
    // XXX address
    mapping (address => uint256) public balanceOf;

    string public name;

    // XXX eventos
    event Transfer(address from, address to, uint256 value);

    function MyToken(uint256 initialSupply, string tokenName) {
        // XXX msg.sender
        balanceOf[msg.sender] = initialSupply;
        name = tokenName;
    }

    function transfer(address _to, uint256 _value) {
        // XXX throw
        if (balanceOf[msg.sender] < _value) throw;
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        Transfer(msg.sender, _to, _value);
    }

    // constant - read only
    function getTokenName() constant returns (string) {
      return name;
    }
}
