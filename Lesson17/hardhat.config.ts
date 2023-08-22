import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();
  
	for (const account of accounts) {
	  console.log(account.address);
	}
});

const config: HardhatUserConfig = {
  paths: { tests: "tests" },
  solidity: {
		version: "0.8.19",
		settings: {
			optimizer: {
				enabled: true,
				runs: 1,
			},
		},
	},
};

export default config;