const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

// 1. Full Square Icon SVG
const squareSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#091326" />
      <stop offset="50%" stop-color="#0F1F3D" />
      <stop offset="100%" stop-color="#070D1A" />
    </linearGradient>

    <linearGradient id="nomanGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="40%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>

    <linearGradient id="royalBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="50%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>

    <linearGradient id="profitGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>

    <linearGradient id="glowArea" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#3B82F6" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Base Icon Container with Standard Legacy Corner Radius -->
  <rect width="512" height="512" rx="100" fill="url(#bgGrad)" />
  <rect x="12" y="12" width="488" height="488" rx="92" fill="none" stroke="#2563EB" stroke-width="4" stroke-opacity="0.4" />
  
  <path d="M 80 390 Q 180 370, 260 280 T 432 120 L 432 410 L 80 410 Z" fill="url(#glowArea)" />
  <path d="M 72 380 Q 180 350, 260 270 T 430 115" fill="none" stroke="url(#royalBlueGrad)" stroke-width="14" stroke-linecap="round" stroke-opacity="0.65" />
  
  <g>
    <!-- Left Pillar of 'N' -->
    <path d="M 120 370 L 120 142 C 120 130 130 120 142 120 L 168 120 C 180 120 190 130 190 142 L 190 370 C 190 382 180 392 168 392 L 142 392 C 130 392 120 382 120 370 Z" 
          fill="url(#royalBlueGrad)" />

    <!-- Right Pillar of 'N' -->
    <path d="M 322 370 L 322 142 C 322 130 332 120 344 120 L 370 120 C 382 120 392 130 392 142 L 392 370 C 392 382 382 392 370 392 L 344 392 C 332 392 322 382 322 370 Z" 
          fill="url(#royalBlueGrad)" />

    <!-- Dynamic Diagonal of 'N' -->
    <path d="M 152 140 L 346 362 C 354 371 368 371 376 362 L 388 348 C 394 340 393 328 385 320 L 192 124 C 184 115 170 115 162 124 L 150 138 C 146 142 148 148 152 140 Z" 
          fill="url(#nomanGold)" />

    <path d="M 170 145 L 355 356 C 358 360 365 360 369 356 L 372 352 C 374 349 373 345 370 341 L 185 130 C 181 126 174 126 170 130 Z" 
          fill="#D97706" opacity="0.4" />
  </g>

  <!-- Central Rupee Symbol (₹) in Golden Shield Badge -->
  <g transform="translate(196, 196)">
    <circle cx="60" cy="60" r="58" fill="#091326" stroke="url(#nomanGold)" stroke-width="5" />
    <circle cx="60" cy="60" r="50" fill="none" stroke="#3B82F6" stroke-width="1.5" stroke-opacity="0.4" />
    <text x="60" y="81" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="64" fill="url(#nomanGold)" text-anchor="middle">₹</text>
  </g>

  <!-- Golden Profit Accent Star -->
  <g transform="translate(430, 115)">
    <circle cx="0" cy="0" r="14" fill="url(#profitGreen)" />
    <path d="M 0 -20 L 4 -6 L 18 -2 L 6 6 L 10 20 L 0 11 L -10 20 L -6 6 L -18 -2 L -4 -6 Z" fill="url(#nomanGold)" transform="scale(0.85)" />
  </g>
</svg>
`;

// 2. Round Icon SVG
const roundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#091326" />
      <stop offset="50%" stop-color="#0F1F3D" />
      <stop offset="100%" stop-color="#070D1A" />
    </linearGradient>

    <linearGradient id="nomanGoldR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="40%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>

    <linearGradient id="royalBlueGradR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="50%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>

    <linearGradient id="profitGreenR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>

    <clipPath id="circleClip">
      <circle cx="256" cy="256" r="252" />
    </clipPath>
  </defs>

  <g clip-path="url(#circleClip)">
    <circle cx="256" cy="256" r="256" fill="url(#bgGradR)" />
    <circle cx="256" cy="256" r="248" fill="none" stroke="#2563EB" stroke-width="6" stroke-opacity="0.45" />

    <g transform="translate(0, 0)">
      <!-- Left Pillar of 'N' -->
      <path d="M 130 360 L 130 152 C 130 140 140 130 152 130 L 174 130 C 186 130 196 140 196 152 L 196 360 C 196 372 186 382 174 382 L 152 382 C 140 382 130 372 130 360 Z" 
            fill="url(#royalBlueGradR)" />

      <!-- Right Pillar of 'N' -->
      <path d="M 316 360 L 316 152 C 316 140 326 130 338 130 L 360 130 C 372 130 382 140 382 152 L 382 360 C 382 372 372 382 360 382 L 338 382 C 326 382 316 372 316 360 Z" 
            fill="url(#royalBlueGradR)" />

      <!-- Dynamic Diagonal of 'N' -->
      <path d="M 158 146 L 342 356 C 350 365 364 365 372 356 L 382 344 C 388 336 387 325 379 317 L 196 130 C 188 121 174 121 166 130 L 156 142 C 153 145 155 151 158 146 Z" 
            fill="url(#nomanGoldR)" />
    </g>

    <!-- Central Rupee Symbol (₹) in Golden Shield Badge -->
    <g transform="translate(196, 196)">
      <circle cx="60" cy="60" r="54" fill="#091326" stroke="url(#nomanGoldR)" stroke-width="4.5" />
      <text x="60" y="80" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="60" fill="url(#nomanGoldR)" text-anchor="middle">₹</text>
    </g>

    <!-- Golden Profit Accent Star -->
    <g transform="translate(416, 130)">
      <circle cx="0" cy="0" r="12" fill="url(#profitGreenR)" />
      <path d="M 0 -18 L 3 -5 L 16 -2 L 5 5 L 9 18 L 0 10 L -9 18 L -5 5 L -16 -2 L -3 -5 Z" fill="url(#nomanGoldR)" transform="scale(0.8)" />
    </g>
  </g>
</svg>
`;

