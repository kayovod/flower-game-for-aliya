import {
  FLOWERS_CATALOG,
  TIME_PERIODS,
  WEATHERS,
  AI_PROVIDERS,
  AI_SETTINGS_KEY,
  DECOR_CATALOG,
  getGameDateObj,
  getSeasonInfo,
  getHolidayForDate
} from '../config.js';
import { gameState, aiSettings, saveState, advanceShift, isShopClosedNow, addGameMinutes } from '../state.js';
import { getFlowerInVaseSvg, getSingleFlowerWrappedSvg } from '../graphics/flowersSvg.js';
import { getClientAvatarSvg } from '../graphics/avatarSvg.js';
import { renderBouquetMaker, addFlowerToDraftBouquet } from './bouquetMaker.js';
import {
  generateRandomClient,
  generatePreorderClient,
  buildClientSystemPrompt,
  callAI,
  parseClientJson
} from '../ai.js';
import { playBellSound, playCoinSound, playPaperSound } from '../sound.js';

let selectedVaseUid = null;
let shopSubTab = 'hall';

let activeClient = null;
let isAiThinking = false;
let showOfferDrawer = false;
let showRejectPanel = false;
let showShopDecorModal = false;
let pendingOffer = null;
let lastFailedRequest = null;

const SHOP_REJECT_TEMPLATES = [
  'Нет нужных цветов в наличии',
  'Много заказов, не успеем собрать',
  'Бюджет маловат для такого букета',
  'Лавка скоро закрывается'
];

function isShopDecorShown(id) {
  return (gameState.decor || []).includes(id) && !(gameState.hiddenDecor || []).includes(id);
}

export function isBouquetMakerOpen() {
  return shopSubTab === 'bouquet';
}

export function isClientTalkingNow() {
  return Boolean(activeClient && activeClient.status === 'talking');
}

/** Проверка и авто-приход предзаказчика, когда наступило его время */
export function checkPreorderArrival(onHudUpdate, showToast) {
  if (!Array.isArray(gameState.preorders)) return false;

  let cleaned = false;
  gameState.preorders.forEach((p) => {
    if (p.day < gameState.day && (p.status === 'waiting' || p.status === 'in_shop')) {
      p.status = 'expired';
      const dm = (gameState.directMessages || []).find((m) => m.id === p.dmId);
      if (dm && dm.order && !dm.order.done) {
        dm.order.accepted = false;
        dm.order.rejected = true;
      }
      cleaned = true;
    }
  });
  if (cleaned) saveState();

  if (isClientTalkingNow() || isAiThinking) return false;

  const curMin = gameState.timeMinutes || 540;
  const duePreorder = gameState.preorders.find(
    (p) =>
      p.day === gameState.day &&
      ((p.status === 'in_shop' && !activeClient) || (p.status === 'waiting' && curMin >= p.dueMinutes))
  );
  if (!duePreorder) return false;

  duePreorder.status = 'in_shop';
  saveState();
  playBellSound();
  showToast(`🕒 Пришёл заказчик по предзаказу: ${duePreorder.senderName} (${duePreorder.dueTimeLabel})!`);
  summonPreorderClient(duePreorder, onHudUpdate, showToast);
  return true;
}

export function renderShopScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-shop');
  if (!container) return;

  const stemsCount = gameState.currentBouquet?.stems?.length || 0;
  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const season = getSeasonInfo(curDate);
  const isHoliday = getHolidayForDate(curDate);
  const closedNow = isShopClosedNow();

  const openStr = String(gameState.openHour || 9).padStart(2, '0') + ':00';
  const closeStr = String(gameState.closeHour || 21).padStart(2, '0') + ':00';

  container.innerHTML = `
    <div class="screen-header">
      <h1 class="screen-title">${escapeHtml(gameState.shopName || 'Fleur Atelier')}</h1>
      <div style="display:flex; gap:5px; align-items:center;">
        ${gameState.hasFridge ? '<span class="badge badge-ok" title="Холодильник замедляет увядание">❄️</span>' : ''}
        <span class="badge ${closedNow ? 'badge-warn' : isHoliday ? 'badge-warn' : 'badge-ok'}">
          ${closedNow ? '🌙 Закрыто' : isHoliday ? '🎉 Праздник!' : `${openStr}–${closeStr}`}
        </span>
      </div>
    </div>

    <div class="segmented-tabs">
      <button class="seg-btn ${shopSubTab === 'hall' ? 'active' : ''}" data-shop-tab="hall">
        🏪 Зал и клиенты
      </button>
      <button class="seg-btn ${shopSubTab === 'bouquet' ? 'active' : ''}" data-shop-tab="bouquet">
        💐 Стол сборки ${stemsCount > 0 ? `(${stemsCount})` : ''}
      </button>
    </div>

    <div id="shop-subtab-content" style="display: flex; flex-direction: column; gap: 12px;"></div>
  `;

 container.querySelectorAll('[data-shop-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextSubTab = btn.dataset.shopTab;
      if (nextSubTab !== shopSubTab) {
        shopSubTab = nextSubTab;
        renderShopScreen(onHudUpdate, showToast);
        container.scrollTop = 0;
        if (shopSubTab === 'hall' && !isShopClosedNow()) {
          checkPreorderArrival(onHudUpdate, showToast);
        }
      }
    });
  });
  const subContent = document.getElementById('shop-subtab-content');
  if (shopSubTab === 'bouquet') {
    renderBouquetMaker(subContent, onHudUpdate, showToast, () => {
      renderShopScreen(onHudUpdate, showToast);
    });
    return;
  }

  const timeClass = gameState.timeIndex === 2 || closedNow ? 'time-evening' : 'time-day';
  const weatherClass = `weather-${gameState.weather}`;
  const weatherObj = WEATHERS.find((w) => w.id === gameState.weather) || WEATHERS[0];
  const periodName = closedNow ? 'После закрытия' : TIME_PERIODS[gameState.timeIndex] || 'Утро';

  const wallpaperClass = isShopDecorShown('vintage_wallpaper') ? 'has-wallpaper' : '';
  const powerClass = gameState.powerOutage ? (gameState.candlesLit ? 'power-out candles-lit' : 'power-out') : '';
  const hasNeon = isShopDecorShown('neon_sign');

  const vasesHtml = gameState.inventory.length
    ? gameState.inventory.map((item) => renderVaseSlot(item)).join('')
    : `<div class="muted-text" style="grid-column: 1 / -1; text-align: center; padding: 18px 8px;">
         Вазы пусты! Закажи свежие цветы в «📱 Телефон» → «🚚 Оптовик».
       </div>`;

  const selectedItem = gameState.inventory.find((i) => i.uid === selectedVaseUid) || null;

  subContent.innerHTML = `
    <div class="shop-scene ${timeClass} ${wallpaperClass} ${powerClass}">
      <div class="shop-garland">
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
      </div>

      ${renderShopTopDecor(hasNeon)}

      ${gameState.powerOutage ? `
        <div class="power-alert-bar">
          <span>${gameState.candlesLit ? '🕯️ В лавке горят уютные свечи!' : '⚡ Отключили свет! В лавке темно.'}</span>
          ${!gameState.candlesLit ? '<button class="btn btn-primary" id="btn-light-candles" style="padding:5px 9px; font-size:11px;">🕯️ Зажечь свечи</button>' : ''}
        </div>
      ` : ''}

      <div class="shop-window-row">
        <div class="shop-window ${timeClass} ${weatherClass}">
          <div class="window-celestial"></div>
          <div class="window-horizon season-${season.id}"></div>
          <div class="weather-particles">${renderWeatherParticles(gameState.weather, season.id)}</div>
          <div class="window-pane-v"></div>
          <div class="window-pane-h"></div>
        </div>

        <div class="shop-sign-box">
          <div class="sign-title">${periodName}</div>
          <div class="sign-subtitle">${weatherObj.icon} ${season.label}</div>
          <div style="display:flex; gap:4px; width:100%;">
            <button class="btn btn-soft" id="btn-next-shift" style="flex:1; padding: 6px 4px; font-size: 11px;" ${closedNow ? 'disabled style="opacity:0.5;"' : ''}>
              ⏩ Смена
            </button>
            <button class="btn btn-soft" id="btn-open-shop-decor" style="padding: 6px 8px; font-size: 11px;" title="Повесить или убрать декор зала">
              🎨 Декор
            </button>
          </div>
        </div>
      </div>

      ${renderShopDecorVisuals()}

      ${renderPreordersQueue()}

      ${renderClientZone(closedNow)}

      <div class="vases-grid">
        ${vasesHtml}
      </div>
      <div class="wooden-counter"></div>
    </div>

    ${selectedItem ? renderInspectorModal(selectedItem) : ''}
    ${showShopDecorModal ? renderShopDecorModal() : ''}
  `;

  bindShopEvents(subContent, onHudUpdate, showToast);
  scrollChatToBottom();
}

