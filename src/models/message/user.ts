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
		id: Snowflake, time: DateTime, channel: Channel,
		user: UserProfile, content: string
	) {
		super(id, time, channel);
		this.user = user;
		this.content = content;
	}

	public toMessageInfo(): UserMessageInfo {
		return new UserMessageInfo(
			this.id,
			Math.floor(this.time.toSeconds()),
			this.user.id,
			this.channel.id,
			this.content
		);
	}

	public toJSON() {
		return {
			action: 'message.user',
			id: this.id,
			time: Math.floor(this.time.toSeconds()),
			channel: this.channel,
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

	public content: string;

	public constructor(
		id: Snowflake, time: number,
		user: Snowflake, channel: Snowflake,
		content: string
	) {
		this.id = id;
		this.time = time;

		this.user = user;
		this.channel = channel;

		this.content = content;
	}

	public toJSON() {
		return {
			action: 'message.user',
			id: this.id,
			time: this.time,
			channel: this.channel,
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

			row['content']
		);
	}
}
