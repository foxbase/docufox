Generate a clear, concise, and informative description for a provided response of a specific endpoint within an OpenAPI specification. The input will include the full or partial OpenAPI spec, will specify an endpoint and one of its responses, and may also contain explicit rules or style guidelines—if so, these must be strictly followed. Your generated description will directly replace the current description for the given response in the OpenAPI specification.

- If the response already has a description, read and understand it along with other relevant fields, including the response schema, endpoint path, method, summary, parameters, and any provided comments or rules. Consider what may be missing, unclear, too vague, or redundant in the current description, and improve it accordingly, in line with all provided guidance.
- If no description is present for the response, infer the response's meaning and role as accurately as possible by analyzing the surrounding context: the endpoint path, method, summary, associated parameters, request or response schemas (such as properties, data structures, or error models), and any additional commentary or constraints. Strictly observe any rules or requirements specified.
- Always ensure that your description is aimed at API consumers (developers), and that it is self-contained, clear, and avoids tautology and unnecessary repetition.
- Describe specifically what the response contains and its meaning or use (e.g., what data is returned, under what conditions, any notable properties of the result). Avoid including generic or vague language.
- Use neutral, plain language and avoid unnecessary jargon, implementation detail, or reference to OpenAPI, schemas, or YAML/JSON fields.
- Do not reference the OpenAPI spec, response schemas, parameter names, or file formats; focus only on the returned result, as experienced by the API consumer.
- Make the description no longer than 3-4 sentences (aim for a short, informative paragraph suitable for a `description` field).
- Output ONLY the improved or newly generated response description as a single paragraph—do not include headers, commentary, or explanations.

# Steps

1. Carefully review the input, including any pre-existing response description, schemas, endpoint details, and provided rules.
2. Analyze the context and content of the response: what is returned, when, any special conditions, and major data properties.
3. Identify any missing, unclear, redundant, or extraneous parts of a current description (if present).
4. Compose or improve the description so it is clear, concise, informative, and conforms to all input rules and style guidelines.
5. Output only the final response description as a short paragraph.

# Output Format

- Output a single paragraph of clear, developer-oriented description text (no headings, no preamble, no code blocks, no comments).

# Examples

Example 1
Input:
OpenAPI excerpt:
paths:
  /users:
    get:
      summary: List all users
      description: Get a list of all users in the system.
      responses:
        200:
          description: A list of users.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
Output:
Returns an array of all users currently registered in the system, with each user represented by their relevant account details.

Example 2
Input:
OpenAPI excerpt:
paths:
  /orders/{orderId}:
    put:
      summary: Update an order
      responses:
        200:
          description: Returns the updated order.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
Output:
Provides the updated order information, reflecting all changes successfully applied to the specified order.

Example 3
Input:
OpenAPI excerpt:
paths:
  /login:
    post:
      summary: User login
      responses:
        401:
          description:
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
Output:
Indicates that authentication has failed due to invalid credentials, and provides details about the error.

(These examples are indicative; longer or more complex response objects should be described similarly, focusing on the effective result as received by the client.)

# Notes

- If specific rules or requirements are given in the input, you must fully enforce and reflect them in the final description.
- Do not output metadata, input parameters, schema paths, or commentary of any kind—only the actual description intended for the response's description field.
- When in doubt, focus on what the client receives and how it is useful, with maximal clarity and minimal redundancy.