function renderShopTopDecor(hasNeon) {
  const parts = [];
  if (isShopDecorShown('shop_arch')) {
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
  if (isShopDecorShown('hearts_garland_shop')) {
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
          ].map((h) => `
            <g transform="translate(${h.x}, ${h.y})">
              <path d="M0,3 C-4,-2 -9,2 -5,7 L0,12 L5,7 C9,2 4,-2 0,3 Z" fill="${h.c}" stroke="#FFFDF9" stroke-width="0.9"/>
            </g>
          `).join('')}
        </svg>
      </div>
    `);
  }
  if (hasNeon) {
    parts.push(`<div class="shop-neon-badge">✨ ${escapeHtml(gameState.shopName || 'Fleur Atelier')} ✨</div>`);
  }
  return parts.join('');
}

function renderShopDecorVisuals() {
  const wallItems = [];
  const floorItems = [];

  if (isShopDecorShown('wreath_shop')) {
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

  if (isShopDecorShown('shop_mirror')) {
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

  if (isShopDecorShown('shop_chalkboard')) {
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

  if (isShopDecorShown('pumpkins_shop')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Осенние тыквы">
        <svg viewBox="0 0 88 58" width="76" height="50">
          <path d="M10,50 Q4,42 14,39 Q18,46 10,50 Z" fill="#D96E34"/>
          <path d="M77,50 Q84,42 74,39 Q70,46 77,50 Z" fill="#E6A445"/>
          <!-- Большая тыква -->
          <path d="M35,18 Q36,12 40,11" fill="none" stroke="#5A7247" stroke-width="3" stroke-linecap="round"/>
          <ellipse cx="36" cy="36" rx="19" ry="15" fill="#DF7135" stroke="#B55220" stroke-width="1.5"/>
          <ellipse cx="36" cy="36" rx="12" ry="15" fill="#EB8243"/>
          <ellipse cx="36" cy="36" rx="5.5" ry="15" fill="#F29457"/>
          <!-- Вторая светло-золотая тыква -->
          <path d="M62,25 Q63,20 66,19" fill="none" stroke="#5A7247" stroke-width="2.5" stroke-linecap="round"/>
          <ellipse cx="62" cy="40" rx="13" ry="11" fill="#E8AE52" stroke="#C48B32" stroke-width="1.3"/>
          <ellipse cx="62" cy="40" rx="6" ry="11" fill="#F2C06B"/>
          <!-- Маленькая тыковка спереди -->
          <ellipse cx="20" cy="44" rx="9" ry="7.5" fill="#ED954B" stroke="#C26B27" stroke-width="1.2"/>
          <ellipse cx="20" cy="44" rx="4" ry="7.5" fill="#F6AC66"/>
        </svg>
      </div>
    `);
  }

  if (isShopDecorShown('xmas_tree_shop')) {
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

  if (!wallItems.length && !floorItems.length) return '';

  return `
    <div class="shop-decor-stage">
      ${wallItems.length ? `<div class="shop-wall-objects">${wallItems.join('')}</div>` : ''}
      ${floorItems.length ? `
        <div class="shop-floor-shelf-wrap">
          <div class="shop-floor-objects">${floorItems.join('')}</div>
          <div class="shop-shelf-plank"></div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderShopDecorModal() {
  const shopItems = DECOR_CATALOG.filter(
    (d) => d.place === 'Магазин' && d.id !== 'fridge' && (gameState.decor || []).includes(d.id)
  );
  const listHtml = shopItems.length
    ? shopItems
        .map((item) => {
          const isHidden = (gameState.hiddenDecor || []).includes(item.id);
          return `
            <div class="decor-toggle-row">
              <div style="display:flex; align-items:center; gap:7px; flex:1; min-width:0;">
                <span style="font-size:18px;">${item.icon}</span>
                <div style="min-width:0;">
                  <strong style="font-size:12px;">${escapeHtml(item.name)}</strong>
                  <div class="muted-text" style="font-size:10px;">${item.category || 'Обычный'}</div>
                </div>
              </div>
              <button class="btn ${isHidden ? 'btn-sage' : 'btn-soft'}" data-toggle-shop-decor="${item.id}" style="padding:5px 9px; font-size:11px;">
                ${isHidden ? 'Повесить' : 'Убрать'}
              </button>
            </div>
          `;
        })
        .join('')
    : `<p class="muted-text" style="text-align:center; padding:12px 4px;">У тебя пока нет украшений для зала. Купи гирлянды, ёлку, арку или тыквы в «📱 Телефон» → «🛋️ Декор»!</p>`;

  return `
    <div class="vase-modal-overlay" id="shop-decor-modal-overlay">
      <div class="flower-inspector vase-modal-card">
        <div class="row-between">
          <strong style="font-size:15px;">🎨 Декор торгового зала</strong>
          <button class="btn btn-soft" id="btn-close-shop-decor" style="padding:5px 10px; font-size:12px;">✕</button>
        </div>
        <p class="muted-text" style="font-size:11.5px;">Вешай и убирай купленные украшения для витрины и стен:</p>
        <div class="decor-toggle-list">${listHtml}</div>
      </div>
    </div>
  `;
}

function renderPreordersQueue() {
  const activePreorders = (gameState.preorders || []).filter(
    (p) => p.day === gameState.day && (p.status === 'waiting' || p.status === 'in_shop')
  );
  if (!activePreorders.length) return '';

  const curMin = gameState.timeMinutes || 540;
  const rowsHtml = activePreorders
    .sort((a, b) => a.dueMinutes - b.dueMinutes)
    .map((p) => {
      const isDue = curMin >= p.dueMinutes;
     const inShop = p.status === 'in_shop';
      const talkingToThisPreorder = activeClient && activeClient.preorder && activeClient.preorder.id === p.id && activeClient.status === 'talking';
      return `
        <div class="preorder-row ${isDue || inShop ? 'due-now' : ''}">
          <div style="flex:1; min-width:0;">
            <strong>${escapeHtml(p.senderName)}</strong> • <span>${p.dueTimeLabel}</span>
            <div class="muted-text" style="font-size:11px;">
              ${p.qty} шт. «${escapeHtml(p.flowerName)}» (${p.reward} ₽)
            </div>
          </div>
          ${inShop ? (
            talkingToThisPreorder
              ? '<span class="badge badge-ok">У прилавка</span>'
              : `<button class="btn btn-primary" data-call-inshop="${p.id}" style="padding:5px 9px; font-size:11px;">🔔 Принять</button>`
          ) : `
            <button class="btn btn-soft" data-go-assemble="${p.id}" style="padding:5px 8px; font-size:11px;">
              💐 Собрать
            </button>
          `}
        </div>
      `;
    })
    .join('');

  return `
    <div class="preorders-queue-card">
      <div class="row-between">
        <strong style="font-size:12px;">📋 Предзаказы на сегодня (${activePreorders.length})</strong>
        <span class="muted-text" style="font-size:10.5px;">Придут сами ко времени</span>
      </div>
      ${rowsHtml}
    </div>
  `;
}

function renderClientZone(closedNow) {
  const waitingDue = (gameState.preorders || []).find(
    (p) =>
      p.day === gameState.day &&
      (p.status === 'in_shop' || (p.status === 'waiting' && (gameState.timeMinutes || 540) >= p.dueMinutes))
  );

  if (!activeClient) {
    if (waitingDue) {
      return `
        <div class="card" style="padding: 12px; text-align: center;">
          <p class="muted-text">🕒 У двери уже ждёт заказчик по предзаказу на ${waitingDue.dueTimeLabel}!</p>
          <button class="btn btn-primary" id="btn-call-due-preorder" data-preorder-id="${waitingDue.id}">
            🔔 Пригласить ${escapeHtml(waitingDue.senderName)}
          </button>
        </div>
      `;
    }
    if (closedNow) {
      return `
        <div class="card" style="padding: 12px; text-align: center;">
          <p class="muted-text">🌙 Рабочий день окончен — новые клиенты уже не заходят. Можешь дособирать букеты на завтра или отправиться в «🏠 Домик» спать.</p>
        </div>
      `;
    }
    return `
      <div class="card" style="padding: 12px; text-align: center;">
        <p class="muted-text">В зале пока тихо. Открой дверь для нового покупателя!</p>
        <button class="btn btn-primary" id="btn-call-client" ${isAiThinking ? 'disabled' : ''}>
          🔔 Позвать следующего клиента
        </button>
      </div>
    `;
  }

  const moodClass = activeClient.mood >= 65 ? 'fresh-high' : activeClient.mood >= 35 ? 'fresh-mid' : 'fresh-low';
  const shortPersona = activeClient.personality.split(',')[0];

  const chatHtml = activeClient.chatLog
    .map((m) => {
      if (m.sender === 'system') return `<div class="chat-bubble system-note">${escapeHtml(m.text)}</div>`;
      return `<div class="chat-bubble ${m.sender}">${escapeHtml(m.text)}</div>`;
    })
    .join('');

  const isFinished = activeClient.status !== 'talking';
  const showRecoveryActions = Boolean(lastFailedRequest && !isAiThinking && !isFinished);

  return `
    <div class="client-card">
      <div class="client-header">
        <div class="client-avatar">
          ${getClientAvatarSvg(activeClient.appearance, activeClient.mood)}
        </div>
        <div class="client-info">
          <div class="client-name">
            ${escapeHtml(activeClient.name)}, ${activeClient.age}
            ${activeClient.preorder ? '<span class="badge badge-ok" style="margin-left:4px;">Предзаказ</span>' : ''}
          </div>
          <div class="client-tags">
            <span class="client-tag">${escapeHtml(shortPersona)}</span>
            <span class="client-tag">🎁 ${escapeHtml(activeClient.occasion)}</span>
          </div>
          <div class="client-mood-row">
            <span>Настроение: ${activeClient.mood}%</span>
            <div class="freshness-bar-bg" style="flex:1;">
              <div class="freshness-bar-fill ${moodClass}" style="width: ${activeClient.mood}%"></div>
            </div>
          </div>
        </div>
      </div>

      ${activeClient.inspiredByPost ? `
        <div class="client-post-ref">
          <img src="${activeClient.inspiredByPost.photoUrl}" alt="Пост" />
          <div style="flex:1; min-width:0;">
            <strong>📸 Запрос по вашему посту в InstaFlower</strong>
            <div class="muted-text" style="font-size:11px;">${escapeHtml(activeClient.inspiredByPost.description)}</div>
          </div>
        </div>
      ` : ''}

      <div class="chat-box" id="client-chat-box">
        ${chatHtml}
        ${isAiThinking ? '<div class="chat-typing">💬 Клиент думает...</div>' : ''}
      </div>

      ${showRecoveryActions ? `
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="btn btn-soft" id="btn-retry-ai" style="flex:1; font-size:12px; padding:7px 8px;">
            🔄 Повторить
          </button>
          <button class="btn btn-sage" id="btn-switch-offline-ai" style="flex:1; font-size:12px; padding:7px 8px;">
            ⚡ Включить встроенного бота
          </button>
        </div>
      ` : ''}

      ${isFinished ? (
        waitingDue
          ? `<button class="btn btn-primary" id="btn-call-due-preorder" data-preorder-id="${waitingDue.id}">🔔 Впустить предзаказчика (${escapeHtml(waitingDue.senderName)})</button>`
          : closedNow
          ? `<div class="muted-text" style="text-align:center; font-size:12px;">🌙 Лавка уже закрыта. Пора в «🏠 Домик» отдыхать!</div>`
          : `<button class="btn btn-primary" id="btn-call-client">🔔 Позвать следующего клиента</button>`
      ) : `
        <div class="chat-input-row">
          <input
            type="text"
            class="form-input"
            id="client-chat-input"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            data-form-type="other"
            data-lpignore="true"
            placeholder="Напиши клиенту..."
            ${isAiThinking ? 'disabled' : ''}
          />
          <button class="btn btn-sage" id="btn-send-chat" ${isAiThinking ? 'disabled' : ''}>
            ➤
          </button>
        </div>

        <div style="display:flex; gap:6px;">
          <button class="btn btn-primary" id="btn-toggle-offer" ${isAiThinking ? 'disabled' : ''} style="flex:1;">
            ${showOfferDrawer ? '✕ Скрыть витрину' : '💐 Предложить букет'}
          </button>
          <button class="btn btn-danger" id="btn-toggle-reject" ${isAiThinking ? 'disabled' : ''} style="padding: 10px 11px;">
            🚫 Отказать
          </button>
        </div>

        ${showRejectPanel ? renderClientRejectPanel() : ''}
        ${showOfferDrawer ? renderOfferDrawer() : ''}
      `}
    </div>
  `;
}

function renderClientRejectPanel() {
  return `
    <div class="client-reject-panel">
      <div class="row-between">
        <strong style="font-size:12px;">Причина отказа (клиент отреагирует на неё):</strong>
        <button class="btn btn-soft" id="btn-close-reject-panel" style="padding:2px 7px; font-size:11px;">✕</button>
      </div>
      <div class="client-reject-chips">
        ${SHOP_REJECT_TEMPLATES.map((tpl) => `
          <button class="client-reject-chip" data-shop-reject-tpl="${escapeAttr(tpl)}" ${isAiThinking ? 'disabled' : ''}>
            ${escapeHtml(tpl)}
          </button>
        `).join('')}
      </div>
      <div style="display:flex; gap:6px;">
        <input
          type="text"
          class="form-input"
          id="shop-reject-reason-input"
          autocomplete="off"
          data-form-type="other"
          data-lpignore="true"
          placeholder="Или напиши свою причину отказа..."
          style="padding:7px 9px; font-size:12px;"
          ${isAiThinking ? 'disabled' : ''}
        />
        <button class="btn btn-danger" id="btn-send-custom-shop-reject" ${isAiThinking ? 'disabled' : ''} style="padding:7px 10px; font-size:12px;">
          Отказать
        </button>
      </div>
    </div>
  `;
}

function renderOfferDrawer() {
  const readyHtml = gameState.readyBouquets.length
    ? gameState.readyBouquets
        .map(
          (b) => `
        <div class="offer-item-row">
          <img class="offer-thumb" src="${b.thumbnail}" alt="Букет" />
          <div style="flex:1; min-width:0;">
            <strong style="font-size:12px;">Готовый букет</strong>
            <p class="muted-text" style="font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${b.summary}</p>
          </div>
          <input type="number" class="offer-price-input" id="price-b-${b.id}" value="${b.price}" min="50" autocomplete="off" data-form-type="other" />
          <button class="btn btn-sage" data-offer-bouquet="${b.id}" style="padding:6px 9px; font-size:11.5px;">
            Дать
          </button>
        </div>
      `
        )
        .join('')
    : `<p class="muted-text" style="font-size:11.5px;">Готовых букетов нет — их можно собрать во вкладке «💐 Стол сборки».</p>`;

  const vasesHtml = gameState.inventory.length
    ? gameState.inventory
        .map((item) => {
          const meta = FLOWERS_CATALOG[item.typeId];
          if (!meta) return '';
          const unitPrice = getActualFlowerPrice(item, meta);
          return `
            <div class="offer-item-row">
              <div class="offer-thumb" style="padding:3px;">${getSingleFlowerWrappedSvg(item.typeId)}</div>
              <div style="flex:1; min-width:0;">
                <strong style="font-size:12px;">${meta.shortName} (1 шт.)</strong>
                <p class="muted-text" style="font-size:11px;">Свежесть ${item.freshness}% • Ост: ${item.qty}</p>
              </div>
              <input type="number" class="offer-price-input" id="price-v-${item.uid}" value="${unitPrice}" min="30" autocomplete="off" data-form-type="other" />
              <button class="btn btn-soft" data-offer-vase="${item.uid}" style="padding:6px 9px; font-size:11.5px;">
                Дать
              </button>
            </div>
          `;
        })
        .join('')
    : '';

  return `
    <div class="offer-drawer">
      <strong style="font-size:12.5px;">Выбери товар и цену для торга:</strong>
      ${readyHtml}
      ${vasesHtml}
    </div>
  `;
}

function renderVaseSlot(item) {
  const meta = FLOWERS_CATALOG[item.typeId];
  if (!meta) return '';

  const price = getActualFlowerPrice(item, meta);
  const freshClass = item.freshness >= 65 ? 'fresh-high' : item.freshness >= 35 ? 'fresh-mid' : 'fresh-low';
  const wiltingClass = item.freshness < 45 ? 'wilting' : '';
  const isSelected = item.uid === selectedVaseUid ? 'selected' : '';

  return `
    <div class="vase-slot ${isSelected}" data-vase-uid="${item.uid}">
      ${item.discounted ? '<span class="vase-discount-tag">-40%</span>' : ''}
      <span class="vase-qty-pill">${item.qty} шт</span>
      <div class="vase-svg-wrap ${wiltingClass}">
        ${getFlowerInVaseSvg(item.typeId, meta.vaseColor)}
      </div>
      <div class="vase-name">${meta.shortName}</div>
      <div class="vase-price">${price} ₽</div>
      <div class="freshness-bar-bg" title="Свежесть ${item.freshness}%">
        <div class="freshness-bar-fill ${freshClass}" style="width: ${item.freshness}%"></div>
      </div>
    </div>
  `;
}

function renderInspectorModal(item) {
  const meta = FLOWERS_CATALOG[item.typeId];
  if (!meta) return '';

  const price = getActualFlowerPrice(item, meta);
  const statusText =
    item.freshness >= 70
      ? 'Свежие и ароматные'
      : item.freshness >= 40
      ? 'Начинают подвядать'
      : 'Пора уценить или списать!';

  return `
    <div class="vase-modal-overlay" id="vase-modal-overlay">
      <div class="flower-inspector vase-modal-card">
        <div class="row-between">
          <strong style="font-size: 15px;">Осмотр цветка</strong>
          <button class="btn btn-soft" id="btn-close-inspector" style="padding: 5px 10px; font-size: 12px;">
            ✕ Закрыть
          </button>
        </div>

        <div class="inspector-top">
          <div class="inspector-preview">
            ${getSingleFlowerWrappedSvg(item.typeId)}
          </div>
          <div style="flex: 1;">
            <div class="row-between">
              <strong>${meta.name}</strong>
              <span class="badge ${item.freshness >= 40 ? 'badge-ok' : 'badge-warn'}">${item.freshness}%</span>
            </div>
            <p class="muted-text" style="margin-top: 2px;">${statusText} • В наличии: ${item.qty} шт.</p>
            <p class="muted-text">Цена за стебель: <strong>${price} ₽</strong></p>
          </div>
        </div>

        <div class="inspector-actions">
          <button class="btn btn-primary" id="btn-add-to-bouquet" style="grid-column: 1 / -1;">
            💐 Взять стебель на стол сборки
          </button>
          <button class="btn btn-sage" id="btn-water-flower" ${item.wateredThisShift ? 'disabled style="opacity:0.55;"' : ''}>
            💧 Сменить воду (+8%)
          </button>
          <button class="btn btn-soft" id="btn-discount-flower" ${item.discounted || item.freshness >= 65 ? 'disabled style="opacity:0.55;"' : ''}>
            🏷️ Уценить (-40%)
          </button>
          <button class="btn btn-danger" id="btn-discard-flower" style="grid-column: 1 / -1;">
            🗑️ Списать партию (${item.qty} шт.)
          </button>
        </div>
      </div>
    </div>
  `;
}

function getBouquetFreshnessWord(bouquet) {
  if (!Array.isArray(bouquet.stems) || bouquet.stems.length === 0) return 'свежие';
  const minFresh = Math.min(...bouquet.stems.map((s) => s.freshness ?? 85));
  if (minFresh < 40) return 'подвявшие, поникшие';
  if (minFresh < 70) return 'обычной свежести';
  return 'свежие';
}

function getVaseFreshnessWord(freshness) {
  if (freshness < 40) return 'подвявший, поникший';
  if (freshness < 70) return 'обычной свежести';
  return 'свежий';
}

function bindShopEvents(container, onHudUpdate, showToast) {
  document.getElementById('btn-light-candles')?.addEventListener('click', () => {
    gameState.candlesLit = true;
    gameState.mood = Math.min(100, gameState.mood + 6);
    playPaperSound();
    saveState();
    onHudUpdate();
    renderShopScreen(onHudUpdate, showToast);
    showToast('🕯️ Свечи зажжены! В лавке снова уютно.');
  });

  document.getElementById('btn-open-shop-decor')?.addEventListener('click', () => {
    showShopDecorModal = true;
    renderShopScreen(onHudUpdate, showToast);
  });

  document.getElementById('btn-close-shop-decor')?.addEventListener('click', () => {
    showShopDecorModal = false;
    renderShopScreen(onHudUpdate, showToast);
  });

  document.getElementById('shop-decor-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'shop-decor-modal-overlay') {
      showShopDecorModal = false;
      renderShopScreen(onHudUpdate, showToast);
    }
  });

  document.querySelectorAll('[data-toggle-shop-decor]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggleShopDecor;
      if (!Array.isArray(gameState.hiddenDecor)) gameState.hiddenDecor = [];
      if (gameState.hiddenDecor.includes(id)) {
        gameState.hiddenDecor = gameState.hiddenDecor.filter((x) => x !== id);
        showToast('✨ Украшение повешено в зале!');
      } else {
        gameState.hiddenDecor.push(id);
        showToast('📦 Украшение убрано на склад');
      }
      saveState();
      renderShopScreen(onHudUpdate, showToast);
    });
  });

  container.querySelectorAll('[data-go-assemble]').forEach((btn) => {
    btn.addEventListener('click', () => {
      shopSubTab = 'bouquet';
      renderShopScreen(onHudUpdate, showToast);
      showToast('💐 Собери букет для предзаказа на столе сборки!');
    });
  });

  document.getElementById('btn-call-due-preorder')?.addEventListener('click', (e) => {
    const pId = e.currentTarget.dataset.preorderId;
    const pre = gameState.preorders.find((p) => p.id === pId);
    if (!pre) return;
    pre.status = 'in_shop';
    saveState();
    playBellSound();
    summonPreorderClient(pre, onHudUpdate, showToast);
  });

  container.querySelectorAll('[data-call-inshop]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pre = gameState.preorders.find((p) => p.id === btn.dataset.callInshop);
      if (!pre || isAiThinking) return;
      if (isClientTalkingNow()) {
        showToast('Сначала заверши разговор с текущим покупателем!');
        return;
      }
      playBellSound();
      summonPreorderClient(pre, onHudUpdate, showToast);
    });
  });

  document.getElementById('btn-call-client')?.addEventListener('click', () => {
    if (isShopClosedNow()) {
      showToast('🌙 Лавка закрыта — пора отдыхать!');
      return;
    }
    playBellSound();
    summonNextClient(onHudUpdate, showToast);
  });

  document.getElementById('btn-retry-ai')?.addEventListener('click', () => {
    retryLastAiRequest(onHudUpdate, showToast);
  });

  document.getElementById('btn-switch-offline-ai')?.addEventListener('click', () => {
    aiSettings.provider = 'offline';
    aiSettings.model = AI_PROVIDERS.offline.defaultModel;
    try {
      localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(aiSettings));
    } catch (e) {
      console.warn('Не удалось сохранить настройки ИИ:', e);
    }
    showToast('⚡ Включён встроенный умный бот!');
    retryLastAiRequest(onHudUpdate, showToast);
  });

  const chatInput = document.getElementById('client-chat-input');
  document.getElementById('btn-send-chat')?.addEventListener('click', () => {
    const text = chatInput?.value.trim();
    if (text) sendPlayerMessage(text, null, onHudUpdate, showToast);
  });

  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isAiThinking) {
      const text = chatInput.value.trim();
      if (text) sendPlayerMessage(text, null, onHudUpdate, showToast);
    }
  });

  document.getElementById('btn-toggle-offer')?.addEventListener('click', () => {
    showOfferDrawer = !showOfferDrawer;
    if (showOfferDrawer) showRejectPanel = false;
    renderShopScreen(onHudUpdate, showToast);
  });

  document.getElementById('btn-toggle-reject')?.addEventListener('click', () => {
    showRejectPanel = !showRejectPanel;
    if (showRejectPanel) showOfferDrawer = false;
    renderShopScreen(onHudUpdate, showToast);
  });

  document.getElementById('btn-close-reject-panel')?.addEventListener('click', () => {
    showRejectPanel = false;
    renderShopScreen(onHudUpdate, showToast);
  });

  container.querySelectorAll('[data-shop-reject-tpl]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const reason = btn.dataset.shopRejectTpl;
      sendPlayerRejection(reason, onHudUpdate, showToast);
    });
  });

  document.getElementById('btn-send-custom-shop-reject')?.addEventListener('click', () => {
    const reason = document.getElementById('shop-reject-reason-input')?.value.trim();
    if (!reason) {
      showToast('Напиши причину или нажми быстрый шаблон');
      return;
    }
    sendPlayerRejection(reason, onHudUpdate, showToast);
  });

  container.querySelectorAll('[data-offer-bouquet]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bId = btn.dataset.offerBouquet;
      const bouquet = gameState.readyBouquets.find((b) => b.id === bId);
      if (!bouquet) return;
      const priceInput = document.getElementById(`price-b-${bId}`);
      const customPrice = Math.max(50, Number(priceInput?.value) || bouquet.price);

      const offer = {
        kind: 'bouquet',
        id: bouquet.id,
        price: customPrice,
        summary: `Готовый букет (${bouquet.summary})`
      };
      const freshWord = getBouquetFreshnessWord(bouquet);
      const promptMsg = `[Предложение продавца]: Я предлагаю вам готовый букет (${bouquet.summary}, ${bouquet.stemsCount} шт., цветы ${freshWord}) за ${customPrice} ₽.`;
      showOfferDrawer = false;
      sendPlayerMessage(promptMsg, offer, onHudUpdate, showToast, `Предложили букет за ${customPrice} ₽`);
    });
  });

  container.querySelectorAll('[data-offer-vase]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.offerVase;
      const vase = gameState.inventory.find((v) => v.uid === uid);
      if (!vase) return;
      const meta = FLOWERS_CATALOG[vase.typeId];
      const priceInput = document.getElementById(`price-v-${uid}`);
      const customPrice = Math.max(30, Number(priceInput?.value) || getActualFlowerPrice(vase, meta));

      const offer = {
        kind: 'vase',
        id: vase.uid,
        price: customPrice,
        summary: `${meta.name} (1 шт.)`
      };
      const freshWord = getVaseFreshnessWord(vase.freshness);
      const promptMsg = `[Предложение продавца]: Я предлагаю вам цветок ${meta.name} (1 шт., ${freshWord}) за ${customPrice} ₽.`;
      showOfferDrawer = false;
      sendPlayerMessage(promptMsg, offer, onHudUpdate, showToast, `Предложили ${meta.shortName} за ${customPrice} ₽`);
    });
  });

  container.querySelectorAll('[data-vase-uid]').forEach((slot) => {
    slot.addEventListener('click', () => {
      selectedVaseUid = slot.dataset.vaseUid;
      renderShopScreen(onHudUpdate, showToast);
    });
  });

  document.getElementById('vase-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'vase-modal-overlay') {
      selectedVaseUid = null;
      renderShopScreen(onHudUpdate, showToast);
    }
  });

  document.getElementById('btn-close-inspector')?.addEventListener('click', () => {
    selectedVaseUid = null;
    renderShopScreen(onHudUpdate, showToast);
  });

  document.getElementById('btn-add-to-bouquet')?.addEventListener('click', () => {
    const added = addFlowerToDraftBouquet(selectedVaseUid, showToast);
    if (added) {
      if (!gameState.inventory.find((i) => i.uid === selectedVaseUid)) {
        selectedVaseUid = null;
      }
      renderShopScreen(onHudUpdate, showToast);
    }
  });

  document.getElementById('btn-next-shift')?.addEventListener('click', () => {
    advanceShift();
    onHudUpdate();
    renderShopScreen(onHudUpdate, showToast);
    checkPreorderArrival(onHudUpdate, showToast);
    if (isShopClosedNow()) {
      showToast('🌙 Смена закончилась! Пора домой спать, иначе завтра будешь уставшим.');
    } else {
      showToast('Смена сменилась, время идёт вперёд');
    }
  });

  document.getElementById('btn-water-flower')?.addEventListener('click', () => {
    const item = gameState.inventory.find((i) => i.uid === selectedVaseUid);
    if (!item || item.wateredThisShift) return;
    item.freshness = Math.min(100, item.freshness + 8);
    item.wateredThisShift = true;
    saveState();
    renderShopScreen(onHudUpdate, showToast);
    showToast('Вода в вазе освежена! (+8% свежести)');
  });

  document.getElementById('btn-discount-flower')?.addEventListener('click', () => {
    const item = gameState.inventory.find((i) => i.uid === selectedVaseUid);
    if (!item || item.discounted) return;
    item.discounted = true;
    saveState();
    renderShopScreen(onHudUpdate, showToast);
    showToast('Установлена уценка -40%');
  });

  document.getElementById('btn-discard-flower')?.addEventListener('click', () => {
    gameState.inventory = gameState.inventory.filter((i) => i.uid !== selectedVaseUid);
    selectedVaseUid = null;
    gameState.mood = Math.min(100, gameState.mood + 3);
    saveState();
    onHudUpdate();
    renderShopScreen(onHudUpdate, showToast);
    showToast('Увядшие цветы списаны, витрина стала чище');
  });
}

