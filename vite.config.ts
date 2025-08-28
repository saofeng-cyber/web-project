import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [tailwindcss()],
    server: {
      open: true,
    },
  };
});
