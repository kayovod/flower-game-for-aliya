/**
 * js/screens/phone/phoneDecor.js
 * Декор и антиквариат: завоз дня, полный каталог всех украшений и склад без ограничений
 */

import { DECOR_CATALOG } from '../../config.js';
import { gameState, saveState, ensureDailyRareDecor } from '../../state.js';
import { playCoinSound } from '../../sound.js';

export function renderDecorApp(body, onHudUpdate, showToast) {
  const activeTab = window._fleurDecorSubTab || 'shop';
  const catalogFilter = window._fleurDecorFilter || 'all';

  let rareIds = ensureDailyRareDecor();
  if (rareIds.length < 5) {
    gameState.rareShopDay = 0;
    rareIds = ensureDailyRareDecor();
  }

  const ownedSet = new Set([...(gameState.decor || []), ...(gameState.decorInventory || [])]);
  const fridgeItem = DECOR_CATALOG.find((d) => d.id === 'fridge');

  const todayItems = [
    ...(fridgeItem ? [fridgeItem] : []),
    ...rareIds.map((id) => DECOR_CATALOG.find((d) => d.id === id)).filter(Boolean)
  ];

  const visibleShopDecorCount = DECOR_CATALOG.filter(
    (d) =>
      d.place === 'Магазин' &&
      d.id !== 'fridge' &&
      ownedSet.has(d.id) &&
      !(gameState.hiddenDecor || []).includes(d.id)
  ).length;

  const renderCard = (item) => {
    const owned = ownedSet.has(item.id) || (item.id === 'fridge' && gameState.hasFridge);
    const isHidden = (gameState.hiddenDecor || []).includes(item.id);
    const rareBadge = item.isRare ? ' • ✨ Редкое' : '';

    let btnHtml = `
      <button class="btn btn-primary" data-buy-decor="${item.id}" style="padding:7px 10px; font-size:11.5px;">
        ${item.price} ₽
      </button>
    `;
    if (owned && item.id === 'fridge') {
      btnHtml = `<span class="badge badge-ok">Куплен ✓</span>`;
    } else if (owned) {
      btnHtml = `
        <button class="btn ${isHidden ? 'btn-sage' : 'btn-soft'}" data-toggle-decor-phone="${item.id}" style="padding:7px 9px; font-size:11px;">
          ${isHidden ? 'Поставить' : '✓ Стоит'}
        </button>
      `;
    }

    return `
      <div class="decor-item-card">
        <div class="decor-icon-box">${item.icon}</div>
        <div style="flex:1; min-width:0;">
          <div class="row-between">
            <strong style="font-size:12.5px;">${item.name}</strong>
            <span class="badge badge-ok">${item.place}${rareBadge}</span>
          </div>
          <p class="muted-text" style="font-size:11px; margin-top:2px;">${item.effectText}</p>
        </div>
        ${btnHtml}
      </div>
    `;
  };

  const todayHtml = todayItems.map(renderCard).join('');

  const filteredCatalog = DECOR_CATALOG.filter((item) => {
    if (catalogFilter === 'shop') return item.place === 'Магазин';
    if (catalogFilter === 'home') return item.place === 'Квартира';
    return true;
  });
  const catalogHtml = filteredCatalog.map(renderCard).join('');

  const ownedItems = DECOR_CATALOG.filter(
    (d) => ownedSet.has(d.id) || (d.id === 'fridge' && gameState.hasFridge)
  );
  const wardrobeHtml = ownedItems.length
    ? ownedItems
        .map((item) => {
          const isHidden = (gameState.hiddenDecor || []).includes(item.id);
          return `
            <div class="decor-item-card">
              <div class="decor-icon-box">${item.icon}</div>
              <div style="flex:1; min-width:0;">
                <strong style="font-size:12.5px;">${item.name}</strong>
                <div class="muted-text" style="font-size:11px;">${item.place} • ${item.category || 'Обычный'}</div>
              </div>
              <button class="btn ${isHidden ? 'btn-sage' : 'btn-soft'}" data-toggle-decor-phone="${item.id}" style="padding:7px 10px; font-size:11.5px;">
                ${isHidden ? '📦 Достать' : '✓ В интерьере'}
              </button>
            </div>
          `;
        })
        .join('')
    : `<p class="muted-text" style="text-align:center; padding:14px;">Склад декора пока пуст — выбери украшения в каталоге!</p>`;

  body.innerHTML = `
    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:4px; background:var(--bg-soft); padding:4px; border-radius:var(--radius-sm);">
      <button class="seg-btn ${activeTab === 'shop' ? 'active' : ''}" data-decor-subtab="shop" style="padding:7px 4px; font-size:11.5px;">
        ✨ Завоз дня
      </button>
      <button class="seg-btn ${activeTab === 'all' ? 'active' : ''}" data-decor-subtab="all" style="padding:7px 4px; font-size:11.5px;">
        🛍️ Весь (${DECOR_CATALOG.length})
      </button>
      <button class="seg-btn ${activeTab === 'wardrobe' ? 'active' : ''}" data-decor-subtab="wardrobe" style="padding:7px 4px; font-size:11.5px;">
        📦 Склад (${ownedItems.length})
      </button>
    </div>

    ${
      activeTab === 'shop'
        ? `
      <div class="antique-banner">
        <strong>🎨 Завоз на сегодня (День ${gameState.day})</strong><br/>
        Каждый день сюда привозят случайные украшения, а весь ассортимент всегда доступен во вкладке «Весь». Никаких ограничений!
      </div>
      ${todayHtml}
    `
        : activeTab === 'all'
        ? `
      <div style="display:flex; gap:5px;">
        <button class="btn ${catalogFilter === 'all' ? 'btn-primary' : 'btn-soft'}" data-decor-filter="all" style="flex:1; padding:6px; font-size:11.5px;">Всё (${DECOR_CATALOG.length})</button>
        <button class="btn ${catalogFilter === 'shop' ? 'btn-primary' : 'btn-soft'}" data-decor-filter="shop" style="flex:1; padding:6px; font-size:11.5px;">🏪 Зал</button>
        <button class="btn ${catalogFilter === 'home' ? 'btn-primary' : 'btn-soft'}" data-decor-filter="home" style="flex:1; padding:6px; font-size:11.5px;">🏡 Домик</button>
      </div>
      ${catalogHtml}
    `
        : `
      <p class="muted-text" style="font-size:11.5px; padding:0 4px;">
        Все покупки сохраняются навсегда. Размещено в зале: <strong>${visibleShopDecorCount} шт.</strong> (без ограничений).
      </p>
      ${wardrobeHtml}
    `
    }
  `;

  body.querySelectorAll('[data-decor-subtab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window._fleurDecorSubTab = btn.dataset.decorSubtab;
      renderDecorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-decor-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window._fleurDecorFilter = btn.dataset.decorFilter;
      renderDecorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-buy-decor]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = DECOR_CATALOG.find((d) => d.id === btn.dataset.buyDecor);
      if (!item) return;
      if (gameState.money < item.price) {
        showToast('Недостаточно денег!');
        return;
      }

      gameState.money -= item.price;
      gameState.totalSpent += item.price;
      if (item.id === 'fridge') gameState.hasFridge = true;
      if (!gameState.decor.includes(item.id)) gameState.decor.push(item.id);
      if (!Array.isArray(gameState.decorInventory)) gameState.decorInventory = [];
      if (!gameState.decorInventory.includes(item.id)) gameState.decorInventory.push(item.id);

      if (!Array.isArray(gameState.hiddenDecor)) gameState.hiddenDecor = [];
      gameState.hiddenDecor = gameState.hiddenDecor.filter((id) => id !== item.id);

      gameState.mood = Math.min(100, gameState.mood + item.moodBonus);
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`✨ Куплено и размещено: ${item.name}!`);
      renderDecorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-toggle-decor-phone]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggleDecorPhone;
      if (!Array.isArray(gameState.hiddenDecor)) gameState.hiddenDecor = [];
      if (gameState.hiddenDecor.includes(id)) {
        gameState.hiddenDecor = gameState.hiddenDecor.filter((x) => x !== id);
        showToast('✨ Украшение размещено!');
      } else {
        gameState.hiddenDecor.push(id);
        showToast('📦 Украшение убрано на склад');
      }
      saveState();
      renderDecorApp(body, onHudUpdate, showToast);
    });
  });
}