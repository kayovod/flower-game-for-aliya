/**
 * js/screens/phone/phoneDirect.js
 * Чаты Direct: клиенты, доставка, собеседования, общение с командой, закрепление чатов и повтор при сбое ИИ
 */

import {
  FLOWERS_CATALOG,
  WRAPPINGS,
  RIBBONS,
  getGameDateObj,
  getHolidayForDate
} from '../../config.js';
import { gameState, saveState, addGameMinutes, isShopClosedNow, sortDirectMessages } from '../../state.js';
import { getFlowerSvgDataUrl } from '../../graphics/flowersSvg.js';
import {
  generateDirectMessage,
  generateDirectFollowUp,
  generateDirectRejectionReply,
  generateJobCandidateDm,
  generateCandidateInterviewReply,
  generateCandidateHireReaction,
  generateEmployeeChatReply,
  resolveCourierForceMajeureReply,
  detectMentionedFlowers,
  pickRandom
} from '../../ai.js';
import { playCoinSound, playPaperSound } from '../../sound.js';

let isFetchingDm = false;
let openedDmId = null;
let busyDmId = null;
let showDmPhotoPicker = false;
let selectedDmPhotoId = null;
let showDmRejectMenu = false;
let showFloristTaskPanel = false;
const failedDmRetries = {};

const DIRECT_REJECT_TEMPLATES = [
  'Нет таких цветов',
  'Не успеем к этому времени',
  'Слишком маленький бюджет',
  'Магазин уже закрывается'
];

function clearDmRetryErrors(dm) {
  delete failedDmRetries[dm.id];
  if (Array.isArray(dm.thread)) {
    dm.thread = dm.thread.filter((m) => !m.isRetryError);
  }
}

export function renderDirectApp(body, onHudUpdate, showToast, onRefreshPhone) {
  const refresh = onRefreshPhone || (() => renderDirectApp(body, onHudUpdate, showToast, onRefreshPhone));

  const syncPinButton = () => {
    if (!openedDmId) return;
    const dm = gameState.directMessages.find((m) => m.id === openedDmId);
    const topbar = body.querySelector('.dm-chat-topbar');
    if (!dm || !topbar || topbar.querySelector('#btn-dm-pin-toggle')) return;

    const pinBtn = document.createElement('button');
    pinBtn.id = 'btn-dm-pin-toggle';
    pinBtn.className = `btn ${dm.pinned ? 'btn-primary' : 'btn-soft'}`;
    pinBtn.style.cssText = `padding:5px 8px; font-size:11px; flex-shrink:0; opacity:${dm.pinned ? '1' : '0.72'};`;
    pinBtn.textContent = '📌';
    pinBtn.title = dm.pinned ? 'Открепить чат' : 'Закрепить чат наверху';
    pinBtn.addEventListener('click', () => {
      dm.pinned = !dm.pinned;
      sortDirectMessages();
      saveState();
      showToast(dm.pinned ? '📌 Чат закреплён наверху!' : 'Чат откреплён');
      refresh();
    });
    topbar.appendChild(pinBtn);
  };

  if (!body._pinObs) {
    body._pinObs = new MutationObserver(syncPinButton);
    body._pinObs.observe(body, { childList: true });
  }

  if (openedDmId) {
    const activeDm = gameState.directMessages.find((m) => m.id === openedDmId);
    if (activeDm) {
      renderOpenedDmChat(activeDm, body, onHudUpdate, showToast, refresh);
      syncPinButton();
      return;
    }
    openedDmId = null;
  }

  const listHtml = gameState.directMessages.length
    ? gameState.directMessages.map((dm) => renderDmListItem(dm)).join('')
    : `<p class="muted-text" style="text-align:center; padding: 14px;">Сообщений пока нет. Письма от клиентов и команды приходят сами, а можно проверить и вручную!</p>`;

  body.innerHTML = `
    <button class="btn btn-sage" id="btn-check-dm" ${isFetchingDm ? 'disabled' : ''}>
      ${isFetchingDm ? '⏳ Загружаем сообщения...' : '📩 Проверить новые сообщения'}
    </button>
    ${listHtml}
  `;

  document.getElementById('btn-check-dm')?.addEventListener('click', async () => {
    if (isFetchingDm) return;
    isFetchingDm = true;
    renderDirectApp(body, onHudUpdate, showToast, refresh);
    try {
      const openJob = (gameState.jobPostings || []).find((j) => {
        if (j.status !== 'open') return false;
        const activeCount = (gameState.directMessages || []).filter(
          (m) =>
            m.jobApplication &&
            m.jobApplication.jobId === j.id &&
            m.jobApplication.status === 'interviewing' &&
            !m.blockedByClient
        ).length;
        return activeCount < 2;
      });
      const shouldSpawnJob = openJob && (Date.now() >= (openJob.nextResponseRealMs || 0) || Math.random() < 0.65);

      if (shouldSpawnJob) {
        const dm = await generateJobCandidateDm(openJob);
        openJob.respondedCount = (openJob.respondedCount || 0) + 1;
        openJob.nextResponseRealMs = Date.now() + 30000 + Math.floor(Math.random() * 40000);
        dm.read = false;
        gameState.directMessages.unshift(dm);
        trimDirectMessages();
        saveState();
        onHudUpdate();
        showToast(`💼 Отклик на вакансию от ${dm.jobApplication?.candidateName || dm.senderName}!`);
      } else {
        const dm = await generateDirectMessage();
        dm.read = false;
        gameState.directMessages.unshift(dm);
        trimDirectMessages();
        saveState();
        onHudUpdate();
        showToast(`Новое сообщение от ${dm.senderName}`);
      }
    } catch (err) {
      showToast('⚠️ Ошибка ИИ: ' + err.message);
    } finally {
      isFetchingDm = false;
      refresh();
    }
  });

  body.querySelectorAll('[data-open-dm]').forEach((row) => {
    row.addEventListener('click', () => {
      const dm = gameState.directMessages.find((m) => m.id === row.dataset.openDm);
      if (!dm) return;
      openedDmId = dm.id;
      showDmPhotoPicker = false;
      selectedDmPhotoId = null;
      showDmRejectMenu = false;
      showFloristTaskPanel = false;
      if (!dm.read) {
        dm.read = true;
        saveState();
        onHudUpdate();
      }
      refresh();
    });
  });
}

function renderDmListItem(dm) {
  const thread = Array.isArray(dm.thread) && dm.thread.length ? dm.thread : [{ sender: 'client', text: dm.text }];
  const lastMsg = thread[thread.length - 1]?.text || dm.text || '';

  let icon = '💬';
  let statusText = 'Вопрос';
  let statusClass = 'badge-warn';

  if (dm.blockedByClient || dm.blockedByPlayer) {
    icon = '⛔';
    statusText = 'Заблокирован';
    statusClass = 'badge-warn';
  } else if (dm.kind === 'employee') {
    const emp = (gameState.employees || []).find((e) => e.id === dm.employeeId);
    const hasIssue = (gameState.deliveries || []).some(
      (d) => d.courierId === dm.employeeId && d.status === 'issue_waiting'
    );
    icon = emp?.roleIcon || '👤';
    if (hasIssue) {
      statusText = '⚠️ Ждёт ответа!';
      statusClass = 'badge-warn';
    } else {
      statusText = emp?.roleName || 'Сотрудник';
      statusClass = 'badge-ok';
    }
  } else if (dm.jobApplication) {
    icon = dm.jobApplication.roleIcon || '💼';
    if (dm.jobApplication.status === 'hired') {
      statusText = 'В команде ✓';
      statusClass = 'badge-ok';
    } else if (dm.jobApplication.status === 'rejected') {
      statusText = 'Отказано';
      statusClass = 'badge-warn';
    } else {
      statusText = 'Собеседование';
      statusClass = 'badge-ok';
    }
  } else if (dm.kind === 'review' && !dm.order) {
    icon = '⭐';
    statusText = 'Отзыв';
  } else if (dm.order) {
    const delivObj = dm.order.isDelivery
      ? (gameState.deliveries || []).find((d) => d.dmId === dm.id)
      : null;
    icon = dm.order.isDelivery ? '🚚' : '💐';

    if (dm.order.done || delivObj?.status === 'delivered') {
      statusText = dm.order.isDelivery ? 'Доставлен ✓' : 'Выполнен ✓';
      statusClass = 'badge-ok';
    } else if (dm.order.rejected) {
      statusText = 'Отменён';
      statusClass = 'badge-warn';
    } else if (delivObj?.status === 'issue_waiting') {
      statusText = 'Форс-мажор ⚠️';
      statusClass = 'badge-warn';
    } else if (delivObj?.status === 'in_transit') {
      statusText = 'В пути 🚚';
      statusClass = 'badge-ok';
    } else if (dm.order.accepted) {
      statusText = dm.order.isDelivery ? `Дост. ${dm.order.dueTimeLabel}` : `Ждём ${dm.order.dueTimeLabel}`;
      statusClass = 'badge-ok';
    } else {
      statusText = dm.order.isDelivery ? `Доставка ${dm.order.dueTimeLabel}` : `Запрос ${dm.order.dueTimeLabel}`;
      statusClass = 'badge-warn';
    }
  }

  return `
    <div class="dm-list-item ${!dm.read ? 'unread' : ''} ${dm.pinned ? 'pinned' : ''}" data-open-dm="${dm.id}">
      <div class="dm-list-avatar">
        ${icon}
        ${!dm.read ? '<span class="dm-unread-dot"></span>' : ''}
      </div>
      <div style="flex:1; min-width:0;">
        <div class="row-between">
          <strong style="font-size:13px;">${dm.pinned ? '📌 ' : ''}${escapeHtml(dm.senderName)}</strong>
          <span class="badge ${statusClass}" style="font-size:10px;">${statusText}</span>
        </div>
        <div class="dm-list-preview">${escapeHtml(lastMsg)}</div>
      </div>
      <span class="muted-text" style="font-size:10.5px; flex-shrink:0;">${dm.createdTimeLabel || ''}</span>
    </div>
  `;
}

function renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh) {
  if (dm.kind === 'employee') {
    renderEmployeeDirectChat(dm, body, onHudUpdate, showToast, refresh);
    return;
  }

  if (dm.jobApplication) {
    renderJobInterviewChat(dm, body, onHudUpdate, showToast, refresh);
    return;
  }

  const isBusy = busyDmId === dm.id;
  const hasRetry = Boolean(failedDmRetries[dm.id] && !isBusy);
  const hasOrder = Boolean(dm.order);
  const isDelivery = Boolean(dm.order?.isDelivery);
  const delivObj = isDelivery ? (gameState.deliveries || []).find((d) => d.dmId === dm.id) : null;
  const flowerName = dm.order?.flowerName || FLOWERS_CATALOG[dm.order?.typeId]?.name || 'цветы';
  const vaseMatch = hasOrder
    ? gameState.inventory.find((v) => v.typeId === dm.order.typeId && v.qty >= dm.order.qty)
    : null;
  const accLine = dm.order?.accessoryName ? ` + 🎁 ${dm.order.accessoryName}` : '';

  const threadList = Array.isArray(dm.thread) && dm.thread.length
    ? dm.thread
    : [
        { sender: 'client', text: dm.text },
        ...(dm.replyText ? [{ sender: 'player', text: dm.replyText }] : [])
      ];

  const threadHtml = threadList
    .map(
      (m) => `
      <div class="dm-msg ${m.sender}">
        ${m.photoUrl ? `<img class="dm-msg-photo" src="${m.photoUrl}" alt="Фото букета" />` : ''}
        ${m.text ? `<span>${escapeHtml(m.text)}</span>` : ''}
      </div>
    `
    )
    .join('');

  const isBlocked = Boolean(dm.blockedByClient || dm.blockedByPlayer);
  const preObj = hasOrder && !isDelivery
    ? gameState.preorders.find((p) => p.dmId === dm.id && p.status !== 'cancelled')
    : null;
  const alreadyInShop = preObj && preObj.status === 'in_shop';
  const deliveryStarted = Boolean(delivObj && (delivObj.status === 'in_transit' || delivObj.status === 'issue_waiting' || delivObj.status === 'delivered'));
  const canAcceptOrder =
    hasOrder && !dm.order.done && !dm.order.accepted && !dm.order.rejected && !isBlocked && !alreadyInShop;
  const canRejectOrder = hasOrder && !dm.order.done && !dm.order.rejected && !isBlocked && !alreadyInShop && !deliveryStarted;

  let orderBannerHtml = '';
  if (hasOrder) {
    const addrLine = isDelivery && dm.order.address ? `<br/>📍 <strong>Адрес:</strong> ${escapeHtml(dm.order.address)}${dm.order.recipientNote ? ` (${escapeHtml(dm.order.recipientNote)})` : ''}` : '';
    if (dm.order.done || delivObj?.status === 'delivered') {
      orderBannerHtml = `
        <div class="dm-order-banner agreed">
          ✅ <strong>${isDelivery ? 'Доставлен' : 'Выполнен'}:</strong> ${dm.order.qty} шт. «${escapeHtml(flowerName)}»${escapeHtml(accLine)}${addrLine}
        </div>
      `;
    } else if (dm.order.rejected) {
      orderBannerHtml = `
        <div class="dm-order-banner cancelled">
          ❌ <strong>Заказ отменён:</strong> клиент предупреждён (можно договориться заново в чате).
        </div>
      `;
    } else if (dm.order.accepted) {
      const delivStatusHint = isDelivery
        ? delivObj?.status === 'issue_waiting'
          ? '⚠️ Форс-мажор — ответь курьеру в его чате!'
          : delivObj?.status === 'in_transit'
          ? `🚚 Курьер уже в пути (ост. ~${delivObj.remainingMin} мин)`
          : '📦 Передайте букет курьеру в его чате или на экране «Магазин»'
        : vaseMatch
        ? ' • В наличии ✓'
        : ' • Докупи к приходу';
      orderBannerHtml = `
        <div class="dm-order-banner agreed">
          ✅ <strong>${isDelivery ? 'Доставка принята!' : 'Принят в работу!'}</strong> ${dm.order.qty} шт. «${escapeHtml(flowerName)}»${escapeHtml(accLine)} • к ${dm.order.dueTimeLabel} • ${dm.order.reward} ₽${addrLine}
          <div style="color:var(--sage-dark); font-weight:800; margin-top:2px;">${delivStatusHint}</div>
        </div>
      `;
    } else {
      orderBannerHtml = `
        <div class="dm-order-banner">
          ${isDelivery ? '🚚 <strong>Запрос на доставку:</strong>' : '💐 <strong>Запрос клиента:</strong>'} ${dm.order.qty} шт. «${escapeHtml(flowerName)}»${escapeHtml(accLine)} • к ${dm.order.dueTimeLabel} • ~${dm.order.reward} ₽${addrLine}
          ${
            vaseMatch
              ? `<span style="color:var(--sage-dark); font-weight:800;"> • В наличии ✓</span>`
              : `<span style="color:#9D6F1D; font-weight:800;"> • Нет в вазах</span>`
          }
        </div>
      `;
    }
  }

  const savedPhotos = gameState.savedPhotos || [];
  const attachedPhoto = selectedDmPhotoId
    ? savedPhotos.find((p) => p.id === selectedDmPhotoId) || null
    : null;

  const photoPickerHtml = showDmPhotoPicker
    ? `
      <div class="dm-photo-picker-box">
        <div class="row-between">
          <strong style="font-size:11.5px;">📷 Выбери снимок из галереи Polaroid:</strong>
          <button class="btn btn-soft" id="btn-dm-close-photos" style="padding:2px 7px; font-size:11px;">✕</button>
        </div>
        ${
          savedPhotos.length
            ? `<div class="photo-picker-row">
              ${savedPhotos
                .map(
                  (p) => `
                <div class="photo-pick-item ${p.id === selectedDmPhotoId ? 'selected' : ''}" data-pick-dm-photo="${p.id}" title="${escapeAttr(p.description || 'Снимок')}">
                  <img src="${p.dataUrl}" alt="Фото" />
                </div>
              `
                )
                .join('')}
            </div>`
            : `<p class="muted-text" style="font-size:11px;">Галерея пуста! Сфоткай букет на Столе сборки или зал в InstaFlower.</p>`
        }
      </div>
    `
    : '';

  const attachedPreviewHtml = attachedPhoto
    ? `
      <div class="dm-attached-preview">
        <img src="${attachedPhoto.dataUrl}" alt="Вложение" />
        <div style="flex:1; min-width:0;">
          <strong>📷 Фото прикреплено</strong>
          <div class="muted-text" style="font-size:10.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${escapeHtml(attachedPhoto.description || 'Снимок букета')}
          </div>
        </div>
        <button class="btn btn-soft" id="btn-dm-clear-photo" style="padding:3px 7px; font-size:11px;">✕</button>
      </div>
    `
    : '';

  const rejectMenuHtml =
    showDmRejectMenu && canRejectOrder
      ? `
      <div class="reject-box">
        <div class="row-between">
          <strong style="font-size:11.5px;">Выбери причину отказа:</strong>
          <button class="btn btn-soft" id="btn-dm-close-reject" style="padding:2px 7px; font-size:10.5px;">✕</button>
        </div>
        <div class="reject-chips">
          ${DIRECT_REJECT_TEMPLATES.map(
            (tpl) => `
            <button class="reject-chip" data-dm-reject-tpl="${escapeAttr(tpl)}" ${isBusy ? 'disabled' : ''}>
              ${escapeHtml(tpl)}
            </button>
          `
          ).join('')}
        </div>
        <div style="display:flex; gap:5px;">
          <input type="text" class="form-input" id="dm-reject-custom-input" autocomplete="off" spellcheck="false" placeholder="Своя причина..." style="padding:6px 8px; font-size:11.5px;" ${isBusy ? 'disabled' : ''} />
          <button class="btn btn-danger" id="btn-dm-reject-custom" style="padding:6px 9px; font-size:11.5px;" ${isBusy ? 'disabled' : ''}>Отказать</button>
        </div>
        <button class="btn btn-soft" id="btn-dm-reject-silent" style="padding:6px 8px; font-size:11px;" ${isBusy ? 'disabled' : ''}>
          🔇 Молчаливый отказ («К сожалению, не сможем взять заказ»)
        </button>
      </div>
    `
      : '';

  body.innerHTML = `
    <div class="dm-chat-topbar">
      <button class="btn btn-soft" id="btn-dm-back" style="padding:5px 9px; font-size:11.5px;">← Чаты</button>
      <div style="flex:1; min-width:0; text-align:center;">
        <strong style="font-size:13px;">${escapeHtml(dm.senderName)}</strong>
      </div>
      ${
        dm.blockedByClient
          ? `<span class="badge badge-warn">В ЧС</span>`
          : dm.blockedByPlayer
          ? `<button class="btn btn-soft" id="btn-dm-unblock" style="padding:5px 8px; font-size:11px;">Разблок.</button>`
          : `<button class="btn btn-danger" id="btn-dm-block" style="padding:5px 8px; font-size:11px;">🚫 Блок</button>`
      }
    </div>

    <div class="dm-card">
      <div class="dm-thread" style="max-height: 245px; overflow-y: auto;">
        ${threadHtml}
        ${isBusy ? `<div class="dm-msg system">💬 ${escapeHtml(dm.senderName)} печатает...</div>` : ''}
      </div>

      ${hasRetry ? `<button class="btn btn-soft" id="btn-dm-retry-ai" style="padding:7px; font-size:12px;">🔄 Повторить запрос ИИ</button>` : ''}

      ${orderBannerHtml}

      ${
        canAcceptOrder || canRejectOrder
          ? `
        <div class="dm-order-actions">
          ${
            canAcceptOrder
              ? `<button class="btn btn-sage" id="btn-dm-accept-order" ${isBusy ? 'disabled' : ''}>
              ${isDelivery ? '🚚 Принять доставку' : '✅ Принять заказ'}
            </button>`
              : ''
          }
          ${
            canRejectOrder
              ? `<button class="btn btn-danger" id="btn-dm-toggle-reject" ${isBusy ? 'disabled' : ''}>
              ${dm.order.accepted ? '🚫 Отменить заказ' : '🚫 Отказать'}
            </button>`
              : ''
          }
        </div>
      `
          : ''
      }

      ${rejectMenuHtml}

      ${
        dm.blockedByClient
          ? `<div class="dm-blocked-banner">⛔ Пользователь заблокировал вас из-за грубого общения. Переписка закрыта.</div>`
          : dm.blockedByPlayer
          ? `<div class="dm-blocked-banner">🚫 Вы заблокировали этого пользователя.</div>`
          : alreadyInShop
          ? `<span class="badge badge-warn" style="align-self:flex-start;">🔔 Клиент уже в зале забирает заказ! Перейди в «Магазин».</span>`
          : `
        ${photoPickerHtml}
        ${attachedPreviewHtml}
        <div class="row-between" style="gap: 5px;">
          <button
            class="btn ${showDmPhotoPicker || attachedPhoto ? 'btn-primary' : 'btn-soft'}"
            id="btn-dm-photo-toggle"
            title="Прикрепить фото"
            style="padding: 7px 9px; font-size: 13px; flex-shrink: 0;"
            ${isBusy ? 'disabled' : ''}
          >
            📷
          </button>
          <input type="text" class="form-input" id="dm-reply-${dm.id}" data-dm-reply-input="${dm.id}" autocomplete="off" spellcheck="false" placeholder="${hasOrder && dm.order.done ? 'Спросить как букет, поблагодарить...' : 'Напиши клиенту в Direct...'}" style="padding: 7px 10px; font-size: 12.5px; flex:1; min-width:0;" ${isBusy ? 'disabled' : ''} />
          <button class="btn btn-primary" data-reply-dm="${dm.id}" ${isBusy ? 'disabled' : ''} style="padding: 8px 12px; font-size: 12.5px; flex-shrink:0;">➤</button>
        </div>
      `
      }
    </div>
  `;

  const threadEl = body.querySelector('.dm-thread');
  if (threadEl) threadEl.scrollTop = threadEl.scrollHeight;

  document.getElementById('btn-dm-back')?.addEventListener('click', () => {
    openedDmId = null;
    showDmPhotoPicker = false;
    selectedDmPhotoId = null;
    showDmRejectMenu = false;
    refresh();
  });

  document.getElementById('btn-dm-retry-ai')?.addEventListener('click', () => {
    const fn = failedDmRetries[dm.id];
    if (fn) fn();
  });

  document.getElementById('btn-dm-block')?.addEventListener('click', () => {
    dm.blockedByPlayer = true;
    if (dm.order && !dm.order.done) {
      dm.order.accepted = false;
      dm.order.rejected = true;
      gameState.preorders = gameState.preorders.filter((p) => p.dmId !== dm.id);
      gameState.deliveries = (gameState.deliveries || []).filter((d) => d.dmId !== dm.id || d.status !== 'accepted');
    }
    if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
    dm.thread.push({ sender: 'system', text: '🚫 Вы заблокировали этого пользователя.' });
    saveState();
    onHudUpdate();
    showToast(`Пользователь ${dm.senderName} заблокирован`);
    refresh();
  });

  document.getElementById('btn-dm-unblock')?.addEventListener('click', () => {
    dm.blockedByPlayer = false;
    if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
    dm.thread.push({ sender: 'system', text: '🔓 Вы разблокировали этого пользователя.' });
    saveState();
    showToast(`Пользователь ${dm.senderName} разблокирован`);
    refresh();
  });

  document.getElementById('btn-dm-photo-toggle')?.addEventListener('click', () => {
    showDmPhotoPicker = !showDmPhotoPicker;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-dm-close-photos')?.addEventListener('click', () => {
    showDmPhotoPicker = false;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh);
  });

  body.querySelectorAll('[data-pick-dm-photo]').forEach((el) => {
    el.addEventListener('click', () => {
      selectedDmPhotoId = el.dataset.pickDmPhoto;
      showDmPhotoPicker = false;
      renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh);
    });
  });

  document.getElementById('btn-dm-clear-photo')?.addEventListener('click', () => {
    selectedDmPhotoId = null;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-dm-accept-order')?.addEventListener('click', () => {
    handleDirectAcceptOrder(dm.id, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-dm-toggle-reject')?.addEventListener('click', () => {
    showDmRejectMenu = !showDmRejectMenu;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-dm-close-reject')?.addEventListener('click', () => {
    showDmRejectMenu = false;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh);
  });

  body.querySelectorAll('[data-dm-reject-tpl]').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleDirectRejectOrder(dm.id, btn.dataset.dmRejectTpl, false, body, onHudUpdate, showToast, refresh);
    });
  });

  document.getElementById('btn-dm-reject-custom')?.addEventListener('click', () => {
    const reason = document.getElementById('dm-reject-custom-input')?.value.trim();
    if (!reason) {
      showToast('Напиши причину или выбери готовый вариант');
      return;
    }
    handleDirectRejectOrder(dm.id, reason, false, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-dm-reject-silent')?.addEventListener('click', () => {
    handleDirectRejectOrder(dm.id, 'К сожалению, не сможем взять заказ', true, body, onHudUpdate, showToast, refresh);
  });

  body.querySelectorAll('[data-reply-dm]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(`dm-reply-${dm.id}`);
      const text = input?.value.trim() || '';
      const photo = selectedDmPhotoId
        ? (gameState.savedPhotos || []).find((p) => p.id === selectedDmPhotoId) || null
        : null;
      if (!text && !photo) return;
      handleDirectReply(dm.id, text, body, onHudUpdate, showToast, photo, refresh);
    });
  });

  body.querySelectorAll('[data-dm-reply-input]').forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !busyDmId) {
        const text = input.value.trim() || '';
        const photo = selectedDmPhotoId
          ? (gameState.savedPhotos || []).find((p) => p.id === selectedDmPhotoId) || null
          : null;
        if (!text && !photo) return;
        handleDirectReply(dm.id, text, body, onHudUpdate, showToast, photo, refresh);
      }
    });
  });
}

