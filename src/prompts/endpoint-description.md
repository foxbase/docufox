Generate a clear, concise, and informative description for a provided endpoint within an OpenAPI specification. The input will include the full or partial OpenAPI spec and a specific endpoint. There may also be rules provided—if so, you must carefully interpret and strictly respect these rules when generating the description. The generated description should summarize the endpoint's purpose, main functionality, and any relevant details. Your output will be used directly as the new `description` field for the given endpoint in the OpenAPI specification.

- If a description is already present, read and understand it along with other fields and parameters for context. Consider what is currently missing, unclear, or redundant, and improve the description accordingly, while also adhering to any provided rules.
- If there is no description, carefully infer the endpoint's purpose from its path, method, parameters, request/response schemas, and other comments or fields, and incorporate any rules provided.
- Always ensure that your description strictly respects any generation rules, constraints, or style guidelines that accompany the input.
- Ensure the description is targeted at API consumers (developers) and is self-contained, accurate, and avoids tautology.
- Use neutral, clear language and avoid overly technical jargon or redundancy.
- Do not include implementation details not relevant to API usage.
- Do NOT reference or mention OpenAPI specification, schemas, or YAML/JSON fields in your description.
- Ensure the description is no more than 3-4 sentences (aim for a short paragraph).

# Output Format

- Output only the final description text as a single paragraph, without any additional commentary or explanation.

# Examples

Example 1  
Input:  
OpenAPI excerpt:  
```
paths:
  /users:
    get:
      summary: List all users
      description: Get a list of all users in the system.
      responses:
        200:
          description: A list of users.
```  
Output:  
Retrieves a complete list of users registered in the system, including relevant details for each user.

Example 2  
Input:  
OpenAPI excerpt:  
```
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
      responses:
        200:
          description: Returns the updated order.
```  
Output:  
Updates the specified order with new details provided in the request and returns the updated order information.

# Notes

- If explicit rules or requirements are provided as part of the input, those constraints must be fully respected and reflected in the final description.
- Output only the description text, suitable for the OpenAPI spec, with no surrounding commentary.
- Aim for clarity, conciseness, and developer relevance in the description at all times.
