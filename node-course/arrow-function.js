var square = (x) => {
  var result = x*x;
  return result;
};

var square2 = (x) => x * x;

var square3 = x => x * x;

console.log(square(5));
console.log(square2(6));
console.log(square3(7));

var user = {
  name: 'Marco',
  sayHi: () => {
    console.log('Hi');
  }
};

user.sayHi();
