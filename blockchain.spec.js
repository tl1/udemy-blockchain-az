const blockchain = require('./blockchain');

expect.extend({
    toBeWithinMillisBefore(received, time, millis) {
        const matches = 
            received.getTime() <= time.getTime() && 
            received.getTime() > time.getTime() - millis;
        if (matches) {
            return {
                message: () => `expected ${received} not to be within ${millis} ms before ${time}`,
                pass: true
            };
        } else {
            return {
                message: () => `expected ${received} to be within ${millis} ms before ${time}`,
                pass: false
            }
        }
    }
});

test('adds a block to an empty chain', () => {
    const chain = blockchain.addBlock([], 1, '0');
    expect(chain).toHaveLength(1);
    expect(chain[0].index).toBe(1);
    expect(chain[0].timestamp).toBeWithinMillisBefore(new Date(), 500);
    expect(chain[0].proof).toBe(1);
    expect(chain[0].previousHash).toBe('0');    
});

test('inits chain with genesis block', () => {
    const chain = blockchain.init();
    expect(chain).toHaveLength(1);
});

test('gets the last block from a chain', () => {
    const chain = blockchain.init();
    expect(blockchain.lastBlock(chain).index).toBe(1);
});

test('computes deterministic block hash', () => {
    const block = {
        index: 10,
        timestamp: new Date(),
        proof: 10293,
        previousHash: "12345"
    };
    const hash = blockchain.blockHash(block);
    expect(hash).toMatch(/^[0-9a-z]{64}$/i);
    for (i = 0; i < 32; i++) {
        expect(blockchain.blockHash(block)).toEqual(hash);
    }
    const block2 = {
        index: 11,
        timestamp: new Date(),
        proof: 10293,
        previousHash: "12345"
    };
    expect(blockchain.blockHash(block2)).not.toEqual(hash); 
});

test('finds a proof of work', () => {
    const proof = blockchain.proofOfWork(1);
    expect(proof).toBeNumber();
});

test('recognizes a valid chain', () => {
    const chain = blockchain.init();
    expect(blockchain.isValid(chain)).toBe(true);
});

test('recognizes a long valid chain', () => {
    const chain = [...Array(10).keys()].reduce((chain, value) => {
        const lastBlock = blockchain.lastBlock(chain);
        const proof = blockchain.proofOfWork(lastBlock.proof);
        const previousHash = blockchain.blockHash(lastBlock);
        return blockchain.addBlock(chain, proof, previousHash);
    }, blockchain.init());
    expect(blockchain.isValid(chain)).toBe(true);
});

test('recognizes an invalid chain due to wrong previous hash', () => {
    let chain = blockchain.init();
    const previousBlock = blockchain.lastBlock(chain);
    const proof = blockchain.proofOfWork(previousBlock.proof);
    const previousHash = "INVALID";
    chain = blockchain.addBlock(chain, proof, previousHash);
    expect(blockchain.isValid(chain)).toBe(false);
});

test('recognizes an invalid chain due to wrong proof', () => {
    let chain = blockchain.init();
    const previousBlock = blockchain.lastBlock(chain);
    const proof = 91823847;
    const previousHash = blockchain.blockHash(previousBlock);
    chain = blockchain.addBlock(chain, proof, previousHash);
    expect(blockchain.isValid(chain)).toBe(false);
});