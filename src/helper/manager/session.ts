import * as Bluebird from 'bluebird';
import * as chalk from 'chalk';
import * as _ from 'lodash';

import { oneLine } from 'common-tags';
import { RowDataPacket, QueryError, OkPacket } from 'mysql2';

import { Manager } from './manager';

import Logger from '../logger';

export class UserSessionManager extends Manager {
	/*public async fetch(sessionId: number): Promise<Session | null> {
		return new Bluebird(async (resolve, reject) => {
			this.db.select('SELECT * FROM sessions WHERE id = ?', [
				sessionId
			]).then(([row]: RowDataPacket[]) => {
				if(!row) return resolve(null);

				const session: Session = Session.createInstanceRow(row);

				Logger.mysql.trace(`Fetched user session ${chalk.blueBright.bold(sessionId)}:`);
				Logger.mysql.trace(` Session ID: ${chalk.blueBright(session.id)}`);
				Logger.mysql.trace(` User ID: ${chalk.blueBright(session.userId)}`);
				Logger.mysql.trace(` Access token: '${chalk.blueBright(session.accessToken)}'`);
				Logger.mysql.trace(` Refresh token: '${chalk.blueBright(session.refreshToken)}'`);

				return resolve(session);
			}).catch((error: QueryError) => {
				return reject(error);
			});
		});
	}

	public async byUser(userId: number): Promise<Session[]> {
		return new Bluebird((resolve, reject) => {
			this.db.select('SELECT * FROM sessions WHERE user = ?', [
				userId
			]).then((rows: RowDataPacket[]) => {
				const sessions: Session[] = _.map(rows, (row: RowDataPacket) => {
					const session: Session = Session.createInstanceRow(row);
	
					Logger.mysql.trace(`Fetched user session by user ID ${chalk.blueBright.bold(userId)}:`);
					Logger.mysql.trace(` Session ID: ${chalk.blueBright(session.id)}`);
					Logger.mysql.trace(` User ID: ${chalk.blueBright(session.userId)}`);
					Logger.mysql.trace(` Access token: '${chalk.blueBright(session.accessToken)}'`);
					Logger.mysql.trace(` Refresh token: '${chalk.blueBright(session.refreshToken)}'`);

					return session;
				});

				return resolve(sessions);
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				return reject(error);
			});
		});
	}

	public async byAccessToken(accessToken: string): Promise<Session | null> {
		return new Bluebird((resolve, reject) => {
			this.db.select('SELECT * FROM users WHERE BINARY access_token = ?', [
				accessToken
			]).then(([row]: RowDataPacket[]) => {
				if(!row) return resolve(null);

				const session: Session = Session.createInstanceRow(row);

				Logger.mysql.trace(`Fetched user session by access token '${chalk.blueBright.bold(accessToken)}':`);
				Logger.mysql.trace(` Session ID: ${chalk.blueBright(session.id)}`);
				Logger.mysql.trace(` User ID: ${chalk.blueBright(session.userId)}`);
				Logger.mysql.trace(` Access token: '${chalk.blueBright(session.accessToken)}'`);
				Logger.mysql.trace(` Refresh token: '${chalk.blueBright(session.refreshToken)}'`);

				return resolve(session);
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				return reject(error);
			});
		});
	}

	public async byRefreshToken(refreshToken: string): Promise<Session | null> {
		return new Bluebird((resolve, reject) => {
			this.db.select('SELECT * FROM users WHERE BINARY refresh_token = ?', [
				refreshToken
			]).then(([row]: RowDataPacket[]) => {
				if(!row) return resolve(null);

				const session: Session = Session.createInstanceRow(row);

				Logger.mysql.trace(`Fetched user session by refresh token '${chalk.blueBright.bold(refreshToken)}':`);
				Logger.mysql.trace(` Session ID: ${chalk.blueBright(session.id)}`);
				Logger.mysql.trace(` User ID: ${chalk.blueBright(session.userId)}`);
				Logger.mysql.trace(` Access token: '${chalk.blueBright(session.accessToken)}'`);
				Logger.mysql.trace(` Refresh token: '${chalk.blueBright(session.refreshToken)}'`);

				return resolve(session);
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				return reject(error);
			});
		});
	}

	public async create(session: Session): Promise<OkPacket> {
		return new Bluebird((resolve, reject) => {
			this.db.insert(oneLine`
				INSERT INTO sessions
				(id, user, access_token, access_token_expires, refresh_token, refresh_token_expires)
				VALUES (NULL, ?, ?, ?, ?, ?)
			`, [
				session.userId,

				session.accessToken,
				session.accessTokenExpires,

				session.refreshToken,
				session.refreshTokenExpires
			]).then((result: OkPacket) => {
				Logger.mysql.trace(`Created user session '${chalk.blueBright.bold(result.insertId)}':`);
				Logger.mysql.trace(` Session ID: ${chalk.blueBright(result.insertId)}`);
				Logger.mysql.trace(` User ID: ${chalk.blueBright(session.userId)}`);
				Logger.mysql.trace(` Access token: '${chalk.blueBright(session.accessToken)}'`);
				Logger.mysql.trace(` Refresh token: '${chalk.blueBright(session.refreshToken)}'`);

				return result;
			}).catch((error: QueryError) => {
				return reject(error);
			});
		});
	}

	public async update(session: Session): Promise<OkPacket> {
		return new Bluebird((resolve, reject) => {
			this.db.insert(oneLine`
				UPDATE sessions SET
				access_token = ?, refresh_token = ?, access_token_expires = ?, refresh_token_expires = ?
				WHERE id = ?
			`, [
				session.accessToken,
				session.refreshToken,

				session.accessTokenExpires,
				session.refreshTokenExpires,

				session.id,
			]).then((result: OkPacket) => {
				Logger.mysql.trace(`Updated user session '${chalk.blueBright.bold(session.id)}':`);
				Logger.mysql.trace(` Session ID: ${chalk.blueBright(session.id)}`);
				Logger.mysql.trace(` User ID: ${chalk.blueBright(session.userId)}`);
				Logger.mysql.trace(` Access token: '${chalk.blueBright(session.accessToken)}'`);
				Logger.mysql.trace(` Refresh token: '${chalk.blueBright(session.refreshToken)}'`);

				return result;
			}).catch((error: QueryError) => {
				return reject(error);
			});
		});
	}*/
}