import { DateTime } from 'luxon';

import { User } from '../../user';
import { Channel } from '../../channel';
import { CommandRegistry } from '../registry';
import { SnowflakeUtils } from '../../../helper/snowflake';
import { Command, CommandArgs } from '../command';
import { GatewayMessage } from '../../message/gateway';

export class HelpCommand extends Command {
	constructor() {
		super({
			name: 'help',
			description: 'Показать список доступных команд'
		});
	}

	public async run(registry: CommandRegistry, user: User, channel: Channel, args: CommandArgs): Promise<boolean> {
		user.socket.send(JSON.stringify(new GatewayMessage(
			SnowflakeUtils.generate(),
			DateTime.local(),
			channel,
			`Доступные команды: <ul>${registry.commands.map((command: Command) => {
				return `<li>${registry.prefix}${command.name} - ${command.description}</li>`;
			}).join('\n')}</ul>`
		)));
		return true;
	}
}