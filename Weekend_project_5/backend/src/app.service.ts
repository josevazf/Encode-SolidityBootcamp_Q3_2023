import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/LotteryToken.json';
import * as lotteryJson from './assets/Lottery.json';

const TOKEN_ADDRESS = '0x68ad4235Da8f94C80f359fdd31eB063DB6dD92a9';
const LOTTERY_ADDRESS = '0x9e000241a4Ddc82F4CEc47b35541950682b5d1bD';

@Injectable()
export class AppService {
	provider: ethers.Provider;
	wallet: ethers.Wallet;
	tokenContract: ethers.Contract;
	lotteryContract: ethers.Contract;

	constructor() {
		this.provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL ?? '',);
		this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', this.provider)
		this.tokenContract = new ethers.Contract(
			TOKEN_ADDRESS, tokenJson.abi, this.wallet);
		this.lotteryContract = new ethers.Contract(
			LOTTERY_ADDRESS, lotteryJson.abi, this.wallet);
	}

	async betsState(): Promise <boolean> {
		const betsState = await this.lotteryContract.betsOpen();
		return betsState;
  }

	async getTokenBalance(address: string): Promise <any> {
		const balance = await this.tokenContract.balanceOf(address);
		return ethers.formatUnits(balance);
  }


}
