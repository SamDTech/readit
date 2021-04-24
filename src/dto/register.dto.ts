import { IsEmail, IsString, Length } from "class-validator";

class CreateUserDto {
  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  @Length(3)
  public username: string;

  @IsString()
  @Length(5)
  public password: string;
}

export default CreateUserDto;
