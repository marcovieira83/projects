const CryptoJS = require('crypto-js');
const print = require('json-colorz');

function hash(args) {
  var allValues = '';
  args.forEach((arg) => allValues += arg + ' ');
  console.log('hashing: ' + allValues);
  return CryptoJS.SHA256(allValues).toString();
}

class SimpleTx  {
  constructor() {
    this.txHash = '';
    this.inputs = [];
    this.outputs = [];
  }

  addInput(txHash, index) {
    // TODO
    // adicionar objeto {txHash, index} em inputs
    this.inputs.push({txHash, index});
  }

  addOutput(recipient, value) {
    // TODO
    // adicionar objeto {recipient, value} em outputs
    this.outputs.push({recipient, value});
  }

  hash() {
    // TODO
    var all = [];
    // colocar em um array todos os valores de inputs e outputs
    this.inputs.forEach(i => all.push(i.txHash, i.index));
    // calcular hash utilizando o método hash
    this.outputs.forEach(o => all.push(o.recipient, o.value));
    // salvar resultado em this.txHash
    this.txHash = hash(all);
  }
}

var coinbase = new SimpleTx();
coinbase.addOutput('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 50);
coinbase.hash();

var secondTx = new SimpleTx();
secondTx.addInput(coinbase.txHash, 0);
secondTx.addOutput('13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP', 30);
secondTx.addOutput('1GVW6vDdwdfqoswio1VQ8HaCRFQN3U9hqz', 20);
secondTx.hash();

console.log('coinbase');
print(coinbase);
console.log('secondTx');
print(secondTx);

//
// hashing: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa 50
// hashing: 091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b 0 13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP 30 1GVW6vDdwdfqoswio1VQ8HaCRFQN3U9hqz 20
// coinbase
// {
//   txHash: "091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b",
//   inputs: [],
//   outputs: [    {
//       recipient: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
//       value: 50
//     }  ]
// }
// secondTx
// {
//   txHash: "f0a839aada49dd48e3f66c5da606ac3df7e9f8b53bd238bbb4a4b76708c935cd",
//   inputs: [    {
//       txHash: "091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b",
//       index: 0
//     }  ],
//   outputs: [    {
//       recipient: "13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP",
//       value: 30
//     },
//     {
//       recipient: "1GVW6vDdwdfqoswio1VQ8HaCRFQN3U9hqz",
//       value: 20
//     }  ]
// }
