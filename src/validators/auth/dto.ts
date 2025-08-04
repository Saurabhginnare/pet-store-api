import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}
export class RegisterDTO {
  @IsEmail()
  email: string = '';

  @MinLength(6)
  password: string = '';

  @IsEnum(UserRole, { message: 'Role must be USER or ADMIN' })
  role: UserRole = UserRole.USER as const;
}
export class LoginDTO {
  @IsEmail()
  email: string = '';

  @IsNotEmpty()
  password: string = '';
}
