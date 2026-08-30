import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const densities = [
  { name: 'mdpi', size: 48, fgSize: 108 },
  { name: 'hdpi', size: 72, fgSize: 162 },
  { name: 'xhdpi', size: 96, fgSize: 216 },
  { name: 'xxhdpi', size: 144, fgSize: 324 },
  { name: 'xxxhdpi', size: 192, fgSize: 432 }
];

const iconSvgPath = path.resolve('public/icon.svg');
if (!fs.existsSync(iconSvgPath)) {
  console.error('Source icon not found at:', iconSvgPath);
  process.exit(1);
}

const iconSvg = fs.readFileSync(iconSvgPath, 'utf8');

// Round icon SVG with circular clipping
const roundIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <clipPath id="circleClip">
      <circle cx="256" cy="256" r="252" />
    </clipPath>
  </defs>
  <g clip-path="url(#circleClip)">
    ${iconSvg.replace(/<\?xml.*?\?>/i, '').replace(/<svg[^>]*>/i, '').replace(/<\/svg>/i, '')}
  </g>
</svg>`;

// Foreground SVG for adaptive launcher (transparent background, emblem centered in safe zone)
const foregroundSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
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

    <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.6" />
    </filter>
    <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Scale and center emblem within safe 72dp zone of 108dp viewport (scale: 0.72) -->
  <g transform="translate(256, 256) scale(0.72) translate(-256, -256)">
    <!-- Central Geometric NOMAN 'N' Emblem -->
    <g filter="url(#logoShadow)">
      <path d="M 120 370 L 120 142 C 120 130 130 120 142 120 L 168 120 C 180 120 190 130 190 142 L 190 370 C 190 382 180 392 168 392 L 142 392 C 130 392 120 382 120 370 Z" 
            fill="url(#royalBlueGrad)" />

      <path d="M 322 370 L 322 142 C 322 130 332 120 344 120 L 370 120 C 382 120 392 130 392 142 L 392 370 C 392 382 382 392 370 392 L 344 392 C 332 392 322 382 322 370 Z" 
            fill="url(#royalBlueGrad)" />

      <path d="M 152 140 L 346 362 C 354 371 368 371 376 362 L 388 348 C 394 340 393 328 385 320 L 192 124 C 184 115 170 115 162 124 L 150 138 C 146 142 148 148 152 140 Z" 
            fill="url(#nomanGold)" />

      <path d="M 170 145 L 355 356 C 358 360 365 360 369 356 L 372 352 C 374 349 373 345 370 341 L 185 130 C 181 126 174 126 170 130 Z" 
            fill="#D97706" opacity="0.4" />
    </g>

    <!-- Central Rupee Symbol (₹) in Golden Shield Badge -->
    <g transform="translate(196, 196)" filter="url(#badgeShadow)">
      <circle cx="60" cy="60" r="58" fill="#091326" stroke="url(#nomanGold)" stroke-width="4.5" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="#3B82F6" stroke-width="1.5" stroke-opacity="0.4" />
      <text x="60" y="81" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="64" fill="url(#nomanGold)" text-anchor="middle">₹</text>
    </g>

    <!-- Golden Profit Accent Star / Sparkle in Top Right -->
    <g transform="translate(430, 115)">
      <circle cx="0" cy="0" r="14" fill="url(#profitGreen)" filter="url(#badgeShadow)" />
      <path d="M 0 -20 L 4 -6 L 18 -2 L 6 6 L 10 20 L 0 11 L -10 20 L -6 6 L -18 -2 L -4 -6 Z" fill="url(#nomanGold)" transform="scale(0.85)" />
    </g>
  </g>
</svg>`;

export async function generateAndroidIcons() {
  console.log('Generating valid binary PNG launcher icons from public/icon.svg...');

  for (const d of densities) {
    const dir = path.resolve('android/app/src/main/res', `mipmap-${d.name}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 1. ic_launcher.png
    await sharp(Buffer.from(iconSvg))
      .resize(d.size, d.size)
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(path.join(dir, 'ic_launcher.png'));

    // 2. ic_launcher_round.png
    await sharp(Buffer.from(roundIconSvg))
      .resize(d.size, d.size)
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    // 3. ic_launcher_foreground.png
    await sharp(Buffer.from(foregroundSvg))
      .resize(d.fgSize, d.fgSize)
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));

    console.log(`✓ mipmap-${d.name}: ic_launcher (${d.size}x${d.size}), round (${d.size}x${d.size}), foreground (${d.fgSize}x${d.fgSize})`);
  }

  // Ensure capacitor.settings.gradle resolves :capacitor-android to local vendor module
  const capSettingsPath = path.resolve('android/capacitor.settings.gradle');
  if (fs.existsSync(capSettingsPath)) {
    let content = fs.readFileSync(capSettingsPath, 'utf8');
    if (content.includes("project(':capacitor-android').projectDir = new File('../node_modules/@capacitor/android/capacitor')")) {
      content = content.replace(
        "project(':capacitor-android').projectDir = new File('../node_modules/@capacitor/android/capacitor')",
        "project(':capacitor-android').projectDir = new File('./capacitor-android')"
      );
      fs.writeFileSync(capSettingsPath, content, 'utf8');
      console.log('✓ Updated capacitor.settings.gradle to use local ./capacitor-android module');
    }
  }

  // Ensure capacitor-cordova-android-plugins AndroidManifest has package attribute
  const cordovaManifestPath = path.resolve('android/capacitor-cordova-android-plugins/src/main/AndroidManifest.xml');
  if (fs.existsSync(cordovaManifestPath)) {
    let manifestContent = fs.readFileSync(cordovaManifestPath, 'utf8');
    if (!manifestContent.includes('package=')) {
      manifestContent = manifestContent.replace(
        /<manifest\b/,
        '<manifest package="capacitor.cordova.android.plugins"'
      );
      fs.writeFileSync(cordovaManifestPath, manifestContent, 'utf8');
      console.log('✓ Ensured package attribute in capacitor-cordova-android-plugins AndroidManifest.xml');
    }
  }

  console.log('All Android launcher PNG icons successfully generated and saved to source repository.');
}

generateAndroidIcons().catch(err => {
  console.error('Error generating Android launcher icons:', err);
  process.exit(1);
});
