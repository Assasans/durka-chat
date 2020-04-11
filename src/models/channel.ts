import Collection from '@discordjs/collection';

import { RowDataPacket } from 'mysql2';

import { Snowflake } from '../helper/snowflake';
import { Message } from './message/message';

export class Channel {
	public id: Snowflake;
	public name: string;
	public topic: string | null;

	public messages: Collection<Snowflake, Message>;

	public constructor(
		id: Snowflake, name: string, topic: string | null,
		messages: Collection<Snowflake, Message>
	) {
		this.id = id;
		this.name = name;
		this.topic = topic;

		this.messages = messages;
	}

	public static deleted(): Channel {
		return new Channel(
			'0',
			'deleted-channel',
			null,
			new Collection<Snowflake, Message>()
		)
	}

	public toJSON() {
		return {
			id: this.id,
			name: this.name,
			topic: this.topic
		};
	}
}

export class ChannelInfo {
	public id: Snowflake;
	public name: string;
	public topic: string | null;
	
	public constructor(id: Snowflake, name: string, topic: string | null) {
		this.id = id;
		this.name = name;
		this.topic = topic;
	}

	public static deleted(): ChannelInfo {
		return new ChannelInfo(
			'0',
			'deleted-channel',
			null
		)
	}

	public static fromRow(row: RowDataPacket): ChannelInfo {
		return new ChannelInfo(
			row['id'],
			row['name'],
			row['topic']
		);
	}

	public toJSON() {
		return {
			id: this.id,
			name: this.name,
			topic: this.topic
		};
	}
}
