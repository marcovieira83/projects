
pragma solidity ^0.4.0;

contract VerySimpleContract {
    struct Statistics {
        uint max;
        uint changes;
    }

    Statistics public statistics;
    uint[] public values;
    uint x;

    function VerySimpleContract() {
        setX(27);
    }

    function setX(uint _newValue) {
        if (_newValue > 100) throw;
        values.push(_newValue);
        x = _newValue;

        statistics.changes++;
        if (_newValue > statistics.max) {
            statistics.max = _newValue;
        }
    }

    function getX() constant returns (uint) {
        return x;
    }

    function getValues() constant returns (uint[]) {
        return values;
    }
}
