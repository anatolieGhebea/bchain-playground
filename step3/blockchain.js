const sha256 = require('sha256'); // if not yet installed, run ( npm install sha256 ) in the project folder

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
    const newBlock = {
        index: this.chain.length+1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash
    }
    // clear transactions
    this.pendingTransactions = [];
    // add the newBlock to the chain
    this.chain.push(newBlock);
    return newBlock;
}

// get last block, necessary to get previousBlockHash
Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length - 1];
}

// hash block
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
    // sha256 expects a string ad input, so we have to convert our data 
    // into a string 
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);

    return hash;

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