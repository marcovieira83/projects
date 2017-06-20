pragma solidity ^0.4.0;

contract VerySimpleContract {
    struct Statistics {
        uint max;
        uint changes;
    }

    Statistics public statistics;
    uint public x;

    function VerySimpleContract() {
        setX(27);
    }

    function getX() constant returns (uint) {
        return x;
    }


    function getXPlusOne() constant returns (uint _value) {
      _value = x + 1;
    }

    function setX(uint _newValue) {
        x = _newValue;

        if (_newValue > statistics.max) {
          statistics.max = _newValue;
          statistics.changes++;
        }
    }
}
