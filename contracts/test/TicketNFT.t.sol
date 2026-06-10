// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/TicketNFT.sol";

contract TicketNFTTest is Test {
    Ticket ticket;

    address seller = address(0x1);
    address buyer  = address(0x2);
    address other  = address(0x3);

    uint256 constant MAX_SUPPLY = 100;
    uint256 constant PRICE      = 0.1 ether;

    function setUp() public {
        vm.prank(seller);
        ticket = new Ticket("Concert VIP", "CVIP", MAX_SUPPLY, "ipfs://QmTest/", PRICE);
    }

    // --- constructor ---

    function test_InitialState() public view {
        assertEq(ticket.maxSupply(), MAX_SUPPLY);
        assertEq(ticket.price(), PRICE);
        assertEq(ticket.ticketURI(), "ipfs://QmTest/");
        assertEq(ticket.owner(), seller);
        assertEq(ticket.totalSupply(), 0);
    }

    // --- buy ---

    function test_BuySingleTicket() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        uint256[] memory ids = ticket.buy{value: PRICE}(1);

        assertEq(ids.length, 1);
        assertEq(ids[0], 0);
        assertEq(ticket.ownerOf(0), buyer);
        assertEq(ticket.totalSupply(), 1);
    }

    function test_BuyMultipleTickets() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        uint256[] memory ids = ticket.buy{value: PRICE * 3}(3);

        assertEq(ids.length, 3);
        assertEq(ticket.ownerOf(0), buyer);
        assertEq(ticket.ownerOf(2), buyer);
        assertEq(ticket.totalSupply(), 3);
    }

    function test_BuyRevertsOnIncorrectETH() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        vm.expectRevert(bytes("Incorrect ETH amount"));
        ticket.buy{value: 0.05 ether}(1);
    }

    function test_BuyRevertsOnOverpayment() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        vm.expectRevert(bytes("Incorrect ETH amount"));
        ticket.buy{value: 0.5 ether}(1);
    }

    function test_BuyRevertsWhenSoldOut() public {
        Ticket small;
        vm.prank(seller);
        small = new Ticket("Small", "SML", 2, "ipfs://x/", PRICE);

        vm.deal(buyer, 10 ether);
        vm.prank(buyer);
        small.buy{value: PRICE * 2}(2);

        vm.prank(buyer);
        vm.expectRevert(bytes("Sold out"));
        small.buy{value: PRICE}(1);
    }

    function test_BuyRevertsOnZeroQuantity() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        vm.expectRevert(bytes("Quantity must be positive"));
        ticket.buy{value: 0}(0);
    }

    // --- mint (platform) ---

    function test_MintByOwner() public {
        vm.prank(seller);
        uint256[] memory ids = ticket.mint(buyer, 2);

        assertEq(ids.length, 2);
        assertEq(ticket.ownerOf(0), buyer);
        assertEq(ticket.ownerOf(1), buyer);
        assertEq(ticket.totalSupply(), 2);
    }

    function test_MintRevertsIfNotOwner() public {
        vm.prank(other);
        vm.expectRevert();
        ticket.mint(buyer, 1);
    }

    function test_MintRevertsWhenSoldOut() public {
        Ticket small;
        vm.prank(seller);
        small = new Ticket("Small", "SML", 1, "ipfs://x/", PRICE);

        vm.prank(seller);
        small.mint(buyer, 1);

        vm.prank(seller);
        vm.expectRevert(bytes("Sold out"));
        small.mint(buyer, 1);
    }

    // --- withdraw ---

    function test_WithdrawByOwner() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        ticket.buy{value: PRICE * 2}(2);

        uint256 before = seller.balance;
        vm.prank(seller);
        ticket.withdraw();

        assertEq(seller.balance, before + PRICE * 2);
        assertEq(address(ticket).balance, 0);
    }

    function test_WithdrawRevertsIfNotOwner() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        ticket.buy{value: PRICE}(1);

        vm.prank(buyer);
        vm.expectRevert();
        ticket.withdraw();
    }

    // --- tokenURI ---

    function test_TokenURIIsSet() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        ticket.buy{value: PRICE}(1);
        assertEq(ticket.tokenURI(0), "ipfs://QmTest/");
    }

    // --- totalSupply ---

    function test_TotalSupply() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        ticket.buy{value: PRICE * 3}(3);
        assertEq(ticket.totalSupply(), 3);
    }
}
