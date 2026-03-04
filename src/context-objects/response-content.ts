export class ResponseContentCO {
	constructor(
		private mediaType: string,
		private content: object,
	) {}

	toString() {
		return `Response content:\n\n${this.mediaType}\n\n${this.content}`;
	}
}
