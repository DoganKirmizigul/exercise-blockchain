export const mockEvents = [
  {
    id: 1,
    name: "Ladybug Live Tour",
    description: "Miraculous on stage for the first time! An epic musical adventure for kids and adults.",
    location: "Paris, Accor Arena",
    event_date: "2026-09-15T20:00:00",
    seller_address: "0x1234567890abcdef1234567890abcdef12345678",
    created_at: "2026-06-01T10:00:00",
    ticketCategories: [
      {
        id: 1,
        event_id: 1,
        name: "Fosse",
        price_eth: "0.05",
        price_eur: 150,
        max_supply: 100,
        contract_address: null,
        ipfs_metadata_uri: null,
      },
      {
        id: 2,
        event_id: 1,
        name: "Carré Or",
        price_eth: "0.1",
        price_eur: 300,
        max_supply: 20,
        contract_address: null,
        ipfs_metadata_uri: null,
      }
    ]
  },
  {
    id: 2,
    name: "Teletubbies Rave Party",
    description: "Tinky Winky, Dipsy, Laa-Laa and Po are coming for a wild night. Come in costume.",
    location: "Lyon, Halle Tony Garnier",
    event_date: "2026-10-03T21:00:00",
    seller_address: "0xabcdef1234567890abcdef1234567890abcdef12",
    created_at: "2026-06-02T10:00:00",
    ticketCategories: [
      {
        id: 3,
        event_id: 2,
        name: "Fosse",
        price_eth: "0.03",
        price_eur: 90,
        max_supply: 200,
        contract_address: null,
        ipfs_metadata_uri: null,
      },
      {
        id: 4,
        event_id: 2,
        name: "VIP",
        price_eth: "0.15",
        price_eur: 450,
        max_supply: 10,
        contract_address: null,
        ipfs_metadata_uri: null,
      }
    ]
  }
]

export const mockPurchase = {
  id: 1,
  ticket_category_id: 1,
  buyer_wallet_address: "0xabc...",
  amount_eur: 150,
  status: "pending",
  token_id: null,
  tx_hash: null,
  created_at: "2026-06-10T12:00:00"
}
