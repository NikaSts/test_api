import { Response, Request, NextFunction } from "express";
import { injectable } from "inversify";
import "reflect-metadata";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errrors/http-error.class";
import { ILogger } from "../logger/logger.interface";
import { IUserController } from "./users.interface";

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(logger: ILogger) {
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
