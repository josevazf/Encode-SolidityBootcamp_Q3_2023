require('dotenv').config();
import { Transaction, TransactionReceipt, decodeBytes32String, ethers } from "ethers";
import { Ballot__factory, Ballot } from "../typechain-types";

async function main() {
	const alchemyUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;
	const provider = new ethers.JsonRpcProvider(alchemyUrl);
	const wallet = new ethers.Wallet(process.env.MY_WALLET_PRIVATE_KEY ?? "", provider);
	const ballotFactory = new Ballot__factory(wallet);

// Process proposal name from argument input and deploy the contract
/* 	const proposals = process.argv.slice(2);
	console.log("Deploying Ballot contract");
	console.log("Proposals: ");
	proposals.forEach((element, index) => {
		console.log(`Proposal N. ${index + 1}: ${element}`);
	});
 	const ballotContract = await ballotFactory.deploy(
		proposals.map(ethers.encodeBytes32String));
	await ballotContract.waitForDeployment();
	const address = await ballotContract.getAddress();
	console.log(`Contract deployed at address ${address}`);
	for (let index = 0; index < proposals.length; index++) {
		const proposal = await ballotContract.proposals(index);
		const name = ethers.decodeBytes32String(proposal.name);
		console.log({ index, name, proposal });
	} */

	// Contract address
	const contractAddress = "0x6E08F69f938c9478eD6701A55F95959421519527";

	// Connect to deployed contract
	const ballotContract = ballotFactory.attach(contractAddress) as Ballot;
	
	// 'giveRightToVote(address to)' function
	//const addressTo = "paste address here"
	const giveRight = await ballotContract.giveRightToVote("0xbdC1B3Beb4Ee43Ff40629B0371b808C903E2227f");
	console.log(giveRight);
	
	// 'winningProposal' function
/* 	const tx1 = await ballotContract.winningProposal();
	console.log(tx1); */

	// 'winnerName' function
/* 	const tx2 = await ballotContract.winnerName();
	console.log(decodeBytes32String(tx2)); */

}
// Spiderman Batman Superman
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
