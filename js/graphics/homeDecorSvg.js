/**
 * js/graphics/homeDecorSvg.js
 * SVG-графика новых украшений квартиры (настенных и напольных)
 */

import { gameState } from '../state.js';

function isShown(id) {
  const owned =
    (gameState.decorInventory && gameState.decorInventory.includes(id)) ||
    (gameState.decor && gameState.decor.includes(id));
  if (!owned) return false;
  return !(gameState.hiddenDecor || []).includes(id);
}

export function renderExtraHomeWallDecor() {
  const parts = [];
  if (isShown('wall_tapestry')) {
    parts.push(`
      <span class="home-rare-decor-spot" title="Тканый гобелен с лугами">
        <svg viewBox="0 0 42 52" width="34" height="42">
          <line x1="6" y1="6" x2="36" y2="6" stroke="#8C6D56" stroke-width="2.5" stroke-linecap="round"/>
          <polygon points="9,8 33,8 33,40 21,47 9,40" fill="#F2DEC8" stroke="#D1A694" stroke-width="1.5"/>
          <path d="M21,36 L21,18 M21,28 L15,24 M21,25 L27,21" stroke="#6E9E69" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="21" cy="17" r="3.5" fill="#D98A7C"/>
        </svg>
      </span>
    `);
  }
  if (isShown('herbarium_frame')) {
    parts.push(`
      <span class="home-rare-decor-spot" title="Гербарий в стеклянной раме">
        <svg viewBox="0 0 36 44" width="30" height="36">
          <rect x="4" y="4" width="28" height="36" rx="2" fill="#EBF4F8" stroke="#A67E38" stroke-width="2"/>
          <path d="M18,34 Q18,20 12,14 M18,34 Q20,22 25,16" stroke="#8C6D56" stroke-width="1.4" fill="none"/>
          <circle cx="12" cy="14" r="3.5" fill="#E8A598"/>
          <circle cx="24" cy="16" r="3" fill="#DFAB4E"/>
        </svg>
      </span>
    `);
  }
  if (isShown('star_projector')) {
    parts.push(`
      <span class="home-rare-decor-spot home-star-glow" title="Ночник-проектор звёздного неба">
        <svg viewBox="0 0 38 40" width="32" height="34">
          <ellipse cx="19" cy="34" rx="12" ry="4" fill="#6E769F"/>
          <path d="M9,33 A10,12 0 0,1 29,33 Z" fill="#9BB5E0"/>
          <circle cx="16" cy="25" r="1.5" fill="#FFE694"/><circle cx="23" cy="23" r="1.8" fill="#FFFDF9"/>
          <circle cx="19" cy="12" r="2" fill="#FFE694"/><circle cx="10" cy="9" r="1.5" fill="#FFFDF9"/>
        </svg>
      </span>
    `);
  }
  if (isShown('aquarium_home')) {
    parts.push(`
      <span class="home-rare-decor-spot" title="Круглый аквариум с рыбкой">
        <svg viewBox="0 0 44 42" width="36" height="34">
          <circle cx="22" cy="22" r="16" fill="#CFEAF7" stroke="#96C2D9" stroke-width="2"/>
          <path d="M10,28 Q22,34 34,28 L34,30 Q22,38 10,30 Z" fill="#E5CBA8"/>
          <path d="M15,30 Q14,22 17,19" stroke="#6E9E69" stroke-width="2" fill="none"/>
          <ellipse cx="24" cy="21" rx="5" ry="3" fill="#FF9248"/>
          <polygon points="29,21 33,18 33,24" fill="#FF9248"/>
        </svg>
      </span>
    `);
  }
  if (isShown('tea_tray_home')) {
    parts.push(`
      <span class="home-rare-decor-spot" title="Поднос с чаем и круассаном">
        <svg viewBox="0 0 46 32" width="38" height="26">
          <ellipse cx="23" cy="25" rx="20" ry="5" fill="#C9A88C"/>
          <rect x="10" y="13" width="11" height="10" rx="2" fill="#FFFDF9" stroke="#D98A7C" stroke-width="1.2"/>
          <ellipse cx="32" cy="21" rx="7" ry="4" fill="#E2A45E"/>
        </svg>
      </span>
    `);
  }
  if (isShown('scented_candles_set')) {
    parts.push(`
      <span class="home-rare-decor-spot" title="Аромасвечи «Лаванда и мёд»">
        <svg viewBox="0 0 38 36" width="32" height="30">
          <rect x="8" y="16" width="8" height="16" rx="2" fill="#DFD2EB"/>
          <rect x="20" y="20" width="9" height="12" rx="2" fill="#FCE6B4"/>
          <ellipse cx="12" cy="12" rx="2" ry="3.5" fill="#FFBE42"/>
          <ellipse cx="24.5" cy="16" rx="2" ry="3" fill="#FFBE42"/>
        </svg>
      </span>
    `);
  }
  if (isShown('record_wall_home')) {
    parts.push(`
      <span class="home-rare-decor-spot" title="Коллекция виниловых пластинок">
        <svg viewBox="0 0 44 36" width="36" height="30">
          <circle cx="14" cy="18" r="10" fill="#322C2B"/><circle cx="14" cy="18" r="3.5" fill="#E896A4"/>
          <circle cx="30" cy="18" r="10" fill="#322C2B"/><circle cx="30" cy="18" r="3.5" fill="#FFE382"/>
        </svg>
      </span>
    `);
  }
  if (isShown('stained_lamp_moon')) {
    parts.push(`
      <span class="home-rare-decor-spot" title="Ночник-полумесяц">
        <svg viewBox="0 0 36 38" width="30" height="32">
          <ellipse cx="18" cy="34" rx="9" ry="3" fill="#8C6D56"/>
          <path d="M22,6 A13,13 0 1,0 26,28 A10,10 0 1,1 22,6 Z" fill="#FFE694" stroke="#E0B654" stroke-width="1.4"/>
        </svg>
      </span>
    `);
  }
  if (isShown('indoor_bonsai')) {
    parts.push(`
      <span class="home-rare-decor-spot" title="Миниатюрный бонсай">
        <svg viewBox="0 0 44 40" width="36" height="32">
          <rect x="10" y="28" width="24" height="8" rx="3" fill="#6E4E3E"/>
          <path d="M22,28 Q19,20 25,15" stroke="#7E5B3E" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="18" cy="14" rx="9" ry="5.5" fill="#5D8C61"/>
          <ellipse cx="28" cy="11" rx="8" ry="5" fill="#73A876"/>
        </svg>
      </span>
    `);
  }
  if (isShown('ceramic_tea_set')) {
    parts.push(`
      <span class="home-rare-decor-spot" title="Чайный сервиз с ромашками">
        <svg viewBox="0 0 42 32" width="34" height="26">
          <circle cx="16" cy="20" r="8" fill="#FFFDF9" stroke="#C9A88C" stroke-width="1.5"/>
          <rect x="13" y="10" width="6" height="3" rx="1" fill="#E6B85C"/>
          <circle cx="16" cy="20" r="2.2" fill="#F0BD43"/>
          <rect x="28" y="19" width="7" height="8" rx="2" fill="#FFFDF9" stroke="#C9A88C" stroke-width="1.3"/>
        </svg>
      </span>
    `);
  }
  if (isShown('vintage_typewriter')) {
    parts.push(`
      <span class="home-rare-decor-spot" title="Старинная печатная машинка">
        <svg viewBox="0 0 44 36" width="36" height="30">
          <rect x="12" y="4" width="20" height="14" rx="1" fill="#FFFDF9" stroke="#D5C8BC" stroke-width="1.2"/>
          <rect x="6" y="17" width="32" height="14" rx="4" fill="#6E8A78"/>
          <rect x="10" y="23" width="24" height="5" rx="2" fill="#EDE4DA"/>
        </svg>
      </span>
    `);
  }
  if (isShown('dreamcatcher_boho')) {
    parts.push(`
      <span class="home-rare-decor-spot" title="Ловец снов с бусинами">
        <svg viewBox="0 0 34 48" width="28" height="40">
          <circle cx="17" cy="14" r="10" fill="none" stroke="#C9A88C" stroke-width="2"/>
          <path d="M17,4 L17,24 M7,14 L27,14 M10,7 L24,21 M24,7 L10,21" stroke="#E5D3BA" stroke-width="1"/>
          <line x1="12" y1="24" x2="10" y2="41" stroke="#D98A7C" stroke-width="2"/>
          <line x1="17" y1="24" x2="17" y2="45" stroke="#9BB59B" stroke-width="2"/>
          <line x1="22" y1="24" x2="24" y2="41" stroke="#D98A7C" stroke-width="2"/>
        </svg>
      </span>
    `);
  }
  return parts.join('');
}

