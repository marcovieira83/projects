const CryptoJS = require('crypto-js');

var hash = (value) => {
  return CryptoJS.SHA256(value).toString();
}

var Block = class {
  constructor(height, timestamp, previousBlock, merkleRoot) {
    this.hash = hash(height + timestamp, previousBlock, merkleRoot);
  }
}

var height = 0;
var timestamp = '2017-04-10 21:30';
var previous = '0000000000000000000000000000000000000000000000000000000000000000';
var merkleRoot = 'eb61c3724d6da33605084d2d232bba0563cb82f4ad82c101b42f23c2e86277ef';

block = new Block(height, timestamp, previous, merkleRoot);
console.log(block);
