import { IsNotEmpty, IsString } from "class-validator";

class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export default LoginUserDto;
