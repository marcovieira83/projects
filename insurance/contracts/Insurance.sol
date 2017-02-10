pragma solidity ^0.4.2;

library Helper {

	enum Coverage { Basic, Intermediary, Full }
	enum Sinistro { Leve, Medio, Punk }

	function sinistroAsInt(Sinistro s) internal returns(uint8) {
		if (s == Sinistro.Leve)  return 0;
		if (s == Sinistro.Medio) return 1;
		if (s == Sinistro.Punk)  return 2;
		throw;
	}

	function sinistroAsStr(uint s) internal returns(string) {
		if (s == 0)  return "Low";
		if (s == 1) return "Medium";
		if (s == 2)  return "Full Loss";
		throw;
	}

	function coverageAsInt(Coverage c) internal returns(uint8) {
		if (c == Coverage.Basic)  return 0;
		if (c == Coverage.Intermediary) return 1;
		if (c == Coverage.Full)  return 2;
		throw;
	}

	function coverageAsStr(Coverage c) internal returns(string) {
		if (c == Coverage.Basic)  return "Basic";
		if (c == Coverage.Intermediary) return "Intermediary";
		if (c == Coverage.Full)  return "Full";
		throw;
	}
}

contract Insurance {
	struct Car {
		string id;
		string model;
		uint year;
	}
	struct  Apolice {
		Helper.Coverage coverage;
		uint amount;
		Car car;
	}
  address insurer;
	mapping(address => Apolice) apolices;
	address[] beneficiaries;

	event NewBeneficiary(address beneficiary);
	event NewApoliceEvent(address beneficiary, string carId);

  modifier onlyInsurer() {
  		if (msg.sender != insurer) throw;
  		_;
  }

  function Insurance() {
    insurer = msg.sender;
  }

  function getStatus() constant returns(string) {
    return "Working!";
  }

	function addBeneficiary(address beneficiary) internal constant returns(bool) {
		for (uint i = 0; i < beneficiaries.length; i++) {
			if (beneficiaries[i] == beneficiary) {
				return false;
			}
		}
		beneficiaries.push(beneficiary);
		NewBeneficiary(beneficiary);
		return true;
	}

	function newApolice(
		address beneficiary,
		uint value,
		string carId,
		string carModel,
		uint carYear) onlyInsurer {
		apolices[beneficiary] = Apolice({
			coverage: Helper.Coverage.Basic,
			amount: value,
			car : Car({
				id: carId,
				model: carModel,
				year: carYear
				})});
		addBeneficiary(beneficiary);
		NewApoliceEvent(beneficiary, carId);
	}

	function getBeneficiaries() constant returns(address[]) {
		return beneficiaries;
	}

	function getApolice(address beneficiary) constant returns(string coverage, uint amount) {
		Apolice apolice = apolices[beneficiary];
		coverage = Helper.coverageAsStr(apolice.coverage);
		amount = apolice.amount;
	}
}
