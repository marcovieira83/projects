// const print = require('json-colorz');
//
// class MyClass {
//   constructor(_friend) {
//     this.name = 'block';
//     this.lastName = 'chain';
//     this.phones = ['phone1', 'phone2', 'phone3'];
//     this.bestFriend = _friend;
//   }
// }
//
// print(new MyClass({'name' : 'bitcoin', 'nickName' : 'BTC'}));

const print = require('json-colorz');

class MyClass {
  constructor(_friend) {
    this.name = 'block';
    this.lastName = 'chain';
    this.phones = ['phone1', 'phone2', 'phone3'];
    this.bestFriend = _friend;
  }
}

var x = new MyClass({ 'name' : 'bitcoin', 'nickName' : 'BTC'});
print(x);
