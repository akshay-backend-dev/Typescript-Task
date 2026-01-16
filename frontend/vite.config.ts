import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // To open project on another desktop at port: 5173 make host TRUE
    host: false, 
    port: 5173,
    strictPort: true,
  },
});