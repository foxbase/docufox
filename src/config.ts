import { existsSync, readFileSync } from "node:fs";
import { parse } from "yaml";

type Config = {
	inputFile: string;
	outputFile: string;
	apiUrl: string;
	model: string;
	rules: string[];
};

const config: Config = {
	inputFile: "./openapi.yaml",
	outputFile: "./openapi-enriched.yaml",
	apiUrl: "https://api.openai.com/v1",
	model: "gpt-5.4-mini-2026-03-17",
	rules: [],
};

if (existsSync("docufox.yaml")) {
	const configFile = readFileSync("docufox.yaml", "utf-8");
	Object.assign(config, parse(configFile) as Partial<Config>);
}

export default config;
