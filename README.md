# California Is a Story — Interactive Storymap

This micro‑site visualizes Deborah Miranda’s refrain that *“California is a story”* by pairing place‑based data with literary passages.  Hover or click the pins, then drag the timeline to watch extraction, memory, and survivance layer across the Santa Barbara coast.

## Quick Start
1.  **Clone** the repo and open `storymap/index.html` in a browser, or deploy to any static host.
2.  **Native‑Land tiles:** Register a free account at <https://native-land.ca>. 
3.  **Add new events & passages:**
    * Append a GeoJSON feature in `data/events.geojson`.
    * Add a matching entry in `data/passages.json` (`passageId` fields must correspond).
4.  **Optional audio:** Replace `assets/audio/kelp.mp3` with a short ambient wav/mp3 no larger than 1 MB.

## Dependencies (CDN)
* **Leaflet 1.9.4** — interactive maps
* **leaflet-timeline-slider 1.0.5** — binds data visibility to a year slider
* **noUiSlider 15.7.0** — accessible range slider UI

Everything else is vanilla JS and CSS.

## License
Code is MIT.  Text excerpts © Deborah A. Miranda; quoted under fair‑use for scholarly, nonprofit display.