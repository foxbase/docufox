#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { env, loadEnvFile } from "node:process";
import { dereference, parse } from "@readme/openapi-parser";
import OpenAI from "openai";
import type { OpenAPI } from "openapi-types";
import { stringify } from "yaml";
import { generateExamples, generateText } from "./ai.js";
import { ApiCO } from "./context-objects/api.js";
import { EndpointCO } from "./context-objects/endpoint.js";
import { ResponseCO } from "./context-objects/response.js";
import { ResponseContentCO } from "./context-objects/response-content.js";

type DocuFoxApiDocument = OpenAPI.Document<{ "x-docufox-hash"?: string }>;

const METHODS = [
	"get",
	"post",
	"put",
	"delete",
	"patch",
	"options",
	"head",
] as const;

const originalApi = await parse<DocuFoxApiDocument>("openapi.yaml");
const dereferencedApi = await dereference(originalApi);
if (!dereferencedApi.paths) {
	throw new Error(`openapi.yaml does not contain any paths.`);
}

let enrichedApi: DocuFoxApiDocument | null = null;
if (existsSync("openapi-enriched.yaml")) {
	enrichedApi = await parse<DocuFoxApiDocument>("openapi-enriched.yaml");
}

if (existsSync(".env")) {
	loadEnvFile(".env");
}

const apiKey = env.DOCUFOX_API_KEY?.trim();
if (!apiKey) {
	throw new Error(`DOCUFOX_API_KEY environment variable is missing.`);
}

const client = new OpenAI({ apiKey });
const apiCO = new ApiCO(dereferencedApi);

for (const pathName of Object.keys(dereferencedApi.paths)) {
	const pathValue = dereferencedApi.paths[pathName];
	if (!pathValue) continue;

	for (const method of METHODS) {
		const operation = pathValue[method];
		if (!operation) continue;

		const endpointString = `${method.toUpperCase()} ${pathName}`;

		operation["x-docufox-hash"] = createHash("sha3-256")
			.update(JSON.stringify(operation))
			.digest("hex");

		if (
			operation["x-docufox-hash"] ===
			enrichedApi?.paths?.[pathName]?.[method]?.["x-docufox-hash"]
		) {
			console.log(
				`Skipping endpoint ${endpointString} because it hasn't been changed since the last time.`,
			);
			pathValue[method] = enrichedApi.paths[pathName][method];
			continue;
		}

		console.log(`Enriching endpoint ${endpointString}...`);

		const endpointCO = new EndpointCO(pathName, method, operation);

		const [summary, description] = await Promise.all([
			generateText(
				"endpoint-summary",
				operation.summary,
				[apiCO, endpointCO],
				client,
			),
			generateText(
				"endpoint-description",
				operation.description,
				[apiCO, endpointCO],
				client,
			),
		]);

		operation.summary = summary;
		operation.description = description;

		for (const responseName of Object.keys(operation.responses)) {
			const responseValue = operation.responses[responseName];
			if (!responseValue || "$ref" in responseValue) continue;

			const responseCO = new ResponseCO(responseName, responseValue);

			responseValue.description = await generateText(
				"response-description",
				responseValue.description,
				[apiCO, endpointCO, responseCO],
				client,
			);

			if ("content" in responseValue) {
				for (const mediaType of Object.keys(responseValue.content)) {
					const content = responseValue.content[mediaType];
					if (!content?.schema) continue;

					const contentCO = new ResponseContentCO(mediaType, content);

					const newExamples = await generateExamples(
						"response-content-examples-2",
						[apiCO, endpointCO, responseCO, contentCO],
						client,
					);

					content.examples = Object.assign(content.examples ?? {}, newExamples);

					content.example = undefined;
					if ("example" in content.schema) {
						content.schema.example = undefined;
					}
				}
			}
		}

		// Save after each enriched endpoint
		writeFileSync(
			"openapi-enriched.yaml",
			stringify(dereferencedApi, { lineWidth: 0 }),
		);
	}
}
