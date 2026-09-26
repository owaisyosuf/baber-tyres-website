/**
 * Seeds the Sanity dataset with the T011 content in src/sanity/seed/data.ts.
 *
 *   npm run seed            dry run — prints what would be created, writes nothing
 *   npm run seed -- --write create the missing documents
 *
 * Needs SANITY_API_WRITE_TOKEN (an Editor token) in .env.local. Uses
 * createIfNotExists, so re-running never overwrites anything the owner has
 * since edited in Studio — it only fills in what's missing.
 */
import { createClient } from "next-sanity";
import { allSeedDocs } from "../src/sanity/seed/data";

process.loadEnvFile(".env.local");

const write = process.argv.includes("--write");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set in .env.local",
  );
}
if (write && !token) {
  throw new Error(
    "SANITY_API_WRITE_TOKEN must be set in .env.local to run with --write",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

const ids = allSeedDocs.map((doc) => doc._id);
const existing = new Set(
  await client.fetch<string[]>("*[_id in $ids]._id", { ids }, { perspective: "raw" }),
);
const missing = allSeedDocs.filter((doc) => !existing.has(doc._id));

console.log(`Dataset: ${projectId}/${dataset}${write ? "" : "  (dry run)"}`);
for (const doc of allSeedDocs) {
  const status = existing.has(doc._id) ? "exists " : write ? "create " : "would create";
  console.log(`  ${status}  ${doc._type.padEnd(12)} ${doc._id}`);
}

if (!write) {
  console.log(`\n${missing.length} to create, ${existing.size} already present. Re-run with --write to apply.`);
} else if (missing.length === 0) {
  console.log("\nNothing to do — every seed document already exists.");
} else {
  const transaction = client.transaction();
  for (const doc of missing) transaction.createIfNotExists(doc);
  await transaction.commit();
  console.log(`\nCreated ${missing.length} documents (${existing.size} already present, left untouched).`);
}
