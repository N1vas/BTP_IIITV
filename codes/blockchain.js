var crypto = require('crypto');



class Block{


    constructor(index,timestamp,data,previousHash=""){
        this.index = index;
        this.timestamp = new Date().toString();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
       
        this.nonce = 0;
       
    }

   calculateHash() {
    return crypto.createHash('sha256').update(this.data+this.previousHash).digest('hex');

   }

    
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesis()];
    }

    createGenesis() {
        return new Block(0, new Date().toString() , "Genesis block", "0");
    }

    latestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.latestBlock().hash;
        this.chain.push(newBlock);
    }
}

var testChain = new Blockchain();

testChain.addBlock(new Block(1, new Date().toString(), "This is block 1"));

testChain.addBlock(new Block(2,new Date().toString(), "This is block 2"));
console.log(testChain);