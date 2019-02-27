const express = require('express');
const blockchain = require('./blockchain');
const app = express();
const port = 3000;

var chain = blockchain.init();

app.post('/mine', (req, res) => {
    chain = blockchain.mine(chain);
    const block = blockchain.lastBlock(chain);
    console.log(JSON.stringify(block, null, 2));
    res.status(201).json(block);
});

app.listen(port, () => {
    console.log(`Application started on port ${port}`);
});