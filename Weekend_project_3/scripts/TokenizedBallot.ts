 //   Solidity Bootcamp Q3 2023   \\
//   Weekend Project 3 - GROUP 6   \\

require('dotenv').config();
import { decodeBytes32String, ethers, toNumber } from "ethers";
import { TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";

async function main() {
	// Change the url to your provider and set key on .env file
	const providerUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.PROVIDER_KEY}`;
	const provider = new ethers.JsonRpcProvider(providerUrl);

	// Change private key on .env file
	const wallet = new ethers.Wallet(process.env.MY_WALLET_PRIVATE_KEY ?? "", provider);
	const tokenizedBallotFactory = new TokenizedBallot__factory(wallet);
	const walletAddress = await wallet.getAddress();

	// Fetch arguments to run functions 
	const args = process.argv.slice(2);

	// Address from deployed Token contract
	const tokenContract = "0xc09B35aE268db3c956f6e03CCE536fE0a29b59eF"; // TESSSTTTTTEEEEEE
	//const tokenContract = "0x9805944Da4F69978dffc4c02eA924911D668d81a";

	// Block number (timestamp) to consider existing voting power
	const targetBlockNumber = 45165; // UPDAAATEEEEEEEEEEEE

	// Deploy the contract with Proposals passed as input arguments
	async function deployContract(propos: string[]) {
		const proposals = process.argv.slice(3);
		console.log("Deploying TokenizedBallot contract");
		console.log("Proposals: ");
		proposals.forEach((element, index) => {
			console.log(`Proposal N. ${index + 1}: ${element}`);
		});
		const tokenizedBallotContract = await tokenizedBallotFactory.deploy(proposals.map(ethers.encodeBytes32String), tokenContract, targetBlockNumber);
		await tokenizedBallotContract.waitForDeployment();
		const address = await tokenizedBallotContract.getAddress();
		console.log(`Contract deployed at address ${address}`);
		for (let index = 0; index < proposals.length; index++) {
			const proposal = await tokenizedBallotContract.proposals(index);
			const name = ethers.decodeBytes32String(proposal.name);
			console.log({ index, name, proposal });
		};
	};

	// Contract address, change to contract address
	const contractAddress = "0x6E08F69f938c9478eD6701A55F95959421519527";

	// Connect to deployed contract
	const tokenizedBallotContract = tokenizedBallotFactory.attach(contractAddress) as TokenizedBallot;

	// Filter wich function to be called
	if (args[0] == "deploy") {
		deployContract(args);
	} else if (args[0] == "vote") {
		vote(parseInt(args[1]), ethers.parseUnits(args[2]));
	} else if (args[0] == "winningProposal") {
		winningProposal();
	} else if (args[0] == "winnerName") {
		winnerName();
	}

	// 'vote' function, choose the index
	async function vote(proposalNumber: number,  amount: bigint) {
		//const proposalNumber = 0;
		const _vote = await tokenizedBallotContract.vote(proposalNumber - 1, amount);
		const votedProposal = await tokenizedBallotContract.proposals(proposalNumber - 1)
		console.log(`Vote for proposal ${proposalNumber}:`, `"${decodeBytes32String(votedProposal.name)}"`, "submited");
		console.log("Tx hash:", _vote.hash);
	};

	// 'winningProposal' function
	async function winningProposal() {
		const _winningProposal = await tokenizedBallotContract.winningProposal();
		console.log("The winning proposal number is:", toNumber(_winningProposal) + 1);
	};

	// 'winnerName' function
	async function winnerName() {
		const _winnerName = await tokenizedBallotContract.winnerName();
		console.log("The winning proposal name is", `"${decodeBytes32String(_winnerName)}"`);
	};

}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});