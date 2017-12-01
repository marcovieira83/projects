pragma solidity 0.4.19;

contract VerySimpleContract {
    uint public x;

    function VerySimpleContract() public {
        x = 27;
    }

    function getX() public view returns (uint) {
        return x;
    }

    function setX(uint _newValue) public {
        x = _newValue;
    }
}