function renderEmployeeDirectChat(dm, body, onHudUpdate, showToast, refresh) {
  const emp = (gameState.employees || []).find((e) => e.id === dm.employeeId);
  const isBusy = busyDmId === dm.id;
  const hasRetry = Boolean(failedDmRetries[dm.id] && !isBusy);
  const activeIssue = (gameState.deliveries || []).find(
    (d) => d.courierId === dm.employeeId && d.status === 'issue_waiting'
  );
  const isAssistant = emp?.roleId === 'assistant';
  const activeTask = isAssistant
    ? (gameState.floristTasks || []).find((t) => t.employeeId === emp.id && t.status === 'in_progress')
    : null;

  const threadList = Array.isArray(dm.thread) && dm.thread.length
    ? dm.thread
    : [{ sender: 'client', text: dm.text }];

  const threadHtml = threadList
    .map(
      (m) => `
      <div class="dm-msg ${m.sender}">
        <span>${escapeHtml(m.text)}</span>
      </div>
    `
    )
    .join('');

  const optionsHtml = Object.values(FLOWERS_CATALOG)
    .map((f) => `<option value="${f.id}">${escapeHtml(f.name)} (${f.wholesalePrice} ₽/шт)</option>`)
    .join('');

  const floristTaskHtml =
    isAssistant && showFloristTaskPanel
      ? `
      <div class="team-task-panel">
        <div class="row-between">
          <strong style="font-size:11.5px;">🌷 Поручение флористу-помощнику</strong>
          <button class="btn btn-soft" id="btn-close-florist-tasks" style="padding:2px 6px; font-size:10.5px;">✕</button>
        </div>
        <div style="display:flex; gap:5px; align-items:center;">
          <select class="form-select" id="dm-florist-flower" style="padding:5px 7px; font-size:11px; flex:1;">
            ${optionsHtml}
          </select>
          <select class="form-select" id="dm-florist-qty" style="padding:5px 7px; font-size:11px; width:74px;">
            <option value="5">5 шт</option>
            <option value="10" selected>10 шт</option>
            <option value="15">15 шт</option>
            <option value="20">20 шт</option>
            <option value="30">30 шт</option>
          </select>
          <button class="btn btn-sage" id="btn-dm-florist-buy" style="padding:5px 8px; font-size:11px;" ${activeTask ? 'disabled' : ''}>🛒 Купить</button>
        </div>
        <button class="btn btn-soft" id="btn-dm-florist-bouquet" style="padding:6px 9px; font-size:11.5px;" ${isShopClosedNow() || activeTask ? 'disabled' : ''}>
          💐 Собрать базовый букет на витрину
        </button>
      </div>
    `
      : '';

  const waitingDelivs = !isAssistant && emp
    ? (gameState.deliveries || []).filter((d) => d.day === gameState.day && d.status === 'accepted')
    : [];
  const readyCount = (gameState.readyBouquets || []).length;

  body.innerHTML = `
    <div class="dm-chat-topbar">
      <button class="btn btn-soft" id="btn-dm-back" style="padding:5px 9px; font-size:11.5px;">← Чаты</button>
      <div style="flex:1; min-width:0; text-align:center;">
        <strong style="font-size:13px;">${emp?.roleIcon || '👤'} ${escapeHtml(emp?.name || dm.senderName)}</strong>
      </div>
      <span class="badge ${activeIssue ? 'badge-warn' : 'badge-ok'}">${activeIssue ? '⚠️ Форс-мажор' : emp?.roleName || 'Команда'}</span>
    </div>

    <div class="dm-card">
      ${
        activeIssue
          ? `
        <div class="dm-order-banner cancelled">
          ⚠️ <strong>Курьер ждёт ответа по доставке:</strong><br/>
          📍 ${escapeHtml(activeIssue.address)} • ${escapeHtml(activeIssue.issueTitle || 'Проблема в пути')}<br/>
          <span class="muted-text" style="font-size:11px;">Напиши курьеру ниже, как ему поступить!</span>
        </div>
      `
          : ''
      }

      ${
        isAssistant
          ? `
        <div class="row-between">
          <span class="muted-text" style="font-size:11px;">${activeTask ? `🛒 Едет за «${escapeHtml(activeTask.flowerName)}»` : 'Можно написать «Купи 20 белых роз» прямо в чат'}</span>
          <button class="btn btn-sage" id="btn-toggle-florist-tasks" style="padding:4px 9px; font-size:11px;">
            🌷 Задания
          </button>
        </div>
      `
          : ''
      }

      ${
        waitingDelivs.length
          ? `
        <div class="team-task-panel">
          <strong style="font-size:11.5px;">🚚 Ожидают доставки (${waitingDelivs.length}) • Букетов на витрине: ${readyCount}</strong>
          ${waitingDelivs
            .map(
              (d) => `
            <div class="row-between" style="font-size:11px; gap:6px;">
              <span style="flex:1; min-width:0;">📍 ${escapeHtml(d.address)} (к ${d.dueTimeLabel})</span>
              <button class="btn btn-sage" data-dm-courier-send="${d.id}" style="padding:4px 8px; font-size:10.5px;" ${readyCount === 0 ? 'disabled' : ''}>
                📦 Забрать и поехать
              </button>
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }

      ${floristTaskHtml}

      <div class="dm-thread" style="max-height: 250px; overflow-y: auto;">
        ${threadHtml}
        ${isBusy ? `<div class="dm-msg system">💬 ${escapeHtml(emp?.name || 'Сотрудник')} печатает...</div>` : ''}
      </div>

      ${hasRetry ? `<button class="btn btn-soft" id="btn-dm-retry-ai" style="padding:7px; font-size:12px;">🔄 Повторить запрос ИИ</button>` : ''}

      ${
        emp
          ? `
        <div class="row-between" style="gap: 5px;">
          <input type="text" class="form-input" id="dm-emp-reply-${dm.id}" autocomplete="off" spellcheck="false" placeholder="${activeIssue ? 'Напиши решение для курьера...' : isAssistant ? 'Поболтать или «Купи 20 белых роз»...' : 'Напиши сотруднику...'}" style="padding: 7px 10px; font-size: 12.5px; flex:1; min-width:0;" ${isBusy ? 'disabled' : ''} />
          <button class="btn btn-primary" id="btn-send-emp-dm" ${isBusy ? 'disabled' : ''} style="padding: 8px 12px; font-size: 12.5px; flex-shrink:0;">➤</button>
        </div>
      `
          : `<div class="dm-blocked-banner">Этот сотрудник больше не работает в лавке.</div>`
      }
    </div>
  `;

  const threadEl = body.querySelector('.dm-thread');
  if (threadEl) threadEl.scrollTop = threadEl.scrollHeight;

  document.getElementById('btn-dm-back')?.addEventListener('click', () => {
    openedDmId = null;
    showFloristTaskPanel = false;
    refresh();
  });

  document.getElementById('btn-dm-retry-ai')?.addEventListener('click', () => {
    const fn = failedDmRetries[dm.id];
    if (fn) fn();
  });

  document.getElementById('btn-toggle-florist-tasks')?.addEventListener('click', () => {
    showFloristTaskPanel = !showFloristTaskPanel;
    renderEmployeeDirectChat(dm, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-close-florist-tasks')?.addEventListener('click', () => {
    showFloristTaskPanel = false;
    renderEmployeeDirectChat(dm, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-dm-florist-buy')?.addEventListener('click', () => {
    const typeId = document.getElementById('dm-florist-flower')?.value;
    const qty = Number(document.getElementById('dm-florist-qty')?.value) || 10;
    if (typeId && emp) {
      dispatchFloristPurchaseFromDm(dm, emp, typeId, qty, onHudUpdate, showToast, refresh);
    }
  });

  document.getElementById('btn-dm-florist-bouquet')?.addEventListener('click', async () => {
    if (!emp || isBusy) return;
    await assembleBasicBouquetFromDm(dm, emp, body, onHudUpdate, showToast, refresh);
  });

  body.querySelectorAll('[data-dm-courier-send]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!emp) return;
      dispatchCourierDeliveryFromDm(dm, emp, btn.dataset.dmCourierSend, onHudUpdate, showToast, refresh);
    });
  });

  const sendMsg = () => {
    const input = document.getElementById(`dm-emp-reply-${dm.id}`);
    const text = input?.value.trim();
    if (!text || isBusy || !emp) return;
    handleEmployeeDmMessage(dm.id, emp, activeIssue, text, body, onHudUpdate, showToast, refresh, false);
  };

  document.getElementById('btn-send-emp-dm')?.addEventListener('click', sendMsg);
  document.getElementById(`dm-emp-reply-${dm.id}`)?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isBusy) sendMsg();
  });
}

