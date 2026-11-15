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
case 'rose_white':
      return `
        <path d="M50 75 Q48 55 50 38" stroke="#5E8561" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 58 Q36 53 38 45 Q46 47 49 55 Z" fill="#77A17A"/>
        <path d="M50 53 Q63 48 61 40 Q53 42 50 50 Z" fill="#648D67"/>
        <path d="M38 30 Q38 42 50 42 Q62 42 62 30 Q60 18 50 18 Q40 18 38 30 Z" fill="#EFE8DC" stroke="#DFD5C5" stroke-width="0.8"/>
        <path d="M41 28 Q42 38 50 38 Q58 38 59 28 Q56 20 50 20 Q44 20 41 28 Z" fill="#F8F4EC"/>
        <path d="M44 26 Q50 33 56 26 Q53 20 50 21 Q46 21 44 26 Z" fill="#FFFDF9"/>
        <path d="M47 24 Q50 28 53 24" stroke="#D1C3AE" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      `;

    case 'rose_pink':
      return `
        <path d="M50 75 Q48 55 50 38" stroke="#5E8561" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 58 Q36 53 38 45 Q46 47 49 55 Z" fill="#77A17A"/>
        <path d="M50 53 Q63 48 61 40 Q53 42 50 50 Z" fill="#648D67"/>
        <path d="M38 30 Q38 42 50 42 Q62 42 62 30 Q60 18 50 18 Q40 18 38 30 Z" fill="#EA90A0"/>
        <path d="M41 28 Q42 38 50 38 Q58 38 59 28 Q56 20 50 20 Q44 20 41 28 Z" fill="#F3AAB7"/>
        <path d="M44 26 Q50 33 56 26 Q53 20 50 21 Q46 21 44 26 Z" fill="#FAC7D0"/>
        <path d="M47 24 Q50 28 53 24" stroke="#CC6E80" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      `;

    case 'peony_coral':
      return `
        <path d="M50 75 Q52 55 50 37" stroke="#688E6B" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M50 56 Q37 50 39 43 Q47 45 50 54 Z" fill="#82AA85"/>
        <circle cx="43" cy="28" r="10" fill="#F2947E"/>
        <circle cx="57" cy="28" r="10" fill="#F2947E"/>
        <circle cx="50" cy="22" r="11" fill="#F6A692"/>
        <circle cx="46" cy="31" r="9" fill="#FBBAA9"/>
        <circle cx="54" cy="31" r="9" fill="#FBBAA9"/>
        <circle cx="50" cy="27" r="7" fill="#FDD0C4"/>
        <circle cx="50" cy="27" r="3.2" fill="#F7D774"/>
      `;

    case 'tulip_red':
      return `
        <path d="M50 75 L50 38" stroke="#66916A" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 70 Q34 55 39 39 Q46 53 49 66 Z" fill="#7CA880"/>
        <path d="M51 68 Q65 54 61 40 Q54 54 51 66 Z" fill="#6D9871"/>
        <path d="M39 24 Q39 40 50 40 Q61 40 61 24 L56 17 L50 23 L44 17 Z" fill="#D45058"/>
        <path d="M44 23 Q44 38 50 39 Q56 38 56 23 L50 16 Z" fill="#E86D74"/>
      `;

    case 'tulip_purple':
      return `
        <path d="M50 75 L50 38" stroke="#66916A" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 70 Q34 55 39 39 Q46 53 49 66 Z" fill="#7CA880"/>
        <path d="M51 68 Q65 54 61 40 Q54 54 51 66 Z" fill="#6D9871"/>
        <path d="M39 24 Q39 40 50 40 Q61 40 61 24 L56 17 L50 23 L44 17 Z" fill="#9A72BA"/>
        <path d="M44 23 Q44 38 50 39 Q56 38 56 23 L50 16 Z" fill="#B591D1"/>
      `;

    case 'hydrangea_blue':
      return `
        <path d="M50 75 L50 38" stroke="#5E8561" stroke-width="3.4" stroke-linecap="round" fill="none"/>
        <path d="M49 61 Q35 54 37 46 Q46 49 49 58 Z" fill="#76A079"/>
        <path d="M51 58 Q65 51 63 43 Q54 46 51 55 Z" fill="#68916B"/>
        <circle cx="43" cy="24" r="7" fill="#8FBCE0"/>
        <circle cx="57" cy="24" r="7" fill="#8FBCE0"/>
        <circle cx="50" cy="18" r="7.5" fill="#A5CDF0"/>
        <circle cx="40" cy="32" r="6.5" fill="#9BC5E8"/>
        <circle cx="60" cy="32" r="6.5" fill="#9BC5E8"/>
        <circle cx="50" cy="33" r="7.5" fill="#B3D7F5"/>
        <circle cx="50" cy="26" r="7" fill="#C4E1F8"/>
        <circle cx="45" cy="22" r="1.6" fill="#FFF8D6"/>
        <circle cx="55" cy="23" r="1.6" fill="#FFF8D6"/>
        <circle cx="50" cy="29" r="1.6" fill="#FFF8D6"/>
      `;

    case 'sunflower':
      return `
        <path d="M50 75 L50 35" stroke="#5D845F" stroke-width="3.6" stroke-linecap="round" fill="none"/>
        <path d="M49 59 Q35 53 37 44 Q46 47 49 56 Z" fill="#76A079"/>
        <g fill="#F4C438">
          <ellipse cx="50" cy="14" rx="3.8" ry="8"/>
          <ellipse cx="50" cy="38" rx="3.8" ry="8"/>
          <ellipse cx="38" cy="26" rx="8" ry="3.8"/>
          <ellipse cx="62" cy="26" rx="8" ry="3.8"/>
          <ellipse cx="41.5" cy="17.5" rx="3.6" ry="7.5" transform="rotate(-45 41.5 17.5)"/>
          <ellipse cx="58.5" cy="17.5" rx="3.6" ry="7.5" transform="rotate(45 58.5 17.5)"/>
          <ellipse cx="41.5" cy="34.5" rx="3.6" ry="7.5" transform="rotate(45 41.5 34.5)"/>
          <ellipse cx="58.5" cy="34.5" rx="3.6" ry="7.5" transform="rotate(-45 58.5 34.5)"/>
        </g>
        <circle cx="50" cy="26" r="8" fill="#5E402E"/>
        <circle cx="50" cy="26" r="5" fill="#73513B"/>
      `;

    case 'iris_blue':
      return `
        <path d="M50 75 L50 35" stroke="#5E8762" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M49 68 Q41 52 44 39 Q48 53 49 65 Z" fill="#77A17A"/>
        <path d="M50 13 Q57 20 50 30 Q43 20 50 13 Z" fill="#5D74C4"/>
        <path d="M36 25 Q43 20 49 29 Q41 34 36 25 Z" fill="#4D62B3"/>
        <path d="M64 25 Q57 20 51 29 Q59 34 64 25 Z" fill="#4D62B3"/>
        <path d="M41 37 Q46 28 50 30 Q48 39 41 37 Z" fill="#6F86D4"/>
        <path d="M59 37 Q54 28 50 30 Q52 39 59 37 Z" fill="#6F86D4"/>
        <ellipse cx="50" cy="29" rx="2.5" ry="4" fill="#F2C84B"/>
      `;

    case 'chrysanthemum_white':
      return `
        <path d="M50 75 L50 35" stroke="#628A65" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M50 56 Q38 51 40 44 Q47 47 50 54 Z" fill="#7CA67F"/>
        <g fill="#FFFDF9" stroke="#E0D8CE" stroke-width="0.6">
          <circle cx="50" cy="16" r="5"/>
          <circle cx="42" cy="19" r="5"/>
          <circle cx="58" cy="19" r="5"/>
          <circle cx="38" cy="26" r="5"/>
          <circle cx="62" cy="26" r="5"/>
          <circle cx="42" cy="33" r="5"/>
          <circle cx="58" cy="33" r="5"/>
          <circle cx="50" cy="36" r="5"/>
          <circle cx="46" cy="22" r="4.5"/>
          <circle cx="54" cy="22" r="4.5"/>
          <circle cx="46" cy="30" r="4.5"/>
          <circle cx="54" cy="30" r="4.5"/>
          <circle cx="50" cy="26" r="5"/>
        </g>
        <circle cx="50" cy="26" r="2.8" fill="#EFE4B8"/>
      `;

    case 'carnation_red':
      return `
        <path d="M50 75 L50 36" stroke="#5B8064" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <path d="M49 58 Q40 50 42 43 Q47 48 49 56 Z" fill="#6E9477"/>
        <path d="M46 37 L54 37 L52 31 L48 31 Z" fill="#5B8064"/>
        <path d="M37 26 Q39 36 50 35 Q61 36 63 26 L60 20 L56 23 L53 17 L50 22 L47 17 L44 23 L40 20 Z" fill="#C94652"/>
        <path d="M41 25 Q45 32 50 31 Q55 32 59 25 L55 20 L50 24 L45 20 Z" fill="#DE626E"/>
      `;

    case 'gypsophila':
      return `
        <path d="M50 75 L50 42" stroke="#7A9E7C" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M50 46 L39 27 M50 44 L61 28 M50 42 L50 20 M44 36 L36 33 M56 36 L64 34" stroke="#7A9E7C" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        <g fill="#FFFDF9" stroke="#E2DCD3" stroke-width="0.6">
          <circle cx="39" cy="27" r="3.4"/>
          <circle cx="35" cy="33" r="3"/>
          <circle cx="44" cy="21" r="3.2"/>
          <circle cx="50" cy="18" r="3.6"/>
          <circle cx="56" cy="22" r="3.1"/>
          <circle cx="61" cy="28" r="3.4"/>
          <circle cx="64" cy="34" r="2.9"/>
          <circle cx="48" cy="29" r="3.2"/>
          <circle cx="54" cy="32" r="3"/>
        </g>
      `;

    case 'eucalyptus':
      return `
        <path d="M50 75 Q49 48 50 15" stroke="#6E8D78" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <g fill="#84A893" stroke="#6B8E7A" stroke-width="0.6">
          <ellipse cx="42" cy="54" rx="5.5" ry="3.8" transform="rotate(-25 42 54)"/>
          <ellipse cx="58" cy="49" rx="5.5" ry="3.8" transform="rotate(25 58 49)"/>
          <ellipse cx="42" cy="41" rx="5.5" ry="3.8" transform="rotate(-25 42 41)"/>
          <ellipse cx="58" cy="36" rx="5.5" ry="3.8" transform="rotate(25 58 36)"/>
          <ellipse cx="43" cy="28" rx="5" ry="3.5" transform="rotate(-25 43 28)"/>
          <ellipse cx="57" cy="24" rx="5" ry="3.5" transform="rotate(25 57 24)"/>
          <ellipse cx="50" cy="15" rx="3.8" ry="4.5"/>
        </g>
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