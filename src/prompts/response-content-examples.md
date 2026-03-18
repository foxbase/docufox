Generate 2–3 (or more, as appropriate) clear, valid examples objects for the content of a specific OpenAPI response, following all provided instructions and schema constraints.

Input will include the full or partial OpenAPI spec, specifying an endpoint and one of its responses, and may also provide explicit rules or style guidelines—these must all be followed strictly. Your generated examples will directly replace the current `examples` property for the given response content.

If the response content already has an `examples` property (an array/collection of examples), exclude these from your generation—create only new, additional examples that are not duplicates or near-duplicates of the existing ones.

If the response content has an `example` property (singular) or specifies an example inside the schema, you must include this specific example in your output, unmodified, as one of your generated examples (in this case, copy the example exactly into the value of one output example; you may adapt/create name, summary, and description fields as needed, but must not alter the `value`). You may generate additional examples as needed to ensure a set of at least 2-3.

The schema/type of the response must always be respected in your generated examples. Example values (the `value` field of each example object) must be fully valid according to the schema (adapt any placeholder fields appropriately).

# Steps

1. Carefully review all provided input, including OpenAPI schemas, endpoint details, and any specific guidance on example creation.
2. Identify whether the response content already contains an `examples` property or a singular `example` (or a schema-defined example):
   - If `examples` property present: do NOT duplicate or reuse those; make new and different examples.
   - If only a singular `example` (property or in schema): include it, unchanged, as one of your output examples.
   - If neither are present, generate a full set of new examples.
3. For each example, provide meaningful:
    - name: A short, descriptive label for the example.
    - summary: 1–2 sentences describing what the example represents.
    - description: Longer details if helpful (may expand on the summary or clarify context, intent, or special fields).
    - value: The actual data example, strictly conforming to the schema.
4. Ensure at least 2–3 examples are included, never fewer; include more if warranted by the schema’s variety or complexity.
5. All output must be directly usable as the `examples` property of the corresponding OpenAPI response content.

# Output Format

Respond only with a JSON object with a single top-level property: `examples`.
- The `examples` property must be an array of example objects.
- Each example object has exactly four properties:
    - `name`: string
    - `summary`: string
    - `description`: string
    - `value`: valid JSON object/value matching the response schema
- Do not include any extra commentary, preamble, or code blocks.

# Examples

Example 1
Input:
OpenAPI excerpt:
paths:
  /users:
    get:
      responses:
        200:
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
Output:
{
  "examples": [
    {
      "name": "Typical User List",
      "summary": "A list of two registered users.",
      "description": "This example shows two users with basic profile information, typical for a small directory.",
      "value": [
        {
          "id": 123,
          "username": "alice",
          "email": "alice@example.com",
          "active": true
        },
        {
          "id": 124,
          "username": "bob",
          "email": "bob@example.com",
          "active": false
        }
      ]
    },
    {
      "name": "Empty User List",
      "summary": "An empty list when no users exist.",
      "description": "Demonstrates the structure of the response if there are no users registered in the system.",
      "value": []
    }
  ]
}

Example 2
Input:
OpenAPI excerpt with singular example property:
paths:
  /orders/{orderId}:
    put:
      responses:
        200:
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
              example:
                id: 42
                total: 19.99
                status: "shipped"
Output:
{
  "examples": [
    {
      "name": "Example Order (as defined in OpenAPI spec)",
      "summary": "The official example provided in the schema.",
      "description": "This is the unmodified example from the specification, showing an order that has shipped.",
      "value": {
        "id": 42,
        "total": 19.99,
        "status": "shipped"
      }
    },
    {
      "name": "Processing Order",
      "summary": "An order currently being processed.",
      "description": "Shows an example of an order still in process with the minimum required properties.",
      "value": {
        "id": 43,
        "total": 42.50,
        "status": "processing"
      }
    }
  ]
}

Example 3
Input:
OpenAPI excerpt with pre-existing examples property:
paths:
  /login:
    post:
      responses:
        401:
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              examples:
                invalidPassword:
                  value: { code: 401, message: "Invalid password." }
                missingEmail:
                  value: { code: 401, message: "Missing email." }
Output:
{
  "examples": [
    {
      "name": "Account Disabled",
      "summary": "Authentication fails because the account is disabled.",
      "description": "Demonstrates an error returned when a user attempts to log in with a disabled account.",
      "value": {
        "code": 401,
        "message": "Account is disabled."
      }
    },
    {
      "name": "Account Locked",
      "summary": "Authentication fails due to too many incorrect login attempts.",
      "description": "Shows the response when the account is locked after repeated failed login attempts.",
      "value": {
        "code": 401,
        "message": "Account locked."
      }
    }
  ]
}

(Real-world values should be adapted to the full schema in the spec. For complex schemas, include realistic property values and demo all important array/object structures.)

# Notes

- Never reuse or duplicate pre-existing examples from an `examples` property; always add new, typologically distinct ones.
- If an explicit `example` is specified, copy it unchanged into at least one output example (but you may alter metadata fields such as name/summary/description).
- Do not produce an empty array of examples under any circumstance.
- All example `value` fields must strictly adhere to the schema for the response content.
- No extra fields, comments, or markdown—always return bare JSON as described.

Important: Output a JSON object with a single top-level "examples" array of at least 2-3 valid, schema-conforming example objects (each with name, summary, description, value), according to these rules.
