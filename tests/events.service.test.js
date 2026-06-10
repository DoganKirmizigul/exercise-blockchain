const EventsService = require('../src/domain/events.service');

const mockRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findCategoriesByEventId: jest.fn(),
  createCategory: jest.fn(),
};

const service = new EventsService(mockRepo);

describe('EventsService', () => {
  afterEach(() => jest.clearAllMocks());

  it('throws 404 when event not found', () => {
    mockRepo.findById.mockReturnValue(undefined);
    expect(() => service.getEventById(99)).toThrow({ status: 404 });
  });

  it('throws 400 when required fields missing', () => {
    expect(() => service.createEvent({ name: 'X' })).toThrow({ status: 400 });
  });

  it('creates an event with valid data', () => {
    const data = { name: 'Concert', event_date: '2026-09-01', description:'test_description', location:'France', seller_address: '0xABC' };
    mockRepo.create.mockReturnValue({ id: 1, ...data });
    const result = service.createEvent(data);
    expect(mockRepo.create).toHaveBeenCalledWith(data);
    expect(result.id).toBe(1);
  });
});