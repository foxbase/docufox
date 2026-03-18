export class ParameterContentCO {
	constructor(
		private mediaType: string,
		private content: object,
	) {}

	toString() {
		const stringifiedContent = JSON.stringify(this.content);
		return `Parameter content:\n\n${this.mediaType}\n\n${stringifiedContent}`;
	}
}