export function renderExtraHomeFloorDecor() {
  const parts = [];
  if (isShown('hanging_chair')) {
    parts.push(`
      <div class="home-decor-edge home-hanging-chair" title="Подвесное кресло-кокон">
        <svg viewBox="0 0 60 88" width="100%" height="100%">
          <line x1="30" y1="0" x2="30" y2="16" stroke="#8C6D56" stroke-width="2.5"/>
          <ellipse cx="30" cy="48" rx="22" ry="30" fill="#E6C9A8" stroke="#B8906E" stroke-width="2.5"/>
          <ellipse cx="30" cy="50" rx="16" ry="22" fill="#FAF0E6"/>
          <ellipse cx="30" cy="60" rx="13" ry="8" fill="#E8A598"/>
        </svg>
      </div>
    `);
  }
  if (isShown('acoustic_guitar')) {
    parts.push(`
      <div class="home-decor-edge home-guitar" title="Акустическая гитара у стены">
        <svg viewBox="0 0 42 74" width="100%" height="100%">
          <rect x="18" y="4" width="6" height="28" rx="2" fill="#6E4E3E"/>
          <circle cx="21" cy="54" r="14" fill="#D4845A" stroke="#8C5233" stroke-width="2"/>
          <circle cx="21" cy="40" r="10" fill="#D4845A" stroke="#8C5233" stroke-width="2"/>
          <circle cx="21" cy="44" r="4" fill="#3B2E2A"/>
        </svg>
      </div>
    `);
  }
  if (isShown('cat_fountain')) {
    parts.push(`
      <div class="home-decor-edge home-fountain" title="Питьевой фонтанчик для кошки">
        <svg viewBox="0 0 44 38" width="100%" height="100%">
          <ellipse cx="22" cy="28" rx="17" ry="7" fill="#D6E8F2" stroke="#8EB8D1" stroke-width="1.8"/>
          <rect x="19" y="14" width="6" height="14" rx="2" fill="#FFFDF9"/>
          <path d="M22,12 Q16,18 16,25 M22,12 Q28,18 28,25" stroke="#78BCE0" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>
      </div>
    `);
  }
  if (isShown('cat_scratcher_cactus')) {
    parts.push(`
      <div class="home-decor-edge home-scratcher" title="Когтеточка-кактус с помпоном">
        <svg viewBox="0 0 44 64" width="100%" height="100%">
          <ellipse cx="22" cy="58" rx="15" ry="4" fill="#E8D7C5"/>
          <rect x="17" y="16" width="10" height="42" rx="5" fill="#6E9E69"/>
          <path d="M17,34 Q10,34 10,26" stroke="#6E9E69" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M27,28 Q34,28 34,20" stroke="#6E9E69" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="34" cy="12" r="3" fill="#F29AA4"/>
        </svg>
      </div>
    `);
  }
  if (isShown('cat_hammock_window')) {
    parts.push(`
      <div class="home-decor-edge" style="left:6px; bottom:62px; width:46px; height:24px;" title="Оконный гамак для Пискли">
        <svg viewBox="0 0 46 24" width="100%" height="100%">
          <path d="M4,6 Q23,22 42,6 Z" fill="#F2D7D0" stroke="#C98A7E" stroke-width="2"/>
          <circle cx="6" cy="5" r="2.5" fill="#FFFDF9"/><circle cx="40" cy="5" r="2.5" fill="#FFFDF9"/>
        </svg>
      </div>
    `);
  }
  if (isShown('linen_armchair')) {
    parts.push(`
      <div class="home-decor-edge" style="left:210px; bottom:10px; width:48px; height:52px;" title="Кресло-качалка с пледом">
        <svg viewBox="0 0 48 52" width="100%" height="100%">
          <rect x="10" y="10" width="28" height="24" rx="7" fill="#E3D4C3" stroke="#B8906E" stroke-width="2"/>
          <rect x="12" y="24" width="24" height="10" rx="3" fill="#D98A7C"/>
          <path d="M6,44 Q24,50 42,44" stroke="#8C6D56" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>
      </div>
    `);
  }
  if (isShown('woven_basket_yarn')) {
    parts.push(`
      <div class="home-decor-edge" style="left:195px; bottom:6px; width:28px; height:24px;" title="Корзинка с клубками">
        <svg viewBox="0 0 32 26" width="100%" height="100%">
          <polygon points="4,12 28,12 24,24 8,24" fill="#D5B28E" stroke="#9C7A5C" stroke-width="1.5"/>
          <circle cx="12" cy="11" r="5" fill="#F29AA4"/><circle cx="20" cy="11" r="5" fill="#FFE382"/>
        </svg>
      </div>
    `);
  }
  if (isShown('indoor_citrus_tree')) {
    parts.push(`
      <div class="home-decor-edge" style="right:42px; bottom:10px; width:44px; height:64px;" title="Мандариновое деревце">
        <svg viewBox="0 0 44 64" width="100%" height="100%">
          <polygon points="15,60 29,60 32,44 12,44" fill="#D98A6C"/>
          <line x1="22" y1="44" x2="22" y2="24" stroke="#7E5B3E" stroke-width="3"/>
          <circle cx="22" cy="20" r="14" fill="#5D8C61"/>
          <circle cx="16" cy="18" r="2.8" fill="#FF9233"/>
          <circle cx="26" cy="14" r="2.8" fill="#FF9233"/>
          <circle cx="24" cy="24" r="2.8" fill="#FF9233"/>
        </svg>
      </div>
    `);
  }
  return parts.join('');
}