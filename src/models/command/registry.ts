import * as Bluebird from 'bluebird';

import Collection from '@discordjs/collection';

import { User } from '../user';
import { Command } from './command';
import { Channel } from '../channel';
import { Gateway } from '../../websocket';

export type CommandConstructor = {
	new (): Command;
};
export class CommandRegistry {
	public gateway: Gateway;

	public prefix: string;
	public commands: Collection<string, Command>;

	public unknownCommand: Command;

	constructor(gateway: Gateway, prefix: string) {
		this.gateway = gateway;

		this.prefix = prefix;
		this.commands = new Collection<string, Command>();
	}

	public setUnknownCommand(CommandClass: CommandConstructor): CommandRegistry {
		this.unknownCommand = new CommandClass();
		return this;
	}

	public registerCommand(CommandClass: CommandConstructor): CommandRegistry {
		const instance: Command = new CommandClass();

		if(!this.commands.has(instance.name)) {
			this.commands.set(instance.name, instance);
		}
		return this;
	}

	public parseCommand(content: string): Command | false | null {
		if(content.startsWith(this.prefix)) {
			const rawArgs: string[] = content
				.slice(this.prefix.length)
				.split(' ');
			const commandName: string = rawArgs[0];

			const command: Command | null = this.commands.find((command: Command) => {
				return command.name === commandName || command.aliases.includes(commandName);
			}) || null;
			if(!command) return false;
			return command;
		}
		return null;
	}

	public parseArgs(content: string): string[] {
		const rawArgs: string[] = content
			.slice(this.prefix.length)
			.split(' ')
			.slice(1);
		
		return rawArgs;
	}

	public async handleMessage(user: User, channel: Channel, content: string): Promise<boolean> {
		const command: Command | false | null = this.parseCommand(content);
		if(command === null) return false;
		await Bluebird.delay(25);
		if(command === false) {
			if(!this.unknownCommand) return false;
			return await this.unknownCommand.run(this, user, channel, this.parseArgs(content));
		}
		if(!await command.hasPermission(this, user, channel)) return false;
		return await command.run(this, user, channel, this.parseArgs(content));
	}
}