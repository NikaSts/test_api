import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Server } from 'http';
import { ExeptionFilter } from './errrors/exeption.filter';
import { ILogger } from './logger/logger.interface';
import { UserController } from './users/users.controller';
import { TYPES } from './types';
import { json } from 'body-parser';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware() {
		this.app.use(json());
	}

	useRoutes() {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters() {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init() {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);

		this.logger.log(`Server on http://localhost:${this.port}`);
	}
}