async function summonNextClient(onHudUpdate, showToast) {
  if (isAiThinking) return;
  activeClient = generateRandomClient();
  pendingOffer = null;
  showOfferDrawer = false;
  showRejectPanel = false;
  lastFailedRequest = null;
  isAiThinking = true;

  const systemPrompt = buildClientSystemPrompt(activeClient);
  activeClient.history = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Ты только что вошёл в цветочный магазин. Поприветствуй продавца и скажи или намекни, что ищешь.' }
  ];

  renderShopScreen(onHudUpdate, showToast);
  await requestSummonGreeting(onHudUpdate, showToast);
}

async function summonPreorderClient(preorder, onHudUpdate, showToast) {
  if (isAiThinking) return;
  activeClient = generatePreorderClient(preorder);
  pendingOffer = null;
  showOfferDrawer = false;
  showRejectPanel = false;
  lastFailedRequest = null;
  isAiThinking = true;

  const systemPrompt = buildClientSystemPrompt(activeClient);
  activeClient.history = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Ты только что вошёл в цветочный магазин за своим предзаказом из Direct. Поприветствуй продавца и напомни про свой заказ ко времени.' }
  ];

  renderShopScreen(onHudUpdate, showToast);
  await requestSummonGreeting(onHudUpdate, showToast);
}

