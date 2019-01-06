
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

// get last block, necessary to get previousBlockHash
Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length - 1];
}


// create new Transaction
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient){
    const newTransaction  = {
        amount: amount,
        sender: sender,
        recipient: recipient,
    }

    this.pendingTransactions.push(newTransaction);

    // the transaction will be registered in the next block that will be mined
    return this.getLastBlock()['index']+1;
}


module.exports = Blockchain;