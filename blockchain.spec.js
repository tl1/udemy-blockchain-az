const blockchain = require('./blockchain');

expect.extend({
    toBeWithinMillisBefore(received, time, millis) {
        const matches = 
            received.getTime() <= time.getTime() && 
            received.getTime() > time.getTime() - millis;
        if (matches) {
            return {
                message: () => 'expected ${received} not to be within ${millis} before ${time}',
                pass: true
            };
        } else {
            return {
                message: () => 'expected ${received} to be within ${millis} before ${time}',
                pass: false
            }
        }
    }
});

test('adds a block to an empty chain', () => {
    const chain = blockchain.addBlock([], 1, '0');
    expect(chain).toHaveLength(1);
    expect(chain[0].index).toBe(1);
    expect(chain[0].timestamp).toBeWithinMillisBefore(new Date(), 10);
    expect(chain[0].proof).toBe(1);
    expect(chain[0].previousHash).toBe('0');    
});

test('inits chain with genesis block', () => {
    const chain = blockchain.init();
    expect(chain).toHaveLength(1);
});

test('gets the last block from a chain', () => {
    const chain = blockchain.init();
    expect(blockchain.getLastBlock(chain).index).toBe(1);
});

