var bitcoin = require('bitcoinjs-lib');
var shelljs = require('shelljs');
var BigInteger = require('bigi');
var BigDecimal = require("big.js");

var argv = require('minimist')(process.argv.slice(2));
const SKIP_VALIDATION = argv.skipValidation ? true : false;
const NETWORK = argv.prod ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;

console.log("skipValidation: " + SKIP_VALIDATION);
console.log("network: " + NETWORK);

const MULTIPLIER = new BigDecimal(100000000);

function currency(name, amountInSatoshi) {
  return name + ": {satoshi: " + amountInSatoshi + ", btc: " + amountInSatoshi.div(MULTIPLIER) + "}";
}

function beginStep(msg, params) {
  console.log("=================================");
  console.log("Step: " + msg);
  console.log("Params: " + params + "\n");
}

function endStep() {
  console.log("\nStep completed");
  console.log("=================================\n");
}

function failStep() {
  console.log("\nStep failed");
  console.log("=================================\n");
}

function shell(cmd) {
  var bitcoinCli = NETWORK == bitcoin.networks.bitcoin ? 'bitcoin-cli' : 'bitcoin-cli -testnet';
  var fullCmd = bitcoinCli + ' ' + cmd;
  console.log("shell cmd: " + fullCmd + "\nshell result:");

  return shelljs.exec(fullCmd);
}

function validate(originData, recipientData) {
  beginStep("0. validating", "");

  console.log("checking if tx output is valid...");
  var shellResult = shell('gettxout ' + originData.txHash + ' ' + originData.vOut);

  if (shellResult.code == 0) {
    if (shellResult.stdout === '') {
      console.error("Tx output not found. Probably this tx output was already spent: {txHash: "
          + originData.txHash + ", vOut: " + originData.vOut + "}");
      failStep();
      return false;
    }

    var outJson = JSON.parse(shellResult.stdout);
    var address = outJson.scriptPubKey.addresses[0];
    var value = outJson.value;

    if (originData.originAddress == address) {
      console.log("Address OK");
    } else {
      console.error("Addresses dont match!!!");
      failStep();
      return false;
    }

    if (originData.currentBalanceInBTC == value) {
      console.log("Balances OK");
    } else {
      console.error("Balances dont match!!!");
      failStep();
      return false;
    }

    console.log("validating recipientData...");

    var totalAmount = new BigDecimal(0);
    var i = 0;
    recipientData.transfers.forEach((oneRecipientData) => {
      totalAmount = totalAmount.plus(oneRecipientData.transferAmountInBTC);
      i++;
    });

    if (totalAmount.eq(new BigDecimal(recipientData.totalAmount))) {
      console.log("Total amount OK");
    } else {
      console.error("Total amount dont match!!!");
      failStep();
      return false;
    }

    if (recipientData.count === i) {
      console.log("Recipient count OK");
    } else {
      console.error("Recipient count not OK!!!");
      failStep();
      return false;
    }

  } else {
    console.error('ERROR VALIDATING TX!!!');
    failStep();
    return false;
  }

  endStep();
  return true;
}

function addInput(tx, inputTxHash, inputTxVOut) {
  beginStep("1. adding input", "{txHash: " +  inputTxHash + ", vout: " + inputTxVOut + "}");

  tx.addInput(inputTxHash, inputTxVOut);

  endStep();
}

function getMiningFee(outputsCount) {
  return 0.0003;
}

function addOutputs(tx, addressFrom, balanceInBTC, recipientData) {
  beginStep("2. adding outputs", "{addressFrom: " + addressFrom +
    ", balanceInBTC: " + balanceInBTC + ", recipientData: " + JSON.stringify(recipientData) + "}");

  var balance = new BigDecimal(balanceInBTC).times(MULTIPLIER);
  var totalAmountInformed = new BigDecimal(recipientData.totalAmount).times(MULTIPLIER);
  var miningFee = new BigDecimal(getMiningFee()).times(MULTIPLIER);
  var change = balance.minus(totalAmountInformed).minus(miningFee);

  console.log(currency("balance", balance));
  console.log(currency("totalAmount", totalAmountInformed));
  console.log(currency("miningFee", miningFee));
  console.log(currency("change", change));

  tx.addOutput(addressFrom, parseInt(change));

  var totalAmount = new BigDecimal(0);
  var outputsCount = 0;

  recipientData.transfers.forEach((oneRecipientData) => {
    var amount = new BigDecimal(oneRecipientData.transferAmountInBTC).times(MULTIPLIER);

    console.log("adding output " + outputsCount++ +": {address: " + oneRecipientData.recipientAddress
        + ", " + currency("amount", amount) + "}");

    totalAmount = totalAmount.plus(amount);
    tx.addOutput(oneRecipientData.recipientAddress, parseInt(amount));
  });

  // validates again
  if (!totalAmount.eq(new BigDecimal(recipientData.totalAmount).times(MULTIPLIER))) {
    throw "Total amount does not match.";
  }

  endStep();
}