// 3. Foreground SVG for Adaptive Icons (108dp canvas with safe zone in 72dp center)
const foregroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" width="108" height="108">
  <defs>
    <linearGradient id="fgGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="40%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>

    <linearGradient id="fgBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="50%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>

    <linearGradient id="fgGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>

  <!-- Center group scaled to fit safely within 72dp diameter (scale ~ 0.12 of 512) -->
  <g transform="translate(54, 54) scale(0.125) translate(-256, -256)">
    <!-- Upward Trend Line -->
    <path d="M 72 380 Q 180 350, 260 270 T 430 115" fill="none" stroke="url(#fgBlue)" stroke-width="16" stroke-linecap="round" stroke-opacity="0.8" />

    <!-- Left Pillar of 'N' -->
    <path d="M 120 370 L 120 142 C 120 130 130 120 142 120 L 168 120 C 180 120 190 130 190 142 L 190 370 C 190 382 180 392 168 392 L 142 392 C 130 392 120 382 120 370 Z" 
          fill="url(#fgBlue)" />

    <!-- Right Pillar of 'N' -->
    <path d="M 322 370 L 322 142 C 322 130 332 120 344 120 L 370 120 C 382 120 392 130 392 142 L 392 370 C 392 382 382 392 370 392 L 344 392 C 332 392 322 382 322 370 Z" 
          fill="url(#fgBlue)" />

    <!-- Dynamic Diagonal of 'N' -->
    <path d="M 152 140 L 346 362 C 354 371 368 371 376 362 L 388 348 C 394 340 393 328 385 320 L 192 124 C 184 115 170 115 162 124 L 150 138 C 146 142 148 148 152 140 Z" 
          fill="url(#fgGold)" />

    <!-- Central Rupee Symbol (₹) in Golden Shield Badge -->
    <g transform="translate(196, 196)">
      <circle cx="60" cy="60" r="56" fill="#061326" stroke="url(#fgGold)" stroke-width="5" />
      <text x="60" y="81" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="64" fill="url(#fgGold)" text-anchor="middle">₹</text>
    </g>

    <!-- Golden Profit Accent Star -->
    <g transform="translate(430, 115)">
      <circle cx="0" cy="0" r="14" fill="url(#fgGreen)" />
      <path d="M 0 -20 L 4 -6 L 18 -2 L 6 6 L 10 20 L 0 11 L -10 20 L -6 6 L -18 -2 L -4 -6 Z" fill="url(#fgGold)" transform="scale(0.85)" />
    </g>
  </g>
</svg>
`;

function renderSvgToPng(svgString, width, height) {
  const resvg = new Resvg(svgString, {
    fitTo: {
      mode: 'width',
      value: width,
    },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

const densities = [
  { folder: 'mipmap-mdpi', iconSize: 48, fgSize: 108 },
  { folder: 'mipmap-hdpi', iconSize: 72, fgSize: 162 },
  { folder: 'mipmap-xhdpi', iconSize: 96, fgSize: 216 },
  { folder: 'mipmap-xxhdpi', iconSize: 144, fgSize: 324 },
  { folder: 'mipmap-xxxhdpi', iconSize: 192, fgSize: 432 },
];

const baseResDir = path.join(__dirname, '../android/app/src/main/res');

densities.forEach(({ folder, iconSize, fgSize }) => {
  const dir = path.join(baseResDir, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 1. ic_launcher.png
  const launcherPng = renderSvgToPng(squareSvg, iconSize, iconSize);
  fs.writeFileSync(path.join(dir, 'ic_launcher.png'), launcherPng);

  // 2. ic_launcher_round.png
  const roundPng = renderSvgToPng(roundSvg, iconSize, iconSize);
  fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), roundPng);

  // 3. ic_launcher_foreground.png
  const fgPng = renderSvgToPng(foregroundSvg, fgSize, fgSize);
  fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), fgPng);

  console.log(`Generated valid PNGs for ${folder} (icon: ${iconSize}x${iconSize}, fg: ${fgSize}x${fgSize})`);
});

console.log('All Android launcher PNG icons generated successfully with valid binary PNG headers!');
