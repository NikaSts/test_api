import { Response, Request, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { sign } from 'jsonwebtoken';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errrors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './users.service.interface';
import { TYPES } from '../types';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IConfigService } from '../config/config.interface';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UserController extends BaseController implements IUserController {
	@inject(TYPES.UserService) private userService: IUserService;
	@inject(TYPES.ConfigService) private configService: IConfigService;

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
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
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

		const secret = this.configService.get<string>('SECRET');
		const jwt = await this.signJWT(req.body.email, secret);
		this.ok(res, { loginSuccess: isExist, token: jwt });
	}

	async info(req: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(req.user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					} else {
						resolve(token as string);
					}
				},
			);
		});
	}
}
