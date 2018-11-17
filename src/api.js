// server 
const express = require('express');
const app = express();
var port = 3000;

// parsing module
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use( bodyParser.urlencoded( { extended:false }) );

// istance id
const uuid = require('uuid');
const nodeAddress = uuid().split("-").join('');

// blockchain
const Blockchain = require('./blockchain');
const bcoin = new Blockchain();

app.get ('/blockchain', function(req, res){
    res.send(bcoin);
    
});

app.post('/transaction', function(req, res){
    //console.log(req.body);
    //res.send('The amount is ' + req.body.amount + ' coins'); 

    const blockIndex = bcoin.createNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient    
    );

    res.json({
        note: "Transaction will be added in block " + blockIndex
    });
});

app.get('/mine', function(req, res){
    const lastBlock = bcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentData = {
        transaction: bcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }

    const nonce = bcoin.proofOfWork(previousBlockHash, currentData);
    const bHash = bcoin.hashBlock(nonce, previousBlockHash, currentData);

    bcoin.createNewTransaction(12.5 ,"00",nodeAddress);
    
    const newBlock = bcoin.createNewBlock(nonce, previousBlockHash, bHash);

    res.json({
        note: "New block mined successfully",
        block: newBlock
    });
});

app.get('/', function(req, res){
    res.send('server works');
});


app.listen(port, function(){
    console.log('listening at port ' + port + '....');
    
});