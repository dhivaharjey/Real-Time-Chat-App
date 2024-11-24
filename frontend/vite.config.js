import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // optimizeDeps: {
  //   exclude: ["events", "url", "http"], // Exclude these modules from the client bundle
  // },
});
// import { defineConfig } from 'vite';

// export default defineConfig({
//   optimizeDeps: {
//     exclude: ['events', 'url', 'http'], // Exclude these modules from the client bundle
//   },
//   // ... other Vite options
// });
