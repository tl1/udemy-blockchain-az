const mempool = require('./mempool');


expect.extend({
    toContainObject(received, argument) {  
        const pass = this.equals(received, 
          expect.arrayContaining([
              expect.objectContaining(argument)
          ])
        )
  
        if (pass) {
            return {
                message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
                pass: true
            }
        } else {
            return {
                message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
                pass: false
            }
        }
    }
});

test('adds a transaction', () => {
    const pool = mempool.addTx([], 'sender', 'receiver', 10);
    expect(pool).toHaveLength(1);
    expect(pool[0]).toMatchObject({
        sender: 'sender',
        receiver: 'receiver',
        amount: 10
    });
    expect(pool[0].id).toBeDefined();
});

test('merges 2 pools', () => {
    const pool1 = mempool.addTx([], 'paul', 'hannah', 102);
    const pool2 = mempool.addTx(pool1, 'alice', 'bob', 20);
    const merged = mempool.merge(pool1, pool2);
    expect(merged).toHaveLength(2);
    expect(merged).toContainObject({
        sender: 'paul',
        receiver: 'hannah',
        amount: 102
    });
    expect(merged).toContainObject({
        sender: 'alice',
        receiver: 'bob',
        amount: 20
    });
});

