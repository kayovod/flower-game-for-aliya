/**
 * js/screens/shopScreen.js
 * Главный экран цветочного магазина: витрина ваз, прилавок, смена времени и управление залом
 */

import {
  FLOWERS_CATALOG,
  TIME_PERIODS,
  WEATHERS,
  DECOR_CATALOG,
  SHOP_LOCATIONS,
  getGameDateObj,
  getSeasonInfo,
  getHolidayForDate,
  AI_PROVIDERS,
  AI_SETTINGS_KEY
} from '/js/config.js';
import { gameState, aiSettings, saveState, advanceShift, isShopClosedNow } from '/js/state.js';
import { getFlowerInVaseSvg } from '/js/graphics/flowersSvg.js';
import { renderBouquetMaker, addFlowerToDraftBouquet } from '/js/screens/bouquetMaker.js';
import { playBellSound, playPaperSound } from '/js/sound.js';

import {
  renderShopTopDecor,
  renderShopDecorVisuals,
  renderShopArchDetails,
  renderShopWindowScenery,
  renderWeatherParticles
} from '/js/graphics/shopScenerySvg.js';
import {
  checkPreorderArrival,
  isClientTalkingNow,
  renderClientZoneHtml,
  handleCounterBouquetSell,
  summonNextClient,
  summonPreorderClient,
  retryLastAiRequest,
  sendPlayerRejection,
  sendPlayerMessage,
  toggleOfferDrawer,
  toggleRejectPanel,
  closeRejectPanel,
  getActiveClient
} from '/js/screens/shop/shopClientZone.js';
import { renderInspectorModal, getActualFlowerPrice } from '/js/screens/shop/shopInspector.js';
import { renderShopTeamZone, bindShopTeamEvents } from '/js/screens/shop/shopTeamZone.js';

let selectedVaseUid = null;
let shopSubTab = 'hall'; // 'hall' | 'bouquet'
let showShopDecorModal = false;

export { checkPreorderArrival, isClientTalkingNow };

export function isBouquetMakerOpen() {
  return shopSubTab === 'bouquet';
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
          checkPreorderArrival(onHudUpdate, showToast, () => renderShopScreen(onHudUpdate, showToast));
        }
      } else {
        container.scrollTo({ top: 0, behavior: 'smooth' });
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

  const wallpaperClass = (isShopDecorShown('wallpaper') || isShopDecorShown('vintage_wallpaper')) ? 'has-wallpaper' : '';
  const powerClass = gameState.powerOutage
    ? gameState.candlesLit
      ? 'power-out candles-lit'
      : 'power-out'
    : '';
  const hasNeon = isShopDecorShown('neon_sign');
  const currentLoc = SHOP_LOCATIONS.find((l) => l.id === gameState.shopLocationId) || SHOP_LOCATIONS[0];

  const vasesHtml = gameState.inventory.length
    ? gameState.inventory.map((item) => renderVaseSlot(item)).join('')
    : `<div class="muted-text" style="grid-column: 1 / -1; text-align: center; padding: 18px 8px;">
         Вазы пусты! Закажи свежие цветы в «📱 Телефон» → «🚚 Опт».
       </div>`;

  const selectedItem = gameState.inventory.find((i) => i.uid === selectedVaseUid) || null;
  const waitingDue = (gameState.preorders || []).find(
    (p) =>
      p.day === gameState.day &&
      (p.status === 'in_shop' || (p.status === 'waiting' && (gameState.timeMinutes || 540) >= p.dueMinutes))
  );

  subContent.innerHTML = `
    <div class="shop-scene loc-${currentLoc.id} ${timeClass} ${wallpaperClass} ${powerClass}">
      <div class="shop-garland">
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
      </div>

      ${renderShopArchDetails(currentLoc.id)}

      ${renderShopTopDecor(hasNeon)}

      ${
        gameState.powerOutage
          ? `
        <div class="power-alert-bar">
          <span>${gameState.candlesLit ? '🕯️ В лавке горят уютные свечи!' : '⚡ Отключили свет! В лавке темно.'}</span>
          ${!gameState.candlesLit ? '<button class="btn btn-primary" id="btn-light-candles" style="padding:5px 9px; font-size:11px;">🕯️ Зажечь свечи</button>' : ''}
        </div>
      `
          : ''
      }

      <div class="shop-window-row">
        <div class="shop-window ${timeClass} ${weatherClass}">
          ${renderShopWindowScenery(currentLoc.id, timeClass, season.id, gameState.weather)}
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

      ${renderShopTeamZone()}

      ${renderClientZoneHtml(closedNow, waitingDue)}
      <div class="vases-grid">
        ${vasesHtml}
      </div>

      ${renderCounterReadyBouquets()}

      <div class="wooden-counter"></div>
    </div>

    ${selectedItem ? renderInspectorModal(selectedItem) : ''}
    ${showShopDecorModal ? renderShopDecorModal() : ''}
  `;

  bindShopEvents(subContent, onHudUpdate, showToast);
  scrollChatToBottom();
}

