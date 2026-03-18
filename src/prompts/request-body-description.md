Generate a clear, concise, and informative description for the request body of a provided endpoint within an OpenAPI specification. The input will include the full or partial OpenAPI spec and a specific endpoint, as well as the requestBody object. There may also be rules provided—if so, you must carefully interpret and strictly respect these rules when generating the request body description. The generated description should summarize what is expected in the request body, its main structure or purpose, what the client should provide, and any relevant usage constraints or options. Your output will be used directly as the new description field for the requestBody of the given endpoint in the OpenAPI specification.

- If a request body description is already present, read and understand it along with the request body schema, endpoint parameters, and other fields for context. Consider what is currently missing, unclear, or redundant, and improve the description accordingly, while also adhering to any provided rules.
- If there is no request body description, carefully infer the purpose, expected structure, and required/optional elements of the request body from the schema, endpoint path and method, parameters, and any other relevant comments or fields, and incorporate any rules provided.
- Always ensure that your description strictly respects any generation rules, constraints, or style guidelines that accompany the input.
- Ensure the request body description is targeted at API consumers (developers) and is self-contained, accurate, and avoids tautology.
- Use neutral, clear language and avoid overly technical jargon or redundancy.
- Do not include implementation details not relevant to API usage.
- Do NOT reference or mention OpenAPI specification, schemas, "requestBody," or YAML/JSON fields in your description.
- Ensure the description is no more than 3-4 sentences (aim for a short paragraph).

# Output Format

- Output only the final request body description text as a single paragraph, without any additional commentary or explanation.

# Examples

Example 1
Input:
OpenAPI excerpt:
paths:
  /users:
    post:
      summary: Create a new user
      requestBody:
        description: User data to create
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, email]
              properties:
                username:
                  type: string
                email:
                  type: string
                displayName:
                  type: string
      responses:
        201:
          description: User created
Output:
Provide a JSON object including the user's username and email as required fields. You may also include an optional display name for the user.

Example 2
Input:
OpenAPI excerpt:
paths:
  /orders/{orderId}:
    put:
      summary: Update an order
      parameters:
        - name: orderId
          in: path
          required: true
      requestBody:
        description: Order details to update
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  enum: [pending, shipped, delivered]
                items:
                  type: array
                  items:
                    type: string
      responses:
        200:
          description: Returns the updated order.
Output:
Submit an object specifying new order details, such as the updated status and list of item identifiers. The status must be one of: pending, shipped, or delivered.

Example 3
Input:
OpenAPI excerpt:
paths:
  /comments:
    post:
      summary: Add a comment
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [text]
              properties:
                text:
                  type: string
                author:
                  type: string
      responses:
        201:
          description: Comment added.
Output:
Include a JSON object with the comment text (required) and optionally the author's name.

# Notes

- If explicit rules or requirements are provided as part of the input, those constraints must be fully respected and reflected in the request body description.
- Output only the request body description text, suitable for the OpenAPI spec, with no surrounding commentary.
- Aim for clarity, conciseness, and developer relevance in the description at all times.
- This description will directly become the requestBody "description" field; do not mention OpenAPI, schemas, or technical field names in the output.
