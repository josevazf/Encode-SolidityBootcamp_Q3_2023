import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";


async function main() {
	const [deployer, acc1, acc2] = await ethers.getSigners(); 
	const contractFactory = new MyToken__factory(deployer);
	const contract = await contractFactory.deploy();
	await contract.waitForDeployment();
	const contractAddress = await contract.getAddress();
	console.log(`Token contract deployed at ${contractAddress}\n`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});