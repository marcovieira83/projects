const CryptoJS = require('crypto-js');

var hash = (value) => {
  return CryptoJS.SHA256(value).toString();
}

var Block = class {
  constructor(height, timestamp, previousBlock, merkleRoot) {
    this.height = height;
    this.timestamp = timestamp;
    this.previous = previousBlock;
    this.merkleRoot = merkleRoot;
    this.nonce = 0;
    this.hash = '';
    this.mine();
  }

  mine() {
    var validStart = '00';
    var result = '';
    while (result.substring(0, validStart.length) != validStart) {
      result = hash(this.height + this.timestamp + this.previous + this.merkleRoot + this.nonce).toString();
      this.nonce++;
    }
    this.hash = result;
  }
}

var Blockchain = class {
  constructor() {
    this.chain = [];
  }

  addBlock(block) {
    this.chain.push(block);
  }
}

var block0 = () => {
  var height = 0;
  var timestamp = '2017-04-10 21:30';
  var previous = '0000000000000000000000000000000000000000000000000000000000000000';
  var merkleRoot = 'eb61c3724d6da33605084d2d232bba0563cb82f4ad82c101b42f23c2e86277ef';
  return new Block(height, timestamp, previous, merkleRoot);
}

var block1 = (previous) => {
    var height = 1;
    var timestamp = '2017-04-10 21:40';
    var merkleRoot = '68c8341feed4240c68e59ced396870cfe1cf8fea9f05b21356786912449fd54f';
    return new Block(height, timestamp, previous, merkleRoot);
}

block0 = block0();
block1 = block1(block0.hash);

blockchain = new Blockchain();
blockchain.addBlock(block0);
blockchain.addBlock(block1);

console.log(blockchain);
