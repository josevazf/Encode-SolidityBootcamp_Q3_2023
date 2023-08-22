import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokensDto } from './dtos/mintTokens.dto';
import { BytesLike } from 'ethers';
import { Bytes } from 'web3';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get-address')
  getTokenAddress(): any {
	return this.appService.getTokenAddress();
  }

  @Get('get-total-supply')
  getTotalSupply(): Promise <bigint> {
	return this.appService.getTotalSupply();
  }

  @Get('get-token-balance/:address')
  getTokenBalance(@Param('address') address: string): Promise<any> {
	return this.appService.getTokenBalance(address);
  }

  @Get('get-votes/:address')
  getVotes(@Param('address') address: string): Promise<any> {
	return this.appService.getVotes(address);
  }

	@Get('winner')
  winner(): Promise <BytesLike> {
	return this.appService.winner();
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body: MintTokensDto): Promise<any> {
	return this.appService.mintTokens(body.address);
  }
}
