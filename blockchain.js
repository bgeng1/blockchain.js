import { createHash } from "node:crypto";

const hash = (message) => createHash("sha256").update(message).digest("hex");

class Block {
  constructor(timestamp = "", data = []) {
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.getHash();
    this.parentHash = "";
    this.nonce = 0;
  }

  getHash() {
    return hash(
      this.parentHash + this.timestamp + JSON.stringify(this.data) + this.nonce,
    );
  }

  mine(difficulty) {
    while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
      this.nonce++;
      this.hash = this.getHash();
    }
  }

  addTransaction() {}
}

class Blockchain {
  constructor() {
    this.lastBlock;
    this.blocks = {};
    this.difficulty = 4;
    this.genesisId = "0";

    this.start();
  }

  addBlockToMap(block) {
    const hash = block.hash;
    if (!hash) {
      this.blocks[this.genesisId] = block;
    } else if (!this.blocks[hash]) {
      this.blocks[hash] = block;
    } else {
      this.printChain();
      throw new Error("this hash already exists");
    }
  }

  start() {
    if (this.blocks[this.genesisId] !== undefined) {
      throw new Error("blockchain already started");
    } else {
      const newBlock = new Block(Date.now());
      this.lastBlock = newBlock;
      this.addBlockToMap(newBlock);
    }
  }

  addBlock(block) {
    block.mine(this.difficulty);
    this.lastBlock = block;
    this.addBlockToMap(block);
  }

  printChain() {
    const hashes = [];
    let curr = this.lastBlock;
    while (curr !== undefined) {
      hashes.push(curr.hash);
      curr = this.blocks[curr.parentHash];
    }
    console.log(hashes.join(" <- "));
  }
}

const tchain = new Blockchain();

const newBlock = new Block(Date.now(), [
  { from: "jan", to: "michael", amount: 100 },
]);
newBlock.parentHash = tchain.lastBlock.hash;
tchain.addBlock(newBlock);
const newBlock2 = new Block(Date.now(), [
  { from: "jim", to: "michael", amount: 100 },
]);
newBlock2.parentHash = tchain.lastBlock.hash;
tchain.addBlock(newBlock2);

tchain.printChain();
console.log(tchain.blocks);
