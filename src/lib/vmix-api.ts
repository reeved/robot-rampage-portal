type List = "input1" | "input2";

class VmixApi {
	private ENDPOINT = "http://192.168.1.100:8088/api/";

	private async ListAdd(input: List, value: string) {
		try {
			const response = await fetch(
				`${this.ENDPOINT}?Function=ListAdd&Input=${input}&Value=${value}`,
			);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	private async ListRemoveAll(input: List) {
		try {
			const response = await fetch(
				`${this.ENDPOINT}?Function=ListRemoveAll&Input=${input}`,
			);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async UpdateListsForMatch(bot1Video?: string, bot2Video?: string) {
		console.log("UPDATING LIST TO", bot1Video, bot2Video);
		// await this.ListRemoveAll("input1");
		// await this.ListRemoveAll("input2");
		// await this.ListAdd("input1", bot1Video);
		// await this.ListAdd("input2", bot2Video);
	}
}

export const Vmix = new VmixApi();
