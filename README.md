# FoxBase DocuFox

**AI-enriched OpenAPI specifications.** FoxBase DocuFox uses an LLM to improve your OpenAPI (Swagger) specs: it rewrites and expands descriptions, and generates realistic examples for parameters, request bodies, and responses.

## Features

- **Endpoint summaries and descriptions** — Clear, consistent wording for each operation
- **Parameter documentation** — Descriptions and generated examples based on schemas
- **Request body content** — Descriptions and example payloads for `application/json` and other media types
- **Response documentation** — Descriptions and example responses per status and media type
- **Incremental updates** — Only changed endpoints are re-processed (via `x-docufox-hash`), so runs stay fast and cost-effective
- **Configurable** — Use a `docufox.yaml` config file and optional custom rules to steer the model

## Requirements

- **Node.js** (v18+ recommended)
- An **OpenAI-compatible API** key (OpenAI or a compatible endpoint)

## Installation

```bash
npm install @foxbase/docufox
```

Or run with `npx` without installing:

```bash
npx @foxbase/docufox
```

## Usage

1. **Set your API key** (required):

   ```bash
   export DOCUFOX_API_KEY=your-api-key
   ```

   Or put it in a `.env` file in the directory where you run DocuFox:

   ```
   DOCUFOX_API_KEY=your-api-key
   ```

2. **Optionally add a config file** — In the same directory, create `docufox.yaml` (see [Configuration](#configuration)).

3. **Run FoxBase DocuFox** from the directory that contains your OpenAPI file (or where `docufox.yaml` points):

   ```bash
   npx docufox
   ```

   By default, DocuFox reads `./openapi.yaml` and writes `./openapi-enriched.yaml`. Use `docufox.yaml` to change paths, model, or API URL.

## Configuration

Create a `docufox.yaml` in the directory where you run FoxBase DocuFox:

| Option       | Default                     | Description                                                  |
| ------------ | --------------------------- | ------------------------------------------------------------ |
| `inputFile`  | `./openapi.yaml`            | Path to the source OpenAPI specification                     |
| `outputFile` | `./openapi-enriched.yaml`   | Path where the enriched spec will be written                 |
| `apiUrl`     | `https://api.openai.com/v1` | Base URL of the OpenAI-compatible API                        |
| `model`      | `gpt-5.4-mini-2026-03-17`     | Model name used for generation                               |
| `rules`      | `[]`                        | List of extra instructions for the model (e.g. domain rules) |

**Example `docufox.yaml`:**

```yaml
inputFile: ./openapi.yaml
outputFile: ./openapi-enriched.yaml
apiUrl: https://api.openai.com/v1
model: gpt-5.4-mini-2026-03-17
rules:
  - When people are mentioned in the specification, always assume that people means characters from the Star Wars films.
```

## Environment variables

| Variable          | Required | Description                  |
| ----------------- | -------- | ---------------------------- |
| `DOCUFOX_API_KEY` | Yes      | API key for the LLM endpoint |

## How it works

1. FoxBase DocuFox parses and dereferences your OpenAPI spec.
2. For each path and method, it checks an `x-docufox-hash` on the operation; if the operation is unchanged since the last run, it is skipped.
3. For endpoints that need work, it calls the LLM to:
   - Improve `summary` and `description`
   - Improve parameter `description`s and generate `examples` from schemas
   - Improve request body `description` and generate body examples
   - Improve response `description`s and generate response examples
4. The enriched spec is written to `outputFile` (after each endpoint so progress is saved).

## Development

This section describes how to set up FoxBase DocuFox for local development and contribution.

### Prerequisites

- **Node.js** v18 or newer
- **npm**
- **Git**

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/foxbase/docufox.git
   cd docufox
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Build the project:**

   ```bash
   npm run build
   ```

   This compiles TypeScript from `src/` to `dist/` and copies the prompt templates from `src/prompts/` into `dist/prompts/`.

4. **Set your API key** (same as for normal usage). Create a `.env` in the directory from which you will run DocuFox, e.g. in `example/` when testing:

   ```
   DOCUFOX_API_KEY=your-api-key
   ```

### Running locally

- **Using node to directly run the CLI** (with a `docufox.yaml` and OpenAPI file in the same directory):

  ```bash
  cd example
  node ../dist/index.js
  ```

- **Using npm install inside the example directory**:

  ```bash
  cd example
  npm install
  npx docufox
  ```

  `npm install` needs to be executed after every `npm run build` in the project root.

  In addition to `npx docufox` there is also an `enrich` script defined in the `example/package.json` file:

  ```bash
  npm run enrich
  ```

- **Link the CLI globally** (optional) so you can run `docufox` from anywhere during development:

  ```bash
  npm link
  cd example
  docufox
  ```

  After linking the CLI globally, you can also link the package inside the example directory, so it gets updated automatically after every `npm run build` in the project root.

  ```bash
  cd example
  npm link @foxbase/docufox
  npm run enrich
  ```

### Scripts

| Script          | Description                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------- |
| `npm run build` | Compiles TypeScript and copies prompts to `dist/`. Run after code changes.                   |
| `npm run check` | Runs [Biome](https://biomejs.dev/) for formatting and linting (fixes and organizes imports). |

Before submitting changes, run `npm run check` so formatting and lint rules pass.

### Project structure

| Path                   | Purpose                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| `src/index.ts`         | CLI entry point; orchestrates parsing, enrichment, and writing.            |
| `src/ai.ts`            | LLM calls (text and example generation).                                   |
| `src/config.ts`        | Loads `docufox.yaml` and defines defaults.                                 |
| `src/context-objects/` | Builds context objects passed to prompts (API, endpoint, parameter, etc.). |
| `src/prompts/`         | Markdown prompt templates used for summaries, descriptions, and examples.  |
| `example/`             | Sample OpenAPI spec and `docufox.yaml` for manual testing.                 |

Editing prompts in `src/prompts/` requires a rebuild (`npm run build`) so that `dist/prompts/` is updated; the runtime reads prompts from `dist/prompts/`.

## License

MIT © FoxBase GmbH

## Links

- [Repository](https://github.com/foxbase/docufox)
- [Issue tracker](https://github.com/foxbase/docufox/issues)
