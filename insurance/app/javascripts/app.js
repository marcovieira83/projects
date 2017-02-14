import '../stylesheets/app.css';

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import insurance_artifacts from '../../build/contracts/Insurance.json'

var Insurance = contract(insurance_artifacts);
var accounts, account;

window.App = {
  start: function() {
    var self = this;

    Insurance.setProvider(web3.currentProvider);

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
      account = accounts[0];
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

  loadApolices: function(beneficiaries) {
    var list = document.getElementById('allApolices');
    list.innerHTML = "";

    beneficiaries.forEach(function(b) {
      Insurance.deployed().then(function(instance) {
        return instance.getApolice.call(b, {from: account});
      }).then(function(result) {
        return "beneficiary: " + b +
          '; carModel: ' + result[0] +
          '; carId: ' + result[1] +
          '; carYear: ' + result[2] +
          '; amount: ' + result[3] +
          '; coverage: ' + result[4];
      }).then(function(str) {
        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode(str));
        list.appendChild(entry);
      });
    });
  },

  showApolices: function() {
    var self = this;

    var meta;
    Insurance.deployed().then(function(instance) {
      meta = instance;
      return meta.getBeneficiaries.call();
    }).then(function(beneficiaries) {
      self.loadApolices(beneficiaries);
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
        {from: account,
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
      instance.upgrade(beneficiary, coverageInt, {from: account});
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
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
