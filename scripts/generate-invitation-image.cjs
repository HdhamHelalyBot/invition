const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Generate dried pampas grass and botanical watercolor elements
function generatePampasFronds(x, y, scale = 1, rotation = 0) {
  let elements = '';
  // Multiple overlapping watercolor pampas plumes
  const plumes = [
    { angle: -45, len: 320, width: 26, color: '#D9C8B2', opacity: 0.8 },
    { angle: -30, len: 380, width: 32, color: '#CBB499', opacity: 0.85 },
    { angle: -15, len: 440, width: 36, color: '#BBA080', opacity: 0.9 },
    { angle: 0, len: 480, width: 40, color: '#AA8C68', opacity: 0.95 },
    { angle: 15, len: 450, width: 38, color: '#BF9E77', opacity: 0.88 },
    { angle: 30, len: 400, width: 34, color: '#D0BBA0', opacity: 0.82 },
    { angle: 45, len: 340, width: 28, color: '#DFCDB8', opacity: 0.78 },
    { angle: 60, len: 280, width: 24, color: '#E9DDD0', opacity: 0.75 },
    // Accent delicate feathers
    { angle: -8, len: 410, width: 18, color: '#8F7354', opacity: 0.9 },
    { angle: 18, len: 430, width: 20, color: '#9D8262', opacity: 0.9 },
    { angle: 38, len: 350, width: 16, color: '#B39775', opacity: 0.85 },
  ];

  elements += `<g transform="translate(${x}, ${y}) rotate(${rotation}) scale(${scale})">`;
  
  // Base branch stems
  elements += `<path d="M 0 0 Q 30 180 50 350" stroke="#8A6F50" stroke-width="3" fill="none" opacity="0.6"/>`;
  elements += `<path d="M 0 0 Q -20 160 -30 320" stroke="#997E5F" stroke-width="2.5" fill="none" opacity="0.5"/>`;

  plumes.forEach(p => {
    const rad = (p.angle * Math.PI) / 180;
    const endX = Math.sin(rad) * p.len;
    const endY = -Math.cos(rad) * p.len;
    const ctrlX = Math.sin(rad * 0.7) * (p.len * 0.55);
    const ctrlY = -Math.cos(rad * 0.7) * (p.len * 0.55);

    // Fluffy pampas plume shape
    elements += `
      <path d="M 0 0 Q ${ctrlX - p.width/2} ${ctrlY} ${endX} ${endY} Q ${ctrlX + p.width/2} ${ctrlY} 0 0 Z" 
            fill="${p.color}" opacity="${p.opacity}" />
      <path d="M 0 0 Q ${ctrlX} ${ctrlY} ${endX} ${endY}" 
            stroke="#7C6347" stroke-width="1.2" fill="none" opacity="0.45" />
    `;

    // Feathery tufts along the plume
    for (let i = 0.3; i <= 0.9; i += 0.12) {
      const px = ctrlX * i;
      const py = ctrlY * i;
      const spread = p.width * (1.1 - Math.abs(i - 0.6) * 1.5);
      elements += `
        <line x1="${px - spread}" y1="${py - 8}" x2="${px + spread}" y2="${py + 8}" stroke="${p.color}" stroke-width="1.8" opacity="${p.opacity * 0.9}"/>
        <line x1="${px - spread*0.8}" y1="${py - 15}" x2="${px + spread*0.8}" y2="${py + 3}" stroke="#7C6347" stroke-width="0.8" opacity="0.35"/>
      `;
    }
  });

  elements += `</g>`;
  return elements;
}

