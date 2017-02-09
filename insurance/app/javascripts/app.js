// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
// import metacoin_artifacts from '../../build/contracts/MetaCoin.json'
import insurance_artifacts from '../../build/contracts/Insurance.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
// var MetaCoin = contract(metacoin_artifacts);
var Insurance = contract(insurance_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts, account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    // MetaCoin.setProvider(web3.currentProvider);
    Insurance.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

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

  showApolices: function() {
    var self = this;

    var meta;
    Insurance.deployed().then(function(instance) {
      meta = instance;
      return meta.getStatus.call();
    }).then(function(value) {
      console.log('uhuuu');
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error showing apolices; see log.");
    });
  },

  create: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var beneficiary = document.getElementById("beneficiary").value;
    this.setStatus("Initiating transaction... (please wait)");

    Insurance.deployed().then(function(instance) {
      return instance.newApolice(beneficiary, amount, {from: account});
    }).then(function(value) {
      self.setStatus("Transaction complete!" + JSON.stringify(value));
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
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
