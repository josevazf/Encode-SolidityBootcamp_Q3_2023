import { Injectable } from '@nestjs/common';
import { BytesLike, ethers } from 'ethers';
import * as tokenJson from './assets/G6Token.json';
import * as ballotJson from './assets/TokenizedBallot.json';
import * as dotenv from 'dotenv';
dotenv.config();

const TOKEN_ADDRESS = '0x9805944Da4F69978dffc4c02eA924911D668d81a';
const BALLOT_ADDRESS = '0x86194b8C24DB66Ef9ACFA70b4c2fc837F0684961';

@Injectable()
export class AppService {
	provider: ethers.Provider;
	wallet: ethers.Wallet;
	tokenContract: ethers.Contract;
	ballotContract: ethers.Contract;

	constructor() {
		this.provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL ?? '',);
		this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', this.provider)
		this.tokenContract = new ethers.Contract(
			TOKEN_ADDRESS, tokenJson.abi, this.wallet);
		this.ballotContract = new ethers.Contract(
			BALLOT_ADDRESS, ballotJson.abi, this.wallet);
	}

  getTokenAddress(): any {
		return {address: TOKEN_ADDRESS}; // can be anything instead of 'address'
  }

  getTotalSupply(): Promise <bigint> {
		return this.tokenContract.totalSupply();
  }

  async getTokenBalance(address: string): Promise <any> {
		const balance = await this.tokenContract.balanceOf(address);
		return ethers.formatUnits(balance);
  }

	async getVotes(address: string): Promise <any> {
		const votes = await this.tokenContract.getVotes(address);
		return ethers.formatUnits(votes);
  }

	async winner(): Promise <BytesLike> {
		const winner = await this.ballotContract.winnerName();
		return ethers.decodeBytes32String(winner);
  }

  async mintTokens(address: string): Promise <any> {
		console.log("Minting tx to", address);
		const tx = await this.tokenContract.mint(address, ethers.parseUnits("100"));
		const receipt = await tx.wait();
		console.log({receipt});
		return {success: true, txHash: receipt.hash}
	}
}
