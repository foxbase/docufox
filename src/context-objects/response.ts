export class ResponseCO {
	constructor(
		private statusCode: string,
		private response: object,
	) {}

	toString() {
		return `Response:\n\n${this.statusCode}\n\n${this.response}`;
	}
}
