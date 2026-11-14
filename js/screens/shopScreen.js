import {
  FLOWERS_CATALOG,
  TIME_PERIODS,
  WEATHERS,
  getGameDateObj,
  getSeasonInfo,
  getHolidayForDate
} from '../config.js';
import { gameState, saveState, advanceShift } from '../state.js';
import { getFlowerInVaseSvg, getSingleFlowerWrappedSvg } from '../graphics/flowersSvg.js';
import { getClientAvatarSvg } from '../graphics/avatarSvg.js';
import { renderBouquetMaker, addFlowerToDraftBouquet } from './bouquetMaker.js';
import { generateRandomClient, buildClientSystemPrompt, callAI, parseClientJson } from '../ai.js';
import { playBellSound, playCoinSound, playPaperSound } from '../sound.js';

let selectedVaseUid = null;
let shopSubTab = 'hall';

let activeClient = null;
let isAiThinking = false;
let showOfferDrawer = false;
let pendingOffer = null;

export function renderShopScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-shop');
  if (!container) return;

  const stemsCount = gameState.currentBouquet?.stems?.length || 0;
  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const season = getSeasonInfo(curDate);
  const isHoliday = getHolidayForDate(curDate);

  const openStr = String(gameState.openHour || 9).padStart(2, '0') + ':00';
  const closeStr = String(gameState.closeHour || 21).padStart(2, '0') + ':00';

  container.innerHTML = `
    <div class="screen-header">
      <h1 class="screen-title">${escapeHtml(gameState.shopName || 'Fleur Atelier')}</h1>
      <div style="display:flex; gap:5px; align-items:center;">
        ${gameState.hasFridge ? '<span class="badge badge-ok" title="Холодильник замедляет увядание">❄️</span>' : ''}
        <span class="badge ${isHoliday ? 'badge-warn' : 'badge-ok'}">${isHoliday ? '🎉 Праздник!' : `${openStr}–${closeStr}`}</span>
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
      shopSubTab = btn.dataset.shopTab;
      renderShopScreen(onHudUpdate, showToast);
    });
  });

  const subContent = document.getElementById('shop-subtab-content');
  if (shopSubTab === 'bouquet') {
    renderBouquetMaker(subContent, onHudUpdate, showToast, () => {
      renderShopScreen(onHudUpdate, showToast);
    });
    return;
  }

  const timeClass = gameState.timeIndex === 2 ? 'time-evening' : 'time-day';
  const weatherClass = `weather-${gameState.weather}`;
  const weatherObj = WEATHERS.find((w) => w.id === gameState.weather) || WEATHERS[0];
  const periodName = TIME_PERIODS[gameState.timeIndex] || 'Утро';

  const wallpaperClass = gameState.decor.includes('vintage_wallpaper') ? 'has-wallpaper' : '';
  const powerClass = gameState.powerOutage ? (gameState.candlesLit ? 'power-out candles-lit' : 'power-out') : '';
  const hasNeon = gameState.decor.includes('neon_sign');

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

      ${hasNeon ? `<div class="shop-neon-badge">✨ ${escapeHtml(gameState.shopName || 'Fleur Atelier')} ✨</div>` : ''}

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
          <button class="btn btn-soft" id="btn-next-shift" style="width: 100%; padding: 7px 6px; font-size: 11.5px;">
            ⏩ След. смена
          </button>
        </div>
      </div>

      ${renderClientZone()}

      <div class="vases-grid">
        ${vasesHtml}
      </div>
      <div class="wooden-counter"></div>
    </div>

    ${selectedItem ? renderInspectorModal(selectedItem) : ''}
  `;

  bindShopEvents(subContent, onHudUpdate, showToast);
  scrollChatToBottom();
}

