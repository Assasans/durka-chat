import { DateTime } from 'luxon';

import { Message } from './message';
import { Channel } from '../channel';
import { Snowflake } from '../../helper/snowflake';

export class GatewayMessage extends Message {
	public content: string;

	public constructor(
		id: Snowflake, time: DateTime, channel: Channel, broadcast: boolean,
		content: string
	) {
		super(id, time, channel, broadcast);
		this.content = content;
	}

	public toJSON() {
		return {
			action: 'message.gateway',
			id: this.id,
			time: Math.floor(this.time.toSeconds()),
			channel: this.channel,
			broadcast: this.broadcast,
			content: this.content
		};
	}
}
