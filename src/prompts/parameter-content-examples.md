Generate 2–3 (or more, as appropriate) clear, valid example objects for the provided OpenAPI parameter content, following all provided instructions and schema constraints.

Input will include the full or partial OpenAPI spec, specifying an endpoint, a parameter, and the parameter's content object (i.e., the content property of the parameter). You must strictly follow any explicit rules or style guidelines provided. Your generated examples are to be directly usable as the `examples` property of the parameter content object.

If the parameter content already has an `examples` property (an array or object of examples), you must NOT duplicate or reuse those; generate only NEW, additional examples that are not duplicates or near-duplicates of the existing ones.

If the parameter content has a singular `example` property (directly, or within its schema), you MUST include this specific example in your output, unmodified, as one of your generated examples (copy the value exactly into one output example's value; you may generate/adapt the name, summary, and description fields, but must not alter the value). You may generate additional examples as needed to ensure at least 2–3 total examples.

If neither an `examples` nor a singular `example` (directly or in schema) is present for the parameter content, generate a full set of original examples.

The schema/type from the parameter content must always be respected in your generated `value`s. Example objects must be fully valid according to the content's schema (adapt any relevant fields as needed).

# Steps

1. Carefully review all provided input, including OpenAPI schemas, endpoint details, the parameter definition, the content object, and any specific guidance on example creation.
2. Apply the following rules to the parameter content:
   - If the parameter content contains an `examples` property: do **not** generate duplicates; create new, typologically distinct examples only, not reusing or near-duplicating existing ones.
   - If there is a singular `example` property on the parameter content or within its schema: include this, unchanged, as one of your output examples (and add more if needed).
   - If neither `examples` nor a singular `example` is present, generate a full set of new examples from scratch.
3. For each example, construct:
    - name: A short, descriptive label for the example.
    - summary: 1–2 sentences describing what the example represents.
    - description: Longer details if helpful (expand on the summary, clarify context/intent, or highlight schema features/fields).
    - value: The actual example data, strictly conforming to the parameter content’s schema/type.
4. Ensure at least 2–3 examples are produced, and include more if warranted by the content's schema variety or complexity.
5. The output must be directly usable as the `examples` property of the parameter content object (do not add extra commentary).

# Output Format

Return a single JSON object with a top-level property `examples`, whose value is an array of example objects. Each example object must have exactly these properties:
- `name` (string)
- `summary` (string)
- `description` (string)
- `value` (example value matching the parameter content's schema/type)

Do not include any other top-level properties, comments, or markdown. No code blocks or preamble—output must be valid bare JSON.

# Examples

Example 1
Input:
Parameter content with basic string schema:
content:
  application/json:
    schema:
      type: string
Output:
{
  "examples": [
    {
      "name": "Multi-word content",
      "summary": "A content value using multiple words.",
      "description": "Represents a typical string value for this parameter content, suitable for multi-keyword cases.",
      "value": "green apples in autumn"
    },
    {
      "name": "Simple single word",
      "summary": "A single, straightforward string value.",
      "description": "A minimalist content example with only one word.",
      "value": "banana"
    }
  ]
}

Example 2
Input:
Parameter content with singular example:
content:
  application/json:
    schema:
      type: integer
      example: 20
Output:
{
  "examples": [
    {
      "name": "Official Example (as defined in spec)",
      "summary": "The default content example provided in the schema.",
      "description": "This is the unmodified example from the content schema.",
      "value": 20
    },
    {
      "name": "Smallest allowed value",
      "summary": "Minimum permitted content value.",
      "description": "Demonstrates the use of the lowest valid integer per schema constraints.",
      "value": 1
    }
  ]
}

Example 3
Input:
Parameter content with pre-existing examples:
content:
  application/json:
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
      "summary": "A content value using the .txt format.",
      "description": "Shows how a user would request or provide a value in plain text format.",
      "value": "txt"
    },
    {
      "name": "Markdown Output",
      "summary": "A content value using the markdown format.",
      "description": "Represents the choice of markdown for the content value.",
      "value": "md"
    }
  ]
}

(For complex schemas, real-world values should demonstrate relevant structure and variations, using valid concrete values.)

# Notes

- All logic for evaluating examples, singular example, and generation should be applied at the parameter content level (not the parameter itself).
- Never reuse or duplicate pre-existing examples from an `examples` property on the parameter content; always add new, typologically distinct ones.
- If an explicit `example` is specified on the parameter content or within its schema, copy it unchanged into at least one output example (you may generate/adapt the name, summary, and description fields for this entry).
- Do not produce an empty array of examples—always include at least 2, or more if warranted by the schema or instructions.
- All `value` fields must strictly conform to the parameter content's schema.
- Only return the bare JSON object as specified; no extra commentary, markdown, or code blocks.

Important: Output MUST be a JSON object with only an "examples" array of at least 2–3 valid, schema-conforming example objects (each with name, summary, description, value) appropriate for the provided parameter content object, as described above.
