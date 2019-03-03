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
 * Computes object's sha256 hash.
 * 
 * @param obj Object to hash.
 * @return Object's sha256 hash. 
 */
const objectHash = (obj) => {
  return objectHashRec(obj, crypto.createHash('sha256')).digest('hex');
};

/**
 * Recursively traverse given object and updates given hash.
 * 
 * @param obj Object to hash.
 * @param hash Hash to update. 
 */
const objectHashRec = (obj, hash) => {  
  if (obj === null) {
    hash.update("null");
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      objectHashRec(obj[i], hash);
    }
  } else if (typeof obj === 'object') {
    objectHashRec(Object.entries(obj).sort((a, b) => a[0] - b[0]), hash);
  } else {
    hash.update(obj.toString());
  }
  hash.update(".");  
  return hash;
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

/**
 * Checks whether given chain is valid.
 * 
 * @param chain Chain to check. 
 * @returns Whether chain is valid.
 */
const isValid = (chain) => {
  let valid = true;
  let i = 1;
  for (i = 1; valid && i < chain.length; i++) {
    let block1 = chain[i -1];
    let block2 = chain[i];
    let previousHashValid = objectHash(block1) == block2.previousHash;
    let proofValid = proofHash(block1.proof, block2.proof).startsWith('0000');
    valid = previousHashValid && proofValid;  
  }
  return valid;
}

/**
 * Mines a new block for the given chain.
 * 
 * @param chain Chain.
 * @return New chain with additional block. 
 */
const mine = (chain) => {
  const previousBlock = lastBlock(chain);
  const proof = proofOfWork(previousBlock.proof);
  const previousHash = objectHash(previousBlock);
  return addBlock(chain, proof, previousHash);
}

module.exports = {
  init,
  addBlock,
  lastBlock,
  objectHash: objectHash,
  proofOfWork,
  isValid,
  mine
};