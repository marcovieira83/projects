const CryptoJS = require('crypto-js');

var nonce = 290000000;
var start = '0000000';
var hash = '';

// enquanto o hash não começa com 0's suficientes
while (hash.substring(0, start.length) != start) {
  // incrementa nonce
  nonce++;
  // calcula hash
  hash = CryptoJS.SHA256('blockchain' + nonce).toString();
  // imprime nonce apenas para verificar que está rodando
  if (nonce % 10000 == 0) console.log('nonce at: ' + nonce);
}

console.log('nonce: ' + nonce);
console.log('hash: ' + hash);
