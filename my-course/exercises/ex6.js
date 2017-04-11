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
    this.chain.push(block);
  }
}

class Miner {
  constructor() {
    this.txsTree = new SimpleMerkleTree();
  }
  receiveTxsToBeMined(tx) {
    this.txsTree.add(tx);
  }
  mine(height, timestamp, previousBlock) {
    // TODO
    // Vc deve calcular o hash do bloco até que ele inicie com a quantidade de
    // 0's desejada. Comece testando com apenas um 0, e depois aumente aos
    // poucos para ver como o tempo aumenta.
    //
    // sugestão:
    // 1. inicialize nonce, hash
    // 2. enquanto hash não é válido
    //   a. calcule hash passando [previousBlock, merkleRoot, nonce
    //   b. incremente nonce
    // 3. construa e retorne o bloco
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

  var miner = new Miner();
  miner.receiveTxsToBeMined(coinbase);
  miner.receiveTxsToBeMined(secondTx);

  return miner.mine(0, '2017-04-10 21:30', '0000000000000000000000000000000000000000000000000000000000000000');
}

function block1(previous) {
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

  var miner = new Miner();
  miner.receiveTxsToBeMined(coinbase);
  miner.receiveTxsToBeMined(secondTx);

  return miner.mine(1, '2017-04-10 21:40', previous);
}

blockchain = new SimpleBlockchain();
block0 = block0();
blockchain.add(block0);
blockchain.add(block1(block0.hash));
print(blockchain);

// considerando dificuldade '00'
// {
//   chain: [    {
//       height: 0,
//       timestamp: "2017-04-10 21:30",
//       hash: "00e0eea035cef2deee3bb3d6d1dcf6b354ae32ff82f0e5e52f1fc7470fc80131",
//       previousBlock: "0000000000000000000000000000000000000000000000000000000000000000",
//       merkleRoot: "720819ec00b5f2cd7526a3e1eae02b35de9744b521107d131b623216bf4cd707",
//       nonce: 48,
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
//       hash: "00f52faef52c8d8f3188d998a17c9fa7efab1b46155725cb76d6ed6bb0fdc680",
//       previousBlock: "00e0eea035cef2deee3bb3d6d1dcf6b354ae32ff82f0e5e52f1fc7470fc80131",
//       merkleRoot: "2c5d49423504ac5c0ea0b334db1ab0e2b9e00aa881934c9b10b6a58b9187595e",
//       nonce: 123,
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
