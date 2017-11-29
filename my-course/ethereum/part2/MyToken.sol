pragma solidity 0.4.18;

contract MyToken {
    string public name;
    string public symbol;
    uint8 public decimals;

    mapping (address => uint256) public balanceOf;

    event Transfer(address from, address to, uint256 value);

    function MyToken(uint256 _initialSupply, uint8 _decimalUnits,
        string _tokenName, string _tokenSymbol) public {
        balanceOf[msg.sender] = _initialSupply;
        name = _tokenName;
        symbol = _tokenSymbol;
        decimals = _decimalUnits;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        Transfer(msg.sender, _to, _value);
        return true;
    }
}
