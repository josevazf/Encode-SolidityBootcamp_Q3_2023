import { ethers } from "hardhat";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
	const bytes32Array = [];
	for (let index = 0; index <array.length; index++) {
		bytes32Array.push(ethers.encodeBytes32String(array[index]));
	}
	return bytes32Array;
}

ethers.getContractFactory("Ballot.sol");

describe("Ballot", async () => {
	describe("when the contract is deployed", async () => {
		it("sets the deployer address as chairperson", async () => {
			const ballotFactory = await ethers.getContractFactory("Ballot");
			const BallotContract = await ballotFactory.deploy(
				convertStringArrayToBytes32(PROPOSALS));
		})
	})
})