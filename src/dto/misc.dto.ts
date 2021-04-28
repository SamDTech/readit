import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
export enum Enum {
  a = 0,
  b = 1,
  c = -1,
}

export class createVoteDto {
  @IsString()
  @IsNotEmpty()
  public identifier: string;

  @IsString()
  @IsNotEmpty()
  public slug: string;

  @IsString()
  @IsOptional()
  public commentIdentifier?: string;

  @IsNumber()
  @IsEnum(Enum)
  public value: number;
}
