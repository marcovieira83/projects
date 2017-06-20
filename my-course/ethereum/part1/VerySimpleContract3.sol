
pragma solidity ^0.4.0;

contract VerySimpleContract {
    struct Statistics {
        uint changes;
        uint max;
        uint average;
        uint sum;
        uint average2;
    }

    Statistics public statistics;
    uint[] public values;
    uint public x;

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

        uint sum;
        for (uint i = 0; i < values.length; i++) {
            sum += values[i];
        }
        statistics.average = sum / statistics.changes;

        statistics.sum += _newValue;
        statistics.average2 = statistics.sum / statistics.changes;
    }

    function getX() constant returns (uint) {
        return x;
    }

    function getValues() constant returns (uint[]) {
        return values;
    }
}
