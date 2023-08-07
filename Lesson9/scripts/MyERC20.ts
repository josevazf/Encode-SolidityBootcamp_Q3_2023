import { ethers } from "hardhat";

async function main() {
	const accounts = await ethers.getSigners();

	// Deploying the contract to the HRE
	const tokenContractFractory = await ethers.getContractFactory("MyERC20Token");
	const tokenContract = await tokenContractFractory.deploy();
	await tokenContract.waitForDeployment();

	// Fetching  the role code
	const code = await tokenContract.MINTER_ROLE();

	// Minting tokens
	const mintTx = await tokenContract.connect(accounts[0]).mint(accounts[0].address, 2);
 	await mintTx.wait();

	// Fetching the balances from some accounts
	const myBalance = await tokenContract.balanceOf(accounts[0].address);
	console.log(`My Balance is ${myBalance.toString()} decimals units`);
	const otherBalance = await tokenContract.balanceOf(accounts[1].address);
	console.log(`The Balance of Acc1 is ${otherBalance.toString()} decimals units`);

};

main().catch((err) => {
	console.error(err);
	process.exitCode = 1;
});