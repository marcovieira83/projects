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
    this.height = height;
    this.timestamp = timestamp;
    this.hash = hash;
    this.previousBlock = previousBlock;
    this.merkleRoot = txsTree.merkleRoot;
    this.nonce = nonce;
    this.txsTree = txsTree;
  }
}

class SimpleBlockchain {
  constructor() {
    this.chain = [];
  }
  add(block) {
    // TODO
    // adicionar block ao array this.chain
  }
}

function block0() {
  var coinbase = new SimpleTx();
  coinbase.addOutput('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 50);
  coinbase.hash();

  var secondTx = new SimpleTx();
  secondTx.addInput(coinbase.txHash, 0);
  secondTx.addOutput('13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP', 30);
  secondTx.addOutput('1GVW6vDdwdfqoswio1VQ8HaCRFQN3U9hqz', 20);
  secondTx.hash();

  var tree = new SimpleMerkleTree();
  tree.add(coinbase);
  tree.add(secondTx);
  return new SimpleBlock(0, '2017-04-10 21:30', '0000000000000000000000000000000000000000000000000000000000000000', tree);
}

function block1(previous) {
  var tree = new SimpleMerkleTree();

  var coinbase = new SimpleTx();
  coinbase.addOutput('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 50);
  coinbase.hash();

  var secondTx = new SimpleTx();
  // consome bloco #0, transação 2, índice 0
  // tx: f0a839aada49dd48e3f66c5da606ac3df7e9f8b53bd238bbb4a4b76708c935cd
  // index: 0
  // value: 30
  secondTx.addInput('f0a839aada49dd48e3f66c5da606ac3df7e9f8b53bd238bbb4a4b76708c935cd', 0);
  secondTx.addOutput('19QRZDGDt6hXUYTULmse4CusWZCBvVg37R', 25);
  secondTx.addOutput('13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP', 5);
  secondTx.hash();

  var tree = new SimpleMerkleTree();
  tree.add(coinbase);
  tree.add(secondTx);

  return new SimpleBlock(1, '2017-04-10 21:40', previous, tree);
}

blockchain = new SimpleBlockchain();
block0 = block0();
blockchain.add(block0);
blockchain.add(block1(block0.hash));
console.log('Blockchain');
print(blockchain);

//
// hashing: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa 50
// hashing: 091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b 0 13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP 30 1GVW6vDdwdfqoswio1VQ8HaCRFQN3U9hqz 20
// hashing: 091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b
// hashing: 091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b f0a839aada49dd48e3f66c5da606ac3df7e9f8b53bd238bbb4a4b76708c935cd
// hashing: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa 50
// hashing: f0a839aada49dd48e3f66c5da606ac3df7e9f8b53bd238bbb4a4b76708c935cd 0 19QRZDGDt6hXUYTULmse4CusWZCBvVg37R 25 13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP 5
// hashing: 091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b
// hashing: 091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b c8813d063005e41b4ce8f7525ed74f2e2c584f5ad704b9b8687aa6d053cf3bb6
// Blockchain
// {
//   chain: [    {
//       height: 0,
//       timestamp: "2017-04-10 21:30",
//       hash: undefined,
//       previousBlock: "0000000000000000000000000000000000000000000000000000000000000000",
//       merkleRoot: "720819ec00b5f2cd7526a3e1eae02b35de9744b521107d131b623216bf4cd707",
//       nonce: undefined,
//       txsTree: {
//         merkleRoot: "720819ec00b5f2cd7526a3e1eae02b35de9744b521107d131b623216bf4cd707",
//         txs: [          {
//             txHash: "091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b",
//             inputs: [],
//             outputs: [              {
//                 recipient: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
//                 value: 50
//               }            ]
//           },
//           {
//             txHash: "f0a839aada49dd48e3f66c5da606ac3df7e9f8b53bd238bbb4a4b76708c935cd",
//             inputs: [              {
//                 txHash: "091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b",
//                 index: 0
//               }            ],
//             outputs: [              {
//                 recipient: "13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP",
//                 value: 30
//               },
//               {
//                 recipient: "1GVW6vDdwdfqoswio1VQ8HaCRFQN3U9hqz",
//                 value: 20
//               }            ]
//           }        ]
//       }
//     },
//     {
//       height: 1,
//       timestamp: "2017-04-10 21:40",
//       hash: undefined,
//       previousBlock: undefined,
//       merkleRoot: "2c5d49423504ac5c0ea0b334db1ab0e2b9e00aa881934c9b10b6a58b9187595e",
//       nonce: undefined,
//       txsTree: {
//         merkleRoot: "2c5d49423504ac5c0ea0b334db1ab0e2b9e00aa881934c9b10b6a58b9187595e",
//         txs: [          {
//             txHash: "091c361ea54bb1c52b1bdb8a8b451c9c33f9158f266787e2674712b72297515b",
//             inputs: [],
//             outputs: [              {
//                 recipient: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
//                 value: 50
//               }            ]
//           },
//           {
//             txHash: "c8813d063005e41b4ce8f7525ed74f2e2c584f5ad704b9b8687aa6d053cf3bb6",
//             inputs: [              {
//                 txHash: "f0a839aada49dd48e3f66c5da606ac3df7e9f8b53bd238bbb4a4b76708c935cd",
//                 index: 0
//               }            ],
//             outputs: [              {
//                 recipient: "19QRZDGDt6hXUYTULmse4CusWZCBvVg37R",
//                 value: 25
//               },
//               {
//                 recipient: "13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP",
//                 value: 5
//               }            ]
//           }        ]
//       }
//     }  ]
// }
