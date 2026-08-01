# COLOR Playground: Computational Explorations of Color

An interactive exploration of color through computational design, creative coding, data visualization, and artificial intelligence.

**COLOR Playground: Computational Explorations of Color** investigates color as an evolving system shaped by perception, history, interaction, and technology. Rather than presenting color as a collection of static swatches, the website invites visitors to experiment with color through a series of interactive studies, each exploring a different computational workflow.

**Live Website**
https://designed-by-sabina.github.io/computational-design-workflows/

---

## Project Overview

The project explores color from multiple perspectives, including optical perception, historical pigments, contemporary color forecasting, digital color mixing, collective color preferences, and AI-assisted palette generation.

Each section functions as an independent interactive experiment while contributing to a broader understanding of color as both a perceptual and computational phenomenon.

---

# Interactive Studies

## Transparency

**Explore the illusion of transparency through interaction and overlap.**

Inspired by Josef Albers' *Interaction of Color*, this experiment demonstrates how overlapping transparent forms continuously generate new visual relationships. Visitors can pause the animation, inspect individual colors, and observe how perception changes as colors interact over time.

**Features**

* Animated transparent color forms
* Dynamic color overlap detection
* Live RGB color sampling
* Perceptual color naming
* Pause and observation mode

**Technologies**

* HTML5 Canvas
* JavaScript
* CSS

---

## Deception

**Discover how color influences perception through optical illusions.**

A collection of interactive color studies demonstrating how identical colors appear different depending on surrounding colors, contrast, and context.

**Features**

* Interactive optical illusions
* Context-dependent color perception
* Color comparison exercises

**Technologies**

* HTML5 Canvas
* JavaScript
* CSS

---

## Pigment

**Trace the origins of historical pigments.**

An interactive Mapbox visualization exploring the geological origins of historical pigments and natural dyes around the world.

Visitors can investigate pigment locations, learn about their mineral sources, and connect colors with the landscapes from which they originated.

**Features**

* Interactive world map
* Historical pigment database
* Interactive popups
* Geographic exploration

**Technologies**

* Mapbox GL JS
* GeoJSON
* JavaScript

---

## Trends

**Compare annual color selections and forecasts across industries.**

An interactive timeline visualizing Color of the Year selections from multiple organizations, allowing visitors to compare annual trends and discover relationships between different forecasting systems.

**Included Sources**

* Pantone
* Benjamin Moore
* Sherwin-Williams
* Coloro × WGSN

**Features**

* Interactive D3 timeline
* Multi-source comparison
* Year-by-year exploration
* Detailed color information

**Technologies**

* D3.js
* SVG
* JavaScript

---

## Mixing

**Discover color relationships through interactive CMYK mixing.**

An interactive color laboratory where visitors experiment with Cyan, Magenta, Yellow, and Black to create new colors and explore relationships within subtractive color systems.

**Features**

* Interactive CMYK mixing
* Dynamic color generation
* Live color relationships
* Color structure exploration

**Technologies**

* JavaScript
* HTML5 Canvas
* CSS

---

## Favorite

**Share your favorite color and explore collective preferences.**

Visitors contribute their favorite color to a shared Firebase database, creating a collaborative visualization of color preferences.

**Features**

* Anonymous participation
* Firebase Firestore integration
* Collective color archive
* Live database

**Technologies**

* Firebase Authentication
* Firebase Firestore
* JavaScript

---

## Palette

**Transform color discoveries into curated palettes for architecture, interiors, graphics, fashion, exhibitions, floral design, table settings, and more.**

An AI-assisted color consultant guides visitors through a short interactive conversation before generating a personalized five-color palette inspired by discoveries made throughout the website.

Visitors can begin with:

* a discovered color or HEX value,
* a historical pigment,
* or a theme inspired by the project's interactive studies.

The assistant considers project type, mood, and design goals before generating practical color recommendations tailored to the selected discipline.

**Features**

* Interactive multi-step questionnaire
* AI-generated five-color palettes
* HEX color recommendations
* Project-specific design guidance
* Inspiration drawn from pigments, transparency, color trends, and color relationships

**Technologies**

* Firebase Authentication
* Firebase Cloud Functions
* OpenAI API
* JavaScript

---

# Technologies

* HTML5
* CSS3
* JavaScript (ES6)
* HTML5 Canvas
* D3.js
* Mapbox GL JS
* Firebase Authentication
* Firebase Firestore
* Firebase Cloud Functions
* OpenAI API
* GitHub Pages

---

# Repository Structure

```text
computational-design-workflows/
│
├── index.html
├── styles/
│   └── style.css
├── javascript/
│   ├── transparency.js
│   ├── deception.js
│   ├── pigment-map.js
│   ├── color-timeline.js
│   ├── color-mixing.js
│   ├── color-poll.js
│   └── palette-assistant.js
├── data/
│   ├── pigments.geojson
│   ├── colors-of-the-year.json
│   └── ...
├── functions/
│   ├── index.js
│   └── package.json
├── firebase.json
└── README.md
```
