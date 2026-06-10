const { Router } = require('express');
const EventsRepository = require('../infrastructure/events.repository');
const EventsService = require('../domain/events.service');
const { getDb } = require('../config/db');

const router = Router();

function makeService() {
  return new EventsService(new EventsRepository(getDb()));
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
 * /events:
 *   get:
 *     summary: List all events
 *     responses:
 *       200:
 *         description: Array of events
 */
router.get('/', handle(() => makeService().getAllEvents()));

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event with ticket categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event object with ticket_categories
 *       404:
 *         description: Not found
 */
router.get('/:id', handle((req) => makeService().getEventWithCategories(+req.params.id)));

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create an event (seller)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, event_date, seller_address]
 *             properties:
 *               name:            { type: string }
 *               description:     { type: string }
 *               location:        { type: string }
 *               event_date:      { type: string, format: date-time }
 *               seller_address:  { type: string }
 *     responses:
 *       200:
 *         description: Created event
 */
router.post('/', handle((req) => makeService().createEvent(req.body)));

/**
 * @swagger
 * /events/{id}/categories:
 *   post:
 *     summary: Add a ticket category to an event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price_eth, price_eur, max_supply]
 *             properties:
 *               name:       { type: string }
 *               price_eth:  { type: string }
 *               price_eur:  { type: integer }
 *               max_supply: { type: integer }
 *     responses:
 *       200:
 *         description: Created category
 */
router.post('/:id/categories', handle((req) =>
  makeService().createCategory(+req.params.id, req.body)
));

/**
 * @swagger
 * /events/{id}/categories/{categoryId}/contract:
 *   patch:
 *     summary: Set the deployed contract address for a ticket category
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *       - { in: path, name: categoryId, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [contract_address]
 *             properties:
 *               contract_address: { type: string }
 *     responses:
 *       200:
 *         description: Updated category with contract address
 */
router.patch('/:id/categories/:categoryId/contract', handle((req) =>
  makeService().setContractAddress(
    +req.params.id,
    +req.params.categoryId,
    req.body.contract_address
  )
));

module.exports = router;