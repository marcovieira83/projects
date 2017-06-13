const CryptoJS = require('crypto-js');

var nonce = 0;
var start = '0' ;
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

console.log('=========================');
console.log('found hash: ' + hash);
console.log('nonce: ' + nonce);
