const CryptoJS = require('crypto-js');
const difficulty = 3;

var validHashSubstring = () => {
  var str = '';
  for (var i = 0; i < difficulty; i++) {
    str += '0';
  }
  return str;
}

var blockHash = () => {
  var nonce = 0;
  var hash = '';
  const zeroes = validHashSubstring();
  while (hash.substring(0,difficulty) != zeroes) {
    hash = CryptoJS.SHA256('blockchain' + nonce).toString();
    nonce++;
  }
  console.log('valid hash found! ' + hash);
  console.log('nonce: ' + nonce);
}

var blockHash = (previous, timestamp, merkleRoot) => {
  var nonce = 0;
  var hash = '';
  const zeroes = validHashSubstring();
  while (hash.substring(0, difficulty) != zeroes) {
    hash = CryptoJS.SHA256(previous + timestamp + merkleRoot + nonce).toString();
    nonce++;
  }
  console.log('valid hash found! ' + hash);
  console.log('nonce: ' + nonce);
}
 

var previous = 'e00ee9276b2fb4ab8194429089d40f0857a16234073c672c04f9b8b49825e2b3';
var timestamp = new Date().toString();
var merkleRoot = 'eb61c3724d6da33605084d2d232bba0563cb82f4ad82c101b42f23c2e86277ef';

blockHash(previous, timestamp, merkleRoot);
