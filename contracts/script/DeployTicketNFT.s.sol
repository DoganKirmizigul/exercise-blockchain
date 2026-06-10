// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/TicketNFT.sol";

/// Usage:
///   forge script script/DeployTicketNFT.s.sol \
///     --rpc-url $RPC_URL \
///     --private-key $PRIVATE_KEY \
///     --broadcast
///
/// Override defaults via env vars:
///   TICKET_NAME, TICKET_SYMBOL, MAX_SUPPLY, BASE_URI, PRICE_WEI
contract DeployTicketNFT is Script {
    function run() external returns (Ticket) {
        string  memory name   = vm.envOr("TICKET_NAME",   string("Concert Ticket"));
        string  memory symbol = vm.envOr("TICKET_SYMBOL", string("TCKT"));
        uint256        supply = vm.envOr("MAX_SUPPLY",     uint256(500));
        string  memory uri    = vm.envOr("BASE_URI",       string("ipfs://"));
        uint256        price  = vm.envOr("PRICE_WEI",      uint256(0.01 ether));

        vm.startBroadcast();
        Ticket ticket = new Ticket(name, symbol, supply, uri, price);
        vm.stopBroadcast();

        console.log("Ticket deployed at:", address(ticket));
        return ticket;
    }
}
