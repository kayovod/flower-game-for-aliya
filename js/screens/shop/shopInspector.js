/**
 * js/screens/shop/shopInspector.js
 * Модальное окно осмотра вазы: смена воды, уценка, списание и добавление в букет
 */

import { FLOWERS_CATALOG } from '/js/config.js';
import { getSingleFlowerWrappedSvg } from '/js/graphics/flowersSvg.js';

export function getActualFlowerPrice(item, meta) {
  return item.discounted ? Math.round(meta.price * 0.6) : meta.price;
}

export function renderInspectorModal(item) {
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