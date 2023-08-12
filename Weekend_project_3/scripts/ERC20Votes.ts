 //   Solidity Bootcamp Q3 2023   \\
//   Weekend Project 3 - GROUP 6   \\

require('dotenv').config();
import { ethers } from "ethers";
import { G6Token, G6Token__factory} from "../typechain-types";

async function main() {
	// Change the url to your provider and set key on .env file
	const providerUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.PROVIDER_KEY}`;
	const provider = new ethers.JsonRpcProvider(providerUrl);

	// Change private key on .env file
	const wallet = new ethers.Wallet(process.env.MY_WALLET_PRIVATE_KEY ?? "", provider);
	const tokenFactory = new G6Token__factory(wallet);

	// Fetch arguments to run functions 
	const args = process.argv.slice(2);

	// Filter wich function to be called
	if (args[0] == "deployToken") {
		deployToken();
	} else if (args[0] == "mint") {
		mint(args[1], ethers.parseUnits(args[2]));
	} else if (args[0] == "delegate") {
		delegate(args[1]);
	} else if (args[0] == "transfer") {
		transfer(args[1], ethers.parseUnits(args[2]));
	} else if (args[0] == "getVotes") {
		getVotes(args[1]);
	} else if (args[0] == "getPastVotes") {
		getPastVotes(args[1], parseInt(args[2]));
	}

	// Deploy the Token contract first to interact with and/or pass the address to (tokenAddress)
	async function deployToken() {
		console.log("Deploying G6Token contract...");
		const tokenContract = await tokenFactory.deploy();
		await tokenContract.waitForDeployment();
		const tokenAddress = await tokenContract.getAddress();
		console.log(`Group 6 Token contract deployed at ${tokenAddress}\nhttps://sepolia.etherscan.io/address/${tokenAddress}\n`);
	}

	// Contract address, update with Token contract address
	const tokenAddress = "   ";

	// Connect to deployed contract
	const tokenContract = tokenFactory.attach(tokenAddress) as G6Token;

	// 'mint' function
	async function mint(addressTo: string, amount: bigint) {
		const mintTx = await tokenContract.mint(addressTo, amount); // or contract.connect(deployer / acc1).mint...
		await mintTx.wait();
		console.log(`Minted ${ethers.formatUnits(amount).toString()} units of G6TK to account ${addressTo}\n`);
		const balanceBN = await tokenContract.balanceOf(addressTo);
		console.log(`Account ${addressTo} has ${ethers.formatUnits(balanceBN).toString()} units of G6TK\n`);
	}

	// 'delegate' function (delegate to self to activate voting power or delegate to another account to pass on voting power)
	async function delegate(addressTo: string) {
		const votesBefore = await tokenContract.getVotes(wallet);
		const delegateTx = await tokenContract.delegate(addressTo);
		await delegateTx.wait();
		console.log(`Account ${wallet} delegated ${ethers.formatUnits(votesBefore).toString()} units of voting power to ${addressTo}\n`);
	}

	// 'transfer' function
	async function transfer(addressTo: string, amount: bigint) {
		const transferTx = await tokenContract.transfer(addressTo, amount / 2n);
		await transferTx.wait();
	}
  
	// 'getVotes' function (check the voting power)
	async function getVotes(addressFrom: string) {
		const votes1AfterTransfer = await tokenContract.getVotes(addressFrom);
		console.log(`Account ${addressFrom} has ${ethers.formatUnits(votes1AfterTransfer).toString()} units of voting power after transferring\n`);
		const votes2AfterTransfer = await tokenContract.getVotes(addressFrom);
		console.log(`Account ${addressFrom} has ${ethers.formatUnits(votes2AfterTransfer).toString()} units of voting power after receiving a transfer\n`);
	}

	// 'getPastVotes' function (check past voting power)
	async function getPastVotes(addressFrom: string, blockIndex: number) {
		const lastBlock = await provider.getBlock("latest");
		const lastBlockNumber = lastBlock?.number ?? 0;
	
		for (let index = lastBlockNumber - 1; index > 0; index--) {
			const pastVotes = await tokenContract.getPastVotes(addressFrom,index);
			console.log(`Account ${addressFrom} had ${ethers.formatUnits(pastVotes).toString()} units of voting power at block ${index}\n`);
		}	
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});