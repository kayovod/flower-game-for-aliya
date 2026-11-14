import {
  FLOWERS_CATALOG,
  INSTA_HASHTAGS,
  DECOR_CATALOG,
  getGameDateObj,
  getSeasonInfo,
  getHolidayForDate
} from '../config.js';
import { gameState, saveState } from '../state.js';
import { getSingleFlowerWrappedSvg } from '../graphics/flowersSvg.js';
import { evaluateInstaPost, generateDirectMessage } from '../ai.js';
import { playShutterSound, playCoinSound } from '../sound.js';

let activeApp = 'insta';
let selectedPhotoIndex = 0;
let selectedTags = ['#флористика', '#уютнаялавка'];
let isPosting = false;
let isFetchingDm = false;
let frostThermalWrap = true;

export function renderPhoneScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-phone');
  if (!container) return;

  ensureWholesaleDeals();

  const unreadDms = gameState.directMessages.filter((m) => !m.replyText && !(m.order && m.order.done)).length;

  container.innerHTML = `
    <div class="screen-header">
      <h1 class="screen-title">Смартфон</h1>
      <span class="badge badge-ok">Сеть 5G 🌸</span>
    </div>

    <div class="phone-frame">
      <div class="phone-status-strip">
        <span>12:40</span>
        <span class="phone-notch"></span>
        <span>🔋 94%</span>
      </div>

      <div class="phone-apps-grid">
        <button class="phone-app-btn ${activeApp === 'insta' ? 'active' : ''}" data-phone-app="insta">
          <span class="phone-app-icon">📸</span>
          <span>InstaFlower</span>
        </button>

        <button class="phone-app-btn ${activeApp === 'direct' ? 'active' : ''}" data-phone-app="direct">
          ${unreadDms > 0 ? `<span class="phone-badge-dot">${unreadDms}</span>` : ''}
          <span class="phone-app-icon">💬</span>
          <span>Direct</span>
        </button>

        <button class="phone-app-btn ${activeApp === 'wholesale' ? 'active' : ''}" data-phone-app="wholesale">
          <span class="phone-app-icon">🚚</span>
          <span>Оптовик</span>
        </button>

        <button class="phone-app-btn ${activeApp === 'decor' ? 'active' : ''}" data-phone-app="decor">
          <span class="phone-app-icon">🛋️</span>
          <span>Декор</span>
        </button>
      </div>

      <div id="phone-app-body" style="display: flex; flex-direction: column; gap: 10px;"></div>
    </div>
  `;

  container.querySelectorAll('[data-phone-app]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeApp = btn.dataset.phoneApp;
      renderPhoneScreen(onHudUpdate, showToast);
    });
  });

  const body = document.getElementById('phone-app-body');
  if (activeApp === 'insta') renderInstaApp(body, onHudUpdate, showToast);
  else if (activeApp === 'direct') renderDirectApp(body, onHudUpdate, showToast);
  else if (activeApp === 'wholesale') renderWholesaleApp(body, onHudUpdate, showToast);
  else renderDecorApp(body, onHudUpdate, showToast);
}

