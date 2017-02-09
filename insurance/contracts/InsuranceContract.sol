pragma solidity ^0.4.4;

/*contract MyToken {
  string name;
  string symbol;
  uint8 decimals;

  mapping (address => uint256) public balanceOf;

  event Transfer(address indexed from, address indexed to, uint256 value);

  function MyToken(uint256 initialSupply, string tokenName, string tokenSymbol, uint8 decimalUnits) {
    balanceOf[msg.sender] = initialSupply;
    name = tokenName;
    symbol = tokenSymbol;
    decimals = decimalUnits;
  }

  function transfer(address _to, uint256 _value) {
    if (_value > balanceOf[msg.sender]) throw;
    if (balanceOf[_to] + _value < balanceOf[_to]) throw;
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    Transfer(msg.sender, _to, _value);
  }
}*/

/*library Helper {

	enum Cobertura { Basica, Intermediaria, Completa }
	enum Sinistro { Leve, Medio, Punk }

	function sinistroAsInt(Sinistro s) internal returns(uint8) {
		if (s == Sinistro.Leve)  return 0;
		if (s == Sinistro.Medio) return 1;
		if (s == Sinistro.Punk)  return 2;
		throw;
	}

	function coberturaAsInt(Cobertura c) internal returns(uint8) {
		if (c == Cobertura.Basica)  return 0;
		if (c == Cobertura.Intermediaria) return 1;
		if (c == Cobertura.Completa)  return 2;
		throw;
	}
}

contract Beneficiaries {
	address[] beneficiaries;

	function push(address b) {
		beneficiaries.push(b);
	}

	function contains(address b) returns(bool) {
		for (uint256 i = 0; i < beneficiaries.length; i++) {
			if (beneficiaries[i] == b) {
				return true;
			}
		}
	}
}*/

contract InsuranceContract {

	struct Apolice {
		Helper.Cobertura cobertura;
	}

	mapping(address => Apolice) public apolices;
	address insurer;
	Beneficiaries beneficiaries;

	modifier onlyInsurer() {
		if (msg.sender != insurer) throw;
		_;
	}

	modifier onlyBeneficiary() {
		if (beneficiaries.contains(msg.sender)) throw;
		_;
	}

	function constructor() {
		insurer = msg.sender;
	}

	function newApolice(address beneficiary) onlyInsurer {
		apolices[beneficiary] = Apolice({
			cobertura: Helper.Cobertura.Basica
			});
	}

	function upgradeCobertura(address beneficiary, Helper.Cobertura c) onlyBeneficiary {
		apolices[beneficiary].cobertura = c;
	}


	function isCovered(Helper.Sinistro s) constant returns(bool) {
		return (Helper.sinistroAsInt(s) <= Helper.coberturaAsInt(apolices[msg.sender].cobertura));
	}

	function register(Helper.Sinistro s) onlyBeneficiary {
		if (!isCovered(s)) throw;

	}
}
