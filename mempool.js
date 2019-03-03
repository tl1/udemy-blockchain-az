/**
 * Adds a transacation to given pool.
 * 
 * @param pool Mempool.
 * @param sender Tx sender.
 * @param receiver Tx receiver.
 * @param amount Tx amount.
 */
const addTx = (pool, sender, receiver, amount) => {
    let tx = {
        sender,
        receiver,
        amount
    };
    return [...pool, tx];
};

module.exports = {
    addTx
};