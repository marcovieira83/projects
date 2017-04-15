
pragma solidity ^0.4.0;

contract VerySimpleContract {
    struct Statistics {
        uint max;
        uint changes;
    }

    Statistics public statistics;
    uint x;

    function VerySimpleContract() {
        setX(27);
    }

    function getX() constant returns (uint) {
        return x;
    }

    function setX(uint _newValue) {
        x = _newValue;

        statistics.changes++;
        if (_newValue > statistics.max) {
            statistics.max = _newValue;
        }
    }
}
