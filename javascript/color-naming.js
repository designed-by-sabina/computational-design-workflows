/* ==========================================
   COLOR NAMING — via W3C CSS Color Module Level 4
   Replaces ad-hoc RGB-distance naming with:
     1. sRGB -> OKLab conversion (per CSS Color 4 spec)
     2. Nearest-match against the 147 standard CSS
        named colors, compared perceptually in OKLab

   Drop this in ABOVE where getColorName() is currently
   defined in main.js, then delete the old getColorName
   function — this one is a straight replacement with
   the same signature: getColorName(rgb) -> string
   ========================================== */

// ------------------------------------------
// 1. CSS Level 4 named colors (the 147 keywords)
//    Source of truth: https://www.w3.org/TR/css-color-4/#named-colors
// ------------------------------------------
const CSS_NAMED_COLORS = {
  aliceblue:"#f0f8ff", antiquewhite:"#faebd7", aqua:"#00ffff", aquamarine:"#7fffd4",
  azure:"#f0ffff", beige:"#f5f5dc", bisque:"#ffe4c4", black:"#000000",
  blanchedalmond:"#ffebcd", blue:"#0000ff", blueviolet:"#8a2be2", brown:"#a52a2a",
  burlywood:"#deb887", cadetblue:"#5f9ea0", chartreuse:"#7fff00", chocolate:"#d2691e",
  coral:"#ff7f50", cornflowerblue:"#6495ed", cornsilk:"#fff8dc", crimson:"#dc143c",
  cyan:"#00ffff", darkblue:"#00008b", darkcyan:"#008b8b", darkgoldenrod:"#b8860b",
  darkgray:"#a9a9a9", darkgreen:"#006400", darkgrey:"#a9a9a9", darkkhaki:"#bdb76b",
  darkmagenta:"#8b008b", darkolivegreen:"#556b2f", darkorange:"#ff8c00", darkorchid:"#9932cc",
  darkred:"#8b0000", darksalmon:"#e9967a", darkseagreen:"#8fbc8f", darkslateblue:"#483d8b",
  darkslategray:"#2f4f4f", darkslategrey:"#2f4f4f", darkturquoise:"#00ced1", darkviolet:"#9400d3",
  deeppink:"#ff1493", deepskyblue:"#00bfff", dimgray:"#696969", dimgrey:"#696969",
  dodgerblue:"#1e90ff", firebrick:"#b22222", floralwhite:"#fffaf0", forestgreen:"#228b22",
  fuchsia:"#ff00ff", gainsboro:"#dcdcdc", ghostwhite:"#f8f8ff", gold:"#ffd700",
  goldenrod:"#daa520", gray:"#808080", green:"#008000", greenyellow:"#adff2f",
  grey:"#808080", honeydew:"#f0fff0", hotpink:"#ff69b4", indianred:"#cd5c5c",
  indigo:"#4b0082", ivory:"#fffff0", khaki:"#f0e68c", lavender:"#e6e6fa",
  lavenderblush:"#fff0f5", lawngreen:"#7cfc00", lemonchiffon:"#fffacd", lightblue:"#add8e6",
  lightcoral:"#f08080", lightcyan:"#e0ffff", lightgoldenrodyellow:"#fafad2", lightgray:"#d3d3d3",
  lightgreen:"#90ee90", lightgrey:"#d3d3d3", lightpink:"#ffb6c1", lightsalmon:"#ffa07a",
  lightseagreen:"#20b2aa", lightskyblue:"#87cefa", lightslategray:"#778899", lightslategrey:"#778899",
  lightsteelblue:"#b0c4de", lightyellow:"#ffffe0", lime:"#00ff00", limegreen:"#32cd32",
  linen:"#faf0e6", magenta:"#ff00ff", maroon:"#800000", mediumaquamarine:"#66cdaa",
  mediumblue:"#0000cd", mediumorchid:"#ba55d3", mediumpurple:"#9370db", mediumseagreen:"#3cb371",
  mediumslateblue:"#7b68ee", mediumspringgreen:"#00fa9a", mediumturquoise:"#48d1cc", mediumvioletred:"#c71585",
  midnightblue:"#191970", mintcream:"#f5fffa", mistyrose:"#ffe4e1", moccasin:"#ffe4b5",
  navajowhite:"#ffdead", navy:"#000080", oldlace:"#fdf5e6", olive:"#808000",
  olivedrab:"#6b8e23", orange:"#ffa500", orangered:"#ff4500", orchid:"#da70d6",
  palegoldenrod:"#eee8aa", palegreen:"#98fb98", paleturquoise:"#afeeee", palevioletred:"#db7093",
  papayawhip:"#ffefd5", peachpuff:"#ffdab9", peru:"#cd853f", pink:"#ffc0cb",
  plum:"#dda0dd", powderblue:"#b0e0e6", purple:"#800080", rebeccapurple:"#663399",
  red:"#ff0000", rosybrown:"#bc8f8f", royalblue:"#4169e1", saddlebrown:"#8b4513",
  salmon:"#fa8072", sandybrown:"#f4a460", seagreen:"#2e8b57", seashell:"#fff5ee",
  sienna:"#a0522d", silver:"#c0c0c0", skyblue:"#87ceeb", slateblue:"#6a5acd",
  slategray:"#708090", slategrey:"#708090", snow:"#fffafa", springgreen:"#00ff7f",
  steelblue:"#4682b4", tan:"#d2b48c", teal:"#008080", thistle:"#d8bfd8",
  tomato:"#ff6347", turquoise:"#40e0d0", violet:"#ee82ee", wheat:"#f5deb3",
  white:"#ffffff", whitesmoke:"#f5f5f5", yellow:"#ffff00", yellowgreen:"#9acd32"
};

