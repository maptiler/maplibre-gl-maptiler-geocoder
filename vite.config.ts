import { svelte } from "@sveltejs/vite-plugin-svelte";
import preprocess from "svelte-preprocess";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: preprocess(),
    }),
  ],
  publicDir: "public",
  build: {
    sourcemap: true,
    emptyOutDir: false,
    lib:
      // simplify after https://github.com/vitejs/vite/pull/10609 is released
      process.env.FLAVOUR === "leaflet"
        ? {
            fileName: "leaflet",
            entry: ["src/leaflet.ts"],
            name: "leafletMaptilerGeocoder",
            formats: ["es", "umd"],
          }
        : process.env.FLAVOUR === "maplibre"
        ? {
            fileName: "maplibregl",
            entry: ["src/maplibregl.ts"],
            name: "maplibreglMaptilerGeocoder",
            formats: ["es", "umd"],
          }
        : process.env.FLAVOUR === "maptilersdk"
        ? {
            fileName: "maptilersdk",
            entry: ["src/maptilersdk.ts"],
            name: "maptilersdkMaptilerGeocoder",
            formats: ["es", "umd"],
          }
        : process.env.FLAVOUR === "openlayers"
        ? {
            fileName: "openlayers",
            entry: ["src/openlayers.ts"],
            name: "openlayersMaptilerGeocoder",
            formats: ["es", "umd"],
          }
        : process.env.FLAVOUR === "react"
        ? {
            fileName: "react",
            entry: ["src/react.ts"],
            name: "reactMaptilerGeocoder",
            formats: ["es", "umd"],
          }
        : process.env.FLAVOUR === "vanilla"
        ? {
            fileName: "vanilla",
            entry: ["src/vanilla.ts"],
            name: "maptilerGeocoder",
            formats: ["es", "umd"],
          }
        : process.env.FLAVOUR === "leaflet-controller"
        ? {
            fileName: "leaflet-controller",
            entry: ["src/leaflet-controller.ts"],
            name: "leafletMaptilerGeocodingController",
            formats: ["es", "umd"],
          }
        : process.env.FLAVOUR === "maplibregl-controller"
        ? {
            fileName: "maplibregl-controller",
            entry: ["src/maplibregl-controller.ts"],
            name: "maplibreglMaptilerGeocodingController",
            formats: ["es", "umd"],
          }
        : process.env.FLAVOUR === "openlayers-controller"
        ? {
            fileName: "openlayers-controller",
            entry: ["src/openlayers-controller.ts"],
            name: "openlayersMaptilerGeocodingController",
            formats: ["es", "umd"],
          }
        : undefined,
    rollupOptions: {
      external: [
        "@maptiler/sdk",
        "maplibre-gl",
        "leaflet",
        "react",
        "react-dom",
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          "@maptiler/sdk": "maptilersdk",
          "maplibre-gl": "maplibregl",
          leaflet: "L",
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
