import express, { Express } from "express";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Server } from 'http';
import { ExeptionFilter } from "./errrors/exeption.filter";
import { ILogger } from "./logger/logger.interface";
import { UserController } from "./users/users.controller";
import { TYPES } from "./types";

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.Logger) private loggerService: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter
	) {
		this.app = express();
		this.port = 8000;
	}

	useRoutes() {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters() {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init() {
		this.useRoutes();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);

		this.loggerService.log(`Server on http://localhost:${this.port}`);
	}
}