function dispatchCourierDeliveryFromDm(dm, emp, delivId, onHudUpdate, showToast, refresh, playerChatText = null) {
  const deliv = (gameState.deliveries || []).find((d) => d.id === delivId && d.status === 'accepted');
  const bouquet = (gameState.readyBouquets || [])[0];
  if (!deliv || !bouquet) {
    showToast(!deliv ? 'Нет принятой доставки!' : 'На витрине нет готового букета — собери на Столе сборки!');
    return false;
  }

  gameState.readyBouquets = gameState.readyBouquets.filter((b) => b.id !== bouquet.id);
  deliv.status = 'in_transit';
  deliv.courierId = emp.id;
  deliv.courierName = emp.name;
  deliv.bouquetSummary = bouquet.summary;
  deliv.remainingMin = emp.hasCar ? 24 : 36;
  deliv.nextTickRealMs = Date.now() + 18000;

  if (!Array.isArray(dm.thread)) dm.thread = [];
  dm.thread.push({
    sender: 'player',
    text: playerChatText || `📦 Возьми готовый букет с витрины (${bouquet.summary}) и отвези по адресу ${deliv.address}!`
  });
  dm.thread.push({
    sender: 'client',
    text: `Уже забрал(а) «${bouquet.summary}» и выезжаю по адресу ${deliv.address}! Как буду на месте — отпишусь сюда 🚚`
  });
  playPaperSound();
  saveState();
  onHudUpdate();
  showToast(`🚚 ${emp.name} взял(а) букет и выехал(а) на ${deliv.address}!`);
  refresh();
  return true;
}

