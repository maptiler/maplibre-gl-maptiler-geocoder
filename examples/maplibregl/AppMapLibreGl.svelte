<script lang="ts">
  import { Map, Marker, NavigationControl, Popup } from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import { onMount } from "svelte";
  import { GeocodingControl } from "../../src/maplibregl";

  let containerElement: HTMLElement;

  const apiKey =
    import.meta.env.VITE_API_KEY ||
    prompt("Please provide your MapTiler API key") ||
    "";

  onMount(() => {
    const map = new Map({
      style: "https://api.maptiler.com/maps/streets/style.json?key=" + apiKey,
      container: containerElement,
    });

    const geocodingControl = new GeocodingControl({
      apiKey,
      enableReverse: "always",
      collapsed: true,
      // limit: 20,
      // types: ["poi"],
      // fetchParameters: { credentials: "include" },
      // selectFirst: false,
      iconsBaseUrl: "/icons/",
      proximity: [
        { type: "map-center", minZoom: 12 },
        { type: "client-geolocation", minZoom: 8 },
        { type: "server-geolocation", minZoom: 8 },
      ],
      adjustUrl(url) {
        // for reverse geocoding use only address type
        if (/\/\d+\.?\d*%2C\d+.?\d*.json$/.test(url.pathname)) {
          url.searchParams.set("types", "address");
          url.searchParams.set("limit", "5");
        }
      },
      marker(map, feature) {
        if (!feature) {
          return;
        }

        const marker = new Marker()
          .setLngLat(feature.center)
          .setPopup(new Popup({ closeButton: false }).setText(feature.text))
          .addTo(map)
          .togglePopup();

        const element = marker.getElement();

        element.style.cursor = "pointer";

        element.addEventListener("click", (e) => {
          marker.togglePopup();
          e.stopPropagation();
        });

        return marker;
      },
      showResultMarkers(map, feature) {
        return new Marker()
          .setLngLat(feature.center)
          .setPopup(new Popup({ closeButton: false }).setText(feature.text))
          .addTo(map)
          .togglePopup();
      },
    });

    map.addControl(geocodingControl);

    geocodingControl.on("featureslisted", (e) => {
      console.log(e);
    });

    map.addControl(new NavigationControl());
  });
</script>

<main id="main" bind:this={containerElement} />

<style>
  #main {
    position: absolute;
    inset: 0;
  }
</style>
