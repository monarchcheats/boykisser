import { BaseCommand } from "../BaseCommand.js";
import { SlashCommandBuilder } from "discord.js";
import { Logger } from "../../../utils/Logger.js";

export class DiscoMessage extends BaseCommand {
	static instance = null;
	static getInstance() {
		return this.instance == null ? (this.instance = new DiscoMessage()) : this.instance;
	}

	getSlashCommand() {
		return new SlashCommandBuilder()
			.setName("discomsg")
			.setDescription("Send a message using the Discohook message format")
			.addStringOption((option) =>
				option
					.setName("json")
					.setDescription(
						"The JSON given by the 'JSON Data Editor' (recommended to put thru JSON minifier, search on google)"
					)
					.setRequired(true)
			);
	}

	async exec(interaction) {
		if (!this.isUserServerPrivileged(interaction)) {
			Logger.log(
				`INFO`,
				`commandExec`,
				`User "${interaction.user.tag}" tried to run "${
					this.getSlashCommand().toJSON().name
				}" but is not privileged to do so. Preventing execution.`
			);
			await interaction.reply({
				content: `oops! you have to put the CD in your computer! (no permissions)`,
				ephemeral: true,
			});
			return null;
		}

		await interaction.channel.send(JSON.parse(interaction.options.getString("json")));
		await interaction.reply({
			content: `message sent.`,
			ephemeral: true,
		});
	}
}
