export class ApiCO {
	constructor(private api: object) {}

	toString() {
		const stringifiedApi = JSON.stringify(this.api);
		return `OpenAPI specification:\n\n${stringifiedApi}`;
	}
}
