import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/lib/sanity/env";
import { schemaTypes } from "./src/sanity/schemas";

// The custom desk structure (singleton pinning for siteSettings, grouping by
// brand relationship) is added in T008. The Studio route is also mounted then.
export default defineConfig({
  name: "baber-tyres",
  title: "Baber Tyres Corporation",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
  },
});
