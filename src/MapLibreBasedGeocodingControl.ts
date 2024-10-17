import type {
  Evented,
  FillLayerSpecification,
  FitBoundsOptions,
  FlyToOptions,
  LineLayerSpecification,
  Map,
  MarkerOptions,
} from "maplibre-gl";
import type { SvelteComponent } from "svelte";
import GeocodingControlComponent from "./GeocodingControl.svelte";
import {
  createMapLibreGlMapController,
  type MapLibreGL,
} from "./maplibregl-controller";
import type { ControlOptions } from "./types";
export { createMapLibreGlMapController } from "./maplibregl-controller";

export type MapLibreBaseControlOptions = Omit<ControlOptions, "apiKey"> & {
  /**
   * If `true`, a [Marker](https://maplibre.org/maplibre-gl-js-docs/api/markers/#marker) will be added to the map at the location of the user-selected result using a default set of Marker options.
   * If the value is an object, the marker will be constructed using these options.
   * If `false`, no marker will be added to the map.
   * Requires that `options.maplibregl` also be set.
   * Default value is `true`.
   */
  marker?: boolean | MarkerOptions;

  /**
   * If `true`, [Markers](https://maplibre.org/maplibre-gl-js-docs/api/markers/#marker) will be added to the map at the location the top results for the query.
   * If the value is an object, the marker will be constructed using these options.
   * If `false`, no marker will be added to the map.
   * Requires that `options.maplibregl` also be set.
   * Default value is `true`.
   */
  showResultMarkers?: boolean | MarkerOptions;

  /**
   * If `false`, animating the map to a selected result is disabled.
   * If `true`, animating the map will use the default animation parameters.
   * If an object, it will be passed as options to the map `flyTo` or `fitBounds` method providing control over the animation of the transition.
   * Default value is `true`.
   */
  flyTo?: boolean | (FlyToOptions & FitBoundsOptions);

  /**
   * Style for full feature geometry GeoJSON.
   */
  fullGeometryStyle?: {
    fill: Pick<FillLayerSpecification, "layout" | "paint" | "filter">;
    line: Pick<LineLayerSpecification, "layout" | "paint" | "filter">;
  };
};

export type Props<T> = T extends SvelteComponent<infer P> ? P : never;

type EventedConstructor = new (
  ...args: ConstructorParameters<typeof Evented>
) => Evented;

export function crateBaseClass(
  Evented: EventedConstructor,
  maplibreGl: MapLibreGL,
  getExtraProps?: (
    map: Map,
    div: HTMLElement,
  ) => Partial<Props<GeocodingControlComponent>>,
) {
  return class MapLibreBasedGeocodingControl<
    T extends MapLibreBaseControlOptions,
  > extends Evented {
    #gc?: GeocodingControlComponent;

    #options: T;

    constructor(options: T = {} as T) {
      super();

      this.#options = options;
    }

    onAddInt(map: Map): HTMLElement {
      const div = document.createElement("div");

      div.className =
        "mapboxgl-ctrl-geocoder mapboxgl-ctrl maplibregl-ctrl-geocoder maplibregl-ctrl mapboxgl-ctrl-group";

      const {
        marker,
        showResultMarkers,
        flyTo,
        fullGeometryStyle,
        ...restOptions
      } = this.#options;

      const flyToOptions = typeof flyTo === "boolean" ? {} : flyTo;

      const mapController = createMapLibreGlMapController(
        map,
        maplibreGl,
        marker,
        showResultMarkers,
        flyToOptions,
        flyToOptions,
        fullGeometryStyle,
      );

      const props = {
        mapController,
        flyTo: flyTo === undefined ? true : !!flyTo,
        apiKey: "", // just to satisfy apiKey; TODO find a better solution
        ...getExtraProps?.(map, div),
        ...restOptions,
      };

      if (!props.apiKey) {
        throw new Error("no apiKey provided");
      }

      this.#gc = new GeocodingControlComponent({ target: div, props });

      for (const eventName of [
        "select",
        "pick",
        "featuresListed",
        "featuresMarked",
        "response",
        "optionsVisibilityChange",
        "reverseToggle",
        "queryChange",
      ] as const) {
        this.#gc.$on(eventName, (event) => {
          this.fire(eventName, event.detail);
        });
      }

      return div;
    }

    setOptions(options: T) {
      this.#options = options;

      const {
        marker,
        showResultMarkers,
        flyTo,
        fullGeometryStyle,
        ...restOptions
      } = this.#options;

      this.#gc?.$set(restOptions);
    }

    setQuery(value: string, submit = true) {
      this.#gc?.setQuery(value, submit);
    }

    clearMap() {
      this.#gc?.clearMap();
    }

    clearList() {
      this.#gc?.clearList();
    }

    setReverseMode(value: boolean) {
      this.#gc?.$set({ reverseActive: value });
    }

    focus() {
      this.#gc?.focus();
    }

    blur() {
      this.#gc?.blur();
    }

    onRemove() {
      this.#gc?.$destroy();
    }
  };
}
