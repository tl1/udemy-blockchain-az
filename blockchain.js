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
 * @param chain Blockchain.
 * @param proof Proof for new block.
 * @param previousHash Hash of the previous block.
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
 * @param chain Blockchain.
 * @returns Last block of chain.
 */
const getLastBlock = (chain) => {
  return chain[chain.length - 1];
}

/**
 * Calculates proof of work.
 * 
 * @param previousProof The previous proof.
 * @returns Proof.
 */
const proofOfWork = (previousProof) => {
  let proof = 0;
  let hash;
  do {
    proof += 1;
    hash = crypto
      .createHash('sha256')
      .update((proof * proof - previousProof * previousProof).toString())
      .digest('hex');
  } while (!hash.startsWith('0000'));
  return proof;
}

module.exports = {
  init,
  addBlock,
  getLastBlock,
  proofOfWork
};