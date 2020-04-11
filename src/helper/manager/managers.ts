import { App } from '../../app';
import { MySQL } from '../mysql';

import { UserManager } from './user';
import { UserSessionManager } from './session';

import { MessageManager } from './message';
import { ChannelManager } from './channel';

export class APIManagers {
	private static instance: APIManagers;
	public static getInstance(): APIManagers {
		if(!this.instance) this.instance = new APIManagers();
		return this.instance;
	}

	private userManager: UserManager;
	private userSessionManager: UserSessionManager;

	private messageManager: MessageManager;
	private channelManager: ChannelManager;

	private constructor() {
		const mysql: MySQL = App.getInstance().getMySQL();

		this.userManager = new UserManager(mysql);
		this.userSessionManager = new UserSessionManager(mysql);

		this.messageManager = new MessageManager(mysql);
		this.channelManager = new ChannelManager(mysql);
	}

	get user(): UserManager {
		return this.userManager;
	}

	get userSession(): UserSessionManager {
		return this.userSessionManager;
	}
	
	get message(): MessageManager {
		return this.messageManager;
	}

	get channel(): ChannelManager {
		return this.channelManager;
	}
}