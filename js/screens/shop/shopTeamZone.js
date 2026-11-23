/**
 * js/screens/shop/shopTeamZone.js
 * Компактная зона доставок курьером в торговом зале (общение и поручения — в Direct!)
 */

import { gameState, saveState } from '/js/state.js';
import { playPaperSound } from '/js/sound.js';

let pickingDeliveryId = null;

export function renderShopTeamZone() {
  const employees = Array.isArray(gameState.employees) ? gameState.employees : [];
  const activeDeliveries = (gameState.deliveries || []).filter(
    (d) => d.day === gameState.day && d.status !== 'delivered' && d.status !== 'cancelled'
  );

  if (!activeDeliveries.length && !employees.length) return '';

  if (!activeDeliveries.length) {
    const names = employees.map((e) => `${e.roleIcon || '👤'} ${escapeHtml(e.name)}`).join(', ');
    return `
      <div class="team-hall-card" style="padding:7px 10px;">
        <div class="row-between">
          <span style="font-size:11.5px; font-weight:700;">👥 Команда: ${names}</span>
          <span class="muted-text" style="font-size:10.5px;">Чат и задания в Direct</span>
        </div>
      </div>
    `;
  }

  const delivRowsHtml = activeDeliveries
    .map((d) => {
      const readyBouquets = gameState.readyBouquets || [];
      const isPicking = pickingDeliveryId === d.id;
      const hasCourier = employees.some((e) => e.roleId === 'courier');

      let actionHtml = '';
      if (d.status === 'accepted') {
        actionHtml = hasCourier
          ? `<button class="btn btn-primary" data-pick-deliv-bouquet="${d.id}" style="padding:5px 9px; font-size:11px;">📦 Передать курьеру</button>`
          : `<span class="badge badge-warn">Нужен курьер</span>`;
      } else if (d.status === 'issue_waiting') {
        actionHtml = `<span class="badge badge-warn">⚠️ Ответь в Direct!</span>`;
      } else {
        actionHtml = `<span class="badge badge-ok">🚚 В пути (${d.remainingMin} мин)</span>`;
      }

      const pickerHtml =
        isPicking && d.status === 'accepted'
          ? `
        <div class="team-task-panel">
          <div class="row-between">
            <strong style="font-size:11.5px;">Выбери букет с витрины для отправки:</strong>
            <button class="btn btn-soft" id="btn-close-deliv-pick" style="padding:2px 6px; font-size:10.5px;">✕</button>
          </div>
          ${
            readyBouquets.length
              ? readyBouquets
                  .map(
                    (b) => `
                  <div class="offer-item-row">
                    <img class="offer-thumb" src="${b.thumbnail}" alt="Букет" />
                    <div style="flex:1; min-width:0;">
                      <strong style="font-size:11.5px;">${b.price} ₽ (${b.stemsCount} шт.)</strong>
                      <div class="muted-text" style="font-size:10.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(b.summary)}</div>
                    </div>
                    <button class="btn btn-sage" data-send-deliv="${d.id}:${b.id}" style="padding:5px 8px; font-size:11px;">Отправить</button>
                  </div>
                `
                  )
                  .join('')
              : `<p class="muted-text" style="font-size:11px;">На витрине нет готовых букетов! Собери на Столе сборки или попроси флориста в Direct.</p>`
          }
        </div>
      `
          : '';

      return `
        <div class="delivery-hall-row">
          <div class="row-between">
            <div style="flex:1; min-width:0;">
              <strong style="font-size:12px;">🚚 ${escapeHtml(d.senderName)} • к ${d.dueTimeLabel}</strong>
              <div class="muted-text" style="font-size:11px;">
                ${d.qty} шт. «${escapeHtml(d.flowerName)}» • ${d.reward} ₽ • 📍 ${escapeHtml(d.address)}
              </div>
            </div>
            ${actionHtml}
          </div>
          ${pickerHtml}
        </div>
      `;
    })
    .join('');

  return `
    <div class="team-hall-card">
      <strong style="font-size:12px;">🚚 Доставки на дом (${activeDeliveries.length})</strong>
      ${delivRowsHtml}
    </div>
  `;
}

export function bindShopTeamEvents(container, onHudUpdate, showToast, renderShopMain) {
  container.querySelectorAll('[data-pick-deliv-bouquet]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dId = btn.dataset.pickDelivBouquet;
      pickingDeliveryId = pickingDeliveryId === dId ? null : dId;
      renderShopMain();
    });
  });

  document.getElementById('btn-close-deliv-pick')?.addEventListener('click', () => {
    pickingDeliveryId = null;
    renderShopMain();
  });

  container.querySelectorAll('[data-send-deliv]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [delivId, bouquetId] = btn.dataset.sendDeliv.split(':');
      sendBouquetWithCourier(delivId, bouquetId, onHudUpdate, showToast, renderShopMain);
    });
  });
}

function sendBouquetWithCourier(delivId, bouquetId, onHudUpdate, showToast, renderShopMain) {
  const deliv = (gameState.deliveries || []).find((d) => d.id === delivId);
  const bouquet = (gameState.readyBouquets || []).find((b) => b.id === bouquetId);
  const courier = (gameState.employees || []).find((e) => e.roleId === 'courier');
  if (!deliv || !bouquet || !courier) return;

  gameState.readyBouquets = gameState.readyBouquets.filter((b) => b.id !== bouquetId);
  deliv.status = 'in_transit';
  deliv.courierId = courier.id;
  deliv.courierName = courier.name;
  deliv.bouquetSummary = bouquet.summary;
  deliv.remainingMin = courier.hasCar ? 24 : 36;
  deliv.nextTickRealMs = Date.now() + 18000;
  pickingDeliveryId = null;

  playPaperSound();
  saveState();
  onHudUpdate();
  showToast(`🚚 ${courier.name} забрал(а) букет и выехал(а) на ${deliv.address}!`);
  renderShopMain();
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}