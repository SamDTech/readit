import { IsString } from "class-validator";

class LoginUserDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;
}


export default LoginUserDto