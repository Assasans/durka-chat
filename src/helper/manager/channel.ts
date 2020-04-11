import * as Bluebird from 'bluebird';
import * as chalk from 'chalk';
import * as _ from 'lodash';

import { oneLine } from 'common-tags';
import { RowDataPacket, QueryError, OkPacket } from 'mysql2';

import { Manager } from './manager';
import { Snowflake } from '../snowflake';
import { ChannelInfo } from '../../models/channel';

import Logger from '../logger';

export class ChannelManager extends Manager {
	public async fetch(channelId: Snowflake): Promise<ChannelInfo | null> {
		return new Bluebird(async (resolve, reject) => {
			this.db.select('SELECT * FROM channels WHERE id = ?', [
				channelId
			]).then(([row]: RowDataPacket[]) => {
				if(!row) return resolve(null);

				const channel: ChannelInfo = ChannelInfo.fromRow(row);

				Logger.mysql.trace(`Fetched channel ${chalk.blueBright.bold(channelId)}:`);
				Logger.mysql.trace(` Channel ID: ${chalk.blueBright(channel.id)}`);
				Logger.mysql.trace(` Channel name: '${chalk.blueBright(channel.name)}'`);
				Logger.mysql.trace(` Channel topic: ${channel.topic ? `'${chalk.blueBright(channel.topic)}'` : chalk.blueBright('null')}`);

				return resolve(channel);
			}).catch((error: QueryError) => {
				return reject(error);
			});
		});
	}

	public async byName(name: string): Promise<ChannelInfo[]> {
		return new Bluebird((resolve, reject) => {
			this.db.select('SELECT * FROM channels WHERE BINARY name = ?', [
				name
			]).then((rows: RowDataPacket[]) => {
				const channels: ChannelInfo[] = _.map(rows, (row: RowDataPacket) => {
					const channel: ChannelInfo = ChannelInfo.fromRow(row);

					Logger.mysql.trace(`Fetched channel by name '${chalk.blueBright.bold(name)}':`);
					Logger.mysql.trace(` Channel ID: ${chalk.blueBright(channel.id)}`);
					Logger.mysql.trace(` Channel name: '${chalk.blueBright(channel.name)}'`);
					Logger.mysql.trace(` Channel topic: ${channel.topic ? `'${chalk.blueBright(channel.topic)}'` : chalk.blueBright('null')}`);

					return channel;
				});

				return resolve(channels);
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				return reject(error);
			});
		});
	}

	public async create(channel: ChannelInfo): Promise<OkPacket> {
		return new Bluebird((resolve, reject) => {
			this.db.insert(oneLine`
				INSERT INTO channels
				(id, name, topic)
				VALUES (?, ?, ?)
			`, [
				channel.id,
				channel.name,
				channel.topic
			]).then((result: OkPacket) => {
				Logger.mysql.trace(`Created channel ${chalk.blueBright.bold(channel.id)}:`);
				Logger.mysql.trace(` Channel ID: ${chalk.blueBright(channel.id)}`);
				Logger.mysql.trace(` Channel name: '${chalk.blueBright(channel.name)}'`);
				Logger.mysql.trace(` Channel topic: ${channel.topic ? `'${chalk.blueBright(channel.topic)}'` : chalk.blueBright('null')}`);

				return result;
			}).catch((error: QueryError) => {
				return reject(error);
			});
		});
	}

	public async update(channel: ChannelInfo): Promise<OkPacket> {
		return new Bluebird((resolve, reject) => {
			this.db.insert(oneLine`
				UPDATE channels
				SET name = ?, topic = ?
				WHERE id = ?
			`, [
				channel.name,
				channel.topic,

				channel.id
			]).then((result: OkPacket) => {
				Logger.mysql.trace(`Updated channel ${chalk.blueBright.bold(channel.id)}:`);
				Logger.mysql.trace(` Channel ID: ${chalk.blueBright(channel.id)}`);
				Logger.mysql.trace(` Channel name: '${chalk.blueBright(channel.name)}'`);
				Logger.mysql.trace(` Channel topic: ${channel.topic ? `'${chalk.blueBright(channel.topic)}'` : chalk.blueBright('null')}`);

				return result;
			}).catch((error: QueryError) => {
				return reject(error);
			});
		});
	}
}