function renderClientZone() {
  if (!activeClient) {
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

  return `
    <div class="client-card">
      <div class="client-header">
        <div class="client-avatar">
          ${getClientAvatarSvg(activeClient.appearance, activeClient.mood)}
        </div>
        <div class="client-info">
          <div class="client-name">${activeClient.name}, ${activeClient.age}</div>
          <div class="client-tags">
            <span class="client-tag">${shortPersona}</span>
            <span class="client-tag">🎁 ${activeClient.occasion}</span>
          </div>
          <div class="client-mood-row">
            <span>Настроение: ${activeClient.mood}%</span>
            <div class="freshness-bar-bg" style="flex:1;">
              <div class="freshness-bar-fill ${moodClass}" style="width: ${activeClient.mood}%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-box" id="client-chat-box">
        ${chatHtml}
        ${isAiThinking ? '<div class="chat-typing">💬 Клиент думает...</div>' : ''}
      </div>

      ${isFinished ? `
        <button class="btn btn-primary" id="btn-call-client">
          🔔 Позвать следующего клиента
        </button>
      ` : `
        <div class="chat-input-row">
          <input
            type="text"
            class="form-input"
            id="client-chat-input"
            placeholder="Напиши клиенту..."
            ${isAiThinking ? 'disabled' : ''}
          />
          <button class="btn btn-sage" id="btn-send-chat" ${isAiThinking ? 'disabled' : ''}>
            ➤
          </button>
        </div>

        <button class="btn btn-primary" id="btn-toggle-offer" ${isAiThinking ? 'disabled' : ''}>
          ${showOfferDrawer ? '✕ Скрыть витрину предложений' : '💐 Предложить букет или цветок'}
        </button>

        ${showOfferDrawer ? renderOfferDrawer() : ''}
      `}
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
          <input type="number" class="offer-price-input" id="price-b-${b.id}" value="${b.price}" min="50" />
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
              <input type="number" class="offer-price-input" id="price-v-${item.uid}" value="${unitPrice}" min="30" />
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

  document.getElementById('btn-call-client')?.addEventListener('click', () => {
    playBellSound();
    summonNextClient(onHudUpdate, showToast);
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
    renderShopScreen(onHudUpdate, showToast);
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
      const promptMsg = `[Предложение продавца]: Я предлагаю вам готовый букет (${bouquet.summary}) за ${customPrice} ₽.`;
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
      const promptMsg = `[Предложение продавца]: Я предлагаю вам цветок ${meta.name} (свежесть ${vase.freshness}%) за ${customPrice} ₽.`;
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
    showToast('Смена сменилась, время идёт вперёд');
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
  isAiThinking = true;

  const systemPrompt = buildClientSystemPrompt(activeClient);
  activeClient.history = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Ты только что вошёл в цветочный магазин. Поприветствуй продавца и скажи или намекни, что ищешь.' }
  ];

  renderShopScreen(onHudUpdate, showToast);

  try {
    const raw = await callAI(activeClient.history);
    const parsed = parseClientJson(raw);
    activeClient.history.push({ role: 'assistant', content: raw });
    activeClient.chatLog.push({ sender: 'client', text: parsed.reply });
  } catch (err) {
    activeClient.chatLog.push({
      sender: 'system',
      text: `⚠️ Не удалось связаться с ИИ: ${err.message}`
    });
  } finally {
    isAiThinking = false;
    renderShopScreen(onHudUpdate, showToast);
  }
}

async function sendPlayerMessage(aiText, offerObj, onHudUpdate, showToast, displayText = null) {
  if (!activeClient || isAiThinking || activeClient.status !== 'talking') return;
  if (offerObj) pendingOffer = offerObj;

  isAiThinking = true;
  activeClient.chatLog.push({ sender: 'player', text: displayText || aiText });
  activeClient.history.push({ role: 'user', content: aiText });

  renderShopScreen(onHudUpdate, showToast);

  try {
    const raw = await callAI(activeClient.history);
    const parsed = parseClientJson(raw);
    activeClient.history.push({ role: 'assistant', content: raw });
    activeClient.chatLog.push({ sender: 'client', text: parsed.reply });

    activeClient.mood = Math.max(0, Math.min(100, activeClient.mood + parsed.moodChange));

    if (parsed.dealStatus === 'bought' && pendingOffer) {
      completeSale(pendingOffer, onHudUpdate, showToast);
      activeClient.status = 'bought';
      activeClient.chatLog.push({
        sender: 'system',
        text: `✅ Сделка состоялась! Продано за ${pendingOffer.price} ₽`
      });
    } else if (parsed.dealStatus === 'bought' && !pendingOffer) {
      activeClient.chatLog.push({
        sender: 'system',
        text: '💡 Клиент согласен! Нажми «Предложить букет или цветок», чтобы провести оплату.'
      });
    } else if (parsed.dealStatus === 'left' || activeClient.mood <= 0) {
      activeClient.status = 'left';
      gameState.mood = Math.max(10, gameState.mood - 3);
      saveState();
      onHudUpdate();
      activeClient.chatLog.push({
        sender: 'system',
        text: '💨 Клиент ушёл без покупки.'
      });
    }
  } catch (err) {
    activeClient.chatLog.push({
      sender: 'system',
      text: `⚠️ Ошибка ИИ: ${err.message}`
    });
  } finally {
    isAiThinking = false;
    renderShopScreen(onHudUpdate, showToast);
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

  gameState.money += offer.price;
  gameState.totalEarned += offer.price;
  gameState.bouquetsSold += 1;
  gameState.energy = Math.max(10, gameState.energy - 5);
  const closeLimit = (gameState.closeHour || 21) * 60;
  gameState.timeMinutes = Math.min(closeLimit, (gameState.timeMinutes || 540) + 20);
  gameState.mood = Math.min(100, gameState.mood + 3);
  pendingOffer = null;

  playCoinSound();
  saveState();
  onHudUpdate();
  showToast(`💰 Продано! +${offer.price} ₽ в кассу`);
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