/* ==================== 1. INSTAFLOWER ==================== */
function renderInstaApp(body, onHudUpdate, showToast) {
  const photos = gameState.savedPhotos || [];
  if (selectedPhotoIndex >= photos.length) selectedPhotoIndex = 0;
  const currentPhoto = photos[selectedPhotoIndex] || null;
  const handle = escapeHtml(gameState.instaHandle || '@fleur_atelier');

  const pickerHtml = photos.length
    ? photos
        .map(
          (p, idx) => `
        <div class="photo-pick-item ${idx === selectedPhotoIndex ? 'selected' : ''}" data-pick-photo="${idx}">
          <img src="${p.dataUrl}" alt="Фото ${idx + 1}" />
        </div>
      `
        )
        .join('')
    : `<p class="muted-text" style="font-size:12px;">В галерее пока пусто — сфоткай букет на Столе сборки или нажми кнопку ниже, чтобы снять витрину!</p>`;

  const tagsHtml = INSTA_HASHTAGS.map(
    (tag) => `
      <button class="hashtag-chip ${selectedTags.includes(tag) ? 'active' : ''}" data-toggle-tag="${tag}">
        ${tag}
      </button>
    `
  ).join('');

  const feedHtml = gameState.instaPosts.length
    ? gameState.instaPosts
        .map(
          (post) => `
        <div class="insta-post-card">
          <div class="insta-post-header">
            <span>🌸 ${handle}</span>
            <span class="badge ${post.followerDelta > 0 ? 'badge-ok' : 'badge-warn'}">${post.verdict}</span>
          </div>
          <img class="insta-post-img" src="${post.photoUrl}" alt="Пост" />
          <div class="insta-post-body">
            <div class="row-between">
              <strong>❤️ ${post.likes}</strong>
              <span class="muted-text" style="font-size:11.5px;">
                Подписчики: ${post.followerDelta >= 0 ? `+${post.followerDelta}` : post.followerDelta}
              </span>
            </div>
            ${post.caption ? `<p>${escapeHtml(post.caption)}</p>` : ''}
            <p class="muted-text" style="font-size:11px; color: var(--sage-dark);">${post.hashtags.join(' ')}</p>
            ${post.comments?.length ? `
              <div class="insta-comments-box">
                ${post.comments.map((c) => `<div><strong>${escapeHtml(c.author)}:</strong> ${escapeHtml(c.text)}</div>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `
        )
        .join('')
    : `<p class="muted-text" style="text-align:center; padding: 12px;">Лента пока пуста. Опубликуй свой первый пост, чтобы набирать подписчиков с нуля!</p>`;

  body.innerHTML = `
    <div class="card" style="padding: 12px;">
      <div class="row-between">
        <div class="card-title">✨ Новый пост (${handle})</div>
        <button class="btn btn-soft" id="btn-snap-interior" style="padding: 5px 8px; font-size: 11px;">
          📷 Снять зал
        </button>
      </div>

      <div class="photo-picker-row">${pickerHtml}</div>

      ${currentPhoto ? `
        <input type="text" class="form-input" id="insta-caption" placeholder="Напиши душевную подпись к фото..." />
        <div class="hashtags-row">${tagsHtml}</div>
        <button class="btn btn-primary" id="btn-publish-post" ${isPosting ? 'disabled' : ''}>
          ${isPosting ? '⏳ Аудитория смотрит пост...' : '🚀 Опубликовать пост'}
        </button>
      ` : ''}
    </div>

    <div class="card-title" style="padding-left: 4px;">📱 Твоя лента (${gameState.instaPosts.length})</div>
    ${feedHtml}
  `;

  body.querySelectorAll('[data-pick-photo]').forEach((el) => {
    el.addEventListener('click', () => {
      selectedPhotoIndex = Number(el.dataset.pickPhoto);
      renderInstaApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-toggle-tag]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.toggleTag;
      if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter((t) => t !== tag);
      } else if (selectedTags.length < 4) {
        selectedTags.push(tag);
      } else {
        showToast('Максимум 4 хэштега в посте');
      }
      renderInstaApp(body, onHudUpdate, showToast);
    });
  });

  document.getElementById('btn-snap-interior')?.addEventListener('click', () => {
    playShutterSound();
    const shopPhotoUrl = captureShopInteriorPhoto();
    gameState.savedPhotos.unshift({
      id: 'shop_' + Date.now(),
      dataUrl: shopPhotoUrl,
      type: 'shop',
      description: `Уютный интерьер цветочной лавки (${gameState.inventory.length} ваз с цветами)`,
      day: gameState.day
    });
    if (gameState.savedPhotos.length > 10) gameState.savedPhotos = gameState.savedPhotos.slice(0, 10);
    selectedPhotoIndex = 0;
    saveState();
    showToast('📸 Снимок зала сделан!');
    renderInstaApp(body, onHudUpdate, showToast);
  });

  document.getElementById('btn-publish-post')?.addEventListener('click', async () => {
    if (!currentPhoto || isPosting) return;
    const caption = document.getElementById('insta-caption')?.value.trim() || '';
    isPosting = true;
    renderInstaApp(body, onHudUpdate, showToast);

    try {
      const result = await evaluateInstaPost({
        type: currentPhoto.type === 'shop' ? 'shop' : 'bouquet',
        caption,
        hashtags: selectedTags,
        detailsText: currentPhoto.description || 'Авторский букет'
      });

      gameState.instaPosts.unshift({
        id: 'post_' + Date.now(),
        photoUrl: currentPhoto.dataUrl,
        caption,
        hashtags: [...selectedTags],
        likes: result.likes,
        followerDelta: result.followerDelta,
        verdict: result.verdict,
        comments: result.comments
      });

      gameState.followers = Math.max(0, gameState.followers + result.followerDelta);
      if (result.followerDelta > 0) {
        gameState.mood = Math.min(100, gameState.mood + 2);
      }
      saveState();
      onHudUpdate();
      showToast(`${result.verdict} (${result.followerDelta >= 0 ? '+' : ''}${result.followerDelta} подп.)`);
    } finally {
      isPosting = false;
      renderPhoneScreen(onHudUpdate, showToast);
    }
  });
}

