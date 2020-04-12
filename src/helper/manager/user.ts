import * as Bluebird from 'bluebird';
import * as chalk from 'chalk';
import * as _ from 'lodash';

import { oneLine } from 'common-tags';
import { RowDataPacket, QueryError, OkPacket } from 'mysql2';

import { Manager } from './manager';
import { Snowflake } from '../snowflake';
import { UserProfile } from '../../models/user';

import Logger from '../logger';

export class UserManager extends Manager {
	public async fetch(userId: Snowflake): Promise<UserProfile | null> {
		return new Bluebird(async (resolve, reject) => {
			this.db.select('SELECT * FROM users WHERE id = ?', [
				userId
			]).then(([row]: RowDataPacket[]) => {
				if(!row) return resolve(null);

				const user: UserProfile = UserProfile.fromRow(row);

				/*
				Logger.mysql.trace(`Fetched user ${chalk.blueBright.bold(userId)}:`);
				Logger.mysql.trace(` User ID: ${chalk.blueBright(user.id)}`);
				Logger.mysql.trace(` Username: '${chalk.blueBright(user.username)}'`);
				Logger.mysql.trace(` Discriminator: ${chalk.blueBright(user.discriminator)}`);
				Logger.mysql.trace(` Email: '${chalk.blueBright(user.email)}'`);
				Logger.mysql.trace(` Avatar: ${user.avatar ? `'${chalk.blueBright(user.avatar.hash)}'` : chalk.blueBright('null')}`);
				Logger.mysql.trace(` Bot: ${chalk.blueBright(user.bot ? 'true' : 'false')}`);
				*/

				return resolve(user);
			}).catch((error: QueryError) => {
				return reject(error);
			});
		});
	}

	public async byUsername(username: string): Promise<UserProfile[]> {
		return new Bluebird((resolve, reject) => {
			this.db.select('SELECT * FROM users WHERE BINARY username = ?', [
				username
			]).then((rows: RowDataPacket[]) => {
				const users: UserProfile[] = _.map(rows, (row: RowDataPacket) => {
					const user: UserProfile = UserProfile.fromRow(row);
	
					Logger.mysql.trace(`Fetched user by username '${chalk.blueBright.bold(username)}':`);
					Logger.mysql.trace(` User ID: ${chalk.blueBright(user.id)}`);
					Logger.mysql.trace(` Username: '${chalk.blueBright(user.username)}'`);
					Logger.mysql.trace(` Discriminator: ${chalk.blueBright(user.discriminator)}`);
					Logger.mysql.trace(` Email: '${chalk.blueBright(user.email)}'`);
					Logger.mysql.trace(` Avatar: ${user.avatar ? `'${chalk.blueBright(user.avatar.hash)}'` : chalk.blueBright('null')}`);
					Logger.mysql.trace(` Bot: ${chalk.blueBright(user.bot ? 'true' : 'false')}`);

					return user;
				});

				return resolve(users);
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				return reject(error);
			});
		});
	}

	public async byDiscriminator(discriminator: string): Promise<UserProfile[]> {
		return new Bluebird((resolve, reject) => {
			this.db.select('SELECT * FROM users WHERE discriminator = ?', [
				discriminator
			]).then((rows: RowDataPacket[]) => {
				const users: UserProfile[] = _.map(rows, (row: RowDataPacket) => {
					const user: UserProfile = UserProfile.fromRow(row);
	
					Logger.mysql.trace(`Fetched user by discriminator '${chalk.blueBright.bold(discriminator)}':`);
					Logger.mysql.trace(` User ID: ${chalk.blueBright(user.id)}`);
					Logger.mysql.trace(` Username: '${chalk.blueBright(user.username)}'`);
					Logger.mysql.trace(` Discriminator: ${chalk.blueBright(user.discriminator)}`);
					Logger.mysql.trace(` Email: '${chalk.blueBright(user.email)}'`);
					Logger.mysql.trace(` Avatar: ${user.avatar ? `'${chalk.blueBright(user.avatar.hash)}'` : chalk.blueBright('null')}`);
					Logger.mysql.trace(` Bot: ${chalk.blueBright(user.bot ? 'true' : 'false')}`);

					return user;
				});

				return resolve(users);
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				return reject(error);
			});
		});
	}

	public async create(user: UserProfile): Promise<OkPacket> {
		return new Bluebird((resolve, reject) => {
			this.db.insert(oneLine`
				INSERT INTO users
				(id, username, discriminator, avatar_hash, bot, email, password, administrator)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)
			`, [
				user.id,
				user.username,
				user.discriminator,
				user.avatar ? user.avatar.hash : null,
				user.bot,

				user.email,
				user.password || null,

				user.administrator
			]).then((result: OkPacket) => {
				Logger.mysql.trace(`Created user ${chalk.blueBright.bold(user.id)}:`);
				Logger.mysql.trace(` User ID: ${chalk.blueBright(user.id)}`);
				Logger.mysql.trace(` Username: '${chalk.blueBright(user.username)}'`);
				Logger.mysql.trace(` Discriminator: ${chalk.blueBright(user.discriminator)}`);
				Logger.mysql.trace(` Email: '${chalk.blueBright(user.email)}'`);
				Logger.mysql.trace(` Avatar: ${user.avatar ? `'${chalk.blueBright(user.avatar.hash)}'` : chalk.blueBright('null')}`);
				Logger.mysql.trace(` Bot: ${chalk.blueBright(user.bot ? 'true' : 'false')}`);

				return result;
			}).catch((error: QueryError) => {
				return reject(error);
			});
		});
	}

	public async update(user: UserProfile): Promise<OkPacket> {
		return new Bluebird((resolve, reject) => {
			this.db.insert(oneLine`
				UPDATE users
				SET username = ?, discriminator = ?, avatar_hash = ?, bot = ?,
						email = ?, password = ?, administrator = ?
				WHERE id = ?
			`, [
				user.username,
				user.discriminator,
				user.avatar ? user.avatar.hash : null,

				user.bot,

				user.email,
				user.password || null,

				user.administrator,

				user.id
			]).then((result: OkPacket) => {
				Logger.mysql.trace(`Updated user ${chalk.blueBright.bold(user.id)}:`);
				Logger.mysql.trace(` User ID: ${chalk.blueBright(user.id)}`);
				Logger.mysql.trace(` Username: '${chalk.blueBright(user.username)}'`);
				Logger.mysql.trace(` Discriminator: ${chalk.blueBright(user.discriminator)}`);
				Logger.mysql.trace(` Email: '${chalk.blueBright(user.email)}'`);
				Logger.mysql.trace(` Avatar: ${user.avatar ? `'${chalk.blueBright(user.avatar.hash)}'` : chalk.blueBright('null')}`);
				Logger.mysql.trace(` Bot: ${chalk.blueBright(user.bot ? 'true' : 'false')}`);

				return result;
			}).catch((error: QueryError) => {
				return reject(error);
			});
		});
	}
}