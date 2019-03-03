const mempool = require('./mempool');

test('adds a transaction', () => {
    const pool = mempool.addTx([], 'sender', 'receiver', 10);
    expect(pool).toHaveLength(1);
    expect(pool[0]).toMatchObject({
        sender: 'sender',
        receiver: 'receiver',
        amount: 10
    });
    expect(pool[0].id).toBeDefined();
})