function sign(tx, privateKeyWIF) {
  beginStep("3. sign", "{privateKeyWIF: " +  privateKeyWIF + "}");

  var keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, NETWORK);
  tx.sign(0, keyPair);

  endStep();
}

function buildTx(originData, recipientData) {
  if (SKIP_VALIDATION) {
    console.log('Skipping validation...');
  } else if (!validate(originData, recipientData)) {
    return;
  }

  var tx = new bitcoin.TransactionBuilder(NETWORK);
  tx.setVersion(2);

  addInput(tx, originData.txHash, originData.vOut);
  addOutputs(tx, originData.originAddress, originData.currentBalanceInBTC,
    recipientData);
  sign(tx, originData.privateKeyWIF);

  beginStep("4. build tx");
  var t = tx.build();

  console.log('hash: ' + t.getId());
  console.log('byteLength: ' + t.byteLength());
  console.log('hex: ' + t.toHex());

  endStep();

  sendTx(t);

  return t;
}

function sendTx(t) {
  beginStep("5. send tx");

  var shellResult = shell('sendrawtransaction ' + t.toHex());
  if (shellResult.code == 0) {
    console.log('TX PUSHED! YEAH!!!');
    endStep();
  } else {
    console.error('ERROR PUSHING TX!!!');
    failStep();
  }
}

const TRANSFER_COUNT = 1;
const TRANSFER_AMOUNT = 0.0001;
const TOTAL_AMOUNT = parseFloat(new BigDecimal(TRANSFER_COUNT).times(TRANSFER_AMOUNT));

var transfers = [];
for (var i = 0; i < TRANSFER_COUNT; i++) {
  transfers.push({
    // recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    recipientAddress: '1HuepS5LbZ66mGbZN7UEJzAV6iWsjK31Ga',
    transferAmountInBTC: TRANSFER_AMOUNT
  });
}

var t = buildTx({
  originAddress: '18Ur8RRYg9exNpSzRVWBcJcitKhjVWMHpy',
  privateKeyWIF: 'KwvPSss1v25dBHf7nAE1LjALGkdgArZM1e8kZHhrNAB8Xh41CeGW',
  txHash: '3229c7290c65db45b3b614ce3149a0847331c50d6b5c3457bf30e0aaac430084',
  vOut: 0,
  currentBalanceInBTC: 0.01,
  },
  {
    count: TRANSFER_COUNT,
    totalAmount: TOTAL_AMOUNT,
    transfers: transfers
  }
);
// var t = buildTx({
//   originAddress: 'mfg2bzXEJ2gwUPA5UaiN7ubnLZu1YPSgu8',
//   privateKeyWIF: 'cSR3WmP1y37i7xnHV3ZDjvBh6ZkPPKk2p9HQSctTb2e9t5XEEPec',
//   txHash: 'f4ec61aa7a3fb9a4a51b2d7b6b223956a2ec2abe08e777703484fa975e48a6d3',
//   vOut: 0,
//   currentBalanceInBTC: 0.8326,
//   },
//   {
//     count: TRANSFER_COUNT,
//     totalAmount: TOTAL_AMOUNT,
//     transfers: transfers
//   }
// );



// {
//   id: '7df2dc6b2a78ce5dbfd531ea17bdf4acfa4b0eca1309500a2c3b3a8fdc29b7d2',
//   count: 3,
//   totalAmount: 31.70409678,
//   transfers: [
//     {
//       recipientAddress: '1Ps4FnuFuND6atiLnsFDSuWpBvovxLCTHU',
//       transferAmountInBTC: 0.12345678
// 	   },
//      {
//        recipientAddress: '17ZDNCmQtELZ1RvBAhEdTeHwzm4Bag76LH',
//        transferAmountInBTC: 1.45632
//  	   },
//      {
//        recipientAddress: '1QCdtSYauDJvcGpPx5M4kUaawqRRVJ4vLJ',
//        transferAmountInBTC: 30.12432
//  	   }
//    ]
// }