async function requestSummonGreeting(onHudUpdate, showToast) {
  if (!activeClient) return;
  try {
    activeClient.history[0].content = buildClientSystemPrompt(activeClient);
    const raw = await callAI(activeClient.history);
    const parsed = parseClientJson(raw);
    activeClient.history.push({ role: 'assistant', content: raw });
    activeClient.chatLog.push({ sender: 'client', text: parsed.reply });
    lastFailedRequest = null;
  } catch (err) {
    lastFailedRequest = { type: 'summon' };
    activeClient.chatLog.push({
      sender: 'system',
      text: `⚠️ Не удалось связаться с ИИ: ${err.message}`
    });
  } finally {
    isAiThinking = false;
    renderShopScreen(onHudUpdate, showToast);
  }
}

async function retryLastAiRequest(onHudUpdate, showToast) {
  if (!activeClient || isAiThinking || !lastFailedRequest) return;
  const retryData = lastFailedRequest;
  lastFailedRequest = null;

  if (activeClient.chatLog.length && activeClient.chatLog[activeClient.chatLog.length - 1].sender === 'system') {
    activeClient.chatLog.pop();
  }

  isAiThinking = true;
  renderShopScreen(onHudUpdate, showToast);

  if (retryData.type === 'summon') {
    await requestSummonGreeting(onHudUpdate, showToast);
    return;
  }

  if (retryData.type === 'message') {
    await executePlayerMessageCall(retryData.aiText, retryData.offerObj, retryData.displayText, onHudUpdate, showToast);
  }
}

