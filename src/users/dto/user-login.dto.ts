import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Wrong email format' })
	email: string;

	@IsString({ message: 'No password provided' })
	password: string;
}
