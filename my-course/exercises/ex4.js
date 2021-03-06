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
    this.inputs.push({txHash, index});
  }

  addOutput(recipient, value) {
    this.outputs.push({recipient, value});
  }

  hash() {
    var all = [];
    this.inputs.forEach(i => all.push(i.txHash, i.index));
    this.outputs.forEach(o => all.push(o.recipient, o.value));
    this.txHash = hash(all);
  }
}

class SimpleMerkleTree {
  constructor() {
    this.merkleRoot = '';
    this.txs = [];
  }
  add(tx) {
    this.txs.push(tx);
    var txHashes = [];
    this.txs.forEach(tx => txHashes.push(tx.txHash));
    this.merkleRoot = hash(txHashes);
  }
}

class SimpleBlock {
  constructor(height, timestamp, previousBlock, txsTree, hash, nonce) {
    // TODO
    // salvar dados recebidos em atributos da classe
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

tree = new SimpleMerkleTree();
tree.add(coinbase);
tree.add(secondTx);

block = new Block(0, '2017-04-10 21:30', '0000000000000000000000000000000000000000000000000000000000000000', tree);
console.log('Block');
print(block);

//
// hashing: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa 50
// hashing: 091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b 0 13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP 30 1GVW6vDdwdfqoswio1VQ8HaCRFQN3U9hqz 20
// hashing: 091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b
// hashing: 091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b f0a839aada49dd48e3f66c5da606ac3df7e9f8b53bd238bbb4a4b76708c935cd
// Block
// {
//   height: 0,
//   timestamp: "2017-04-10 21:30",
//   hash: undefined,
//   previousBlock: "0000000000000000000000000000000000000000000000000000000000000000",
//   merkleRoot: "720819ec00b5f2cd7526a3e1eae02b35de9744b521107d131b623216bf4cd707",
//   nonce: undefined,
//   txsTree: {
//     merkleRoot: "720819ec00b5f2cd7526a3e1eae02b35de9744b521107d131b623216bf4cd707",
//     txs: [      {
//         txHash: "091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b",
//         inputs: [],
//         outputs: [          {
//             recipient: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
//             value: 50
//           }        ]
//       },
//       {
//         txHash: "f0a839aada49dd48e3f66c5da606ac3df7e9f8b53bd238bbb4a4b76708c935cd",
//         inputs: [          {
//             txHash: "091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b",
//             index: 0
//           }        ],
//         outputs: [          {
//             recipient: "13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP",
//             value: 30
//           },
//           {
//             recipient: "1GVW6vDdwdfqoswio1VQ8HaCRFQN3U9hqz",
//             value: 20
//           }        ]
//       }    ]
//   }
// }
