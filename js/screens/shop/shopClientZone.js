/**
 * js/screens/shop/shopClientZone.js
 * Зона живых клиентов в торговом зале: карточка, чат, торг, предложения товаров и оплата
 */

import { FLOWERS_CATALOG, ACCESSORIES_CATALOG } from '/js/config.js';
import { gameState, aiSettings, saveState, addGameMinutes } from '/js/state.js';
import { getClientAvatarSvg } from '/js/graphics/avatarSvg.js';
import { getSingleFlowerWrappedSvg } from '/js/graphics/flowersSvg.js';
import {
  generateRandomClient,
  generatePreorderClient,
  buildClientSystemPrompt,
  callAI,
  parseClientJson
} from '/js/ai.js';
import { playBellSound, playCoinSound } from '/js/sound.js';

let activeClient = null;
let isAiThinking = false;
let showOfferDrawer = false;
let showRejectPanel = false;
let pendingOffer = null;
let lastFailedRequest = null;

const SHOP_REJECT_TEMPLATES = [
  'Нет нужных цветов в наличии',
  'Много заказов, не успеем собрать',
  'Бюджет маловат для такого букета',
  'Лавка скоро закрывается'
];

export function getActiveClient() {
  return activeClient;
}

export function setActiveClient(client) {
  activeClient = client;
}

export function getIsAiThinking() {
  return isAiThinking;
}

export function isClientTalkingNow() {
  return Boolean(activeClient && activeClient.status === 'talking');
}

export function checkPreorderArrival(onHudUpdate, showToast, renderShopMain) {
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
  summonPreorderClient(duePreorder, onHudUpdate, showToast, renderShopMain);
  return true;
}

