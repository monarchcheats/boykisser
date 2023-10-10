import { Logger } from "../../utils/Logger.js";
import dotenv from "dotenv";

dotenv.config();

export class BaseCommand {
	getSlashCommand() {
		throw new Error("BaseCommand#getSlashCommand not implemented.");
	}

	async exec(interaction) {
		throw new Error("BaseCommand#exec not implemented.");
	}

	async execInternal(interaction) {
		try {
			await this.exec(interaction);
		} catch (e) {
			Logger.log(`ERROR`, `bcOnExec`, `Exception: ${e}`);
			try {
				await interaction.reply({
					content: `uhoh! boykisser error: ${e}`,
					ephemeral: true,
				});
			} catch (e2) {
				await interaction.editReply({
					content: `uhoh! boykisser error: ${e}`,
					ephemeral: true,
				});
			}
		}
	}

	isUserServerPrivileged(interaction) {
		if (interaction.guild !== null) {
			if (interaction.member !== null) {
				const developers = process.env.DEVELOPERS.split(",");

				return (
					interaction.memberPermissions.toArray().includes("ManageGuild") ||
					developers.includes(interaction.user.id)
				);
			}
		}

		return false;
	}
}
