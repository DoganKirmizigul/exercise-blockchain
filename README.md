# NFT Ticketing Platform A decentralized ticketing platform built on Ethereum. Users can buy event tickets as NFTs, either directly on-chain with ETH or via a fiat payment flow.



## Stack 
**Smart Contracts**
  - Solidity, Forge, OpenZeppelin ERC721
**Backend**
  - Node.js, Express, SQLite, Web3.js 
**Frontend**
  — React, Vite, CSS Modules, Ethers.js
**Storage**
  — IPFS via Pinata



## Features 
- As a seller, I can set up an event (name, date, location, description)
- As a seller, I can add ticket categories to an event
- As a seller, I can collect ETH from sold tickets via the smart contract
- As a buyer, I can browse events and view event details
- As a buyer, I can buy a ticket in ETH directly on-chain via MetaMask
- As a buyer, I can buy a ticket in EUR via a fake card payment (API mints NFT on behalf of buyer)
- As a buyer, if logged in with my wallet, I can view the tickets I own

## Smart Contract

The `Ticket` contract is an ERC-721 NFT with the following features:

- Each ticket category deploys a new contract
- `buy(quantity)` - purchase tickets directly with ETH
- `mint(to, quantity)` — platform mints tickets after card payment
- `withdraw()` — seller collects ETH proceeds
- `ticketsOf(address)` — list all tickets owned by an address