export function renderClientZoneHtml(closedNow, waitingDue) {
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
  const wantedBouquet =
    !isFinished && activeClient.wantedBouquetId
      ? gameState.readyBouquets.find((b) => b.id === activeClient.wantedBouquetId)
      : null;

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
            ${isFinished ? '<span class="badge badge-warn" style="margin-left:4px;">Завершён</span>' : ''}
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
        <button class="btn btn-soft" id="btn-retry-ai" style="font-size:12px; padding:8px 10px;">
          🔄 Повторить запрос ИИ
        </button>
      ` : ''}

      ${wantedBouquet ? `
        <button class="btn btn-sage" id="btn-sell-wanted-bouquet" data-bouquet-id="${wantedBouquet.id}" ${isAiThinking ? 'disabled' : ''}>
          ⚡ Продать букет с витрины в 1 клик (${wantedBouquet.price} ₽)
        </button>
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
          <button class="btn btn-sage" id="btn-send-chat" ${isAiThinking ? 'disabled' : ''} title="Отправить">
            ➤
          </button>
        </div>

        <div style="display:flex; gap:6px;">
          <button class="btn btn-primary" id="btn-toggle-offer" ${isAiThinking ? 'disabled' : ''} style="flex:1;">
            ${showOfferDrawer ? '✕ Скрыть витрину' : '💐 Предложить'}
          </button>
          <button class="btn btn-danger" id="btn-toggle-reject" ${isAiThinking ? 'disabled' : ''} style="padding: 10px 12px;">
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
        <strong style="font-size:12px;">Причина отказа (можно не указывать):</strong>
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
          placeholder="Своя причина (необязательно)..."
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

  const accessoriesHtml = (gameState.accessoriesInventory || [])
    .filter((acc) => acc.qty > 0)
    .map((acc) => {
      const meta = ACCESSORIES_CATALOG[acc.id];
      if (!meta) return '';
      return `
        <div class="offer-item-row">
          <div class="offer-thumb" style="display:flex; align-items:center; justify-content:center; font-size:24px;">${meta.icon}</div>
          <div style="flex:1; min-width:0;">
            <strong style="font-size:12px;">${meta.name}</strong>
            <p class="muted-text" style="font-size:11px;">Подарок • В наличии: ${acc.qty} шт.</p>
          </div>
          <input type="number" class="offer-price-input" id="price-acc-${acc.id}" value="${meta.price}" min="50" autocomplete="off" data-form-type="other" />
          <button class="btn btn-soft" data-offer-acc="${acc.id}" style="padding:6px 9px; font-size:11.5px;">
            Дать
          </button>
        </div>
      `;
    })
    .join('');

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
      ${accessoriesHtml ? `<strong style="font-size:12px; margin-top:2px;">🎁 Шарики, игрушки и конфеты:</strong>${accessoriesHtml}` : ''}
      ${vasesHtml}
    </div>
  `;
}

function getActualFlowerPrice(item, meta) {
  return item.discounted ? Math.round(meta.price * 0.6) : meta.price;
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

function detectRequestedBouquetId(replyText) {
  if (!Array.isArray(gameState.readyBouquets) || gameState.readyBouquets.length === 0) return null;
  const text = String(replyText || '');
  const lower = text.toLowerCase();

  const idMatch = text.match(/\[id=([^\]]+)\]/);
  if (idMatch) {
    const byId = gameState.readyBouquets.find((b) => b.id === idMatch[1]);
    if (byId) return byId.id;
  }

  const mentionsBouquet =
    lower.includes('букет') ||
    lower.includes('витрин') ||
    lower.includes('прилав') ||
    lower.includes('стоит') ||
    lower.includes('можно мне его') ||
    lower.includes('заберу его');
  if (!mentionsBouquet) return null;

  const byPrice = gameState.readyBouquets.find((b) => lower.includes(String(b.price)));
  if (byPrice) return byPrice.id;

  if (
    gameState.readyBouquets.length === 1 &&
    (lower.includes('можно мне его') || lower.includes('что это за букет'))
  ) {
    return gameState.readyBouquets[0].id;
  }
  return null;
}

function cleanClientReplyText(text) {
  return String(text || '').replace(/\s*\[id=[^\]]+\]/g, '').trim();
}

export function handleCounterBouquetSell(bouquetId, onHudUpdate, showToast, renderShopMain) {
  if (!activeClient || isAiThinking || activeClient.status !== 'talking') return;
  const bouquet = gameState.readyBouquets.find((b) => b.id === bouquetId);
  if (!bouquet) return;

  const freshWord = getBouquetFreshnessWord(bouquet);
  const isWilted = freshWord.includes('подвявш');
  const clientAskedForThis = activeClient.wantedBouquetId === bouquetId;

  if (clientAskedForThis && !isWilted && !activeClient.preorder && bouquet.price <= activeClient.budget * 1.15) {
    showOfferDrawer = false;
    showRejectPanel = false;
    lastFailedRequest = null;

    activeClient.chatLog.push({
      sender: 'player',
      text: `💐 Продали букет с витрины (${bouquet.summary}) за ${bouquet.price} ₽`
    });

    const soldPrice = bouquet.price;
    const tip = completeSale(
      {
        kind: 'bouquet',
        id: bouquet.id,
        price: soldPrice,
        summary: `Готовый букет (${bouquet.summary})`
      },
      onHudUpdate,
      showToast
    );

    activeClient.chatLog.push({
      sender: 'client',
      text: `Ой, какая красота! С огромным удовольствием забираю за ${soldPrice} ₽, спасибо! 🌸`
    });
    activeClient.chatLog.push({
      sender: 'system',
      text: tip > 0
        ? `✅ Сделка состоялась! Продано за ${soldPrice} ₽ + чаевые ${tip} ₽ 🌟`
        : `✅ Сделка состоялась! Продано за ${soldPrice} ₽`
    });

    activeClient.status = 'bought';
    activeClient.wantedBouquetId = null;
    renderShopMain();
    return;
  }

  const offer = {
    kind: 'bouquet',
    id: bouquet.id,
    price: bouquet.price,
    summary: `Готовый букет (${bouquet.summary})`
  };
  const promptMsg = `[Предложение продавца]: Я предлагаю вам готовый букет с витрины (${bouquet.summary}, ${bouquet.stemsCount} шт., цветы ${freshWord}) за ${bouquet.price} ₽.`;
  showOfferDrawer = false;
  sendPlayerMessage(promptMsg, offer, onHudUpdate, showToast, renderShopMain, `Предложили букет с витрины за ${bouquet.price} ₽`);
}

export async function summonNextClient(onHudUpdate, showToast, renderShopMain) {
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

  renderShopMain();
  await requestSummonGreeting(onHudUpdate, showToast, renderShopMain);
}

export async function summonPreorderClient(preorder, onHudUpdate, showToast, renderShopMain) {
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

  renderShopMain();
  await requestSummonGreeting(onHudUpdate, showToast, renderShopMain);
}

async function requestSummonGreeting(onHudUpdate, showToast, renderShopMain) {
  if (!activeClient) return;
  try {
    activeClient.history[0].content = buildClientSystemPrompt(activeClient);
    const raw = await callAI(activeClient.history);
    const parsed = parseClientJson(raw);
    const wantedId = detectRequestedBouquetId(parsed.reply);
    if (wantedId) {
      activeClient.wantedBouquetId = wantedId;
    }
    const cleanReply = cleanClientReplyText(parsed.reply);
    activeClient.history.push({ role: 'assistant', content: raw });
    activeClient.chatLog.push({ sender: 'client', text: cleanReply });
    lastFailedRequest = null;
  } catch (err) {
    lastFailedRequest = { type: 'summon' };
    activeClient.chatLog.push({
      sender: 'system',
      text: `⚠️ Не удалось связаться с ИИ: ${err.message}`
    });
  } finally {
    isAiThinking = false;
    renderShopMain();
  }
}

export async function retryLastAiRequest(onHudUpdate, showToast, renderShopMain) {
  if (!activeClient || isAiThinking || !lastFailedRequest) return;
  const retryData = lastFailedRequest;
  lastFailedRequest = null;

  if (activeClient.chatLog.length && activeClient.chatLog[activeClient.chatLog.length - 1].sender === 'system') {
    activeClient.chatLog.pop();
  }

  isAiThinking = true;
  renderShopMain();

  if (retryData.type === 'summon') {
    await requestSummonGreeting(onHudUpdate, showToast, renderShopMain);
    return;
  }

  if (retryData.type === 'message') {
    await executePlayerMessageCall(retryData.aiText, retryData.offerObj, retryData.displayText, onHudUpdate, showToast, renderShopMain);
  }
}

export function sendPlayerRejection(reason, onHudUpdate, showToast, renderShopMain) {
  showRejectPanel = false;
  const promptMsg = `[Отказ продавца]: ${reason}`;
  const displayMsg = `🚫 Отказали в заказе: «${reason}»`;
  sendPlayerMessage(promptMsg, null, onHudUpdate, showToast, renderShopMain, displayMsg);
}

export async function sendPlayerMessage(aiText, offerObj, onHudUpdate, showToast, renderShopMain, displayText = null) {
  if (!activeClient || isAiThinking || activeClient.status !== 'talking') return;
  if (offerObj) pendingOffer = offerObj;
  lastFailedRequest = null;

  isAiThinking = true;
  activeClient.chatLog.push({ sender: 'player', text: displayText || aiText });
  renderShopMain();

  await executePlayerMessageCall(aiText, offerObj, displayText, onHudUpdate, showToast, renderShopMain);
}

async function executePlayerMessageCall(aiText, offerObj, displayText, onHudUpdate, showToast, renderShopMain) {
  if (!activeClient) return;
  if (activeClient.history[0]?.role === 'system') {
    activeClient.history[0].content = buildClientSystemPrompt(activeClient);
  }
  activeClient.history.push({ role: 'user', content: aiText });

  try {
    const raw = await callAI(activeClient.history);
    const parsed = parseClientJson(raw);
    const wantedId = detectRequestedBouquetId(parsed.reply);
    if (wantedId) {
      activeClient.wantedBouquetId = wantedId;
    }
    const cleanReply = cleanClientReplyText(parsed.reply);

    activeClient.history.push({ role: 'assistant', content: raw });
    activeClient.chatLog.push({ sender: 'client', text: cleanReply });

    const baseMood = Number.isFinite(activeClient.mood) ? activeClient.mood : 60;
    activeClient.mood = Math.max(0, Math.min(100, baseMood + (Number(parsed.moodChange) || 0)));

    const wasRejectedByPlayer = String(aiText || '').startsWith('[Отказ продавца]:');

    if (
      parsed.dealStatus === 'talking' &&
      !activeClient.boostedAfterReject &&
      (cleanReply.includes('300 ₽') || cleanReply.toLowerCase().includes('накин') || cleanReply.toLowerCase().includes('увелич'))
    ) {
      activeClient.budget += 300;
      activeClient.boostedAfterReject = true;
    }

    if (parsed.dealStatus === 'bought' && pendingOffer) {
      const soldPrice = pendingOffer.price;
      const tip = completeSale(pendingOffer, onHudUpdate, showToast);
      activeClient.status = 'bought';
      activeClient.wantedBouquetId = null;
      activeClient.chatLog.push({
        sender: 'system',
        text: tip > 0
          ? `✅ Сделка состоялась! Продано за ${soldPrice} ₽ + чаевые ${tip} ₽ 🌟`
          : `✅ Сделка состоялась! Продано за ${soldPrice} ₽`
      });
    } else if (parsed.dealStatus === 'bought' && !pendingOffer) {
      activeClient.chatLog.push({
        sender: 'system',
        text: '💡 Клиент согласен! Нажми «💐 Предложить» или кнопку на витрине, чтобы провести оплату.'
      });
    } else if (parsed.dealStatus === 'left' || activeClient.mood <= 0 || (wasRejectedByPlayer && !activeClient.boostedAfterReject)) {
      activeClient.status = 'left';
      activeClient.wantedBouquetId = null;
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
    renderShopMain();
  }
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
  } else if (offer.kind === 'accessory') {
    const acc = (gameState.accessoriesInventory || []).find((a) => a.id === offer.id);
    if (acc) {
      acc.qty -= 1;
      if (acc.qty <= 0) {
        gameState.accessoriesInventory = gameState.accessoriesInventory.filter((a) => a.id !== offer.id);
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

export function toggleOfferDrawer() {
  showOfferDrawer = !showOfferDrawer;
  if (showOfferDrawer) showRejectPanel = false;
}

export function toggleRejectPanel() {
  showRejectPanel = !showRejectPanel;
  if (showRejectPanel) showOfferDrawer = false;
}

export function closeRejectPanel() {
  showRejectPanel = false;
}

export function getShowOfferDrawer() {
  return showOfferDrawer;
}

export function getShowRejectPanel() {
  return showRejectPanel;
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