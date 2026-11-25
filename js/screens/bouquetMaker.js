import { FLOWERS_CATALOG, ACCESSORIES_CATALOG, WRAPPINGS, RIBBONS } from '../config.js';
import { gameState, saveState, addGameMinutes } from '../state.js';
import { getFlowerSvgDataUrl, getSingleFlowerWrappedSvg } from '../graphics/flowersSvg.js';
import { playPaperSound, playShutterSound } from '../sound.js';

const imageCache = {};
let activeTool = 'move'; // 'move' | 'scissors'
let selectedItem = null; // { kind: 'stem' | 'acc', id: string } | null
let draggingItem = null; // { kind: 'stem' | 'acc', ref: object } | null
let dragOffsetX = 0;
let dragOffsetY = 0;

let savedScreenScrollTop = 0;
let savedTrayScrollLeft = 0;
let savedWrapScrollLeft = 0;
let savedRibbonScrollLeft = 0;

function getAccTypeId(item) {
  return typeof item === 'string' ? item : item?.typeId;
}

function getAccessoryDefaults(typeId) {
  const map = {
    balloon_heart: { x: 438, y: 108, angle: 0.14, z: 'back' },
    balloon_set: { x: 118, y: 105, angle: 0, z: 'back' },
    greeting_card: { x: 362, y: 232, angle: 0.24, z: 'mid' },
    plush_bear: { x: 166, y: 365, angle: -0.1, z: 'front' },
    plush_bunny: { x: 394, y: 362, angle: 0.1, z: 'front' },
    chocolates_box: { x: 152, y: 438, angle: -0.06, z: 'front' },
    macarons_box: { x: 404, y: 438, angle: 0.06, z: 'front' }
  };
  return map[typeId] || { x: 280, y: 320, angle: 0, z: 'front' };
}

function normalizeAccessoriesList(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((item, idx) => {
      if (typeof item === 'string') {
        const def = getAccessoryDefaults(item);
        return {
          id: `acc_norm_${idx}_${item}`,
          typeId: item,
          x: def.x,
          y: def.y,
          angle: def.angle,
          z: def.z
        };
      }
      if (item && item.typeId) {
        const def = getAccessoryDefaults(item.typeId);
        return {
          id: item.id || `acc_norm_${idx}_${item.typeId}`,
          typeId: item.typeId,
          x: Number.isFinite(item.x) ? item.x : def.x,
          y: Number.isFinite(item.y) ? item.y : def.y,
          angle: Number.isFinite(item.angle) ? item.angle : def.angle,
          z: ['back', 'mid', 'front'].includes(item.z) ? item.z : def.z
        };
      }
      return null;
    })
    .filter(Boolean);
}

function getCachedFlowerImage(typeId, onLoadCallback) {
  if (imageCache[typeId]) return imageCache[typeId];
  const img = new Image();
  img.onload = () => {
    if (onLoadCallback) onLoadCallback();
  };
  img.src = getFlowerSvgDataUrl(typeId);
  imageCache[typeId] = img;
  return img;
}

function captureScrollPositions() {
  const screen = document.getElementById('screen-shop');
  const tray = document.querySelector('.flower-tray');
  const wrapRows = document.querySelectorAll('.wrap-options-row');
  if (screen) savedScreenScrollTop = screen.scrollTop;
  if (tray) savedTrayScrollLeft = tray.scrollLeft;
  if (wrapRows[0]) savedWrapScrollLeft = wrapRows[0].scrollLeft;
  if (wrapRows[1]) savedRibbonScrollLeft = wrapRows[1].scrollLeft;
}

function restoreScrollPositions() {
  const screen = document.getElementById('screen-shop');
  const tray = document.querySelector('.flower-tray');
  const wrapRows = document.querySelectorAll('.wrap-options-row');
  if (screen) screen.scrollTop = savedScreenScrollTop;
  if (tray) tray.scrollLeft = savedTrayScrollLeft;
  if (wrapRows[0]) wrapRows[0].scrollLeft = savedWrapScrollLeft;
  if (wrapRows[1]) wrapRows[1].scrollLeft = savedRibbonScrollLeft;
}

/** Добавить цветок из вазы в черновик букета */
export function addFlowerToDraftBouquet(vaseUid, showToast, count = 1, silent = false) {
  const vase = gameState.inventory.find((i) => i.uid === vaseUid);
  if (!vase || vase.qty <= 0) {
    if (!silent) showToast('В этой вазе закончились цветы');
    return false;
  }

  const addQty = Math.min(count, vase.qty);
  vase.qty -= addQty;
  if (vase.qty <= 0) {
    gameState.inventory = gameState.inventory.filter((i) => i.uid !== vaseUid);
  }

  const draft = gameState.currentBouquet;
  const meta = FLOWERS_CATALOG[vase.typeId];
  const unitPrice = vase.discounted ? Math.round(meta.price * 0.6) : meta.price;

  for (let i = 0; i < addQty; i++) {
    const index = draft.stems.length;
    const col = index % 7;
    const row = Math.floor(index / 7);
    const spreadAngle = (col - 3) * 0.13;
    const newStem = {
      id: 'stem_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      typeId: vase.typeId,
      price: unitPrice,
      freshness: vase.freshness,
      discounted: vase.discounted,
      x: 280 + (col - 3) * 24 + (row % 2 === 1 ? 10 : 0),
      y: 235 + (row % 3) * 18,
      angle: spreadAngle,
      trimmed: false
    };
    draft.stems.push(newStem);
    selectedItem = { kind: 'stem', id: newStem.id };
  }

  playPaperSound();
  saveState();
  if (!silent) {
    showToast(addQty > 1 ? `+ ${meta.shortName} (${addQty} шт.) добавлены` : `+ ${meta.shortName} добавлен в букет`);
  }
  return true;
}

