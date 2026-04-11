import { readFileSync } from "node:fs";
import type OpenAI from "openai";
import type {
	JSONSchema,
	JSONSchemaDefinition,
	JSONSchemaTypeName,
} from "openai/lib/jsonschema.mjs";
import config from "./config.js";
import { RulesCO } from "./context-objects/rules.js";

type Example = {
	summary: string;
	description: string;
	value: object;
};

type ExamplesResponse = {
	examples: [
		{
			name: string;
			summary: string;
			description: string;
			value: object;
		},
	];
};

export async function generateText(
	promptName: string,
	existingText: string | undefined,
	contextObjects: object[],
	client: OpenAI,
): Promise<string> {
	if (existingText?.startsWith("NO_AI")) {
		return existingText.slice(5).trim();
	}

	contextObjects.push(new RulesCO(config.rules));

	const systemPrompt = readFileSync(
		`${import.meta.dirname}/prompts/${promptName}.md`,
		"utf-8",
	);
	const userPrompt = contextObjects.join("\n\n");

	const response = await client.chat.completions.create({
		model: config.model,
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: userPrompt },
		],
	});

	const text = response.choices[0]?.message?.content?.trim();
	if (!text) {
		throw new Error(
			`Received an invalid OpenAI response while generating a text.`,
		);
	}

	return text;
}

export async function generateExamples(
	promptName: string,
	schema: JSONSchema,
	contextObjects: object[],
	client: OpenAI,
): Promise<Record<string, Example>> {
	const strictSchema = strictifySchema(schema);
	if (!strictSchema) {
		return {};
	}

	contextObjects.push(new RulesCO(config.rules));

	const systemPrompt = readFileSync(
		`${import.meta.dirname}/prompts/${promptName}.md`,
		"utf-8",
	);
	const userPrompt = contextObjects.join("\n\n");

	const response = await client.chat.completions.create({
		model: config.model,
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: userPrompt },
		],
		response_format: {
			type: "json_schema",
			json_schema: {
				name: "examples",
				strict: true,
				schema: {
					type: "object",
					properties: {
						examples: {
							type: "array",
							items: {
								type: "object",
								properties: {
									name: { type: "string" },
									summary: { type: "string" },
									description: { type: "string" },
									value: strictSchema,
								},
								required: ["name", "summary", "description", "value"],
								additionalProperties: false,
							},
							minItems: 1,
						},
					},
					required: ["examples"],
					additionalProperties: false,
				},
			},
		},
	});

	const text = response.choices[0]?.message?.content?.trim();
	if (!text) {
		throw new Error(
			`Received an invalid OpenAI response while generating examples.`,
		);
	}

	const json = JSON.parse(text) as ExamplesResponse;

	return json.examples.reduce<Record<string, Example>>((examples, example) => {
		examples[example.name] = {
			summary: example.summary,
			description: example.description,
			value: example.value,
		};
		return examples;
	}, {});
}

function strictifySchema(
	schema: JSONSchemaDefinition,
	parentType?: JSONSchemaTypeName | JSONSchemaTypeName[],
): JSONSchemaDefinition | undefined {
	if (typeof schema !== "object") {
		return schema;
	}

	const strictSchema = { ...schema };

	if ("$ref" in strictSchema) {
		delete strictSchema.$ref;
	}

	if (!strictSchema.type) {
		strictSchema.type = parentType || [
			"string",
			"number",
			"boolean",
			"object",
			"array",
			"null",
		];
	}

	if (strictSchema.anyOf) {
		strictSchema.anyOf = strictSchema.anyOf.reduce<JSONSchemaDefinition[]>(
			(anyOf, anyOfSchema) => {
				const strictAnyOfSchema = strictifySchema(
					anyOfSchema,
					strictSchema.type,
				);
				if (strictAnyOfSchema) {
					anyOf.push(strictAnyOfSchema);
				}
				return anyOf;
			},
			[],
		);

		if (!strictSchema.anyOf.length) {
			delete strictSchema.anyOf;
		}
	}

	if (strictSchema.oneOf) {
		strictSchema.oneOf = strictSchema.oneOf.reduce<JSONSchemaDefinition[]>(
			(oneOf, oneOfSchema) => {
				const strictOneOfSchema = strictifySchema(
					oneOfSchema,
					strictSchema.type,
				);
				if (strictOneOfSchema) {
					oneOf.push(strictOneOfSchema);
				}
				return oneOf;
			},
			[],
		);

		if (!strictSchema.oneOf.length) {
			delete strictSchema.oneOf;
		}
	}

	if (strictSchema.allOf) {
		strictSchema.allOf = strictSchema.allOf.reduce<JSONSchemaDefinition[]>(
			(allOf, allOfSchema) => {
				const strictAllOfSchema = strictifySchema(
					allOfSchema,
					strictSchema.type,
				);
				if (strictAllOfSchema) {
					allOf.push(strictAllOfSchema);
				}
				return allOf;
			},
			[],
		);

		if (!strictSchema.allOf.length) {
			delete strictSchema.allOf;
		}
	}

	if (strictSchema.not) {
		delete strictSchema.not;
	}

	if (strictSchema.type.includes("string")) {
		// Ensure generated example strings do not get too long
		if (!strictSchema.maxLength || strictSchema.maxLength > 100) {
			strictSchema.maxLength = 100;
		}

		// OpenAI rejects patterns that contain \p or \P
		if (
			strictSchema.pattern &&
			(strictSchema.pattern.includes("\\p") ||
				strictSchema.pattern.includes("\\P"))
		) {
			delete strictSchema.pattern;
		}
	}

	if (strictSchema.type.includes("object")) {
		if (strictSchema.properties) {
			strictSchema.properties = Object.entries(strictSchema.properties).reduce<
				Record<string, JSONSchemaDefinition>
			>((properties, [propertyName, propertySchema]) => {
				const strictPropertySchema = strictifySchema(propertySchema);
				if (strictPropertySchema) {
					properties[propertyName] = strictPropertySchema;
				}
				return properties;
			}, {});
			strictSchema.required = Object.keys(strictSchema.properties);
			strictSchema.additionalProperties = false;
		}

		if (
			!strictSchema.properties ||
			!Object.keys(strictSchema.properties).length
		) {
			if (Array.isArray(strictSchema.type)) {
				strictSchema.type = strictSchema.type.filter(
					(type) => type !== "object",
				);
				delete strictSchema.properties;
				delete strictSchema.required;
				delete strictSchema.additionalProperties;
			} else {
				return undefined;
			}
		}
	}

	if (strictSchema.type.includes("array")) {
		if (strictSchema.items) {
			if (Array.isArray(strictSchema.items)) {
				strictSchema.items = strictSchema.items.reduce<JSONSchemaDefinition[]>(
					(items, itemsSchema) => {
						const strictItemsSchema = strictifySchema(itemsSchema);
						if (strictItemsSchema) {
							items.push(strictItemsSchema);
						}
						return items;
					},
					[],
				);
			} else {
				strictSchema.items = strictifySchema(strictSchema.items);
			}

			if (
				!strictSchema.items ||
				(Array.isArray(strictSchema.items) && !strictSchema.items.length)
			) {
				if (Array.isArray(strictSchema.type)) {
					strictSchema.type = strictSchema.type.filter(
						(type) => type !== "array",
					);
					delete strictSchema.items;
				} else {
					return undefined;
				}
			}
		} else {
			strictSchema.items = {
				type: ["string", "number", "boolean", "null"],
				maxLength: 100,
			};
		}
	}

	if (!strictSchema.type.length) {
		return undefined;
	}

	return strictSchema;
}
