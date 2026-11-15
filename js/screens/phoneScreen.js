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
let rejectOpenDmId = null;
let openCommentReplyKey = null;
let busyCommentKey = null;
let frostThermalWrap = true;

const DIRECT_REJECT_TEMPLATES = [
  'Нет нужных цветов в наличии',
  'Слишком много заказов, не успеем',
  'Слишком низкий бюджет для такого заказа',
  'Лавка скоро закрывается'
];

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

/* ==================== 2. DIRECT (СВОРАЧИВАЕМЫЕ ЧАТЫ, БЛОКИ, ЗАКАЗЫ) ==================== */
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
      rejectOpenDmId = null;
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
  } else if (dm.kind === 'review') {
    icon = '⭐';
    statusText = 'Отзыв';
  } else if (dm.kind === 'preorder' && dm.order) {
    icon = '💐';
    if (dm.order.done) {
      statusText = 'Выполнен ✓';
      statusClass = 'badge-ok';
    } else if (dm.order.rejected) {
      statusText = 'Отклонён';
    } else if (dm.order.accepted) {
      statusText = `Ждём ${dm.order.dueTimeLabel}`;
      statusClass = 'badge-ok';
    } else {
      statusText = `Заказ ${dm.order.dueTimeLabel}`;
      statusClass = 'badge-ok';
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
  const hasOrder = dm.kind === 'preorder' && dm.order;
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
  const canActOnOrder = !isBlocked && hasOrder && !dm.order.done && !dm.order.rejected;
  const isRejectOpen = rejectOpenDmId === dm.id;
  const preObj = hasOrder ? gameState.preorders.find((p) => p.dmId === dm.id) : null;
  const alreadyInShop = preObj && preObj.status === 'in_shop';

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
      <div class="dm-thread" style="max-height: 240px; overflow-y: auto;">
        ${threadHtml}
        ${isBusy ? `<div class="dm-msg system">💬 ${escapeHtml(dm.senderName)} печатает...</div>` : ''}
      </div>

      ${hasOrder ? `
        <div class="muted-text" style="font-size:11.5px; background: var(--bg-soft); padding: 6px 8px; border-radius: 8px;">
          💐 <strong>${dm.order.qty} шт. «${escapeHtml(flowerName)}»</strong> • к ${dm.order.dueTimeLabel} • ${dm.order.reward} ₽
          ${!isBlocked && !dm.order.done && !dm.order.rejected ? (
            vaseMatch
              ? `<span style="color:var(--sage-dark); font-weight:700;"> • В наличии ✓</span>`
              : `<span style="color:#9D6F1D; font-weight:700;"> • Нужно докупить к приходу</span>`
          ) : ''}
        </div>
      ` : ''}

      ${dm.blockedByClient ? `
        <div class="dm-blocked-banner">⛔ Пользователь заблокировал вас из-за грубого общения. Переписка закрыта.</div>
      ` : dm.blockedByPlayer ? `
        <div class="dm-blocked-banner">🚫 Вы заблокировали этого пользователя.</div>
      ` : `
        ${canActOnOrder && !dm.order.accepted ? `
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sage" data-accept-dm="${dm.id}" ${isBusy ? 'disabled' : ''} style="flex:1; padding:7px; font-size:12px;">
              ✅ Принять на ${dm.order.dueTimeLabel}
            </button>
            <button class="btn btn-danger" data-open-reject-dm="${dm.id}" ${isBusy ? 'disabled' : ''} style="padding:7px 10px; font-size:12px;">
              ❌ Отказать
            </button>
          </div>
        ` : ''}

        ${canActOnOrder && dm.order.accepted && !alreadyInShop ? `
          <div style="display:flex; gap:6px; align-items:center;">
            <span class="muted-text" style="font-size:11px; flex:1;">🕒 В очереди зала на ${dm.order.dueTimeLabel}</span>
            <button class="btn btn-danger" data-open-reject-dm="${dm.id}" ${isBusy ? 'disabled' : ''} style="padding:5px 9px; font-size:11px;">
              🚫 Отменить заказ
            </button>
          </div>
        ` : ''}

        ${alreadyInShop ? `
          <span class="badge badge-warn" style="align-self:flex-start;">🔔 Клиент уже в зале забирает заказ!</span>
        ` : ''}

        ${isRejectOpen && canActOnOrder ? `
          <div class="reject-box">
            <div class="row-between">
              <strong style="font-size:11.5px;">Причина отказа (клиент увидит её):</strong>
              <button class="btn btn-soft" data-open-reject-dm="${dm.id}" style="padding:2px 7px; font-size:11px;">✕</button>
            </div>
            <div class="reject-chips">
              ${DIRECT_REJECT_TEMPLATES.map((tpl) => `
                <button class="reject-chip" data-dm-id="${dm.id}" data-reject-template="${escapeAttr(tpl)}" ${isBusy ? 'disabled' : ''}>
                  ${escapeHtml(tpl)}
                </button>
              `).join('')}
            </div>
            <div style="display:flex; gap:5px;">
              <input type="text" class="form-input" id="dm-reject-input-${dm.id}" autocomplete="off" data-form-type="other" data-lpignore="true" placeholder="Или напиши свою причину..." style="padding:6px 8px; font-size:11.5px;" ${isBusy ? 'disabled' : ''} />
              <button class="btn btn-danger" data-send-custom-reject="${dm.id}" ${isBusy ? 'disabled' : ''} style="padding:6px 10px; font-size:11.5px;">
                Отказать
              </button>
            </div>
          </div>
        ` : ''}

        ${!(hasOrder && dm.order.rejected) && !(hasOrder && dm.order.done) ? `
          <div class="row-between" style="gap: 6px;">
            <input type="text" class="form-input" id="dm-reply-${dm.id}" data-dm-reply-input="${dm.id}" autocomplete="off" data-form-type="other" data-lpignore="true" placeholder="Написать в Direct..." style="padding: 6px 9px; font-size: 12px;" ${isBusy ? 'disabled' : ''} />
            <button class="btn btn-primary" data-reply-dm="${dm.id}" ${isBusy ? 'disabled' : ''} style="padding: 7px 10px; font-size: 12px;">➤</button>
          </div>
        ` : ''}
      `}
    </div>
  `;

  document.getElementById('btn-dm-back')?.addEventListener('click', () => {
    openedDmId = null;
    rejectOpenDmId = null;
    renderPhoneScreen(onHudUpdate, showToast);
  });

  document.getElementById('btn-dm-block')?.addEventListener('click', () => {
    dm.blockedByPlayer = true;
    rejectOpenDmId = null;
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

  body.querySelectorAll('[data-accept-dm]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!dm.order || dm.order.accepted || dm.order.rejected || dm.order.done) return;

      const closeMin = (gameState.closeHour || 21) * 60;
      const curMin = gameState.timeMinutes || 540;
      let dueMinutes = dm.order.dueMinutes || curMin + 60;
      if (dueMinutes < curMin + 15) {
        dueMinutes = Math.min(closeMin - 10, curMin + 35);
      }
      const dueTimeLabel = formatMinutesAsTime(dueMinutes);

      dm.order.dueMinutes = dueMinutes;
      dm.order.dueTimeLabel = dueTimeLabel;
      dm.order.accepted = true;
      dm.read = true;
      rejectOpenDmId = null;

      if (!Array.isArray(dm.thread) || dm.thread.length === 0) {
        dm.thread = [{ sender: 'client', text: dm.text }];
      }
      dm.thread.push({
        sender: 'system',
        text: `✅ Предзаказ принят на ${dueTimeLabel}! Заказчик придёт в зал в это время.`
      });

      const flowerMeta = FLOWERS_CATALOG[dm.order.typeId];
      const fName = dm.order.flowerName || flowerMeta?.name || 'цветы';

      if (!gameState.preorders.find((p) => p.dmId === dm.id)) {
        gameState.preorders.push({
          id: 'pre_' + dm.id,
          dmId: dm.id,
          senderName: dm.senderName,
          typeId: dm.order.typeId,
          flowerName: fName,
          qty: dm.order.qty,
          reward: dm.order.reward,
          dueMinutes,
          dueTimeLabel,
          day: gameState.day,
          status: 'waiting'
        });
      }

      saveState();
      onHudUpdate();
      showToast(`🕒 Предзаказ от ${dm.senderName} принят на ${dueTimeLabel}!`);
      renderPhoneScreen(onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-open-reject-dm]').forEach((btn) => {
    btn.addEventListener('click', () => {
      rejectOpenDmId = rejectOpenDmId === dm.id ? null : dm.id;
      renderPhoneScreen(onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-reject-template]').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleDirectRejection(dm.id, btn.dataset.rejectTemplate, body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-send-custom-reject]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(`dm-reject-input-${dm.id}`);
      const reason = input?.value.trim();
      if (!reason) {
        showToast('Напиши причину или нажми быстрый шаблон');
        return;
      }
      handleDirectRejection(dm.id, reason, body, onHudUpdate, showToast);
    });
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

async function handleDirectReply(dmId, text, body, onHudUpdate, showToast) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || busyDmId || dm.blockedByClient || dm.blockedByPlayer) return;

  if (!Array.isArray(dm.thread)) {
    dm.thread = [{ sender: 'client', text: dm.text }];
  }
  dm.thread.push({ sender: 'player', text });
  dm.replyText = text;
  dm.read = true;
  busyDmId = dmId;

  renderDirectApp(body, onHudUpdate, showToast);

  try {
    const res = await generateDirectFollowUp(dm, text, 'reply');
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
    } else {
      if (res.newOrder && !dm.order) {
        dm.kind = 'preorder';
        dm.order = {
          ...res.newOrder,
          accepted: false,
          rejected: false,
          done: false
        };
        showToast(`💐 ${dm.senderName} хочет оформить предзаказ в переписке!`);
      } else {
        showToast(`💬 ${dm.senderName} ответил(а) в Direct`);
      }

      if (!dm.rewardedFollowUp) {
        dm.rewardedFollowUp = true;
        gameState.mood = Math.max(0, Math.min(100, gameState.mood + (res.moodDelta || 2)));
        if (text.length >= 6 && res.followerDelta > 0) {
          gameState.followers += res.followerDelta;
        }
      }
    }

    saveState();
    onHudUpdate();
  } finally {
    busyDmId = null;
    renderPhoneScreen(onHudUpdate, showToast);
  }
}

async function handleDirectRejection(dmId, reason, body, onHudUpdate, showToast) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || !dm.order || busyDmId || dm.blockedByClient || dm.blockedByPlayer) return;

  if (!Array.isArray(dm.thread)) {
    dm.thread = [{ sender: 'client', text: dm.text }];
  }
  dm.thread.push({
    sender: 'player',
    text: `Извините, не сможем выполнить заказ. Причина: ${reason}`
  });
  dm.read = true;
  rejectOpenDmId = null;
  busyDmId = dmId;

  renderDirectApp(body, onHudUpdate, showToast);

  try {
    const res = await generateDirectFollowUp(dm, reason, 'reject');
    dm.thread.push({ sender: 'client', text: res.reply });
    dm.rejectAttempts = (dm.rejectAttempts || 0) + 1;

    if (res.blockedByClient) {
      dm.blockedByClient = true;
      dm.order.rejected = true;
      dm.order.accepted = false;
      gameState.preorders = gameState.preorders.filter((p) => p.dmId !== dm.id);
      gameState.followers = Math.max(0, gameState.followers - 1);
      gameState.mood = Math.max(10, gameState.mood - 5);
      showToast(`⛔ ${dm.senderName} заблокировал(а) вас за грубость!`);
    } else if (res.persuadeAttempt) {
      if (res.shiftMinutes) {
        const closeMin = (gameState.closeHour || 21) * 60;
        dm.order.dueMinutes = Math.min(closeMin - 10, (dm.order.dueMinutes || 720) + res.shiftMinutes);
        dm.order.dueTimeLabel = formatMinutesAsTime(dm.order.dueMinutes);
      }
      if (res.offerTipBoost) {
        dm.order.reward += res.offerTipBoost;
      }
      dm.order.accepted = false;
      gameState.preorders = gameState.preorders.filter((p) => p.dmId !== dm.id);
      showToast(`💬 ${dm.senderName} просит не отказывать и предлагает компромисс!`);
    } else {
      dm.order.rejected = true;
      dm.order.accepted = false;
      gameState.preorders = gameState.preorders.filter((p) => p.dmId !== dm.id);
      gameState.mood = Math.max(10, gameState.mood + (res.moodDelta || -1));
      showToast(`Заказ от ${dm.senderName} отклонён`);
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

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}