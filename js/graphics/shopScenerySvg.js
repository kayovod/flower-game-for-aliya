/**
 * js/graphics/shopScenerySvg.js
 * Процедурная векторная графика и SVG-элементы торгового зала (окна, арки, декор)
 */

import { ACCESSORIES_CATALOG } from '../config.js';
import { gameState } from '../state.js';

const DECOR_ALIASES = {
  hearts_garland_shop: ['hearts_garland_shop', 'shop_hearts'],
  pumpkins_shop: ['pumpkins_shop', 'shop_pumpkins'],
  xmas_tree_shop: ['xmas_tree_shop', 'shop_xmas_tree'],
  vintage_vase: ['vintage_vase', 'crystal_vase_rare'],
  retro_gramophone: ['retro_gramophone', 'vintage_gramophone']
};

export function isShopDecorVisible(id) {
  const idsToCheck = DECOR_ALIASES[id] || [id];
  const owned = new Set([...(gameState.decor || []), ...(gameState.decorInventory || [])]);
  const hidden = new Set(gameState.hiddenDecor || []);

  return idsToCheck.some((checkId) => {
    if (hidden.has(checkId)) return false;
    if (checkId === 'fridge') return Boolean(gameState.hasFridge || owned.has('fridge'));
    return owned.has(checkId);
  });
}

