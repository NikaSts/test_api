import { Response, Request, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errrors/http-error.class";
import { LoggerService } from "../logger/logger.service";

export class UserController extends BaseController {
	constructor(logger: LoggerService) {
		super(logger);
		this.bindRouts([{
			path: '/register', method: 'post', func: this.register
		}, {
			path: '/login', method: 'post', func: this.login
		}])
	}

	login(req: Request, res: Response, next: NextFunction) {
		// this.ok(res, 'user logged in');
		next(new HTTPError(401, 'login error'))
	}

	register(req: Request, res: Response, next: NextFunction) {
		this.ok(res, 'user registered');
	}
}
