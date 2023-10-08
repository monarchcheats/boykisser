import { BaseCommand } from "../BaseCommand.js";
import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from "discord.js";
import { Logger } from "../../../utils/Logger.js";
import { ButtonStyle } from "discord-api-types/v10";

export class AddURLButton extends BaseCommand {
	static instance = null;
	static getInstance() {
		return this.instance == null ? (this.instance = new AddURLButton()) : this.instance;
	}

	getSlashCommand() {
		return new SlashCommandBuilder()
			.setName("addurlbtn")
			.setDescription("Adds a URL button to a message (has to be sent by this bot!)")
			.addStringOption((option) =>
				option
					.setName("msg")
					.setDescription("The message link to add the url button to")
					.setRequired(true)
			)
			.addStringOption((option) =>
				option.setName("url").setDescription("The URL").setRequired(true)
			)
			.addStringOption((option) =>
				option.setName("url_text").setDescription("The URL text").setRequired(true)
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
				content: "oops! you have to put the CD in your computer! (no permissions)",
				ephemeral: true,
			});
			return null;
		}

		const ids = interaction.options.getString("msg").match(/\d+/g);
		const guildId = ids[0];
		const channelId = ids[1];
		const messageId = ids[2];

		if (interaction.guild.id !== guildId) {
			await interaction.reply({
				content: "boykisser wont let you do that x)",
				ephemeral: true,
			});
			return null;
		}

		const channels = await interaction.guild.channels.fetch();
		let foundChannel = false;
		let foundMessage = false;

		for (let c = 0; c < channels.size; c++) {
			if (channels.at(c).id === channelId) {
				const messages = await channels.at(c).messages.fetch({ limit: 100 });
				for (let m = 0; m < messages.size; m++) {
					if (messages.at(m).id === messageId) {
						await messages.at(m).edit({
							components: [
								new ActionRowBuilder().addComponents(
									new ButtonBuilder()
										.setURL(interaction.options.getString("url"))
										.setLabel(interaction.options.getString("url_text"))
										.setStyle(ButtonStyle.Link)
								),
							],
						});

						await interaction.reply({
							content: "success! added button.",
							ephemeral: true,
						});

						foundMessage = true;
						break;
					}
				}

				if (!foundMessage) {
					await interaction.reply({
						content: `could not find message with id "${messageId}"`,
						ephemeral: true,
					});
				}

				foundChannel = true;
				break;
			}
		}
		if (!foundChannel) {
			await interaction.reply({
				content: `could not find channel with id "${channelId}"`,
				ephemeral: true,
			});
		}
	}
}
