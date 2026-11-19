import { FLOWERS_CATALOG, WRAPPINGS, RIBBONS } from '../config.js';
import { gameState, saveState, addGameMinutes } from '../state.js';
import { getFlowerSvgDataUrl, getSingleFlowerWrappedSvg } from '../graphics/flowersSvg.js';
import { playPaperSound, playShutterSound } from '../sound.js';

const imageCache = {};
let activeTool = 'move'; // 'move' | 'scissors'
let selectedStemId = null;
let draggingStem = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

let savedScreenScrollTop = 0;
let savedTrayScrollLeft = 0;
let savedWrapScrollLeft = 0;
let savedRibbonScrollLeft = 0;

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
    selectedStemId = newStem.id;
  }

  playPaperSound();
  saveState();
  if (!silent) {
    showToast(addQty > 1 ? `+ ${meta.shortName} (${addQty} шт.) добавлены` : `+ ${meta.shortName} добавлен в букет`);
  }
  return true;
}

export function renderBouquetMaker(container, onHudUpdate, showToast, onRefreshParent) {
  const draft = gameState.currentBouquet;
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

  const selectedIndex = draft.stems.findIndex((s) => s.id === selectedStemId);
  const canMoveUp = selectedIndex !== -1 && selectedIndex < draft.stems.length - 1;
  const canMoveDown = selectedIndex > 0;

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
              <span class="muted-text" style="font-size:10.5px;">${b.stemsCount} стеб.</span>
              <div style="display:flex; gap:4px; width:100%; margin-top:2px;">
                <button class="btn btn-soft" data-edit-bouquet="${b.id}" style="flex:1; padding:4px; font-size:10.5px;">✏️ Изм.</button>
                <button class="btn btn-danger" data-del-bouquet="${b.id}" style="padding:4px 6px; font-size:10.5px;" title="Разобрать в вазы">🗑️</button>
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
          ${activeTool === 'move' ? '✋ Тяни цветок • выбирай слой (время на паузе)' : '✂️ Нажми на цветок, чтобы подрезать'}
        </div>
      </div>

      <div class="maker-toolbar">
        <button class="tool-btn ${activeTool === 'move' ? 'active' : ''}" id="tool-move">
          <span>✋</span><span>Двигать</span>
        </button>
        <button class="tool-btn ${activeTool === 'scissors' ? 'active' : ''}" id="tool-scissors">
          <span>✂️</span><span>Секатор</span>
        </button>
        <button class="tool-btn" id="tool-rot-left" ${!selectedStemId ? 'disabled' : ''}>
          <span>⟲</span><span>Наклон</span>
        </button>
        <button class="tool-btn" id="tool-rot-right" ${!selectedStemId ? 'disabled' : ''}>
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
        <button class="tool-btn" id="btn-remove-stem" ${!selectedStemId ? 'disabled' : ''}>
          <span>↩️</span><span>Убрать</span>
        </button>
        <button class="tool-btn" id="btn-clear-table" ${draft.stems.length === 0 ? 'disabled' : ''}>
          <span>🧹</span><span>Очистить</span>
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🌷 Добавить цветы (свайпай полку)</div>
      <div class="flower-tray">${trayHtml}</div>
    </div>

    <div class="card">
      <div class="card-title">🎁 Упаковка и лента</div>
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

  if (draft.stems.length === 0) return 0;
  const craftBonus = draft.stems.length >= 3 ? 50 : 0;
  return flowersSum + wrap.price + ribbon.price + trimmedBonus + craftBonus;
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
    const hit = [...draft.stems]
      .reverse()
      .find((s) => Math.hypot(pt.x - s.x, pt.y - (s.y - 30)) < 68);

    if (!hit) {
      selectedStemId = null;
      drawBouquetCanvas(ctx, canvas);
      return;
    }

    selectedStemId = hit.id;

    if (activeTool === 'scissors') {
      if (!hit.trimmed) {
        hit.trimmed = true;
        playPaperSound();
        saveState();
        showToast('✂️ Стебель подрезан! (+15 ₽ к ценности)');
        refreshKeepingScroll();
      } else {
        showToast('Этот стебель уже аккуратно подрезан');
      }
      return;
    }

    draggingStem = hit;
    dragOffsetX = pt.x - hit.x;
    dragOffsetY = pt.y - hit.y;
    canvas.setPointerCapture(e.pointerId);
    drawBouquetCanvas(ctx, canvas);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!draggingStem) return;
    const pt = getCanvasPoint(e);
    draggingStem.x = Math.max(85, Math.min(475, pt.x - dragOffsetX));
    draggingStem.y = Math.max(115, Math.min(400, pt.y - dragOffsetY));
    drawBouquetCanvas(ctx, canvas);
  });

  canvas.addEventListener('pointerup', () => {
    if (draggingStem) {
      draggingStem = null;
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
    const stem = draft.stems.find((s) => s.id === selectedStemId);
    if (!stem) return;
    stem.angle = Math.max(-0.85, stem.angle - 0.14);
    saveState();
    drawBouquetCanvas(ctx, canvas);
  });

  document.getElementById('tool-rot-right')?.addEventListener('click', () => {
    const stem = draft.stems.find((s) => s.id === selectedStemId);
    if (!stem) return;
    stem.angle = Math.min(0.85, stem.angle + 0.14);
    saveState();
    drawBouquetCanvas(ctx, canvas);
  });

  document.getElementById('tool-layer-up')?.addEventListener('click', () => {
    const idx = draft.stems.findIndex((s) => s.id === selectedStemId);
    if (idx === -1 || idx >= draft.stems.length - 1) return;
    const [stem] = draft.stems.splice(idx, 1);
    draft.stems.splice(idx + 1, 0, stem);
    saveState();
    refreshKeepingScroll();
  });

  document.getElementById('tool-layer-down')?.addEventListener('click', () => {
    const idx = draft.stems.findIndex((s) => s.id === selectedStemId);
    if (idx <= 0) return;
    const [stem] = draft.stems.splice(idx, 1);
    draft.stems.splice(idx - 1, 0, stem);
    saveState();
    refreshKeepingScroll();
  });

  document.getElementById('btn-remove-stem')?.addEventListener('click', () => {
    const stem = draft.stems.find((s) => s.id === selectedStemId);
    if (!stem) return;
    returnStemToInventory(stem);
    draft.stems = draft.stems.filter((s) => s.id !== stem.id);
    selectedStemId = null;
    saveState();
    showToast('Стебель возвращён в вазу');
    refreshKeepingScroll();
  });

  document.getElementById('btn-clear-table')?.addEventListener('click', () => {
    draft.stems.forEach((s) => returnStemToInventory(s));
    draft.stems = [];
    selectedStemId = null;
    saveState();
    showToast('Все цветы возвращены в вазы');
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

      draft.wrappingId = ready.wrappingId || 'craft';
      draft.ribbonId = ready.ribbonId || 'satin_rose';
      gameState.readyBouquets = gameState.readyBouquets.filter((b) => b.id !== bId);
      selectedStemId = draft.stems[0]?.id || null;
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

      gameState.readyBouquets = gameState.readyBouquets.filter((b) => b.id !== bId);
      saveState();
      showToast('Букет разобран, цветы снова в вазах');
      refreshKeepingScroll();
    });
  });

  document.getElementById('btn-photo-bouquet')?.addEventListener('click', () => {
    const prevSelected = selectedStemId;
    selectedStemId = null;
    drawBouquetCanvas(ctx, canvas, true);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    selectedStemId = prevSelected;
    drawBouquetCanvas(ctx, canvas, false);

    playShutterSound();
    gameState.savedPhotos.unshift({
      id: 'photo_' + Date.now(),
      dataUrl,
      type: 'bouquet',
      price: calculateBouquetPrice(draft),
      stemsCount: draft.stems.length,
      items: draft.stems.map((s) => s.typeId),
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
    const prevSelected = selectedStemId;
    selectedStemId = null;
    drawBouquetCanvas(ctx, canvas, true);
    const thumbnail = canvas.toDataURL('image/jpeg', 0.78);
    selectedStemId = prevSelected;

    const ready = {
      id: 'bouquet_' + Date.now(),
      price: calculateBouquetPrice(draft),
      stemsCount: draft.stems.length,
      summary: describeBouquet(draft),
      thumbnail,
      items: draft.stems.map((s) => s.typeId),
      stems: draft.stems.map((s) => ({ ...s })),
      wrappingId: draft.wrappingId,
      ribbonId: draft.ribbonId
    };

    gameState.readyBouquets.unshift(ready);
    draft.stems = [];
    selectedStemId = null;
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

function drawBouquetCanvas(ctx, canvas, isPhotoMode = false) {
  const w = canvas.width;
  const h = canvas.height;
  const draft = gameState.currentBouquet;

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

    if (!isPhotoMode && stem.id === selectedStemId) {
      ctx.strokeStyle = '#D98A7C';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.arc(0, -45, 58, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  });

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

  if (isPhotoMode) {
    ctx.save();
    ctx.fillStyle = 'rgba(74, 62, 57, 0.5)';
    ctx.font = 'bold 18px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${gameState.shopName || 'Fleur Atelier'} 🌸`, w - 20, h - 18);
    ctx.restore();
  }
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
  return `${list}${wrap && wrap !== 'Без упаковки' ? ` • ${wrap}` : ''}`;
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