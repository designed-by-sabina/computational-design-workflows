# Transparency — An Interactive Study of Color

## Project Overview

**Transparency** is an interactive web experiment exploring how colors transform through overlap, movement, perception, and visual relationships.

The project is inspired by Josef Albers' seminal book **_Interaction of Color_ (1963)**, which explores the idea that color is not experienced as an isolated property, but is continuously affected by surrounding colors, context, and perception.

This website translates Albers' color experiments into a digital environment where transparent moving forms generate evolving color relationships. Instead of presenting colors as fixed samples, the project creates an active space for observing how colors interact over time.

---

# Concept

The central idea of the project is **transparency as an active visual experience**.

The website treats the canvas as a digital color laboratory where:

- colors overlap,
- new color relationships emerge,
- perception changes through context,
- viewers can interact with and examine individual moments.

Inspired by Albers' method of observation and experimentation, the project focuses not only on the colors themselves, but on the relationships created between them.

---

# Visual Aesthetic

The design language is influenced by:

- Josef Albers' color studies
- Bauhaus principles
- modernist graphic design
- minimalist exhibition layouts

The interface emphasizes:

- oversized typography,
- geometric simplicity,
- generous white space,
- restrained visual elements,
- color as the primary content.

The large-scale title **"TRANSPARENCY"** references Bauhaus graphic design through bold typography, strong contrast, and minimal composition.

The overall experience is designed to feel closer to a digital color study or exhibition piece rather than a traditional website interface.

---

# Interactive Features

## Animated Transparent Circles

The main canvas contains multiple transparent pastel-colored circles that:

- move continuously through the canvas,
- drift organically with smooth directional changes,
- create evolving compositions,
- respond softly near canvas boundaries,
- subtly change transparency over time.

The movement is intentionally smooth and playful, allowing users to observe gradual transformations rather than fast animation.

---

## Color Interaction and Mixing

When transparent circles overlap:

- meaningful overlap regions are detected,
- new mixed colors are generated,
- color information appears through dynamic labels,
- RGB values are displayed.

The system avoids detecting very small accidental contacts and focuses on stronger color interactions where a visible new color relationship is created.

Users can also hover over:

- individual circles to view their original color,
- overlapping regions to view the generated mixed color.

This interaction is inspired by Albers' exploration of how colors shift depending on neighboring colors and surrounding conditions.

---

## Perceptual Color Naming

Generated colors are analyzed using RGB and HSL color relationships.

Instead of assigning names only from a fixed palette, the system evaluates:

- hue,
- saturation,
- lightness,

to create more perceptually relevant color descriptions such as:

- Turquoise
- Lavender
- Peach
- Muted Green
- Light Rose

The displayed RGB values preserve the actual sampled color produced by the interaction.

---

## Pause and Observation Mode

Users can press:

```
SPACEBAR
```

to pause and resume the animation.

This allows viewers to freeze a specific composition and examine the relationships between transparent layers, similar to studying a physical color arrangement.

---

# Secondary Exercise System

Below the main experiment is a horizontal navigation system containing multiple exercise tabs.

Each tab represents a future canvas area that can be expanded with additional color studies and interactive experiments.

Current structure:

```
Exercise 01 | Exercise 02 | Exercise 03 | Exercise 04 | Exercise 05 | Exercise 06
```

The modular layout allows future assignments and experiments to be added without changing the overall website structure.

---

# Technical Implementation

The project is created using:

- HTML
- CSS
- JavaScript
- HTML Canvas API

---

## HTML

Provides:

- page structure,
- canvas containers,
- navigation tabs,
- future exercise areas,
- interactive content organization.

---

## CSS

Controls:

- Bauhaus-inspired typography,
- minimalist layout,
- responsive behavior,
- horizontal exercise navigation,
- floating color information labels,
- visual hierarchy and spacing.

---

## JavaScript

Handles:

- organic circle movement,
- transparency rendering,
- live overlap detection,
- dynamic color sampling,
- RGB and HSL color analysis,
- perceptual color naming,
- hover-based color exploration,
- discovery labels,
- color archive generation,
- pause/resume functionality,
- exercise navigation.

---

# Inspiration

Josef Albers' **_Interaction of Color_** demonstrated that color perception is relational: a color changes depending on what surrounds it.

**Transparency** transforms this principle into an interactive digital experiment where users do not simply view colors, but actively discover how colors influence and transform one another.