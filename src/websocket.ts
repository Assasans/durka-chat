import * as WebSocket from 'ws';
import * as chalk from 'chalk';
import * as http from 'http';
import * as _ from 'lodash';

import Collection from '@discordjs/collection';

import { DateTime } from 'luxon';

import { GatewayInfo } from './models/gateway';
import { User, UserProfile } from './models/user';
import { Message } from './models/message/message';
import { APIManagers } from './helper/manager/managers';
import { Channel, ChannelInfo } from './models/channel';
import { GatewayMessage } from './models/message/gateway';
import { CommandRegistry } from './models/command/registry';
import { KickCommand } from './models/command/default/kick';
import { HelpCommand } from './models/command/default/help';
import { Snowflake, SnowflakeUtils } from './helper/snowflake';
import { UnknownCommand } from './models/command/default/unknown';
import { UserMessage, UserMessageInfo } from './models/message/user';
import { SnowflakeCommand } from './models/command/default/snowflake';

import Logger from './helper/logger';

/*export class AdminAddCommand extends Command {
	constructor() {
		super(
			'admin-add',
			'Добавляет права администратора пользователю'
		);
	}

	public async run(registry: CommandRegistry, user: User, args: CommandArgs): Promise<boolean> {
		const targetUser: User | null = registry.gateway.users[Number.parseInt(args[0]) - 1] || null;
		if(targetUser) {
			targetUser.permissions = new UserPermissions(true, true);

			const gatewayMessage: GatewayCustomMessage = new GatewayCustomMessage(
				DateTime.local(),
				`Права администратора были выданы пациенту <b>${user.id}</b>`
			);
			registry.gateway.broadcastAll(JSON.stringify(gatewayMessage));
			registry.gateway.messages.push(gatewayMessage);
		} else {
			const gatewayMessage: GatewayCustomMessage = new GatewayCustomMessage(
				DateTime.local(),
				`Пациент <b>${user.id}</b> не найден.`
			);
			user.socket.send(JSON.stringify(gatewayMessage));
			registry.gateway.messages.push(gatewayMessage);
		}
		return true;
	}
}*/

export class Gateway {
	public server: WebSocket.Server;

	public commandRegistry: CommandRegistry;

	public gatewayInfo: GatewayInfo;

	public users: Collection<Snowflake, User>;
	public messages: Collection<Snowflake, Message>;
	public channels: Collection<Snowflake, Channel>;

