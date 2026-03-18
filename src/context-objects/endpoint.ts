export class EndpointCO {
	constructor(
		private path: string,
		private method: string,
		private operation: object,
	) {}

	toString() {
		const stringifiedOperation = JSON.stringify(this.operation);
		return `Endpoint:\n\n${this.method.toUpperCase()} ${this.path}\n\n${stringifiedOperation}`;
	}
}