function dispatchFloristPurchaseFromDm(dm, emp, typeId, qty, onHudUpdate, showToast, refresh) {
  const meta = FLOWERS_CATALOG[typeId];
  if (!meta) return;

  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const priceMult = getHolidayForDate(curDate) ? 2 : 1;
  const discount = qty >= 10 ? 0.92 : 1;
  const thermalFee = gameState.weather === 'frost' ? 100 : 0;
  const cost = Math.round(meta.wholesalePrice * qty * discount) * priceMult + thermalFee;

  if (gameState.money < cost) {
    showToast(`Не хватает денег на закупку «${meta.name}» (${qty} шт. = ${cost} ₽)!`);
    return;
  }

  gameState.money -= cost;
  gameState.totalSpent += cost;
  if (!Array.isArray(gameState.floristTasks)) gameState.floristTasks = [];
  gameState.floristTasks.push({
    id: 'ftask_' + Date.now(),
    employeeId: emp.id,
    employeeName: emp.name,
    typeId: meta.id,
    flowerName: meta.name,
    qty,
    cost,
    readyRealMs: Date.now() + 20000 + Math.floor(Math.random() * 12000),
    status: 'in_progress'
  });

  if (!Array.isArray(dm.thread)) dm.thread = [];
  dm.thread.push({ sender: 'player', text: `🛒 Купи ${qty} шт. «${meta.name}» на оптовой базе.` });
  dm.thread.push({
    sender: 'client',
    text: `Принял задание! Еду к оптовику за ${qty} шт. «${meta.name}» (${cost} ₽ списано), скоро привезу!`
  });
  showFloristTaskPanel = false;
  saveState();
  onHudUpdate();
  showToast(`🛒 ${emp.name} выехал(а) за цветами (-${cost} ₽)`);
  refresh();
}

async function assembleBasicBouquetFromDm(dm, emp, body, onHudUpdate, showToast, refresh) {
  const availableVases = (gameState.inventory || []).filter((v) => v.qty > 0);
  const totalQty = availableVases.reduce((sum, v) => sum + v.qty, 0);
  if (totalQty < 3) {
    showToast('Для букета нужно хотя бы 3 стебля в вазах!');
    return;
  }

  busyDmId = dm.id;
  renderEmployeeDirectChat(dm, body, onHudUpdate, showToast, refresh);

  try {
    const targetCount = Math.min(totalQty, 3 + Math.floor(Math.random() * 3));
    const pickedStems = [];
    const sorted = [...availableVases].sort((a, b) => b.qty - a.qty);

    for (let i = 0; i < targetCount; i++) {
      const vase = sorted.find((v) => v.qty > 0);
      if (!vase) break;
      vase.qty -= 1;
      const meta = FLOWERS_CATALOG[vase.typeId];
      pickedStems.push({
        id: 'stem_ai_' + Date.now() + '_' + i,
        typeId: vase.typeId,
        price: vase.discounted ? Math.round(meta.price * 0.6) : meta.price,
        freshness: vase.freshness,
        discounted: vase.discounted,
        x: 280 + (i - Math.floor(targetCount / 2)) * 28,
        y: 235 + (i % 2) * 16,
        angle: (i - Math.floor(targetCount / 2)) * 0.16,
        trimmed: true
      });
    }
    gameState.inventory = gameState.inventory.filter((v) => v.qty > 0);

    const wrap = pickRandom(WRAPPINGS.filter((w) => ['craft', 'pink_film', 'sage_paper', 'cream_paper'].includes(w.id)));
    const ribbon = pickRandom(RIBBONS.filter((r) => ['satin_rose', 'sage', 'cream', 'twine'].includes(r.id)));
    const stemsPrice = pickedStems.reduce((sum, s) => sum + s.price + 15, 0);
    const totalPrice = stemsPrice + wrap.price + ribbon.price + (pickedStems.length >= 3 ? 50 : 0);

    const counts = {};
    pickedStems.forEach((s) => {
      const n = FLOWERS_CATALOG[s.typeId]?.shortName || 'Цветок';
      counts[n] = (counts[n] || 0) + 1;
    });
    const summary = Object.entries(counts).map(([k, v]) => `${k} (${v})`).join(', ') + ` • ${wrap.name}`;

    const c = document.createElement('canvas');
    c.width = 560;
    c.height = 540;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#F7EFE5';
    ctx.fillRect(0, 0, 560, 540);
    ctx.fillStyle = '#FFFDF9';
    ctx.beginPath();
    ctx.arc(280, 260, 210, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = wrap.color;
    ctx.beginPath();
    ctx.moveTo(145, 225);
    ctx.lineTo(280, 165);
    ctx.lineTo(415, 225);
    ctx.lineTo(318, 465);
    ctx.lineTo(242, 465);
    ctx.closePath();
    ctx.fill();

    const uniqueIds = Array.from(new Set(pickedStems.map((s) => s.typeId)));
    const imgs = {};
    await Promise.all(
      uniqueIds.map(
        (id) =>
          new Promise((res) => {
            const img = new Image();
            img.onload = () => { imgs[id] = img; res(); };
            img.onerror = () => res();
            img.src = getFlowerSvgDataUrl(id);
          })
      )
    );
    pickedStems.forEach((s) => {
      const img = imgs[s.typeId];
      if (!img) return;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.drawImage(img, -74, -120, 148, 175);
      ctx.restore();
    });
    ctx.fillStyle = wrap.accent;
    ctx.beginPath();
    ctx.moveTo(165, 275);
    ctx.lineTo(280, 355);
    ctx.lineTo(315, 465);
    ctx.lineTo(245, 465);
    ctx.closePath();
    ctx.fill();
    if (ribbon.id !== 'none') {
      ctx.fillStyle = ribbon.color;
      ctx.fillRect(242, 350, 76, 16);
    }
    const thumbnail = c.toDataURL('image/jpeg', 0.78);

    gameState.readyBouquets.unshift({
      id: 'bouquet_emp_' + Date.now(),
      price: totalPrice,
      stemsCount: pickedStems.length,
      summary,
      thumbnail,
      items: pickedStems.map((s) => s.typeId),
      stems: pickedStems,
      wrappingId: wrap.id,
      ribbonId: ribbon.id
    });

    if (!Array.isArray(dm.thread)) dm.thread = [];
    dm.thread.push({ sender: 'player', text: '💐 Собери базовый букет на витрину.' });
    dm.thread.push({
      sender: 'client',
      text: `Готово! Собрал(а) красивый базовый букет (${summary}) и выставил(а) на витрину за ${totalPrice} ₽ 🌸`
    });
    showFloristTaskPanel = false;
    playPaperSound();
    addGameMinutes(15);
    onHudUpdate();
    showToast(`💐 ${emp.name} поставил(а) букет на витрину (${totalPrice} ₽)!`);
  } finally {
    busyDmId = null;
    refresh();
  }
}

async function handleEmployeeDmMessage(dmId, emp, activeIssue, text, body, onHudUpdate, showToast, refresh, isRetry = false) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || busyDmId) return;

  clearDmRetryErrors(dm);

  if (!isRetry) {
    const lower = text.toLowerCase();
    if (emp.roleId === 'assistant' && !activeIssue && (lower.includes('купи') || lower.includes('закупи') || lower.includes('привез'))) {
      const found = detectMentionedFlowers(text);
      const qtyMatch = text.match(/(\d{1,2})/);
      if (found.length && qtyMatch) {
        const qty = Math.max(1, Math.min(50, Number(qtyMatch[1])));
        dispatchFloristPurchaseFromDm(dm, emp, found[0], qty, onHudUpdate, showToast, refresh);
        return;
      }
    }

    if (emp.roleId === 'courier' && !activeIssue && (lower.includes('отвези') || lower.includes('достав') || lower.includes('вези') || lower.includes('поезжай') || lower.includes('бери букет'))) {
      const pendingDeliv = (gameState.deliveries || []).find((d) => d.day === gameState.day && d.status === 'accepted');
      if (pendingDeliv && (gameState.readyBouquets || []).length > 0) {
        dispatchCourierDeliveryFromDm(dm, emp, pendingDeliv.id, onHudUpdate, showToast, refresh, text);
        return;
      }
    }

    if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
    dm.thread.push({ sender: 'player', text });
  }

  dm.read = true;
  busyDmId = dmId;
  renderEmployeeDirectChat(dm, body, onHudUpdate, showToast, refresh);

  try {
    if (activeIssue) {
      const res = await resolveCourierForceMajeureReply(dm, emp, activeIssue, text);
      dm.thread.push({ sender: 'client', text: res.reply });
      activeIssue.status = 'in_transit';
      activeIssue.issueResolved = true;
      activeIssue.remainingMin = Math.max(8, (activeIssue.remainingMin || 10) + res.extraMinutes);
      activeIssue.tipBonus = (activeIssue.tipBonus || 0) + (res.tipBonus || 0);
      activeIssue.resolutionNote = res.resolutionNote;
      dm.thread.push({
        sender: 'system',
        text: `🚚 Курьер продолжил доставку (ориентировочно ещё ${activeIssue.remainingMin} мин).`
      });
      showToast(`🚚 ${emp.name} получил(а) инструкцию и едет дальше!`);
    } else {
      const reply = await generateEmployeeChatReply(dm, emp, text);
      dm.thread.push({ sender: 'client', text: reply });
      gameState.mood = Math.min(100, gameState.mood + 1);
      onHudUpdate();
    }
    saveState();
  } catch (err) {
    dm.thread.push({ sender: 'system', text: `⚠️ Ошибка ИИ: ${err.message}`, isRetryError: true });
    failedDmRetries[dm.id] = () => handleEmployeeDmMessage(dmId, emp, activeIssue, text, body, onHudUpdate, showToast, refresh, true);
    showToast('⚠️ Ошибка ответа ИИ: ' + err.message);
  } finally {
    busyDmId = null;
    refresh();
  }
}

