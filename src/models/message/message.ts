import { DateTime } from 'luxon';

import { Snowflake } from '../../helper/snowflake';
import { Channel } from '../channel';

export abstract class Message {
	public id: Snowflake;
	public time: DateTime;

	public channel: Channel;

	public constructor(
		id: Snowflake, time: DateTime, channel: Channel
	) {
		this.id = id;
		this.time = time;

		this.channel = channel;
	}

	public toJSON() {
		return {
			action: 'message',
			id: this.id,
			time: Math.floor(this.time.toSeconds()),
			channel: this.channel
		};
	}
}
