var bitcoin = require('bitcoinjs-lib');
var shelljs = require('shelljs');
var BigInteger = require('bigi');
var BigDecimal = require("big.js");

var argv = require('minimist')(process.argv.slice(2));
const SKIP_VALIDATION = argv.skipValidation ? true : false;
const NETWORK = argv.prod ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
const NETWORK_NAME = argv.prod ? 'bitcoin' : 'testnet';
const SHOULD_SEND = argv.shouldSend ? true : false;

console.log("skipValidation: " + SKIP_VALIDATION);
console.log("network: " + NETWORK_NAME);
console.log("shouldSend: " + SHOULD_SEND);

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
  const SATOSHI_PER_BYTE = new BigDecimal(440);
  const BASE_TX_SIZE_WITH_TWO_OUTPUTS = new BigDecimal(226);
  const OUTPUT_SIZE = new BigDecimal(34);

  console.log("calculating mining fee. {satoshiPerByte: " + SATOSHI_PER_BYTE +
      ", baseTxSizeWithTwoOutputs: " + BASE_TX_SIZE_WITH_TWO_OUTPUTS +
      ", outputSize: " + OUTPUT_SIZE +
      ", outputsCount: " + outputsCount + "}");

  var estimatedSize = BASE_TX_SIZE_WITH_TWO_OUTPUTS;
  if (outputsCount > 2) {
    var extraOutputCount = new BigDecimal(outputsCount - 2);
    var extraSize = extraOutputCount.times(OUTPUT_SIZE);
    estimatedSize = estimatedSize.add(extraSize);
  }

  var fee = estimatedSize.times(SATOSHI_PER_BYTE);
  console.log("estimatedSize: " + estimatedSize +
      ", total fee: " + fee +
      ", satoshiPerByte: " + fee.div(estimatedSize));

  //  817520 -  50 txs
  // 1146640 - 100 txs
  if (fee.gt(new BigDecimal(817520))) throw "Fee too high! Check it, please";

  return fee;
}

function addOutputs(tx, addressFrom, balanceInBTC, recipientData) {
  beginStep("2. adding outputs", "{addressFrom: " + addressFrom +
    ", balanceInBTC: " + balanceInBTC + ", recipientData: " + JSON.stringify(recipientData) + "}");

  var balance = new BigDecimal(balanceInBTC).times(MULTIPLIER);
  var totalAmountInformed = new BigDecimal(recipientData.totalAmount).times(MULTIPLIER);
  var miningFee = getMiningFee(recipientData.transfers.length + 1);
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

  if (!SHOULD_SEND) {
    console.log('Skipping send...');
  } else {
    sendTx(t);
  }

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

const TRANSFER_COUNT = 27;
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
  txHash: '72650689f7ec267bc30c4f1481dd56485f0613e4d45dcad5115dc95477e34f99',
  vOut: 0,
  currentBalanceInBTC: 0.0096,
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
