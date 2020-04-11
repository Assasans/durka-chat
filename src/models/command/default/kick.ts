import { DateTime } from 'luxon';

import { User } from '../../user';
import { Channel } from '../../channel';
import { CommandRegistry } from '../registry';
import { Command, CommandArgs } from '../command';
import { GatewayMessage } from '../../message/gateway';
import { SnowflakeUtils } from '../../../helper/snowflake';

export class KickCommand extends Command {
	constructor() {
		super({
			name: 'kick',
			description: 'Отключить пользователя от сервера'
		});
	}

	public async run(registry: CommandRegistry, user: User, channel: Channel, args: CommandArgs): Promise<boolean> {
		const username: string | null = args[0] || null;
		if(!username) {
			user.socket.send(JSON.stringify(new GatewayMessage(
				SnowflakeUtils.generate(),
				DateTime.local(),
				channel,
				`Укажите имя пациента!`
			)));
			return false;
		}

		const targetUser: User | null = registry.gateway.users.find((user: User) => user.username.startsWith(username)) || null;
		if(targetUser) {
			targetUser.disconnect();

			registry.gateway.broadcastAll(JSON.stringify(new GatewayMessage(
				SnowflakeUtils.generate(),
				DateTime.local(),
				channel,
				`Пациент <b>${targetUser.username}#${targetUser.discriminator}</b> отключён от сервера!`
			)));
			return true;
		} else {
			user.socket.send(JSON.stringify(new GatewayMessage(
				SnowflakeUtils.generate(),
				DateTime.local(),
				channel,
				`Пациент <b>${username}</b> не найден!`
			)));
			return false;
		}
	}
}