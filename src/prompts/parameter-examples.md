Generate 2–3 (or more, as appropriate) clear, valid example objects for a specific OpenAPI parameter, following all provided instructions and schema constraints.

Input will include the full or partial OpenAPI spec, specifying an endpoint and one of its parameters, and may also provide explicit rules or style guidelines—these must all be followed strictly. Your generated examples will be directly usable as the `examples` property of the given parameter.

If the parameter already has an `examples` property (an array or object of examples), do NOT duplicate or reuse those; generate only NEW, additional examples that are not duplicates or near-duplicates of the existing ones.

If the parameter has a singular `example` property (directly, or in its schema), you MUST include this specific example in your output, unmodified, as one of your generated examples (copy the value exactly into one output example's value; you may generate/adapt the name, summary, and description fields, but must not alter the `value`). You may generate additional examples as needed to ensure at least 2–3 total.

If neither an `examples` nor a singular `example` (directly or in schema) is present for the parameter, generate a full set of original examples.

The schema/type of the parameter must always be respected in your generated values. Example objects must be fully valid according to the parameter schema (adapt any relevant fields as needed).

# Steps

1. Carefully review all provided input, including OpenAPI schemas, endpoint details, the parameter definition, and any specific guidance on example creation.
2. Determine the examples context:
   - If the parameter contains an `examples` property: do **not** generate duplicates; create new, typologically distinct examples only.
   - If there is a singular `example` property in the parameter or within its schema: include this, unchanged, as one of your output examples (and add more if needed).
   - If neither `examples` nor `example` is present, generate a full set of new examples from scratch.
3. For each example, construct:
    - name: A short, descriptive label for the example.
    - summary: 1–2 sentences describing what the example represents.
    - description: Longer details if helpful (expand on the summary, clarify context/intent, or highlight schema features/fields).
    - value: The actual example data, strictly conforming to the parameter's schema/type.
4. Ensure at least 2–3 examples are produced, and include more if warranted by the parameter’s variety or complexity.
5. The output must be directly usable as the `examples` property of the OpenAPI parameter (do not add extra commentary).

# Output Format

Return a single JSON object with a top-level property `examples`, whose value is an array of example objects. Each example object must have exactly these properties:
- `name` (string)
- `summary` (string)
- `description` (string)
- `value` (example value matching parameter schema/type)

Do not include any other top-level properties, comments, or markdown. No code blocks or preamble—output must be valid bare JSON.

# Examples

Example 1
Input:
OpenAPI excerpt:
paths:
  /search:
    get:
      parameters:
        - name: "query"
          in: "query"
          required: true
          schema:
            type: string
Output:
{
  "examples": [
    {
      "name": "Multi-word search",
      "summary": "A search query for multiple keywords.",
      "description": "A user searching for articles about both dogs and veterinary tips.",
      "value": "dog veterinary tips"
    },
    {
      "name": "Single-word query",
      "summary": "A general search for a single topic.",
      "description": "A typical user search using a single keyword.",
      "value": "kittens"
    }
  ]
}

Example 2
Input:
OpenAPI excerpt with singular example property:
paths:
  /items:
    get:
      parameters:
        - name: "limit"
          in: "query"
          schema:
            type: integer
            example: 20
Output:
{
  "examples": [
    {
      "name": "Official Example (as defined in spec)",
      "summary": "The default example provided for the 'limit' parameter.",
      "description": "This is the unmodified example from the parameter schema, representing the maximum number of items returned.",
      "value": 20
    },
    {
      "name": "Lower Limit",
      "summary": "A request for a small number of items.",
      "description": "A user requests only the first three items by setting a lower limit.",
      "value": 3
    }
  ]
}

Example 3
Input:
OpenAPI excerpt with pre-existing examples property:
paths:
  /download:
    get:
      parameters:
        - name: "format"
          in: "query"
          schema:
            type: string
          examples:
            pdf:
              value: "pdf"
            csv:
              value: "csv"
Output:
{
  "examples": [
    {
      "name": "Plain Text Output",
      "summary": "A request for results in plain text format.",
      "description": "The user prefers to download the search results as a plain .txt file.",
      "value": "txt"
    },
    {
      "name": "Markdown Output",
      "summary": "A request for results formatted as markdown.",
      "description": "This example shows a user requesting the file in markdown format.",
      "value": "md"
    }
  ]
}

(Real-world values should match the parameter schema fully. For complex parameter types, include realistic values showing relevant variations.)

# Notes

- Never reuse or duplicate pre-existing examples from an `examples` property; always add new, typologically distinct ones.
- If an explicit `example` is specified on the parameter or in its schema, copy it unchanged into at least one output example (but you may adapt or add metadata fields: name/summary/description).
- Do not produce an empty array of examples—always include at least 2, or more if warranted by the schema or instructions.
- All `value` fields must strictly conform to the parameter's schema.
- Only return the bare JSON object as specified; no extra commentary, markdown, or code blocks.

Important: Output a JSON object with a single "examples" array of at least 2–3 valid, schema-conforming example objects (each with name, summary, description, value) appropriate for the given OpenAPI parameter, according to these rules.
