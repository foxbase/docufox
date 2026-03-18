export class ResponseCO {
	constructor(
		private statusCode: string,
		private response: object,
	) {}

	toString() {
		const stringifiedResponse = JSON.stringify(this.response);
		return `Response:\n\n${this.statusCode}\n\n${stringifiedResponse}`;
	}
}
