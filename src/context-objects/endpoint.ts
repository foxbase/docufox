export class EndpointCO {
	constructor(
		private path: string,
		private method: string,
		private operation: object,
	) {}

	toString() {
		return `Endpoint:\n\n${this.method.toUpperCase()} ${this.path}\n\n${this.operation}`;
	}
}
