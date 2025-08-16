type List = "BotA" | "BotB" | "Replays";

class VmixApi {
	private ENDPOINT = "http://192.168.50.48:8088/api/";
	private BASEPATH = "C:\\RRMedia\\";
	private REPLAYS_BASEPATH = "R:\\Edits\\";

	private async ListAdd(input: List, value: string) {
		try {
			await fetch(`${this.ENDPOINT}?Function=ListAdd&Input=${input}&Value=${value}`);
			// const data = await response.json();
			// return data;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	private async ListRemoveAll(input: List) {
		try {
			await fetch(`${this.ENDPOINT}?Function=ListRemoveAll&Input=${input}`);

			// const data = await response.json();
			// return data;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async UpdateListsForMatch(bot1Video?: string, bot2Video?: string) {
		const SHOULD_RUN = true;
		if (!SHOULD_RUN) return;

		await this.ListRemoveAll("BotA");
		await this.ListRemoveAll("BotB");
		if (bot1Video) {
			await this.ListAdd("BotA", `${this.BASEPATH}${bot1Video}`);
		}
		if (bot2Video) {
			await this.ListAdd("BotB", `${this.BASEPATH}${bot2Video}`);
		}
	}

	async UpdateReplaysList(fileNames: string[]) {
		const SHOULD_RUN = true;
		if (!SHOULD_RUN) return;

		for (const fileName of fileNames) {
			await this.ListAdd("Replays", `${this.REPLAYS_BASEPATH}${fileName}`);
		}
	}
}

export const Vmix = new VmixApi();
