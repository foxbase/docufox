export class ApiCO {
	constructor(private api: object) {}

	toString() {
		return `OpenAPI specification:\n\n${this.api}`;
	}
}
