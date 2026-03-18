export class ParameterCO {
	constructor(private parameter: object) {}

	toString() {
		const stringifiedParameter = JSON.stringify(this.parameter);
		return `Parameter:\n\n${stringifiedParameter}`;
	}
}
