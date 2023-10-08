import { AddURLButton } from "./commands/AddURLButton.js";
import { Boykisser } from "./commands/Boykisser.js";
import { DiscoMessage } from "./commands/DiscohookMessage.js";

export class Commands {
	static getCommandInstances() {
		return [AddURLButton.getInstance(), Boykisser.getInstance(), DiscoMessage.getInstance()];
	}

	static getCommands() {
		const commandInstances = Commands.getCommandInstances();
		const commands = [];

		for (let cmd = 0; cmd < commandInstances.length; cmd++) {
			commands.push(commandInstances[cmd].getSlashCommand().toJSON());
		}

		return commands;
	}
}
