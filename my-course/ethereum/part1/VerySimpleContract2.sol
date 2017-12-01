pragma solidity 0.4.19;

contract VerySimpleContract {
    struct Statistics {
        uint max;
        uint changes;
    }

    Statistics public statistics;
    uint public x;

    function VerySimpleContract() public {
        setX(27);
    }

    function getX() public view returns (uint) {
        return x;
    }


    function getXPlusOne() public view returns (uint _value) {
      _value = x + 1;
    }

    function setX(uint _newValue) public {
        x = _newValue;

        if (_newValue > statistics.max) {
          statistics.max = _newValue;
          statistics.changes++;
        }
    }
}