function renderJobInterviewChat(dm, body, onHudUpdate, showToast, refresh) {
  const app = dm.jobApplication;
  const isBusy = busyDmId === dm.id;
  const hasRetry = Boolean(failedDmRetries[dm.id] && !isBusy);
  const isFinished = app.status === 'hired' || app.status === 'rejected' || dm.blockedByClient;

  const threadList = Array.isArray(dm.thread) && dm.thread.length
    ? dm.thread
    : [{ sender: 'client', text: dm.text }];

  const threadHtml = threadList
    .map(
      (m) => `
      <div class="dm-msg ${m.sender}">
        <span>${escapeHtml(m.text)}</span>
      </div>
    `
    )
    .join('');

  let bannerClass = '';
  let statusBadge = `<span class="badge badge-ok">Собеседование</span>`;
  if (app.status === 'hired') {
    bannerClass = 'hired';
    statusBadge = `<span class="badge badge-ok">В команде ✓</span>`;
  } else if (app.status === 'rejected' || dm.blockedByClient) {
    bannerClass = 'rejected';
    statusBadge = `<span class="badge badge-warn">Отказ</span>`;
  }

  const lowerBargain = Math.max(450, Math.round((app.agreedSalary - 150) / 50) * 50);
  const quickQuestions = [
    'Расскажите о своём опыте',
    'Подойдёт этот график?',
    app.roleId === 'courier' ? 'Есть свой транспорт?' : 'Умеете ухаживать за цветами?',
    `Договоримся за ${lowerBargain} ₽/см.?`
  ];

  body.innerHTML = `
    <div class="dm-chat-topbar">
      <button class="btn btn-soft" id="btn-dm-back" style="padding:5px 9px; font-size:11.5px;">← Чаты</button>
      <div style="flex:1; min-width:0; text-align:center;">
        <strong style="font-size:13px;">${app.roleIcon || '💼'} ${escapeHtml(app.candidateName)}, ${app.age}</strong>
      </div>
      ${statusBadge}
    </div>

    <div class="dm-card">
      <div class="candidate-banner ${bannerClass}">
        <div class="row-between">
          <strong>${escapeHtml(app.roleName)} • ${escapeHtml(app.locationName)}</strong>
          <strong>${app.agreedSalary} ₽/см.</strong>
        </div>
        <div class="muted-text" style="font-size:11px;">${escapeHtml(app.bio)}</div>
        ${app.requirements ? `<div class="muted-text" style="font-size:10.5px;">📌 ${escapeHtml(app.requirements)}</div>` : ''}
        <div class="muted-text" style="font-size:10.5px;">🕒 ${escapeHtml(app.scheduleLabel)}${app.transport ? ` • ${app.hasCar ? '🚗' : '🚶'} ${escapeHtml(app.transport)}` : app.hasCar ? ' • 🚗 Своё авто' : ''}</div>
      </div>

      <div class="dm-thread" style="max-height: 225px; overflow-y: auto;">
        ${threadHtml}
        ${isBusy ? `<div class="dm-msg system">💬 ${escapeHtml(app.candidateName)} печатает...</div>` : ''}
      </div>

      ${hasRetry ? `<button class="btn btn-soft" id="btn-dm-retry-ai" style="padding:7px; font-size:12px;">🔄 Повторить запрос ИИ</button>` : ''}

      ${
        !isFinished
          ? `
        <div class="interview-chips">
          ${quickQuestions
            .map(
              (q) => `
            <button class="interview-chip" data-interview-q="${escapeAttr(q)}" ${isBusy ? 'disabled' : ''}>
              ${escapeHtml(q)}
            </button>
          `
            )
            .join('')}
        </div>

        <div class="dm-order-actions">
          <button class="btn btn-sage" id="btn-hire-candidate" ${isBusy ? 'disabled' : ''}>
            🤝 Принять на работу (${app.agreedSalary} ₽)
          </button>
          <button class="btn btn-danger" id="btn-reject-candidate" ${isBusy ? 'disabled' : ''}>
            🚫 Отказать
          </button>
        </div>

        <div class="row-between" style="gap: 5px;">
          <input type="text" class="form-input" id="dm-reply-${dm.id}" data-job-reply-input="${dm.id}" autocomplete="off" spellcheck="false" placeholder="Задай вопрос или поторгуйся по ставке..." style="padding: 7px 10px; font-size: 12px; flex:1; min-width:0;" ${isBusy ? 'disabled' : ''} />
          <button class="btn btn-primary" id="btn-send-job-reply" ${isBusy ? 'disabled' : ''} style="padding: 8px 12px; font-size: 12.5px; flex-shrink:0;">➤</button>
        </div>
      `
          : ''
      }
    </div>
  `;

  const threadEl = body.querySelector('.dm-thread');
  if (threadEl) threadEl.scrollTop = threadEl.scrollHeight;

  document.getElementById('btn-dm-back')?.addEventListener('click', () => {
    openedDmId = null;
    refresh();
  });

  document.getElementById('btn-dm-retry-ai')?.addEventListener('click', () => {
    const fn = failedDmRetries[dm.id];
    if (fn) fn();
  });

  body.querySelectorAll('[data-interview-q]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isBusy) return;
      handleInterviewMessage(dm.id, btn.dataset.interviewQ, body, onHudUpdate, showToast, refresh);
    });
  });

  document.getElementById('btn-send-job-reply')?.addEventListener('click', () => {
    const input = document.getElementById(`dm-reply-${dm.id}`);
    const text = input?.value.trim();
    if (text && !isBusy) handleInterviewMessage(dm.id, text, body, onHudUpdate, showToast, refresh);
  });

  document.querySelector(`[data-job-reply-input="${dm.id}"]`)?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isBusy) {
      const text = e.currentTarget.value.trim();
      if (text) handleInterviewMessage(dm.id, text, body, onHudUpdate, showToast, refresh);
    }
  });

  document.getElementById('btn-hire-candidate')?.addEventListener('click', () => {
    handleHireCandidate(dm.id, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-reject-candidate')?.addEventListener('click', () => {
    handleRejectCandidate(dm.id, body, onHudUpdate, showToast, refresh);
  });
}

