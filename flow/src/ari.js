var bitcoin = require('bitcoinjs-lib');
var shell = require('shelljs');
var BigInteger = require('bigi');
var BigDecimal = require("big.js");
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
  console.log("=================================");
}

function failStep() {
  console.log("\nStep failed");
  console.log("=================================");
}

function sign(tx, privateKeyWIF) {
  beginStep("3. sign", "{privateKeyWIF: " +  privateKeyWIF + "}");

  var keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, bitcoin.networks.testnet);
  tx.sign(0, keyPair);

  endStep();
}

function addInput(tx, inputTxHash, inputTxVOut) {
  beginStep("1. adding input", "{txHash: " +  inputTxHash + ", vout: " + inputTxVOut + "}");

  tx.addInput(inputTxHash, inputTxVOut);

  endStep();
}

function addOutputs(tx, addressFrom, balanceInBTC, recipientData) {
  beginStep("2. adding outputs", "{addressFrom: " + addressFrom +
    ", balanceInBTC: " + balanceInBTC + ", recipientData: " + recipientData + "}");

  var balance = new BigDecimal(balanceInBTC).times(MULTIPLIER);
  console.log(currency("balance", balance));

  var totalAmount = new BigDecimal(0);

  recipientData.forEach((oneRecipientData) => {
    var amount = new BigDecimal(oneRecipientData.transferAmountInBTC).times(MULTIPLIER);

    console.log("adding output  {address: " + oneRecipientData.recipientAddress
      + ", " + currency("amount", amount) + ", " + currency("totalAmount", totalAmount) + "}");

    totalAmount = totalAmount.plus(amount);
    tx.addOutput(oneRecipientData.recipientAddress, parseInt(amount));
  });

  var miningFee = new BigDecimal(0.0003).times(MULTIPLIER);
  var change = balance.minus(totalAmount).minus(miningFee);

  console.log(currency("miningFee", miningFee));
  console.log(currency("change", change));

  tx.addOutput(addressFrom, parseInt(change));

  endStep();
}

function validate(originData) {
  beginStep("0. validating", "");

  var shellResult = shell.exec('bitcoin-cli -testnet gettxout ' + originData.txHash + ' ' + originData.vOut);
  if (shellResult.code == 0) {
    var outJson = JSON.parse(shellResult.stdout);
    var address = outJson.scriptPubKey.addresses[0];
    var value = outJson.value;

    if (originData.originAddress == address) {
      console.log("Address OK");
    } else {
      console.log("Addresses dont match!!!");
      failStep();
      return false;
    }

    if (originData.currentBalanceInBTC == value) {
      console.log("Balances OK");
    } else {
      console.log("Balances dont match!!!");
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

function buildTx(originData, recipientData) {
  if (!validate(originData)) return;

  var tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet);
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

  return t;
}

function sendTx(t) {
  beginStep("5. send tx");

  var shellResult = shell.exec('bitcoin-cli -testnet sendrawtransaction ' + t.toHex());
  if (shellResult.code == 0) {
    console.log('TX PUSHED! YEAH!!!');
    endStep();
  } else {
    console.error('ERROR PUSHING TX!!!');
    failStep();
  }
}

var t = buildTx({
  originAddress: 'mfg2bzXEJ2gwUPA5UaiN7ubnLZu1YPSgu8',
  privateKeyWIF: 'cSR3WmP1y37i7xnHV3ZDjvBh6ZkPPKk2p9HQSctTb2e9t5XEEPec',
  txHash: '58f810f7486eff1c147d5b2ccdb8c9931f3b14fb818272ee30a3534d0a814c52',
  vOut: 20,
  currentBalanceInBTC: 1.0249
  },
  [
    {
      recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
      transferAmountInBTC: 0.0001
    },
    {
      recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
      transferAmountInBTC: 0.0002
    },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0003
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0004
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0001
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0002
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0003
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0004
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0001
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0002
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0003
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0004
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0001
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0002
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0003
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0004
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0001
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0002
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0003
    // },
    // {
    //   recipientAddress: 'mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf',
    //   transferAmountInBTC: 0.0004
    // },
  ]
);
sendTx(t);
