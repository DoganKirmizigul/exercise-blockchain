const { Router } = require('express');
const EventsRepository = require('../infrastructure/events.repository');
const BlockchainClient = require('../infrastructure/blockchain.client');
const PurchasesService = require('../domain/purchases.service');
const { getDb } = require('../config/db');

const router = Router({ mergeParams: true }); // mergeParams to access :id from parent

function makeService() {
  return new PurchasesService(
    new EventsRepository(getDb()),
    new BlockchainClient()
  );
}

function handle(fn) {
  return async (req, res) => {
    try {
      const result = await fn(req);
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal error' });
    }
  };
}

/**
 * @swagger
 * /events/{id}/categories/{categoryId}/pay/eur:
 *   post:
 *     summary: Buy a ticket in EUR (fake payment, API mints NFT)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *       - { in: path, name: categoryId, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [buyer_wallet_address, card_number]
 *             properties:
 *               buyer_wallet_address: { type: string }
 *               card_number:          { type: string }
 *               expiry:               { type: string }
 *               cvv:                  { type: string }
 *     responses:
 *       200:
 *         description: Confirmed purchase with tx_hash and token_id
 *       400:
 *         description: Invalid input
 *       502:
 *         description: Payment or minting failed
 */
router.post('/pay/eur', handle((req) =>
  makeService().payWithEur({
    eventId: +req.params.id,
    categoryId: +req.params.categoryId,
    buyer_wallet_address: req.body.buyer_wallet_address,
    card_number: req.body.card_number,
  })
));

/**
 * @swagger
 * /events/{id}/categories/{categoryId}/pay/eth:
 *   post:
 *     summary: Record an ETH purchase made directly on-chain via MetaMask
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *       - { in: path, name: categoryId, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [buyer_wallet_address, tx_hash, token_id]
 *             properties:
 *               buyer_wallet_address: { type: string }
 *               tx_hash:              { type: string }
 *               token_id:             { type: integer }
 *     responses:
 *       200:
 *         description: Recorded purchase
 */
router.post('/pay/eth', handle((req) =>
  makeService().recordEthPurchase({
    eventId: +req.params.id,
    categoryId: +req.params.categoryId,
    ...req.body,
  })
));

/**
 * @swagger
 * /wallets/{address}/tickets:
 *   get:
 *     summary: Get all tickets owned by a wallet
 *     parameters:
 *       - { in: path, name: address, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: List of confirmed purchases with event and category info
 */
router.get('/tickets', handle((req) =>
  makeService().getTicketsByWallet(req.params.address)
));

module.exports = router;