async function handleInterviewMessage(dmId, text, body, onHudUpdate, showToast, refresh, isRetry = false) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || !dm.jobApplication || busyDmId) return;

  clearDmRetryErrors(dm);
  if (!isRetry) {
    if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
    dm.thread.push({ sender: 'player', text });
  }
  dm.read = true;
  busyDmId = dmId;
  renderJobInterviewChat(dm, body, onHudUpdate, showToast, refresh);

  try {
    const res = await generateCandidateInterviewReply(dm, text);
    dm.thread.push({ sender: 'client', text: res.reply });
    dm.jobApplication.agreedSalary = res.agreedSalary;
    if (res.blockedByClient) {
      dm.blockedByClient = true;
      dm.jobApplication.status = 'rejected';
      showToast(`⛔ ${dm.jobApplication.candidateName} ушёл со собеседования!`);
    }
    saveState();
  } catch (err) {
    dm.thread.push({ sender: 'system', text: `⚠️ Ошибка ИИ: ${err.message}`, isRetryError: true });
    failedDmRetries[dm.id] = () => handleInterviewMessage(dmId, text, body, onHudUpdate, showToast, refresh, true);
    showToast('⚠️ Ошибка ИИ: ' + err.message);
  } finally {
    busyDmId = null;
    refresh();
  }
}

async function handleHireCandidate(dmId, body, onHudUpdate, showToast, refresh) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  const app = dm?.jobApplication;
  if (!dm || !app || busyDmId || app.status !== 'interviewing') return;

  busyDmId = dmId;
  app.status = 'hired';
  const finalSalary = Number(app.agreedSalary) || Number(app.offeredSalary) || 1200;

  const empId = 'emp_' + Date.now();
  if (!Array.isArray(gameState.employees)) gameState.employees = [];
  gameState.employees.push({
    id: empId,
    candidateId: app.candidateId,
    name: app.candidateName,
    nick: app.nick,
    age: app.age,
    gender: app.gender,
    roleId: app.roleId,
    roleName: app.roleName,
    roleIcon: app.roleIcon,
    salary: finalSalary,
    scheduleId: app.scheduleId,
    scheduleLabel: app.scheduleLabel,
    locationId: app.locationId,
    locationName: app.locationName,
    hasCar: Boolean(app.hasCar),
    transport: app.transport || '',
    requirements: app.requirements || '',
    bio: app.bio || '',
    quirk: app.quirk || '',
    branchId: null,
    hiredDay: gameState.day,
    mood: 90
  });

  const jobObj = (gameState.jobPostings || []).find((j) => j.id === app.jobId);
  if (jobObj) jobObj.status = 'filled';

  if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
  dm.thread.push({
    sender: 'player',
    text: `🤝 Добро пожаловать в команду! Договорились: «${app.roleName}» в «${app.locationName}» за ${finalSalary} ₽/смену.`
  });

  renderJobInterviewChat(dm, body, onHudUpdate, showToast, refresh);

  try {
    const reply = await generateCandidateHireReaction(dm, true, finalSalary);
    dm.thread.push({ sender: 'client', text: reply });
    dm.thread.push({
      sender: 'system',
      text: `✅ ${app.candidateName} принят${app.gender === 'female' ? 'а' : ''} на работу (${finalSalary} ₽/см.)!`
    });

    gameState.directMessages.unshift({
      id: 'dm_emp_' + empId,
      senderName: `${app.candidateName} (${app.roleName})`,
      kind: 'employee',
      employeeId: empId,
      text: reply,
      read: true,
      blockedByPlayer: false,
      blockedByClient: false,
      day: gameState.day,
      createdTimeLabel: dm.createdTimeLabel || '09:00',
      thread: [{ sender: 'client', text: reply }],
      order: null
    });

    gameState.mood = Math.min(100, gameState.mood + 4);
    playCoinSound();
    saveState();
    onHudUpdate();
    showToast(`🤝 ${app.candidateName} теперь в вашей команде!`);
  } finally {
    busyDmId = null;
    refresh();
  }
}

async function handleRejectCandidate(dmId, body, onHudUpdate, showToast, refresh) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  const app = dm?.jobApplication;
  if (!dm || !app || busyDmId || app.status !== 'interviewing') return;

  busyDmId = dmId;
  app.status = 'rejected';
  if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
  dm.thread.push({
    sender: 'player',
    text: 'Спасибо за отклик! К сожалению, пока мы не готовы сделать вам предложение о работе.'
  });

  const jobObj = (gameState.jobPostings || []).find((j) => j.id === app.jobId);
  if (jobObj && jobObj.status === 'open') {
    jobObj.nextResponseRealMs = Date.now() + 25000 + Math.floor(Math.random() * 45000);
  }

  renderJobInterviewChat(dm, body, onHudUpdate, showToast, refresh);

  try {
    const reply = await generateCandidateHireReaction(dm, false, app.agreedSalary);
    dm.thread.push({ sender: 'client', text: reply });
    dm.thread.push({ sender: 'system', text: '❌ Кандидат отклонён. Новый соискатель напишет позже.' });
    saveState();
    showToast(`Собеседование с ${app.candidateName} завершено`);
  } finally {
    busyDmId = null;
    refresh();
  }
}

function syncAgreedPreorder(dm, orderData) {
  const isDelivery = Boolean(dm.order?.isDelivery || orderData?.isDelivery);
  dm.kind = isDelivery ? 'delivery' : 'preorder';
  dm.order = {
    ...dm.order,
    ...orderData,
    isDelivery,
    accepted: true,
    rejected: false,
    done: false
  };

  if (isDelivery) {
    if (!Array.isArray(gameState.deliveries)) gameState.deliveries = [];
    const existing = gameState.deliveries.find(
      (d) => d.dmId === dm.id && d.status !== 'cancelled' && d.status !== 'delivered'
    );
    if (!existing) {
      gameState.deliveries.push({
        id: 'deliv_' + dm.id + '_' + Date.now(),
        dmId: dm.id,
        senderName: dm.senderName,
        typeId: dm.order.typeId,
        flowerName: dm.order.flowerName,
        qty: dm.order.qty,
        reward: dm.order.reward,
        dueMinutes: dm.order.dueMinutes,
        dueTimeLabel: dm.order.dueTimeLabel,
        address: dm.order.address || 'ул. Садовая, д. 10',
        recipientNote: dm.order.recipientNote || '',
        accessoryId: dm.order.accessoryId || null,
        accessoryName: dm.order.accessoryName || null,
        day: gameState.day,
        status: 'accepted',
        courierId: null,
        courierName: '',
        bouquetSummary: '',
        remainingMin: 0,
        issueTriggered: false,
        issueResolved: false,
        issueTitle: '',
        tipBonus: 0,
        resolutionNote: ''
      });
    }
    return;
  }

  if (!Array.isArray(gameState.preorders)) gameState.preorders = [];
  const existing = gameState.preorders.find(
    (p) => p.dmId === dm.id && (p.status === 'waiting' || p.status === 'in_shop')
  );
  if (existing) {
    existing.typeId = orderData.typeId;
    existing.flowerName = orderData.flowerName;
    existing.qty = orderData.qty;
    existing.reward = orderData.reward;
    existing.dueMinutes = orderData.dueMinutes;
    existing.dueTimeLabel = orderData.dueTimeLabel;
    existing.accessoryId = orderData.accessoryId || null;
    existing.accessoryName = orderData.accessoryName || null;
  } else {
    gameState.preorders.push({
      id: 'pre_' + dm.id + '_' + Date.now(),
      dmId: dm.id,
      senderName: dm.senderName,
      typeId: orderData.typeId,
      flowerName: orderData.flowerName,
      qty: orderData.qty,
      reward: orderData.reward,
      dueMinutes: orderData.dueMinutes,
      dueTimeLabel: orderData.dueTimeLabel,
      accessoryId: orderData.accessoryId || null,
      accessoryName: orderData.accessoryName || null,
      day: gameState.day,
      status: 'waiting'
    });
  }
}

