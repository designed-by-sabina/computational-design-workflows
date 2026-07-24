// ==========================================
// PIGMENT ORIGINS MAP
// Mapbox GL JS + external GeoJSON
// ==========================================


// ------------------------------------------
// 1. MAPBOX ACCESS TOKEN
// ------------------------------------------

// Replace the text below with your public Mapbox token.
// Keep the quotation marks.

mapboxgl.accessToken = config.MAP_BOX_TOKEN;


// ------------------------------------------
// 2. CREATE THE MAP
// ------------------------------------------

const pigmentMap = new mapboxgl.Map({

  // The HTML container that receives the map
  container: "pigment-map",

  // Mapbox's dark base map
  style: "mapbox://styles/mapbox/dark-v11",

  // Start with the world visible
  center: [15, 25],

  // World-scale zoom
  zoom: 1.4,

  // Keep the map flat
  pitch: 0,

  // Keep north at the top
  bearing: 0,

  // Avoid creating repeated copies of the world
  renderWorldCopies: false

});


// ------------------------------------------
// 3. ADD MAP CONTROLS
// ------------------------------------------

pigmentMap.addControl(

  new mapboxgl.NavigationControl({
    showCompass: false
  }),

  "top-right"

);


// ------------------------------------------
// 4. WAIT FOR MAP TO LOAD
// ------------------------------------------

pigmentMap.on("load", function () {

  console.log("Pigment map loaded");


  // ----------------------------------------
  // 5. LOAD THE EXTERNAL GEOJSON
  // ----------------------------------------

  fetch("data/pigments.geojson")

    .then(function (response) {

      // Check that the file was found
      if (!response.ok) {
        throw new Error(
          "Could not load pigments.geojson. Status: " +
          response.status
        );
      }

      // Convert the response to usable JSON
      return response.json();

    })

    .then(function (pigmentData) {

      console.log("Pigment GeoJSON loaded:", pigmentData);


      // ------------------------------------
      // 6. ADD GEOJSON AS A MAPBOX SOURCE
      // ------------------------------------

      pigmentMap.addSource("pigment-locations", {

        type: "geojson",

        data: pigmentData

      });

console.log("Pigment source added successfully");
      // ------------------------------------
      // 7. ADD LARGE TRANSPARENT HALOS
      // ------------------------------------

    
      


      // ------------------------------------
      // 8. ADD MAIN PIGMENT POINTS
      // ------------------------------------

      pigmentMap.addLayer({

        id: "pigment-points",

        type: "circle",

        source: "pigment-locations",

        paint: {

          // Read the color from the GeoJSON
          "circle-color": ["get", "color"],

          // Points become slightly larger when zooming
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],

            1, 6,
            4, 9,
            8, 14
          ],

          "circle-opacity": 0.95,

          "circle-stroke-color": "#ffffff",

          "circle-stroke-width": 1,

          "circle-stroke-opacity": 0.7

        }

      });


      // ------------------------------------
      // 9. ADD PIGMENT NAME LABELS
      // ------------------------------------

      pigmentMap.addLayer({

        id: "pigment-labels",

        type: "symbol",

        source: "pigment-locations",

        layout: {

          // Use the pigment property as the label
          "text-field": ["get", "pigment"],

          "text-font": ["Open Sans Regular"],

          "text-size": 11,

          // Move label slightly above the point
          "text-offset": [0, -1.4],

          "text-anchor": "bottom",

          // Reduce collisions between labels
          "text-allow-overlap": false,

          "text-ignore-placement": false

        },

        paint: {

          "text-color": "#ffffff",

          "text-opacity": 0.85,

          "text-halo-color": "#171717",

          "text-halo-width": 1.5

        }

      });


      // ------------------------------------
      // 10. FIT MAP TO ALL DATA
      // ------------------------------------

      const bounds = new mapboxgl.LngLatBounds();

      pigmentData.features.forEach(function (feature) {

        bounds.extend(feature.geometry.coordinates);

      });

      pigmentMap.fitBounds(bounds, {

        padding: {
          top: 70,
          right: 70,
          bottom: 70,
          left: 70
        },

        maxZoom: 3.2,

        duration: 1600

      });

    })

    .catch(function (error) {

      console.error("Pigment data error:", error);

      showPigmentMapError(error.message);

    });

});


// ------------------------------------------
// 11. HOVER INTERACTION
// ------------------------------------------

pigmentMap.on(
  "mouseenter",
  "pigment-points",
  function () {

    // Change cursor to indicate interactivity
    pigmentMap.getCanvas().style.cursor = "pointer";

    // Make points slightly larger
    pigmentMap.setPaintProperty(
      "pigment-points",
      "circle-stroke-width",
      3
    );

  }
);


pigmentMap.on(
  "mouseleave",
  "pigment-points",
  function () {

    pigmentMap.getCanvas().style.cursor = "";

    pigmentMap.setPaintProperty(
      "pigment-points",
      "circle-stroke-width",
      1
    );

  }
);


// ------------------------------------------
// 12. CLICK POPUP
// ------------------------------------------

pigmentMap.on(
  "click",
  "pigment-points",
  function (event) {

    // Get the first clicked feature
    const feature = event.features[0];

    // Get its GeoJSON properties
    const properties = feature.properties;

    // Copy coordinates so we can safely modify them
    const coordinates =
      feature.geometry.coordinates.slice();


    // Create the popup HTML
    const popupHTML = `

      <div class="pigment-popup">

        <div
          class="pigment-popup-color"
          style="background-color: ${properties.color};">
        </div>

        <div class="pigment-popup-information">

          <div class="pigment-popup-category">
            ${properties.category}
          </div>

          <h3>
            ${properties.pigment}
          </h3>

          <div class="pigment-popup-mineral">
            ${properties.mineral}
          </div>

          <div class="pigment-popup-location">
            ${properties.location}
          </div>

          <p class="pigment-popup-description">
            ${properties.description}
          </p>

        </div>

      </div>
    `;


    // Place the popup on the map
    new mapboxgl.Popup({

      closeButton: true,

      closeOnClick: true,

      offset: 12

    })

      .setLngLat(coordinates)

      .setHTML(popupHTML)

      .addTo(pigmentMap);

  }
);


// ------------------------------------------
// 13. DISPLAY FRIENDLY ERROR MESSAGE
// ------------------------------------------

function showPigmentMapError(message) {

  const mapContainer =
    document.getElementById("pigment-map");

  const errorMessage =
    document.createElement("div");

  errorMessage.className =
    "pigment-map-error";

  errorMessage.innerHTML = `
    <strong>Map could not load.</strong><br>
    ${message}
  `;

  errorMessage.style.position = "absolute";
  errorMessage.style.top = "50%";
  errorMessage.style.left = "50%";
  errorMessage.style.transform = "translate(-50%, -50%)";
  errorMessage.style.padding = "20px";
  errorMessage.style.background = "white";
  errorMessage.style.color = "#111111";
  errorMessage.style.fontSize = "13px";
  errorMessage.style.lineHeight = "1.5";
  errorMessage.style.zIndex = "10";

  mapContainer.appendChild(errorMessage);

}


// ------------------------------------------
// 14. GENERAL MAPBOX ERROR REPORTING
// ------------------------------------------

pigmentMap.on("error", function (event) {

  console.error("Mapbox error:", event.error);

});