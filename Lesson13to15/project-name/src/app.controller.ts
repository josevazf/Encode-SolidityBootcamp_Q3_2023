import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokensDto } from './dtos/mintTokens.dto';

// Controller should not do the work, pass it to service!
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('other-thing')
  getOtherThing(): string {
	return this.appService.getOtherThing();
  }

  @Get('get-address')
  getTokenAddress(): any {
	return this.appService.getTokenAddress();
  }

  @Get('get-total-supply')
  getTotalSupply(): Promise <bigint> {
	return this.appService.getTotalSupply();
  }

  @Get('get-token-balance/:address')
  getTokenBalance(@Param('address') address: string): Promise <bigint> {
	return this.appService.getTokenBalance(address);
  }

  @Get('get-votes/:address')
  getVotes(@Param('address') address: string): Promise <bigint> {
	return this.appService.getVotes(address);
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body: MintTokensDto): Promise<any> {
	return this.appService.mintTokens('');
  }
}