	constructor(server: http.Server, path: string) {
		this.server = new WebSocket.Server({
			server: server,
			path: path
		});

		this.commandRegistry = new CommandRegistry(this, '/');
		this.commandRegistry
			.setUnknownCommand(UnknownCommand)
			.registerCommand(HelpCommand)
			.registerCommand(SnowflakeCommand)
			.registerCommand(KickCommand);
			//.registerCommand(AdminAddCommand);

		this.gatewayInfo = new GatewayInfo({
			name: 'Дурка!',
			version: 'development build',
			gatewayBot: {
				username: 'Санитар',
				avatar: '/images/avatars/durka.jpg'
			},
			ui: {
				buttons: {
					gatewayConnect: 'Попасть в дурку',
					gatewayDisconnect: 'Сбежать из дурки',

					sendMessage: 'Сказать',
					sendMessageGateway: 'Сказать от имени санитара'
				}
			}
		});

		this.users = new Collection<Snowflake, User>();
		this.messages = new Collection<Snowflake, Message>();
		this.channels = new Collection<Snowflake, Channel>();
		{
			const channelId: Snowflake = '000000118390607910';
			this.channels.set(channelId, new Channel(
				channelId,
				'general',
				'Основной чат',
				new Collection<Snowflake, Message>(),
				new Collection<Snowflake, User>()
			));
		}
		{
			const channelId: Snowflake = SnowflakeUtils.generate();
			this.channels.set(channelId, new Channel(
				channelId,
				'палата',
				null,
				new Collection<Snowflake, Message>(),
				new Collection<Snowflake, User>()
			));
		}
		{
			const channelId: Snowflake = SnowflakeUtils.generate();
			this.channels.set(channelId, new Channel(
				channelId,
				'дурка',
				'Дурка ебать',
				new Collection<Snowflake, Message>(),
				new Collection<Snowflake, User>()
			));
		}
		{
			const channelId: Snowflake = SnowflakeUtils.generate();
			this.channels.set(channelId, new Channel(
				channelId,
				'your-name',
				'Как тебя зовут?',
				new Collection<Snowflake, Message>(),
				new Collection<Snowflake, User>()
			));
		}
		{
			const channelId: Snowflake = SnowflakeUtils.generate();
			this.channels.set(channelId, new Channel(
				channelId,
				'durka-stable',
				null,
				new Collection<Snowflake, Message>(),
				new Collection<Snowflake, User>()
			));
		}
		{
			const channelId: Snowflake = SnowflakeUtils.generate();
			this.channels.set(channelId, new Channel(
				channelId,
				'official-gateway',
				null,
				new Collection<Snowflake, Message>(),
				new Collection<Snowflake, User>()
			));
		}
		{
			const channelId: Snowflake = SnowflakeUtils.generate();
			this.channels.set(channelId, new Channel(
				channelId,
				'lost-and-found',
				'Channel for unknown messages',
				new Collection<Snowflake, Message>(),
				new Collection<Snowflake, User>()
			));
		}
		{
			for(let i: number = 0; i < 10; i++) {
				const channelId: Snowflake = SnowflakeUtils.generate();
				this.channels.set(channelId, new Channel(
					channelId,
					`overflow-${i + 1}`,
					`Testing channel scrolling (channel ${i + 1})`,
					new Collection<Snowflake, Message>(),
					new Collection<Snowflake, User>()
				));
			}
		}

		APIManagers.getInstance().message.all().then((fetchedMessages: UserMessageInfo[]) => {
			_.each(fetchedMessages, async (fetchedMessage: UserMessageInfo) => {
				const userProfile: UserProfile | null = await APIManagers.getInstance().user.fetch(fetchedMessage.user);
				const channelInfo: ChannelInfo | null = await APIManagers.getInstance().channel.fetch(fetchedMessage.channel);

				if(!userProfile || !channelInfo) return;

				const channel: Channel | null = this.channels.get(channelInfo.id) || null;

				if(!channel) return;

				const message: UserMessage = new UserMessage(
					fetchedMessage.id,
					DateTime.fromSeconds(fetchedMessage.time),
					channel,
					fetchedMessage.broadcast,
					userProfile,
					fetchedMessage.content
				);

				this.messages.set(fetchedMessage.id, message);
			});
		}).catch((error: Error) => {
			Logger.mysql.error(error);
		});

		this.server.on('connection', async (socket: WebSocket, request: http.IncomingMessage) => {
			Logger.websocket.trace(`Connection: ${chalk.blueBright(request.connection.remoteAddress)}`);

			let user: User | null = null;
				
			socket.send(JSON.stringify({
				action: 'gateway.info',
				info: this.gatewayInfo
			}));

			socket.send(JSON.stringify({
				action: 'auth.login.request'
			}))

			socket.on('close', (code: number, reason: string) => {
				Logger.websocket.trace(`Connection ${chalk.blueBright(request.connection.remoteAddress)} closed with code ${chalk.blueBright(code)}`);

				this.channels.forEach((channel: Channel) => {
					if(user) {
						channel.typing.delete(user.id);
					}
				});
				if(user) {
					this.users.delete(user.id);
				}

				this.broadcastAll(JSON.stringify({
					action: 'users.list',
					users: this.users.array()
				}));
			});

			socket.on('message', async (rawData: string) => {
				try {
					const data = JSON.parse(rawData);
					Logger.websocket.trace(`Connection ${chalk.blueBright(request.connection.remoteAddress)}: ${chalk.blueBright(rawData)}`);

					const action = data.action;
					const content: string = data.content;

					if(action === 'auth.login') {
						if(user) return;

						const userId: Snowflake | null = data.user;
						if(!userId) {
							socket.close();
							return;
						}

						const profile: UserProfile | null = await APIManagers.getInstance().user.fetch(userId);

						if(profile) {
							user = new User(
								profile,
								this.messages.filter((message: Message) => {
									return message instanceof UserMessage && message.user.id === userId;
								}),
								socket,
								request.connection.remoteAddress || 'Unknown',
							);
						} else {
							const userId: Snowflake = SnowflakeUtils.generate();
							user = new User(
								UserProfile.guest(),
								this.messages.filter((message: Message) => {
									return message instanceof UserMessage && message.user.id === userId;
								}),
								socket,
								request.connection.remoteAddress || 'Unknown',
							);
						}
						this.users.set(user.id, user);

						socket.send(JSON.stringify({
							action: 'auth.login.response',
							success: true
						}));

						this.updateCache(socket);
					}

					if(!user) return;

					if(action === 'user.state.send.typing') {
						const channel: Channel = this.channels.get(data.channel) || this.channels.find((channel) => channel.name === 'lost-and-found') as Channel;

						if(data.typing) {
							channel.typing.set(user.id, user);
						} else {
							channel.typing.delete(user.id);
						}

						this.channels.each((channel: Channel) => {
							this.broadcastAll(JSON.stringify({
								action: 'users.state.typing',
								channel: channel,
								users: channel.typing.array()
							}));
						});
					}

					if(action === 'message.send') {
						const channel: Channel = this.channels.get(data.channel) || this.channels.find((channel) => channel.name === 'lost-and-found') as Channel;

						if(this.commandRegistry.handleMessage(user, channel, content)) {
							//return;
						}

						const message: UserMessage = new UserMessage(
							SnowflakeUtils.generate(),
							DateTime.local(),
							channel,
							data.broadcast || false,
							user.profile,
							content
						);
						this.broadcastAll(JSON.stringify(message));
						this.messages.set(message.id, message);

						APIManagers.getInstance().message.create(message.toMessageInfo());

						Logger.websocket.trace(`Connection ${chalk.blueBright(request.connection.remoteAddress)} sent message: '${chalk.blueBright(content)}'`);
					}
					if(action === 'message.send.gateway') {
						const channel: Channel = this.channels.get(data.channel) || this.channels.find((channel) => channel.name === 'lost-and-found') as Channel;

						const message: GatewayMessage = new GatewayMessage(
							SnowflakeUtils.generate(),
							DateTime.local(),
							channel,
							data.broadcast || false,
							content
						);
						this.broadcastAll(JSON.stringify(message));
						this.messages.set(message.id, message);

						Logger.websocket.trace(`Connection ${chalk.blueBright(request.connection.remoteAddress)} sent gateway message: '${chalk.blueBright(content)}'`);
					}
				} catch(error) {
					/*socket.send(JSON.stringify(new GatewayMessage(
							SnowflakeUtils.generate(),
							DateTime.local(),
							channel,
							content
						'Invalid JSON!'
					)));*/
				}
			});
		});
	}

	public updateCache(socket: WebSocket): void {
		this.broadcastAll(JSON.stringify({
			action: 'users.list',
			users: this.users.array()
		}));

		socket.send(JSON.stringify({
			action: 'channels.list',
			channels: this.channels.array()
		}));

		socket.send(JSON.stringify({
			action: 'messages.list',
			messages: this.messages.array()
		}));
	}

	public broadcastAll(content: string): void {
		this.users.forEach((user: User) => {
			user.socket.send(content);
		});
	}

	public broadcast(callerUser: User, content: string): void {
		this.users.forEach((user: User) => {
			if(user.id !== callerUser.id) {
				user.socket.send(content);
			}
		});
	}
}

/**
 * TODO Requests from clients must use interfaces
 */
