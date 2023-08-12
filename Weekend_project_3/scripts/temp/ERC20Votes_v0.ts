// Solidity Bootcamp Q3 2023
// Weekend Project 3 - GROUP 6

require('dotenv').config();
import { ethers } from "hardhat";
import { G6Token__factory, MyToken__factory } from "../typechain-types";

async function main() {
/* 	// Change the url to your provider and set key on .env file
	const providerUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.PROVIDER_KEY}`;
	const provider = new ethers.JsonRpcProvider(providerUrl);

	// Change private key on .env file
	const wallet = new ethers.Wallet(process.env.MY_WALLET_PRIVATE_KEY ?? "", provider);
	const g6TokenFactory = new MyToken__factory(wallet); */

	// Fetch arguments to run functions (not for the deploy function)
	const args = process.argv.slice(2);
	
	const MINT_VALUE = ethers.parseUnits(args[0]);

	const [deployer, acc1, acc2] = await ethers.getSigners(); 
	const tokenFactory = new G6Token__factory(deployer);
	const tokenContract = await tokenFactory.deploy();
	await tokenContract.waitForDeployment();
	const tokenAddress = await tokenContract.getAddress();
	console.log(`Group 6 Token contract deployed at ${tokenAddress}\n`);

	// Mint some tokens
	const mintTx = await tokenContract.mint(acc1.address, MINT_VALUE); // or contract.connect(deployer / acc1).mint...
	await mintTx.wait();
	console.log(`Minted ${ethers.formatUnits(MINT_VALUE).toString()} units of G6TK to account ${acc1.address}\n`);
	const balanceBN = await tokenContract.balanceOf(acc1.address);
	console.log(`Account ${acc1.address} has ${ethers.formatUnits(balanceBN).toString()} units of G6TK\n`);

	// Self delegate
	const votes1BeforeTransfer = await tokenContract.getVotes(acc1.address);
	console.log(`Account ${acc1.address} has ${ethers.formatUnits(votes1BeforeTransfer).toString()} units of voting power before transferring\n`);
	const delegateTx = await tokenContract.connect(acc1).delegate(acc1.address);
	await delegateTx.wait();

	// Transfer tokens
	const transferTx = await tokenContract.connect(acc1).transfer(acc2.address, MINT_VALUE / 2n);
	await transferTx.wait();
  
	// Check the voting power
	const votes1AfterTransfer = await tokenContract.getVotes(acc1.address);
	console.log(`Account ${acc1.address} has ${ethers.formatUnits(votes1AfterTransfer).toString()} units of voting power after transferring\n`);
	const votes2AfterTransfer = await tokenContract.getVotes(acc2.address);
	console.log(`Account ${acc2.address} has ${ethers.formatUnits(votes2AfterTransfer).toString()} units of voting power after receiving a transfer\n`);

	// Check past voting power
	const lastBlock = await ethers.provider.getBlock("latest");
	const lastBlockNumber = lastBlock?.number ?? 0;
  
	for (let index = lastBlockNumber - 1; index > 0; index--) {
		const pastVotes = await tokenContract.getPastVotes(acc1.address,index);
	 	console.log(`Account ${acc1.address} had ${ethers.formatUnits(pastVotes).toString()} units of voting power at block ${index}\n`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});