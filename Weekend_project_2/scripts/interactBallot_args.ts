require('dotenv').config();
import { Transaction, TransactionReceipt, decodeBytes32String, ethers } from "ethers";
import { Ballot__factory, Ballot } from "../typechain-types";

async function main() {
	const alchemyUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;
	const provider = new ethers.JsonRpcProvider(alchemyUrl);
	const wallet = new ethers.Wallet(process.env.MY_WALLET_PRIVATE_KEY ?? "", provider);
	const ballotFactory = new Ballot__factory(wallet);

	const args = process.argv.slice(2);
	
// Deploy the contract with Proposals passed as input arguments
	async function deployContract(propos: string[]) {
		const proposals = process.argv.slice(3);
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
		};
	};

	// Contract address, change to contract address
	const contractAddress = "0xac00780fd30973C7216EE4F5ea23139f9C487D91";

	// Connect to deployed contract
	const ballotContract = ballotFactory.attach(contractAddress) as Ballot;

	if (args[0] == "deploy") {
		deployContract(args);
	} else if (args[0] == "giveRightToVote") {
		giveRightToVote(args[1]);
	} else if (args[0] == "delegate") {
		delegate(args[1]);
	} else if (args[0] == "vote") {
		vote(parseInt(args[1]));
	} else if (args[0] == "winningProposal") {
		winningProposal();
	} else if (args[0] == "winnerName") {
		winnerName();
	}

	// 'giveRightToVote(address to)' function
	async function giveRightToVote(addressTo: string) {
		//const giveTo = addressTo;
		const _giveRightToVote = await ballotContract.giveRightToVote(addressTo);
		console.log("Right to vote given to:", addressTo);
		console.log("Tx hash:", _giveRightToVote.hash);
	};

	// 'delegate' function
	async function delegate(addressTo: string) {
		//const delegateTo = "paste address here";
		const _delegate = await ballotContract.delegate(addressTo);
		console.log("Delegated voting right to:", addressTo);
		console.log("Tx hash:", _delegate.hash);
	};

	// 'vote' function, choose the index
	async function vote(proposalNumber: number) {
		//const proposalNumber = 0;
		const _vote = await ballotContract.vote(proposalNumber - 1);
		const votedProposal = await ballotContract.proposals(proposalNumber)
		console.log(`Vote for proposal ${proposalNumber}:`, `"${decodeBytes32String(votedProposal.name)}"`, "submited");
		console.log("Tx hash:", _vote.hash);
	};

	// 'winningProposal' function
	async function winningProposal() {
		const _winningProposal = await ballotContract.winningProposal();
		console.log("The winning proposal number is:", _winningProposal);
	};

	// 'winnerName' function
	async function winnerName() {
		const _winnerName = await ballotContract.winnerName();
		console.log("The winning proposal name is", `"${decodeBytes32String(_winnerName)}"`);
	};
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});