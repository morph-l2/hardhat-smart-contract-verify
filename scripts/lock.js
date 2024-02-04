const hre = require("hardhat");

module.exports = async () => {
  const { deploy, execute, get, getOrNull, log, read, save } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const contract = await deploy("Lock", {
    from: deployer,
    args: [
      unlockTime
    ],
    skipIfAlreadyDeployed: true,
    log: true,
  });

  console.log(`Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${contract.address}`);

  if (hre.network.name != "hardhat") {
    try {
      const result = await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: [unlockTime],
      });
      console.log("Contract is verifing!", result);
    } catch (err) {
      if (err.message.includes("Smart-contract already verified")) {
        console.log("Contract is already verified!");
      } else {
        throw err;
      }
    }
  }
};
