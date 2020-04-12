import { DateTime } from 'luxon';

import { User } from '../../user';
import { Channel } from '../../channel';
import { CommandRegistry } from '../registry';
import { SnowflakeUtils } from '../../../helper/snowflake';
import { Command, CommandArgs } from '../command';
import { GatewayMessage } from '../../message/gateway';

export class SnowflakeCommand extends Command {
	constructor() {
		super({
			name: 'snowflake',
			description: 'Сгенерировать Snowflake'
		});
	}

	public async run(registry: CommandRegistry, user: User, channel: Channel, args: CommandArgs): Promise<boolean> {
		user.socket.send(JSON.stringify(new GatewayMessage(
			SnowflakeUtils.generate(),
			DateTime.local(),
			channel,
			false,
			`Snowflake: <b>${SnowflakeUtils.generate()}</b>`
		)));
		return true;
	}
}