/* ==================== 2. DIRECT ==================== */
function renderDirectApp(body, onHudUpdate, showToast) {
  const listHtml = gameState.directMessages.length
    ? gameState.directMessages
        .map((dm) => {
          const hasOrder = dm.kind === 'preorder' && dm.order;
          const vase = hasOrder ? gameState.inventory.find((v) => v.typeId === dm.order.typeId && v.qty >= dm.order.qty) : null;

          return `
          <div class="dm-card">
            <div class="row-between">
              <strong>${escapeHtml(dm.senderName)}</strong>
              <span class="badge ${dm.kind === 'preorder' ? 'badge-ok' : 'badge-warn'}">
                ${dm.kind === 'preorder' ? 'Предзаказ' : dm.kind === 'question' ? 'Вопрос' : 'Отзыв'}
              </span>
            </div>
            <p style="font-size:12.5px; line-height:1.4;">${escapeHtml(dm.text)}</p>

            ${hasOrder && !dm.order.done ? `
              <button class="btn ${vase ? 'btn-sage' : 'btn-soft'}" data-fulfill-dm="${dm.id}" ${!vase ? 'disabled' : ''} style="padding:7px; font-size:12px;">
                ${vase ? `💐 Выполнить заказ (+${dm.order.reward} ₽)` : `Не хватает цветов в вазах (нужно ${dm.order.qty} шт.)`}
              </button>
            ` : ''}

            ${hasOrder && dm.order.done ? `<span class="badge badge-ok" style="align-self:flex-start;">✅ Заказ выполнен (+${dm.order.reward} ₽)</span>` : ''}

            ${dm.replyText ? `
              <div class="muted-text" style="background: var(--bg-soft); padding: 6px 8px; border-radius: 8px; font-size: 11.5px;">
                <strong>Твой ответ:</strong> ${escapeHtml(dm.replyText)}
              </div>
            ` : `
              <div class="row-between" style="gap: 6px;">
                <input type="text" class="form-input" id="dm-reply-${dm.id}" placeholder="Быстрый ответ..." style="padding: 6px 9px; font-size: 12px;" />
                <button class="btn btn-primary" data-reply-dm="${dm.id}" style="padding: 7px 10px; font-size: 12px;">Отправить</button>
              </div>
            `}
          </div>
        `;
        })
        .join('')
    : `<p class="muted-text" style="text-align:center; padding: 14px;">Сообщений пока нет. Нажми кнопку сверху, чтобы проверить Директ!</p>`;

  body.innerHTML = `
    <button class="btn btn-sage" id="btn-check-dm" ${isFetchingDm ? 'disabled' : ''}>
      ${isFetchingDm ? '⏳ Загружаем сообщения...' : '📩 Проверить новые сообщения'}
    </button>
    ${listHtml}
  `;

  document.getElementById('btn-check-dm')?.addEventListener('click', async () => {
    if (isFetchingDm) return;
    isFetchingDm = true;
    renderDirectApp(body, onHudUpdate, showToast);
    try {
      const dm = await generateDirectMessage();
      gameState.directMessages.unshift(dm);
      if (gameState.directMessages.length > 8) gameState.directMessages = gameState.directMessages.slice(0, 8);
      saveState();
      showToast(`Новое сообщение от ${dm.senderName}`);
    } finally {
      isFetchingDm = false;
      renderPhoneScreen(onHudUpdate, showToast);
    }
  });

  body.querySelectorAll('[data-fulfill-dm]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dm = gameState.directMessages.find((m) => m.id === btn.dataset.fulfillDm);
      if (!dm || !dm.order || dm.order.done) return;
      const vase = gameState.inventory.find((v) => v.typeId === dm.order.typeId && v.qty >= dm.order.qty);
      if (!vase) return;

      vase.qty -= dm.order.qty;
      if (vase.qty <= 0) {
        gameState.inventory = gameState.inventory.filter((v) => v.uid !== vase.uid);
      }

      dm.order.done = true;
      gameState.money += dm.order.reward;
      gameState.totalEarned += dm.order.reward;
      gameState.bouquetsSold += 1;
      gameState.followers += 1;
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`🎉 Предзаказ выполнен! +${dm.order.reward} ₽ и +1 подписчик`);
      renderPhoneScreen(onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-reply-dm]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dmId = btn.dataset.replyDm;
      const dm = gameState.directMessages.find((m) => m.id === dmId);
      const input = document.getElementById(`dm-reply-${dmId}`);
      const text = input?.value.trim();
      if (!dm || !text) return;

      dm.replyText = text;
      gameState.mood = Math.min(100, gameState.mood + 2);
      if (text.length >= 8) gameState.followers += 1;
      saveState();
      onHudUpdate();
      showToast('Ответ отправлен (+лояльность!)');
      renderPhoneScreen(onHudUpdate, showToast);
    });
  });
}

