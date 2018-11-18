// server 
const express = require('express');
const app = express();
var port = process.argv[2];
const req_promise = require('request-promise');

// parsing module
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use( bodyParser.urlencoded( { extended:false }) );

// istance id
const uuid = require('uuid/v1');
const nodeAddress = uuid().split("-").join('');

// blockchain
const Blockchain = require('./blockchain');
const bcoin = new Blockchain();

app.get ('/blockchain', function(req, res){
    res.send(bcoin);
    
});

// add transaction to pending transaction
app.post('/transaction', function(req, res){
    const newTransaction = req.body;
    const blockIndex = bcoin.addTransactionToPendingTransaction(newTransaction);

    console.log("Transaction will be added in block " + blockIndex);
    
    res.json({
        note: "Transaction will be added in block " + blockIndex
    });
});

// broadcast transaction
app.post('/transaction/broadcast', function(req, res){
    const newTransaction = bcoin.createNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient    
    );

    bcoin.addTransactionToPendingTransaction(newTransaction);

    const requestPromises = [];
    bcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };

        requestPromises.push(req_promise(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: "Transaction created and broadcast" });
    });


});

app.get('/mine', function(req, res){
    const lastBlock = bcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentData = {
        transactions: bcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }

    const nonce = bcoin.proofOfWork(previousBlockHash, currentData);
    const bHash = bcoin.hashBlock(previousBlockHash, currentData, nonce);

    const newBlock = bcoin.createNewBlock(nonce, previousBlockHash, bHash);

    const requestPromises = [];
    bcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/recieve-new-block',
            method: 'POST',
            body: newBlock,
            json: true
        };

        requestPromises.push(req_promise(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        const requestOptions = {
            uri: bcoin.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 12.5 ,
                sender: "00",
                reciever: nodeAddress
            },
            json: true
        }
        
        return req_promise(requestOptions);
        
    })
    .then(data => {
        res.json({
            note: "New block mined and broadcast successfully",
            block: newBlock
        });
    });



});

app.post('/recieve-new-block', function(req, res){
    const newBlock = req.body;

    const lastBlock = bcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = (lastBlock['index']+1) === newBlock['index'];

    if(correctHash && correctIndex){
        bcoin.chain.push(newBlock);
        bcoin.pendingTransactions = [];
        res.json({
            note: "NewBlcok recieved and accepted",
            newBlock: newBlock
        });
    }else{
        res.json({
            note: "NewBlcok rejected",
            newBlock: newBlock
        });
    }

});

//
app.post('/register-and-broadcast-node', function(req, res){
    const newNodeUrl = req.body.newNodeUrl;

    if(bcoin.networkNodes.indexOf(newNodeUrl) == -1)
        bcoin.networkNodes.push(newNodeUrl);


    const regNodesPromises = [];

    bcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: {
                newNodeUrl: newNodeUrl
                },
            json: true
        }

        regNodesPromises.push(req_promise(requestOptions));
    });

    Promise.all(regNodesPromises)
    .then(data => {
        //use data
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {
                allNetworkNodes: [ ...bcoin.networkNodes, bcoin.currentNodeUrl ]
                },
            json: true
        }

        return req_promise(bulkRegisterOptions);
    })
    .then(data => {
        res.json({
            note: 'New node registered with network successfully.'
        });
    });
    

});

//
app.post('/register-node', function(req, res){
    const newNodeUrl = req.body.newNodeUrl;
    let msg;

    if(bcoin.networkNodes.indexOf(newNodeUrl) == -1 && bcoin.currentNodeUrl !== newNodeUrl ){
        bcoin.networkNodes.push(newNodeUrl);
        msg = 'New node regidtered successfully.';
    }else{
        msg = 'Node present';
    }

    res.json({ 
        note: msg
    });

});

//
app.post('/register-nodes-bulk', function(req, res){
    const allNetworkNodes = req.body.allNetworkNodes;

    allNetworkNodes.forEach(networkNodeUrl => {
        if(bcoin.networkNodes.indexOf(networkNodeUrl) == -1 && bcoin.currentNodeUrl !== networkNodeUrl )
            bcoin.networkNodes.push(networkNodeUrl);
    })

    res.json({
        note: 'All nodes registered'
    });

});

app.get('/consensus', function(req, res){
    const requestPromises = [];
    bcoin.networkNodes.forEach(networkNodeUrl =>{
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        }

        requestPromises.push(req_promise(requestOptions));
    });

    Promise.all(requestPromises)
    .then(blockchains => {
        const currentChainLength = bcoin.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;

        blockchains.forEach(blockchain => {
            if(blockchain.chain.length > maxChainLength){
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newPendingTransactions = blockchain.pendingTransactions;
            }

        });

        /*
        if(!newLongestChain || (newLongestChain && !bcoin.chainIsValid(newLongestChain) )){
            res.json({
                note: "Curent chain has not been replaced",
                chain: bcoin.chain
            });
        } 
        */
        if(newLongestChain && bcoin.chainIsValid(newLongestChain) ){
            bcoin.chain = newLongestChain;
            bcoin.pendingTransactions = newPendingTransactions;
            
            res.json({
                note: "Curent chain has been replaced",
                chain: bcoin.chain
            });
        }else{
            res.json({
                note: "Curent chain has not been replaced",
                chain: bcoin.chain
            });
        }


    });


});


//============ Blockchian explorer
app.get('/block/:blockHash', function(req, res){
    const blockHash = req.params.blockHash;
    const block = bcoin.getBlock(blockHash);

    res.json({
        block: block
    });
});

app.get('/transaction/:transactionId', function(req, res){
    const transactionId = req.params.transactionId;
    const transactionData = bcoin.getTransaction(transactionId);
    
    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    })

});

app.get('/address/:address', function(req, res){
    const address = req.params.address;
    const addressData = bcoin.getAddressData(address);

    res.json({
        addressData: addressData
    });
});



//============

app.get('/', function(req, res){
    //res.send('server works');
    res.sendFile('index.html', { root: __dirname });
});
app.get('/index.html', function(req, res){
    //res.send('server works');
    res.sendFile('index.html', { root: __dirname });
});


app.listen(port, function(){
    console.log('listening at port ' + port + '....');
    
});