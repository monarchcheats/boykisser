import { BaseCommand } from "../BaseCommand.js";
import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

export class Boykisser extends BaseCommand {
	static instance = null;
	static getInstance() {
		return this.instance == null ? (this.instance = new Boykisser()) : this.instance;
	}

	static getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	static async getBoykisser(repo) {
		const maximumBoykissers = await (
			await fetch(`https://cdn.jsdelivr.net/gh/${repo}/max.boykisser`)
		).text();
		const maximumBoykissersInteger = parseInt(maximumBoykissers, 16);

		const selectedBoykisserInteger = Boykisser.getRandomInt(maximumBoykissersInteger);
		const selectedBoykisser = selectedBoykisserInteger.toString(16);

		return `https://cdn.jsdelivr.net/gh/${repo}/img/${selectedBoykisser}.gif`;
	}

	getSlashCommand() {
		return new SlashCommandBuilder().setName("boykisser").setDescription("force random boykisser");
	}

	async exec(interaction) {
		await interaction.reply({ content: await Boykisser.getBoykisser(process.env.REPO) });
	}
}
