import { IsNotEmpty, IsString } from "class-validator";

export class createPostDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  public body?: string;

  @IsString()
  @IsNotEmpty()
  public sub: string;
}


