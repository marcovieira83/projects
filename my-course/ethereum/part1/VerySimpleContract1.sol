pragma solidity ^0.4.0;

contract VerySimpleContract {
    uint public x;

    function VerySimpleContract() {
        x = 27;
    }

    function getX() constant returns (uint) {
        return x;
    }

    function setX(uint _newValue) {
        x = _newValue;
    }
}
