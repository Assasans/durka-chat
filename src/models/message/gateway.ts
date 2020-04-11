import { DateTime } from 'luxon';

import { Message } from './message';
import { Channel } from '../channel';
import { Snowflake } from '../../helper/snowflake';

export class GatewayMessage extends Message {
	public content: string;

	public constructor(
		id: Snowflake, time: DateTime, channel: Channel,
		content: string
	) {
		super(id, time, channel);
		this.content = content;
	}

	public toJSON() {
		return {
			action: 'message.gateway',
			id: this.id,
			time: Math.floor(this.time.toSeconds()),
			channel: this.channel,
			content: this.content
		};
	}
}
