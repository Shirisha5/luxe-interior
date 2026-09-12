# LUXE INTERIOR — Interactive 3D Architectural Experience

An editorial, interactive 3D web experience for a luxury interior architecture studio. Built with **React 19**, **Three.js**, **React Three Fiber**, **GSAP**, and **Lenis**, the application guides users through a seamless, scroll-driven journey: from a CAD blueprint wireframe to a photorealistic architectural interior, complete with real-time lighting transitions, interactive day/night atmospheres, and editorial typography.

---

## Table of Contents

1. [Overview & Architectural Vision](#overview--architectural-vision)
2. [Design System & Aesthetics](#design-system--aesthetics)
3. [Technology Stack](#technology-stack)
4. [Getting Started & Local Setup](#getting-started--local-setup)
5. [3D Graphics & Shader Pipeline](#3d-graphics--shader-pipeline)
   - [GLTF Model Loading & Normalization](#gltf-model-loading--normalization)
   - [Custom GLSL Transition Shader](#custom-glsl-transition-shader)
   - [Architectural Wireframe Shader](#architectural-wireframe-shader)
   - [Scene Lighting & Night Mode Dynamics](#scene-lighting--night-mode-dynamics)
   - [Camera Controller & Viewport Framing](#camera-controller--viewport-framing)
6. [Interactive Features & Page Sections](#interactive-features--page-sections)
   - [Architectural SVG Preloader](#architectural-svg-preloader)
   - [Hero Section](#hero-section)
   - [Adaptive Sticky Navbar](#adaptive-sticky-navbar)
   - [Day & Night Atmosphere Toggle](#day--night-atmosphere-toggle)
   - [Minimal HUD & Narrative Indicator](#minimal-hud--narrative-indicator)
   - [About Us Section](#about-us-section)
   - [Selected Works Marquee](#selected-works-marquee)
   - [Methodology & Services Table](#methodology--services-table)
   - [Grounded Studio Footer](#grounded-studio-footer)
7. [Smooth Momentum Scroll Architecture](#smooth-momentum-scroll-architecture)
8. [Responsive Engineering](#responsive-engineering)
9. [Project Directory Structure](#project-directory-structure)
10. [Asset Attribution & 3D Copyright License](#asset-attribution--3d-copyright-license)
11. [License](#license)

---

## Overview & Architectural Vision

The project bridges editorial graphic design and real-time 3D web graphics. Rather than a static catalog, it tells a progressive story divided into four distinct phases tied to the user's scroll position:

1. **The Blueprint**: Pure spatial geometry drawn from floor to ceiling as an architectural wireframe on warm drafting parchment.
2. **Materialization**: An accent crimson laser scan sweeps along the interior volume, transforming wireframe coordinates into tactile materials, wood grain, textiles, and physically-based reflections.
3. **The Sanctuary**: A fully realized Scandinavian modern bedroom and living pavilion illuminated by natural architectural sunlight and soft shadows.
4. **Day & Night**: Interactive atmospheric control enabling visitors to toggle between golden daytime sunlight and an ambient evening atmosphere with an illuminated floor lamp.

---

## Design System & Aesthetics

The aesthetic adheres to the **60-30-10** interior design rule with tailored HSL tokens:

- **60% Dominant (Background & Canvas)**: `#f2f0ea` — Warm parchment/limestone, evocative of physical architectural drafting paper.
- **30% Secondary (Wireframes, Body Text, Brand)**: `#1A2A3A` — Deep ink blue/prussian slate, delivering high-contrast legibility without harsh absolute black.
- **10% Accent (Laser Scan, CTAs, Highlights)**: `#A83226` — Rich terracotta crimson, drawing visual focus to active transitions and badges.
- **Night Mode Palette**: `#0c131d` canvas background with warm `#ffe29a` incandescent interior lighting.

### Typography
- **Headings & Titles**: `Cormorant Garamond` (classic serif) & `Syne` (modern geometric display).
- **Body & Meta Information**: `Poppins` (clean geometric sans-serif).

---

## Technology Stack

| Layer | Library / Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [React](https://react.dev/) | 19.x | Component lifecycle & UI state management |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.x | Strict type safety for 3D vectors, shaders, and UI props |
| **Build Tool** | [Vite](https://vite.dev/) | 8.x | High-speed ESM bundling & hot module replacement |
| **3D Engine** | [Three.js](https://threejs.org/) | 0.186.x | Core WebGL rendering, geometries, and lighting |
| **R3F** | [@react-three/fiber](https://r3f.docs.pmnd.rs/) | 9.x | Declarative Three.js scene graph in React |
| **R3F Helpers** | [@react-three/drei](https://github.com/pmndrs/drei) | 10.x | Environment maps, GLTF loaders, and camera utilities |
| **Animation** | [GSAP](https://greensock.com/gsap/) | 3.15.x | Timelines, ScrollTrigger, and MotionPath plugin |
| **GSAP React** | [@gsap/react](https://greensock.com/react/) | 2.x | Safe timeline cleanup and scope bindings (`useGSAP`) |
| **Smooth Scroll**| [@studio-freight/lenis](https://github.com/darkroomengineering/lenis) | 1.0.x | Inertial momentum scrolling synchronized with GSAP |

---

## Getting Started & Local Setup

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd luxe-interior
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

### Available Scripts
- `npm run dev`: Starts the local Vite development server.
- `npm run build`: Compiles TypeScript with `tsc -b` and builds the production bundle with Vite.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint across the codebase.

---

## 3D Graphics & Shader Pipeline

### GLTF Model Loading & Normalization
- The 3D model (`/models/interior.glb`) is loaded via Drei's `useGLTF` hook and preloaded for zero asset stutter.
- Bounding boxes are computed dynamically using `THREE.Box3`. The model is automatically centered and uniformly scaled to fit comfortably in the camera frustum regardless of original asset scale.
- Meshes are traversed to enable `castShadow` and `receiveShadow`, while isolating the standing floor lamp shade for independent incandescent glow control.

### Custom GLSL Transition Shader
Implemented in `src/shaders/transitionShader.ts`, the transition shader is injected directly into each Three.js standard material via `material.onBeforeCompile`.

Key Shader Capabilities:
1. **Dithered Silhouette Entrance**:
   - Uses a pseudo-random hash dither function to smoothly materialize the interior structure without abrupt opacity popping.
2. **Two-Phase Spatial Sweep**:
   - **Phase 1 (Back Wall)**: Coordinates mapped to rise vertically from floor to ceiling along the back wall (`zNorm <= wallDepth`).
   - **Phase 2 (Forward Sweep)**: The transition line sweeps along the room's Z-axis, creating a traveling planar cut.
3. **Emissive Laser Scan Line**:
   - A bright terracotta crimson band (`uScanColor`) rendered via `smoothstep` around the sweep boundary with intensity modulation (`scanBand * 2.8 * glowFade`).
4. **Architectural Shading**:
   - Wireframe/sketch regions use normal-facing curvature darkening (`edgeCurvature`) blended smoothly into realistic physically-based PBR materials behind the laser line.

### Architectural Wireframe Shader
Implemented in `src/components/InteriorModel.tsx`, a secondary wireframe mesh (`THREE.MeshBasicMaterial` with `wireframe: true`) is superimposed over every geometry:
- **Floor-to-Ceiling Draw**: Clips fragments above `uWireframeDrawProgress`, creating an architectural drawing effect.
- **Synchronized Laser Discard**: Fragments behind the forward laser sweep (`tReach < waveP`) are discarded so that the wireframe disappears in synchronization with PBR materialization.
- **Leading Edge Spark**: Computes proximity to the current height cutoff to add a subtle warm luminance spark along newly drawn lines.

### Scene Lighting & Night Mode Dynamics
Handled in `src/components/SceneLighting.tsx`:
- **Directional Sunlight**: High-resolution 2048x2048 shadow-mapped directional light casting sharp architectural shadows through the window openings.
- **Ambient Illumination**: Interpolates between warm daytime ambient (`#ffe8d0`, intensity 1.25) and moonlight indigo (`#0f1724`, intensity 0.28).
- **Recessed Ceiling Spotlight**: Focused downward spot with penumbra smoothing for soft interior falloff.
- **Floor Standing Lamp**:
  - A focused `THREE.SpotLight` pointing downward towards the rug and bed.
  - A radial `THREE.PointLight` providing warm ambient fill around the lampshade.
  - A dedicated emissive lampshade overlay (`THREE.MeshBasicMaterial` with `#ffe29a`) that glows when Night Mode is active.

### Camera Controller & Viewport Framing
Handled in `src/components/CameraController.tsx`:
- **Cinematic Interpolation**: Camera transitions smoothly from an angled isometric perspective (`[-14.5, 6.0, 16.5]`) to a straight-on one-point elevation (`[0, 3.4, 13.8]`).
- **Aspect Ratio Auto-Framing**: Calculates `aspect = width / height`. On portrait screens (phones & portrait tablets), dynamically multiplies camera distance (`zoomMult: 1.25x – 1.42x`) and raises vertical elevation (`yShift`) so the 3D cabin is fully framed without horizontal clipping.
- **Pointer Parallax**: Subtle mouse/touch pointer parallax using lerped coordinates for organic spatial depth.

---

## Interactive Features & Page Sections

### Architectural SVG Preloader
- Displays a continuous one-line architectural pavilion SVG elevation.
- Utilizes GSAP `MotionPathPlugin` to guide a red tracer bead along the perimeter while drawing the path strokes with `strokeDashoffset`.
- Features an organic numerical counter (`001%` to `100%`) and progress bar, sliding cleanly upward when loading completes.

### Hero Section
- Editorial typography featuring Cormorant Garamond italic accents and a wide landscape architectural photograph (`/spacejoy.jpg`).
- Architectural grid guide lines and draft marks.
- Continuous 360° rotating circular scroll badge (`SCROLL DOWN • EXPLORE MORE`).
- Slides smoothly upward over the first 8% of scroll to reveal the underlying 3D canvas.

### Adaptive Sticky Navbar
- **Hero-Aware Contrast Detection**: Monitors scroll position. When reverse scrolling back to the light parchment hero, the navbar automatically maintains dark ink-blue contrast, preventing text from disappearing.
- **Frosted Glass Backdrop**: Uses high-opacity frosted glass (`rgba(242, 240, 234, 0.92)` Day / `rgba(12, 19, 29, 0.92)` Night) with `backdrop-filter: blur(16px)` and subtle shadow to ensure legibility over 3D geometry.
- **Mobile Drawer**: Responsive minimalist hamburger button animating into an 'X', revealing a numbered navigation drawer (`01 ABOUT`, `02 PROJECTS`, `03 SERVICES`, `04 CONTACT`).

### Day & Night Atmosphere Toggle
- Floating glassmorphic pill switch positioned in the bottom-center.
- Smoothly toggles scene lighting, canvas background color, and ambient values between Day and Night modes.
- Hidden during Hero and footer sections to avoid UI clutter.

### Minimal HUD & Narrative Indicator
- Bottom-right narrative card displaying active stage titles (`THE BLUEPRINT`, `MATERIALIZATION`, `THE SANCTUARY`, `DAY & NIGHT`).
- Fixed hairline progress bar along the bottom edge of the viewport.

### About Us Section
- Staggered dual-image architectural showcase (`/images/about-kitchen.jpg`, `/images/about-bedroom.jpg`).
- Rotating circular award badge with an architectural star icon.
- GSAP scroll-triggered entrance animations with smooth vertical translation.

### Selected Works Marquee
- Continuous right-to-left horizontal marquee featuring curated international projects.
- Duplicated track arrays for seamless infinite looping.
- Pauses on hover/focus for accessibility and inspection.

### Methodology & Services Table
- 4-column structured methodology layout (Number, Architectural Line-Art SVG Icon, Service Title, Description).
- Interactive hover and click selection with subtle accent typography highlighting and border contrast.

### Grounded Studio Footer
- Minimalist typographic footer with company and social navigation links.
- Centered indicator dot and dynamic copyright year.

---

## Smooth Momentum Scroll Architecture

Inertial scrolling is powered by **Studio Freight Lenis** combined with **GSAP ScrollTrigger**:
1. **Lenis Initialization**: Configured with an exponential decay easing curve (`1.001 - Math.pow(2, -10 * t)`) and smooth wheel support.
2. **Ticker Synchronization**: Lenis updates are tied directly to GSAP's internal animation ticker (`gsap.ticker.add`) with `lagSmoothing(0)` to prevent frame skips during fast scrolling.
3. **Normalized Progress Tracking**: A virtual scroll track (`.scroll-track`, height: `480vh`) maps the user's scroll distance into a normalized float `[0.0, 1.0]`, smoothly lerped on every frame.

---

## Responsive Engineering

The application is engineered for fluid responsiveness across all screen sizes:
- **Desktop (1025px+)**: Full horizontal navigation, wide dual-column editorial layouts, and expanded marquee cards.
- **Tablet (769px – 1024px)**: Adjusted camera zoom, condensed service methodology table, and centered dual-image layouts.
- **Mobile (320px – 768px)**:
  - `100dvh` (Dynamic Viewport Height) prevents address bar jumping on iOS Safari and Chrome.
  - Slide-out mobile navigation drawer with body scroll lock.
  - Camera auto-framing with `1.42x` zoom distance to ensure complete 3D room visibility.
  - Responsive two-tier service rows and stacked footer navigation.

---

## Project Directory Structure

```
luxe-interior/
├── public/
│   ├── images/               # Architectural project and gallery imagery
│   ├── models/
│   │   └── interior.glb      # 3D Scandinavian interior pavilion model
│   └── spacejoy.jpg          # Hero landscape photographic render
├── src/
│   ├── components/
│   │   ├── AboutSection.tsx        # Storytelling section with staggered imagery & rotating badge
│   │   ├── AboutSection.css
│   │   ├── ArchitecturalGrid.tsx   # CAD floor drafting grid helper
│   │   ├── CameraController.tsx    # Scroll camera bezier path & responsive aspect ratio framing
│   │   ├── DayNightToggle.tsx      # Atmospheric lighting toggle switch
│   │   ├── DayNightToggle.css
│   │   ├── EditorialHero.tsx       # Initial editorial headline, framed image & scroll badge
│   │   ├── EditorialHero.css
│   │   ├── FooterSection.tsx       # Studio footer with contact info & navigation
│   │   ├── FooterSection.css
│   │   ├── InteriorModel.tsx       # 3D GLTF loader, wireframe child mesh & shader injection
│   │   ├── Loader.tsx              # Architectural SVG preloader with MotionPath animation
│   │   ├── Loader.css
│   │   ├── MinimalOverlay.tsx      # HUD stage narrative cards & hairline scroll bar
│   │   ├── MinimalOverlay.css
│   │   ├── Navbar.tsx              # Sticky navigation with hero-aware contrast & mobile drawer
│   │   ├── Navbar.css
│   │   ├── ProjectsMarquee.tsx     # Infinite right-to-left project carousel
│   │   ├── ProjectsMarquee.css
│   │   ├── SceneLighting.tsx       # Day/night sun, ambient, ceiling spot & floor lamp lights
│   │   ├── ServicesSection.tsx     # 4-column architectural methodology services table
│   │   └── ServicesSection.css
│   ├── shaders/
│   │   └── transitionShader.ts     # Custom GLSL vertex & fragment shaders for 3D reveal
│   ├── theme/
│   │   ├── colors.ts               # Centralized 60-30-10 color tokens & font stacks
│   │   ├── theme.css               # Global CSS variables & typography imports
│   │   └── index.ts
│   ├── App.tsx                     # Main application layout, 3D Canvas, & Lenis scroll sync
│   ├── App.css
│   ├── index.css                   # Global reset and base styling
│   └── main.tsx                    # React root entry point
├── index.html                      # HTML entry with Google Fonts preconnects
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Asset Attribution & 3D Copyright License

### 3D Interior Model (`interior.glb`)
- **Source Link**: [Sketchfab — "Bedroom interior design"](https://sketchfab.com/3d-models/bedroom-interior-design-d573616b117c4696895f8cb53a590630)
- **File Location**: [`/public/models/interior.glb`](file:///d:/Projects/My%20Own/React/Animations%20learning/creative-3d-Learning/luxe-interior/public/models/interior.glb)
- **Description**: Scandinavian Modern Architectural Interior Pavilion featuring realistic living and bedroom arrangements (timber ceiling rafters, bed, sofa, coffee table, standing floor lamp, shelving, and rugs).
- **Format**: Binary glTF 2.0 (`.glb`) with embedded PBR textures, normal maps, and roughness materials.
- **Copyright & Ownership**: The 3D model, original mesh topologies, and textures are the intellectual property and copyright of the original 3D creator on Sketchfab.
- **License Terms & Usage**:
  - Model: [Bedroom interior design](https://sketchfab.com/3d-models/bedroom-interior-design-d573616b117c4696895f8cb53a590630) licensed under [Creative Commons Attribution (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
  - This asset is included strictly for educational, pair-programming, research, and non-commercial portfolio presentation of WebGL custom shaders, real-time procedural wireframe rendering, and architectural lighting techniques.
  - No commercial redistribution, resale, or sublicensing of the underlying 3D geometry is permitted without explicit authorization from the original copyright holder.
  - All credits for the 3D room design, modeling, and texturing belong to the author on Sketchfab.

### Photography & Graphic Assets
- **Hero Photography** (`/public/spacejoy.jpg`): Unsplash / Spacejoy architectural photography, used under the Unsplash License (free for commercial and non-commercial use).
- **Project Showcase Imagery** (`/public/images/p1.jpg` – `p8.jpg`): Curated architectural design photography used for layout demonstration.

---

## License

- **Source Code**: Released for educational and personal portfolio demonstration under the [MIT License](LICENSE).
- **3D Assets & Media**: All 3D assets, photography, and brand graphics are copyright their respective owners.
