
pragma solidity ^0.4.0;

contract Exercise3Contract {

    enum Status {Created, Active, Inactive}

    address owner;
    Status public status;

    function VerySimpleContract() {
        owner = msg.sender;
        status = Status.Created;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    modifier inState(Status _status) {
        if (status != _status) throw;
        _;
    }

    function activate() inState(Status.Created) {
        status = Status.Active;
    }

    function deactivate() onlyOwner inState(Status.Active) {
        status = Status.Inactive;
    }
}
