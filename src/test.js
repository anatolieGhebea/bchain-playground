const Blockchain = require('./blockchain');

const bcoin = new Blockchain();

console.log(bcoin);

// create(mine) block
bcoin.createNewBlock(2341, 'ade3r34w4ff4w4fw32rwd332r424w','d323dan74hwfhb9dn93');

// add some transactions
bcoin.createNewTransaction(50,'sdaasasdasd','ewtwvvw34242wq');
bcoin.createNewTransaction(10,'sd423aasasdasd','ewtwvvw34242wq');
bcoin.createNewTransaction(500,'sdaasasda542dasd','ewer2224twvvw34242wq');

// to add those transaction to the blockchain, a newBlock is required 
// (create) mine new block
bcoin.createNewBlock(2342, 'd323dan74hwfhb9dn93','d323dan74hwsdqefwfwefhb9dn93');

console.log(bcoin);
console.log("\n");

console.log(bcoin.chain[1]);

// get the PoW
console.log(bcoin.proofOfWork(bcoin.chain[0].hash,bcoin.chain[1].transactions ));



