pragma solidity 0.4.19;

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

    function VerySimpleContract() public {
        setX(27);
    }

    function setX(uint _newValue) public {
        require(_newValue <= 100);

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

    function getX() public view returns (uint) {
        return x;
    }

    function getValues() public view returns (uint[]) {
        return values;
    }
}
