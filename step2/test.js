
// test create new block method

const Blockchain = require('./blockchain');

const tCoin = new Blockchain();

console.log(tCoin);
console.log("========================");


var block = tCoin.createNewBlock(120, 'replaceWithHashPrevBlock', 'replaceWithBlockHash');

//add some more blocks
var block1 = tCoin.createNewBlock(121, 'replaceWithHashPrevBlock', 'replaceWithBlockHash');
var block2 = tCoin.createNewBlock(122, 'replaceWithHashPrevBlock', 'replaceWithBlockHash');

console.log(" \t\t **** Blockchain **** ");
console.log(tCoin);

console.log(" \t\t ** Last block ** ");
console.log(tCoin.getLastBlock());

console.log(" \n \t\t *** \n ");
