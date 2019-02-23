const crypto = require('crypto');

/**
 * Initializes a chain incl. genesis block.
 * 
 * @returns Initialized blockchain.
 */
const init = () => {
  return addBlock([], 1, '0');
}

/**
 * Creates a new block and adds it to the given chain.
 * 
 * @returns New chain with new block added.
 */
const addBlock = (chain, proof, previousHash) => {
  let block = {
    index: chain.length + 1,
    timestamp: new Date(),
    proof,
    previousHash
  };
  return [...chain, block];
}

/**
 * Returns last block of the chain.
 * 
 * @returns Last block.
 */
const getLastBlock = (chain) => {
  return chain[chain.length - 1];
}

module.exports = {
  init,
  addBlock,
  getLastBlock
};