/* ==================== 3. ОПТОВЫЙ ПОСТАВЩИК ==================== */
function ensureWholesaleDeals() {
  if (gameState.wholesaleDay === gameState.day && gameState.wholesaleDeals.length > 0) return;

  const keys = Object.keys(FLOWERS_CATALOG);
  const f1 = FLOWERS_CATALOG[keys[Math.floor(Math.random() * keys.length)]];
  const f2 = FLOWERS_CATALOG[keys[Math.floor(Math.random() * keys.length)]];

  gameState.wholesaleDay = gameState.day;
  gameState.wholesaleDeals = [
    {
      id: 'deal_defect_' + gameState.day,
      title: `Уценка (замятая коробка): ${f1.name}`,
      typeId: f1.id,
      qty: 8,
      freshness: 58,
      price: Math.round(f1.wholesalePrice * 8 * 0.55),
      tag: 'Брак -45%, свежесть 58%',
      bought: false
    },
    {
      id: 'deal_promo_' + gameState.day,
      title: `Акция дня: ${f2.name} (свежайшие)`,
      typeId: f2.id,
      qty: 6,
      freshness: 100,
      price: Math.round(f2.wholesalePrice * 6 * 0.78),
      tag: 'Скидка -22%, свежесть 100%',
      bought: false
    }
  ];
  saveState();
}