async function handleDirectAcceptOrder(dmId, body, onHudUpdate, showToast, refresh, isRetry = false) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || !dm.order || busyDmId || dm.blockedByClient || dm.blockedByPlayer) return;

  clearDmRetryErrors(dm);
  showDmRejectMenu = false;
  if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];

  const accPart = dm.order.accessoryName ? ` и «${dm.order.accessoryName}»` : '';
  const isDelivery = Boolean(dm.order.isDelivery);
  const playerMsg = isDelivery
    ? `🚚 Приняли вашу доставку! Подготовим ${dm.order.qty} шт. «${dm.order.flowerName}»${accPart} и отправим курьера по адресу ${dm.order.address} к ${dm.order.dueTimeLabel}! 🌸`
    : `✅ Приняли ваш заказ! Подготовим ${dm.order.qty} шт. «${dm.order.flowerName}»${accPart} к ${dm.order.dueTimeLabel}. Ждём вас! 🌸`;

  if (!isRetry) {
    syncAgreedPreorder(dm, dm.order);
    dm.thread.push({ sender: 'player', text: playerMsg });
    dm.thread.push({
      sender: 'system',
      text: isDelivery
        ? `🚚 Доставка принята (${dm.order.address} к ${dm.order.dueTimeLabel}, ${dm.order.reward} ₽). Соберите букет и передайте курьеру!`
        : `✅ Предзаказ подтверждён: визит к ${dm.order.dueTimeLabel} (${dm.order.reward} ₽).`
    });
  }

  dm.read = true;
  busyDmId = dmId;
  renderDirectApp(body, onHudUpdate, showToast, refresh);

  try {
    const res = await generateDirectFollowUp(dm, playerMsg, null);
    dm.thread.push({ sender: 'client', text: res.reply });
    gameState.mood = Math.min(100, gameState.mood + 2);
    saveState();
    onHudUpdate();
    showToast(isDelivery ? `🚚 Доставка для ${dm.senderName} принята!` : `🤝 Предзаказ принят на ${dm.order.dueTimeLabel}!`);
  } catch (err) {
    dm.thread.push({ sender: 'system', text: `⚠️ Ошибка ИИ: ${err.message}`, isRetryError: true });
    failedDmRetries[dm.id] = () => handleDirectAcceptOrder(dmId, body, onHudUpdate, showToast, refresh, true);
    showToast('⚠️ Ошибка ИИ: ' + err.message);
  } finally {
    busyDmId = null;
    refresh();
  }
}

async function handleDirectRejectOrder(dmId, reason, isSilent, body, onHudUpdate, showToast, refresh, isRetry = false) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || !dm.order || busyDmId || dm.blockedByClient || dm.blockedByPlayer) return;

  clearDmRetryErrors(dm);
  showDmRejectMenu = false;
  if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];

  const playerMsg = isSilent
    ? 'К сожалению, не сможем взять заказ.'
    : `К сожалению, не сможем взять заказ (${reason}).`;

  if (!isRetry) {
    dm.thread.push({ sender: 'player', text: playerMsg });
    dm.order.accepted = false;
    dm.order.rejected = true;
    gameState.preorders = gameState.preorders.filter((p) => !(p.dmId === dm.id && p.status !== 'done'));
    gameState.deliveries = (gameState.deliveries || []).filter((d) => !(d.dmId === dm.id && d.status === 'accepted'));
  }

  dm.read = true;
  busyDmId = dmId;
  renderDirectApp(body, onHudUpdate, showToast, refresh);

  try {
    const res = await generateDirectRejectionReply(dm, reason, isSilent);
    dm.thread.push({ sender: 'client', text: res.reply });

    if (res.raisedBudgetAmount > 0 && dm.order && !dm.order.budgetRaisedOnce) {
      dm.order.budgetRaisedOnce = true;
      dm.order.reward = Number(dm.order.reward || 500) + res.raisedBudgetAmount;
      dm.order.rejected = false;
      dm.thread.push({
        sender: 'system',
        text: `💡 Клиент один раз поднял бюджет на +${res.raisedBudgetAmount} ₽ (теперь: ${dm.order.reward} ₽).`
      });
      showToast(`💬 ${dm.senderName} предложил(а) доплатить до ${dm.order.reward} ₽!`);
    } else {
      dm.thread.push({ sender: 'system', text: '❌ Заказ отклонён.' });
      showToast(`❌ Заказ от ${dm.senderName} отклонён`);
    }

    gameState.mood = Math.max(10, Math.min(100, gameState.mood + (res.moodDelta || 0)));
    saveState();
    onHudUpdate();
  } catch (err) {
    dm.thread.push({ sender: 'system', text: `⚠️ Ошибка ИИ: ${err.message}`, isRetryError: true });
    failedDmRetries[dm.id] = () => handleDirectRejectOrder(dmId, reason, isSilent, body, onHudUpdate, showToast, refresh, true);
    showToast('⚠️ Ошибка ИИ: ' + err.message);
  } finally {
    busyDmId = null;
    refresh();
  }
}

async function handleDirectReply(dmId, text, body, onHudUpdate, showToast, attachedPhoto = null, refresh, isRetry = false) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || busyDmId || dm.blockedByClient || dm.blockedByPlayer) return;

  clearDmRetryErrors(dm);
  if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];

  const cleanText = String(text || '').trim();
  if (!isRetry) {
    dm.thread.push({
      sender: 'player',
      text: cleanText,
      photoUrl: attachedPhoto ? attachedPhoto.dataUrl : undefined,
      photoDesc: attachedPhoto ? attachedPhoto.description : undefined
    });
    if (cleanText) dm.replyText = cleanText;
  }

  dm.read = true;
  busyDmId = dmId;
  selectedDmPhotoId = null;
  showDmPhotoPicker = false;
  showDmRejectMenu = false;

  renderDirectApp(body, onHudUpdate, showToast, refresh);

  try {
    const res = await generateDirectFollowUp(dm, cleanText, attachedPhoto);
    dm.thread.push({ sender: 'client', text: res.reply });

    if (res.blockedByClient) {
      dm.blockedByClient = true;
      if (dm.order && !dm.order.done) {
        dm.order.accepted = false;
        dm.order.rejected = true;
        gameState.preorders = gameState.preorders.filter((p) => p.dmId !== dm.id);
        gameState.deliveries = (gameState.deliveries || []).filter((d) => d.dmId !== dm.id || d.status !== 'accepted');
      }
      gameState.followers = Math.max(0, gameState.followers - 1);
      gameState.mood = Math.max(10, gameState.mood - 5);
      showToast(`⛔ ${dm.senderName} заблокировал(а) вас за грубость!`);
    } else if (!dm.order && res.proposedOrder) {
      dm.kind = 'preorder';
      dm.order = {
        ...res.proposedOrder,
        accepted: false,
        rejected: false,
        done: false
      };
      showToast(`💐 ${dm.senderName} просит предзаказ — прими или откажи в чате!`);
    } else {
      showToast(`💬 ${dm.senderName} ответил(а) в Direct`);
    }

    if (!res.blockedByClient && !dm.rewardedFollowUp) {
      dm.rewardedFollowUp = true;
      gameState.mood = Math.max(0, Math.min(100, gameState.mood + (res.moodDelta || 2)));
      if ((cleanText.length >= 6 || attachedPhoto) && res.followerDelta > 0) {
        gameState.followers += res.followerDelta;
      }
    }

    saveState();
    onHudUpdate();
  } catch (err) {
    dm.thread.push({ sender: 'system', text: `⚠️ Ошибка ИИ: ${err.message}`, isRetryError: true });
    failedDmRetries[dm.id] = () => handleDirectReply(dmId, text, body, onHudUpdate, showToast, attachedPhoto, refresh, true);
    showToast('⚠️ Ошибка ответа ИИ: ' + err.message);
  } finally {
    busyDmId = null;
    refresh();
  }
}

function trimDirectMessages() {
  if (gameState.directMessages.length <= 16) return;
  const keepImportant = gameState.directMessages.filter(
    (m) =>
      m.pinned ||
      !m.read ||
      m.kind === 'employee' ||
      (m.order && m.order.accepted && !m.order.done) ||
      (m.jobApplication && m.jobApplication.status === 'interviewing')
  );
  const others = gameState.directMessages.filter(
    (m) =>
      !m.pinned &&
      m.read &&
      m.kind !== 'employee' &&
      !(m.order && m.order.accepted && !m.order.done) &&
      !(m.jobApplication && m.jobApplication.status === 'interviewing')
  );
  const combined = [...keepImportant, ...others];
  gameState.directMessages = combined.slice(0, Math.max(16, keepImportant.length));
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