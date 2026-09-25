/**
 * Generates src/sanity/types.ts from the Sanity schema + the GROQ queries in
 * src/lib/sanity/queries.ts.
 *
 * Calls @sanity/schema and @sanity/codegen directly instead of going through
 * `sanity schema extract` / `sanity typegen generate`: those CLI commands hung
 * indefinitely (near-zero CPU, not merely slow) in this environment. The
 * underlying libraries are the same ones the CLI wraps.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createSchema } from "sanity";
import { extractSchema } from "@sanity/schema/_internal";
import { runTypegenGenerate } from "@sanity/codegen";
import { schemaTypes } from "../src/sanity/schemas";

const workDir = process.cwd();
const schemaPath = path.join(workDir, "schema.json");
const outputPath = path.join(workDir, "src", "sanity", "types.ts");

const compiled = createSchema({ name: "default", types: schemaTypes });
const extracted = extractSchema(compiled, { enforceRequiredFields: true });
await writeFile(schemaPath, JSON.stringify(extracted, null, 2));
console.log(`schema.json written (${extracted.length} types)`);

const result = await runTypegenGenerate({
  workDir,
  config: {
    schema: "schema.json",
    path: "src/**/*.{ts,tsx}",
    generates: "src/sanity/types.ts",
    overloadClientMethods: true,
  },
});

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, result.code);
console.log(
  `types.ts written — ${result.queriesCount} queries, ${result.schemaTypesCount} schema types, ` +
    `${result.filesWithErrors} files with errors`,
);
