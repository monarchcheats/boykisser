import * as fs from "fs";

export class Logger {
	/*
	 * Convert regular number/string to ANSI encoded colour
	 */
	static ansi(code) {
		return `\x1b[${code}m`;
	}

	/*
	 * Convert any RGB value to ANSI encoded colour
	 */
	static ansiRGB(r, g, b) {
		return `\x1b[38;2;${r};${g};${b}m`;
	}

	/*
	 * Strips all ANSI colour codes from a string
	 */
	static ansiStrip(string) {
		return string.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');	
	}
	/*
	 * Consistency class - ported from colorama (Python)
	 */
	static Fore = class {
		static BLACK = Logger.ansi(30);
		static RED = Logger.ansi(31);
		static GREEN = Logger.ansi(32);
		static YELLOW = Logger.ansi(33);
		static BLUE = Logger.ansi(34);
		static MAGENTA = Logger.ansi(35);
		static CYAN = Logger.ansi(36);
		static WHITE = Logger.ansi(37);
		static RESET = Logger.ansi(39);

		/* These are fairly well supported, but not part of the standard. */
		static LIGHTBLACK_EX = Logger.ansi(90);
		static LIGHTRED_EX = Logger.ansi(91);
		static LIGHTGREEN_EX = Logger.ansi(92);
		static LIGHTYELLOW_EX = Logger.ansi(93);
		static LIGHTBLUE_EX = Logger.ansi(94);
		static LIGHTMAGENTA_EX = Logger.ansi(95);
		static LIGHTCYAN_EX = Logger.ansi(96);
		static LIGHTWHITE_EX = Logger.ansi(97);
	}

	/*
	 * Consistency class - ported from colorama (Python)
	 */
	static Style = class {
		static RESET_ALL = Logger.ansi(0);
	}

	static clamp(num, min, max) {
		return Math.min(Math.max(num, min), max);
	}

	static gradientHorizontal(string, sr, sg, sb, er, eg, eb) {
		const rDiff = sr - er;
		const gDiff = sg - eg;
		const bDiff = sb - eb;

		const strLength = string.length;

		let result = "";
		for (let i = 0; i < strLength; i++) {
			if (i === 0) {
				result += Logger.ansiRGB(sr, sg, sb);
			} else if (i === strLength - 1) {
				result += Logger.ansiRGB(er, eg, eb);
			} else {
				const percentage = i / strLength;
				const rCur = Logger.clamp(Math.floor(sr - (percentage * rDiff)), 0, 255);
				const gCur = Logger.clamp(Math.floor(sg - (percentage * gDiff)), 0, 255);
				const bCur = Logger.clamp(Math.floor(sb - (percentage * bDiff)), 0, 255);

				result += Logger.ansiRGB(rCur, gCur, bCur);
			}

			result += string.charAt(i);
		}

		return result + Logger.Fore.RESET;
	}

	static gradientVertical(string, sr, sg, sb, er, eg, eb) {
		const rDiff = sr - er;
		const gDiff = sg - eg;
		const bDiff = sb - eb;

		const lines = string.split("\n");
		const strHeight = lines.length;

		let result = "";
		for (let i = 0; i < strHeight; i++) {
			if (i === 0) {
				result += Logger.ansiRGB(sr, sg, sb);
			} else if (i === strHeight - 1) {
				result += Logger.ansiRGB(er, eg, eb);
			} else {
				const percentage = i / strHeight;
				const rCur = Logger.clamp(Math.floor(sr - (percentage * rDiff)), 0, 255);
				const gCur = Logger.clamp(Math.floor(sg - (percentage * gDiff)), 0, 255);
				const bCur = Logger.clamp(Math.floor(sb - (percentage * bDiff)), 0, 255);

				result += Logger.ansiRGB(rCur, gCur, bCur);
			}

			result += lines[i] + "\n";
		}

		return result + Logger.Fore.RESET;
	}

	static banner(string, r, g, b) {
		let topBottomLine = "══";
		for (let i = 0; i < string.length; i++) {
			topBottomLine += "═";
		}
	
		console.log(`${Logger.ansiRGB(r, g, b)}╔${topBottomLine}╗${Logger.Fore.RESET}`);
		console.log(`${Logger.ansiRGB(r, g, b)}║ ${string} ║${Logger.Fore.RESET}`);
		console.log(`${Logger.ansiRGB(r, g, b)}╚${topBottomLine}╝\n${Logger.Fore.RESET}`);
	}
	
	static fileWriteOrAppend(file, data) {
		if (!fs.existsSync(file)) {
			fs.writeFile(file, data, (err) => {
				if (err) {
					const date = new Date();
					let full = `${Logger.Fore.LIGHTBLACK_EX}[${date.today()} ${date.timeNow()}] `
						+ `${Logger.Fore.RED}[ERROR/FileWrite] ${Logger.Fore.WHITE}${err}`;
					console.log(full);
				}
			});
		} else {
			fs.appendFile(file, data, (err) => {
				if (err) {
					const date = new Date();
					let full = `${Logger.Fore.LIGHTBLACK_EX}[${date.today()} ${date.timeNow()}] `
						+ `${Logger.Fore.RED}[ERROR/FileWrite] ${Logger.Fore.WHITE}${err}`;
					console.log(full);
				}
			});
		}
	}
	
	static trail(num) {
		let result = `${num}`;
		while (result.length < 2) {
			result = `0${result}`;
		}
	
		return result;
	}

	static today(date) {
		return `${Logger.trail(date.getDate())}/${Logger.trail(date.getMonth() + 1)}/${date.getFullYear()}`;
	}
	
	static timeNow(date) {
		return `${Logger.trail(date.getHours())}:${Logger.trail(date.getMinutes())}:${Logger.trail(date.getSeconds())}`;
	}
	
	static log(type, cat, message) {
		const date = new Date();
		let typeColour = Logger.Fore.LIGHTBLACK_EX;
		switch (type.toLowerCase()) {
			case "info":
				typeColour = Logger.ansiRGB(97, 56, 232);
				break;
			case "warning":
				typeColour = Logger.Fore.YELLOW;
				break;
			case "error":
				typeColour = Logger.Fore.RED;
				break;
		}
		let full = `${Logger.Fore.LIGHTBLACK_EX}[${Logger.today(date)} ${Logger.timeNow(date)}] `
			+ `${typeColour}[${type}/${cat}] ${Logger.Fore.WHITE}${message}`;
		console.log(full);
		Logger.fileWriteOrAppend("log.txt", Logger.ansiStrip(`${full}\n`));
	}
}