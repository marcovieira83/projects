var bitcoin = require('bitcoinjs-lib');
var BigInteger = require('bigi');
var tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet);
tx.setVersion(2);

var txId = '18ab6a1804bdbd22f878f23f832d329ba6fcf138a373897c3edc9d636b32c437';
tx.addInput(txId, 1);

var addressFrom = "mfg2bzXEJ2gwUPA5UaiN7ubnLZu1YPSgu8";
var addressTo = "mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf";

const multiplier = 100 * 1000 * 1000;
var balance = 1.2094 * multiplier;
var transferAmount = 0.01 * multiplier;
var miningFee = 0.0003 * multiplier;
var change = balance - transferAmount - miningFee;

console.log("balance: " + balance);
console.log("transferAmount: " + transferAmount);
console.log("miningFee: " + miningFee);
console.log("change: " + change);

tx.addOutput(addressTo, transferAmount);
tx.addOutput(addressFrom, change);

var privateKeyWIF = 'cSR3WmP1y37i7xnHV3ZDjvBh6ZkPPKk2p9HQSctTb2e9t5XEEPec';
var keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, bitcoin.networks.testnet);
console.log("keypair.address: " + keyPair.getAddress());
tx.sign(0, keyPair);

console.log("==== signed tx ====");
var t = tx.build();
console.log('byteLength: ' + t.byteLength());
console.log('hash: ' + t.getId() + '\n');
console.log(t.toHex());

var shell = require('shelljs');
console.log("\n==== sending tx ====")
var shellResult = shell.exec('bitcoin-cli -testnet sendrawtransaction ' + t.toHex());
if (shellResult.code == 0) {
  console.log('sucesso!');
} else {
  console.error('erro');
}
