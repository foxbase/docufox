Generate 2–3 (or more, as appropriate) clear, valid example objects for the request body content of a specific OpenAPI endpoint, following all provided instructions and schema constraints.

Input will include the full or partial OpenAPI spec, specifying an endpoint and its request body content, and may also provide explicit rules or style guidelines—these must all be followed strictly. Your generated examples will directly replace or supplement the current `examples` property of the given request body content, according to the following rules.

If the request body content already has an `examples` property (an array/collection of examples), exclude these from your generation—create only new, additional examples that are not duplicates or near-duplicates of the existing ones.

If the request body content has an `example` property (singular) or if the schema of the request body content defines an explicit example, you must include this specific example in your output, unmodified, as one of your generated examples (in this case, copy the example exactly into the `value` field of one output example; you may adapt the name, summary, and description fields as needed, but must not alter the `value`). You may generate additional examples as needed to ensure a set of at least 2-3.

The schema/type of the request body content must always be respected in your generated examples. Example values (the `value` field of each example object) must be fully valid according to the schema (adapt any placeholder fields appropriately).

The output must be directly usable as the new `examples` property of the corresponding OpenAPI request body content.

# Steps

1. Carefully review all provided input, including OpenAPI schemas, endpoint details, and any specific guidance on example creation.
2. Identify whether the request body content already contains an `examples` property or a singular `example` property or a schema-defined example:
   - If an `examples` property is present: do NOT duplicate or reuse those; generate new and different examples.
   - If only a singular `example` property or schema-defined example is present: include this example, unchanged, as one of your output examples.
   - If neither are present, generate a full set of new examples.
3. For each example, provide meaningful:
    - name: A short, descriptive label for the example.
    - summary: 1–2 sentences describing what the example represents.
    - description: Longer details if helpful (may expand on the summary or clarify context, intent, or special fields).
    - value: The actual data example, strictly conforming to the request body schema.
4. Ensure at least 2–3 examples are included, never fewer; include more if warranted by the schema’s variety or complexity.
5. All output must be directly usable as the `examples` property of the OpenAPI request body content.

# Output Format

Respond only with a JSON object with a single top-level property: `examples`.
- The `examples` property must be an array of example objects.
- Each example object has exactly four properties:
    - `name`: string
    - `summary`: string
    - `description`: string
    - `value`: valid JSON object/value matching the request body schema
- Do not include any extra commentary, preamble, or code blocks.

# Examples

Example 1
Input:
OpenAPI excerpt:
paths:
  /users:
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NewUser'
Output:
{
  "examples": [
    {
      "name": "Standard User Creation",
      "summary": "A typical example of creating a new user.",
      "description": "This example illustrates a standard request body for user creation with all required fields.",
      "value": {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "Secret123",
        "role": "member"
      }
    },
    {
      "name": "Admin User Creation",
      "summary": "Creating a new admin user with additional privileges.",
      "description": "Shows an example where a user is created with an admin role, demonstrating a less common scenario.",
      "value": {
        "username": "alice_admin",
        "email": "alice@example.com",
        "password": "StrongPass!2024",
        "role": "admin"
      }
    }
  ]
}

Example 2
Input:
OpenAPI excerpt with singular example property:
paths:
  /orders:
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NewOrder'
            example:
              productId: 101
              quantity: 2
              gift: false
Output:
{
  "examples": [
    {
      "name": "Example Request (as defined in OpenAPI spec)",
      "summary": "The official request body example provided in the schema.",
      "description": "This is the unmodified example from the specification, creating an order for a product as a regular purchase without a gift option.",
      "value": {
        "productId": 101,
        "quantity": 2,
        "gift": false
      }
    },
    {
      "name": "Gift Order",
      "summary": "Submitting an order as a gift for someone.",
      "description": "Illustrates a request body for ordering a product as a gift, with the required fields changed.",
      "value": {
        "productId": 252,
        "quantity": 1,
        "gift": true
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
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
            examples:
              missingPassword:
                value: { email: "bob@example.com" }
              missingEmail:
                value: { password: "p@ssw0rd" }
Output:
{
  "examples": [
    {
      "name": "Complete Credentials",
      "summary": "A login attempt with both email and password provided.",
      "description": "This example shows the correct structure for a user login attempt, where both required fields are present.",
      "value": {
        "email": "charlie@example.com",
        "password": "safePassword!54"
      }
    },
    {
      "name": "Password With Special Characters",
      "summary": "A login request using a password containing special characters.",
      "description": "Demonstrates the request body where the user submits a password with symbols and numbers for security.",
      "value": {
        "email": "eve@example.com",
        "password": "!EveS3cret@2024"
      }
    }
  ]
}

(Real-world example values should be adapted to the full schema in the spec. For complex schemas, include realistic property values and showcase all important array/object structures.)

# Notes

- Never reuse or duplicate pre-existing examples from an `examples` property; always add new, typologically distinct ones.
- If an explicit `example` is specified on the request body or its schema, copy it unchanged into at least one output example (but you may alter metadata fields such as name/summary/description).
- Do not produce an empty array of examples under any circumstance.
- All example `value` fields must strictly adhere to the schema for the request body content.
- No extra fields, comments, or markdown—always return bare JSON as described.

Important: Output a JSON object with a single top-level "examples" array of at least 2-3 valid, schema-conforming example objects (each with name, summary, description, value), according to these rules.