export function renderShopTopDecor(hasNeon) {
  const parts = [];
  if (isShopDecorVisible('shop_arch')) {
    parts.push(`
      <div class="shop-arch-svg-wrap" title="Цветочная арка с плющом">
        <svg viewBox="0 0 360 40" width="100%" height="36" preserveAspectRatio="none">
          <path d="M4,38 Q18,8 78,8 L282,8 Q342,8 356,38" fill="none" stroke="#5A8357" stroke-width="5" stroke-linecap="round"/>
          <path d="M12,35 Q30,13 90,12 L270,12 Q330,13 348,35" fill="none" stroke="#7AA573" stroke-width="3" stroke-linecap="round"/>
          <g fill="#6E9E69">
            <ellipse cx="32" cy="18" rx="9" ry="5" transform="rotate(-25 32 18)"/>
            <ellipse cx="64" cy="10" rx="9" ry="4.5" transform="rotate(10 64 10)"/>
            <ellipse cx="110" cy="9" rx="10" ry="4.5"/>
            <ellipse cx="155" cy="9" rx="9" ry="4.5" transform="rotate(-10 155 9)"/>
            <ellipse cx="205" cy="9" rx="9" ry="4.5" transform="rotate(10 205 9)"/>
            <ellipse cx="250" cy="9" rx="10" ry="4.5"/>
            <ellipse cx="296" cy="10" rx="9" ry="4.5" transform="rotate(-10 296 10)"/>
            <ellipse cx="328" cy="18" rx="9" ry="5" transform="rotate(25 328 18)"/>
          </g>
          <g>
            <circle cx="20" cy="28" r="5" fill="#F29AA4"/><circle cx="20" cy="28" r="2" fill="#FFE28A"/>
            <circle cx="88" cy="10" r="4.5" fill="#F6B8BF"/><circle cx="88" cy="10" r="1.8" fill="#FFE28A"/>
            <circle cx="180" cy="10" r="5" fill="#F29AA4"/><circle cx="180" cy="10" r="2" fill="#FFE28A"/>
            <circle cx="272" cy="10" r="4.5" fill="#F6B8BF"/><circle cx="272" cy="10" r="1.8" fill="#FFE28A"/>
            <circle cx="340" cy="28" r="5" fill="#F29AA4"/><circle cx="340" cy="28" r="2" fill="#FFE28A"/>
          </g>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('hearts_garland_shop')) {
    parts.push(`
      <div class="shop-hearts-svg-wrap" title="Гирлянда из сердечек">
        <svg viewBox="0 0 340 28" width="100%" height="26">
          <path d="M10,5 Q90,18 170,6 Q250,18 330,5" fill="none" stroke="#C99B95" stroke-width="1.6"/>
          ${[
            { x: 42, y: 12, c: '#E87A88' },
            { x: 96, y: 14, c: '#F4A6B1' },
            { x: 148, y: 10, c: '#DF5F73' },
            { x: 196, y: 10, c: '#F4A6B1' },
            { x: 248, y: 14, c: '#E87A88' },
            { x: 298, y: 12, c: '#DF5F73' }
          ]
            .map(
              (h) => `
            <g transform="translate(${h.x}, ${h.y})">
              <path d="M0,3 C-4,-2 -9,2 -5,7 L0,12 L5,7 C9,2 4,-2 0,3 Z" fill="${h.c}" stroke="#FFFDF9" stroke-width="0.9"/>
            </g>
          `
            )
            .join('')}
        </svg>
      </div>
    `);
  }
  const hangingBits = [];
  if (isShopDecorVisible('dried_flowers_bundle')) {
    hangingBits.push(`
      <div class="shop-decor-svg-item" title="Связка сухоцветов">
        <svg viewBox="0 0 60 44" width="50" height="36">
          <path d="M12,6 L30,18 L48,6" stroke="#A68262" stroke-width="2" fill="none"/>
          <ellipse cx="16" cy="24" rx="4" ry="12" transform="rotate(20 16 24)" fill="#B89CD4"/>
          <ellipse cx="30" cy="27" rx="4.5" ry="13" fill="#E3C696"/>
          <ellipse cx="44" cy="24" rx="4" ry="12" transform="rotate(-20 44 24)" fill="#C6A8DE"/>
          <rect x="24" y="14" width="12" height="5" rx="2" fill="#D98A7C"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('macrame_hanger')) {
    hangingBits.push(`
      <div class="shop-decor-svg-item" title="Макраме с папоротником">
        <svg viewBox="0 0 54 52" width="44" height="42">
          <line x1="27" y1="0" x2="17" y2="26" stroke="#E8DEC8" stroke-width="1.8"/>
          <line x1="27" y1="0" x2="37" y2="26" stroke="#E8DEC8" stroke-width="1.8"/>
          <polygon points="16,24 38,24 34,37 20,37" fill="#D9A78B"/>
          <path d="M18,24 Q10,16 14,10 M27,24 Q27,13 27,8 M36,24 Q44,16 40,10" stroke="#6E9E69" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <line x1="27" y1="37" x2="27" y2="49" stroke="#E8DEC8" stroke-width="2.2"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('stained_glass_sun')) {
    hangingBits.push(`
      <div class="shop-decor-svg-item" title="Витражный ловец солнца">
        <svg viewBox="0 0 46 48" width="38" height="40">
          <line x1="23" y1="0" x2="23" y2="10" stroke="#B68B3A" stroke-width="1.5"/>
          <circle cx="23" cy="24" r="13" fill="#FFE694" stroke="#B68B3A" stroke-width="2"/>
          <path d="M23,11 L23,37 M10,24 L36,24" stroke="#B68B3A" stroke-width="1.3"/>
          <circle cx="17" cy="18" r="4" fill="#F29AA4" opacity="0.8"/>
          <circle cx="29" cy="18" r="4" fill="#89B9DF" opacity="0.8"/>
          <circle cx="23" cy="30" r="4" fill="#89B996" opacity="0.8"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('birdcage_decor')) {
    hangingBits.push(`
      <div class="shop-decor-svg-item" title="Ажурная клетка со свечами">
        <svg viewBox="0 0 48 54" width="40" height="44">
          <line x1="24" y1="0" x2="24" y2="8" stroke="#8C7B73" stroke-width="1.5"/>
          <path d="M11,44 L11,24 Q24,6 37,24 L37,44 Z" fill="rgba(255,253,249,0.4)" stroke="#C9A88C" stroke-width="2"/>
          <line x1="19" y1="16" x2="19" y2="44" stroke="#C9A88C" stroke-width="1.2"/>
          <line x1="29" y1="16" x2="29" y2="44" stroke="#C9A88C" stroke-width="1.2"/>
          <rect x="21" y="34" width="6" height="10" fill="#FFFDF9"/>
          <ellipse cx="24" cy="31" rx="2" ry="3.5" fill="#FFBE42"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('herb_drying_rack')) {
    hangingBits.push(`
      <div class="shop-decor-svg-item" title="Подвесная сушилка с мятой и ромашкой">
        <svg viewBox="0 0 64 42" width="54" height="36">
          <line x1="8" y1="8" x2="56" y2="8" stroke="#8C6D56" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M16,8 L12,30 M16,8 L20,30 M32,8 L29,32 M32,8 L35,32 M48,8 L45,28 M48,8 L51,28" stroke="#6E9E69" stroke-width="2" stroke-linecap="round"/>
          <circle cx="14" cy="28" r="2.5" fill="#FFFDF9"/><circle cx="32" cy="30" r="2.8" fill="#F0BD43"/><circle cx="48" cy="27" r="2.5" fill="#D98A7C"/>
        </svg>
      </div>
    `);
  }
  if (hangingBits.length) {
    parts.push(`<div class="shop-wall-objects">${hangingBits.join('')}</div>`);
  }
  if (hasNeon) {
    parts.push(
      `<div class="shop-neon-badge">✨ ${escapeHtml(gameState.shopName || 'Fleur Atelier')} ✨</div>`
    );
  }
  return parts.join('');
}

export function renderShopDecorVisuals() {
  const wallItems = [];
  const floorItems = [];

  if (isShopDecorVisible('wreath_shop')) {
    wallItems.push(`
      <div class="shop-decor-svg-item" title="Праздничный венок">
        <svg viewBox="0 0 64 64" width="52" height="52">
          <circle cx="32" cy="33" r="20" fill="none" stroke="#4D7D4E" stroke-width="11"/>
          <circle cx="32" cy="33" r="20" fill="none" stroke="#6E9F6C" stroke-width="7" stroke-dasharray="6 4"/>
          <circle cx="18" cy="22" r="2.6" fill="#D9534F"/>
          <circle cx="46" cy="24" r="2.6" fill="#D9534F"/>
          <circle cx="21" cy="46" r="2.6" fill="#E8B84B"/>
          <circle cx="44" cy="45" r="2.6" fill="#D9534F"/>
          <path d="M24,14 C20,8 29,7 32,14 C35,7 44,8 40,14 L32,18 Z" fill="#D95A62"/>
          <path d="M30,17 L24,27 M34,17 L40,27" stroke="#D95A62" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </div>
    `);
  }

  if (isShopDecorVisible('shop_mirror')) {
    wallItems.push(`
      <div class="shop-decor-svg-item" title="Винтажное зеркало">
        <svg viewBox="0 0 56 68" width="46" height="56">
          <ellipse cx="28" cy="34" rx="20" ry="27" fill="#C9A36B" stroke="#8F6E3E" stroke-width="2.5"/>
          <ellipse cx="28" cy="34" rx="15" ry="22" fill="#DCECF5" stroke="#EAD4A6" stroke-width="1.5"/>
          <path d="M20,22 L32,16 M18,32 L35,23" stroke="rgba(255,255,255,0.8)" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="28" cy="8" r="2.2" fill="#DFB66B"/>
        </svg>
      </div>
    `);
  }

  if (isShopDecorVisible('shop_chalkboard')) {
    wallItems.push(`
      <div class="shop-decor-svg-item" title="Меловая доска «Букет дня»">
        <svg viewBox="0 0 70 64" width="58" height="52">
          <path d="M20,12 L35,3 L50,12" fill="none" stroke="#9D7D63" stroke-width="2"/>
          <rect x="8" y="12" width="54" height="46" rx="5" fill="#A97D59" stroke="#7E5B3E" stroke-width="2"/>
          <rect x="13" y="17" width="44" height="36" rx="2" fill="#3B4540"/>
          <text x="35" y="28" text-anchor="middle" fill="#F5EFE6" font-size="7" font-weight="bold">БУКЕТ ДНЯ</text>
          <path d="M35,47 L35,36 M35,42 L30,39 M35,44 L40,40" stroke="#98C496" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="35" cy="35" r="3.5" fill="#F29AA4"/>
        </svg>
      </div>
    `);
  }

  if (gameState.hasFridge && !(gameState.hiddenDecor || []).includes('fridge')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Холодильная витрина">
        <svg viewBox="0 0 60 76" width="50" height="64">
          <rect x="8" y="6" width="44" height="66" rx="6" fill="#E8F3F7" stroke="#A6C1CC" stroke-width="2.5"/>
          <rect x="13" y="12" width="34" height="46" rx="3" fill="#D2EAF4"/>
          <line x1="13" y1="35" x2="47" y2="35" stroke="#A6C1CC" stroke-width="2"/>
          <circle cx="24" cy="27" r="4.5" fill="#E87A88"/><circle cx="35" cy="27" r="4.5" fill="#F2B8C0"/>
          <circle cx="25" cy="49" r="4.5" fill="#F4C752"/><circle cx="36" cy="49" r="4.5" fill="#B59ED6"/>
          <line x1="43" y1="26" x2="43" y2="42" stroke="#7EA6B8" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M18,18 L28,15 M18,22 L24,20" stroke="rgba(255,255,255,0.8)" stroke-width="2" stroke-linecap="round"/>
          <rect x="12" y="61" width="36" height="6" rx="2" fill="#B8D0DA"/>
        </svg>
      </div>
    `);
  }

  if (isShopDecorVisible('pumpkins_shop')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Осенние тыквы">
        <svg viewBox="0 0 88 58" width="76" height="50">
          <path d="M10,50 Q4,42 14,39 Q18,46 10,50 Z" fill="#D96E34"/>
          <path d="M77,50 Q84,42 74,39 Q70,46 77,50 Z" fill="#E6A445"/>
          <path d="M35,18 Q36,12 40,11" fill="none" stroke="#5A7247" stroke-width="3" stroke-linecap="round"/>
          <ellipse cx="36" cy="36" rx="19" ry="15" fill="#DF7135" stroke="#B55220" stroke-width="1.5"/>
          <ellipse cx="36" cy="36" rx="12" ry="15" fill="#EB8243"/>
          <ellipse cx="36" cy="36" rx="5.5" ry="15" fill="#F29457"/>
          <path d="M62,25 Q63,20 66,19" fill="none" stroke="#5A7247" stroke-width="2.5" stroke-linecap="round"/>
          <ellipse cx="62" cy="40" rx="13" ry="11" fill="#E8AE52" stroke="#C48B32" stroke-width="1.3"/>
          <ellipse cx="62" cy="40" rx="6" ry="11" fill="#F2C06B"/>
          <ellipse cx="20" cy="44" rx="9" ry="7.5" fill="#ED954B" stroke="#C26B27" stroke-width="1.2"/>
          <ellipse cx="20" cy="44" rx="4" ry="7.5" fill="#F6AC66"/>
        </svg>
      </div>
    `);
  }

  if (isShopDecorVisible('xmas_tree_shop')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Новогодняя ёлка">
        <svg viewBox="0 0 68 80" width="58" height="68">
          <rect x="27" y="64" width="14" height="10" rx="2" fill="#9E6B4B"/>
          <polygon points="34,26 11,64 57,64" fill="#3D7047"/>
          <polygon points="34,17 15,48 53,48" fill="#4B8556"/>
          <polygon points="34,10 20,33 48,33" fill="#5B9966"/>
          <path d="M23,28 Q34,34 45,28 M18,44 Q34,51 50,44 M14,58 Q34,65 54,58" fill="none" stroke="#FFE27A" stroke-width="2"/>
          <circle cx="28" cy="27" r="2.7" fill="#E45A63"/>
          <circle cx="40" cy="39" r="2.7" fill="#F4C752"/>
          <circle cx="24" cy="47" r="2.7" fill="#7FB8E0"/>
          <circle cx="44" cy="56" r="2.7" fill="#E45A63"/>
          <circle cx="30" cy="57" r="2.7" fill="#F4C752"/>
          <polygon points="34,2 36,7 41,7 37,10 38,15 34,12 30,15 31,10 27,7 32,7" fill="#FFD95E"/>
        </svg>
      </div>
    `);
  }

  if (isShopDecorVisible('vintage_vase')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Антикварная фарфоровая ваза">
        <svg viewBox="0 0 48 64" width="40" height="54">
          <ellipse cx="24" cy="59" rx="11" ry="3" fill="#B5C4D1"/>
          <path d="M17,18 Q13,34 15,52 Q24,58 33,52 Q35,34 31,18 Z" fill="#F8FBFE" stroke="#8CA8C4" stroke-width="1.8"/>
          <ellipse cx="24" cy="17" rx="8" ry="3" fill="#DDE8F2" stroke="#8CA8C4" stroke-width="1.5"/>
          <path d="M17,33 Q24,38 31,33" fill="none" stroke="#6E92B5" stroke-width="1.6"/>
          <circle cx="24" cy="42" r="4" fill="#89A9C9"/>
          <circle cx="24" cy="42" r="1.5" fill="#F8FBFE"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('retro_gramophone')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Ретро-граммофон">
        <svg viewBox="0 0 64 64" width="52" height="52">
          <rect x="10" y="42" width="40" height="16" rx="3" fill="#9A6844" stroke="#6E472B" stroke-width="1.8"/>
          <rect x="16" y="47" width="28" height="6" rx="2" fill="#C4935E"/>
          <ellipse cx="28" cy="42" rx="14" ry="3" fill="#2E2A2B"/>
          <path d="M36,41 L42,26" stroke="#D1A654" stroke-width="3" stroke-linecap="round"/>
          <path d="M40,26 C26,12 18,10 14,22 C18,32 30,30 40,26 Z" fill="#E3B964" stroke="#B68B3A" stroke-width="1.6"/>
          <ellipse cx="16" cy="20" rx="5" ry="9" transform="rotate(-18 16 20)" fill="#C99B45"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('marble_pedestal')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Мраморная тумба с кашпо">
        <svg viewBox="0 0 54 68" width="44" height="56">
          <rect x="11" y="56" width="32" height="7" rx="2" fill="#E9E5DF" stroke="#C5BEB4" stroke-width="1.3"/>
          <rect x="16" y="30" width="22" height="26" fill="#F6F3EE" stroke="#CEC7BD" stroke-width="1.3"/>
          <line x1="21" y1="32" x2="21" y2="54" stroke="#DCD5CA" stroke-width="1.4"/>
          <line x1="27" y1="32" x2="27" y2="54" stroke="#DCD5CA" stroke-width="1.4"/>
          <line x1="33" y1="32" x2="33" y2="54" stroke="#DCD5CA" stroke-width="1.4"/>
          <rect x="10" y="25" width="34" height="6" rx="2" fill="#ECE8E1" stroke="#C5BEB4" stroke-width="1.3"/>
          <polygon points="18,15 36,15 33,25 21,25" fill="#D9A78B"/>
          <circle cx="27" cy="11" r="7" fill="#7D9E7F"/>
          <circle cx="22" cy="12" r="4" fill="#F29AA4"/>
          <circle cx="32" cy="12" r="4" fill="#F6B8BF"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('gold_frame_art')) {
    wallItems.push(`
      <div class="shop-decor-svg-item" title="Картина в золотой раме">
        <svg viewBox="0 0 64 56" width="54" height="46">
          <rect x="6" y="6" width="52" height="44" rx="4" fill="#DFB66B" stroke="#A67E38" stroke-width="2"/>
          <rect x="12" y="12" width="40" height="32" rx="2" fill="#FAF4E8" stroke="#C49A4E" stroke-width="1.2"/>
          <path d="M32,39 Q32,26 26,22 M32,39 Q34,27 39,23" stroke="#6E9971" stroke-width="1.8" fill="none"/>
          <circle cx="25" cy="21" r="4.5" fill="#E87A88"/>
          <circle cx="39" cy="22" r="4.5" fill="#F4C752"/>
          <circle cx="32" cy="18" r="5" fill="#F29AA4"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('wall_clock_retro')) {
    wallItems.push(`
      <div class="shop-decor-svg-item" title="Вокзальные резные часы">
        <svg viewBox="0 0 54 54" width="46" height="46">
          <circle cx="27" cy="27" r="21" fill="#8C5D43" stroke="#5E3D2B" stroke-width="2"/>
          <circle cx="27" cy="27" r="16" fill="#FFFDF5" stroke="#DFB66B" stroke-width="1.5"/>
          <line x1="27" y1="27" x2="27" y2="16" stroke="#4A3E39" stroke-width="2" stroke-linecap="round"/>
          <line x1="27" y1="27" x2="36" y2="27" stroke="#4A3E39" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="27" cy="27" r="2" fill="#D98A7C"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('open_closed_sign')) {
    wallItems.push(`
      <div class="shop-decor-svg-item" title="Резная табличка «Рады гостям»">
        <svg viewBox="0 0 74 44" width="64" height="38">
          <path d="M22,12 L37,3 L52,12" stroke="#9C7B63" stroke-width="1.8" fill="none"/>
          <rect x="6" y="12" width="62" height="26" rx="6" fill="#C99B72" stroke="#8C6445" stroke-width="2"/>
          <rect x="10" y="16" width="54" height="18" rx="3" fill="#FFF8EE"/>
          <text x="37" y="28" text-anchor="middle" fill="#6E4E3E" font-size="8" font-weight="bold">ОТКРЫТО 🌸</text>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('brass_scales')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Латунные старинные весы">
        <svg viewBox="0 0 58 54" width="48" height="46">
          <rect x="18" y="45" width="22" height="6" rx="2" fill="#B68B3A"/>
          <rect x="27" y="14" width="4" height="32" fill="#D1A654"/>
          <line x1="10" y1="16" x2="48" y2="16" stroke="#D1A654" stroke-width="3" stroke-linecap="round"/>
          <path d="M10,16 L5,32 L15,32 Z M48,16 L43,32 L53,32 Z" stroke="#B68B3A" stroke-width="1.2" fill="none"/>
          <path d="M3,32 Q10,38 17,32 Z M41,32 Q48,38 55,32 Z" fill="#E3B964"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('watering_can_copper')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Медная винтажная лейка">
        <svg viewBox="0 0 56 46" width="46" height="38">
          <path d="M20,18 L8,10 L10,7 L22,15" fill="#D4845A"/>
          <ellipse cx="32" cy="30" rx="13" ry="12" fill="#D4845A" stroke="#9C5633" stroke-width="1.5"/>
          <path d="M36,19 Q48,15 47,29" fill="none" stroke="#9C5633" stroke-width="3" stroke-linecap="round"/>
          <ellipse cx="32" cy="19" rx="7" ry="3" fill="#E89D74"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('terracotta_shelf')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Этажерка с суккулентами">
        <svg viewBox="0 0 60 64" width="50" height="54">
          <rect x="10" y="18" width="40" height="4" rx="2" fill="#A97D59"/>
          <rect x="8" y="42" width="44" height="4" rx="2" fill="#A97D59"/>
          <line x1="14" y1="14" x2="14" y2="60" stroke="#7E5B3E" stroke-width="3"/>
          <line x1="46" y1="14" x2="46" y2="60" stroke="#7E5B3E" stroke-width="3"/>
          <polygon points="18,18 28,18 26,10 20,10" fill="#D98A6C"/>
          <circle cx="23" cy="8" r="5" fill="#6E9E69"/>
          <polygon points="34,18 42,18 40,10 36,10" fill="#D98A6C"/>
          <ellipse cx="38" cy="7" rx="3" ry="6" fill="#5D8C61"/>
          <polygon points="22,42 38,42 35,32 25,32" fill="#C97E6D"/>
          <circle cx="30" cy="29" r="6" fill="#7FB57B"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('cafe_bistro_table')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Кофейный столик для гостей">
        <svg viewBox="0 0 62 60" width="52" height="50">
          <ellipse cx="31" cy="26" rx="24" ry="6" fill="#FAF4EC" stroke="#C9A88C" stroke-width="2"/>
          <line x1="31" y1="32" x2="31" y2="54" stroke="#6E4E3E" stroke-width="4"/>
          <ellipse cx="31" cy="54" rx="12" ry="3.5" fill="#6E4E3E"/>
          <rect x="20" y="16" width="9" height="8" rx="2" fill="#FFFFFF" stroke="#C9A88C" stroke-width="1"/>
          <polygon points="36,24 44,24 43,16 37,16" fill="#E8A598"/>
          <circle cx="40" cy="14" r="4" fill="#F29AA4"/>
        </svg>
      </div>
    `);
  }

  if (isShopDecorVisible('mirror_arch_shop')) {
    wallItems.push(`
      <div class="shop-decor-svg-item" title="Арочное зеркало">
        <svg viewBox="0 0 48 64" width="40" height="54">
          <path d="M8,58 L8,24 Q24,4 40,24 L40,58 Z" fill="#DDF0FA" stroke="#DFB66B" stroke-width="3"/>
          <line x1="15" y1="24" x2="28" y2="14" stroke="#FFFFFF" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('botanical_atlas_stand')) {
    wallItems.push(`
      <div class="shop-decor-svg-item" title="Мольберт с ботанической гравюрой">
        <svg viewBox="0 0 54 62" width="46" height="52">
          <line x1="27" y1="6" x2="12" y2="58" stroke="#9C7A5C" stroke-width="2.5"/>
          <line x1="27" y1="6" x2="42" y2="58" stroke="#9C7A5C" stroke-width="2.5"/>
          <rect x="14" y="14" width="26" height="30" rx="2" fill="#FFFDF5" stroke="#B8906E" stroke-width="2"/>
          <circle cx="27" cy="27" r="6" fill="#E87A88"/>
          <path d="M27,33 L27,40" stroke="#6E9E69" stroke-width="2"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('chalkboard_menu')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Грифельная доска с ценами мелом">
        <svg viewBox="0 0 50 60" width="42" height="50">
          <rect x="10" y="10" width="30" height="38" rx="3" fill="#3D4342" stroke="#9C7A5C" stroke-width="3"/>
          <line x1="14" y1="48" x2="10" y2="58" stroke="#9C7A5C" stroke-width="3"/>
          <line x1="36" y1="48" x2="40" y2="58" stroke="#9C7A5C" stroke-width="3"/>
          <line x1="16" y1="22" x2="34" y2="22" stroke="#FFFDF9" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="18" y1="30" x2="31" y2="30" stroke="#F29AA4" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('bicycle_planter')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Ретро-велосипед с цветами">
        <svg viewBox="0 0 74 52" width="64" height="45">
          <circle cx="18" cy="36" r="10" fill="none" stroke="#FFFDF9" stroke-width="2.5"/>
          <circle cx="56" cy="36" r="10" fill="none" stroke="#FFFDF9" stroke-width="2.5"/>
          <path d="M18,36 L34,36 L44,20 L26,20 Z M56,36 L44,16 L52,14" stroke="#E8A598" stroke-width="2.5" fill="none"/>
          <rect x="48" y="16" width="16" height="10" rx="2" fill="#C99B72"/>
          <circle cx="53" cy="14" r="4" fill="#F29AA4"/><circle cx="60" cy="14" r="4" fill="#FFE382"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('candle_lantern_floor')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Напольный фонарь со свечой">
        <svg viewBox="0 0 42 58" width="36" height="50">
          <rect x="11" y="14" width="20" height="36" rx="2" fill="rgba(255,253,249,0.55)" stroke="#5D4641" stroke-width="2.5"/>
          <polygon points="8,14 21,4 34,14" fill="#5D4641"/>
          <rect x="18" y="34" width="6" height="12" fill="#FFFDF9"/>
          <ellipse cx="21" cy="31" rx="2.2" ry="4" fill="#FFBE42"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('ribbon_stand')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Стойка с атласными лентами">
        <svg viewBox="0 0 54 48" width="46" height="40">
          <rect x="8" y="10" width="4" height="34" fill="#8C6D56"/><rect x="42" y="10" width="4" height="34" fill="#8C6D56"/>
          <line x1="8" y1="22" x2="46" y2="22" stroke="#B8906E" stroke-width="2.5"/>
          <rect x="14" y="15" width="7" height="14" rx="2" fill="#E87A88"/>
          <rect x="23" y="15" width="7" height="14" rx="2" fill="#88AE8E"/>
          <rect x="32" y="15" width="7" height="14" rx="2" fill="#F6CA51"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('ceramic_pitchers_set')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Набор расписных кувшинов">
        <svg viewBox="0 0 54 44" width="46" height="38">
          <ellipse cx="18" cy="30" rx="8" ry="11" fill="#F5EAE0" stroke="#B8906E" stroke-width="1.6"/>
          <path d="M24,24 Q30,24 26,32" fill="none" stroke="#B8906E" stroke-width="2"/>
          <ellipse cx="38" cy="32" rx="7" ry="9" fill="#D6E6EB" stroke="#7A9EAE" stroke-width="1.6"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('wooden_crate_display')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Винтажный ящик с розами">
        <svg viewBox="0 0 58 44" width="48" height="36">
          <rect x="8" y="20" width="42" height="20" rx="2" fill="#C9A27E" stroke="#8C6445" stroke-width="1.8"/>
          <line x1="8" y1="30" x2="50" y2="30" stroke="#8C6445" stroke-width="1.5"/>
          <circle cx="20" cy="17" r="6" fill="#D95364"/><circle cx="30" cy="15" r="6.5" fill="#F29AA4"/><circle cx="40" cy="18" r="5.5" fill="#FFFDF8"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('brass_bell_counter')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Латунный звонок на прилавок">
        <svg viewBox="0 0 38 34" width="32" height="28">
          <ellipse cx="19" cy="28" rx="14" ry="4" fill="#6E4E3E"/>
          <path d="M9,27 A10,12 0 0,1 29,27 Z" fill="#DFB66B" stroke="#B68B3A" stroke-width="1.5"/>
          <circle cx="19" cy="14" r="2.2" fill="#B68B3A"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('antique_cashbox')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Медный винтажный кассовый аппарат">
        <svg viewBox="0 0 54 50" width="46" height="42">
          <rect x="6" y="34" width="42" height="12" rx="2" fill="#8C5D43" stroke="#5E3D2B" stroke-width="1.5"/>
          <path d="M10,34 L14,16 L40,16 L44,34 Z" fill="#D1A654" stroke="#9C7530" stroke-width="1.6"/>
          <rect x="16" y="10" width="22" height="7" rx="2" fill="#DFB66B" stroke="#9C7530" stroke-width="1.2"/>
          <rect x="15" y="21" width="24" height="8" rx="2" fill="#FFF8EE"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('porcelain_swan')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Фарфоровый лебедь">
        <svg viewBox="0 0 46 46" width="38" height="38">
          <ellipse cx="22" cy="36" rx="14" ry="8" fill="#FFFDF9" stroke="#C5D4DF" stroke-width="1.6"/>
          <path d="M29,33 Q36,20 31,13 Q28,10 26,14" fill="none" stroke="#FFFDF9" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M29,33 Q36,20 31,13 Q28,10 26,14" fill="none" stroke="#C5D4DF" stroke-width="1.5" stroke-linecap="round"/>
          <polygon points="24,13 20,15 24,16" fill="#E68A3E"/>
        </svg>
      </div>
    `);
  }

  const accShelfHtml = renderShopAccessoriesBar(gameState.shopLocationId);
  if (!wallItems.length && !floorItems.length && !accShelfHtml) return '';

  return `
    ${
      wallItems.length || floorItems.length
        ? `
      <div class="shop-decor-stage">
        ${wallItems.length ? `<div class="shop-wall-objects">${wallItems.join('')}</div>` : ''}
        ${
          floorItems.length
            ? `
          <div class="shop-floor-shelf-wrap">
            <div class="shop-floor-objects">${floorItems.join('')}</div>
            <div class="shop-shelf-plank"></div>
          </div>
        `
            : ''
        }
      </div>
    `
        : ''
    }
    ${accShelfHtml}
  `;
}

export function renderShopArchDetails(locId) {
  if (locId === 'shop_pavilion') {
    return `
      <div class="shop-arch-details">
        <div class="shop-hanging-plants">
          <svg viewBox="0 0 64 34" width="56" height="30">
            <line x1="32" y1="0" x2="32" y2="10" stroke="#9C846E" stroke-width="1.5"/>
            <polygon points="20,10 44,10 39,22 25,22" fill="#D9A78B"/>
            <path d="M22,12 Q14,22 18,31 M30,12 Q30,24 28,33 M38,12 Q46,21 44,30" stroke="#6E9E69" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <circle cx="18" cy="24" r="3" fill="#7FB57B"/><circle cx="44" cy="23" r="3" fill="#7FB57B"/>
          </svg>
          <svg viewBox="0 0 64 34" width="56" height="30">
            <line x1="32" y1="0" x2="32" y2="10" stroke="#9C846E" stroke-width="1.5"/>
            <polygon points="20,10 44,10 39,22 25,22" fill="#E8E1D6"/>
            <path d="M22,12 Q15,20 19,29 M32,12 Q32,23 33,32 M41,12 Q48,20 45,29" stroke="#5A8357" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <circle cx="26" cy="20" r="2.8" fill="#F29AA4"/><circle cx="38" cy="21" r="2.8" fill="#F6B8BF"/>
          </svg>
        </div>
      </div>
    `;
  }
  if (locId === 'shop_boutique') {
    return `
      <div class="shop-arch-details">
        <div class="shop-boutique-molding">
          <svg viewBox="0 0 320 18" width="100%" height="16" preserveAspectRatio="none">
            <line x1="10" y1="9" x2="128" y2="9" stroke="#DFB873" stroke-width="2"/>
            <circle cx="160" cy="9" r="6" fill="none" stroke="#DFB873" stroke-width="2"/>
            <circle cx="160" cy="9" r="2.5" fill="#DFB873"/>
            <line x1="192" y1="9" x2="310" y2="9" stroke="#DFB873" stroke-width="2"/>
          </svg>
        </div>
      </div>
    `;
  }
  return '';
}

export function renderShopWindowScenery(locId, timeClass, seasonId, weather) {
  const isEve = timeClass === 'time-evening';
  const groundColor =
    seasonId === 'winter' ? '#EDF4F8' :
    seasonId === 'early-spring' ? '#A4C89B' :
    seasonId === 'autumn' ? '#D99455' : '#8EC289';
  const foliageColor =
    seasonId === 'winter' ? '#D6E4EC' :
    seasonId === 'early-spring' ? '#A8CFA0' :
    seasonId === 'autumn' ? '#E28743' : '#73B070';
  const foliageAccent =
    seasonId === 'winter' ? '#EDF4F8' :
    seasonId === 'early-spring' ? '#F7C6CF' :
    seasonId === 'autumn' ? '#F0B654' : '#8BC986';

  const skySun =
    weather === 'rainy'
      ? ''
      : isEve
      ? '<circle cx="135" cy="20" r="9" fill="#FFF3C4" opacity="0.9"/>'
      : '<circle cx="135" cy="20" r="10" fill="#FFE382"/>';

  if (locId === 'shop_pavilion') {
    return `
      <svg class="window-scenery-svg" viewBox="0 0 170 100" preserveAspectRatio="none">
        ${skySun}
        <path d="M0,74 Q45,62 95,70 Q135,62 170,72 L170,100 L0,100 Z" fill="${groundColor}"/>
        <circle cx="28" cy="48" r="18" fill="${foliageColor}"/>
        <circle cx="42" cy="54" r="13" fill="${foliageAccent}"/>
        <rect x="25" y="64" width="5" height="14" fill="#8C6D56"/>
        <circle cx="144" cy="46" r="19" fill="${foliageColor}"/>
        <circle cx="129" cy="54" r="12" fill="${foliageAccent}"/>
        <rect x="142" y="63" width="5" height="15" fill="#8C6D56"/>
        <ellipse cx="86" cy="84" rx="26" ry="7" fill="#D5DEE3" stroke="#A6B7C2" stroke-width="1.5"/>
        <ellipse cx="86" cy="83" rx="20" ry="4.5" fill="#8CCAE8"/>
        <rect x="82" y="68" width="8" height="15" fill="#E3E9EC"/>
        <ellipse cx="86" cy="68" rx="13" ry="3.5" fill="#D5DEE3"/>
        <path d="M86,66 Q79,53 73,68 M86,66 Q93,53 99,68 M86,66 L86,52" stroke="#BEE8FA" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    `;
  }

  if (locId === 'shop_boutique') {
    const winLight = isEve ? '#FFE599' : '#BFE0F2';
    return `
      <svg class="window-scenery-svg" viewBox="0 0 170 100" preserveAspectRatio="none">
        ${skySun}
        <rect x="6" y="28" width="38" height="58" fill="#EBD7C5" stroke="#C9AD96" stroke-width="1"/>
        <polygon points="4,28 25,14 46,28" fill="#B57B6E"/>
        <rect x="13" y="36" width="8" height="12" rx="4" fill="${winLight}"/>
        <rect x="28" y="36" width="8" height="12" rx="4" fill="${winLight}"/>
        <rect x="46" y="34" width="42" height="52" fill="#F4E7D8" stroke="#D1B9A2" stroke-width="1"/>
        <rect x="54" y="42" width="9" height="13" fill="${winLight}"/>
        <rect x="70" y="42" width="9" height="13" fill="${winLight}"/>
        <rect x="114" y="24" width="48" height="62" fill="#E5D5C8" stroke="#BEA795" stroke-width="1"/>
        <polygon points="112,24 138,10 164,24" fill="#8C7B73"/>
        <rect x="122" y="34" width="10" height="14" rx="5" fill="${winLight}"/>
        <rect x="142" y="34" width="10" height="14" rx="5" fill="${winLight}"/>
        <rect x="0" y="78" width="170" height="22" fill="#C9BEB4"/>
        <path d="M0,78 Q85,73 170,78" stroke="#A6978B" stroke-width="1.5" fill="none"/>
        <circle cx="98" cy="64" r="10" fill="${foliageColor}"/>
        <line x1="106" y1="84" x2="106" y2="44" stroke="#4A3E39" stroke-width="2"/>
        <circle cx="106" cy="42" r="4.5" fill="#FFE694"/>
      </svg>
    `;
  }

  return `
    <svg class="window-scenery-svg" viewBox="0 0 170 100" preserveAspectRatio="none">
      ${skySun}
      <rect x="0" y="62" width="170" height="38" fill="#D7CCC2"/>
      <line x1="0" y1="74" x2="170" y2="74" stroke="#BEB1A5" stroke-width="1.5"/>
      <line x1="30" y1="74" x2="22" y2="100" stroke="#BEB1A5" stroke-width="1"/>
      <line x1="85" y1="74" x2="85" y2="100" stroke="#BEB1A5" stroke-width="1"/>
      <line x1="140" y1="74" x2="148" y2="100" stroke="#BEB1A5" stroke-width="1"/>
      <circle cx="28" cy="58" r="13" fill="${foliageColor}"/>
      <circle cx="40" cy="61" r="9" fill="${foliageAccent}"/>
      <rect x="96" y="57" width="44" height="11" rx="2" fill="#A67C5B"/>
      <circle cx="105" cy="54" r="4.5" fill="#F29AA4"/>
      <circle cx="118" cy="53" r="5" fill="#FFE28A"/>
      <circle cx="131" cy="54" r="4.5" fill="#F6B8BF"/>
      ${seasonId === 'winter' ? '<path d="M0,62 Q85,57 170,62 L170,69 L0,69 Z" fill="#F2F7FA"/>' : ''}
      <line x1="152" y1="74" x2="152" y2="18" stroke="#5C4E48" stroke-width="2.5"/>
      <circle cx="152" cy="18" r="4.5" fill="${isEve ? '#FFE599' : '#FFF8DC'}"/>
    </svg>
  `;
}

function getAccessoryShelfSvg(accId) {
  if (accId === 'balloon_heart') {
    return `
      <svg viewBox="0 0 34 36" width="32" height="34">
        <path d="M17,24 L17,34" stroke="#C9A88C" stroke-width="1.2"/>
        <path d="M17,10 C12,3 3,8 8,16 L17,25 L26,16 C31,8 22,3 17,10 Z" fill="#E86474" stroke="#C44858" stroke-width="1.2"/>
        <ellipse cx="12" cy="11" rx="2" ry="1.2" transform="rotate(-30 12 11)" fill="rgba(255,255,255,0.65)"/>
      </svg>
    `;
  }
  if (accId === 'balloon_star') {
    return `
      <svg viewBox="0 0 34 36" width="32" height="34">
        <path d="M17,24 L17,34" stroke="#C9A88C" stroke-width="1.2"/>
        <polygon points="17,3 21,11 30,12 23,18 25,27 17,22 9,27 11,18 4,12 13,11" fill="#F5C954" stroke="#D19D2E" stroke-width="1.2"/>
      </svg>
    `;
  }
  if (accId === 'plush_bear') {
    return `
      <svg viewBox="0 0 34 36" width="32" height="34">
        <circle cx="10" cy="10" r="4" fill="#C48F64"/><circle cx="24" cy="10" r="4" fill="#C48F64"/>
        <ellipse cx="17" cy="25" rx="9" ry="8" fill="#C48F64"/>
        <circle cx="17" cy="14" r="7.5" fill="#D19C72"/>
        <ellipse cx="17" cy="16" rx="3.5" ry="2.6" fill="#F0D4B8"/>
        <circle cx="17" cy="15" r="1.2" fill="#4A3E39"/>
        <circle cx="14.5" cy="12.5" r="1" fill="#4A3E39"/><circle cx="19.5" cy="12.5" r="1" fill="#4A3E39"/>
        <path d="M13,22 L21,22 L17,25 Z" fill="#E87A88"/>
      </svg>
    `;
  }
  if (accId === 'plush_bunny') {
    return `
      <svg viewBox="0 0 34 36" width="32" height="34">
        <ellipse cx="13" cy="8" rx="2.5" ry="6.5" fill="#EFE8E2" stroke="#D6CCC2" stroke-width="1"/>
        <ellipse cx="21" cy="8" rx="2.5" ry="6.5" fill="#EFE8E2" stroke="#D6CCC2" stroke-width="1"/>
        <ellipse cx="17" cy="26" rx="8" ry="7.5" fill="#EFE8E2" stroke="#D6CCC2" stroke-width="1"/>
        <circle cx="17" cy="16" r="6.5" fill="#FAF6F2" stroke="#D6CCC2" stroke-width="1"/>
        <circle cx="14.8" cy="15.5" r="1" fill="#4A3E39"/><circle cx="19.2" cy="15.5" r="1" fill="#4A3E39"/>
        <circle cx="17" cy="17.5" r="1.1" fill="#F29AA4"/>
      </svg>
    `;
  }
  if (accId === 'choco_box') {
    return `
      <svg viewBox="0 0 34 36" width="32" height="34">
        <rect x="5" y="15" width="24" height="17" rx="3" fill="#8C5346" stroke="#6B3B30" stroke-width="1.2"/>
        <line x1="17" y1="15" x2="17" y2="32" stroke="#DFB66B" stroke-width="2.2"/>
        <line x1="5" y1="23" x2="29" y2="23" stroke="#DFB66B" stroke-width="2.2"/>
        <circle cx="17" cy="23" r="2.5" fill="#F5D07B"/>
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 34 36" width="32" height="34">
      <rect x="6" y="16" width="22" height="16" rx="2" fill="#FFFDF9" stroke="#D8C2B4" stroke-width="1.2"/>
      <path d="M6,16 L17,25 L28,16" fill="none" stroke="#D8C2B4" stroke-width="1.2"/>
      <circle cx="17" cy="24" r="2.2" fill="#E87A88"/>
    </svg>
  `;
}

export function renderShopAccessoriesBar(locId) {
  if (locId === 'shop_basement') return '';
  const items = (gameState.accessoriesInventory || []).filter((a) => a.qty > 0);
  if (!items.length) return '';

  const visualsHtml = items
    .map((a) => {
      const meta = ACCESSORIES_CATALOG[a.id];
      if (!meta) return '';
      return `
        <div class="shop-acc-visual" title="${escapeAttr(meta.name)} (${a.qty} шт.)">
          ${getAccessoryShelfSvg(a.id)}
        </div>
      `;
    })
    .join('');

  return `
    <div class="shop-accessories-shelf">
      <div class="shop-acc-items-row">${visualsHtml}</div>
      <div class="shop-acc-plank"></div>
    </div>
  `;
}

export function renderWeatherParticles(weather, seasonId) {
  if (weather === 'rainy') {
    return Array.from({ length: 14 }, (_, idx) => {
      const left = 5 + ((idx * 7) % 90);
      const delay = (idx * 0.14).toFixed(2);
      return `<span class="rain-drop" style="left:${left}%; animation-delay:${delay}s;"></span>`;
    }).join('');
  }
  if (weather === 'frost' || seasonId === 'winter') {
    return Array.from({ length: 14 }, (_, idx) => {
      const left = 4 + ((idx * 11) % 92);
      const delay = (idx * 0.25).toFixed(2);
      return `<span class="snow-flake" style="left:${left}%; animation-delay:${delay}s;"></span>`;
    }).join('');
  }
  if (seasonId === 'autumn') {
    return Array.from({ length: 8 }, (_, idx) => {
      const left = 8 + ((idx * 13) % 86);
      const delay = (idx * 0.35).toFixed(2);
      return `<span class="autumn-leaf" style="left:${left}%; animation-delay:${delay}s;"></span>`;
    }).join('');
  }
  return '';
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}