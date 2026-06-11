const { Web3 } = require('web3');

const NFT_ABI = [
  {
    name: 'mint',
    type: 'function',
    inputs: [
      { name: 'to',       type: 'address' },
      { name: 'quantity', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'buy',
    type: 'function',
    inputs: [{ name: 'quantity', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'payable',
  },
  {
    name: 'ticketsOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    name: 'totalSupply',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'withdraw',
    type: 'function',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
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

  // call for EUR purchases => backend mints on behalf of buyer (free, no ETH sent)
  async mintForBuyer(contractAddress, buyerAddress) {
    const contract = new this.web3.eth.Contract(NFT_ABI, contractAddress);

    const tx = await contract.methods.mint(buyerAddress, 1).send({
      from: this.backendWallet.address,
      gas: 300000,
    });

    const tokenId = Number(tx.events?.Transfer?.returnValues?.tokenId ?? 0);
    return { tx_hash: tx.transactionHash, token_id: tokenId };
  }

  // get all token ids owned by a wallet address (on-chain)
  async getTicketsOf(contractAddress, walletAddress) {
    const contract = new this.web3.eth.Contract(NFT_ABI, contractAddress);
    const ids = await contract.methods.ticketsOf(walletAddress).call();
    return ids.map(Number);
  }

  //called after ETH purchase => just reads the last token minted to verify
  async getLastTokenId(contractAddress) {
    const contract = new this.web3.eth.Contract(NFT_ABI, contractAddress);
    const total = await contract.methods.totalSupply().call();
    return Number(total);
  }
}

module.exports = BlockchainClient;