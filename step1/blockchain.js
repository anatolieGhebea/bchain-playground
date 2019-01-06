
function Blockchain(){
    // holds all mined blocks
    this.chain = [];
    // holds the transactions until they are not
    // confirmed in a mined block
    this.pendingTransactions = []; 

}

// create newBlock
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
    // create block object
    console.log("\n Creating new block....");
    
    const newBlock = {
        index: this.chain.length+1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash
    }

    console.log("\n Clearing pendingTransactions.....");
    // clear transactions
    this.pendingTransactions = [];

    console.log("\n Pushing new block to the chain.... \n");
    // add the newBlock to the chain
    this.chain.push(newBlock);

    return newBlock;
}

module.exports = Blockchain;


// equivalent definition
// class Blockchain {
//     constructor(){
//         this.chain = [];
//         this.pendingTransactions = [];
//     }

//     createNewBlock(nonce, previousBlockHash, hash) {
//         //.....
//     };
// }
