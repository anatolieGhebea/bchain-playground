const Blockchain = require('./blockchain');

const bcoin = new Blockchain();

const chain1 = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1542549264522,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1542549281922,
            "transactions": [
                {
                    "amount": 3,
                    "sender": "B123DWIB323",
                    "recipient": "Asdf5235223DWIB323",
                    "transactionId": "7aaa1430eb3911e8b2dbab9738e37d8e"
                },
                {
                    "amount": 334,
                    "sender": "B123DWIB323",
                    "recipient": "Asdf5235223DWIB323",
                    "transactionId": "7e096bd0eb3911e8b2dbab9738e37d8e"
                }
            ],
            "nonce": 4563,
            "hash": "0000af2fc32dd86784d44871aee2fafcd6d5e2f297f713435426e3baa8251362",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1542549292751,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "transactionId": "7f7d2010eb3911e8b2dbab9738e37d8e"
                },
                {
                    "amount": 34,
                    "sender": "B123DWIB323",
                    "recipient": "Asdf5235223DWIB323",
                    "transactionId": "82d48870eb3911e8b2dbab9738e37d8e"
                }
            ],
            "nonce": 35777,
            "hash": "0000df0dc5bdaa2d3e9e3f1d03c45e768cabbb3ce29019eeb11b9eb4a2bbf3b7",
            "previousBlockHash": "0000af2fc32dd86784d44871aee2fafcd6d5e2f297f713435426e3baa8251362"
        },
        {
            "index": 4,
            "timestamp": 1542549304572,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "transactionId": "85efab20eb3911e8b2dbab9738e37d8e"
                },
                {
                    "amount": 33424,
                    "sender": "B123DWIB323",
                    "recipient": "Asdf5235223DWIB323",
                    "transactionId": "8a4a0490eb3911e8b2dbab9738e37d8e"
                }
            ],
            "nonce": 15549,
            "hash": "00002ba4beaef9a5db4461b79067f21efa8f10ad62676ec6ac0acdb81bffaaaf",
            "previousBlockHash": "0000df0dc5bdaa2d3e9e3f1d03c45e768cabbb3ce29019eeb11b9eb4a2bbf3b7"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "00",
            "transactionId": "8cfb68f0eb3911e8b2dbab9738e37d8e"
        }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
}

console.log(bcoin.chainIsValid(chain1.chain));





