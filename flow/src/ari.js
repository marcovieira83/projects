var bitcoin = require('bitcoinjs-lib');
var shelljs = require('shelljs');
var BigInteger = require('bigi');
var BigDecimal = require("big.js");
var winston = require('winston');
var argv = require('minimist')(process.argv.slice(2));
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'debug.log' })
  ]
});

const MULTIPLIER = new BigDecimal(100000000);
const SKIP_VALIDATION = argv.skipValidation ? true : false;
const NETWORK = argv.prod ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
const NETWORK_NAME = argv.prod ? 'bitcoin' : 'testnet';
const SHOULD_SEND = argv.shouldSend ? true : false;

logger.info("init params: {skipValidation: " + SKIP_VALIDATION +
    ", network: " + NETWORK_NAME +
    ", shouldSend: " + SHOULD_SEND + "}\n");

if (SHOULD_SEND && SKIP_VALIDATION) {
  logger.error("ERROR: You cannot skip validation if you will send the message.");
  throw "ERROR: You cannot skip validation if you will send the message.";
}

var jsonfile = require('jsonfile');
var recipientData = jsonfile.readFileSync('./transfers.json');
var originData = jsonfile.readFileSync('./origin.json');
var conf = jsonfile.readFileSync('./conf.json');

const SATOSHI_PER_BYTE = new BigDecimal(conf.satoshiPerByte);
const BASE_TX_SIZE_WITH_TWO_OUTPUTS = new BigDecimal(conf.baseTxSizeWithTwoOutputs);
const OUTPUT_SIZE = new BigDecimal(conf.outputSize);
const MAX_FEE = new BigDecimal(conf.maxFee);

buildTx(originData, recipientData);


function currency(name, amountInSatoshi) {
  return name + ": {satoshi: " + amountInSatoshi + ", btc: " + amountInSatoshi.div(MULTIPLIER) + "}";
}

function beginStep(msg, params) {
  logger.info("=================================");
  logger.info("Step: " + msg);
  logger.info("Params: " + params + "\n");
}

function endStep() {
  logger.info("Step completed");
  logger.info("=================================\n");
}

function failStep() {
  logger.info("\nStep failed");
  logger.info("=================================\n");
}

function shell(cmd) {
  var bitcoinCli = NETWORK == bitcoin.networks.bitcoin ? 'bitcoin-cli' : 'bitcoin-cli -testnet';
  var fullCmd = bitcoinCli + ' ' + cmd;
  logger.info("shell cmd: " + fullCmd + "\nshell result:");

  return shelljs.exec(fullCmd);
}

function validate(originData, recipientData) {
  beginStep("0. validating", "");

  logger.info("checking if tx output is valid...");
  var shellResult = shell('gettxout ' + originData.txHash + ' ' + originData.vOut);

  if (shellResult.code == 0) {
    if (shellResult.stdout === '') {
      logger.error("Tx output not found. Probably this tx output was already spent: {txHash: "
          + originData.txHash + ", vOut: " + originData.vOut + "}");
      failStep();
      return false;
    }

    var outJson = JSON.parse(shellResult.stdout);
    var address = outJson.scriptPubKey.addresses[0];
    var value = outJson.value;

    if (originData.originAddress == address) {
      logger.info("Address OK");
    } else {
      logger.error("Addresses dont match!!!");
      failStep();
      return false;
    }

    if (originData.currentBalanceInBTC == value) {
      logger.info("Balances OK");
    } else {
      logger.error("Balances dont match!!!");
      failStep();
      return false;
    }

    logger.info("validating recipientData...");

    var totalAmount = new BigDecimal(0);
    var i = 0;
    recipientData.transfers.forEach((oneRecipientData) => {
      totalAmount = totalAmount.plus(oneRecipientData.transferAmountInBTC);
      i++;
    });

    if (totalAmount.eq(new BigDecimal(recipientData.totalAmount))) {
      logger.info("Total amount OK");
    } else {
      logger.error("Total amount dont match!!!");
      failStep();
      return false;
    }

    if (recipientData.count === i) {
      logger.info("Recipient count OK");
    } else {
      logger.error("Recipient count not OK!!!");
      failStep();
      return false;
    }

    if (recipientData.totalAmount > originData.currentBalanceInBTC) {
      logger.error("Total amount to be transfered is greater than current balance. {" +
          "recipientData.totalAmount: " + recipientData.totalAmount +
          "originData.currentBalanceInBTC: " + originData.currentBalanceInBTC +
          "}");
      return false;
    }

  } else {
    logger.error('ERROR VALIDATING TX!!!');
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
  logger.info("calculating mining fee. {satoshiPerByte: " + SATOSHI_PER_BYTE +
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
  logger.info("estimatedSize: " + estimatedSize +
      ", total fee: " + fee +
      ", satoshiPerByte: " + fee.div(estimatedSize));

  //  817520 -  50 txs
  // 1146640 - 100 txs
  if (fee.gt(new BigDecimal(MAX_FEE))) throw "Fee too high! Check it, please";

  return fee;
}

function addOutputs(tx, addressFrom, balanceInBTC, recipientData) {
  beginStep("2. adding outputs", "{addressFrom: " + addressFrom +
    ", balanceInBTC: " + balanceInBTC + ", recipientData: " + JSON.stringify(recipientData) + "}");

  var balance = new BigDecimal(balanceInBTC).times(MULTIPLIER);
  var totalAmountInformed = new BigDecimal(recipientData.totalAmount).times(MULTIPLIER);
  var miningFee = getMiningFee(recipientData.transfers.length + 1);
  var change = balance.minus(totalAmountInformed).minus(miningFee);

  logger.info(currency("balance", balance));
  logger.info(currency("totalAmount", totalAmountInformed));
  logger.info(currency("miningFee", miningFee));
  logger.info(currency("change", change));

  tx.addOutput(addressFrom, parseInt(change));

  var totalAmount = new BigDecimal(0);
  var outputsCount = 0;

  recipientData.transfers.forEach((oneRecipientData) => {
    var amount = new BigDecimal(oneRecipientData.transferAmountInBTC).times(MULTIPLIER);

    logger.info("adding output " + outputsCount++ +": {address: " + oneRecipientData.recipientAddress
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
    logger.info('Skipping validation...');
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

  logger.info('hash: ' + t.getId());
  logger.info('byteLength: ' + t.byteLength());
  logger.info('hex: ' + t.toHex());

  endStep();

  if (!SHOULD_SEND) {
    logger.info('Skipping send...');
  } else {
    sendTx(t);
  }

  return t;
}

function sendTx(t) {
  beginStep("5. send tx");

  var shellResult = shell('sendrawtransaction ' + t.toHex());
  if (shellResult.code == 0) {
    logger.info('TX PUSHED! YEAH!!!');
    endStep();
  } else {
    logger.error('ERROR PUSHING TX!!!');
    failStep();
  }
}
