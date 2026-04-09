import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "dispatch@waydemo.test" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Dispatch123!" })
  @IsString()
  @MinLength(8)
  password!: string;
}
