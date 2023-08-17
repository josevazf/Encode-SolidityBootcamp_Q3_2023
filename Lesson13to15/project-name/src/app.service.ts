import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/G6Token.json';
import * as dotenv from 'dotenv';
dotenv.config();
// Service should carry out the work

const TOKEN_ADDRESS = '0x9805944Da4F69978dffc4c02eA924911D668d81a';

@Injectable()
export class AppService {
	provider: ethers.Provider;
	wallet: ethers.Wallet;
	contract: ethers.Contract;

	constructor() {
		this.provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL ?? '',);
		this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', this.provider)
		this.contract = new ethers.Contract(
			TOKEN_ADDRESS, tokenJson.abi, this.wallet);
	}

  getHello(): string {
    return 'Hello World!!!!';
  }

  getOtherThing(): string {
    return 'Other Thing yooo!';
  }

  getTokenAddress(): string {
		return TOKEN_ADDRESS;
  }

  getTotalSupply(): Promise <bigint> {
		return this.contract.totalSupply();
  }

  getTokenBalance(address: string): Promise <bigint> {
		return this.contract.balanceOf(address);
  }

	getVotes(address: string): Promise <bigint> {
		return this.contract.getVotes(address);
  }
}
