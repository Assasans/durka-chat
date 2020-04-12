import Collection from '@discordjs/collection';

import { RowDataPacket } from 'mysql2';

import { Snowflake } from '../helper/snowflake';
import { Message } from './message/message';
import { User } from './user';

export class Channel {
	public id: Snowflake;
	public name: string;
	public topic: string | null;

	public messages: Collection<Snowflake, Message>;
	public typing: Collection<Snowflake, User>;

	public constructor(
		id: Snowflake, name: string, topic: string | null,
		messages: Collection<Snowflake, Message>, typing: Collection<Snowflake, User>
	) {
		this.id = id;
		this.name = name;
		this.topic = topic;

		this.messages = messages;
		this.typing = typing;
	}

	public static deleted(): Channel {
		return new Channel(
			'0',
			'deleted-channel',
			null,
			new Collection<Snowflake, Message>(),
			new Collection<Snowflake, User>()
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
