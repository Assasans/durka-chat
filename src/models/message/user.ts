import { DateTime } from 'luxon';
import { RowDataPacket } from 'mysql2';

import { UserProfile } from '../user';
import { Message } from './message';
import { Channel } from '../channel';
import { Snowflake } from '../../helper/snowflake';

export class UserMessage extends Message {
	public user: UserProfile;

	public content: string;

	public constructor(
		id: Snowflake, time: DateTime, channel: Channel, broadcast: boolean,
		user: UserProfile, content: string
	) {
		super(id, time, channel, broadcast);
		this.user = user;
		this.content = content;
	}

	public toMessageInfo(): UserMessageInfo {
		return new UserMessageInfo(
			this.id,
			Math.floor(this.time.toSeconds()),
			this.user.id,
			this.channel.id,
			this.broadcast,
			this.content
		);
	}

	public toJSON() {
		return {
			action: 'message.user',
			id: this.id,
			time: Math.floor(this.time.toSeconds()),
			channel: this.channel,
			broadcast: this.broadcast,
			user: this.user,
			content: this.content
		};
	}
}

export class UserMessageInfo {
	public id: Snowflake;
	public time: number;

	public user: Snowflake;

	public channel: Snowflake;
	public broadcast: boolean;

	public content: string;

	public constructor(
		id: Snowflake, time: number,
		user: Snowflake, channel: Snowflake, broadcast: boolean,
		content: string
	) {
		this.id = id;
		this.time = time;

		this.user = user;

		this.channel = channel;
		this.broadcast = broadcast;

		this.content = content;
	}

	public toJSON() {
		return {
			action: 'message.user',
			id: this.id,
			time: this.time,
			channel: this.channel,
			broadcast: this.broadcast,
			user: this.user,
			content: this.content
		};
	}


	public static fromRow(row: RowDataPacket): UserMessageInfo {
		return new UserMessageInfo(
			row['id'],
			row['time'],

			row['user'],

			row['channel'],
			row['broadcast'],

			row['content']
		);
	}
}