function renderWholesaleApp(body, onHudUpdate, showToast) {
  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const isHoliday = Boolean(getHolidayForDate(curDate));
  const priceMult = isHoliday ? 2 : 1;
  const isFrost = gameState.weather === 'frost';
  const thermalFee = isFrost && frostThermalWrap ? 100 : 0;

  const dealsHtml = gameState.wholesaleDeals
    .map((d) => {
      const finalPrice = d.price * priceMult + (d.bought ? 0 : thermalFee);
      return `
      <div class="wholesale-deal-card">
        <div class="row-between">
          <strong style="font-size:12.5px;">🔥 ${d.title}</strong>
          <span class="badge badge-warn">${d.tag}</span>
        </div>
        <div class="row-between">
          <span class="muted-text">${d.qty} шт. • Итого: <strong>${finalPrice} ₽</strong></span>
          <button class="btn btn-primary" data-buy-deal="${d.id}" ${d.bought ? 'disabled style="opacity:0.5;"' : ''} style="padding:6px 10px; font-size:11.5px;">
            ${d.bought ? 'Куплено' : 'Заказать'}
          </button>
        </div>
      </div>
    `;
    })
    .join('');

  const catalogHtml = Object.values(FLOWERS_CATALOG)
    .map((f) => {
      const price5 = f.wholesalePrice * 5 * priceMult + thermalFee;
      const price10 = Math.round(f.wholesalePrice * 10 * 0.92) * priceMult + thermalFee;
      return `
      <div class="wholesale-row">
        <div style="width:42px; height:48px; flex-shrink:0;">${getSingleFlowerWrappedSvg(f.id)}</div>
        <div style="flex:1; min-width:0;">
          <strong style="font-size:13px;">${f.name}</strong>
          <p class="muted-text" style="font-size:11px;">Опт: ${f.wholesalePrice * priceMult} ₽/шт • Свежесть 100%</p>
        </div>
        <div style="display:flex; flex-direction:column; gap:4px;">
          <button class="btn btn-soft" data-buy-wh="${f.id}:5" style="padding:5px 8px; font-size:11px;">
            +5 шт (${price5}₽)
          </button>
          <button class="btn btn-sage" data-buy-wh="${f.id}:10" style="padding:5px 8px; font-size:11px;">
            +10 шт (${price10}₽)
          </button>
        </div>
      </div>
    `;
    })
    .join('');

  body.innerHTML = `
    ${isHoliday ? '<div class="badge badge-warn" style="text-align:center;">🎉 Праздничный день: оптовые цены поставщиков x2!</div>' : ''}
    ${isFrost ? `
      <label class="card" style="padding:10px; flex-direction:row; align-items:center; gap:8px; cursor:pointer;">
        <input type="checkbox" id="chk-thermal-wrap" ${frostThermalWrap ? 'checked' : ''} />
        <span style="font-size:12px;">❄️ На улице мороз! Термоупаковка (+100 ₽, без неё риск подморозить цветы)</span>
      </label>
    ` : ''}

    ${dealsHtml}
    <div class="card-title" style="padding-left:4px;">📦 Обычный прайс поставщика</div>
    ${catalogHtml}
  `;

  document.getElementById('chk-thermal-wrap')?.addEventListener('change', (e) => {
    frostThermalWrap = e.target.checked;
    renderWholesaleApp(body, onHudUpdate, showToast);
  });

  body.querySelectorAll('[data-buy-deal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const deal = gameState.wholesaleDeals.find((d) => d.id === btn.dataset.buyDeal);
      if (!deal || deal.bought) return;
      const cost = deal.price * priceMult + thermalFee;
      if (gameState.money < cost) {
        showToast('Недостаточно денег на счёте!');
        return;
      }
      const actualFresh = isFrost && !frostThermalWrap && Math.random() < 0.5 ? Math.max(25, deal.freshness - 25) : deal.freshness;
      deal.bought = true;
      buyFlowersBatch(deal.typeId, deal.qty, actualFresh, cost, onHudUpdate, showToast);
      renderWholesaleApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-buy-wh]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [typeId, qtyStr] = btn.dataset.buyWh.split(':');
      const qty = Number(qtyStr);
      const f = FLOWERS_CATALOG[typeId];
      if (!f) return;
      const baseCost = qty === 10 ? Math.round(f.wholesalePrice * 10 * 0.92) : f.wholesalePrice * 5;
      const cost = baseCost * priceMult + thermalFee;
      if (gameState.money < cost) {
        showToast('Недостаточно денег на счёте!');
        return;
      }
      const froze = isFrost && !frostThermalWrap && Math.random() < 0.5;
      const fresh = froze ? 65 : 100;
      buyFlowersBatch(typeId, qty, fresh, cost, onHudUpdate, showToast);
      if (froze) showToast('🥶 Партия подмёрзла в дороге! Свежесть 65%');
      renderWholesaleApp(body, onHudUpdate, showToast);
    });
  });
}

function buyFlowersBatch(typeId, qty, freshness, cost, onHudUpdate, showToast) {
  gameState.money -= cost;
  gameState.totalSpent += cost;

  const existing = gameState.inventory.find(
    (v) => v.typeId === typeId && !v.discounted && Math.abs(v.freshness - freshness) <= 12
  );

  if (existing) {
    existing.qty += qty;
    existing.freshness = Math.round((existing.freshness + freshness) / 2);
  } else {
    gameState.inventory.push({
      uid: 'vase_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      typeId,
      qty,
      freshness,
      discounted: false,
      wateredThisShift: false
    });
  }

  playCoinSound();
  saveState();
  onHudUpdate();
  showToast(`🚚 Доставлено: ${FLOWERS_CATALOG[typeId].shortName} (+${qty} шт.)`);
}

