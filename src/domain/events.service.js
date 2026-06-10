class EventsService {
  constructor(eventsRepository) {
    this.repo = eventsRepository;
  }

  getAllEvents() {
    return this.repo.findAll();
  }

  getEventById(id) {
    const event = this.repo.findById(id);
    if (!event) throw { status: 404, message: 'Event not found' };
    return event;
  }

  createEvent(data) {
    const { name, event_date, seller_address } = data;
    if (!name || !event_date || !seller_address) {
      throw { status: 400, message: 'name, event_date and seller_address are required' };
    }
    return this.repo.create(data);
  }

  getEventWithCategories(id) {
    const event = this.getEventById(id);
    const categories = this.repo.findCategoriesByEventId(id);
    return { ...event, ticket_categories: categories };
  }

  createCategory(eventId, data) {
    this.getEventById(eventId);
    const { name, price_eth, price_eur, max_supply } = data;
    if (!name || !price_eth || !price_eur || !max_supply)
        throw { status: 400, message: 'name, price_eth, price_eur, max_supply are required' };

    return this.repo.createCategory({
        ...data,
        event_id: eventId,
        contract_address: data.contract_address || process.env.CONTRACT_ADDRESS || null,
    });
    }

  decrementSupply(categoryId) {
    this.db.prepare(`
        UPDATE ticket_categories SET max_supply = max_supply - 1 WHERE id = ? AND max_supply > 0
    `).run(categoryId);
    return this.findCategoryById(categoryId);
}
}

module.exports = EventsService;