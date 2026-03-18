export class RulesCO {
	constructor(private rules: string[]) {}

	toString() {
		if (!this.rules.length) {
			return "";
		}
		return `Rules:\n\n- ${this.rules.join("\n- ")}`;
	}
}
