Generate a clear, concise, and informative description for a provided parameter of a specific endpoint within an OpenAPI specification. The input will include the full or partial OpenAPI spec, will specify an endpoint and one of its parameters, and may also contain explicit rules or style guidelines—if so, these must be strictly followed. Your generated description will directly replace the current description for the given parameter in the OpenAPI specification.

- If the parameter already has a description, read and understand it in conjunction with all other relevant fields, including the parameter's name, location (`in`), schema (e.g., type, format, allowed values), required status, default value, endpoint path, method, summary, and any provided comments or rules. Consider what may be missing, unclear, redundant, or unnecessarily verbose in the current description, and improve it accordingly in line with all provided guidance.
- If no description is present for the parameter, accurately infer its meaning, purpose, valid values, and usage by analyzing the surrounding context: the endpoint, parameter schema, endpoint path and method, summary, other parameters, possible allowable values, example usages, and any additional instructions or constraints. Strictly observe any rules or requirements specified.
- Always ensure your description is aimed at API consumers (developers), and that it is self-contained, clear, and avoids tautology or excessive repetition.
- Describe specifically what the parameter represents, its meaning and purpose, expected value(s), whether it is required, any special constraints, and any default value if relevant. Avoid including generic or vague statements such as "This is a query parameter."
- Use neutral, plain language and avoid unnecessary jargon, implementation detail, or references to OpenAPI, schemas, or YAML/JSON field mechanics.
- Do not reference the OpenAPI spec, parameter object fields, parameter names (unless required for clarity), or implementation details; focus only on purpose and usage as experienced by the API consumer.
- Make the description no longer than 2-3 sentences (aim for a short, informative sentence or two suitable for a `description` field).
- Output ONLY the improved or newly generated parameter description as a single paragraph—do not include headers, commentary, or explanations.

# Steps

1. Carefully review the input, including any pre-existing parameter description, schema, endpoint details, and provided rules.
2. Analyze the context and content of the parameter: what it is, what values are valid, whether it is required, and how and when it is used.
3. Identify any missing, unclear, redundant, or extraneous parts in the current description (if present).
4. Compose or improve the description so it is clear, concise, informative, and conforms to all input rules and style guidelines.
5. Output only the final parameter description as a short sentence or paragraph.

# Output Format

- Output a single sentence or short paragraph of clear, developer-oriented description text (no headings, no preamble, no code blocks, no comments).

# Examples

Example 1
Input:
OpenAPI excerpt:
paths:
  /users:
    get:
      summary: List all users
      parameters:
        - name: role
          in: query
          required: false
          schema:
            type: string
            enum: [admin, member, guest]
          description:
Output:
Filters the list of users to those with the specified role ('admin', 'member', or 'guest'). If not provided, returns all users.

Example 2
Input:
OpenAPI excerpt:
paths:
  /orders/{orderId}:
    get:
      summary: Retrieve an order
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
          description: Identifier for the order.
Output:
Unique identifier for the order to retrieve. Must be provided in the request path.

Example 3
Input:
OpenAPI excerpt:
paths:
  /products:
    get:
      summary: List available products
      parameters:
        - name: page
          in: query
          required: false
          schema:
            type: integer
            default: 1
          description:
Output:
Specifies which page of product results to return. Defaults to the first page if not provided.

(These examples are indicative; longer or more complex parameter usages should be described similarly, focusing on what the API consumer should supply, choose, or expect for each parameter.)

# Notes

- If specific rules or requirements are given in the input, you must fully enforce and reflect them in the final parameter description.
- Do not output metadata, parameter object field names, schema details, or commentary of any kind—only the actual description intended for the parameter's description field.
- When in doubt, focus on what the client must supply or select, under what circumstances, and any constraints or valid values, described with maximal clarity and minimal redundancy.
