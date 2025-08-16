class CompanionApi {
	private ENDPOINT = "http://192.168.50.244:8000/api";

	async RunMatchEndSequence() {
		try {
			await fetch(`${this.ENDPOINT}/location/11/3/5/press`, {
				method: "POST",
			});
		} catch (error) {
			console.error(error);
			return null;
		}
	}
}

export const Companion = new CompanionApi();
