pragma solidity ^0.4.2;

library Helper {

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

contract Apolice {
	Helper.Cobertura cobertura;
	uint amount;
	function Apolice(Helper.Cobertura c, uint a) {
		cobertura = c;
		amount = a;
	}
}

contract Apolices {
	mapping(address => Apolice) apolices;

	function put(address beneficiary, Apolice apolice) {
		apolices[beneficiary] = apolice;
	}
}

contract Insurance {
  address insurer;
	Apolices apolices;

  modifier onlyInsurer() {
  		if (msg.sender != insurer) throw;
  		_;
  }

  function Insurance() {
    insurer = msg.sender;
  }

  function getStatus() returns(string) {
    return "Working!";
  }

	function newApolice(address beneficiary, uint value) onlyInsurer {
		apolices.put(
			beneficiary,
			new Apolice(
				Helper.Cobertura.Basica,
				value));
	}

  // works
  // meta.getBal.call(account)
	function getBal(address addr) returns(uint) {
		return 20;
	}

  // works
  // meta.getBala.call()
	function getBala() returns(uint) {
		return 50;
	}
}
