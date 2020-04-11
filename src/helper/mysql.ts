import * as mysql from 'mysql2/promise';
import * as Bluebird from 'bluebird';

import { RowDataPacket, FieldPacket, Connection, OkPacket } from 'mysql2/promise';

import { App } from '../app';
import { MySQLConfig } from './config';

import Logger from './logger';

export type ResultPacket = [
	RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[], FieldPacket[]
];

export class MySQL {
	private config: MySQLConfig;
	
	public db: Connection;

	constructor() {
		this.config = App.getInstance().getConfig().mysql;
	}

	public create(): Bluebird<MySQL> {
		return new Bluebird((resolve, reject) => {
			mysql.createConnection({
				host: this.config.host,
				user: this.config.user,
				password: this.config.password,
				database: this.config.database
			}).then((db: Connection) => {
				this.db = db;
				return resolve(this);
			}).catch((error: Error) => {
				return reject(error);
			});
		});
	}

	public async select(query: string, values?: (number | string | boolean)[]): Promise<RowDataPacket[]> {
		try {
			const result: ResultPacket = await this.db.query(query, values);
			return result[0] as RowDataPacket[];
		} catch(error) {
			Logger.mysql.error(error);
			throw error;
		}
	}

	public async insert(query: string, values: (number | string | boolean | null)[]): Promise<OkPacket> {
		try {
			const result: ResultPacket = await this.db.query(query, values);
			return result[0] as OkPacket;
		} catch(error) {
			Logger.mysql.error(error);
			throw error;
		}
	}

	//TODO
	//eslint-disable-next-line sonarjs/no-identical-functions
	public async update(query: string, values: (number | string | boolean | null)[]): Promise<OkPacket> {
		try {
			const result: ResultPacket = await this.db.query(query, values);
			return result[0] as OkPacket;
		} catch(error) {
			Logger.mysql.error(error);
			throw error;
		}
	}
}