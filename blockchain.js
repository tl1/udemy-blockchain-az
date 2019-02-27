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
const lastBlock = (chain) => {
  return chain[chain.length - 1];
}

/**
 * Computes block's sha256 hash.
 * 
 * @param block Block to hash.
 * @return Block's sha256 hash. 
 */
const blockHash = (block) => {
  const blockData = Object.entries(block).sort((a, b) => a[0] - b[0]);
  const hash = blockData.reduce((acc, value) => {
    acc.update(value[0].toString());
    acc.update(value[1].toString());
    return acc;
  }, crypto.createHash('sha256'));
  return hash.digest('hex');
};

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
    hash = proofHash(previousProof, proof);
  } while (!hash.startsWith('0000'));
  return proof;
}

/**
 * Proof-of-work hash function.
 * 
 * @param previousProof Proof of previous block.
 * @param proof Proof of current block.
 * @returns Hash value for proof-of-work. 
 */
const proofHash = (previousProof, proof) => {
  return crypto
    .createHash('sha256')
    .update((proof * proof - previousProof * previousProof).toString())
    .digest('hex');
}

module.exports = {
  init,
  addBlock,
  lastBlock,
  blockHash,
  proofOfWork
};