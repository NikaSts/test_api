import { injectable } from 'inversify';
import { User } from './user.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	async createUser(dto: UserRegisterDto): Promise<User | null> {
		const { email, name, password } = dto;
		const newUser = new User(email, name);
		await newUser.setPassword(password);

		return null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
