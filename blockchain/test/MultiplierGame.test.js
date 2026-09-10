const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiplierGame", function () {
  let MultiplierGame;
  let game;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    MultiplierGame = await ethers.getContractFactory("MultiplierGame");
    game = await MultiplierGame.deploy();
    await game.waitForDeployment();

    // Fund contract with initial ETH liquidity for payouts
    await owner.sendTransaction({
      to: await game.getAddress(),
      value: ethers.parseEther("10.0"),
    });
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await game.owner()).to.equal(owner.address);
    });

    it("Should start at game ID 1", async function () {
      expect(await game.currentGameId()).to.equal(1n);
    });

    it("Should have correct minimum and maximum bet limits", async function () {
      expect(await game.minimumBet()).to.equal(ethers.parseEther("0.001"));
      expect(await game.maximumBet()).to.equal(ethers.parseEther("10"));
    });
  });

  describe("Placing Bets", function () {
    it("Should allow player to place a valid bet", async function () {
      const betAmount = ethers.parseEther("0.1");
      const targetMultiplier = 200; // 2.00x

      await expect(game.connect(player1).placeBet(targetMultiplier, { value: betAmount }))
        .to.emit(game, "BetPlaced")
        .withArgs(1, player1.address, betAmount, targetMultiplier);

      const bet = await game.bets(1, player1.address);
      expect(bet.player).to.equal(player1.address);
      expect(bet.amount).to.equal(betAmount);
      expect(bet.targetMultiplier).to.equal(targetMultiplier);
      expect(bet.claimed).to.be.false;
    });

    it("Should reject bets below minimum amount", async function () {
      const betAmount = ethers.parseEther("0.0001");
      await expect(
        game.connect(player1).placeBet(150, { value: betAmount })
      ).to.be.revertedWith("Bet below minimum amount");
    });

    it("Should reject target multiplier below 1.01x (101)", async function () {
      const betAmount = ethers.parseEther("0.1");
      await expect(
        game.connect(player1).placeBet(100, { value: betAmount })
      ).to.be.revertedWith("Target multiplier must be >= 1.01x");
    });

    it("Should reject duplicate bets in the same game round", async function () {
      const betAmount = ethers.parseEther("0.1");
      await game.connect(player1).placeBet(200, { value: betAmount });

      await expect(
        game.connect(player1).placeBet(250, { value: betAmount })
      ).to.be.revertedWith("Bet already placed for current game");
    });
  });

  describe("Settling Games & Claiming Payouts", function () {
    beforeEach(async function () {
      // Player1 bets 0.1 ETH @ 2.00x
      await game.connect(player1).placeBet(200, { value: ethers.parseEther("0.1") });
      // Player2 bets 0.2 ETH @ 3.00x
      await game.connect(player2).placeBet(300, { value: ethers.parseEther("0.2") });
    });

    it("Should allow owner to settle game and advance game ID", async function () {
      await expect(game.connect(owner).settleGame(250))
        .to.emit(game, "GameSettled")
        .withArgs(1, 250);

      expect(await game.currentGameId()).to.equal(2n);
    });

    it("Should reject game settlement from non-owner", async function () {
      await expect(
        game.connect(player1).settleGame(250)
      ).to.be.revertedWith("Only owner can call this");
    });

    it("Should allow winning player to claim payout", async function () {
      // Game crashes at 2.50x (250)
      await game.connect(owner).settleGame(250);

      // Player1 target is 2.00x (<= 2.50x) -> WIN
      // Expected payout = 0.1 ETH * 200 / 100 = 0.2 ETH
      const initialBalance = await ethers.provider.getBalance(player1.address);
      const tx = await game.connect(player1).claimPayout(1);
      const receipt = await tx.wait();
      const gasUsed = receipt.fee;

      const finalBalance = await ethers.provider.getBalance(player1.address);
      const expectedBalance = initialBalance + ethers.parseEther("0.2") - gasUsed;

      expect(finalBalance).to.equal(expectedBalance);
    });

    it("Should prevent losing player from claiming payout", async function () {
      // Game crashes at 2.50x (250)
      await game.connect(owner).settleGame(250);

      // Player2 target is 3.00x (> 2.50x) -> LOSS
      await expect(
        game.connect(player2).claimPayout(1)
      ).to.be.revertedWith("Bet lost: target multiplier exceeded crash point");
    });

    it("Should prevent double claiming payouts", async function () {
      await game.connect(owner).settleGame(250);
      await game.connect(player1).claimPayout(1);

      await expect(
        game.connect(player1).claimPayout(1)
      ).to.be.revertedWith("Payout already claimed");
    });
  });

  describe("Owner Administrative Functions", function () {
    it("Should allow owner to withdraw liquidity", async function () {
      const withdrawAmount = ethers.parseEther("1.0");
      const initialContractBalance = await ethers.provider.getBalance(await game.getAddress());

      await game.connect(owner).withdrawLiquidity(withdrawAmount);

      const finalContractBalance = await ethers.provider.getBalance(await game.getAddress());
      expect(finalContractBalance).to.equal(initialContractBalance - withdrawAmount);
    });

    it("Should prevent non-owner from withdrawing liquidity", async function () {
      await expect(
        game.connect(player1).withdrawLiquidity(ethers.parseEther("1.0"))
      ).to.be.revertedWith("Only owner can call this");
    });
  });
});
