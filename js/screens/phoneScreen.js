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
import {
  evaluateInstaPost,
  generateInstaCommentReply,
  generateDirectMessage,
  generateDirectFollowUp,
  formatMinutesAsTime
} from '../ai.js';
import { playShutterSound, playCoinSound } from '../sound.js';

let activeApp = 'insta';
let selectedPhotoIndex = 0;
let selectedTags = ['#флористика', '#уютнаялавка'];
let isPosting = false;
let isFetchingDm = false;
let openedDmId = null;
let busyDmId = null;
let openCommentReplyKey = null;
let busyCommentKey = null;
let frostThermalWrap = true;

const PROMO_CAMPAIGNS = [
  {
    id: 'promo_target',
    title: 'Таргет: букеты дня',
    desc: 'Чаще приходят по фото из постов и пишут в Direct',
    cost: 250,
    bonusType: 'target'
  },
  {
    id: 'promo_cozy',
    title: 'Акция «Уютный день»',
    desc: '+лайки, +подписчики к постам и больше гостей в зале',
    cost: 200,
    bonusType: 'cozy'
  },
  {
    id: 'promo_seasonal',
    title: 'Сезонный хит в топ',
    desc: 'Виральные сезонные клиенты с бюджетом +25%',
    cost: 350,
    bonusType: 'seasonal'
  }
];

