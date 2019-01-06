
// test create new block method

const Blockchain = require('./blockchain');

const tCoin = new Blockchain();

console.log(tCoin);
console.log("========================");


var block = tCoin.createNewBlock(120, 'replaceWithHashPrevBlock', 'replaceWithBlockHash');

var block1 = tCoin.createNewBlock(122, 'replaceWithHashPrevBlock', 'replaceWithBlockHash');

console.log(" \t\t **** Blockchain **** ");
console.log(tCoin);

console.log(" \t\t ** Last block ** ");
console.log(tCoin.getLastBlock());

console.log(" \t\t ** add some transactions **");
tCoin.createNewTransaction(12, 'Mario_Addr', 'Paolo_Addr');
tCoin.createNewTransaction(25, 'Vanessa_Addr', 'Pippo_Addr');

//add some more blocks
console.log(" \t\t ** add new block **");
var block2 = tCoin.createNewBlock(121, 'replaceWithHashPrevBlock', 'replaceWithBlockHash');

console.log(" \t\t ** add some transactions **");
tCoin.createNewTransaction(120, 'Aldo_Addr', 'Pluto_Addr');
tCoin.createNewTransaction(255, 'Aria_Addr', 'Mario_Addr');

console.log(" \n \t\t ***  Stato Blockchain *** \n ");
console.log(tCoin);