function addAccessoryToDraftBouquet(accId, showToast) {
  const inv = (gameState.accessoriesInventory || []).find((a) => a.id === accId && a.qty > 0);
  const meta = ACCESSORIES_CATALOG[accId];
  if (!inv || !meta) {
    showToast('Этого дополнения нет в наличии');
    return false;
  }
  const draft = gameState.currentBouquet;
  draft.accessories = normalizeAccessoriesList(draft.accessories);

  inv.qty -= 1;
  if (inv.qty <= 0) {
    gameState.accessoriesInventory = gameState.accessoriesInventory.filter((a) => a.id !== accId);
  }

  const def = getAccessoryDefaults(accId);
  const sameCount = draft.accessories.filter((a) => a.typeId === accId).length;
  const newAcc = {
    id: 'acc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    typeId: accId,
    x: def.x + sameCount * 20,
    y: def.y + sameCount * 12,
    angle: def.angle,
    z: def.z
  };
  draft.accessories.push(newAcc);
  selectedItem = { kind: 'acc', id: newAcc.id };
  playPaperSound();
  saveState();
  showToast(`+ ${meta.icon} ${meta.shortName} добавлено — перетащи куда хочешь!`);
  return true;
}

function removeAccessoryFromDraftBouquet(accIdx, showToast) {
  const draft = gameState.currentBouquet;
  draft.accessories = normalizeAccessoriesList(draft.accessories);
  const [removed] = draft.accessories.splice(accIdx, 1);
  if (!removed) return;
  if (selectedItem?.kind === 'acc' && selectedItem?.id === removed.id) {
    selectedItem = null;
  }
  const typeId = getAccTypeId(removed);
  returnAccessoryToInventory(typeId);
  playPaperSound();
  saveState();
  const meta = ACCESSORIES_CATALOG[typeId];
  showToast(`${meta ? meta.shortName : 'Дополнение'} убрано обратно на склад`);
}

function returnAccessoryToInventory(itemOrId) {
  const accId = getAccTypeId(itemOrId);
  if (!accId || !ACCESSORIES_CATALOG[accId]) return;
  if (!Array.isArray(gameState.accessoriesInventory)) gameState.accessoriesInventory = [];
  const existing = gameState.accessoriesInventory.find((a) => a.id === accId);
  if (existing) {
    existing.qty += 1;
  } else {
    gameState.accessoriesInventory.push({ id: accId, qty: 1 });
  }
}

