import * as path from 'path';
import * as fs from 'promise-fs';

export interface WebConfig {
	port: number;
}

export interface GatewayConfig {
	path: string;
}

export interface MySQLConfig {
	host: string;
	user: string;
	password: string;
	database: string;
}

export interface Config {
	web: WebConfig;
	gateway: GatewayConfig;
	mysql: MySQLConfig;
}

export class ConfigHelper {
	public static async getConfig(): Promise<Config> {
		const file: string = path.resolve('config.json');
		const contents: string = await fs.readFile(file, {
			encoding: 'utf8'
		});
		return JSON.parse(contents) as Config;
	}
}
