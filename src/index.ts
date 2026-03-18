#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { env, loadEnvFile } from "node:process";
import { dereference, parse } from "@readme/openapi-parser";
import OpenAI from "openai";
import type { JSONSchema } from "openai/lib/jsonschema.js";
import type { OpenAPI } from "openapi-types";
import { stringify } from "yaml";
import { generateExamples, generateText } from "./ai.js";
import config from "./config.js";
import {
	ApiCO,
	EndpointCO,
	ParameterCO,
	ParameterContentCO,
	RequestBodyContentCO,
	ResponseCO,
	ResponseContentCO,
} from "./context-objects/index.js";

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

const originalApi = await parse<DocuFoxApiDocument>(config.inputFile);
const dereferencedApi = await dereference(originalApi, {
	dereference: { circular: "ignore" },
});
if (!dereferencedApi.paths) {
	throw new Error(`${config.inputFile} does not contain any paths.`);
}

let enrichedApi: DocuFoxApiDocument | null = null;
if (existsSync(config.outputFile)) {
	enrichedApi = await parse<DocuFoxApiDocument>(config.outputFile);
}

if (existsSync(".env")) {
	loadEnvFile(".env");
}

const apiKey = env.DOCUFOX_API_KEY?.trim();
if (!apiKey) {
	throw new Error(`DOCUFOX_API_KEY environment variable is missing.`);
}

const client = new OpenAI({ baseURL: config.apiUrl, apiKey });
const apiCO = new ApiCO(originalApi);

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

		if (operation.parameters) {
			for (const parameter of operation.parameters) {
				if ("$ref" in parameter) continue;

				const parameterCO = new ParameterCO(parameter);

				parameter.description = await generateText(
					"parameter-description",
					parameter.description,
					[apiCO, endpointCO, parameterCO],
					client,
				);

				if (parameter.schema) {
					const newExamples = await generateExamples(
						"parameter-examples",
						parameter.schema as JSONSchema,
						[apiCO, endpointCO, parameterCO],
						client,
					);

					parameter.examples = Object.assign(
						parameter.examples ?? {},
						newExamples,
					);
					parameter.example = undefined;
					if ("example" in parameter.schema) {
						parameter.schema.example = undefined;
					}
				} else if (parameter.content) {
					for (const mediaType of Object.keys(parameter.content)) {
						const content = parameter.content[mediaType];
						if (!content?.schema) continue;

						const contentCO = new ParameterContentCO(mediaType, content);

						const newExamples = await generateExamples(
							"parameter-content-examples",
							content.schema as JSONSchema,
							[apiCO, endpointCO, contentCO],
							client,
						);

						content.examples = Object.assign(
							content.examples ?? {},
							newExamples,
						);

						content.example = undefined;
						if ("example" in content.schema) {
							content.schema.example = undefined;
						}
					}
				}
			}
		}

		if ("requestBody" in operation && !("$ref" in operation.requestBody)) {
			operation.requestBody.description = await generateText(
				"request-body-description",
				operation.requestBody.description,
				[apiCO, endpointCO],
				client,
			);

			if (operation.requestBody.content) {
				for (const mediaType of Object.keys(operation.requestBody.content)) {
					const content = operation.requestBody.content[mediaType];
					if (!content?.schema) continue;

					const contentCO = new RequestBodyContentCO(mediaType, content);

					const newExamples = await generateExamples(
						"request-body-content-examples",
						content.schema as JSONSchema,
						[apiCO, endpointCO, contentCO],
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
						"response-content-examples",
						content.schema as JSONSchema,
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
			config.outputFile,
			stringify(dereferencedApi, {
				lineWidth: 0,
				aliasDuplicateObjects: false,
			}),
		);
	}
}
