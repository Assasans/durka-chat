import * as WebSocket from 'ws';
import * as _ from 'lodash';

import Collection from '@discordjs/collection';

import { RowDataPacket } from 'mysql2';

import { Snowflake } from '../helper/snowflake';
import { Message } from './message/message';

export class UserAvatar {
	public hash: string;
	public animated: boolean;

	public constructor(hash: string, animated: boolean) {
		this.hash = hash;
		this.animated = animated;
	}
}

export const BotType = {
	None: 0,
	Normal: 1,
	Verified: 2,
	Gateway: 3
}

export class UserProfile {
	public id: Snowflake;
	public username: string;
	public discriminator: string;
	public avatar: UserAvatar | null;

	public bot: number;

	public email: string;
	public password: string;

	public administrator: boolean;

	public constructor(
		id: Snowflake, username: string, discriminator: string,
		avatar: UserAvatar | null, bot: number, email: string,
		password: string, administrator: boolean
	) {
		this.id = id;
		this.username = username;
		this.discriminator = discriminator;
		this.avatar = avatar;

		this.bot = bot;

		this.email = email;
		this.password = password;

		this.administrator = administrator;
	}

	public static fromRow(row: RowDataPacket): UserProfile {
		return new UserProfile(
			row['id'],
			row['username'],
			row['discriminator'],
			row['avatar_hash'] !== null ? new UserAvatar(row['avatar_hash'], false) : null,

			_.find(BotType, (value) => value === row['bot']) || BotType.None,

			row['email'],
			row['password'],

			row['administrator']
		);
	}

	public static deleted(): UserProfile {
		return new UserProfile(
			'0',
			'Deleted User',
			'0000',
			null,
			BotType.None,
			'',
			'',
			false
		)
	}

	public static guest(): UserProfile {
		return new UserProfile(
			'1',
			'Guest User',
			'0000',
			null,
			BotType.None,
			'',
			'',
			false
		)
	}

	public toJSON() {
		return {
			id: this.id,
			username: this.username,
			discriminator: this.discriminator,
			avatar: this.avatar,
			bot: this.bot
		};
	}
}

export class User {
	public profile: UserProfile;

	public messages: Collection<Snowflake, Message>;

	public socket: WebSocket;
	public ip: string;

	public constructor(
		profile: UserProfile,
		messages: Collection<Snowflake, Message>,
		socket: WebSocket, ip: string
	) {
		this.profile = profile;

		this.messages = messages;

		this.socket = socket;
		this.ip = ip;
	}

	public get id(): Snowflake {
		return this.profile.id
	}

	public get username(): string {
		return this.profile.username
	}

	public get discriminator(): string {
		return this.profile.discriminator
	}

	public get avatar(): UserAvatar | null {
		return this.profile.avatar
	}

	public get bot(): number {
		return this.profile.bot;
	}

	public disconnect(): void {
		this.socket.close();
	}

	public toJSON() {
		return {
			id: this.profile.id,
			username: this.profile.username,
			discriminator: this.profile.discriminator,
			avatar: this.profile.avatar,
			bot: this.profile.bot
		};
	}
}