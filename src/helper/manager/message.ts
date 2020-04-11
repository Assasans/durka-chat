import * as Bluebird from 'bluebird';
import * as chalk from 'chalk';
import * as _ from 'lodash';

import { DateTime } from 'luxon';
import { oneLine } from 'common-tags';
import { RowDataPacket, QueryError, OkPacket } from 'mysql2';

import { Manager } from './manager';
import { Snowflake } from '../snowflake';
import { UserMessageInfo } from '../../models/message/user';

import Logger from '../logger';

export class MessageManager extends Manager {
	public async fetch(userId: number): Promise<UserMessageInfo | null> {
		return new Bluebird(async (resolve, reject) => {
			this.db.select('SELECT * FROM messages WHERE id = ?', [
				userId
			]).then(([row]: RowDataPacket[]) => {
				if(!row) return resolve(null);

				const message: UserMessageInfo = UserMessageInfo.fromRow(row);

				Logger.mysql.trace(`Fetched message ${chalk.blueBright.bold(userId)}:`);
				Logger.mysql.trace(` Message ID: ${chalk.blueBright(message.id)}`);
				Logger.mysql.trace(` User ID: ${chalk.blueBright(message.user)}`);
				Logger.mysql.trace(` Channel ID: ${chalk.blueBright(message.channel)}`);
				Logger.mysql.trace(` Time: ${chalk.blueBright(DateTime.fromSeconds(message.time).toFormat('dd/MM/yyyy HH:mm:ss'))}`);
				Logger.mysql.trace(` Content: '${chalk.blueBright(message.content)}'`);

				return resolve(message);
			}).catch((error: QueryError) => {
				return reject(error);
			});
		});
	}

	public async all(): Promise<UserMessageInfo[]> {
		return new Bluebird((resolve, reject) => {
			this.db.select('SELECT * FROM messages').then((rows: RowDataPacket[]) => {
				const messages: UserMessageInfo[] = _.map(rows, (row: RowDataPacket) => {
					const message: UserMessageInfo = UserMessageInfo.fromRow(row);
	
					Logger.mysql.trace(`Fetched message:`);
					Logger.mysql.trace(` Message ID: ${chalk.blueBright(message.id)}`);
					Logger.mysql.trace(` User ID: ${chalk.blueBright(message.user)}`);
					Logger.mysql.trace(` Channel ID: ${chalk.blueBright(message.channel)}`);
					Logger.mysql.trace(` Time: ${chalk.blueBright(DateTime.fromSeconds(message.time).toFormat('dd/MM/yyyy HH:mm:ss'))}`);
					Logger.mysql.trace(` Content: '${chalk.blueBright(message.content)}'`);

					return message;
				});

				return resolve(messages);
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				return reject(error);
			});
		});
	}

	public async byUser(userId: Snowflake): Promise<UserMessageInfo[]> {
		return new Bluebird((resolve, reject) => {
			this.db.select('SELECT * FROM messages WHERE user = ?', [
				userId
			]).then((rows: RowDataPacket[]) => {
				const messages: UserMessageInfo[] = _.map(rows, (row: RowDataPacket) => {
					const message: UserMessageInfo = UserMessageInfo.fromRow(row);
	
					Logger.mysql.trace(`Fetched message by user ID '${chalk.blueBright.bold(userId)}':`);
					Logger.mysql.trace(` Message ID: ${chalk.blueBright(message.id)}`);
					Logger.mysql.trace(` User ID: ${chalk.blueBright(message.user)}`);
					Logger.mysql.trace(` Channel ID: ${chalk.blueBright(message.channel)}`);
					Logger.mysql.trace(` Time: ${chalk.blueBright(DateTime.fromSeconds(message.time).toFormat('dd/MM/yyyy HH:mm:ss'))}`);
					Logger.mysql.trace(` Content: '${chalk.blueBright(message.content)}'`);

					return message;
				});

				return resolve(messages);
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				return reject(error);
			});
		});
	}

	public async create(message: UserMessageInfo): Promise<OkPacket> {
		return new Bluebird((resolve, reject) => {
			this.db.insert(oneLine`
				INSERT INTO messages
				(id, user, channel, time, content)
				VALUES (?, ?, ?, ?, ?)
			`, [
				message.id,
				message.user,
				message.channel,
				message.time,
				message.content
			]).then((result: OkPacket) => {
				Logger.mysql.trace(`Created message ${chalk.blueBright.bold(message.id)}:`);
				Logger.mysql.trace(` Message ID: ${chalk.blueBright(message.id)}`);
				Logger.mysql.trace(` User ID: ${chalk.blueBright(message.user)}`);
				Logger.mysql.trace(` Channel ID: ${chalk.blueBright(message.channel)}`);
				Logger.mysql.trace(` Time: ${chalk.blueBright(DateTime.fromSeconds(message.time).toFormat('dd/MM/yyyy HH:mm:ss'))}`);
				Logger.mysql.trace(` Content: '${chalk.blueBright(message.content)}'`);

				return result;
			}).catch((error: QueryError) => {
				return reject(error);
			});
		});
	}

	public async update(message: UserMessageInfo): Promise<OkPacket> {
		return new Bluebird((resolve, reject) => {
			this.db.insert(oneLine`
				UPDATE messages
				SET user = ?, channel = ?, time = ?, content = ?
				WHERE id = ?
			`, [
				message.user,
				message.channel,
				message.time,
				message.content,

				message.id
			]).then((result: OkPacket) => {
				Logger.mysql.trace(`Updated message ${chalk.blueBright.bold(message.id)}:`);
				Logger.mysql.trace(` Message ID: ${chalk.blueBright(message.id)}`);
				Logger.mysql.trace(` User ID: ${chalk.blueBright(message.user)}`);
				Logger.mysql.trace(` Channel ID: ${chalk.blueBright(message.channel)}`);
				Logger.mysql.trace(` Time: ${chalk.blueBright(DateTime.fromSeconds(message.time).toFormat('dd/MM/yyyy HH:mm:ss'))}`);
				Logger.mysql.trace(` Content: '${chalk.blueBright(message.content)}'`);

				return result;
			}).catch((error: QueryError) => {
				return reject(error);
			});
		});
	}
}