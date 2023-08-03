import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { randomInt } from "crypto";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
	const bytes32Array = [];
	for (let index = 0; index < array.length; index++) {
    	bytes32Array.push(ethers.encodeBytes32String(array[index]));
	}
	return bytes32Array;
}

async function deployContract() {
	const ballotFactory = await ethers.getContractFactory("Ballot");
	const ballotContract = await ballotFactory.deploy(
    	convertStringArrayToBytes32(PROPOSALS)
	);
	await ballotContract.waitForDeployment();
	return ballotContract;
}

describe("Ballot", async () => {
	let ballotContract: Ballot;

	beforeEach(async () => {
		ballotContract = await loadFixture(deployContract);
	});

	describe("when the contract is deployed", async () => {
		it("has the provided proposals", async () => {
			for (let index = 0; index < PROPOSALS.length; index++) {
				const proposal = await ballotContract.proposals(index);
				expect(ethers.decodeBytes32String(proposal.name)).to.eq(
				PROPOSALS[index]);
			}
		});
		it("has zero votes for all proposals", async () => {
 			for (let index = 0; index < PROPOSALS.length; index++) {
				const proposal = await ballotContract.proposals(index);
				expect(proposal.voteCount).to.eq(0n);
			}
		});
		it("sets the deployer address as chairperson", async () => {
			const accounts = await ethers.getSigners();
			const chairperson = await ballotContract.chairperson();
			expect(chairperson).to.eq(accounts[0].address);
		});
		it("sets the voting weight for the chairperson as 1", async () => {
			const accounts = await ethers.getSigners();			
			const chairpersonVoter = await ballotContract.voters(accounts[0].address);
			expect(chairpersonVoter.weight).to.eq(1);
		});
	});

	describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
		it("gives right to vote for another address", async () => {
			const accounts = await ethers.getSigners();			
			await ballotContract.connect(accounts[0]).giveRightToVote(accounts[1]);
			const chairpersonVoter = await ballotContract.voters(accounts[1].address);
			expect(chairpersonVoter.weight).to.eq(1);
		});
		it("can not give right to vote for someone that has voted", async () => {
			const accounts = await ethers.getSigners();
			await ballotContract.connect(accounts[0]).giveRightToVote(accounts[1]);
			await ballotContract.connect(accounts[1]).vote(1);
			expect(ballotContract.connect(accounts[0]).giveRightToVote(accounts[1])).to.revertedWith(
				"The voter already voted.");
		});
		it("can not give right to vote for someone that has already voting rights", async () => {
			const accounts = await ethers.getSigners();
			await ballotContract.connect(accounts[0]).giveRightToVote(accounts[1]);
			expect(ballotContract.connect(accounts[0]).giveRightToVote(accounts[1])).to.reverted;
		});
	});

	describe("when the voter interacts with the vote function in the contract", async () => {
		it("should register the vote", async () => {
			const accounts = await ethers.getSigners();
			await ballotContract.connect(accounts[0]).giveRightToVote(accounts[1]);
			await ballotContract.connect(accounts[1]).vote(1);
			const testVoter = await ballotContract.voters(accounts[1].address);
			expect(testVoter.voted).to.eq(true);
		});
	});

	describe("when the voter interacts with the delegate function in the contract", async () => {
		it("should transfer voting power", async () => {
			const accounts = await ethers.getSigners();
			await ballotContract.connect(accounts[0]).giveRightToVote(accounts[1]);
			await ballotContract.connect(accounts[0]).delegate(accounts[1]);
			const delegateFrom = await ballotContract.voters(accounts[0].address);
			expect(delegateFrom.delegate).to.eq(accounts[1].address);
		});
	});

	describe("when an account other than the chairperson interacts with the giveRightToVote function in the contract", async () => {
		it("should revert", async () => {
			const accounts = await ethers.getSigners();
			expect(ballotContract.connect(accounts[1]).giveRightToVote(accounts[2])).to.revertedWith(
				"Only chairperson can give right to vote.");
		});
	});

	describe("when an account without right to vote interacts with the vote function in the contract", async () => {
		it("should revert", async () => {
			const accounts = await ethers.getSigners();
			expect(ballotContract.connect(accounts[1]).vote(1)).to.revertedWith("Has no right to vote");
		});
	});

	describe("when an account without right to vote interacts with the delegate function in the contract", async () => {
		it("should revert", async () => {
			const accounts = await ethers.getSigners();
			expect(ballotContract.connect(accounts[1]).delegate(accounts[2])).to.revertedWith("You have no right to vote");
		});
	});

	describe("when someone interacts with the winningProposal function before any votes are cast", async () => {
		it("should return 0", async () => {
			const accounts = await ethers.getSigners();
			expect(await ballotContract.connect(accounts[0]).winningProposal()).to.eq(0);
		});
	});

	describe("when someone interacts with the winningProposal function after one vote is cast for the first proposal", async () => {
		it("should return 0", async () => {
			const accounts = await ethers.getSigners();
			await ballotContract.connect(accounts[0]).vote(0);
			expect(await ballotContract.connect(accounts[0]).winningProposal()).to.eq(0);
		});
	});

	describe("when someone interacts with the winnerName function before any votes are cast", async () => {
		it("should return name of proposal 0", async () => {
			const accounts = await ethers.getSigners();
			const proposal = await ballotContract.proposals(0);
			const winner = await ballotContract.connect(accounts[0]).winnerName();
			expect(ethers.decodeBytes32String(winner)).to.eq(ethers.decodeBytes32String(proposal.name));
		});
	});

	describe("when someone interacts with the winnerName function after one vote is cast for the first proposal", async () => {
		it("should return name of proposal 0", async () => {
			const accounts = await ethers.getSigners();
			await ballotContract.connect(accounts[0]).vote(0);
			const proposal = await ballotContract.proposals(0);
			const winner = await ballotContract.connect(accounts[0]).winnerName();
			expect(ethers.decodeBytes32String(winner)).to.eq(ethers.decodeBytes32String(proposal.name));
		});
	});

	describe("when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals", async () => {
		it("should return the name of the winner proposal", async () => {
			const accounts = await ethers.getSigners();
			for (let i = 1; i < 6; i++) {
				await ballotContract.connect(accounts[0]).giveRightToVote(accounts[i]);
				await ballotContract.connect(accounts[i]).vote(randomInt(3));
			}
			const proposalNumber = await ballotContract.connect(accounts[0]).winningProposal();
			const proposalName = await ballotContract.connect(accounts[0]).winnerName();
			const proposal = await ballotContract.proposals(proposalNumber);
			expect(ethers.decodeBytes32String(proposalName)).to.eq(ethers.decodeBytes32String(proposal.name));
		});
	});
});