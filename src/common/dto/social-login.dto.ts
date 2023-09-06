import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class SocialLoginDto {
	@ApiProperty({ type: String, name: 'token' })
	@IsNotEmpty({ message: 'Social token is required' })
	@IsString()
	@IsDefined()
	@Expose({ name: 'token' })
	token!: string;
}

