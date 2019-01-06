
// test create new block method

const Blockchain = require('./blockchain');

const tCoin = new Blockchain();

console.log(tCoin);
console.log("========================");

// just a random string for the moment
const previousBlockHash = 'AJDMOF543DF1S33FE1EADA1F3AF1EF13E';

// simulate a transaction list
const currentBlockData = [
    {
        amount: 12,
        sender: 'SA1D2A45DWAD',
        recipient: 'SA1D2A45WR4D'
    },
    {
        amount: 256,
        sender: 'SA1D2A5145DWAD',
        recipient: 'SAA1D12A45WR4D'
    },
    {
        amount: 98,
        sender: 'SSDA1D2A45DWAD',
        recipient: 'DASA1D2A45WR4D'
    }
];
const currentBlockData2 = [
    {
        amount: 12,
        sender: 'S1D2A45DWAD',
        recipient: 'SA1D2A45WR4D'
    },
    {
        amount: 256,
        sender: 'SA1D2A5145DWAD',
        recipient: 'SAA1D12A45WR4D'
    },
    {
        amount: 98,
        sender: 'SSDA1D2A45DWAD',
        recipient: 'DASA1D2A45WR4D'
    }
];

console.log(tCoin.proofOfWork(previousBlockHash, currentBlockData));
console.log(tCoin.proofOfWork(previousBlockHash, currentBlockData2));
