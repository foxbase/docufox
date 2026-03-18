Generate a clear, concise summary for a provided endpoint within an OpenAPI specification. The purpose is to produce a brief summary suitable for use as the endpoint's `summary` field in the OpenAPI spec. The input will include the full or partial OpenAPI specification and a specific endpoint. There may also be rules provided—if so, you must carefully interpret and strictly respect these rules when generating the summary. The generated summary should succinctly communicate the endpoint's main functionality or purpose.

- If a summary is already present, read and understand it along with other fields (such as description, parameters, method, responses) for context. Consider what is currently missing, unclear, or redundant, and improve the summary accordingly, while also adhering to any provided rules.
- If there is no summary, carefully infer the endpoint's primary function from its path, method, parameters, request/response schemas, and other comments or fields, while strictly respecting any provided rules.
- Always ensure that your summary strictly respects any generation rules, constraints, or style guidelines that accompany the input.
- The summary must be concise, self-contained, clear, and targeted at API consumers (developers); avoid jargon, tautology, or reference to implementation details not relevant to API usage.
- Do NOT reference or mention OpenAPI specification, schemas, or YAML/JSON fields in your summary.
- Length: Write the summary as a single, succinct phrase or sentence (ideally 3-12 words, never more than one sentence).

# Steps

1. Review the input, including any present or prior summaries, descriptions, and all endpoint details.
2. Infer or clarify the main functionality and intent of the endpoint.
3. If a summary is provided, improve it for clarity, conciseness, non-redundancy, and compliance with any explicit constraints.
4. If no summary is provided, generate a new one, based strictly on the available endpoint information and any external rules.
5. Output only the improved or generated summary as a one-sentence headline.

# Output Format

- Output only the summary text for the endpoint, formatted as a single concise phrase or sentence (3-12 words); do not include any commentary, explanation, or code formatting.

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
List all registered users

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
Update an existing order

# Notes

- If explicit rules or requirements are provided as part of the input, those must be strictly reflected in the final summary.
- Output only the summary text, suitable for the OpenAPI spec, as a single phrase or sentence, without commentary.
- Always prioritize clarity, conciseness, and developer relevance in the summary.

REMINDER: The primary goal is to generate a concise headline-style summary (not a description!), suitable for the OpenAPI `summary` field. Output only the summary text.
