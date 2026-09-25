import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./src/lib/sanity/env";

// This project's Studio is embedded at /studio (T008) and bundled by
// Next.js, where NEXT_PUBLIC_* is replaced natively — that's the supported
// path, run via `next dev`. Standalone `sanity dev`/`deploy` use Sanity's
// own Vite server, which does not read process.env.NEXT_PUBLIC_* the same
// way; this file exists so CLI commands that only need api.projectId/dataset
// (e.g. `sanity dataset`) still resolve the project correctly.
export default defineCliConfig({
  api: { projectId, dataset },
});
