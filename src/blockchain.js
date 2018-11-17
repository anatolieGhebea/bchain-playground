const sha256 = require('sha256');

function Blockchain(){
    this.chain = [];
    this.pendingTransactions = []; 

    //create a Genesis block (first element of blockchain)
    this.createNewBlock(100, '0', '0');

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
// get the last block in the chain
Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length - 1];
}

// create hash
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
    const dataAsAstring = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsAstring);

    return hash;
}

// proof of work (PoF)
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while(hash.substring(0, 4) != '0000'){
        nonce++;
        hash = this.hashBlock(previousBlockHash,currentBlockData, nonce);
    }

    return nonce;
}
 
// create new Transaction
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient){
    const newTransaction  = {
        amount: amount,
        sender: sender,
        recipient: recipient
    }

    this.pendingTransactions.push(newTransaction);

    return this.getLastBlock()['index']+1;
}

module.exports = Blockchain;