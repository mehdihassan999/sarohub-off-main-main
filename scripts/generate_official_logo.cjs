const fs = require('fs');
const { Resvg } = require('@resvg/resvg-js');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 320" width="1000" height="320" fill="none">
  <defs>
    <!-- Master Brand Linear Gradient: Yellow -> Golden Amber -> Radiant Orange -> Crimson -->
    <linearGradient id="sarohub-brand-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFE800" />
      <stop offset="22%" stop-color="#FFB800" />
      <stop offset="52%" stop-color="#FF5C00" />
      <stop offset="82%" stop-color="#FF3800" />
      <stop offset="100%" stop-color="#D61800" />
    </linearGradient>

    <linearGradient id="grad-s" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFE600" />
      <stop offset="50%" stop-color="#FFA800" />
      <stop offset="100%" stop-color="#FF5500" />
    </linearGradient>

    <linearGradient id="grad-a" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFE600" />
      <stop offset="45%" stop-color="#FF8A00" />
      <stop offset="100%" stop-color="#FF3300" />
    </linearGradient>

    <linearGradient id="grad-power" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFE600" />
      <stop offset="100%" stop-color="#FF5500" />
    </linearGradient>

    <linearGradient id="grad-r" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFE600" />
      <stop offset="50%" stop-color="#FFA500" />
      <stop offset="100%" stop-color="#FF5A00" />
    </linearGradient>

    <linearGradient id="grad-o" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFE600" />
      <stop offset="50%" stop-color="#FF8C00" />
      <stop offset="100%" stop-color="#FF3300" />
    </linearGradient>

    <linearGradient id="grad-monogram" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE600" />
      <stop offset="35%" stop-color="#FF8A00" />
      <stop offset="70%" stop-color="#FF4000" />
      <stop offset="100%" stop-color="#D61800" />
    </linearGradient>
  </defs>

  <!-- GLYPH 1: 's' (Thin Geometric Split-Arc with Center Divider) -->
  <g id="glyph-s" stroke="url(#grad-s)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
    <!-- Top Arc ending downward -->
    <path d="M 45 165 C 45 100, 95 90, 130 90 C 175 90, 215 110, 215 155" />
    <!-- Center Dividing Bar -->
    <line x1="45" y1="165" x2="195" y2="165" />
    <!-- Bottom Arc starting with rounded end -->
    <path d="M 25 175 C 25 220, 65 240, 110 240 C 155 240, 195 215, 195 165" />
  </g>

  <!-- GLYPH 2: 'a' (Power-Button Ring & Descending Stem) -->
  <g id="glyph-a" stroke="url(#grad-a)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
    <!-- Power Button Outer Circular Ring with Top Open Gap -->
    <path d="M 295 98 A 75 75 0 1 0 355 98" />
    <!-- Center Power Switch Bar / Rod -->
    <line x1="325" y1="35" x2="325" y2="125" stroke="url(#grad-power)" stroke-width="12" />
    <!-- Right Descending Stem -->
    <line x1="400" y1="90" x2="400" y2="240" stroke-width="11" />
  </g>

  <!-- GLYPH 3: 'r' (Vertical Stem + Smooth Arch) -->
  <g id="glyph-r" stroke="url(#grad-r)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left Stem -->
    <line x1="455" y1="90" x2="455" y2="240" />
    <!-- Arch Curve -->
    <path d="M 455 145 C 455 100, 495 90, 550 90 C 568 90, 580 96, 585 115" />
  </g>

  <!-- GLYPH 4: 'o' (Pristine Geometric Ring) -->
  <g id="glyph-o" stroke="url(#grad-o)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="680" cy="165" r="75" />
  </g>

  <!-- GLYPH 5: 'b' / Monogram Emblem -->
  <g id="glyph-monogram">
    <!-- 1. Upper-left 45-deg angled yellow lightning diagonal -->
    <line x1="690" y1="25" x2="765" y2="100" stroke="#FFE600" stroke-width="11" stroke-linecap="round" />
    
    <!-- 2. Upper curved loop forming the top bowl of 'b' -->
    <path d="M 765 100 C 765 45, 815 15, 868 35 C 895 45, 908 72, 908 100" 
          stroke="#FF9500" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          
    <!-- 3. Interlocking solid facet triangle/polygon prism -->
    <polygon points="780,145 895,65 895,178" fill="url(#grad-monogram)" />

    <!-- 4. Lower-right diagonal kick leg -->
    <line x1="825" y1="185" x2="900" y2="260" stroke="#E62800" stroke-width="11" stroke-linecap="round" />
  </g>
</svg>`;

fs.writeFileSync('public/assets/sarohub-logo.svg', svgContent);
fs.writeFileSync('dist/assets/sarohub-logo.svg', svgContent);
console.log('Saved SVG files');

// Render SVG to PNG using resvg-js
try {
  const resvg = new Resvg(svgContent, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  fs.writeFileSync('public/assets/sarohub-logo.png', pngBuffer);
  fs.writeFileSync('dist/assets/sarohub-logo.png', pngBuffer);
  console.log('Rendered public/assets/sarohub-logo.png and dist/assets/sarohub-logo.png at 1200px width!');
} catch (e) {
  console.error('Error rendering SVG to PNG:', e);
}