function sendPlayerRejection(reason, onHudUpdate, showToast) {
  showRejectPanel = false;
  const promptMsg = `[Отказ продавца]: ${reason}`;
  const displayMsg = `🚫 Отказали в заказе: «${reason}»`;
  sendPlayerMessage(promptMsg, null, onHudUpdate, showToast, displayMsg);
}

async function sendPlayerMessage(aiText, offerObj, onHudUpdate, showToast, displayText = null) {
  if (!activeClient || isAiThinking || activeClient.status !== 'talking') return;
  if (offerObj) pendingOffer = offerObj;
  lastFailedRequest = null;

  isAiThinking = true;
  activeClient.chatLog.push({ sender: 'player', text: displayText || aiText });
  renderShopScreen(onHudUpdate, showToast);

  await executePlayerMessageCall(aiText, offerObj, displayText, onHudUpdate, showToast);
}

async function executePlayerMessageCall(aiText, offerObj, displayText, onHudUpdate, showToast) {
  if (!activeClient) return;
  if (activeClient.history[0]?.role === 'system') {
    activeClient.history[0].content = buildClientSystemPrompt(activeClient);
  }
  activeClient.history.push({ role: 'user', content: aiText });

  try {
    const raw = await callAI(activeClient.history);
    const parsed = parseClientJson(raw);
    activeClient.history.push({ role: 'assistant', content: raw });
    activeClient.chatLog.push({ sender: 'client', text: parsed.reply });

    activeClient.mood = Math.max(0, Math.min(100, activeClient.mood + parsed.moodChange));

    if (
      parsed.dealStatus === 'talking' &&
      !activeClient.boostedAfterReject &&
      (parsed.reply.includes('300 ₽') || parsed.reply.toLowerCase().includes('накин') || parsed.reply.toLowerCase().includes('увелич'))
    ) {
      activeClient.budget += 300;
      activeClient.boostedAfterReject = true;
    }

    if (parsed.dealStatus === 'bought' && pendingOffer) {
      const soldPrice = pendingOffer.price;
      const tip = completeSale(pendingOffer, onHudUpdate, showToast);
      activeClient.status = 'bought';
      activeClient.chatLog.push({
        sender: 'system',
        text: tip > 0
          ? `✅ Сделка состоялась! Продано за ${soldPrice} ₽ + чаевые ${tip} ₽ 🌟`
          : `✅ Сделка состоялась! Продано за ${soldPrice} ₽`
      });
      scheduleNextPreorderIfReady(onHudUpdate, showToast);
    } else if (parsed.dealStatus === 'bought' && !pendingOffer) {
      activeClient.chatLog.push({
        sender: 'system',
        text: '💡 Клиент согласен! Нажми «💐 Предложить букет», чтобы провести оплату.'
      });
    } else if (parsed.dealStatus === 'left' || activeClient.mood <= 0) {
      activeClient.status = 'left';
      if (activeClient.preorder) {
        markPreorderCancelled(activeClient.preorder, 'Клиент ушёл без заказа');
      }
      gameState.mood = Math.max(10, gameState.mood - 3);
      saveState();
      onHudUpdate();
      activeClient.chatLog.push({
        sender: 'system',
        text: '💨 Клиент ушёл без покупки.'
      });
      scheduleNextPreorderIfReady(onHudUpdate, showToast);
    }
    lastFailedRequest = null;
  } catch (err) {
    if (activeClient.history[activeClient.history.length - 1]?.role === 'user') {
      activeClient.history.pop();
    }
    lastFailedRequest = { type: 'message', aiText, offerObj, displayText };
    activeClient.chatLog.push({
      sender: 'system',
      text: `⚠️ Ошибка ИИ: ${err.message}`
    });
  } finally {
    isAiThinking = false;
    renderShopScreen(onHudUpdate, showToast);
  }
}