// ------------------------------------------
// 2. sRGB -> OKLab conversion
//    (matrices per the CSS Color Module Level 4 spec,
//    https://www.w3.org/TR/css-color-4/#color-conversion-code)
// ------------------------------------------
function srgbToLinear(c) {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToOklab([r, g, b]) {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  // linear sRGB -> LMS
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_, // L
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_, // a
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_  // b
  ];
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// ------------------------------------------
// 3. Precompute OKLab for every named color once
// ------------------------------------------
const NAMED_COLORS_OKLAB = Object.entries(CSS_NAMED_COLORS).map(
  ([name, hex]) => ({ name, oklab: rgbToOklab(hexToRgb(hex)) })
);

// ------------------------------------------
// 4. Public function — same signature as before
// ------------------------------------------
// ------------------------------------------
// 3. Precompute OKLab + chroma for every named color once
//    Chroma = distance from the neutral gray axis (a=0, b=0)
// ------------------------------------------
const NAMED_COLORS_OKLAB = Object.entries(CSS_NAMED_COLORS).map(
  ([name, hex]) => {
    const oklab = rgbToOklab(hexToRgb(hex));
    const chroma = Math.hypot(oklab[1], oklab[2]);
    return { name, oklab, chroma };
  }
);

// Named colors sitting essentially on the neutral axis
// (gainsboro, silver, lightgray, whitesmoke, gray, white, black, etc.)
const GRAYSCALE_CHROMA_CUTOFF = 0.004;

// How close a mixed bubble color has to be to neutral before
// we let it match one of those grayscale names at all
const NEAR_NEUTRAL_TARGET_CUTOFF = 0.01;

// ------------------------------------------
// 4. Public function — same signature as before
// ------------------------------------------
function getColorName(rgb) {
  const target = rgbToOklab(rgb);
  const targetChroma = Math.hypot(target[1], target[2]);
  const targetIsNearNeutral = targetChroma < NEAR_NEUTRAL_TARGET_CUTOFF;

  let closest = null;
  let closestDist = Infinity;

  for (const entry of NAMED_COLORS_OKLAB) {
    // Skip true-gray names unless the bubble color is itself
    // essentially gray — otherwise a faint pink/blue tint keeps
    // getting swallowed by "Gainsboro".
    if (!targetIsNearNeutral && entry.chroma < GRAYSCALE_CHROMA_CUTOFF) {
      continue;
    }

    const dL = target[0] - entry.oklab[0];
    const da = target[1] - entry.oklab[1];
    const db = target[2] - entry.oklab[2];
    const dist = dL * dL + da * da + db * db;
    if (dist < closestDist) {
      closestDist = dist;
      closest = entry.name;
    }
  }

  return titleCase(closest);
}

function titleCase(str) {
  // splits camel-ish CSS names like "cornflowerblue" -> "Cornflowerblue"
  // (CSS names are single words, so this just capitalizes)
  return str.charAt(0).toUpperCase() + str.slice(1);
}