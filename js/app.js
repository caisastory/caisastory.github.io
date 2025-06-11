/* global L, noUiSlider */

const INITIAL_YEAR = 1769;  // Portolá expedition
const MAX_YEAR = new Date().getFullYear();
let passages = {};
let eventsLayer;

// 1  Create the base map
const map = L.map('map', {
  attributionControl: false,
}).setView([34.407, -119.692], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

// 2  Native Land overlay (requires free Mapbox token)
const NATIVE_LAND_TILESET =
  'https://api.mapbox.com/styles/v1/native-land/ckp57y81m0apl17o8bzllyddu/tiles/256/{z}/{x}/{y}@2x?access_token=7qM2eTyozYjwYuQ6M6AkC';

L.tileLayer(NATIVE_LAND_TILESET, {
  opacity: 1,
  attribution:
    'Indigenous territories © Native Land Digital',
}).addTo(map);


// 3  Load Miranda passages first so pop‑ups can reference them
fetch('data/passages.json')
  .then((r) => r.json())
  .then((data) => {
    passages = data;
    return fetch('data/events.geojson');
  })
  .then((r) => r.json())
  .then(initEventsLayer)
  .catch((err) => console.error(err));


function initEventsLayer(geojson) {
  eventsLayer = L.geoJSON(geojson, {
  pointToLayer: (feature, latlng) => {
    const category = feature.properties.category || 'default';
    const icon = L.icon({
      iconUrl: `assets/image/${category}.png`,
      iconSize: [32, 32], // adjust size as needed
      iconAnchor: [16, 32], // anchor point so bottom of icon points to the location
      popupAnchor: [0, -32], // position of the popup relative to the icon
      errorOverlayUrl: 'assets/image/default.png'
    });
    return L.marker(latlng, { icon });
  },
  onEachFeature: (feature, layer) => {
    layer.bindPopup(buildPopup(feature.properties));
  },
  }).addTo(map);

  // Build the timeline slider only after the data is ready
  buildSlider(geojson);
  filterEvents(INITIAL_YEAR);
}

function buildPopup(props) {
  let html = '<div class="popup-content">';
  if (passages[props.passageId]) {
    html += `<blockquote class="miranda">${passages[props.passageId].text}</blockquote>`;
  }
  html += `<h3>${props.title}</h3><p>${props.description}</p>`;
  if (passages[props.passageId]?.audio) {
    html += `<audio controls src="${passages[props.passageId].audio}"></audio>`;
  }
  html += '</div>';
  return html;
}

function buildSlider(geojson) {
  const years = geojson.features.map((f) => f.properties.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years, MAX_YEAR);

  const slider = document.getElementById('timeSlider');
  noUiSlider.create(slider, {
    start: [minYear],
    step: 1,
    range: { min: minYear, max: maxYear },
    connect: [true, false],
    tooltips: true,
    format: {
      to: (v) => Math.floor(v),
      from: (v) => Number(v),
    },
  });

  slider.noUiSlider.on('update', (values) => {
    const yr = parseInt(values[0], 10);
    filterEvents(yr);
  });

  // Legend
  document.getElementById('legend').innerHTML =
    '<strong>Timeline</strong><br>Drag slider ⇩';
}

function filterEvents(year) {
  eventsLayer.eachLayer((layer) => {
    const eventYear = layer.feature.properties.year;
    const visible = Math.abs(eventYear - year) <= 10;


    const el = layer.getElement();
    if (el) {
      el.style.opacity = visible ? '1' : '0';
      el.style.pointerEvents = visible ? 'auto' : 'none';
    }

    if (!visible && layer.isPopupOpen()) {
      layer.closePopup();
    }
  });
}