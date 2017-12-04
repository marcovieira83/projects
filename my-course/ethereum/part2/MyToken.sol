pragma solidity ^0.4.18;

contract MyToken {
    string public name = "MYTOKEN";
    string public symbol = "MYT$";
    uint8 public decimals = 2;
    mapping (address => uint256) public balanceOf;

    event Transfer(address _from, address _to, uint256 _value);

    function MyToken(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        Transfer(msg.sender, _to, _value);
        return true;
    }
}
