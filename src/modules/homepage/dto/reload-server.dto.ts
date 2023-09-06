import { IsValidParticipantUserToRestartServerRule } from 'src/modules/homepage/rules/is-valid-user-to-restart-server.rules';
import { IsDefined, IsNotEmpty, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReloadServerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Validate(IsValidParticipantUserToRestartServerRule)
  password!: string;
}
