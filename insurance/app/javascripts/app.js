import '../stylesheets/app.css';

import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'

var Insurance;
var accounts, insurer;

window.App = {

  instantiateContract: function() {
    var abiArray = [ { "constant": false, "inputs": [ { "name": "beneficiary", "type": "address" }, { "name": "value", "type": "uint256" }, { "name": "carId", "type": "string" }, { "name": "carModel", "type": "string" }, { "name": "carYear", "type": "uint256" } ], "name": "newApolice", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "approveAll", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getStatus", "outputs": [ { "name": "", "type": "string", "value": "Working!" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getInsurer", "outputs": [ { "name": "", "type": "address", "value": "0x1c7eb251fcb014245f568975e1db269569daa0c6" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "beneficiary", "type": "address" } ], "name": "getPendingApprovals", "outputs": [ { "name": "currentCoverage", "type": "string", "value": "Basic" }, { "name": "newCoverage", "type": "string", "value": "Basic" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getBeneficiaries", "outputs": [ { "name": "", "type": "address[]", "value": [] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "beneficiary", "type": "address" } ], "name": "getApolice", "outputs": [ { "name": "carModel", "type": "string", "value": "" }, { "name": "carId", "type": "string", "value": "" }, { "name": "carYear", "type": "uint256", "value": "0" }, { "name": "amount", "type": "uint256", "value": "0" }, { "name": "coverage", "type": "string", "value": "Basic" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "coverageInt", "type": "uint256" } ], "name": "requestUpgrade", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getBeneficiariesWithUpgradeRequest", "outputs": [ { "name": "", "type": "address[]", "value": [] } ], "payable": false, "type": "function" }, { "inputs": [], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "beneficiary", "type": "address" } ], "name": "NewBeneficiary", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "beneficiary", "type": "address" }, { "indexed": false, "name": "carModel", "type": "string" }, { "indexed": false, "name": "carId", "type": "string" }, { "indexed": false, "name": "year", "type": "uint256" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "NewApoliceEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "beneficiary", "type": "address" }, { "indexed": false, "name": "coverage", "type": "string" } ], "name": "UpgradeApoliceEvent", "type": "event" } ];
    var address = "0xefc93cd05f931c8e7d6b3c98c1e6fef339781887";

    // web3 - if instantiated like this, the contract should not be called using deployed()
    // var Insurance = web3.eth.contract(abiArray).at(address);

    // truffle build artifacts
    // only works if insurance_artifacts were imported
    // import insurance_artifacts from '../../build/contracts/Insurance.json'
    // Insurance = contract(insurance_artifacts);

    // truffle looking up for a network
    Insurance = contract({
      abi: abiArray,
      address: address,
      // if using testrpc, should inform "-i $network_id"
      // if using geth-private, should inform "--networkid $numeric_network_id"
      network_id: "33333"
    });

    Insurance.setProvider(web3.currentProvider);
  },

  start: function() {
    var self = this;

    self.instantiateContract();

    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }
      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      console.log(accs);
      accounts = accs;
      insurer = accounts[0];
      document.getElementById("insurer").innerHTML = insurer;
      document.getElementById("beneficiary").value = accounts[1];

      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;
    document.getElementById("contractStatus").innerHTML = "Could not connect to contract!";

    var meta;
    Insurance.deployed().then(function(instance) {
      meta = instance;
      return meta.getStatus.call();
    }).then(function(value) {
      document.getElementById("contractStatus").innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting status; see log.");
    });
  },

  approveAll: function() {
    var self = this;
    Insurance.deployed().then(function(instance) {
      return instance.approveAll({from:insurer});
    }).then(function(value) {
      self.setStatus("Transaction complete!");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error approving pending requests; see log.");
    });
  },

  pendingApprovals: function() {
    var self = this;
    var list = document.getElementById('pendingApprovals');
    list.innerHTML = "";

    var meta;
    Insurance.deployed().then(function(instance) {
      meta = instance;
      return meta.getBeneficiariesWithUpgradeRequest.call({from: insurer});
    }).then(function(beneficiaries) {
      beneficiaries.forEach(function(current) {
        meta.getPendingApprovals.call(current, {from:insurer}).then(function(coverages) {
          var str = "beneficiary: " + current +
            ", from: " + coverages[0] +
            ", to: " + coverages[1];
          var entry = document.createElement('li');
          entry.appendChild(document.createTextNode(str));
          list.appendChild(entry);
        });
      });
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error loading pending approvals; see log.");
    });
  },

  showApolices: function() {
    var self = this;
    var list = document.getElementById('allApolices');
    list.innerHTML = "";

    var meta;
    Insurance.deployed().then(function(instance) {
      meta = instance;
      return meta.getBeneficiaries.call();
    }).then(function(beneficiaries) {
      beneficiaries.forEach(function(b) {
        meta.getApolice.call(b, {from:insurer}).then(function(result) {
          var str = "beneficiary: " + b +
            '; carModel: ' + result[0] +
            '; carId: '    + result[1] +
            '; carYear: '  + result[2] +
            '; amount: '   + result[3] +
            '; coverage: ' + result[4];
          var entry = document.createElement('li');
          entry.appendChild(document.createTextNode(str));
          list.appendChild(entry);
        })
      });
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error showing apolices; see log.");
    });
  },

  create: function() {
    var self = this;

    var beneficiary = document.getElementById("beneficiary").value;
    var carModel = document.getElementById("carModel").value;
    var carId = document.getElementById("carId").value;
    var year = parseInt(document.getElementById("year").value);
    var amount = parseInt(document.getElementById("amount").value);
    this.setStatus("Initiating transaction... (please wait)");

    Insurance.deployed().then(function(instance) {
      return instance.newApolice(
        beneficiary,
        amount,
        carId,
        carModel,
        year,
        {from: insurer,
        gas: 239575}); // gas estimated by mist
    }).then(function(value) {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error creating apolice; see log.");
    });
  },

  upgrade: function() {
    var self = this;

    var beneficiary = document.getElementById("beneficiary").value;
    var coverage = document.getElementById("coverage").value;
    if (coverage != "Intermediary" && coverage != "Full") {
      self.setStatus("Invalid coverage!");
      return;
    }
    var coverageInt = coverage == "Intermediary" ? 1 : 2;
    this.setStatus("Initiating transaction... (please wait)");

    Insurance.deployed().then(function(instance) {
      instance.requestUpgrade(coverageInt, {from: beneficiary, gas: 239575});
    }).then(function(value) {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error upgrading apolice; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // alert("web3 is defined");
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    // alert("web3 is undefined. Setting local provider.");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
