import { User } from '../user';
import { Channel } from '../channel';
import { CommandRegistry } from './registry';

export type CommandArgs = string[];

export abstract class Command {
	public name: string;
	public description: string;

	public aliases: string[];
	
	constructor(info: CommandInfo) {
		const {
			name, description, aliases
		} = info;

		this.name = name;
		this.description = description;

		this.aliases = aliases || [];
	}

	public async hasPermission(registry: CommandRegistry, user: User, channel: Channel): Promise<boolean> {
		return true;
	}
	public abstract async run(registry: CommandRegistry, user: User, channel: Channel, args: CommandArgs): Promise<boolean>;
}

export interface CommandInfo {
	name: string;
	description: string;

	aliases?: string[];
}
