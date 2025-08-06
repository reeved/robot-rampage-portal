// @ts-ignore 
import { defineConfig } from "@tanstack/react-start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// import { env } from "./src/env";

const config = defineConfig({
  // server: {
  //   watchOptions: {
  //     ignored: ["database/**"],
  //   },
  // },
  tsr: {
    appDirectory: "src",
  },
  vite: {
    plugins: [
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
      {
        name: 'ignore-database-updates',
        handleHotUpdate({ file }: { file: string }) {
          if (file.includes('database/')) {
            return []; // prevent reload
          }
        },
      },
    ],
  },
});

export default config;