export function renderBouquetMaker(container, onHudUpdate, showToast, onRefreshParent) {
  const draft = gameState.currentBouquet;
  draft.accessories = normalizeAccessoriesList(draft.accessories);
  const totalPrice = calculateBouquetPrice(draft);

  const trayHtml = gameState.inventory.length
    ? gameState.inventory
        .map((item) => {
          const meta = FLOWERS_CATALOG[item.typeId];
          if (!meta) return '';
          const unitPrice = item.discounted ? Math.round(meta.price * 0.6) : meta.price;
          const freshClass = item.freshness >= 65 ? 'fresh-high' : item.freshness >= 35 ? 'fresh-mid' : 'fresh-low';
          return `
            <button class="tray-chip" data-add-vase="${item.uid}">
              ${item.discounted ? '<span class="tray-discount-badge">-40%</span>' : ''}
              <div class="tray-chip-svg">${getSingleFlowerWrappedSvg(item.typeId)}</div>
              <span class="tray-chip-name">${meta.shortName}</span>
              <span class="tray-chip-qty">${item.qty} шт • ${unitPrice}₽</span>
              <div class="freshness-bar-bg" style="height:4px;">
                <div class="freshness-bar-fill ${freshClass}" style="width:${item.freshness}%"></div>
              </div>
              <span class="tray-chip-fresh">${item.freshness}%</span>
            </button>
          `;
        })
        .join('')
    : `<p class="muted-text">Вазы пусты</p>`;

  const availableAccs = (gameState.accessoriesInventory || []).filter((a) => a.qty > 0);
  const attachedAccsHtml = draft.accessories.length
    ? `
      <div style="display:flex; flex-wrap:wrap; gap:5px;">
        ${draft.accessories
          .map((acc, idx) => {
            const meta = ACCESSORIES_CATALOG[acc.typeId];
            if (!meta) return '';
            const isSel = selectedItem?.kind === 'acc' && selectedItem?.id === acc.id;
            return `
              <button class="wrap-pill ${isSel ? 'active' : ''}" data-remove-acc-idx="${idx}" title="Нажми, чтобы убрать">
                ${meta.icon} ${meta.shortName} (+${meta.price}₽) ✕
              </button>
            `;
          })
          .join('')}
      </div>
    `
    : '';

  const accTrayHtml = availableAccs.length
    ? `
      <div class="wrap-options-row">
        ${availableAccs
          .map((acc) => {
            const meta = ACCESSORIES_CATALOG[acc.id];
            if (!meta) return '';
            return `
              <button class="wrap-pill" data-add-acc="${acc.id}">
                ${meta.icon} ${meta.shortName} (${acc.qty} шт • +${meta.price}₽)
              </button>
            `;
          })
          .join('')}
      </div>
    `
    : `<p class="muted-text" style="font-size:11.5px;">Открытки, игрушки, сладости и шарики можно заказать в «📱 Телефон → 🚚 Опт».</p>`;

  const wrapsHtml = WRAPPINGS.map(
    (w) => `
      <button class="wrap-pill ${draft.wrappingId === w.id ? 'active' : ''}" data-wrap-id="${w.id}">
        <span class="color-dot" style="background:${w.type === 'none' ? '#fff' : w.type === 'clear' ? 'linear-gradient(135deg,#eef6fa,#fff)' : w.color};"></span>
        ${w.name} ${w.price > 0 ? `(+${w.price}₽)` : ''}
      </button>
    `
  ).join('');

  const ribbonsHtml = RIBBONS.map(
    (r) => `
      <button class="wrap-pill ${draft.ribbonId === r.id ? 'active' : ''}" data-ribbon-id="${r.id}">
        <span class="color-dot" style="background:${r.color === 'transparent' ? '#fff' : r.color};"></span>
        ${r.name} ${r.price > 0 ? `(+${r.price}₽)` : ''}
      </button>
    `
  ).join('');

  const selStem = selectedItem?.kind === 'stem' ? draft.stems.find((s) => s.id === selectedItem.id) : null;
  const selAcc = selectedItem?.kind === 'acc' ? draft.accessories.find((a) => a.id === selectedItem.id) : null;
  const hasSelection = Boolean(selStem || selAcc);

  let canMoveUp = false;
  let canMoveDown = false;
  if (selStem) {
    const idx = draft.stems.findIndex((s) => s.id === selStem.id);
    canMoveUp = idx !== -1 && idx < draft.stems.length - 1;
    canMoveDown = idx > 0;
  } else if (selAcc) {
    canMoveUp = selAcc.z !== 'front';
    canMoveDown = selAcc.z !== 'back';
  }

  const readyHtml =
    gameState.readyBouquets.length > 0
      ? `
      <div class="card">
        <div class="card-title">🎀 Готовые букеты на витрине (${gameState.readyBouquets.length})</div>
        <div class="ready-bouquets-list">
          ${gameState.readyBouquets
            .map(
              (b) => `
            <div class="ready-bouquet-card" style="width: 126px;">
              <img class="ready-bouquet-img" src="${b.thumbnail}" alt="Букет" />
              <strong style="font-size:12px;">${b.price} ₽</strong>
              <span class="muted-text" style="font-size:10.5px;">${b.stemsCount} стеб.${b.accessories?.length ? ` + ${b.accessories.length} под.` : ''}</span>
              <div style="display:flex; gap:4px; width:100%; margin-top:2px;">
                <button class="btn btn-soft" data-edit-bouquet="${b.id}" style="flex:1; padding:4px; font-size:10.5px;">✏️ Изм.</button>
                <button class="btn btn-danger" data-del-bouquet="${b.id}" style="padding:4px 6px; font-size:10.5px;" title="Разобрать">🗑️</button>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>`
      : '';

  container.innerHTML = `
    <div class="bouquet-board-card">
      <div class="bouquet-canvas-wrap">
        <canvas id="bouquet-canvas" width="560" height="540"></canvas>
        <div class="canvas-price-pill">💐 На столе (${draft.stems.length} шт.): ${totalPrice} ₽</div>
        <div class="canvas-hint-pill">
          ${activeTool === 'move' ? '✋ Тяни цветы и подарки куда угодно • крути и меняй слой' : '✂️ Нажми на цветок, чтобы подрезать'}
        </div>
      </div>

      <div class="maker-toolbar">
        <button class="tool-btn ${activeTool === 'move' ? 'active' : ''}" id="tool-move">
          <span>✋</span><span>Двигать</span>
        </button>
        <button class="tool-btn ${activeTool === 'scissors' ? 'active' : ''}" id="tool-scissors">
          <span>✂️</span><span>Секатор</span>
        </button>
        <button class="tool-btn" id="tool-rot-left" ${!hasSelection ? 'disabled' : ''}>
          <span>⟲</span><span>Наклон</span>
        </button>
        <button class="tool-btn" id="tool-rot-right" ${!hasSelection ? 'disabled' : ''}>
          <span>⟳</span><span>Наклон</span>
        </button>
      </div>

      <div class="maker-toolbar">
        <button class="tool-btn" id="tool-layer-up" ${!canMoveUp ? 'disabled' : ''}>
          <span>⬆️</span><span>Поверх</span>
        </button>
        <button class="tool-btn" id="tool-layer-down" ${!canMoveDown ? 'disabled' : ''}>
          <span>⬇️</span><span>Глубже</span>
        </button>
        <button class="tool-btn" id="btn-remove-stem" ${!hasSelection ? 'disabled' : ''}>
          <span>↩️</span><span>Убрать</span>
        </button>
        <button class="tool-btn" id="btn-clear-table" ${draft.stems.length === 0 && draft.accessories.length === 0 ? 'disabled' : ''}>
          <span>🧹</span><span>Очистить</span>
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🌷 Добавить цветы (свайпай полку)</div>
      <div class="flower-tray">${trayHtml}</div>
    </div>

    <div class="card">
      <div class="card-title">🎁 Дополнения к букету ${draft.accessories.length ? `(приложено: ${draft.accessories.length})` : ''}</div>
      ${attachedAccsHtml}
      ${accTrayHtml}
    </div>

    <div class="card">
      <div class="card-title">🎀 Упаковка и лента</div>
      <div class="wrap-options-row">${wrapsHtml}</div>
      <div class="wrap-options-row">${ribbonsHtml}</div>
    </div>

    <div class="row-between" style="gap: 8px;">
      <button class="btn btn-sage" id="btn-photo-bouquet" style="flex: 1;" ${draft.stems.length === 0 ? 'disabled' : ''}>
        📸 Сфотать
      </button>
      <button class="btn btn-primary" id="btn-save-bouquet" style="flex: 1.4;" ${draft.stems.length === 0 ? 'disabled' : ''}>
        ✅ Готов к продаже
      </button>
    </div>

    ${readyHtml}
  `;

  setupCanvasAndEvents(container, onHudUpdate, showToast, onRefreshParent);
  restoreScrollPositions();
}

function calculateBouquetPrice(draft) {
  const wrap = WRAPPINGS.find((w) => w.id === draft.wrappingId) || WRAPPINGS[0];
  const ribbon = RIBBONS.find((r) => r.id === draft.ribbonId) || RIBBONS[0];

  let flowersSum = 0;
  let trimmedBonus = 0;
  draft.stems.forEach((s) => {
    flowersSum += s.price;
    if (s.trimmed) trimmedBonus += 15;
  });

  let accessoriesSum = 0;
  (draft.accessories || []).forEach((item) => {
    accessoriesSum += ACCESSORIES_CATALOG[getAccTypeId(item)]?.price || 0;
  });

  if (draft.stems.length === 0 && accessoriesSum === 0) return 0;
  if (draft.stems.length === 0) return accessoriesSum;
  const craftBonus = draft.stems.length >= 3 ? 50 : 0;
  return flowersSum + wrap.price + ribbon.price + trimmedBonus + craftBonus + accessoriesSum;
}

function findHitItemAtPoint(draft, pt) {
  const accs = draft.accessories || [];
  const frontHit = [...accs].reverse().find((a) => a.z === 'front' && Math.hypot(pt.x - a.x, pt.y - a.y) < 56);
  if (frontHit) return { kind: 'acc', ref: frontHit };

  const midHit = [...accs].reverse().find((a) => a.z === 'mid' && Math.hypot(pt.x - a.x, pt.y - a.y) < 56);
  if (midHit) return { kind: 'acc', ref: midHit };

  const stemHit = [...draft.stems].reverse().find((s) => Math.hypot(pt.x - s.x, pt.y - (s.y - 30)) < 68);
  if (stemHit) return { kind: 'stem', ref: stemHit };

  const backHit = [...accs].reverse().find((a) => a.z === 'back' && Math.hypot(pt.x - a.x, pt.y - a.y) < 56);
  if (backHit) return { kind: 'acc', ref: backHit };

  return null;
}

function setupCanvasAndEvents(container, onHudUpdate, showToast, onRefreshParent) {
  const canvas = document.getElementById('bouquet-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const draft = gameState.currentBouquet;

  const refreshKeepingScroll = () => {
    captureScrollPositions();
    onRefreshParent();
  };

  draft.stems.forEach((s) => getCachedFlowerImage(s.typeId, () => drawBouquetCanvas(ctx, canvas)));
  drawBouquetCanvas(ctx, canvas);

  const getCanvasPoint = (e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  canvas.addEventListener('pointerdown', (e) => {
    const pt = getCanvasPoint(e);
    const hit = findHitItemAtPoint(draft, pt);

    if (!hit) {
      selectedItem = null;
      drawBouquetCanvas(ctx, canvas);
      return;
    }

    selectedItem = { kind: hit.kind, id: hit.ref.id };

    if (activeTool === 'scissors') {
      if (hit.kind === 'stem') {
        if (!hit.ref.trimmed) {
          hit.ref.trimmed = true;
          playPaperSound();
          saveState();
          showToast('✂️ Стебель подрезан! (+15 ₽ к ценности)');
          refreshKeepingScroll();
        } else {
          showToast('Этот стебель уже аккуратно подрезан');
        }
      } else {
        showToast('✂️ Секатором подрезают только цветы — переключи на «✋ Двигать»');
        drawBouquetCanvas(ctx, canvas);
      }
      return;
    }

    draggingItem = hit;
    dragOffsetX = pt.x - hit.ref.x;
    dragOffsetY = pt.y - hit.ref.y;
    canvas.setPointerCapture(e.pointerId);
    drawBouquetCanvas(ctx, canvas);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!draggingItem) return;
    const pt = getCanvasPoint(e);
    if (draggingItem.kind === 'stem') {
      draggingItem.ref.x = Math.max(85, Math.min(475, pt.x - dragOffsetX));
      draggingItem.ref.y = Math.max(115, Math.min(400, pt.y - dragOffsetY));
    } else {
      draggingItem.ref.x = Math.max(48, Math.min(512, pt.x - dragOffsetX));
      draggingItem.ref.y = Math.max(48, Math.min(492, pt.y - dragOffsetY));
    }
    drawBouquetCanvas(ctx, canvas);
  });

  canvas.addEventListener('pointerup', () => {
    if (draggingItem) {
      draggingItem = null;
      saveState();
      refreshKeepingScroll();
    }
  });

  document.getElementById('tool-move')?.addEventListener('click', () => {
    activeTool = 'move';
    refreshKeepingScroll();
  });

  document.getElementById('tool-scissors')?.addEventListener('click', () => {
    activeTool = 'scissors';
    refreshKeepingScroll();
  });

  document.getElementById('tool-rot-left')?.addEventListener('click', () => {
    if (!selectedItem) return;
    if (selectedItem.kind === 'stem') {
      const stem = draft.stems.find((s) => s.id === selectedItem.id);
      if (!stem) return;
      stem.angle = Math.max(-0.85, stem.angle - 0.14);
    } else {
      const acc = draft.accessories.find((a) => a.id === selectedItem.id);
      if (!acc) return;
      acc.angle = Math.max(-1.4, (acc.angle || 0) - 0.14);
    }
    saveState();
    drawBouquetCanvas(ctx, canvas);
  });

  document.getElementById('tool-rot-right')?.addEventListener('click', () => {
    if (!selectedItem) return;
    if (selectedItem.kind === 'stem') {
      const stem = draft.stems.find((s) => s.id === selectedItem.id);
      if (!stem) return;
      stem.angle = Math.min(0.85, stem.angle + 0.14);
    } else {
      const acc = draft.accessories.find((a) => a.id === selectedItem.id);
      if (!acc) return;
      acc.angle = Math.min(1.4, (acc.angle || 0) + 0.14);
    }
    saveState();
    drawBouquetCanvas(ctx, canvas);
  });

  document.getElementById('tool-layer-up')?.addEventListener('click', () => {
    if (!selectedItem) return;
    if (selectedItem.kind === 'stem') {
      const idx = draft.stems.findIndex((s) => s.id === selectedItem.id);
      if (idx === -1 || idx >= draft.stems.length - 1) return;
      const [stem] = draft.stems.splice(idx, 1);
      draft.stems.splice(idx + 1, 0, stem);
    } else {
      const acc = draft.accessories.find((a) => a.id === selectedItem.id);
      if (!acc) return;
      if (acc.z === 'back') acc.z = 'mid';
      else if (acc.z === 'mid') acc.z = 'front';
    }
    saveState();
    refreshKeepingScroll();
  });

  document.getElementById('tool-layer-down')?.addEventListener('click', () => {
    if (!selectedItem) return;
    if (selectedItem.kind === 'stem') {
      const idx = draft.stems.findIndex((s) => s.id === selectedItem.id);
      if (idx <= 0) return;
      const [stem] = draft.stems.splice(idx, 1);
      draft.stems.splice(idx - 1, 0, stem);
    } else {
      const acc = draft.accessories.find((a) => a.id === selectedItem.id);
      if (!acc) return;
      if (acc.z === 'front') acc.z = 'mid';
      else if (acc.z === 'mid') acc.z = 'back';
    }
    saveState();
    refreshKeepingScroll();
  });

  document.getElementById('btn-remove-stem')?.addEventListener('click', () => {
    if (!selectedItem) return;
    if (selectedItem.kind === 'stem') {
      const stem = draft.stems.find((s) => s.id === selectedItem.id);
      if (!stem) return;
      returnStemToInventory(stem);
      draft.stems = draft.stems.filter((s) => s.id !== stem.id);
      selectedItem = null;
      saveState();
      showToast('Стебель возвращён в вазу');
    } else {
      const accIdx = draft.accessories.findIndex((a) => a.id === selectedItem.id);
      if (accIdx !== -1) removeAccessoryFromDraftBouquet(accIdx, showToast);
    }
    refreshKeepingScroll();
  });

  document.getElementById('btn-clear-table')?.addEventListener('click', () => {
    draft.stems.forEach((s) => returnStemToInventory(s));
    draft.stems = [];
    (draft.accessories || []).forEach((acc) => returnAccessoryToInventory(acc));
    draft.accessories = [];
    selectedItem = null;
    saveState();
    showToast('Цветы и дополнения возвращены на склад');
    refreshKeepingScroll();
  });

  container.querySelectorAll('[data-add-vase]').forEach((btn) => {
    btn.addEventListener('click', () => {
      captureScrollPositions();
      if (addFlowerToDraftBouquet(btn.dataset.addVase, showToast)) {
        onRefreshParent();
      }
    });
  });

  container.querySelectorAll('[data-add-acc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      captureScrollPositions();
      if (addAccessoryToDraftBouquet(btn.dataset.addAcc, showToast)) {
        onRefreshParent();
      }
    });
  });

  container.querySelectorAll('[data-remove-acc-idx]').forEach((btn) => {
    btn.addEventListener('click', () => {
      captureScrollPositions();
      removeAccessoryFromDraftBouquet(Number(btn.dataset.removeAccIdx), showToast);
      onRefreshParent();
    });
  });

  container.querySelectorAll('[data-wrap-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      draft.wrappingId = btn.dataset.wrapId;
      playPaperSound();
      saveState();
      refreshKeepingScroll();
    });
  });

  container.querySelectorAll('[data-ribbon-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      draft.ribbonId = btn.dataset.ribbonId;
      playPaperSound();
      saveState();
      refreshKeepingScroll();
    });
  });

  container.querySelectorAll('[data-edit-bouquet]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bId = btn.dataset.editBouquet;
      const ready = gameState.readyBouquets.find((b) => b.id === bId);
      if (!ready) return;

      if (draft.stems.length > 0) {
        draft.stems.forEach((s) => returnStemToInventory(s));
      }
      if (Array.isArray(draft.accessories) && draft.accessories.length > 0) {
        draft.accessories.forEach((acc) => returnAccessoryToInventory(acc));
      }

      if (Array.isArray(ready.stems) && ready.stems.length > 0) {
        draft.stems = ready.stems.map((s) => ({ ...s }));
      } else {
        draft.stems = (ready.items || []).map((typeId, index) => {
          const meta = FLOWERS_CATALOG[typeId];
          return {
            id: 'stem_' + Date.now() + '_' + index,
            typeId,
            price: meta ? meta.price : 200,
            freshness: 85,
            discounted: false,
            x: 280 + ((index % 7) - 3) * 24,
            y: 240 + Math.floor(index / 7) * 18,
            angle: ((index % 7) - 3) * 0.13,
            trimmed: false
          };
        });
      }

      draft.accessories = normalizeAccessoriesList(ready.accessories);
      draft.wrappingId = ready.wrappingId || 'craft';
      draft.ribbonId = ready.ribbonId || 'satin_rose';
      gameState.readyBouquets = gameState.readyBouquets.filter((b) => b.id !== bId);
      selectedItem = draft.stems[0] ? { kind: 'stem', id: draft.stems[0].id } : null;
      playPaperSound();
      saveState();
      showToast('✏️ Букет возвращён на стол для редактирования');
      refreshKeepingScroll();
    });
  });

  container.querySelectorAll('[data-del-bouquet]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bId = btn.dataset.delBouquet;
      const ready = gameState.readyBouquets.find((b) => b.id === bId);
      if (!ready) return;

      if (Array.isArray(ready.stems) && ready.stems.length > 0) {
        ready.stems.forEach((s) => returnStemToInventory(s));
      } else {
        (ready.items || []).forEach((typeId) => returnStemToInventory({ typeId, freshness: 85, discounted: false }));
      }
      (ready.accessories || []).forEach((acc) => returnAccessoryToInventory(acc));

      gameState.readyBouquets = gameState.readyBouquets.filter((b) => b.id !== bId);
      saveState();
      showToast('Букет разобран, цветы и подарки возвращены');
      refreshKeepingScroll();
    });
  });

  document.getElementById('btn-photo-bouquet')?.addEventListener('click', () => {
    const prevSelected = selectedItem;
    selectedItem = null;
    drawBouquetCanvas(ctx, canvas, true);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    selectedItem = prevSelected;
    drawBouquetCanvas(ctx, canvas, false);

    playShutterSound();
    gameState.savedPhotos.unshift({
      id: 'photo_' + Date.now(),
      dataUrl,
      type: 'bouquet',
      price: calculateBouquetPrice(draft),
      stemsCount: draft.stems.length,
      items: draft.stems.map((s) => s.typeId),
      accessories: (draft.accessories || []).map((a) => getAccTypeId(a)),
      description: describeBouquet(draft),
      day: gameState.day
    });
    if (gameState.savedPhotos.length > 10) {
      gameState.savedPhotos = gameState.savedPhotos.slice(0, 10);
    }
    saveState();
    showPolaroidModal(dataUrl, calculateBouquetPrice(draft));
  });

  document.getElementById('btn-save-bouquet')?.addEventListener('click', () => {
    const prevSelected = selectedItem;
    selectedItem = null;
    drawBouquetCanvas(ctx, canvas, true);
    const thumbnail = canvas.toDataURL('image/jpeg', 0.78);
    selectedItem = prevSelected;

    const ready = {
      id: 'bouquet_' + Date.now(),
      price: calculateBouquetPrice(draft),
      stemsCount: draft.stems.length,
      summary: describeBouquet(draft),
      thumbnail,
      items: draft.stems.map((s) => s.typeId),
      stems: draft.stems.map((s) => ({ ...s })),
      accessories: (draft.accessories || []).map((a) => ({ ...a })),
      wrappingId: draft.wrappingId,
      ribbonId: draft.ribbonId
    };

    gameState.readyBouquets.unshift(ready);
    draft.stems = [];
    draft.accessories = [];
    selectedItem = null;
    playPaperSound();
    const justClosed = addGameMinutes(20);
    onHudUpdate();
    if (justClosed) {
      showToast('🌙 Смена закончилась! Пора пойти домой поспать — иначе завтра будешь уставшим.');
    } else {
      showToast(`💐 Букет за ${ready.price} ₽ готов (+20 мин)!`);
    }
    refreshKeepingScroll();
  });
}

function drawAccessoryOnCanvas(ctx, acc, isPhotoMode) {
  const { typeId, x, y, angle } = acc;
  if (typeId === 'balloon_heart') drawHeartBalloon(ctx, x, y, 280, 358, angle);
  else if (typeId === 'balloon_set') drawBalloonCluster(ctx, x, y, 280, 358, angle);
  else if (typeId === 'greeting_card') drawGreetingCard(ctx, x, y, angle);
  else if (typeId === 'plush_bear') drawPlushBear(ctx, x, y, angle);
  else if (typeId === 'plush_bunny') drawPlushBunny(ctx, x, y, angle);
  else if (typeId === 'chocolates_box') drawChocolatesBox(ctx, x, y, angle);
  else if (typeId === 'macarons_box') drawMacaronsBox(ctx, x, y, angle);

  if (!isPhotoMode && selectedItem?.kind === 'acc' && selectedItem?.id === acc.id) {
    ctx.save();
    ctx.strokeStyle = '#D98A7C';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.arc(x, y, 48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawBouquetCanvas(ctx, canvas, isPhotoMode = false) {
  const w = canvas.width;
  const h = canvas.height;
  const draft = gameState.currentBouquet;
  const accs = normalizeAccessoriesList(draft.accessories);

  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#F7EFE5');
  bgGrad.addColorStop(1, '#EADBC9');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.fillStyle = '#FFFDF9';
  ctx.shadowColor = 'rgba(90, 68, 56, 0.08)';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2 - 10, 210, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = '#E5D8CA';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(w / 2, h / 2 - 10, 198, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Слой 'back' (позади упаковки и цветов)
  accs.filter((a) => a.z === 'back').forEach((a) => drawAccessoryOnCanvas(ctx, a, isPhotoMode));

  const wrap = WRAPPINGS.find((wp) => wp.id === draft.wrappingId) || WRAPPINGS[0];
  const ribbon = RIBBONS.find((rb) => rb.id === draft.ribbonId) || RIBBONS[0];

  if (wrap.type !== 'none') {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(145, 225);
    ctx.lineTo(280, 165);
    ctx.lineTo(415, 225);
    ctx.lineTo(318, 465);
    ctx.lineTo(242, 465);
    ctx.closePath();

    ctx.fillStyle = wrap.color;
    ctx.fill();
    ctx.strokeStyle = wrap.accent;
    ctx.lineWidth = 3;
    ctx.stroke();

    if (wrap.type === 'newspaper') {
      ctx.clip();
      ctx.strokeStyle = 'rgba(110, 96, 84, 0.25)';
      ctx.lineWidth = 2;
      for (let y = 185; y < 440; y += 16) {
        ctx.beginPath();
        ctx.moveTo(160, y);
        ctx.lineTo(400, y - 8);
        ctx.stroke();
      }
    } else if (wrap.type === 'mesh') {
      ctx.clip();
      ctx.strokeStyle = 'rgba(223, 171, 78, 0.4)';
      ctx.lineWidth = 1.5;
      for (let i = -150; i < 550; i += 22) {
        ctx.beginPath();
        ctx.moveTo(i, 160);
        ctx.lineTo(i + 180, 470);
        ctx.moveTo(i + 180, 160);
        ctx.lineTo(i, 470);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  draft.stems.forEach((stem) => {
    const img = getCachedFlowerImage(stem.typeId);
    if (!img || !img.complete) return;

    ctx.save();
    ctx.translate(stem.x, stem.y);
    ctx.rotate(stem.angle);

    const drawW = 148;
    const drawH = stem.trimmed ? 175 : 205;

    ctx.drawImage(img, -drawW / 2, -drawH + 55, drawW, drawH);

    if (!isPhotoMode && selectedItem?.kind === 'stem' && selectedItem?.id === stem.id) {
      ctx.strokeStyle = '#D98A7C';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.arc(0, -45, 58, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  });

  // Слой 'mid' (внутри букета поверх цветов, но под передним отворотом упаковки)
  accs.filter((a) => a.z === 'mid').forEach((a) => drawAccessoryOnCanvas(ctx, a, isPhotoMode));

  if (wrap.type !== 'none') {
    ctx.save();
    if (wrap.type === 'clear') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.strokeStyle = 'rgba(195, 222, 236, 0.9)';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(165, 275);
      ctx.lineTo(280, 355);
      ctx.lineTo(315, 465);
      ctx.lineTo(245, 465);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(395, 275);
      ctx.lineTo(280, 355);
      ctx.lineTo(245, 465);
      ctx.lineTo(315, 465);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(205, 315);
      ctx.lineTo(245, 370);
      ctx.moveTo(360, 310);
      ctx.lineTo(315, 385);
      ctx.stroke();
    } else {
      ctx.fillStyle = wrap.accent;
      ctx.globalAlpha = wrap.type === 'mesh' ? 0.65 : 0.9;
      ctx.beginPath();
      ctx.moveTo(165, 275);
      ctx.lineTo(280, 355);
      ctx.lineTo(312, 465);
      ctx.lineTo(245, 465);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = wrap.color;
      ctx.beginPath();
      ctx.moveTo(395, 275);
      ctx.lineTo(280, 355);
      ctx.lineTo(245, 465);
      ctx.lineTo(315, 465);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  if (ribbon.id !== 'none' && draft.stems.length > 0) {
    ctx.save();
    ctx.fillStyle = ribbon.color;
    ctx.beginPath();
    ctx.roundRect(242, 350, 76, 16, 6);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(264, 358, 20, 11, -0.3, 0, Math.PI * 2);
    ctx.ellipse(296, 358, 20, 11, 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = ribbon.color;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(276, 362);
    ctx.lineTo(256, 398);
    ctx.moveTo(284, 362);
    ctx.lineTo(304, 398);
    ctx.stroke();

    ctx.fillStyle = '#FFFDF9';
    ctx.beginPath();
    ctx.arc(280, 358, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Слой 'front' (поверх всего)
  accs.filter((a) => a.z === 'front').forEach((a) => drawAccessoryOnCanvas(ctx, a, isPhotoMode));

  if (isPhotoMode) {
    ctx.save();
    ctx.fillStyle = 'rgba(74, 62, 57, 0.5)';
    ctx.font = 'bold 18px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${gameState.shopName || 'Fleur Atelier'} 🌸`, w - 20, h - 18);
    ctx.restore();
  }
}

