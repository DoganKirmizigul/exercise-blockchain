
# NFT Ticketing Platform

This project is an end-to-end decentralized ticketing platform developed for the Blockchain course at **Université Paris 1 Panthéon-Sorbonne**. It allows event organizers to create events and dynamically deploy distinct NFT contract categories, enabling buyers to purchase tickets either on-chain using ETH or off-chain using fiat currency (simulated card payment).

Authors:

- Dogan KIRMIZIGUL
- Betul YILDIZ
- Amina BOUZAR
- Bintou BARADJI

---

## Overview
The platform addresses real-world ticketing challenges (scalping, fraud, and lack of secondary market control) by representing event tickets as non-fungible tokens (NFTs) compliant with the ERC-721 standard. 

- **Dynamic Event Creation:** Event sellers can set up events and dynamically deploy separate ERC-721 ticket category smart contracts directly via the API.
- **On-Chain Purchase (`buy`):** Users can connect their Web3 wallets (e.g., MetaMask) and purchase tickets using native ETH directly from the contract.
- **Off-Chain Purchase (`mint`):** Implements a hybrid Web2/Web3 flow. Users can pay via a standard checkout form using a credit card (simulated). The backend validates the payment and executes a platform-backed mint to deliver the NFT ticket to the user's wallet for free.
- **Ticket Enumeration (`ticketsOf`):** Authenticated users can query and view all ticket token IDs they own for a specific category.
- **Withdrawal of Proceeds (`withdraw`):** Contract owners can securely withdraw the full accumulated ETH balance from ticket sales.
- **Decentralized Metadata:** Metadata and assets are securely pinned to **IPFS** via **Pinata** to ensure proper decentralization without heavy on-chain storage costs.

---

## Smart Contract Architecture
The contract inherits from multiple OpenZeppelin extensions to enable both robust tracking and custom IPFS token URIs:
- `ERC721Enumerable`: Provides token enumeration by owner (`tokenOfOwnerByIndex`) to list tickets efficiently.
- `ERC721URIStorage`: Allows individual token URI assignment to bind tickets to unique IPFS metadata.
- `Ownable`: Restricts critical management functions (`mint`, `withdraw`) to the administrative platform wallet.

The `Ticket` contract is an ERC-721 NFT with the following features:

- Each ticket category deploys a new contract
- `buy(quantity)` - purchase tickets directly with ETH
- `mint(to, quantity)` — platform mints tickets after card payment
- `withdraw()` — seller collects ETH proceeds
- `ticketsOf(address)` — list all tickets owned by an address


## Stack

- **Smart Contracts** : Solidity, Forge, OpenZeppelin ERC721
- **Backend** : Node.js, Express, SQLite, Web3.js
- **Frontend** : React, Vite, CSS Modules, Ethers.js
- **Storage** : IPFS via Pinata



## Features 
- As a seller, I can set up an event (name, date, location, description)
- As a seller, I can add ticket categories to an event
- As a seller, I can collect ETH from sold tickets via the smart contract
- As a buyer, I can browse events and view event details
- As a buyer, I can buy a ticket in ETH directly on-chain via MetaMask
- As a buyer, I can buy a ticket in EUR via a fake card payment (API mints NFT on behalf of buyer)
- As a buyer, if logged in with my wallet, I can view the tickets I own





