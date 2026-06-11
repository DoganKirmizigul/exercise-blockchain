class PurchasesService {
  constructor(eventsRepository, blockchainClient) {
    this.repo = eventsRepository;
    this.blockchain = blockchainClient;
  }

  //=============================EUR flow
  //frontend sends fake card details + buyer wallet address
  //API validates, simulates payment, mints NFT on-chain, records purchase
  async payWithEur({ eventId, categoryId, buyer_wallet_address }) {
  const category = this._getValidCategory(eventId, categoryId);

  if (!buyer_wallet_address)
    throw { status: 400, message: 'buyer_wallet_address is required' };

  //check if tickets are still available
  if (category.max_supply <= 0)
    throw { status: 400, message: 'No tickets remaining for this category' };

  const purchase = this.repo.createPurchase({
    ticket_category_id: categoryId,
    buyer_wallet_address,
    amount_eur: category.price_eur,
    status: 'pending',
  });

  try {
    const { tx_hash, token_id } = await this.blockchain.mintForBuyer(
      category.contract_address,
      buyer_wallet_address
    );

    //payment succeeded => confirm purchase and decrement supply
    const confirmed = this.repo.updatePurchaseStatus(purchase.id, 'confirmed', token_id, tx_hash);
    this.repo.decrementSupply(categoryId);

    return {
      purchase: confirmed,
      remaining_tickets: category.max_supply - 1,
    };
  } catch (err) {
    this.repo.updatePurchaseStatus(purchase.id, 'failed', null, null);
    throw { status: 502, message: `Minting failed: ${err.message}` };
  }
}

async recordEthPurchase({ eventId, categoryId, buyer_wallet_address, tx_hash, token_id }) {
  const category = this._getValidCategory(eventId, categoryId);

  if (!buyer_wallet_address || !tx_hash || token_id === undefined)
    throw { status: 400, message: 'buyer_wallet_address, tx_hash and token_id are required' };

  if (category.max_supply <= 0)
    throw { status: 400, message: 'No tickets remaining for this category' };

  const purchase = this.repo.createPurchase({
    ticket_category_id: categoryId,
    buyer_wallet_address,
    amount_eur: 0,
    status: 'confirmed',
    token_id,
    tx_hash,
  });

  //decrement supply after successful ETH purchase
  this.repo.decrementSupply(categoryId);

  return {
    purchase,
    remaining_tickets: category.max_supply - 1,
  };
}

  //get tickets owned by a wallet
  getTicketsByWallet(wallet_address) {
    if (!wallet_address)
      throw { status: 400, message: 'wallet_address is required' };
    return this.repo.findPurchasesByWallet(wallet_address);
  }

  //Helpers
  _getValidCategory(eventId, categoryId) {
    const category = this.repo.findCategoryById(categoryId);
    if (!category) throw { status: 404, message: 'Ticket category not found' };
    if (category.event_id !== eventId)
      throw { status: 400, message: 'Category does not belong to this event' };
    return category;
  }

  _simulateEurPayment(card_number) {
    //declined card for testing
    if (card_number === '4000000000000002')
      throw new Error('Card declined');
    //all other card numbers are accepted
  }
}

module.exports = PurchasesService;