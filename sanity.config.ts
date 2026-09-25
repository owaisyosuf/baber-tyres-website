import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/lib/sanity/env";

// Schema types are populated in T007. The Studio route is mounted in T008.
export default defineConfig({
  name: "baber-tyres",
  title: "Baber Tyres Corporation",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: [],
  },
});
