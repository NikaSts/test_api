import { Router, Response, Request, NextFunction } from 'express';
import { ExpressReturnType } from './route.interface';

export interface IBaseController {
	router: Router;
	send: <T>(res: Response, code: number, message: T) => ExpressReturnType;
	ok: <T>(res: Response, message: T) => ExpressReturnType;
	created: (res: Response) => ExpressReturnType;
}
