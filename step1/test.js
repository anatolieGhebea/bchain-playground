
// test create new block method

const Blockchain = require('./blockchain');

const tCoin = new Blockchain();

console.log(tCoin);
console.log("========================");


var block = tCoin.createNewBlock(120, 'randomString', 'someOtherRandomString');

console.log(block);
console.log(" ========================");
console.log(tCoin);
console.log(" ========================");