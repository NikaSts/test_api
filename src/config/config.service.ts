import { IConfigService } from './config.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error(`Couldn't read file dotenv or it doesn't exist`);
		} else {
			this.logger.log('[ConfigService] Config has been set');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get<T extends string | number>(key: string): T {
		return this.config[key] as T;
	}
}
