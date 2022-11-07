import * as L from "leaflet";
import GeocodingControlComponent from "./GeocodingControl.svelte";
import { createLeafletMapController } from "./LeafletMapControllerImpl";
import type { ControlOptions, Feature } from "./types";

export type { Feature } from "./types";

type LeafletControlOptions = ControlOptions &
  L.ControlOptions & {
    /**
     * If `true`, a [Marker](https://leafletjs.com/reference.html#marker) will be added to the map at the location of the user-selected result using a default set of Marker options.
     * If the value is an object, the marker will be constructed using these options.
     * If `false`, no marker will be added to the map.
     *
     * @default true
     */
    marker?: boolean | L.MarkerOptions;

    /**
     * If `true`, [Markers](https://leafletjs.com/reference.html#marker) will be added to the map at the location the top results for the query.
     * If the value is an object, the marker will be constructed using these options.
     * If `false`, no marker will be added to the map.
     *
     * @default true
     */
    showResultMarkers?: boolean | L.MarkerOptions;

    /**
     * If `false`, animating the map to a selected result is disabled.
     * If `true`, animating the map will use the default animation parameters.
     * If an object, it will be passed as options to the map `flyTo` or `fitBounds` method providing control over the animation of the transition.
     *
     * @default true
     */
    flyTo?: boolean | (L.ZoomPanOptions & L.FitBoundsOptions);
  };

export class GeocodingControl extends L.Control {
  #gc?: GeocodingControlComponent;

  #options: LeafletControlOptions;

  constructor(options: LeafletControlOptions) {
    super();

    this.#options = options;
  }

  onAdd(map: L.Map) {
    const div = document.createElement("div");

    div.className = "leaflet-ctrl-geocoder";

    const { marker, showResultMarkers, flyTo, ...restOptions } = this.#options;

    const flyToOptions = typeof flyTo === "boolean" ? {} : flyTo;

    const mapController = createLeafletMapController(
      map,
      marker,
      showResultMarkers,
      flyToOptions,
      flyToOptions
    );

    this.#gc = new GeocodingControlComponent({
      target: div,
      props: {
        mapController,
        flyTo: flyTo === undefined ? true : !!flyTo,
        ...restOptions,
      },
    });

    for (const eventName of [
      "select",
      "pick",
      "featuresListed",
      "featuresMarked",
      "response",
      "optionsVisibilityChange",
      "reverseToggle",
      "queryChange",
    ]) {
      this.#gc.$on(eventName, (event) =>
        map.fire(eventName.toLowerCase(), event.detail)
      );
    }

    return div;
  }

  setOptions(options: LeafletControlOptions) {
    this.#options = options;

    const { marker, showResultMarkers, flyTo, ...restOptions } = this.#options;

    this.#gc?.$set(restOptions);
  }

  setQuery(value: string, submit = true) {
    (this.#gc as any)?.setQuery(value, submit);
  }

  setReverseMode(value: boolean) {
    this.#gc?.$set({ reverseActive: value });
  }

  focus() {
    (this.#gc as any)?.focus();
  }

  blur() {
    (this.#gc as any)?.blur();
  }

  onRemove() {
    (this.#gc as any)?.$destroy();
  }
}
