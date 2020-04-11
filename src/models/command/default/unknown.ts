import { DateTime } from 'luxon';

import { User } from '../../user';
import { CommandRegistry } from '../registry';
import { SnowflakeUtils } from '../../../helper/snowflake';
import { Command, CommandArgs } from '../command';
import { GatewayMessage } from '../../message/gateway';
import { Channel } from '../../channel';

export class UnknownCommand extends Command {
	constructor() {
		super({
			name: 'unknown',
			description: 'Неизвестная команда'
		});
	}

	public async run(registry: CommandRegistry, user: User, channel: Channel, args: CommandArgs): Promise<boolean> {
		user.socket.send(JSON.stringify(new GatewayMessage(
			SnowflakeUtils.generate(),
			DateTime.local(),
			channel,
			`Неизвестная команда. Напишите <u>${registry.prefix}help</u> для отображения списка команд`
		)));
		return true;
	}
}