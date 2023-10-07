import { Client } from "discord.js";
import { GatewayIntentBits } from "discord-api-types/v10";
import { Logger } from "../utils/Logger.js";

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
			if (!interaction.isChatInputCommand()) {
				return;
			}

			if (interaction.commandName === `boykisser`) {
				Logger.log(
					`INFO`,
					`onInteractionCreate`,
					`${interaction.user.tag} is being a boykisser >~<`
				);

				await interaction.reply(BoykisserClient.getBoykisser(repo));
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
					const boykisser = await BoykisserClient.getBoykisser(repo);
					await channel.send({ content: boykisser });
				}
			}
		});

		client.login(token).catch((e) => {
			Logger.log(`ERROR`, `onLogin`, `Could not sign into ${token}. Is it valid?`);
			Logger.log(`ERROR`, `onLogin`, `Exception: ${e}`);
		});
	}

	static getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	static async getBoykisser(repo) {
		const maximumBoykissers = await (
			await fetch(`https://cdn.jsdelivr.net/gh/${repo}/max.boykisser`)
		).text();
		const maximumBoykissersInteger = parseInt(maximumBoykissers, 16);

		const selectedBoykisserInteger = BoykisserClient.getRandomInt(maximumBoykissersInteger);
		const selectedBoykisser = selectedBoykisserInteger.toString(16);

		return `https://cdn.jsdelivr.net/gh/${repo}/img/${selectedBoykisser}.gif`;
	}
}
