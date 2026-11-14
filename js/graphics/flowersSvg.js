/**
 * Генератор векторных SVG-иллюстраций цветов и ваз
 */

export function getSingleFlowerWrappedSvg(flowerId) {
  const flowerArt = getSingleFlowerSvg(flowerId);
  return `
    <svg viewBox="22 8 56 72" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      ${flowerArt}
    </svg>
  `;
}

export function getFlowerSvgDataUrl(flowerId) {
  const svg = getSingleFlowerWrappedSvg(flowerId);
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export function getFlowerInVaseSvg(flowerId, vaseColor = '#E7D8C9') {
  const flowerArt = getSingleFlowerSvg(flowerId);

  return `
    <svg viewBox="0 0 100 115" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <!-- Несколько стеблей в вазе для пышности -->
      <g transform="translate(-10, 4) rotate(-8 50 75)">
        ${flowerArt}
      </g>
      <g transform="translate(10, 5) rotate(9 50 75)">
        ${flowerArt}
      </g>
      <g transform="translate(0, 0)">
        ${flowerArt}
      </g>

      <!-- Пастельная керамическая ваза -->
      <path d="M33 68 L67 68 L73 98 Q74 108 62 109 L38 109 Q26 108 27 98 Z" fill="${vaseColor}" stroke="#8C7B73" stroke-opacity="0.25" stroke-width="1.5"/>
      <!-- Горлышко вазы -->
      <ellipse cx="50" cy="68" rx="18" ry="4" fill="#FFFDF9" fill-opacity="0.65"/>
      <!-- Мягкий блик на вазе -->
      <path d="M35 76 Q33 90 36 101" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-opacity="0.55" fill="none"/>
    </svg>
  `;
}

export function getSingleFlowerSvg(flowerId) {
  switch (flowerId) {
    case 'rose_red':
      return `
        <path d="M50 75 Q48 55 50 38" stroke="#5E8561" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 58 Q36 53 38 45 Q46 47 49 55 Z" fill="#77A17A"/>
        <path d="M50 53 Q63 48 61 40 Q53 42 50 50 Z" fill="#648D67"/>
        <!-- Бутон розы -->
        <path d="M38 30 Q38 42 50 42 Q62 42 62 30 Q60 18 50 18 Q40 18 38 30 Z" fill="#D96B70"/>
        <path d="M41 28 Q42 38 50 38 Q58 38 59 28 Q56 20 50 20 Q44 20 41 28 Z" fill="#E98387"/>
        <path d="M44 26 Q50 33 56 26 Q53 20 50 21 Q46 21 44 26 Z" fill="#F4A4A7"/>
        <path d="M47 24 Q50 28 53 24" stroke="#B84B51" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      `;

    case 'peony_pink':
      return `
        <path d="M50 75 Q52 55 50 37" stroke="#688E6B" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M50 56 Q37 50 39 43 Q47 45 50 54 Z" fill="#82AA85"/>
        <!-- Пышные лепестки пиона -->
        <circle cx="43" cy="28" r="10" fill="#F2AEBA"/>
        <circle cx="57" cy="28" r="10" fill="#F2AEBA"/>
        <circle cx="50" cy="22" r="11" fill="#F6C1CA"/>
        <circle cx="46" cy="31" r="9" fill="#FAD4DA"/>
        <circle cx="54" cy="31" r="9" fill="#FAD4DA"/>
        <circle cx="50" cy="27" r="7" fill="#FCE6EA"/>
        <circle cx="50" cy="27" r="3.2" fill="#F7D774"/>
      `;

    case 'tulip_yellow':
      return `
        <path d="M50 75 L50 38" stroke="#66916A" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 70 Q34 55 39 39 Q46 53 49 66 Z" fill="#7CA880"/>
        <path d="M51 68 Q65 54 61 40 Q54 54 51 66 Z" fill="#6D9871"/>
        <!-- Чашечка тюльпана -->
        <path d="M39 24 Q39 40 50 40 Q61 40 61 24 L56 17 L50 23 L44 17 Z" fill="#F4C752"/>
        <path d="M44 23 Q44 38 50 39 Q56 38 56 23 L50 16 Z" fill="#FAD977"/>
      `;

    case 'chamomile_white':
      return `
        <path d="M50 75 Q49 54 50 33" stroke="#6E9971" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <path d="M50 56 Q39 51 40 45 Q47 47 50 54 Z" fill="#84B087"/>
        <!-- Лепестки ромашки -->
        <g fill="#FFFDF9" stroke="#E5DDD3" stroke-width="0.7">
          <ellipse cx="50" cy="18" rx="4" ry="8"/>
          <ellipse cx="50" cy="36" rx="4" ry="8"/>
          <ellipse cx="41" cy="27" rx="8" ry="4"/>
          <ellipse cx="59" cy="27" rx="8" ry="4"/>
          <ellipse cx="43" cy="20" rx="4" ry="7" transform="rotate(-45 43 20)"/>
          <ellipse cx="57" cy="20" rx="4" ry="7" transform="rotate(45 57 20)"/>
          <ellipse cx="43" cy="34" rx="4" ry="7" transform="rotate(45 43 34)"/>
          <ellipse cx="57" cy="34" rx="4" ry="7" transform="rotate(-45 57 34)"/>
        </g>
        <circle cx="50" cy="27" r="5.5" fill="#F5C84C"/>
        <circle cx="48.5" cy="25.5" r="1.5" fill="#FCE588"/>
      `;

    case 'lavender_purple':
      return `
        <path d="M50 75 L50 20" stroke="#6E8F71" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M50 61 Q39 55 41 48 Q47 52 50 59 Z" fill="#7FA182"/>
        <!-- Соцветия лаванды -->
        <ellipse cx="46" cy="40" rx="4.2" ry="3" fill="#A488C4"/>
        <ellipse cx="54" cy="38" rx="4.2" ry="3" fill="#B59AD4"/>
        <ellipse cx="46" cy="32" rx="4" ry="2.8" fill="#B59AD4"/>
        <ellipse cx="54" cy="30" rx="4" ry="2.8" fill="#9A7CB9"/>
        <ellipse cx="47" cy="24" rx="3.5" ry="2.6" fill="#C6AEE0"/>
        <ellipse cx="53" cy="22" rx="3.5" ry="2.6" fill="#B59AD4"/>
        <ellipse cx="50" cy="17" rx="3.5" ry="3.2" fill="#CEB9E6"/>
      `;

    case 'lily_white':
    default:
      return `
        <path d="M50 75 L50 35" stroke="#5E8762" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M50 56 Q62 50 60 42 Q53 45 50 53 Z" fill="#77A37B"/>
        <!-- Звёздчатые лепестки лилии -->
        <path d="M50 12 Q57 22 50 32 Q43 22 50 12 Z" fill="#FFFDF9" stroke="#E7DED5" stroke-width="0.9"/>
        <path d="M35 24 Q44 21 50 31 Q40 33 35 24 Z" fill="#FFF8F5" stroke="#E7DED5" stroke-width="0.9"/>
        <path d="M65 24 Q56 21 50 31 Q60 33 65 24 Z" fill="#FFF8F5" stroke="#E7DED5" stroke-width="0.9"/>
        <path d="M39 39 Q44 30 50 31 Q47 40 39 39 Z" fill="#FFFDF9" stroke="#E7DED5" stroke-width="0.9"/>
        <path d="M61 39 Q56 30 50 31 Q53 40 61 39 Z" fill="#FFFDF9" stroke="#E7DED5" stroke-width="0.9"/>
        <circle cx="50" cy="29" r="3.2" fill="#F2B5B5"/>
        <circle cx="48" cy="26" r="1.2" fill="#E39B4B"/>
        <circle cx="52" cy="26" r="1.2" fill="#E39B4B"/>
      `;
  }
}