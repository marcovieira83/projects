pragma solidity 0.4.18;

contract VerySimpleContract {

    uint x;
    uint[] public values;

    event NewValue(uint newValue, uint oldValue);

    function VerySimpleContract() public {
        setX(27);
    }

    function setX(uint _newValue) public {
        require(_newValue > x);
        NewValue(_newValue, x);
        x = _newValue;
        values.push(_newValue);
    }

    function getX() view public returns (uint) {
        return x;
    }

    function getValues() view public returns (uint[]) {
        return values;
    }
}
