// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MultiplierGame
 * @dev Smart contract for ChainAscent multiplier crash game logic on local EVM.
 */
contract MultiplierGame {
    address public owner;
    uint256 public currentGameId;
    uint256 public minimumBet = 0.001 ether;
    uint256 public maximumBet = 10 ether;

    struct Bet {
        address player;
        uint256 amount;
        uint256 targetMultiplier; // e.g., 150 = 1.50x
        bool claimed;
        bool won;
    }

    struct Game {
        uint256 crashMultiplier; // 2 decimals: e.g. 250 = 2.50x
        bool settled;
        uint256 totalBetAmount;
    }

    // gameId => Game
    mapping(uint256 => Game) public games;
    // gameId => player address => Bet
    mapping(uint256 => mapping(address => Bet)) public bets;

    event BetPlaced(uint256 indexed gameId, address indexed player, uint256 amount, uint256 targetMultiplier);
    event GameSettled(uint256 indexed gameId, uint256 crashMultiplier);
    event PayoutClaimed(uint256 indexed gameId, address indexed player, uint256 payoutAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
        currentGameId = 1;
    }

    function placeBet(uint256 targetMultiplier) external payable {
        require(msg.value >= minimumBet, "Bet below minimum amount");
        require(msg.value <= maximumBet, "Bet exceeds maximum amount");
        require(targetMultiplier >= 101, "Target multiplier must be >= 1.01x");
        require(bets[currentGameId][msg.sender].amount == 0, "Bet already placed for current game");

        bets[currentGameId][msg.sender] = Bet({
            player: msg.sender,
            amount: msg.value,
            targetMultiplier: targetMultiplier,
            claimed: false,
            won: false
        });

        games[currentGameId].totalBetAmount += msg.value;

        emit BetPlaced(currentGameId, msg.sender, msg.value, targetMultiplier);
    }

    function settleGame(uint256 crashMultiplier) external onlyOwner {
        require(!games[currentGameId].settled, "Current game already settled");
        require(crashMultiplier >= 100, "Crash multiplier must be >= 1.00x");

        games[currentGameId].crashMultiplier = crashMultiplier;
        games[currentGameId].settled = true;

        emit GameSettled(currentGameId, crashMultiplier);

        // Advance to next game ID
        currentGameId++;
    }

    function claimPayout(uint256 gameId) external {
        require(games[gameId].settled, "Game not settled yet");
        Bet storage bet = bets[gameId][msg.sender];
        require(bet.amount > 0, "No bet placed for this game");
        require(!bet.claimed, "Payout already claimed");

        uint256 crashMultiplier = games[gameId].crashMultiplier;
        require(bet.targetMultiplier <= crashMultiplier, "Bet lost: target multiplier exceeded crash point");

        bet.claimed = true;
        bet.won = true;

        // Payout = Bet Amount * Target Multiplier / 100
        uint256 payout = (bet.amount * bet.targetMultiplier) / 100;
        require(address(this).balance >= payout, "Contract insufficient liquidity");

        (bool success, ) = payable(msg.sender).call{value: payout}("");
        require(success, "Transfer failed");

        emit PayoutClaimed(gameId, msg.sender, payout);
    }

    function fundContract() external payable onlyOwner {}

    function withdrawLiquidity(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
    }

    receive() external payable {}
}
