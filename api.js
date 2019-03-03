const express = require('express');
const bodyParser = require('body-parser');
const blockchain = require('./blockchain');
const mempool = require('./mempool');

const app = express();

var chain = blockchain.init([]);
var pool = [];

app.use('/tx', bodyParser.json());

app.post('/tx', (req, res) => {
    pool = mempool.addTx(pool, req.body.sender, req.body.receiver, req.body.amount);
    const tx = pool[pool.length - 1];
    console.log('Added transaction:\n' + JSON.stringify(tx, null, 2));
    res.status(201).json(tx);
});

app.post('/mine', (req, res) => {
    if (pool.length > 0) {
        chain = blockchain.mine(chain, pool);
        pool = [];
        const block = blockchain.lastBlock(chain);
        console.log('Mined block:\n' + JSON.stringify(block, null, 2));
        res.status(201).json(block);
    } else {
        console.log('Pool empty, not mining new block.');
        res.status(200).json({});
    }
});

app.get('/', (req, res) => {
    res.status(200).json(chain);
});

app.get('/status', (req, res) => {
    res.status(200).json({
        valid: blockchain.isValid(chain),
        length: chain.length,
        mempool: pool.length
    });
});

const port = process.env.API_PORT;

app.listen(port, () => {
    console.log(`Application started on port ${port}`);
});