import { Component } from '@angular/core';
import { gethHelper, GethConnector} from '@akashaproject/geth-connector'
import { Web3 } from '@akashaproject/geth-connector'
// const instance = GethConnector.getInstance(); // get the Singleton Service

@Component({
  selector: 'accounts',
  template: `
    account1: {{account1}}<br>
    account2: {{account2}}<br>
    accounts: {{accounts}}<br>
  `
})
export class AccountsComponent {
  account1 = 'my account 1';
  account2 = 'my account 2';
  accounts = [ this.account1, this.account2 ];
}

// <script type="text/javascript" src="node_modules/bignumber.js/bignumber.min.js"></script>
// <script type="text/javascript" src="dist/web3-light.js"></script>
// <script type="text/javascript">
  // import Web3 = require('web3');
  // import Web3 = require('web3');
  // var web3 = new Web3();
  // web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));


// var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
