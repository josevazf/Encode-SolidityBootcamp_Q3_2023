import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
require('dotenv').config()

async function main() {
/* 	const proposals = process.argv.slice(2);
	console.log("Deploying Ballot contract");
	console.log("Proposals: ");
	proposals.forEach((element, index) => {
		console.log(`Proposal N. ${index + 1}: ${element}`);
	}); */
	const alchemyUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;
	const provider = new ethers.JsonRpcProvider(alchemyUrl);
	const lastBlock = await provider.getBlockNumber();
	console.log(lastBlock);

/* 	const ballotFactory = new Ballot__factory();
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
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});