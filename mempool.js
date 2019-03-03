const uuid = require('uuid/v1');

/**
 * Adds a transacation to given pool.
 * 
 * @param pool Mempool.
 * @param sender Tx sender.
 * @param receiver Tx receiver.
 * @param amount Tx amount.
 * @return Pool with additional transaction.
 */
const addTx = (pool, sender, receiver, amount) => {
    let tx = {
        id: uuid(),
        sender,
        receiver,
        amount
    };
    return [...pool, tx];
};

/**
 * Merges two pools.
 * 
 * @param pool1 Pool 1.
 * @param pool2 Pool 2.
 * @return Merged pool.
 */
const merge = (pool1, pool2) => {
    const byTxId = (tx1, tx2) => { return tx1.id - tx2.id };
    pool1.sort(byTxId);
    pool2.sort(byTxId);
    const merged = [];
    let i1 = 0, i2 = 0;
    while (i1 < pool1.length || i2 < pool2.length) {
        if (i1 === pool1.length) {
            merged.push(pool2[i2++]);
        } else if (i2 === pool2.length) {
            merged.push(pool1[i1++]);
        } else if (pool1[i1].id < pool2[i2].id) {
            merged.push(pool1[i1++]);
        } else if (pool1[i1].id == pool2[i2].id) {
            merged.push(pool1[i1++]);
            i2++;
        } else {
            merged.push(pool2[i2++]);
        }
    }
    return merged;
}

module.exports = {
    addTx,
    merge
};