export function renderPhoneScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-phone');
  if (!container) return;

  ensureWholesaleDeals();

  const unreadDms = gameState.directMessages.filter((m) => !m.read).length;
  const timeLabel = formatMinutesAsTime(gameState.timeMinutes ?? 540);

  container.innerHTML = `
    <div class="screen-header">
      <h1 class="screen-title">Смартфон</h1>
      <span class="badge badge-ok">Сеть 5G 🌸</span>
    </div>

    <div class="phone-frame">
      <div class="phone-status-strip">
        <span>${timeLabel}</span>
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

/* ==================== 1. INSTAFLOWER (ЭТАП 5) ==================== */
function renderInstaApp(body, onHudUpdate, showToast) {
  const photos = gameState.savedPhotos || [];
  if (selectedPhotoIndex >= photos.length) selectedPhotoIndex = 0;
  const currentPhoto = photos[selectedPhotoIndex] || null;
  const handle = escapeHtml(gameState.instaHandle || '@fleur_atelier');

  const activePromo =
    gameState.activePromo && gameState.activePromo.day === gameState.day ? gameState.activePromo : null;

  const promoHtml = activePromo
    ? `
      <div class="insta-promo-box">
        <div class="row-between">
          <strong style="font-size:12.5px;">📣 Акция на сегодня запущена</strong>
          <span class="badge badge-ok">Активна</span>
        </div>
        <div class="muted-text" style="font-size:11.5px;">
          <strong>${escapeHtml(activePromo.title)}</strong> — ${escapeHtml(activePromo.desc)}
        </div>
      </div>
    `
    : `
      <div class="insta-promo-box">
        <strong style="font-size:12.5px;">📣 Промо-акция в соцсети (на весь день)</strong>
        ${PROMO_CAMPAIGNS.map((p) => `
          <button class="promo-option-btn" data-launch-promo="${p.id}">
            <div style="flex:1; min-width:0;">
              <strong>${escapeHtml(p.title)}</strong>
              <div class="muted-text" style="font-size:10.5px;">${escapeHtml(p.desc)}</div>
            </div>
            <span class="badge badge-warn">${p.cost} ₽</span>
          </button>
        `).join('')}
      </div>
    `;

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
    ? gameState.instaPosts.map((post) => renderInstaPostCard(post, handle)).join('')
    : `<p class="muted-text" style="text-align:center; padding: 12px;">Лента пока пуста. Опубликуй свой первый пост, чтобы набирать подписчиков и приводить гостей из соцсети!</p>`;

  body.innerHTML = `
    ${promoHtml}

    <div class="card" style="padding: 12px;">
      <div class="row-between">
        <div class="card-title">✨ Новый пост (${handle})</div>
        <button class="btn btn-soft" id="btn-snap-interior" style="padding: 5px 8px; font-size: 11px;">
          📷 Снять зал
        </button>
      </div>

      <div class="photo-picker-row">${pickerHtml}</div>

      ${currentPhoto ? `
        <input type="text" class="form-input" id="insta-caption" autocomplete="off" data-form-type="other" data-lpignore="true" placeholder="Напиши душевную подпись к фото..." />
        <div class="hashtags-row">${tagsHtml}</div>
        <button class="btn btn-primary" id="btn-publish-post" ${isPosting ? 'disabled' : ''}>
          ${isPosting ? '⏳ Аудитория смотрит пост...' : '🚀 Опубликовать пост'}
        </button>
      ` : ''}
    </div>

    <div class="card-title" style="padding-left: 4px;">📱 Твоя лента (${gameState.instaPosts.length})</div>
    ${feedHtml}
  `;

  body.querySelectorAll('[data-launch-promo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const camp = PROMO_CAMPAIGNS.find((c) => c.id === btn.dataset.launchPromo);
      if (!camp) return;
      if (gameState.money < camp.cost) {
        showToast('Недостаточно денег для запуска акции!');
        return;
      }
      gameState.money -= camp.cost;
      gameState.totalSpent += camp.cost;
      gameState.activePromo = {
        id: camp.id,
        title: camp.title,
        desc: camp.desc,
        bonusType: camp.bonusType,
        day: gameState.day,
        cost: camp.cost
      };
      gameState.mood = Math.min(100, gameState.mood + 3);
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`📣 Запущена акция «${camp.title}»!`);
      renderInstaApp(body, onHudUpdate, showToast);
    });
  });

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

  body.querySelectorAll('[data-open-comment-reply]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.openCommentReply;
      openCommentReplyKey = openCommentReplyKey === key ? null : key;
      renderInstaApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-send-comment-reply]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sendCommentReply;
      const [postId, idxStr] = key.split(':');
      const input = document.getElementById(`comment-reply-input-${postId}-${idxStr}`);
      const text = input?.value.trim();
      if (!text) return;
      handleCommentReply(postId, Number(idxStr), text, body, onHudUpdate, showToast);
    });
  });

  document.getElementById('btn-snap-interior')?.addEventListener('click', () => {
    playShutterSound();
    const shopPhotoUrl = captureShopInteriorPhoto();
    const activeDecorNames = DECOR_CATALOG
      .filter((d) => d.place === 'Магазин' && isShopDecorVisible(d.id))
      .map((d) => d.name);
    const decorNote = activeDecorNames.length ? `, декор: ${activeDecorNames.join(', ')}` : '';

    gameState.savedPhotos.unshift({
      id: 'shop_' + Date.now(),
      dataUrl: shopPhotoUrl,
      type: 'shop',
      description: `Уютный интерьер цветочной лавки (${gameState.inventory.length} ваз с цветами${decorNote})`,
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
      const postType = currentPhoto.type === 'shop' ? 'shop' : 'bouquet';
      const detailsText = currentPhoto.description || 'Авторский букет';
      const result = await evaluateInstaPost({
        type: postType,
        caption,
        hashtags: selectedTags,
        detailsText
      });

      gameState.instaPosts.unshift({
        id: 'post_' + Date.now(),
        photoUrl: currentPhoto.dataUrl,
        type: postType,
        detailsText,
        items: Array.isArray(currentPhoto.items) ? [...currentPhoto.items] : [],
        targetPrice: Number(currentPhoto.price) || 0,
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

function renderInstaPostCard(post, handle) {
  const commentsHtml = post.comments?.length
    ? `
      <div class="insta-comments-box">
        ${post.comments
          .map((c, idx) => {
            const key = `${post.id}:${idx}`;
            const isOpen = openCommentReplyKey === key;
            const isBusy = busyCommentKey === key;
            return `
              <div class="insta-comment-item">
                <div class="row-between" style="align-items:flex-start;">
                  <div><strong>${escapeHtml(c.author)}:</strong> ${escapeHtml(c.text)}</div>
                  ${!c.ownerReply ? `
                    <button class="btn btn-soft" data-open-comment-reply="${key}" style="padding:2px 6px; font-size:10px; flex-shrink:0;">
                      Ответить
                    </button>
                  ` : ''}
                </div>
                ${c.ownerReply ? `
                  <div class="insta-comment-reply">
                    <strong>${handle}:</strong> ${escapeHtml(c.ownerReply)}
                  </div>
                ` : ''}
                ${c.followUpReply ? `
                  <div class="insta-comment-reply" style="border-left-color: var(--sage);">
                    <strong>${escapeHtml(c.author)}:</strong> ${escapeHtml(c.followUpReply)}
                  </div>
                ` : ''}
                ${isBusy ? `<div class="muted-text" style="font-size:10.5px;">💬 ${escapeHtml(c.author)} печатает...</div>` : ''}
                ${isOpen && !c.ownerReply ? `
                  <div class="insta-reply-row">
                    <input type="text" class="form-input" id="comment-reply-input-${post.id}-${idx}" autocomplete="off" data-form-type="other" data-lpignore="true" placeholder="Ответить подписчику..." style="padding:4px 7px; font-size:11px;" />
                    <button class="btn btn-primary" data-send-comment-reply="${key}" style="padding:4px 8px; font-size:11px;">➤</button>
                  </div>
                ` : ''}
              </div>
            `;
          })
          .join('')}
      </div>
    `
    : '';

  return `
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
        ${commentsHtml}
      </div>
    </div>
  `;
}

async function handleCommentReply(postId, commentIdx, text, body, onHudUpdate, showToast) {
  const post = gameState.instaPosts.find((p) => p.id === postId);
  const comment = post?.comments?.[commentIdx];
  if (!post || !comment || comment.ownerReply || busyCommentKey) return;

  const key = `${postId}:${commentIdx}`;
  comment.ownerReply = text;
  openCommentReplyKey = null;
  busyCommentKey = key;
  renderInstaApp(body, onHudUpdate, showToast);

  try {
    const res = await generateInstaCommentReply(post, comment, text);
    if (res.shouldReply && res.replyText) {
      comment.followUpReply = res.replyText;
    }
    post.likes = Math.max(0, (post.likes || 0) + (res.bonusLikes || 0));
    if (res.followerDelta) {
      gameState.followers = Math.max(0, gameState.followers + res.followerDelta);
      post.followerDelta = (post.followerDelta || 0) + res.followerDelta;
    }
    gameState.mood = Math.min(100, Math.max(10, gameState.mood + (res.followerDelta < 0 ? -2 : 1)));
    saveState();
    onHudUpdate();
    if (res.shouldReply && res.replyText) {
      showToast(`💬 ${comment.author} ответил(а) под постом!`);
    } else {
      showToast('💬 Ответ на комментарий опубликован!');
    }
  } finally {
    busyCommentKey = null;
    renderPhoneScreen(onHudUpdate, showToast);
  }
}

/* ==================== 2. DIRECT (ЖИВОЕ ОБЩЕНИЕ И УМНЫЕ ПРЕДЗАКАЗЫ) ==================== */
function renderDirectApp(body, onHudUpdate, showToast) {
  if (openedDmId) {
    const activeDm = gameState.directMessages.find((m) => m.id === openedDmId);
    if (activeDm) {
      renderOpenedDmChat(activeDm, body, onHudUpdate, showToast);
      return;
    }
    openedDmId = null;
  }

  const listHtml = gameState.directMessages.length
    ? gameState.directMessages.map((dm) => renderDmListItem(dm)).join('')
    : `<p class="muted-text" style="text-align:center; padding: 14px;">Сообщений пока нет. Новые письма приходят сами по ходу дня или по кнопке сверху!</p>`;

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
      dm.read = false;
      gameState.directMessages.unshift(dm);
      trimDirectMessages();
      saveState();
      onHudUpdate();
      showToast(`Новое сообщение от ${dm.senderName}`);
    } finally {
      isFetchingDm = false;
      renderPhoneScreen(onHudUpdate, showToast);
    }
  });

  body.querySelectorAll('[data-open-dm]').forEach((row) => {
    row.addEventListener('click', () => {
      const dm = gameState.directMessages.find((m) => m.id === row.dataset.openDm);
      if (!dm) return;
      openedDmId = dm.id;
      if (!dm.read) {
        dm.read = true;
        saveState();
        onHudUpdate();
      }
      renderPhoneScreen(onHudUpdate, showToast);
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
  } else if (dm.kind === 'review' && !dm.order) {
    icon = '⭐';
    statusText = 'Отзыв';
  } else if (dm.order) {
    icon = '💐';
    if (dm.order.done) {
      statusText = 'Выполнен ✓';
      statusClass = 'badge-ok';
    } else if (dm.order.rejected) {
      statusText = 'Отменён';
      statusClass = 'badge-warn';
    } else if (dm.order.accepted) {
      statusText = `Ждём ${dm.order.dueTimeLabel}`;
      statusClass = 'badge-ok';
    } else {
      statusText = `Запрос ${dm.order.dueTimeLabel}`;
      statusClass = 'badge-warn';
    }
  }

  return `
    <div class="dm-list-item ${!dm.read ? 'unread' : ''}" data-open-dm="${dm.id}">
      <div class="dm-list-avatar">
        ${icon}
        ${!dm.read ? '<span class="dm-unread-dot"></span>' : ''}
      </div>
      <div style="flex:1; min-width:0;">
        <div class="row-between">
          <strong style="font-size:13px;">${escapeHtml(dm.senderName)}</strong>
          <span class="badge ${statusClass}" style="font-size:10px;">${statusText}</span>
        </div>
        <div class="dm-list-preview">${escapeHtml(lastMsg)}</div>
      </div>
      <span class="muted-text" style="font-size:10.5px; flex-shrink:0;">${dm.createdTimeLabel || ''}</span>
    </div>
  `;
}

function renderOpenedDmChat(dm, body, onHudUpdate, showToast) {
  const isBusy = busyDmId === dm.id;
  const hasOrder = Boolean(dm.order);
  const flowerName = dm.order?.flowerName || FLOWERS_CATALOG[dm.order?.typeId]?.name || 'цветы';
  const vaseMatch = hasOrder ? gameState.inventory.find((v) => v.typeId === dm.order.typeId && v.qty >= dm.order.qty) : null;

  const threadList = Array.isArray(dm.thread) && dm.thread.length
    ? dm.thread
    : [
        { sender: 'client', text: dm.text },
        ...(dm.replyText ? [{ sender: 'player', text: dm.replyText }] : [])
      ];

  const threadHtml = threadList
    .map((m) => `<div class="dm-msg ${m.sender}">${escapeHtml(m.text)}</div>`)
    .join('');

  const isBlocked = Boolean(dm.blockedByClient || dm.blockedByPlayer);
  const preObj = hasOrder ? gameState.preorders.find((p) => p.dmId === dm.id && p.status !== 'cancelled') : null;
  const alreadyInShop = preObj && preObj.status === 'in_shop';

  let orderBannerHtml = '';
  if (hasOrder) {
    if (dm.order.done) {
      orderBannerHtml = `
        <div class="dm-order-banner agreed">
          ✅ <strong>Выполнен:</strong> ${dm.order.qty} шт. «${escapeHtml(flowerName)}» • клиент забрал заказ.
        </div>
      `;
    } else if (dm.order.rejected) {
      orderBannerHtml = `
        <div class="dm-order-banner cancelled">
          ❌ <strong>Заказ отменён:</strong> клиент предупреждён и не придёт (если передумаешь — напиши в чат).
        </div>
      `;
    } else if (dm.order.accepted) {
      orderBannerHtml = `
        <div class="dm-order-banner agreed">
          ✅ <strong>Договорились!</strong> ${dm.order.qty} шт. «${escapeHtml(flowerName)}» • к ${dm.order.dueTimeLabel} • ${dm.order.reward} ₽
          ${vaseMatch
            ? `<span style="color:var(--sage-dark); font-weight:800;"> • В наличии ✓</span>`
            : `<span style="color:#9D6F1D; font-weight:800;"> • Докупи к приходу</span>`}
          <div class="muted-text" style="font-size:10.5px; margin-top:2px;">
            Если не сможешь выполнить — просто напиши об этом в чат, клиент поймёт и не придёт.
          </div>
        </div>
      `;
    } else {
      orderBannerHtml = `
        <div class="dm-order-banner">
          💐 <strong>Запрос клиента:</strong> ${dm.order.qty} шт. «${escapeHtml(flowerName)}» • к ${dm.order.dueTimeLabel} • ~${dm.order.reward} ₽
          ${vaseMatch
            ? `<span style="color:var(--sage-dark); font-weight:800;"> • В наличии ✓</span>`
            : `<span style="color:#9D6F1D; font-weight:800;"> • Нет в вазах</span>`}
          <div class="muted-text" style="font-size:10.5px; margin-top:2px;">
            Ответь в чате своими словами: договоритесь или откажи.
          </div>
        </div>
      `;
    }
  }

  body.innerHTML = `
    <div class="dm-chat-topbar">
      <button class="btn btn-soft" id="btn-dm-back" style="padding:5px 9px; font-size:11.5px;">← Чаты</button>
      <div style="flex:1; min-width:0; text-align:center;">
        <strong style="font-size:13px;">${escapeHtml(dm.senderName)}</strong>
      </div>
      ${dm.blockedByClient ? `
        <span class="badge badge-warn">В ЧС</span>
      ` : dm.blockedByPlayer ? `
        <button class="btn btn-soft" id="btn-dm-unblock" style="padding:5px 8px; font-size:11px;">Разблок.</button>
      ` : `
        <button class="btn btn-danger" id="btn-dm-block" style="padding:5px 8px; font-size:11px;">🚫 Блок</button>
      `}
    </div>

    <div class="dm-card">
      <div class="dm-thread" style="max-height: 250px; overflow-y: auto;">
        ${threadHtml}
        ${isBusy ? `<div class="dm-msg system">💬 ${escapeHtml(dm.senderName)} печатает...</div>` : ''}
      </div>

      ${orderBannerHtml}

      ${dm.blockedByClient ? `
        <div class="dm-blocked-banner">⛔ Пользователь заблокировал вас из-за грубого общения. Переписка закрыта.</div>
      ` : dm.blockedByPlayer ? `
        <div class="dm-blocked-banner">🚫 Вы заблокировали этого пользователя.</div>
      ` : alreadyInShop ? `
        <span class="badge badge-warn" style="align-self:flex-start;">🔔 Клиент уже в зале забирает заказ! Перейди в «Магазин».</span>
      ` : !(hasOrder && dm.order.done) ? `
        <div class="row-between" style="gap: 6px;">
          <input type="text" class="form-input" id="dm-reply-${dm.id}" data-dm-reply-input="${dm.id}" autocomplete="off" data-form-type="other" data-lpignore="true" placeholder="Напиши клиенту в Direct..." style="padding: 7px 10px; font-size: 12.5px;" ${isBusy ? 'disabled' : ''} />
          <button class="btn btn-primary" data-reply-dm="${dm.id}" ${isBusy ? 'disabled' : ''} style="padding: 8px 12px; font-size: 12.5px;">➤</button>
        </div>
      ` : ''}
    </div>
  `;

  const threadEl = body.querySelector('.dm-thread');
  if (threadEl) threadEl.scrollTop = threadEl.scrollHeight;

  document.getElementById('btn-dm-back')?.addEventListener('click', () => {
    openedDmId = null;
    renderPhoneScreen(onHudUpdate, showToast);
  });

  document.getElementById('btn-dm-block')?.addEventListener('click', () => {
    dm.blockedByPlayer = true;
    if (dm.order && !dm.order.done) {
      dm.order.accepted = false;
      dm.order.rejected = true;
      gameState.preorders = gameState.preorders.filter((p) => p.dmId !== dm.id);
    }
    if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
    dm.thread.push({ sender: 'system', text: '🚫 Вы заблокировали этого пользователя.' });
    saveState();
    onHudUpdate();
    showToast(`Пользователь ${dm.senderName} заблокирован`);
    renderPhoneScreen(onHudUpdate, showToast);
  });

  document.getElementById('btn-dm-unblock')?.addEventListener('click', () => {
    dm.blockedByPlayer = false;
    if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
    dm.thread.push({ sender: 'system', text: '🔓 Вы разблокировали этого пользователя.' });
    saveState();
    showToast(`Пользователь ${dm.senderName} разблокирован`);
    renderPhoneScreen(onHudUpdate, showToast);
  });

  body.querySelectorAll('[data-reply-dm]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(`dm-reply-${dm.id}`);
      const text = input?.value.trim();
      if (text) handleDirectReply(dm.id, text, body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-dm-reply-input]').forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !busyDmId) {
        const text = input.value.trim();
        if (text) handleDirectReply(dm.id, text, body, onHudUpdate, showToast);
      }
    });
  });
}

function syncAgreedPreorder(dm, orderData) {
  dm.kind = 'preorder';
  dm.order = {
    ...orderData,
    accepted: true,
    rejected: false,
    done: false
  };

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
      day: gameState.day,
      status: 'waiting'
    });
  }
}

async function handleDirectReply(dmId, text, body, onHudUpdate, showToast) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || busyDmId || dm.blockedByClient || dm.blockedByPlayer) return;
  if (dm.order && dm.order.done) return;

  if (!Array.isArray(dm.thread)) {
    dm.thread = [{ sender: 'client', text: dm.text }];
  }
  dm.thread.push({ sender: 'player', text });
  dm.replyText = text;
  dm.read = true;
  busyDmId = dmId;

  const wasAccepted = Boolean(dm.order && dm.order.accepted);
  const prevTimeLabel = dm.order?.dueTimeLabel || '';
  const prevTypeId = dm.order?.typeId || '';

  renderDirectApp(body, onHudUpdate, showToast);

  try {
    const res = await generateDirectFollowUp(dm, text);
    dm.thread.push({ sender: 'client', text: res.reply });

    if (res.blockedByClient) {
      dm.blockedByClient = true;
      if (dm.order && !dm.order.done) {
        dm.order.accepted = false;
        dm.order.rejected = true;
        gameState.preorders = gameState.preorders.filter((p) => p.dmId !== dm.id);
      }
      gameState.followers = Math.max(0, gameState.followers - 1);
      gameState.mood = Math.max(10, gameState.mood - 5);
      showToast(`⛔ ${dm.senderName} заблокировал(а) вас за грубость!`);
    } else if (res.dealDecision === 'cancelled') {
      if (dm.order) {
        dm.order.accepted = false;
        dm.order.rejected = true;
      }
      gameState.preorders = gameState.preorders.filter((p) => !(p.dmId === dm.id && p.status !== 'done'));
      if (wasAccepted || dm.order) {
        dm.thread.push({ sender: 'system', text: '❌ Договорённость отменена — клиент не придёт в зал.' });
        showToast(`❌ Заказ от ${dm.senderName} отменён`);
      } else {
        showToast(`💬 ${dm.senderName} ответил(а) в Direct`);
      }
      gameState.mood = Math.max(10, gameState.mood + (res.moodDelta || 0));
    } else if (res.dealDecision === 'agreed' && res.orderData) {
      syncAgreedPreorder(dm, res.orderData);
      const changedDetails = wasAccepted && (prevTimeLabel !== res.orderData.dueTimeLabel || prevTypeId !== res.orderData.typeId);
      if (!wasAccepted || changedDetails) {
        dm.thread.push({
          sender: 'system',
          text: `✅ Договорились! Клиент придёт к ${res.orderData.dueTimeLabel} за ${res.orderData.qty} шт. «${res.orderData.flowerName}».`
        });
        showToast(`🤝 Договорились с ${dm.senderName} на ${res.orderData.dueTimeLabel}!`);
      } else {
        showToast(`💬 ${dm.senderName} подтвердил(а) визит к ${res.orderData.dueTimeLabel}`);
      }
    } else if (res.dealDecision === 'proposed' && res.orderData) {
      dm.kind = 'preorder';
      dm.order = {
        ...res.orderData,
        accepted: false,
        rejected: false,
        done: false
      };
      gameState.preorders = gameState.preorders.filter((p) => !(p.dmId === dm.id && p.status !== 'done'));
      showToast(`💐 ${dm.senderName} предлагает предзаказ — ответь в чате!`);
    } else {
      showToast(`💬 ${dm.senderName} ответил(а) в Direct`);
    }

    if (!res.blockedByClient && !dm.rewardedFollowUp) {
      dm.rewardedFollowUp = true;
      gameState.mood = Math.max(0, Math.min(100, gameState.mood + (res.moodDelta || 2)));
      if (text.length >= 6 && res.followerDelta > 0) {
        gameState.followers += res.followerDelta;
      }
    }

    saveState();
    onHudUpdate();
  } finally {
    busyDmId = null;
    renderPhoneScreen(onHudUpdate, showToast);
  }
}

function trimDirectMessages() {
  if (gameState.directMessages.length <= 12) return;
  const keepImportant = gameState.directMessages.filter(
    (m) => !m.read || (m.order && m.order.accepted && !m.order.done)
  );
  const others = gameState.directMessages.filter(
    (m) => m.read && !(m.order && m.order.accepted && !m.order.done)
  );
  const combined = [...keepImportant, ...others];
  gameState.directMessages = combined.slice(0, Math.max(12, keepImportant.length));
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
  const activeFilter = window._fleurDecorFilter || 'all';
  const filters = [
    { id: 'all', label: 'Все' },
    { id: 'Магазин', label: '🏪 Зал' },
    { id: 'Квартира', label: '🏠 Дом' },
    { id: 'holiday', label: '🎄 Праздник/Сезон' }
  ];

  const filtered = DECOR_CATALOG.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'holiday') return item.category === 'Праздник' || item.category === 'Сезон';
    return item.place === activeFilter;
  });

  const filtersHtml = `
    <div class="hashtags-row" style="padding: 0 2px;">
      ${filters.map((f) => `
        <button class="hashtag-chip ${activeFilter === f.id ? 'active' : ''}" data-decor-filter="${f.id}">
          ${f.label}
        </button>
      `).join('')}
    </div>
  `;

  const itemsHtml = filtered
    .map((item) => {
      const owned = gameState.decor.includes(item.id) || (item.id === 'fridge' && gameState.hasFridge);
      const isHidden = (gameState.hiddenDecor || []).includes(item.id);
      const catLabel = item.category && item.category !== 'Обычный' ? ` • ${item.category}` : '';

      let btnHtml = `
        <button class="btn btn-primary" data-buy-decor="${item.id}" style="padding:7px 10px; font-size:11.5px;">
          ${item.price} ₽
        </button>
      `;
      if (owned && item.id === 'fridge') {
        btnHtml = `<span class="badge badge-ok">Включён ✓</span>`;
      } else if (owned) {
        btnHtml = `
          <button class="btn ${isHidden ? 'btn-sage' : 'btn-soft'}" data-toggle-decor-phone="${item.id}" style="padding:7px 9px; font-size:11px;">
            ${isHidden ? '📦 Повесить' : '✓ Висит'}
          </button>
        `;
      }

      return `
        <div class="decor-item-card">
          <div class="decor-icon-box">${item.icon}</div>
          <div style="flex:1; min-width:0;">
            <div class="row-between">
              <strong style="font-size:12.5px;">${item.name}</strong>
              <span class="badge badge-ok">${item.place}${catLabel}</span>
            </div>
            <p class="muted-text" style="font-size:11px; margin-top:2px;">${item.effectText}</p>
          </div>
          ${btnHtml}
        </div>
      `;
    })
    .join('');

  body.innerHTML = `
    <p class="muted-text" style="padding: 0 4px;">Покупай и вешай обычный, сезонный и праздничный декор!</p>
    ${filtersHtml}
    ${itemsHtml}
  `;

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
      if (Array.isArray(gameState.hiddenDecor)) {
        gameState.hiddenDecor = gameState.hiddenDecor.filter((id) => id !== item.id);
      }
      gameState.mood = Math.min(100, gameState.mood + item.moodBonus);

      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`✨ Куплено и повешено: ${item.name}!`);
      renderDecorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-toggle-decor-phone]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggleDecorPhone;
      if (!Array.isArray(gameState.hiddenDecor)) gameState.hiddenDecor = [];
      if (gameState.hiddenDecor.includes(id)) {
        gameState.hiddenDecor = gameState.hiddenDecor.filter((x) => x !== id);
        showToast('✨ Украшение повешено!');
      } else {
        gameState.hiddenDecor.push(id);
        showToast('📦 Украшение убрано');
      }
      saveState();
      renderDecorApp(body, onHudUpdate, showToast);
    });
  });
}

function isShopDecorVisible(id) {
  if (id === 'fridge') {
    return Boolean(gameState.hasFridge || (gameState.decor || []).includes('fridge')) && !(gameState.hiddenDecor || []).includes('fridge');
  }
  return (gameState.decor || []).includes(id) && !(gameState.hiddenDecor || []).includes(id);
}

function captureShopInteriorPhoto() {
  const c = document.createElement('canvas');
  c.width = 480;
  c.height = 480;
  const ctx = c.getContext('2d');

  const isEvening = gameState.timeIndex === 2 || (gameState.timeMinutes || 540) >= (gameState.closeHour || 21) * 60;
  const season = getSeasonInfo(getGameDateObj(gameState.startDate, gameState.day - 1));

  if (gameState.powerOutage) {
    ctx.fillStyle = gameState.candlesLit ? '#4E3F38' : '#3E373D';
  } else {
    ctx.fillStyle = isEvening ? '#DFCBB9' : '#F6ECE1';
  }
  ctx.fillRect(0, 0, 480, 480);

  // Винтажные обои
  if (isShopDecorVisible('vintage_wallpaper')) {
    ctx.fillStyle = 'rgba(217, 138, 124, 0.18)';
    for (let x = 22; x < 480; x += 44) {
      for (let y = 26; y < 340; y += 44) {
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = 'rgba(137, 168, 139, 0.14)';
    for (let x = 44; x < 480; x += 44) {
      for (let y = 48; y < 340; y += 44) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Окно слева
  ctx.fillStyle = isEvening ? '#5E648B' : gameState.weather === 'rainy' ? '#95A9B8' : '#BCE1F5';
  ctx.fillRect(34, 58, 166, 128);
  ctx.fillStyle = season.id === 'winter' ? '#F2F7FA' : season.id === 'autumn' ? '#D98A4E' : '#9CC494';
  ctx.fillRect(34, 154, 166, 32);
  ctx.strokeStyle = '#FFFDF9';
  ctx.lineWidth = 7;
  ctx.strokeRect(34, 58, 166, 128);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(117, 58);
  ctx.lineTo(117, 186);
  ctx.moveTo(34, 124);
  ctx.lineTo(200, 124);
  ctx.stroke();

  // Вывеска справа
  ctx.fillStyle = '#FFFDF9';
  ctx.fillRect(236, 58, 206, 54);
  ctx.strokeStyle = isShopDecorVisible('neon_sign') ? '#E58A94' : '#D5C3B3';
  ctx.lineWidth = isShopDecorVisible('neon_sign') ? 4.5 : 3;
  ctx.strokeRect(236, 58, 206, 54);
  ctx.fillStyle = isShopDecorVisible('neon_sign') ? '#C96577' : '#5C4A42';
  ctx.font = 'bold 19px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText((gameState.shopName || 'Fleur Atelier').slice(0, 18), 339, 91);

  // Цветочная арка с плющом сверху
  if (isShopDecorVisible('shop_arch')) {
    ctx.strokeStyle = '#5A8357';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(6, 52);
    ctx.quadraticCurveTo(30, 14, 110, 14);
    ctx.lineTo(370, 14);
    ctx.quadraticCurveTo(450, 14, 474, 52);
    ctx.stroke();

    for (let lx = 38; lx <= 442; lx += 44) {
      ctx.fillStyle = '#6E9E69';
      ctx.beginPath();
      ctx.ellipse(lx, 18, 11, 5.5, (lx % 88 === 0 ? 0.3 : -0.3), 0, Math.PI * 2);
      ctx.fill();
    }
    [22, 126, 240, 354, 458].forEach((fx, idx) => {
      const fy = idx === 0 || idx === 4 ? 36 : 16;
      ctx.fillStyle = idx % 2 === 0 ? '#F29AA4' : '#F6B8BF';
      ctx.beginPath();
      ctx.arc(fx, fy, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFE28A';
      ctx.beginPath();
      ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Гирлянда из сердечек
  if (isShopDecorVisible('hearts_garland_shop')) {
    ctx.strokeStyle = '#C99B95';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 32);
    ctx.quadraticCurveTo(130, 52, 240, 34);
    ctx.quadraticCurveTo(350, 52, 460, 32);
    ctx.stroke();
    [60, 130, 200, 280, 350, 420].forEach((hx, idx) => {
      const hy = idx % 2 === 0 ? 44 : 40;
      ctx.fillStyle = idx % 2 === 0 ? '#E87A88' : '#F4A6B1';
      ctx.beginPath();
      ctx.arc(hx - 4, hy, 4.5, 0, Math.PI * 2);
      ctx.arc(hx + 4, hy, 4.5, 0, Math.PI * 2);
      ctx.lineTo(hx, hy + 10);
      ctx.closePath();
      ctx.fill();
    });
  }

  // Праздничный венок на стене
  if (isShopDecorVisible('wreath_shop')) {
    ctx.save();
    ctx.strokeStyle = '#4D7D4E';
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.arc(248, 165, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#D95A62';
    ctx.beginPath();
    ctx.ellipse(240, 141, 8, 5, -0.3, 0, Math.PI * 2);
    ctx.ellipse(256, 141, 8, 5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    [231, 265, 248].forEach((bx, i) => {
      ctx.fillStyle = i === 2 ? '#E8B84B' : '#D9534F';
      ctx.beginPath();
      ctx.arc(bx, i === 2 ? 185 : 165, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // Винтажное зеркало на стене
  if (isShopDecorVisible('shop_mirror')) {
    ctx.save();
    ctx.fillStyle = '#C9A36B';
    ctx.strokeStyle = '#8F6E3E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(324, 168, 22, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#DCECF5';
    ctx.beginPath();
    ctx.ellipse(324, 168, 16, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(315, 158);
    ctx.lineTo(331, 150);
    ctx.moveTo(313, 170);
    ctx.lineTo(333, 160);
    ctx.stroke();
    ctx.restore();
  }

  // Меловая доска «Букет дня»
  if (isShopDecorVisible('shop_chalkboard')) {
    ctx.save();
    ctx.fillStyle = '#A97D59';
    ctx.fillRect(368, 136, 70, 56);
    ctx.fillStyle = '#3B4540';
    ctx.fillRect(374, 142, 58, 44);
    ctx.fillStyle = '#F5EFE6';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('БУКЕТ ДНЯ', 403, 154);
    ctx.strokeStyle = '#98C496';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(403, 178);
    ctx.lineTo(403, 166);
    ctx.stroke();
    ctx.fillStyle = '#F29AA4';
    ctx.beginPath();
    ctx.arc(403, 164, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Холодильная витрина
  if (isShopDecorVisible('fridge')) {
    ctx.save();
    ctx.fillStyle = '#E8F3F7';
    ctx.strokeStyle = '#A6C1CC';
    ctx.lineWidth = 3;
    ctx.fillRect(392, 206, 62, 134);
    ctx.strokeRect(392, 206, 62, 134);
    ctx.fillStyle = '#D2EAF4';
    ctx.fillRect(399, 214, 48, 102);
    ctx.strokeStyle = '#A6C1CC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(399, 265);
    ctx.lineTo(447, 265);
    ctx.stroke();
    ctx.fillStyle = '#E87A88';
    ctx.beginPath();
    ctx.arc(415, 250, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F4C752';
    ctx.beginPath();
    ctx.arc(431, 250, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#B59ED6';
    ctx.beginPath();
    ctx.arc(423, 302, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Новогодняя ёлка в углу за прилавком
  if (isShopDecorVisible('xmas_tree_shop')) {
    ctx.save();
    ctx.fillStyle = '#9E6B4B';
    ctx.fillRect(42, 316, 20, 24);
    ctx.fillStyle = '#3D7047';
    ctx.beginPath();
    ctx.moveTo(52, 232);
    ctx.lineTo(14, 322);
    ctx.lineTo(90, 322);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#4B8556';
    ctx.beginPath();
    ctx.moveTo(52, 208);
    ctx.lineTo(22, 278);
    ctx.lineTo(82, 278);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFD95E';
    ctx.beginPath();
    ctx.arc(52, 202, 7, 0, Math.PI * 2);
    ctx.fill();
    [
      { x: 44, y: 254, c: '#E45A63' },
      { x: 62, y: 268, c: '#F4C752' },
      { x: 36, y: 296, c: '#7FB8E0' },
      { x: 64, y: 304, c: '#E45A63' }
    ].forEach((b) => {
      ctx.fillStyle = b.c;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // Деревянный прилавок
  ctx.fillStyle = '#C9A789';
  ctx.fillRect(24, 340, 432, 22);
  ctx.fillStyle = '#EADBC9';
  ctx.fillRect(0, 362, 480, 118);

  // Живые вазы с цветами на прилавке
  const vaseColors = ['#EBD9CE', '#DCE6DB', '#F3DFDC', '#DFD9EA'];
  const count = Math.min(4, Math.max(1, gameState.inventory.length));
  const hasPumpkins = isShopDecorVisible('pumpkins_shop');
  const startX = hasPumpkins ? 70 : 95;
  const stepX = hasPumpkins ? 72 : 88;

  for (let i = 0; i < count; i++) {
    const item = gameState.inventory[i];
    const meta = item ? FLOWERS_CATALOG[item.typeId] : null;
    const vx = startX + i * stepX;
    ctx.fillStyle = meta?.vaseColor || vaseColors[i % vaseColors.length];
    ctx.fillRect(vx, 282, 38, 58);
    ctx.fillStyle = '#6E9971';
    ctx.fillRect(vx + 16, 238, 6, 44);
    ctx.fillStyle =
      meta?.color === 'красный' ? '#E2626B' :
      meta?.color === 'жёлтый' ? '#F4C752' :
      meta?.color === 'белый' ? '#FFFDF9' :
      meta?.color === 'сиреневый' ? '#B296D4' :
      meta?.color === 'голубой' || meta?.color === 'синий' ? '#79AFDC' :
      '#E98387';
    ctx.beginPath();
    ctx.arc(vx + 19, 232, 15, 0, Math.PI * 2);
    ctx.fill();
  }

  // Осенние тыквы прямо на прилавке справа
  if (hasPumpkins) {
    ctx.save();
    // Листочки
    ctx.fillStyle = '#D96E34';
    ctx.beginPath();
    ctx.ellipse(354, 336, 10, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Большая тыква
    ctx.strokeStyle = '#5A7247';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(384, 300);
    ctx.lineTo(388, 290);
    ctx.stroke();
    ctx.fillStyle = '#DF7135';
    ctx.beginPath();
    ctx.ellipse(384, 321, 22, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F29457';
    ctx.beginPath();
    ctx.ellipse(384, 321, 8, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    // Вторая светлая тыковка рядом
    ctx.fillStyle = '#E8AE52';
    ctx.beginPath();
    ctx.ellipse(420, 326, 15, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F5C776';
    ctx.beginPath();
    ctx.ellipse(420, 326, 6, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Свечка при отключении света
  if (gameState.powerOutage && gameState.candlesLit) {
    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(36, 314, 12, 26);
    ctx.fillStyle = 'rgba(255, 200, 90, 0.35)';
    ctx.beginPath();
    ctx.arc(42, 304, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFB74D';
    ctx.beginPath();
    ctx.ellipse(42, 306, 4, 7, 0, 0, Math.PI * 2);
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

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}