function isShopDecorShown(id) {
  const owned = new Set([...(gameState.decor || []), ...(gameState.decorInventory || [])]);
  return owned.has(id) && !(gameState.hiddenDecor || []).includes(id);
}

function renderCounterReadyBouquets() {
  if (!Array.isArray(gameState.readyBouquets) || gameState.readyBouquets.length === 0) {
    return '';
  }

  const clientTalking = isClientTalkingNow();
  const activeClient = getActiveClient();
  const wantedId = clientTalking ? activeClient?.wantedBouquetId : null;

  const cardsHtml = gameState.readyBouquets
    .map((b) => {
      const isWanted = wantedId === b.id;
      const freshWord = getBouquetFreshnessWord(b);
      const isWilted = freshWord.includes('подвявш');
      return `
        <div class="counter-bouquet-card ${isWanted ? 'wanted' : ''}">
          ${isWanted ? '<span class="counter-wanted-badge">Хочет купить!</span>' : ''}
          <img class="counter-bouquet-img" src="${b.thumbnail}" alt="Готовый букет" />
          <div class="counter-bouquet-price">${b.price} ₽</div>
          <div class="counter-bouquet-desc" title="${escapeAttr(b.summary)}">${escapeHtml(b.summary)}</div>
          <div class="counter-bouquet-meta">${b.stemsCount || b.items?.length || 1} шт.${isWilted ? ' • вянет' : ''}</div>
          ${
            clientTalking
              ? `
            <button
              class="btn ${isWanted ? 'btn-primary' : 'btn-sage'} counter-sell-btn"
              data-counter-sell-bouquet="${b.id}"
            >
              ${isWanted ? '⚡ Продать' : '🤝 Продать'}
            </button>
          `
              : `
            <button class="btn btn-soft counter-sell-btn" data-counter-open-maker="${b.id}">
              💐 На стол
            </button>
          `
          }
        </div>
      `;
    })
    .join('');

  return `
    <div class="counter-bouquets-box">
      <div class="row-between" style="padding: 0 2px;">
        <strong style="font-size: 12px;">💐 Готовые букеты на витрине (${gameState.readyBouquets.length})</strong>
        <span class="muted-text" style="font-size: 10.5px;">${clientTalking ? 'Нажми, чтобы продать' : 'Ждут покупателя'}</span>
      </div>
      <div class="counter-bouquets-row">
        ${cardsHtml}
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

function renderShopDecorModal() {
  const ownedSet = new Set([...(gameState.decor || []), ...(gameState.decorInventory || [])]);
  const shopItems = DECOR_CATALOG.filter(
    (d) => d.place === 'Магазин' && d.id !== 'fridge' && ownedSet.has(d.id)
  );
  const currentLoc = SHOP_LOCATIONS.find((l) => l.id === gameState.shopLocationId) || SHOP_LOCATIONS[0];
  const visibleCount = shopItems.filter((item) => !(gameState.hiddenDecor || []).includes(item.id)).length;

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
    : `<p class="muted-text" style="text-align:center; padding:12px 4px;">У тебя пока нет украшений для зала. Загляни в «📱 Телефон» → «🏺 Декор»!</p>`;

  return `
    <div class="vase-modal-overlay" id="shop-decor-modal-overlay">
      <div class="flower-inspector vase-modal-card">
        <div class="row-between">
         <strong style="font-size:15px;">🎨 Декор зала (${visibleCount} шт.)</strong>
          <button class="btn btn-soft" id="btn-close-shop-decor" style="padding:5px 10px; font-size:12px;">✕</button>
        </div>
        <p class="muted-text" style="font-size:11.5px;">Украшай зал без ограничений — вешай и ставь всё, что нравится:</p>
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
      const activeClient = getActiveClient();
      const talkingToThisPreorder =
        activeClient && activeClient.preorder && activeClient.preorder.id === p.id && activeClient.status === 'talking';
      const accHint = p.accessoryName ? ` + ${p.accessoryName}` : '';
      return `
        <div class="preorder-row ${isDue || inShop ? 'due-now' : ''}">
          <div style="flex:1; min-width:0;">
            <strong>${escapeHtml(p.senderName)}</strong> • <span>${p.dueTimeLabel}</span>
            <div class="muted-text" style="font-size:11px;">
              ${p.qty} шт. «${escapeHtml(p.flowerName)}»${escapeHtml(accHint)} (${p.reward} ₽)
            </div>
          </div>
          ${
            inShop
              ? talkingToThisPreorder
                ? '<span class="badge badge-ok">У прилавка</span>'
                : `<button class="btn btn-primary" data-call-inshop="${p.id}" style="padding:5px 9px; font-size:11px;">🔔 Принять</button>`
              : `
            <button class="btn btn-soft" data-go-assemble="${p.id}" style="padding:5px 8px; font-size:11px;">
              💐 Собрать
            </button>
          `
          }
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

function bindShopEvents(container, onHudUpdate, showToast) {
  const renderShopMain = () => renderShopScreen(onHudUpdate, showToast);
  bindShopTeamEvents(container, onHudUpdate, showToast, renderShopMain);

  document.getElementById('btn-light-candles')?.addEventListener('click', () => {
    gameState.candlesLit = true;
    gameState.mood = Math.min(100, gameState.mood + 6);
    playPaperSound();
    saveState();
    onHudUpdate();
    renderShopMain();
    showToast('🕯️ Свечи зажжены! В лавке снова уютно.');
  });

  document.getElementById('btn-open-shop-decor')?.addEventListener('click', () => {
    showShopDecorModal = true;
    renderShopMain();
  });

  document.getElementById('btn-close-shop-decor')?.addEventListener('click', () => {
    showShopDecorModal = false;
    renderShopMain();
  });

  document.getElementById('shop-decor-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'shop-decor-modal-overlay') {
      showShopDecorModal = false;
      renderShopMain();
    }
  });

  container.querySelectorAll('[data-toggle-shop-decor]').forEach((btn) => {
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
      renderShopMain();
    });
  });

  container.querySelectorAll('[data-go-assemble]').forEach((btn) => {
    btn.addEventListener('click', () => {
      shopSubTab = 'bouquet';
      renderShopMain();
      showToast('💐 Собери букет для предзаказа на столе сборки!');
    });
  });

  container.querySelectorAll('[data-counter-sell-bouquet]').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleCounterBouquetSell(btn.dataset.counterSellBouquet, onHudUpdate, showToast, renderShopMain);
    });
  });

  document.getElementById('btn-sell-wanted-bouquet')?.addEventListener('click', (e) => {
    const bId = e.currentTarget.dataset.bouquetId;
    handleCounterBouquetSell(bId, onHudUpdate, showToast, renderShopMain);
  });

  container.querySelectorAll('[data-counter-open-maker]').forEach((btn) => {
    btn.addEventListener('click', () => {
      shopSubTab = 'bouquet';
      renderShopMain();
    });
  });

  document.getElementById('btn-call-due-preorder')?.addEventListener('click', (e) => {
    const pId = e.currentTarget.dataset.preorderId;
    const pre = gameState.preorders.find((p) => p.id === pId);
    if (!pre) return;
    pre.status = 'in_shop';
    saveState();
    playBellSound();
    summonPreorderClient(pre, onHudUpdate, showToast, renderShopMain);
  });

  container.querySelectorAll('[data-call-inshop]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pre = gameState.preorders.find((p) => p.id === btn.dataset.callInshop);
      if (!pre) return;
      if (isClientTalkingNow()) {
        showToast('Сначала заверши разговор с текущим покупателем!');
        return;
      }
      playBellSound();
      summonPreorderClient(pre, onHudUpdate, showToast, renderShopMain);
    });
  });

  document.getElementById('btn-call-client')?.addEventListener('click', () => {
    if (isShopClosedNow()) {
      showToast('🌙 Лавка закрыта — пора отдыхать!');
      return;
    }
    playBellSound();
    summonNextClient(onHudUpdate, showToast, renderShopMain);
  });

  document.getElementById('btn-retry-ai')?.addEventListener('click', () => {
    retryLastAiRequest(onHudUpdate, showToast, renderShopMain);
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
    retryLastAiRequest(onHudUpdate, showToast, renderShopMain);
  });

  const chatInput = document.getElementById('client-chat-input');
  document.getElementById('btn-send-chat')?.addEventListener('click', () => {
    const text = chatInput?.value.trim();
    if (text) sendPlayerMessage(text, null, onHudUpdate, showToast, renderShopMain);
  });

  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const text = chatInput.value.trim();
      if (text) sendPlayerMessage(text, null, onHudUpdate, showToast, renderShopMain);
    }
  });

  document.getElementById('btn-toggle-offer')?.addEventListener('click', () => {
    toggleOfferDrawer();
    renderShopMain();
  });

  document.getElementById('btn-toggle-reject')?.addEventListener('click', () => {
    toggleRejectPanel();
    renderShopMain();
  });

  document.getElementById('btn-close-reject-panel')?.addEventListener('click', () => {
    closeRejectPanel();
    renderShopMain();
  });

  container.querySelectorAll('[data-shop-reject-tpl]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const reason = btn.dataset.shopRejectTpl;
      sendPlayerRejection(reason, onHudUpdate, showToast, renderShopMain);
    });
  });

  document.getElementById('btn-send-custom-shop-reject')?.addEventListener('click', () => {
    const reason =
      document.getElementById('shop-reject-reason-input')?.value.trim() ||
      'К сожалению, не сможем выполнить этот заказ';
    sendPlayerRejection(reason, onHudUpdate, showToast, renderShopMain);
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
      toggleOfferDrawer();
      sendPlayerMessage(
        promptMsg,
        offer,
        onHudUpdate,
        showToast,
        renderShopMain,
        `Предложили букет за ${customPrice} ₽`
      );
    });
  });

  container.querySelectorAll('[data-offer-acc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const accId = btn.dataset.offerAcc;
      const acc = (gameState.accessoriesInventory || []).find((a) => a.id === accId && a.qty > 0);
      const meta = ACCESSORIES_CATALOG[accId];
      if (!acc || !meta) return;
      const priceInput = document.getElementById(`price-acc-${accId}`);
      const customPrice = Math.max(50, Number(priceInput?.value) || meta.price);

      const offer = {
        kind: 'accessory',
        id: meta.id,
        price: customPrice,
        summary: meta.name
      };
      const promptMsg = `[Предложение продавца]: Я предлагаю вам сопутствующий товар «${meta.name}» (${meta.category}, 1 шт.) за ${customPrice} ₽.`;
      toggleOfferDrawer();
      sendPlayerMessage(
        promptMsg,
        offer,
        onHudUpdate,
        showToast,
        renderShopMain,
        `Предложили ${meta.icon} ${meta.shortName} за ${customPrice} ₽`
      );
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
      toggleOfferDrawer();
      sendPlayerMessage(
        promptMsg,
        offer,
        onHudUpdate,
        showToast,
        renderShopMain,
        `Предложили ${meta.shortName} за ${customPrice} ₽`
      );
    });
  });

  container.querySelectorAll('[data-vase-uid]').forEach((slot) => {
    slot.addEventListener('click', () => {
      selectedVaseUid = slot.dataset.vaseUid;
      renderShopMain();
    });
  });

  document.getElementById('vase-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'vase-modal-overlay') {
      selectedVaseUid = null;
      renderShopMain();
    }
  });

  document.getElementById('btn-close-inspector')?.addEventListener('click', () => {
    selectedVaseUid = null;
    renderShopMain();
  });

  document.getElementById('btn-add-to-bouquet')?.addEventListener('click', () => {
    const added = addFlowerToDraftBouquet(selectedVaseUid, showToast);
    if (added) {
      if (!gameState.inventory.find((i) => i.uid === selectedVaseUid)) {
        selectedVaseUid = null;
      }
      renderShopMain();
    }
  });

  document.getElementById('btn-next-shift')?.addEventListener('click', () => {
    advanceShift();
    onHudUpdate();
    renderShopMain();
    checkPreorderArrival(onHudUpdate, showToast, renderShopMain);
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
    renderShopMain();
    showToast('Вода в вазе освежена! (+8% свежести)');
  });

  document.getElementById('btn-discount-flower')?.addEventListener('click', () => {
    const item = gameState.inventory.find((i) => i.uid === selectedVaseUid);
    if (!item || item.discounted) return;
    item.discounted = true;
    saveState();
    renderShopMain();
    showToast('Установлена уценка -40%');
  });

  document.getElementById('btn-discard-flower')?.addEventListener('click', () => {
    gameState.inventory = gameState.inventory.filter((i) => i.uid !== selectedVaseUid);
    selectedVaseUid = null;
    gameState.mood = Math.min(100, gameState.mood + 3);
    saveState();
    onHudUpdate();
    renderShopMain();
    showToast('Увядшие цветы списаны, витрина стала чище');
  });
}

function scrollChatToBottom() {
  const box = document.getElementById('client-chat-box');
  if (box) box.scrollTop = box.scrollHeight;
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