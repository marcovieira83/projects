// const print = require('json-colorz');
// class MyClass {
//   constructor() {
//     this.name = 'block';
//     this.surname = 'chain';
//     this.phones = ['(11)3133-2333', '(11)2782-8282']
//   }
// }
// console.log(x)
//
// var x = new MyClass();

const print = require('json-colorz');

class MyClass {
  constructor() {
    this.name = 'block'
    this.surname = 'c'
    this.phones = ['(11)3133-2333', '(11)2782-8282']
  }
}

var x = new MyClass();
print(x);
var y = new MyClass();
print(y);
print([x, y]);
