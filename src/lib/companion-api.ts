class CompanionApi {
	private ENDPOINT = "http://192.168.50.244:8000/api";

	async callButton(page: number, row: number, column: number) {
		try {
			await fetch(`${this.ENDPOINT}/location/${page}/${row}/${column}/press`, {
				method: "POST",
			});
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async RunMatchEndSequence() {
		await this.callButton(11, 3, 5);
	}
}

export const Companion = new CompanionApi();
