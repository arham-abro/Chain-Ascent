const hre = require("hardhat");

async function main() {
  console.log("Deploying MultiplierGame contract to local network...");

  const MultiplierGame = await hre.ethers.getContractFactory("MultiplierGame");
  const multiplierGame = await MultiplierGame.deploy();

  await multiplierGame.waitForDeployment();
  const address = await multiplierGame.getAddress();

  console.log(`MultiplierGame deployed successfully at address: ${address}`);

  // Fund contract with initial liquidity for testing payouts (10 ETH)
  const [deployer] = await hre.ethers.getSigners();
  const fundTx = await deployer.sendTransaction({
    to: address,
    value: hre.ethers.parseEther("10.0"),
  });
  await fundTx.wait();
  console.log("Contract funded with 10.0 ETH testing liquidity.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
