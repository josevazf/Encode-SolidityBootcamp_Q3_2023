import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('bets-state')
  betsState(): any {
  return this.appService.betsState();
  }

  @Get('get-token-balance/:address')
  getTokenBalance(@Param('address') address: string): Promise<any> {
	return this.appService.getTokenBalance(address);
  }

}
