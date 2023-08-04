require('dotenv').config();
import { Transaction, TransactionReceipt, decodeBytes32String, ethers } from "ethers";
import { Ballot__factory, Ballot } from "../typechain-types";

async function main() {
	const alchemyUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;
	const provider = new ethers.JsonRpcProvider(alchemyUrl);
	const wallet = new ethers.Wallet(process.env.MY_WALLET_PRIVATE_KEY ?? "", provider);
	const ballotFactory = new Ballot__factory(wallet);

// Deploy the contract with Proposals passed as input arguments
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
	const contractAddress = "0xEe075889041D2417d025D9Bd03c227CBeC6D9A59";

	// Connect to deployed contract
	const ballotContract = ballotFactory.attach(contractAddress) as Ballot;
	
	// 'giveRightToVote(address to)' function
	const addressTo = "0x27A4dAAa20edb0537949111053838Ce2a83c69D9"
	const giveRight = await ballotContract.giveRightToVote(addressTo);
	console.log("Right to vote given to:", addressTo);
	console.log("Tx hash:", giveRight.hash);
	
	// 'winningProposal' function
/* 	const winningProp = await ballotContract.winningProposal();
	console.log(The winning proposal number is:", winningProp); */

	// 'winnerName' function
/* 	const winnerN = await ballotContract.winnerName();
	console.log("The winning proposal bane is", decodeBytes32String(winnerN)); */

}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});