/* ==================== 4. HOME & DECO ==================== */
function renderDecorApp(body, onHudUpdate, showToast) {
  const itemsHtml = DECOR_CATALOG.map((item) => {
    const owned = gameState.decor.includes(item.id) || (item.id === 'fridge' && gameState.hasFridge);
    return `
      <div class="decor-item-card">
        <div class="decor-icon-box">${item.icon}</div>
        <div style="flex:1; min-width:0;">
          <div class="row-between">
            <strong style="font-size:13px;">${item.name}</strong>
            <span class="badge badge-ok">${item.place}</span>
          </div>
          <p class="muted-text" style="font-size:11px; margin-top:2px;">${item.effectText}</p>
        </div>
        <button class="btn ${owned ? 'btn-soft' : 'btn-primary'}" data-buy-decor="${item.id}" ${owned ? 'disabled' : ''} style="padding:7px 10px; font-size:11.5px;">
          ${owned ? 'Куплено ✓' : `${item.price} ₽`}
        </button>
      </div>
    `;
  }).join('');

  body.innerHTML = `
    <p class="muted-text" style="padding: 0 4px;">Покупай технику и уютный декор для лавки и квартиры!</p>
    ${itemsHtml}
  `;

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
      gameState.mood = Math.min(100, gameState.mood + item.moodBonus);

      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`✨ Куплено: ${item.name}!`);
      renderDecorApp(body, onHudUpdate, showToast);
    });
  });
}

function captureShopInteriorPhoto() {
  const c = document.createElement('canvas');
  c.width = 480;
  c.height = 480;
  const ctx = c.getContext('2d');

  const isEvening = gameState.timeIndex === 2;
  const season = getSeasonInfo(getGameDateObj(gameState.startDate, gameState.day - 1));
  ctx.fillStyle = isEvening ? '#DFCBB9' : '#F6ECE1';
  ctx.fillRect(0, 0, 480, 480);

  if (gameState.decor.includes('vintage_wallpaper')) {
    ctx.fillStyle = 'rgba(217, 138, 124, 0.14)';
    for (let x = 25; x < 480; x += 60) {
      for (let y = 30; y < 340; y += 60) {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.fillStyle = isEvening ? '#5E648B' : gameState.weather === 'rainy' ? '#95A9B8' : '#BCE1F5';
  ctx.fillRect(45, 55, 190, 145);
  // Горизонт в окне по сезону
  ctx.fillStyle = season.id === 'winter' ? '#F2F7FA' : season.id === 'autumn' ? '#D98A4E' : '#9CC494';
  ctx.fillRect(45, 165, 190, 35);

  ctx.strokeStyle = '#FFFDF9';
  ctx.lineWidth = 8;
  ctx.strokeRect(45, 55, 190, 145);

  ctx.fillStyle = '#FFFDF9';
  ctx.fillRect(265, 75, 165, 65);
  ctx.strokeStyle = gameState.decor.includes('neon_sign') ? '#E58A94' : '#D5C3B3';
  ctx.lineWidth = 4;
  ctx.strokeRect(265, 75, 165, 65);
  ctx.fillStyle = '#5C4A42';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText((gameState.shopName || 'Fleur Atelier').slice(0, 16), 347, 114);

  ctx.fillStyle = '#C9A789';
  ctx.fillRect(30, 340, 420, 22);
  ctx.fillStyle = '#EADBC9';
  ctx.fillRect(0, 362, 480, 118);

  const vaseColors = ['#EBD9CE', '#DCE6DB', '#F3DFDC', '#DFD9EA'];
  const count = Math.min(4, Math.max(1, gameState.inventory.length));
  for (let i = 0; i < count; i++) {
    const vx = 85 + i * 95;
    ctx.fillStyle = vaseColors[i % vaseColors.length];
    ctx.fillRect(vx, 280, 42, 60);
    ctx.fillStyle = '#6E9971';
    ctx.fillRect(vx + 18, 235, 6, 45);
    ctx.fillStyle = i % 2 === 0 ? '#E98387' : '#F4C752';
    ctx.beginPath();
    ctx.arc(vx + 21, 228, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(74, 62, 57, 0.55)';
  ctx.font = 'bold 16px Georgia, serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${gameState.shopName || 'Fleur Atelier'} 🌸`, 460, 460);

  return c.toDataURL('image/jpeg', 0.85);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}