function scheduleNextPreorderIfReady(onHudUpdate, showToast) {
  setTimeout(() => {
    checkPreorderArrival(onHudUpdate, showToast);
  }, 1500);
}

function markPreorderCancelled(preorder, reasonNote) {
  const p = (gameState.preorders || []).find((item) => item.id === preorder.id);
  if (p) p.status = 'cancelled';
  const dm = (gameState.directMessages || []).find((m) => m.id === preorder.dmId);
  if (dm && dm.order) {
    dm.order.rejected = true;
    dm.order.accepted = false;
    if (!Array.isArray(dm.thread)) dm.thread = [];
    dm.thread.push({ sender: 'system', text: `❌ ${reasonNote}` });
  }
}

function completeSale(offer, onHudUpdate, showToast) {
  if (offer.kind === 'bouquet') {
    gameState.readyBouquets = gameState.readyBouquets.filter((b) => b.id !== offer.id);
  } else if (offer.kind === 'vase') {
    const vase = gameState.inventory.find((v) => v.uid === offer.id);
    if (vase) {
      vase.qty -= 1;
      if (vase.qty <= 0) {
        gameState.inventory = gameState.inventory.filter((v) => v.uid !== offer.id);
      }
    }
  }

  let tip = 0;
  if (activeClient?.preorder) {
    const pre = activeClient.preorder;
    const curMin = gameState.timeMinutes || 540;
    const onTime = curMin <= pre.dueMinutes + 45;

    if (onTime && activeClient.mood >= 70) {
      tip = 50 + Math.round((offer.price * 0.1) / 10) * 10;
      gameState.followers += 1;
    }

    const pObj = (gameState.preorders || []).find((item) => item.id === pre.id);
    if (pObj) pObj.status = 'done';

    const dm = (gameState.directMessages || []).find((m) => m.id === pre.dmId);
    if (dm && dm.order) {
      dm.order.done = true;
      dm.order.finalEarned = offer.price + tip;
      if (!Array.isArray(dm.thread)) dm.thread = [];
      dm.thread.push({
        sender: 'client',
        text: tip > 0
          ? `Букет просто волшебный! Спасибо, что всё успели к ${pre.dueTimeLabel} — оставила вам +${tip} ₽ чаевых 🌟`
          : `Спасибо за букет! Забрали заказ, будем заглядывать к вам ещё 🌸`
      });
    }
  }

  let postFollowerGain = 0;
  if (activeClient?.inspiredByPost) {
    postFollowerGain = 1;
    gameState.followers += 1;
  }

  const totalGain = offer.price + tip;
  gameState.money += totalGain;
  gameState.totalEarned += totalGain;
  gameState.bouquetsSold += 1;
  gameState.energy = Math.max(10, gameState.energy - 5);
  gameState.mood = Math.min(100, gameState.mood + (tip > 0 ? 5 : 3));
  pendingOffer = null;

  const justClosed = addGameMinutes(10);
  playCoinSound();
  onHudUpdate();
  if (justClosed) {
    showToast(`💰 Продано (+${totalGain} ₽)! Смена закончилась — пора отдыхать.`);
  } else if (tip > 0) {
    showToast(`💰 Предзаказ выдан! +${offer.price} ₽ и +${tip} ₽ чаевых 🌟`);
  } else if (postFollowerGain > 0) {
    showToast(`📸 Букет по посту продан! +${offer.price} ₽ и +1 подписчик 🌸`);
  } else {
    showToast(`💰 Продано! +${offer.price} ₽ в кассу`);
  }
  return tip;
}

function scrollChatToBottom() {
  const box = document.getElementById('client-chat-box');
  if (box) box.scrollTop = box.scrollHeight;
}

function getActualFlowerPrice(item, meta) {
  return item.discounted ? Math.round(meta.price * 0.6) : meta.price;
}

function renderWeatherParticles(weather, seasonId) {
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