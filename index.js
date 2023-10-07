import { REST, Routes } from "discord.js";
import dotenv from "dotenv";

import { Utility } from "./utils/Utility.js";
import { Logger } from "./utils/Logger.js";
import { BoykisserClient } from "./bot/BoykisserClient.js";

dotenv.config();

const botToken = process.env.TOKEN;
const botId = Utility.decodeBase64(botToken.split(`.`)[0]);

const commands = [
	{
		name: `boykisser`,
		description: `force random boykisser`,
	},
];

const rest = new REST({ version: `10` }).setToken(botToken);

try {
	Logger.log(`INFO`, `Startup`, `Started refreshing application (/) commands.`);
	await rest.put(Routes.applicationCommands(botId), { body: commands });
	Logger.log(`INFO`, `Startup`, `Successfully reloaded application (/) commands.`);
} catch (error) {
	Logger.log(`ERROR`, `Startup`, `${error}`);
}

BoykisserClient.start(botToken, process.env.REPO);
