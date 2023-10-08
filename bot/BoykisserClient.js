import { Client } from "discord.js";
import { GatewayIntentBits, PermissionFlagsBits } from "discord-api-types/v10";
import { Logger } from "../utils/Logger.js";
import { Boykisser } from "./interactions/commands/Boykisser.js";
import { Commands } from "./interactions/Commands.js";

export class BoykisserClient {
	static start(token, repo) {
		const client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildMessageTyping,
			],
		});

		client.on(`ready`, () => {
			Logger.log(`INFO`, `onReady`, `Logged in as ${client.user.tag}!`);
		});

		client.on(`interactionCreate`, async (interaction) => {
			try {
				if (interaction.isChatInputCommand()) {
					const instances = Commands.getCommandInstances();
					for (let cmd = 0; cmd < instances.length; cmd++) {
						if (instances[cmd].getSlashCommand().toJSON().name === interaction.commandName) {
							if (interaction.guild !== null) {
								Logger.log(
									`INFO`,
									`Commands`,
									`User "${interaction.user.tag}" running command` +
										` "${interaction.commandName}" in "${interaction.guild.name}"` +
										` (${interaction.guild.id}).`
								);
							} else {
								Logger.log(
									`INFO`,
									`Commands`,
									`User "${interaction.user.tag}" running command` +
										` "${interaction.commandName}" in a private channel.`
								);
							}
							await instances[cmd].execInternal(interaction);
						}
					}
				}
			} catch (e) {
				Logger.log(`ERROR`, `onInteractionCreate`, `${e}`);
			}
		});

		client.on(`messageCreate`, async (message) => {
			if (
				(message.content.toLowerCase().includes(`boykisser`) ||
					message.content.toLowerCase().includes(`boy kisser`) ||
					message.content.toLowerCase().includes(`girlkisser`) ||
					message.content.toLowerCase().includes(`girl kisser`) ||
					message.content.toLowerCase().includes(`kissing boys`) ||
					message.content.toLowerCase().includes(`<@${client.user.id}>`)) &&
				message.author.id !== client.user.id
			) {
				Logger.log(`INFO`, `onMessageCreate`, `${message.author.tag} is being a boykisser >~<`);

				const channel = await client.channels.cache.get(message.channelId);
				if (channel?.isTextBased()) {
					Logger.log(`INFO`, `onMessageCreate`, `Sending the boykisser`);
					const boykisser = await Boykisser.getBoykisser(repo);
					await channel.send({ content: boykisser });
				}
			}
		});

		client.login(token).catch((e) => {
			Logger.log(`ERROR`, `onLogin`, `Could not sign into ${token}. Is it valid?`);
			Logger.log(`ERROR`, `onLogin`, `Exception: ${e}`);
		});
	}
}
