import { inject, injectable } from 'inversify';
import { User } from './user.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './users.service.interface';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.interface';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}
	async createUser(dto: UserRegisterDto): Promise<User | null> {
		const { email, name, password } = dto;
		const newUser = new User(email, name);
		const salt = this.configService.get<number>('SALT');
		await newUser.setPassword(password, Number(salt));

		return null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
