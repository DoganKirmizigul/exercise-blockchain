const { Web3 } = require('web3');

const NFT_ABI = [
  {
    name: 'mintTo',
    type: 'function',
    inputs: [{ name: 'to', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    name: 'totalSupply',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
];

class BlockchainClient {
  constructor() {
    this.web3 = new Web3(process.env.RPC_URL || 'http://127.0.0.1:8545');
    this.backendWallet = this.web3.eth.accounts.privateKeyToAccount(
      process.env.BACKEND_WALLET_PRIVATE_KEY
    );
    this.web3.eth.accounts.wallet.add(this.backendWallet);
  }

  //call for EUR purchases => backend mints on behalf of buyer
  async mintForBuyer(contractAddress, buyerAddress, priceEth) {
    const contract = new this.web3.eth.Contract(NFT_ABI, contractAddress);

    const tx = await contract.methods.mintTo(buyerAddress).send({
      from: this.backendWallet.address,
      value: this.web3.utils.toWei(priceEth, 'ether'),
      gas: 300000,
    });

    const tokenId = Number(tx.events?.Transfer?.returnValues?.tokenId ?? 0);
    return { tx_hash: tx.transactionHash, token_id: tokenId };
  }

  //called after ETH purchase => just reads the last token minted to verify
  async getLastTokenId(contractAddress) {
    const contract = new this.web3.eth.Contract(NFT_ABI, contractAddress);
    const total = await contract.methods.totalSupply().call();
    return Number(total);
  }
}

module.exports = BlockchainClient;