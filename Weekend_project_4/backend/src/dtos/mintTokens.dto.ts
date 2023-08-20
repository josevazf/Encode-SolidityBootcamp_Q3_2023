import { ApiProperty } from "@nestjs/swagger";

export class MintTokensDto {
	@ApiProperty({type: String, default: 'My address', required: true})
	address: string;
}