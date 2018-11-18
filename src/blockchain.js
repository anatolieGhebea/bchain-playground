const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function Blockchain(){
    this.chain = [];
    this.pendingTransactions = []; 

    this.currentNodeUrl = currentNodeUrl;

    console.log(this.currentNodeUrl);
    
    if(typeof(this.currentNodeUrl) === 'undefined')
        console.log('currentNodeUrl not defined, check parameters.....');
        

    this.networkNodes = [];

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
        recipient: recipient,
        transactionId: uuid().split("-").join('')
    }

    return newTransaction;
}
// push transaction to pending transaction
Blockchain.prototype.addTransactionToPendingTransaction = function(transactionObj){
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index']+1;
}

Blockchain.prototype.chainIsValid = function(blockchain){
    var validChain = true;
    var ra = 0;
    for(var i = 1; i < blockchain.length; i++){
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i-1];
        const blockHash = this.hashBlock(
                prevBlock['hash'],
                { transactions: currentBlock['transactions'], index: currentBlock['index'] },
                currentBlock['nonce']
            );

        if(blockHash.substring(0, 4) !== '0000')
            validChain = false;

        if(currentBlock['previousBlockHash'] !== prevBlock['hash'] )
            validChain = false;
        
        // if a block is not valid the chain is not valid, no point to check
        // the other blocks, stop iteration and return false
        if(!validChain)
            return validChain;
        
        //console.log('iter ' + ra++);
    }

    const genesisBlock = blockchain[0];
    
    if( (genesisBlock['nonce'] !== 100) || 
        (genesisBlock['previousBlockHash'] !== '0') ||
        (genesisBlock['hash'] !== '0' ) ||
        (genesisBlock['transactions'].length !== 0 )){

            validChain = false;
        }

    ra++;
    
    return validChain;

}


Blockchain.prototype.getBlock = function(blockHash){
    let correctBlock = null;

    this.chain.forEach(block => {
        
        if(block.hash === blockHash)
            correctBlock = block;
    });

    return correctBlock;
}

Blockchain.prototype.getTransaction = function(transactionId){
    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach(block => {
        
        block.transactions.forEach(transaction => {

            if(transaction.transactionId === transactionId){
                correctTransaction = transaction;
                correctBlock = block;
            }

        });
    });

    return {
        transaction: correctTransaction,
        block: correctBlock
    };
}


Blockchain.prototype.getAddressData = function(address){
    let addressTransactions = [];
    let balance = 0;

    this.chain.forEach(block => {
        
        block.transactions.forEach(transaction => {

            if(transaction.sender === address ){
                addressTransactions.push(transaction);
                balance = balance - transaction.amount;
            }else if(transaction.recipient === address){
                addressTransactions.push(transaction);
                balance = balance + transaction.amount;
            }

        });
    });

    return {
        allTransactions: addressTransactions,
        addressBalance: balance
    }


}

module.exports = Blockchain;