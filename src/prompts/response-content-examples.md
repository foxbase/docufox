Generate example objects for the response content of a specified endpoint in an OpenAPI specification, ensuring that the output always contains at least 2-3 distinct examples; the response should never be an empty object.

- For the provided endpoint and response, examine the response content closely, including all relevant schemas, existing examples, and the OpenAPI excerpt.
- If the response content already has an `examples` property (plural), do not copy or include these; instead, generate at least 2-3 new, distinct examples that fit the schema.
- If the response content has a singular `example` property (or if the referenced schema includes a singular `example`), include this example as one of the generated examples, preserving it unchanged (copy the content and name exactly). Always add at least 1-2 more distinct examples for a total of at least 2-3.
- For every generated example:
    - Ensure it adheres exactly to the schema of the response content (types, required fields, constraints).
    - Present each as a key-value pair, where the key is a concise, meaningful example name.
    - The value must be an object with three properties:
        - `summary`: A brief summary of the example’s scenario or intent.
        - `description`: A short explanation giving additional context or details about the use case or the data.
        - `value`: The actual example data, precisely matching the schema.
- If you must use placeholders for data due to insufficient details, ensure they are realistic and representative.
- Never return an empty JSON object. If you cannot generate diverse examples (e.g., schema is too generic or all examples would be identical), still include at least two different interpretations or edge cases.
- The final output must be a single JSON object containing all generated examples, directly usable as the `examples` property of the OpenAPI response content. Do not include commentary, markup, or explanation.

# Steps

1. Review the provided OpenAPI excerpt, focusing on the endpoint, response content schema, and any present `example`, `examples`, or schema-provided examples.
2. Analyze the schema to determine its valid structure(s), required fields, types, and allowable value ranges, to support generating at least 2-3 unique, plausible examples.
3. Decide, according to the above rules, which (if any) singular example to include as-is, then create at least 1-2 additional distinct and realistic examples for a minimum of 2-3 total.
4. For each example, construct:
    - A meaningful example name.
    - A `summary` (1-2 lines) explaining the scenario.
    - A `description` (1-2 sentences) with further context or details.
    - A `value` field with data exactly matching the schema.
5. Combine all generated examples into a single JSON object, using the format described below.
6. Output ONLY this JSON object. Do not include commentary, markup, or explanation.

# Output Format

- Output a single JSON object.
    - Each key is the example name.
    - Each value is an object with `summary`, `description`, and `value` fields.
    - At least 2-3 key-value pairs must be present.
- Do NOT wrap in code blocks or include any explanatory text.

# Examples

Example 1  
Input (OpenAPI excerpt):  
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

Existing: No `examples` or `example`

Output:
{
  "basicUserList": {
    "summary": "A typical user list",
    "description": "A response with two example users to illustrate common fields.",
    "value": [
      { "id": 1, "name": "Alice Smith", "email": "alice@example.com" },
      { "id": 2, "name": "Bob Jones", "email": "bob@example.com" }
    ]
  },
  "emptyList": {
    "summary": "An empty user list",
    "description": "A response when no users are in the database.",
    "value": []
  },
  "adminUsersOnly": {
    "summary": "List with admin user(s)",
    "description": "Illustrates a user list with only admin-level access.",
    "value": [
      { "id": 42, "name": "Sam Admin", "email": "sam.admin@example.com", "role": "admin" }
    ]
  }
}

Example 2  
Input:  
paths:  
  /login:  
    post:  
      responses:  
        401:  
          content:  
            application/json:  
              schema:  
                $ref: '#/components/schemas/Error'
              example:
                code: "401"
                message: "Unauthorized"

Output: 
{
  "singleExample": {
    "summary": "Unauthorized access example",
    "description": "Returned when login credentials are invalid.",
    "value": {
      "code": "401",
      "message": "Unauthorized"
    }
  },
  "missingToken": {
    "summary": "Missing token scenario",
    "description": "This example shows the error response when no authentication token is provided.",
    "value": {
      "code": "401",
      "message": "No authentication token provided"
    }
  },
  "expiredToken": {
    "summary": "Expired token scenario",
    "description": "Shows the error returned when a token has expired.",
    "value": {
      "code": "401",
      "message": "Authentication token has expired"
    }
  }
}

(Realistic outputs should reflect the actual available fields and data in the schema; use plausible placeholders if fields are ambiguous or extensive.)

# Notes

- Always provide at least 2-3 distinct and plausible examples matching the response schema; NEVER output an empty object.
- All example `value` fields must match the response schema exactly—validate data types and required fields.
- If only a singular `example` is present, copy it into the output exactly and add at least one or two more distinct examples.
- For schemas with very limited possible outputs, provide all plausible edge cases.
- Use clear, readable example names, summaries, and descriptions in all cases.
- Output must be a single, flat JSON object suitable as the OpenAPI response content's `examples` property.
