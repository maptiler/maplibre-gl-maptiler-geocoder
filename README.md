# MapTiler Geocoder control for MapLibre GL JS and Leaflet

A geocoder control for [maplibre-gl-js](https://github.com/maplibre/maplibre-gl-js) and [Leaflet](https://github.com/maplibre/maplibre-gl-js).

Component can be used as ES module or UMD module.

## Usage

### Usage with a module bundler

```bash
npm install --save maptiler-geocoding-control maplibre-gl
```

```js
import maplibregl from "maplibre-gl";
import { GeocodingControl } from "maptiler-geocoding-control/maplibre";
import "maptiler-geocoding-control/dist/style.css";

const API_KEY = "your API key";

const map = new maplibregl.Map({
  container: "map", // id of HTML container element
  style: "https://api.maptiler.com/maps/streets/style.json?key=" + API_KEY,
  center: [16.3, 49.2],
  zoom: 7,
});

const gc = new GeocodingControl({
  apiKey: API_KEY,
  maplibregl,
});
```

See [demo.html](./demo.html) - after building this library (`npm install && npm run build`) open it in your browser with URL `file:///path_to_this_repository/demo.html#key=your_api_key`.

## API Documentation

Options:

- `apiKey`<sup>\*</sup>: `string` - Maptiler API key
- `maplibregl`: `MapLibreGL` - A Maplibre GL instance to use when creating [Markers](https://maplibre.org/maplibre-gl-js-docs/api/markers/#marker). Required if `options.marker` is `true`.
- `debounceSearch`: `number` - Sets the amount of time, in milliseconds, to wait before querying the server when a user types into the Geocoder input box. This parameter may be useful for reducing the total number of API calls made for a single query. Default `200`.
- `proximity`: `[number, number]` - A proximity argument: this is a geographical point given as an object with latitude and longitude properties. Search results closer to this point will be given higher priority.
- `placeholder`: `string` - Override the default placeholder attribute value. Default `"Search"`.
- `errorMessage`: `string` - Override the default error message. Default `"Searching failed"`.
- `noResultsMessage`: `string` - Override the default message if no results are found. Default `"No results found"`.
- `trackProximity`: `boolean` - If true, the geocoder proximity will automatically update based on the map view. Default `true`.
- `minLength`: `number` - Minimum number of characters to enter before results are shown. Default `2`.
- `bbox`: `[number, number, number, number]` - A bounding box argument: this is a bounding box given as an array in the format [minX, minY, maxX, maxY]. Search results will be limited to the bounding box.
- `language`: `string` - Specify the language to use for response text and query result weighting. Options are IETF language tags comprised of a mandatory ISO 639-1 language code and optionally one or more IETF subtags for country or script. More than one value can also be specified, separated by commas. Set to empty string for forcing no language preference.
- `showResultsWhileTyping`: `boolean` - If `false`, indicates that search will only occur on enter key press. If `true`, indicates that the Geocoder will search on the input box being updated above the minLength option. Default `false`.
- `marker`: `boolean | MarkerOptions` - If `true`, a [Marker](https://maplibre.org/maplibre-gl-js-docs/api/markers/#marker) will be added to the map at the location of the user-selected result using a default set of Marker options. If the value is an object, the marker will be constructed using these options. If `false`, no marker will be added to the map. Requires that `options.maplibregl` also be set. Default `true`.
- `showResultMarkers`: `boolean | MarkerOptions` - If `true`, [Markers](https://maplibre.org/maplibre-gl-js-docs/api/markers/#marker) will be added to the map at the location the top results for the query. If the value is an object, the marker will be constructed using these options. If `false`, no marker will be added to the map. Requires that `options.maplibregl` also be set. Default `true`.
- `zoom`: `number` - On geocoded result what zoom level should the map animate to when a bbox isn't found in the response. If a bbox is found the map will fit to the bbox. Default `16`.
- `flyTo`: `boolean | (FlyToOptions & FitBoundsOptions)` - If `false`, animating the map to a selected result is disabled. If `true`, animating the map will use the default animation parameters. If an object, it will be passed as options to the map `flyTo` or `fitBounds` method providing control over the animation of the transition. Default `true`.
- `collapsed`: `boolean` - If `true`, the geocoder control will collapse until hovered or in focus. Default `false`.
- `clearOnBlur`: `boolean` - If true, the geocoder control will clear its value when the input blurs. Default `false`.
- `filter`: `(feature: Feature) => boolean` - A function which accepts a Feature in the Carmen GeoJSON format to filter out results from the Geocoding API response before they are included in the suggestions list. Return true to keep the item, false otherwise.
- `class`: `string` - Class of the root element.
- `enableReverse`: `boolean | string` - Set to `true` to enable reverse geocoding button with title _toggle reverse geocoding_ or set the button title directly. Default `false`.

Methods:

- `setQuery(value: string, submit = true): void` - set the query and optionally submit it
- `focus(): void` - focus the query input box
- `blur(): void` - blur the query input box
- `setReverseMode(value: boolean): void` - set reverse mode

Events:

- `select` - Fired on highlighting search result in the dropdown by hovering it or by keyboard selection. Event value will be set to the highlighted `Feature` or to `undefined` if nothing is highlighted.
- `pick` - Fired on picking the result from the dropdown. Event value will be set to the picked `Feature` or to `undefined` if nothing is picked (eg. search input is cleared).
- `optionsVisibilityChange` - Fired with `true` value if dropdown list appears, `false` if it disappears
- `featuresListed` - Fired after features are retrieved from the server. Event value contains list of features or `undefined`.
- `featuresMarked` - Fired after features are marked on the map. Event value contains list of features or `undefined`.
- `response` - Fired after HTTP response of the geocoding server. Event value contains object with requested `url` and responded `featureCollection`.
- `reversetoggle` - Fired if reverse geocoding button is toggled. Event value is `true` if reverse geocoding mode is active, otherwise `false`.
- `querychange` - Fired if query was changed. Event value is the query string.

## Svelte component

In addition to using the component as MapLibre GL Control it is alto possible to use it stand-alone in Svelte projects.
Component API matches API described above and options are exposed as component properties.

```svelte
<script lang="ts">
  import GeocodingControl from "maptiler-geocoding-control/src/lib/GeocodingControl.svelte";
  import maplibregl from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";

  const apiKey = "your API key";

  let map: maplibregl.Map;

  let container: HTMLElement;

  onMount(() => {
    map = new maplibregl.Map({
      style: "https://api.maptiler.com/maps/streets/style.json?key=" + apiKey,
      container,
    });
  }
</script>

<div class="map" bind:this={container} />

{#if map}
  <GeocodingControl {map} {apiKey} {maplibregl} />
{/if}

<style>
  .map {
    position: absolute;
    inset: 0;
  }
</style>
```

## Building

```bash
npm install && npm run build
```

You will find compilation result in `dist` directory.

## Running in dev mode

```bash
npm install && VITE_API_KEY=your_api_key npm run dev
```
