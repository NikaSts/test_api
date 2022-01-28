import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Server } from 'http';
import { IExeptionFilter } from './errrors/exeption.interface';
import { ILogger } from './logger/logger.interface';
import { IUserController } from './users/users.controller.interface';
import { TYPES } from './types';
import { json } from 'body-parser';
import { IConfigService } from './config/config.interface';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: IUserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware() {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
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
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);

		this.logger.log(`Server on http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
