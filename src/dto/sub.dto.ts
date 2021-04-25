import { IsNotEmpty, IsString } from "class-validator";

export class createSubDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  public description: string;
}
