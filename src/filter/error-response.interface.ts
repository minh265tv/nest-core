import { ApiProperty } from '@nestjs/swagger';

export class IErrorResponse {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}