const svgContent = `
<svg width="1200" height="1700" viewBox="0 0 1200 1700" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background cream gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFAF6" />
      <stop offset="45%" stop-color="#FBF8F3" />
      <stop offset="100%" stop-color="#F4EFE6" />
    </linearGradient>

    <!-- Watercolor washes -->
    <radialGradient id="wash1" cx="85%" cy="15%" r="45%">
      <stop offset="0%" stop-color="#E7DDD0" stop-opacity="0.65" />
      <stop offset="50%" stop-color="#EFE8DE" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#FCFAF6" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="wash2" cx="15%" cy="85%" r="45%">
      <stop offset="0%" stop-color="#E8DFD3" stop-opacity="0.7" />
      <stop offset="50%" stop-color="#EFE9E0" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#FCFAF6" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="wash3" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#FDFCF9" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#F2EBE0" stop-opacity="0.45" />
    </radialGradient>

    <!-- Subtle paper texture filter -->
    <filter id="subtleWash" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" />
      <feComposite in2="SourceGraphic" in="glare" operator="over" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="1700" fill="url(#bgGrad)" />
  <rect width="1200" height="1700" fill="url(#wash1)" />
  <rect width="1200" height="1700" fill="url(#wash2)" />
  <rect width="1200" height="1700" fill="url(#wash3)" />

  <!-- Botanical watercolor pampas plumes - Top Right -->
  ${generatePampasFronds(1220, -20, 1.2, 130)}
  ${generatePampasFronds(1150, 80, 0.95, 145)}
  ${generatePampasFronds(1060, -50, 1.05, 120)}

  <!-- Botanical watercolor pampas plumes - Bottom Left -->
  ${generatePampasFronds(-20, 1720, 1.25, -35)}
  ${generatePampasFronds(60, 1640, 0.98, -20)}
  ${generatePampasFronds(-40, 1530, 1.05, -50)}

  <!-- Outer frame border -->
  <rect x="90" y="110" width="1020" height="1480" rx="4" fill="none" stroke="#C5A880" stroke-width="1.8" opacity="0.85" />

  <!-- Arched inner frame -->
  <!-- Top arch starts at y=460, radius 460, width 920 from x=140 to x=1060 -->
  <path d="M 140 1540 L 140 460 A 460 460 0 0 1 1060 460 L 1060 1540" 
        fill="none" stroke="#C5A880" stroke-width="2" opacity="0.85" />

  <!-- Islamic Calligraphy: Barak Allahu Lakuma -->
  <g id="header-calligraphy">
    <!-- Stylized Arabic Calligraphy Blessing -->
    <text x="600" y="325" text-anchor="middle" font-family="'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif" font-size="46" font-weight="bold" fill="#2E2822" letter-spacing="0.5">
      بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
    </text>
  </g>

  <!-- Invitation Announcement -->
  <text x="600" y="395" text-anchor="middle" font-family="'Cairo', 'Tajawal', 'Amiri', sans-serif" font-size="28" font-weight="600" fill="#6E6254" letter-spacing="1">
    نتشرف بحضوركم حفل زفافنا
  </text>

  <!-- Groom Name: Ahmed -->
  <text x="600" y="555" text-anchor="middle" font-family="'Montserrat', 'Century Gothic', 'Tw Cen MT', sans-serif" font-size="122" font-weight="600" fill="#2C343D" letter-spacing="2">
    Ahmed
  </text>

  <!-- Graceful ampersand / waw connector -->
  <text x="600" y="665" text-anchor="middle" font-family="'Amiri', 'Alex Brush', 'Great Vibes', cursive, serif" font-size="52" font-weight="400" fill="#A88B67">
    و
  </text>

  <!-- Bride Name: Yomna -->
  <text x="600" y="805" text-anchor="middle" font-family="'Montserrat', 'Century Gothic', 'Tw Cen MT', sans-serif" font-size="122" font-weight="600" fill="#2C343D" letter-spacing="2">
    Yomna
  </text>

  <!-- "وذلك بمشيئة الله" -->
  <text x="600" y="920" text-anchor="middle" font-family="'Amiri', 'Cairo', serif" font-size="34" font-weight="700" fill="#4B4238">
    وذلك بمشيئة الله
  </text>

  <!-- Month: OCTOBER -->
  <text x="600" y="990" text-anchor="middle" font-family="'Montserrat', 'Cinzel', sans-serif" font-size="28" font-weight="800" fill="#2C343D" letter-spacing="7">
    OCTOBER
  </text>

  <!-- Calendar Grid Columns -->
  <!-- Left Column: FRIDAY -->
  <text x="390" y="1115" text-anchor="middle" font-family="'Montserrat', 'Cinzel', sans-serif" font-size="30" font-weight="800" fill="#2C343D" letter-spacing="5">
    FRIDAY
  </text>

  <!-- Vertical Divider 1 -->
  <line x1="510" y1="1025" x2="510" y2="1200" stroke="#383028" stroke-width="2" opacity="0.85"/>

  <!-- Center Column: 16 & 2026 -->
  <text x="600" y="1118" text-anchor="middle" font-family="'Cinzel', 'Playfair Display', serif" font-size="86" font-weight="800" fill="#2C343D">
    16
  </text>
  <text x="600" y="1178" text-anchor="middle" font-family="'Montserrat', 'Cinzel', sans-serif" font-size="34" font-weight="800" fill="#2C343D" letter-spacing="4">
    2026
  </text>

  <!-- Vertical Divider 2 -->
  <line x1="690" y1="1025" x2="690" y2="1200" stroke="#383028" stroke-width="2" opacity="0.85"/>

  <!-- Right Column: AT 9 PM -->
  <text x="810" y="1115" text-anchor="middle" font-family="'Montserrat', 'Cinzel', sans-serif" font-size="30" font-weight="800" fill="#2C343D" letter-spacing="4">
    AT 9 PM
  </text>

  <!-- Venue & Address Section -->
  <text x="600" y="1310" text-anchor="middle" font-family="'Montserrat', 'Cinzel', sans-serif" font-size="34" font-weight="800" fill="#2C343D" letter-spacing="4">
    VILLA SALZ BURG
  </text>
  <text x="600" y="1368" text-anchor="middle" font-family="'Montserrat', 'Inter', sans-serif" font-size="24" font-weight="600" fill="#4B4238" letter-spacing="0.5">
    Tanta – Al Mahallah Al Kubra  Gharbia Governorate
  </text>

  <!-- Bottom decorative subtle flourish -->
  <circle cx="600" cy="1460" r="4" fill="#C5A880" />
  <circle cx="575" cy="1460" r="2.5" fill="#C5A880" opacity="0.7"/>
  <circle cx="625" cy="1460" r="2.5" fill="#C5A880" opacity="0.7"/>
</svg>
`;

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Full resolution vertical card (1200 x 1700)
  console.log('Generating wedding-invitation.png ...');
  await sharp(Buffer.from(svgContent))
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(path.join(publicDir, 'wedding-invitation.png'));

  // 2. Also JPEG version (often preferred by WhatsApp crawler under 150kb)
  console.log('Generating wedding-invitation.jpg ...');
  await sharp(Buffer.from(svgContent))
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(publicDir, 'wedding-invitation.jpg'));

  // 3. Horizontal social preview (1200 x 630 standard OpenGraph banner)
  console.log('Generating og-image.jpg (1200x630 banner) ...');
  // Create an elegant 1200x630 banner embedding the card in the center with botanical backdrop
  const bannerSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bannerBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FAF7F2" />
        <stop offset="100%" stop-color="#F2ECE1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bannerBg)" />

    <!-- Pampas Grass Accents on Corners -->
    ${generatePampasFronds(120, 650, 0.75, -30)}
    ${generatePampasFronds(1080, -20, 0.75, 140)}

    <!-- Border Accent -->
    <rect x="40" y="40" width="1120" height="550" rx="12" fill="none" stroke="#C5A880" stroke-width="1.8" opacity="0.75" />

    <!-- Text content -->
    <text x="600" y="130" text-anchor="middle" font-family="'Amiri', 'Traditional Arabic', serif" font-size="32" font-weight="bold" fill="#2E2822">
      بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
    </text>
    <text x="600" y="180" text-anchor="middle" font-family="'Cairo', sans-serif" font-size="22" font-weight="600" fill="#7D7060">
      دعوة لحضور حفل زفاف
    </text>
    
    <text x="600" y="290" text-anchor="middle" font-family="'Montserrat', 'Century Gothic', sans-serif" font-size="78" font-weight="700" fill="#2C343D" letter-spacing="3">
      Ahmed  &amp;  Yomna
    </text>

    <!-- Date & Location -->
    <text x="600" y="380" text-anchor="middle" font-family="'Montserrat', 'Cinzel', sans-serif" font-size="24" font-weight="800" fill="#2C343D" letter-spacing="4">
      FRIDAY  •  16 OCTOBER 2026  •  AT 9 PM
    </text>

    <text x="600" y="440" text-anchor="middle" font-family="'Montserrat', 'Cinzel', sans-serif" font-size="24" font-weight="800" fill="#2C343D" letter-spacing="3">
      VILLA SALZ BURG
    </text>
    <text x="600" y="480" text-anchor="middle" font-family="'Montserrat', 'Inter', sans-serif" font-size="18" font-weight="600" fill="#5E5346">
      Tanta – Al Mahallah Al Kubra  Gharbia Governorate
    </text>

    <!-- Tap to view callout badge -->
    <rect x="460" y="520" width="280" height="42" rx="21" fill="#2D3B2D" />
    <text x="600" y="547" text-anchor="middle" font-family="'Cairo', sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">
      اضغط لتأكيد الحضور وكتابة التهنئة ✨
    </text>
  </svg>
  `;

  await sharp(Buffer.from(bannerSvg))
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(publicDir, 'og-image.jpg'));

  await sharp(Buffer.from(bannerSvg))
    .png({ quality: 90 })
    .toFile(path.join(publicDir, 'og-image.png'));

  // 4. Square 600x600 thumbnail (especially for WhatsApp mobile contact cards)
  console.log('Generating wedding-thumb.jpg (600x600 square) ...');
  const squareSvg = `
  <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sqBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCFAF6" />
        <stop offset="100%" stop-color="#F2ECE1" />
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#sqBg)" />

    <!-- Corner Pampas plumes -->
    ${generatePampasFronds(50, 610, 0.45, -30)}
    ${generatePampasFronds(550, -10, 0.45, 140)}

    <!-- Frame -->
    <rect x="25" y="25" width="550" height="550" rx="8" fill="none" stroke="#C5A880" stroke-width="1.5" opacity="0.8" />
    <path d="M 45 540 L 45 220 A 255 255 0 0 1 555 220 L 555 540" fill="none" stroke="#C5A880" stroke-width="1.2" opacity="0.75" />

    <!-- Calligraphy -->
    <text x="300" y="110" text-anchor="middle" font-family="'Amiri', serif" font-size="20" font-weight="bold" fill="#2E2822">
      بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
    </text>
    <text x="300" y="145" text-anchor="middle" font-family="'Cairo', sans-serif" font-size="14" font-weight="600" fill="#7D7060">
      دعوة لحضور حفل زفاف
    </text>

    <!-- Couple Names -->
    <text x="300" y="225" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="52" font-weight="700" fill="#2C343D" letter-spacing="2">
      Ahmed
    </text>
    <text x="300" y="270" text-anchor="middle" font-family="'Amiri', cursive" font-size="30" fill="#A88B67">
      و
    </text>
    <text x="300" y="330" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="52" font-weight="700" fill="#2C343D" letter-spacing="2">
      Yomna
    </text>

    <!-- Date block -->
    <text x="300" y="380" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="14" font-weight="800" fill="#2C343D" letter-spacing="3">
      OCTOBER
    </text>
    <text x="300" y="420" text-anchor="middle" font-family="'Cinzel', serif" font-size="36" font-weight="800" fill="#2C343D">
      16
    </text>
    <text x="300" y="448" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="15" font-weight="700" fill="#4B4238" letter-spacing="2">
      FRIDAY  •  AT 9 PM  •  2026
    </text>

    <!-- Venue -->
    <text x="300" y="495" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="18" font-weight="800" fill="#2C343D" letter-spacing="1">
      VILLA SALZ BURG
    </text>
    <text x="300" y="522" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="12" font-weight="600" fill="#5E5346">
      Tanta – Al Mahallah Al Kubra
    </text>
  </svg>
  `;

  await sharp(Buffer.from(squareSvg))
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(publicDir, 'wedding-thumb.jpg'));

  console.log('All invitation preview assets generated successfully!');
}

main().catch(console.error);
