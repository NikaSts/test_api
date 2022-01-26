import { Response, Request, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errrors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserService } from './users.service';
import { TYPES } from '../types';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
	@inject(TYPES.UserService) private userService: UserService;

	constructor(logger: ILogger) {
		super(logger);
		this.bindRouts([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	async register(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(req.body);
		if (!result) {
			return next(new HTTPError(422, 'User already exists'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const isExist = await this.userService.validateUser(req.body);
		if (!isExist) {
			return next(new HTTPError(401, `Authorization error`));
		}
		this.ok(res, { loginSuccess: isExist });
	}
}
