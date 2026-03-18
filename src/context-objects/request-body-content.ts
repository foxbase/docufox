export class RequestBodyContentCO {
	constructor(
		private mediaType: string,
		private content: object,
	) {}

	toString() {
		const stringifiedContent = JSON.stringify(this.content);
		return `Request body content:\n\n${this.mediaType}\n\n${stringifiedContent}`;
	}
}
