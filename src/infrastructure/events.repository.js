class EventsRepository {
  constructor(db) {
    this.db = db;
  }

  findAll() {
    return this.db.prepare('SELECT * FROM events ORDER BY created_at DESC').all();
  }

  findById(id) {
    return this.db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  }

  create({ name, description, location, event_date, seller_address }) {
    const stmt = this.db.prepare(`
      INSERT INTO events (name, description, location, event_date, seller_address)
      VALUES (@name, @description, @location, @event_date, @seller_address)
    `);
    const result = stmt.run({ name, description, location, event_date, seller_address });
    return this.findById(result.lastInsertRowid);
  }

  findCategoriesByEventId(eventId) {
    return this.db
      .prepare('SELECT * FROM ticket_categories WHERE event_id = ?')
      .all(eventId);
  }

  createCategory({ event_id, name, price_eth, price_eur, max_supply, contract_address }) {
        const stmt = this.db.prepare(`
            INSERT INTO ticket_categories (event_id, name, price_eth, price_eur, max_supply, contract_address)
            VALUES (@event_id, @name, @price_eth, @price_eur, @max_supply, @contract_address)
        `);
        const result = stmt.run({ event_id, name, price_eth, price_eur, max_supply, contract_address: contract_address ?? null });
        return this.db.prepare('SELECT * FROM ticket_categories WHERE id = ?').get(result.lastInsertRowid);
    }

  findCategoryById(id) {
  return this.db
    .prepare('SELECT * FROM ticket_categories WHERE id = ?')
    .get(id);
    }

    createPurchase({ ticket_category_id, buyer_wallet_address, amount_eur, status, token_id, tx_hash }) {
        const stmt = this.db.prepare(`
            INSERT INTO purchases (ticket_category_id, buyer_wallet_address, amount_eur, status, token_id, tx_hash)
            VALUES (@ticket_category_id, @buyer_wallet_address, @amount_eur, @status, @token_id, @tx_hash)
        `);
        const result = stmt.run({ ticket_category_id, buyer_wallet_address, amount_eur, status, token_id: token_id ?? null, tx_hash: tx_hash ?? null });
        return this.db.prepare('SELECT * FROM purchases WHERE id = ?').get(result.lastInsertRowid);
    }

    findPurchasesByWallet(wallet_address) {
        return this.db
            .prepare(`
            SELECT p.*, tc.name as category_name, tc.contract_address, e.name as event_name
            FROM purchases p
            JOIN ticket_categories tc ON p.ticket_category_id = tc.id
            JOIN events e ON tc.event_id = e.id
            WHERE p.buyer_wallet_address = ? AND p.status = 'confirmed'
            `)
            .all(wallet_address);
    }

    updatePurchaseStatus(id, status, token_id, tx_hash) {
        this.db.prepare(`
            UPDATE purchases SET status = ?, token_id = ?, tx_hash = ? WHERE id = ?
        `).run(status, token_id ?? null, tx_hash ?? null, id);
        return this.db.prepare('SELECT * FROM purchases WHERE id = ?').get(id);
        }
        updateContractAddress(categoryId, contract_address) {
        this.db
            .prepare('UPDATE ticket_categories SET contract_address = ? WHERE id = ?')
            .run(contract_address, categoryId);
        return this.findCategoryById(categoryId);
        }
    }


module.exports = EventsRepository;