function drawHeartBalloon(ctx, x, y, knotX, knotY, angle = 0.14) {
  ctx.save();
  ctx.strokeStyle = 'rgba(190, 145, 135, 0.78)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + 36);
  ctx.quadraticCurveTo((x + knotX) / 2 - 20, (y + knotY) / 2, knotX, knotY);
  ctx.stroke();

  ctx.translate(x, y);
  ctx.rotate(angle);
  const grad = ctx.createRadialGradient(-10, -14, 6, 0, 0, 52);
  grad.addColorStop(0, '#FFB5C2');
  grad.addColorStop(0.55, '#EB7387');
  grad.addColorStop(1, '#C94D63');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.bezierCurveTo(-18, -36, -48, -14, -36, 14);
  ctx.bezierCurveTo(-24, 34, 0, 44, 0, 44);
  ctx.bezierCurveTo(0, 44, 24, 34, 36, 14);
  ctx.bezierCurveTo(48, -14, 18, -36, 0, -12);
  ctx.fill();
  ctx.strokeStyle = '#B84257';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.beginPath();
  ctx.ellipse(-16, -8, 6, 11, -0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBalloonCluster(ctx, x, y, knotX, knotY, angle = 0) {
  const balloons = [
    { dx: -18, dy: 14, r: 24, c1: '#F9D6DC', c2: '#E39AA8' },
    { dx: 20, dy: 10, r: 23, c1: '#DDECDD', c2: '#9BBF9E' },
    { dx: 0, dy: -16, r: 27, c1: '#FFF5DF', c2: '#E5C487' }
  ];
  ctx.save();
  balloons.forEach((b) => {
    ctx.strokeStyle = 'rgba(180, 160, 145, 0.72)';
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(x + b.dx, y + b.dy + b.r);
    ctx.quadraticCurveTo((x + b.dx + knotX) / 2 + 15, (y + knotY) / 2, knotX, knotY);
    ctx.stroke();
  });
  ctx.translate(x, y);
  ctx.rotate(angle);
  balloons.forEach((b) => {
    const bx = b.dx;
    const by = b.dy;
    const g = ctx.createRadialGradient(bx - 7, by - 8, 4, bx, by, b.r);
    g.addColorStop(0, '#FFFFFF');
    g.addColorStop(0.35, b.c1);
    g.addColorStop(1, b.c2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(bx, by, b.r * 0.88, b.r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.ellipse(bx - 8, by - 9, 4, 7, -0.4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawGreetingCard(ctx, x, y, angle = 0.24) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.shadowColor = 'rgba(74, 62, 57, 0.16)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#FFFDF7';
  ctx.strokeStyle = '#DFCBB8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-28, -36, 56, 72, 6);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#D6B99F';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-16, -16);
  ctx.lineTo(16, -16);
  ctx.moveTo(-16, -6);
  ctx.lineTo(12, -6);
  ctx.moveTo(-16, 4);
  ctx.lineTo(14, 4);
  ctx.stroke();

  ctx.fillStyle = '#E47B8B';
  ctx.beginPath();
  ctx.arc(0, 20, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPlushBear(ctx, x, y, angle = -0.1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = '#B87E52';
  ctx.beginPath();
  ctx.arc(-22, -30, 12, 0, Math.PI * 2);
  ctx.arc(22, -30, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#E6BFA0';
  ctx.beginPath();
  ctx.arc(-22, -30, 6.5, 0, Math.PI * 2);
  ctx.arc(22, -30, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#C98E60';
  ctx.beginPath();
  ctx.ellipse(0, 24, 26, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#EAD0B5';
  ctx.beginPath();
  ctx.ellipse(0, 26, 15, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#B87E52';
  ctx.beginPath();
  ctx.ellipse(-25, 18, 10, 14, 0.4, 0, Math.PI * 2);
  ctx.ellipse(25, 18, 10, 14, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#D49A6E';
  ctx.beginPath();
  ctx.arc(0, -10, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#F3DCC4';
  ctx.beginPath();
  ctx.ellipse(0, -4, 12, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4A362C';
  ctx.beginPath();
  ctx.ellipse(0, -7, 4.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-9, -15, 2.8, 0, Math.PI * 2);
  ctx.arc(9, -15, 2.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#E47B8B';
  ctx.beginPath();
  ctx.ellipse(-9, 13, 8, 5, -0.25, 0, Math.PI * 2);
  ctx.ellipse(9, 13, 8, 5, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 13, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPlushBunny(ctx, x, y, angle = 0.1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = '#F5EFE9';
  ctx.strokeStyle = '#D7CCC2';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(-12, -38, 7.5, 22, -0.18, 0, Math.PI * 2);
  ctx.ellipse(12, -38, 7.5, 22, 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#F5C4CC';
  ctx.beginPath();
  ctx.ellipse(-12, -38, 3.8, 14, -0.18, 0, Math.PI * 2);
  ctx.ellipse(12, -38, 3.8, 14, 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FAF6F2';
  ctx.beginPath();
  ctx.ellipse(0, 24, 24, 27, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -8, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#4A3E39';
  ctx.beginPath();
  ctx.arc(-8, -11, 2.5, 0, Math.PI * 2);
  ctx.arc(8, -11, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#F29AA4';
  ctx.beginPath();
  ctx.ellipse(0, -5, 3.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#9BB89D';
  ctx.beginPath();
  ctx.roundRect(-18, 8, 36, 10, 5);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(4, 14, 11, 18, 4);
  ctx.fill();
  ctx.restore();
}

function drawChocolatesBox(ctx, x, y, angle = -0.06) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.shadowColor = 'rgba(74, 62, 57, 0.16)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#7C4538';
  ctx.strokeStyle = '#572D23';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-36, -24, 72, 48, 8);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#E6BE6C';
  ctx.fillRect(-5, -24, 10, 48);
  ctx.fillRect(-36, -4, 72, 8);
  ctx.beginPath();
  ctx.ellipse(-9, -6, 9, 5, -0.3, 0, Math.PI * 2);
  ctx.ellipse(9, -6, 9, 5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -6, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#FFF5D6';
  ctx.fill();
  ctx.restore();
}

function drawMacaronsBox(ctx, x, y, angle = 0.06) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.shadowColor = 'rgba(74, 62, 57, 0.15)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#FDF4F0';
  ctx.strokeStyle = '#E0B9AE';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-38, -24, 76, 48, 8);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#FFFDFB';
  ctx.beginPath();
  ctx.roundRect(-30, -16, 60, 32, 5);
  ctx.fill();

  const colors = ['#F29AA4', '#A5CCA7', '#F6D68A', '#C8AEE0'];
  colors.forEach((c, idx) => {
    const mx = -21 + idx * 14;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.roundRect(mx - 5, -10, 10, 20, 4);
    ctx.fill();
    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(mx - 5, -1, 10, 2.5);
  });
  ctx.restore();
}

function returnStemToInventory(stem) {
  const existing = gameState.inventory.find(
    (i) => i.typeId === stem.typeId && i.discounted === !!stem.discounted
  );
  if (existing) {
    existing.qty += 1;
  } else {
    const meta = FLOWERS_CATALOG[stem.typeId];
    if (!meta) return;
    gameState.inventory.push({
      uid: 'vase_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      typeId: stem.typeId,
      qty: 1,
      freshness: stem.freshness || 80,
      discounted: !!stem.discounted,
      wateredThisShift: false
    });
  }
}

function describeBouquet(draft) {
  const counts = {};
  draft.stems.forEach((s) => {
    const name = FLOWERS_CATALOG[s.typeId]?.shortName || 'Цветок';
    counts[name] = (counts[name] || 0) + 1;
  });
  const list = Object.entries(counts)
    .map(([name, qty]) => `${name} (${qty})`)
    .join(', ');
  const wrap = WRAPPINGS.find((w) => w.id === draft.wrappingId)?.name || '';
  const accNames = (draft.accessories || [])
    .map((item) => {
      const m = ACCESSORIES_CATALOG[getAccTypeId(item)];
      return m ? `${m.icon} ${m.shortName}` : '';
    })
    .filter(Boolean);
  const accText = accNames.length ? ` + ${accNames.join(', ')}` : '';
  return `${list}${wrap && wrap !== 'Без упаковки' ? ` • ${wrap}` : ''}${accText}`;
}

function showPolaroidModal(dataUrl, price) {
  const modal = document.createElement('div');
  modal.className = 'polaroid-overlay';
  modal.innerHTML = `
    <div class="polaroid-card">
      <img src="${dataUrl}" alt="Снимок букета" />
      <strong style="font-family: var(--font-title); font-size: 17px;">Снимок готов! 📸</strong>
      <p class="muted-text">Букет оценён в <strong>${price} ₽</strong>. Фото сохранено в память телефона для InstaFlower!</p>
      <button class="btn btn-primary" id="btn-close-polaroid">Отлично</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#btn-close-polaroid').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}