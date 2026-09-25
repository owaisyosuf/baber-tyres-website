import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "@/lib/sanity/env";
import { schemaTypes } from "./schemas";
import { structure } from "./structure";

// The actual config lives here (under src/) so it's reachable via the `@/`
// alias from the embedded /studio route (T008). The root sanity.config.ts
// re-exports this — the CLI requires that file to exist at the project root.
export default defineConfig({
  name: "baber-tyres",
  title: "Baber Tyres Corporation",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
  },
});
