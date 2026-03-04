import { readFileSync } from "node:fs";
import type OpenAI from "openai";

type Example = {
	summary: string;
	description: string;
	value: object;
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

	const systemPrompt = readFileSync(
		`${import.meta.dirname}/prompts/${promptName}.md`,
		"utf-8",
	);
	const userPrompt = contextObjects.join("\n\n");

	const response = await client.chat.completions.create({
		model: "gpt-5-mini-2025-08-07",
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
	contextObjects: object[],
	client: OpenAI,
): Promise<Record<string, Example>> {
	const systemPrompt = readFileSync(
		`${import.meta.dirname}/prompts/${promptName}.md`,
		"utf-8",
	);
	const userPrompt = contextObjects.join("\n\n");

	const response = await client.chat.completions.create({
		model: "gpt-5-mini-2025-08-07",
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: userPrompt },
		],
		response_format: {
			type: "json_schema",
			json_schema: {
				name: "examples",
				schema: {
					type: "object",
					properties: {},
					additionalProperties: {
						type: "object",
						properties: {
							summary: { type: "string" },
							description: { type: "string" },
							value: {},
						},
						required: ["summary", "description", "value"],
						additionalProperties: false,
					},
					minProperties: 1,
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

	console.log(text);

	const json = JSON.parse(text) as Record<string, Example>;
	return json;
}
