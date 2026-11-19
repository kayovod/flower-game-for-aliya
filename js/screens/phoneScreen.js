import {
  FLOWERS_CATALOG,
  ACCESSORIES_CATALOG,
  INSTA_HASHTAGS,
  DECOR_CATALOG,
  SHOP_LOCATIONS,
  HOME_LOCATIONS,
  JOB_ROLES,
  JOB_SCHEDULES,
  getGameDateObj,
  getSeasonInfo,
  getHolidayForDate
} from '../config.js';
import { gameState, saveState, ensureDailyRareDecor, getTotalGameMinutes } from '../state.js';
import { getSingleFlowerWrappedSvg } from '../graphics/flowersSvg.js';
import {
  evaluateInstaPost,
  generateInstaCommentReply,
  generateDirectMessage,
  generateDirectFollowUp,
  generateDirectRejectionReply,
  generateJobCandidateDm,
  generateCandidateInterviewReply,
  generateCandidateHireReaction,
  formatMinutesAsTime
} from '../ai.js';
import { playShutterSound, playCoinSound, playBellSound } from '../sound.js';

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
let showDmPhotoPicker = false;
let selectedDmPhotoId = null;
let showDmRejectMenu = false;

let showJobForm = false;
let draftJobRoleId = 'assistant';
let draftJobSalary = 1200;
let draftJobScheduleId = 'full';
let draftJobLocationId = '';

const DIRECT_REJECT_TEMPLATES = [
  'Нет таких цветов',
  'Не успеем к этому времени',
  'Слишком маленький бюджет',
  'Магазин уже закрывается'
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
          <span>Insta</span>
        </button>

        <button class="phone-app-btn ${activeApp === 'direct' ? 'active' : ''}" data-phone-app="direct">
          ${unreadDms > 0 ? `<span class="phone-badge-dot">${unreadDms}</span>` : ''}
          <span class="phone-app-icon">💬</span>
          <span>Direct</span>
        </button>

        <button class="phone-app-btn ${activeApp === 'wholesale' ? 'active' : ''}" data-phone-app="wholesale">
          <span class="phone-app-icon">🚚</span>
          <span>Опт</span>
        </button>

        <button class="phone-app-btn ${activeApp === 'decor' ? 'active' : ''}" data-phone-app="decor">
          <span class="phone-app-icon">🏺</span>
          <span>Декор</span>
        </button>

        <button class="phone-app-btn ${activeApp === 'realtor' ? 'active' : ''}" data-phone-app="realtor">
          <span class="phone-app-icon">🏢</span>
          <span>Риелтор</span>
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
  else if (activeApp === 'decor') renderDecorApp(body, onHudUpdate, showToast);
  else renderRealtorApp(body, onHudUpdate, showToast);
}

/* ==================== 1. INSTAFLOWER (ПОСТЫ, ПРОМО И ВАКАНСИИ) ==================== */
function renderInstaApp(body, onHudUpdate, showToast) {
  const photos = gameState.savedPhotos || [];
  if (selectedPhotoIndex >= photos.length) selectedPhotoIndex = 0;
  const currentPhoto = photos[selectedPhotoIndex] || null;
  const handle = escapeHtml(gameState.instaHandle || '@fleur_atelier');

  const ownedShopLocs = SHOP_LOCATIONS.filter((l) =>
    (gameState.ownedLocations || ['shop_basement']).includes(l.id)
  );
  if (!draftJobLocationId || !ownedShopLocs.some((l) => l.id === draftJobLocationId)) {
    draftJobLocationId = gameState.shopLocationId || ownedShopLocs[0]?.id || 'shop_basement';
  }

  const openJobsCount = (gameState.jobPostings || []).filter((j) => j.status === 'open').length;

  const jobSectionHtml = showJobForm
    ? `
      <div class="job-form-box">
        <div class="row-between">
          <strong style="font-size:13px;">📢 Новая вакансия в ленту</strong>
          <button class="btn btn-soft" id="btn-close-job-form" style="padding:3px 8px; font-size:11px;">✕</button>
        </div>

        <div class="form-group">
          <label class="form-label" for="job-role-select">Должность</label>
          <select class="form-select" id="job-role-select" style="padding:7px 10px; font-size:12.5px;">
            ${JOB_ROLES.map((r) => `<option value="${r.id}" ${r.id === draftJobRoleId ? 'selected' : ''}>${r.icon} ${r.name}</option>`).join('')}
          </select>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
          <div class="form-group">
            <label class="form-label" for="job-salary-input">Ставка (₽/смена)</label>
            <input type="number" class="form-input" id="job-salary-input" value="${draftJobSalary}" min="400" step="50" style="padding:7px 10px; font-size:12.5px;" />
          </div>
          <div class="form-group">
            <label class="form-label" for="job-location-select">Точка</label>
            <select class="form-select" id="job-location-select" style="padding:7px 10px; font-size:12px;">
              ${ownedShopLocs.map((l) => `<option value="${l.id}" ${l.id === draftJobLocationId ? 'selected' : ''}>${escapeHtml(l.name)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="job-schedule-select">График работы</label>
          <select class="form-select" id="job-schedule-select" style="padding:7px 10px; font-size:12px;">
            ${JOB_SCHEDULES.map((s) => `<option value="${s.id}" ${s.id === draftJobScheduleId ? 'selected' : ''}>${s.label}</option>`).join('')}
          </select>
        </div>

        <button class="btn btn-sage" id="btn-publish-job" style="padding:9px 12px; font-size:12.5px;">
          📢 Опубликовать вакансию
        </button>
      </div>
    `
    : `
      <button class="btn btn-sage" id="btn-open-job-form" style="padding:9px 12px; font-size:12.5px;">
        📢 Подать объявление о работе ${openJobsCount > 0 ? `(активно: ${openJobsCount})` : ''}
      </button>
    `;

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
    ${jobSectionHtml}

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

  document.getElementById('btn-open-job-form')?.addEventListener('click', () => {
    showJobForm = true;
    renderInstaApp(body, onHudUpdate, showToast);
  });

  document.getElementById('btn-close-job-form')?.addEventListener('click', () => {
    showJobForm = false;
    renderInstaApp(body, onHudUpdate, showToast);
  });

  document.getElementById('job-role-select')?.addEventListener('change', (e) => {
    draftJobRoleId = e.target.value;
    const roleMeta = JOB_ROLES.find((r) => r.id === draftJobRoleId);
    if (roleMeta) draftJobSalary = roleMeta.baseSalary;
    renderInstaApp(body, onHudUpdate, showToast);
  });

  document.getElementById('job-salary-input')?.addEventListener('input', (e) => {
    draftJobSalary = Math.max(400, Number(e.target.value) || 1200);
  });

  document.getElementById('job-location-select')?.addEventListener('change', (e) => {
    draftJobLocationId = e.target.value;
  });

  document.getElementById('job-schedule-select')?.addEventListener('change', (e) => {
    draftJobScheduleId = e.target.value;
  });

  document.getElementById('btn-publish-job')?.addEventListener('click', () => {
    const roleMeta = JOB_ROLES.find((r) => r.id === draftJobRoleId) || JOB_ROLES[0];
    const locMeta = SHOP_LOCATIONS.find((l) => l.id === draftJobLocationId) || SHOP_LOCATIONS[0];
    const schedMeta = JOB_SCHEDULES.find((s) => s.id === draftJobScheduleId) || JOB_SCHEDULES[0];
    const salary = Math.max(400, Number(document.getElementById('job-salary-input')?.value) || roleMeta.baseSalary);

    const jobId = 'job_' + Date.now();
    const totalNow = getTotalGameMinutes();
    const delayMins = 80 + Math.floor(Math.random() * 70);

    if (!Array.isArray(gameState.jobPostings)) gameState.jobPostings = [];
    gameState.jobPostings.unshift({
      id: jobId,
      roleId: roleMeta.id,
      roleName: roleMeta.name,
      roleIcon: roleMeta.icon,
      salary,
      scheduleId: schedMeta.id,
      scheduleLabel: schedMeta.label,
      locationId: locMeta.id,
      locationName: locMeta.name,
      day: gameState.day,
      postedTotalMin: totalNow,
      nextResponseTotalMin: totalNow + delayMins,
      respondedCount: 0,
      status: 'open'
    });

    gameState.instaPosts.unshift({
      id: 'post_job_' + Date.now(),
      isJobPost: true,
      jobId,
      roleIcon: roleMeta.icon,
      roleName: roleMeta.name,
      salary,
      scheduleLabel: schedMeta.label,
      locationName: locMeta.name,
      likes: 6 + Math.floor(Math.random() * 10),
      followerDelta: 1,
      verdict: 'Вакансия открыта 📢',
      hashtags: ['#работа', '#вакансия', '#флористика'],
      comments: [
        { author: '@marina_v', text: 'Отправлю знакомой, как раз искала подработку в уютном месте!' },
        { author: '@artem_life', text: `Отличная ставка (${salary} ₽/см.), удачи с поисками!` }
      ]
    });

    gameState.followers += 1;
    showJobForm = false;
    playBellSound();
    saveState();
    onHudUpdate();
    showToast('📢 Вакансия опубликована! Отклики придут в Direct через пару игровых часов.');
    renderInstaApp(body, onHudUpdate, showToast);
  });

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

  if (post.isJobPost) {
    const jobObj = (gameState.jobPostings || []).find((j) => j.id === post.jobId);
    const isClosed = jobObj && jobObj.status !== 'open';
    return `
      <div class="insta-job-card">
        <div class="row-between">
          <span style="font-size:12px; font-weight:800;">🌸 ${handle}</span>
          <span class="badge ${isClosed ? 'badge-warn' : 'badge-ok'}">${isClosed ? 'Сотрудник нанят ✓' : 'Вакансия открыта 📢'}</span>
        </div>
        <strong style="font-size:14px;">${post.roleIcon || '💼'} Ищем: ${escapeHtml(post.roleName)}</strong>
        <div class="insta-job-details">
          <span class="job-detail-pill">💰 ${post.salary} ₽ / смена</span>
          <span class="job-detail-pill">🏪 ${escapeHtml(post.locationName)}</span>
          <span class="job-detail-pill">🕒 ${escapeHtml(post.scheduleLabel)}</span>
        </div>
        <div class="row-between" style="font-size:12px;">
          <strong>❤️ ${post.likes || 5}</strong>
          <span class="muted-text" style="font-size:11px;">Отклики приходят в Direct</span>
        </div>
        ${commentsHtml}
      </div>
    `;
  }

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

/* ==================== 2. DIRECT (КЛИЕНТЫ И СОБЕСЕДОВАНИЯ С КАНДИДАТАМИ) ==================== */
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
      const openJob = (gameState.jobPostings || []).find((j) => j.status === 'open' && (j.respondedCount || 0) < 3);
      const totalMin = getTotalGameMinutes();
      const shouldSpawnJob =
        openJob && (totalMin >= (openJob.nextResponseTotalMin || 0) || Math.random() < 0.65);

      if (shouldSpawnJob) {
        const dm = await generateJobCandidateDm(openJob);
        openJob.respondedCount = (openJob.respondedCount || 0) + 1;
        openJob.nextResponseTotalMin = totalMin + 130 + Math.floor(Math.random() * 110);
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
      showDmPhotoPicker = false;
      selectedDmPhotoId = null;
      showDmRejectMenu = false;
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
  if (dm.jobApplication) {
    renderJobInterviewChat(dm, body, onHudUpdate, showToast);
    return;
  }

  const isBusy = busyDmId === dm.id;
  const hasOrder = Boolean(dm.order);
  const flowerName = dm.order?.flowerName || FLOWERS_CATALOG[dm.order?.typeId]?.name || 'цветы';
  const vaseMatch = hasOrder ? gameState.inventory.find((v) => v.typeId === dm.order.typeId && v.qty >= dm.order.qty) : null;
  const accLine = dm.order?.accessoryName ? ` + 🎁 ${dm.order.accessoryName}` : '';

  const threadList = Array.isArray(dm.thread) && dm.thread.length
    ? dm.thread
    : [
        { sender: 'client', text: dm.text },
        ...(dm.replyText ? [{ sender: 'player', text: dm.replyText }] : [])
      ];

  const threadHtml = threadList
    .map((m) => `
      <div class="dm-msg ${m.sender}">
        ${m.photoUrl ? `<img class="dm-msg-photo" src="${m.photoUrl}" alt="Фото букета" />` : ''}
        ${m.text ? `<span>${escapeHtml(m.text)}</span>` : ''}
      </div>
    `)
    .join('');

  const isBlocked = Boolean(dm.blockedByClient || dm.blockedByPlayer);
  const preObj = hasOrder ? gameState.preorders.find((p) => p.dmId === dm.id && p.status !== 'cancelled') : null;
  const alreadyInShop = preObj && preObj.status === 'in_shop';
  const canAcceptOrder = hasOrder && !dm.order.done && !dm.order.accepted && !dm.order.rejected && !isBlocked && !alreadyInShop;
  const canRejectOrder = hasOrder && !dm.order.done && !dm.order.rejected && !isBlocked && !alreadyInShop;

  let orderBannerHtml = '';
  if (hasOrder) {
    if (dm.order.done) {
      orderBannerHtml = `
        <div class="dm-order-banner agreed">
          ✅ <strong>Выполнен:</strong> ${dm.order.qty} шт. «${escapeHtml(flowerName)}»${escapeHtml(accLine)} • клиент забрал заказ.
        </div>
      `;
    } else if (dm.order.rejected) {
      orderBannerHtml = `
        <div class="dm-order-banner cancelled">
          ❌ <strong>Заказ отменён:</strong> клиент предупреждён и не придёт (можно договориться заново в чате).
        </div>
      `;
    } else if (dm.order.accepted) {
      orderBannerHtml = `
        <div class="dm-order-banner agreed">
          ✅ <strong>Принят в работу!</strong> ${dm.order.qty} шт. «${escapeHtml(flowerName)}»${escapeHtml(accLine)} • к ${dm.order.dueTimeLabel} • ${dm.order.reward} ₽
          ${vaseMatch
            ? `<span style="color:var(--sage-dark); font-weight:800;"> • В наличии ✓</span>`
            : `<span style="color:#9D6F1D; font-weight:800;"> • Докупи к приходу</span>`}
        </div>
      `;
    } else {
      orderBannerHtml = `
        <div class="dm-order-banner">
          💐 <strong>Запрос клиента:</strong> ${dm.order.qty} шт. «${escapeHtml(flowerName)}»${escapeHtml(accLine)} • к ${dm.order.dueTimeLabel} • ~${dm.order.reward} ₽
          ${vaseMatch
            ? `<span style="color:var(--sage-dark); font-weight:800;"> • В наличии ✓</span>`
            : `<span style="color:#9D6F1D; font-weight:800;"> • Нет в вазах</span>`}
        </div>
      `;
    }
  }

  const savedPhotos = gameState.savedPhotos || [];
  const attachedPhoto = selectedDmPhotoId ? savedPhotos.find((p) => p.id === selectedDmPhotoId) || null : null;

  const photoPickerHtml = showDmPhotoPicker
    ? `
      <div class="dm-photo-picker-box">
        <div class="row-between">
          <strong style="font-size:11.5px;">📷 Выбери снимок из галереи Polaroid:</strong>
          <button class="btn btn-soft" id="btn-dm-close-photos" style="padding:2px 7px; font-size:11px;">✕</button>
        </div>
        ${savedPhotos.length
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
          : `<p class="muted-text" style="font-size:11px;">Галерея пуста! Сфоткай букет на Столе сборки (кнопка «📸 Сфотать») или зал в InstaFlower.</p>`}
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

  const rejectMenuHtml = showDmRejectMenu && canRejectOrder
    ? `
      <div class="reject-box">
        <div class="row-between">
          <strong style="font-size:11.5px;">Выбери причину отказа:</strong>
          <button class="btn btn-soft" id="btn-dm-close-reject" style="padding:2px 7px; font-size:10.5px;">✕</button>
        </div>
        <div class="reject-chips">
          ${DIRECT_REJECT_TEMPLATES.map((tpl) => `
            <button class="reject-chip" data-dm-reject-tpl="${escapeAttr(tpl)}" ${isBusy ? 'disabled' : ''}>
              ${escapeHtml(tpl)}
            </button>
          `).join('')}
        </div>
        <div style="display:flex; gap:5px;">
          <input type="text" class="form-input" id="dm-reject-custom-input" autocomplete="off" data-form-type="other" data-lpignore="true" placeholder="Своя причина..." style="padding:6px 8px; font-size:11.5px;" ${isBusy ? 'disabled' : ''} />
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
      ${dm.blockedByClient ? `
        <span class="badge badge-warn">В ЧС</span>
      ` : dm.blockedByPlayer ? `
        <button class="btn btn-soft" id="btn-dm-unblock" style="padding:5px 8px; font-size:11px;">Разблок.</button>
      ` : `
        <button class="btn btn-danger" id="btn-dm-block" style="padding:5px 8px; font-size:11px;">🚫 Блок</button>
      `}
    </div>

    <div class="dm-card">
      <div class="dm-thread" style="max-height: 245px; overflow-y: auto;">
        ${threadHtml}
        ${isBusy ? `<div class="dm-msg system">💬 ${escapeHtml(dm.senderName)} печатает...</div>` : ''}
      </div>

      ${orderBannerHtml}

      ${(canAcceptOrder || canRejectOrder) ? `
        <div class="dm-order-actions">
          ${canAcceptOrder ? `
            <button class="btn btn-sage" id="btn-dm-accept-order" ${isBusy ? 'disabled' : ''}>
              ✅ Принять заказ
            </button>
          ` : ''}
          ${canRejectOrder ? `
            <button class="btn btn-danger" id="btn-dm-toggle-reject" ${isBusy ? 'disabled' : ''}>
              ${dm.order.accepted ? '🚫 Отменить заказ' : '🚫 Отказать'}
            </button>
          ` : ''}
        </div>
      ` : ''}

      ${rejectMenuHtml}

      ${dm.blockedByClient ? `
        <div class="dm-blocked-banner">⛔ Пользователь заблокировал вас из-за грубого общения. Переписка закрыта.</div>
      ` : dm.blockedByPlayer ? `
        <div class="dm-blocked-banner">🚫 Вы заблокировали этого пользователя.</div>
      ` : alreadyInShop ? `
        <span class="badge badge-warn" style="align-self:flex-start;">🔔 Клиент уже в зале забирает заказ! Перейди в «Магазин».</span>
      ` : !(hasOrder && dm.order.done) ? `
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
          <input type="text" class="form-input" id="dm-reply-${dm.id}" data-dm-reply-input="${dm.id}" autocomplete="off" data-form-type="other" data-lpignore="true" placeholder="Напиши клиенту в Direct..." style="padding: 7px 10px; font-size: 12.5px; flex:1; min-width:0;" ${isBusy ? 'disabled' : ''} />
          <button class="btn btn-primary" data-reply-dm="${dm.id}" ${isBusy ? 'disabled' : ''} style="padding: 8px 12px; font-size: 12.5px; flex-shrink:0;">➤</button>
        </div>
      ` : ''}
    </div>
  `;

  const threadEl = body.querySelector('.dm-thread');
  if (threadEl) threadEl.scrollTop = threadEl.scrollHeight;

  document.getElementById('btn-dm-back')?.addEventListener('click', () => {
    openedDmId = null;
    showDmPhotoPicker = false;
    selectedDmPhotoId = null;
    showDmRejectMenu = false;
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

  document.getElementById('btn-dm-photo-toggle')?.addEventListener('click', () => {
    showDmPhotoPicker = !showDmPhotoPicker;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast);
  });

  document.getElementById('btn-dm-close-photos')?.addEventListener('click', () => {
    showDmPhotoPicker = false;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast);
  });

  body.querySelectorAll('[data-pick-dm-photo]').forEach((el) => {
    el.addEventListener('click', () => {
      selectedDmPhotoId = el.dataset.pickDmPhoto;
      showDmPhotoPicker = false;
      renderOpenedDmChat(dm, body, onHudUpdate, showToast);
    });
  });

  document.getElementById('btn-dm-clear-photo')?.addEventListener('click', () => {
    selectedDmPhotoId = null;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast);
  });

  document.getElementById('btn-dm-accept-order')?.addEventListener('click', () => {
    handleDirectAcceptOrder(dm.id, body, onHudUpdate, showToast);
  });

  document.getElementById('btn-dm-toggle-reject')?.addEventListener('click', () => {
    showDmRejectMenu = !showDmRejectMenu;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast);
  });

  document.getElementById('btn-dm-close-reject')?.addEventListener('click', () => {
    showDmRejectMenu = false;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast);
  });

  body.querySelectorAll('[data-dm-reject-tpl]').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleDirectRejectOrder(dm.id, btn.dataset.dmRejectTpl, false, body, onHudUpdate, showToast);
    });
  });

  document.getElementById('btn-dm-reject-custom')?.addEventListener('click', () => {
    const reason = document.getElementById('dm-reject-custom-input')?.value.trim();
    if (!reason) {
      showToast('Напиши причину или выбери готовый вариант');
      return;
    }
    handleDirectRejectOrder(dm.id, reason, false, body, onHudUpdate, showToast);
  });

  document.getElementById('btn-dm-reject-silent')?.addEventListener('click', () => {
    handleDirectRejectOrder(dm.id, 'К сожалению, не сможем взять заказ', true, body, onHudUpdate, showToast);
  });

  body.querySelectorAll('[data-reply-dm]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(`dm-reply-${dm.id}`);
      const text = input?.value.trim() || '';
      const photo = selectedDmPhotoId ? (gameState.savedPhotos || []).find((p) => p.id === selectedDmPhotoId) || null : null;
      if (!text && !photo) return;
      handleDirectReply(dm.id, text, body, onHudUpdate, showToast, photo);
    });
  });

  body.querySelectorAll('[data-dm-reply-input]').forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !busyDmId) {
        const text = input.value.trim() || '';
        const photo = selectedDmPhotoId ? (gameState.savedPhotos || []).find((p) => p.id === selectedDmPhotoId) || null : null;
        if (!text && !photo) return;
        handleDirectReply(dm.id, text, body, onHudUpdate, showToast, photo);
      }
    });
  });
}

function renderJobInterviewChat(dm, body, onHudUpdate, showToast) {
  const app = dm.jobApplication;
  const isBusy = busyDmId === dm.id;
  const isFinished = app.status === 'hired' || app.status === 'rejected' || dm.blockedByClient;

  const threadList = Array.isArray(dm.thread) && dm.thread.length
    ? dm.thread
    : [{ sender: 'client', text: dm.text }];

  const threadHtml = threadList
    .map((m) => `
      <div class="dm-msg ${m.sender}">
        <span>${escapeHtml(m.text)}</span>
      </div>
    `)
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
        <div class="muted-text" style="font-size:10.5px;">🕒 ${escapeHtml(app.scheduleLabel)}${app.hasCar ? ' • 🚗 Своё авто' : ''}</div>
      </div>

      <div class="dm-thread" style="max-height: 225px; overflow-y: auto;">
        ${threadHtml}
        ${isBusy ? `<div class="dm-msg system">💬 ${escapeHtml(app.candidateName)} печатает...</div>` : ''}
      </div>

      ${!isFinished ? `
        <div class="interview-chips">
          ${quickQuestions.map((q) => `
            <button class="interview-chip" data-interview-q="${escapeAttr(q)}" ${isBusy ? 'disabled' : ''}>
              ${escapeHtml(q)}
            </button>
          `).join('')}
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
          <input type="text" class="form-input" id="dm-reply-${dm.id}" data-job-reply-input="${dm.id}" autocomplete="off" data-form-type="other" data-lpignore="true" placeholder="Задай вопрос или поторгуйся по ставке..." style="padding: 7px 10px; font-size: 12px; flex:1; min-width:0;" ${isBusy ? 'disabled' : ''} />
          <button class="btn btn-primary" id="btn-send-job-reply" ${isBusy ? 'disabled' : ''} style="padding: 8px 12px; font-size: 12.5px; flex-shrink:0;">➤</button>
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

  body.querySelectorAll('[data-interview-q]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isBusy) return;
      handleInterviewMessage(dm.id, btn.dataset.interviewQ, body, onHudUpdate, showToast);
    });
  });

  document.getElementById('btn-send-job-reply')?.addEventListener('click', () => {
    const input = document.getElementById(`dm-reply-${dm.id}`);
    const text = input?.value.trim();
    if (text && !isBusy) handleInterviewMessage(dm.id, text, body, onHudUpdate, showToast);
  });

  document.querySelector(`[data-job-reply-input="${dm.id}"]`)?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isBusy) {
      const text = e.currentTarget.value.trim();
      if (text) handleInterviewMessage(dm.id, text, body, onHudUpdate, showToast);
    }
  });

  document.getElementById('btn-hire-candidate')?.addEventListener('click', () => {
    handleHireCandidate(dm.id, body, onHudUpdate, showToast);
  });

  document.getElementById('btn-reject-candidate')?.addEventListener('click', () => {
    handleRejectCandidate(dm.id, body, onHudUpdate, showToast);
  });
}

async function handleInterviewMessage(dmId, text, body, onHudUpdate, showToast) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || !dm.jobApplication || busyDmId) return;

  if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
  dm.thread.push({ sender: 'player', text });
  dm.read = true;
  busyDmId = dmId;
  renderJobInterviewChat(dm, body, onHudUpdate, showToast);

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
  } finally {
    busyDmId = null;
    renderPhoneScreen(onHudUpdate, showToast);
  }
}

async function handleHireCandidate(dmId, body, onHudUpdate, showToast) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  const app = dm?.jobApplication;
  if (!dm || !app || busyDmId || app.status !== 'interviewing') return;

  busyDmId = dmId;
  app.status = 'hired';
  const finalSalary = Number(app.agreedSalary) || Number(app.offeredSalary) || 1200;

  if (!Array.isArray(gameState.employees)) gameState.employees = [];
  gameState.employees.push({
    id: 'emp_' + Date.now(),
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

  renderJobInterviewChat(dm, body, onHudUpdate, showToast);

  try {
    const reply = await generateCandidateHireReaction(dm, true, finalSalary);
    dm.thread.push({ sender: 'client', text: reply });
    dm.thread.push({
      sender: 'system',
      text: `✅ ${app.candidateName} принят${app.gender === 'female' ? 'а' : ''} на работу (${finalSalary} ₽/см.)!`
    });
    gameState.mood = Math.min(100, gameState.mood + 4);
    playCoinSound();
    saveState();
    onHudUpdate();
    showToast(`🤝 ${app.candidateName} теперь в вашей команде!`);
  } finally {
    busyDmId = null;
    renderPhoneScreen(onHudUpdate, showToast);
  }
}

async function handleRejectCandidate(dmId, body, onHudUpdate, showToast) {
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

  renderJobInterviewChat(dm, body, onHudUpdate, showToast);

  try {
    const reply = await generateCandidateHireReaction(dm, false, app.agreedSalary);
    dm.thread.push({ sender: 'client', text: reply });
    dm.thread.push({ sender: 'system', text: '❌ Кандидат отклонён.' });
    saveState();
    showToast(`Собеседование с ${app.candidateName} завершено`);
  } finally {
    busyDmId = null;
    renderPhoneScreen(onHudUpdate, showToast);
  }
}

function syncAgreedPreorder(dm, orderData) {
  dm.kind = 'preorder';
  dm.order = {
    ...dm.order,
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

async function handleDirectAcceptOrder(dmId, body, onHudUpdate, showToast) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || !dm.order || busyDmId || dm.blockedByClient || dm.blockedByPlayer) return;

  showDmRejectMenu = false;
  if (!Array.isArray(dm.thread)) {
    dm.thread = [{ sender: 'client', text: dm.text }];
  }

  syncAgreedPreorder(dm, dm.order);
  const accPart = dm.order.accessoryName ? ` и «${dm.order.accessoryName}»` : '';
  const playerMsg = `✅ Приняли ваш заказ! Подготовим ${dm.order.qty} шт. «${dm.order.flowerName}»${accPart} к ${dm.order.dueTimeLabel}. Ждём вас! 🌸`;
  dm.thread.push({ sender: 'player', text: playerMsg });
  dm.thread.push({
    sender: 'system',
    text: `✅ Предзаказ подтверждён: визит к ${dm.order.dueTimeLabel} (${dm.order.reward} ₽).`
  });
  dm.read = true;
  busyDmId = dmId;

  renderDirectApp(body, onHudUpdate, showToast);

  try {
    const res = await generateDirectFollowUp(dm, playerMsg, null);
    dm.thread.push({ sender: 'client', text: res.reply });
    gameState.mood = Math.min(100, gameState.mood + 2);
    saveState();
    onHudUpdate();
    showToast(`🤝 Предзаказ от ${dm.senderName} принят на ${dm.order.dueTimeLabel}!`);
  } finally {
    busyDmId = null;
    renderPhoneScreen(onHudUpdate, showToast);
  }
}

async function handleDirectRejectOrder(dmId, reason, isSilent, body, onHudUpdate, showToast) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || !dm.order || busyDmId || dm.blockedByClient || dm.blockedByPlayer) return;

  showDmRejectMenu = false;
  if (!Array.isArray(dm.thread)) {
    dm.thread = [{ sender: 'client', text: dm.text }];
  }

  const playerMsg = isSilent
    ? 'К сожалению, не сможем взять заказ.'
    : `К сожалению, не сможем взять заказ (${reason}).`;

  dm.thread.push({ sender: 'player', text: playerMsg });
  dm.order.accepted = false;
  dm.order.rejected = true;
  gameState.preorders = gameState.preorders.filter((p) => !(p.dmId === dm.id && p.status !== 'done'));
  dm.read = true;
  busyDmId = dmId;

  renderDirectApp(body, onHudUpdate, showToast);

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
  } finally {
    busyDmId = null;
    renderPhoneScreen(onHudUpdate, showToast);
  }
}

async function handleDirectReply(dmId, text, body, onHudUpdate, showToast, attachedPhoto = null) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || busyDmId || dm.blockedByClient || dm.blockedByPlayer) return;
  if (dm.order && dm.order.done) return;

  if (!Array.isArray(dm.thread)) {
    dm.thread = [{ sender: 'client', text: dm.text }];
  }

  const cleanText = String(text || '').trim();
  dm.thread.push({
    sender: 'player',
    text: cleanText,
    photoUrl: attachedPhoto ? attachedPhoto.dataUrl : undefined,
    photoDesc: attachedPhoto ? attachedPhoto.description : undefined
  });

  if (cleanText) dm.replyText = cleanText;
  dm.read = true;
  busyDmId = dmId;
  selectedDmPhotoId = null;
  showDmPhotoPicker = false;
  showDmRejectMenu = false;

  renderDirectApp(body, onHudUpdate, showToast);

  try {
    const res = await generateDirectFollowUp(dm, cleanText, attachedPhoto);
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
  } finally {
    busyDmId = null;
    renderPhoneScreen(onHudUpdate, showToast);
  }
}

function trimDirectMessages() {
  if (gameState.directMessages.length <= 14) return;
  const keepImportant = gameState.directMessages.filter(
    (m) =>
      !m.read ||
      (m.order && m.order.accepted && !m.order.done) ||
      (m.jobApplication && m.jobApplication.status === 'interviewing')
  );
  const others = gameState.directMessages.filter(
    (m) =>
      m.read &&
      !(m.order && m.order.accepted && !m.order.done) &&
      !(m.jobApplication && m.jobApplication.status === 'interviewing')
  );
  const combined = [...keepImportant, ...others];
  gameState.directMessages = combined.slice(0, Math.max(14, keepImportant.length));
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

  const accessoriesHtml = Object.values(ACCESSORIES_CATALOG)
    .map((acc) => {
      const owned = (gameState.accessoriesInventory || []).find((a) => a.id === acc.id)?.qty || 0;
      const cost1 = acc.wholesalePrice;
      const cost3 = Math.round(acc.wholesalePrice * 3 * 0.92);
      return `
      <div class="wholesale-row">
        <div style="width:42px; height:42px; border-radius:10px; background:var(--bg-soft); display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0;">
          ${acc.icon}
        </div>
        <div style="flex:1; min-width:0;">
          <strong style="font-size:12.5px;">${acc.name}</strong>
          <p class="muted-text" style="font-size:11px;">Розница: ${acc.price} ₽ • На полке: ${owned} шт.</p>
        </div>
        <div style="display:flex; flex-direction:column; gap:4px;">
          <button class="btn btn-soft" data-buy-acc="${acc.id}:1" style="padding:5px 8px; font-size:11px;">
            +1 шт (${cost1}₽)
          </button>
          <button class="btn btn-sage" data-buy-acc="${acc.id}:3" style="padding:5px 8px; font-size:11px;">
            +3 шт (${cost3}₽)
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
    <div class="card-title" style="padding-left:4px;">🎁 Сопутствующие товары (шарики, игрушки, конфеты)</div>
    ${accessoriesHtml}
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

  body.querySelectorAll('[data-buy-acc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [accId, qtyStr] = btn.dataset.buyAcc.split(':');
      const qty = Number(qtyStr);
      const acc = ACCESSORIES_CATALOG[accId];
      if (!acc) return;
      const cost = qty === 3 ? Math.round(acc.wholesalePrice * 3 * 0.92) : acc.wholesalePrice;
      if (gameState.money < cost) {
        showToast('Недостаточно денег на счёте!');
        return;
      }

      gameState.money -= cost;
      gameState.totalSpent += cost;
      if (!Array.isArray(gameState.accessoriesInventory)) gameState.accessoriesInventory = [];
      const existing = gameState.accessoriesInventory.find((a) => a.id === accId);
      if (existing) {
        existing.qty += qty;
      } else {
        gameState.accessoriesInventory.push({ id: accId, qty });
      }
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`🎁 Доставлено: ${acc.icon} ${acc.shortName} (+${qty} шт.)`);
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

/* ==================== 4. ДЕКОР: АНТИКВАРНАЯ ЛАВКА И СКЛАД ==================== */
function renderDecorApp(body, onHudUpdate, showToast) {
  const activeTab = window._fleurDecorSubTab || 'shop';
  const rareIds = ensureDailyRareDecor();
  const ownedSet = new Set([...(gameState.decor || []), ...(gameState.decorInventory || [])]);
  const fridgeItem = DECOR_CATALOG.find((d) => d.id === 'fridge');

  const todayItems = [
    ...(fridgeItem ? [fridgeItem] : []),
    ...rareIds.map((id) => DECOR_CATALOG.find((d) => d.id === id)).filter(Boolean)
  ];

  const currentShopLoc = SHOP_LOCATIONS.find((l) => l.id === gameState.shopLocationId) || SHOP_LOCATIONS[0];
  const visibleShopDecorCount = DECOR_CATALOG.filter(
    (d) => d.place === 'Магазин' && d.id !== 'fridge' && ownedSet.has(d.id) && !(gameState.hiddenDecor || []).includes(d.id)
  ).length;

  const shopListHtml = todayItems
    .map((item) => {
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
            ${isHidden ? 'Повесить' : '✓ Висит'}
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
    })
    .join('');

  const ownedItems = DECOR_CATALOG.filter((d) => ownedSet.has(d.id) || (d.id === 'fridge' && gameState.hasFridge));
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
    : `<p class="muted-text" style="text-align:center; padding:14px;">Склад декора пока пуст — загляни в Антикварную лавку!</p>`;

  body.innerHTML = `
    <div class="segmented-tabs">
      <button class="seg-btn ${activeTab === 'shop' ? 'active' : ''}" data-decor-subtab="shop">
        🏺 Антикварная лавка
      </button>
      <button class="seg-btn ${activeTab === 'wardrobe' ? 'active' : ''}" data-decor-subtab="wardrobe">
        📦 Склад (${ownedItems.length})
      </button>
    </div>

    ${activeTab === 'shop' ? `
      <div class="antique-banner">
        <strong>🏺 Завоз на сегодня (День ${gameState.day})</strong><br/>
        Каждый день сюда привозят 2–3 случайных предмета декора и антиквариата. Заглядывай каждое утро!
      </div>
      ${shopListHtml}
    ` : `
      <p class="muted-text" style="font-size:11.5px; padding:0 4px;">
        Все покупки сохраняются навсегда. Слоты зала (${currentShopLoc.name}): <strong>${visibleShopDecorCount}/${currentShopLoc.maxWallDecor}</strong>.
      </p>
      ${wardrobeHtml}
    `}
  `;

  body.querySelectorAll('[data-decor-subtab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window._fleurDecorSubTab = btn.dataset.decorSubtab;
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

      const canHangInShop = item.place !== 'Магазин' || item.id === 'fridge' || visibleShopDecorCount < currentShopLoc.maxWallDecor;
      if (!Array.isArray(gameState.hiddenDecor)) gameState.hiddenDecor = [];
      if (canHangInShop) {
        gameState.hiddenDecor = gameState.hiddenDecor.filter((id) => id !== item.id);
      } else if (!gameState.hiddenDecor.includes(item.id)) {
        gameState.hiddenDecor.push(item.id);
      }

      gameState.mood = Math.min(100, gameState.mood + item.moodBonus);
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(canHangInShop ? `✨ Куплено и размещено: ${item.name}!` : `📦 Куплено на склад: ${item.name} (в зале нет свободных мест)`);
      renderDecorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-toggle-decor-phone]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggleDecorPhone;
      const item = DECOR_CATALOG.find((d) => d.id === id);
      if (!Array.isArray(gameState.hiddenDecor)) gameState.hiddenDecor = [];
      if (gameState.hiddenDecor.includes(id)) {
        if (item?.place === 'Магазин' && id !== 'fridge' && visibleShopDecorCount >= currentShopLoc.maxWallDecor) {
          showToast(`В локации «${currentShopLoc.name}» заняты все ${currentShopLoc.maxWallDecor} места для декора!`);
          return;
        }
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

/* ==================== 5. РИЕЛТОР (ПОМЕЩЕНИЯ И КВАРТИРЫ) ==================== */
function renderRealtorApp(body, onHudUpdate, showToast) {
  const owned = new Set(gameState.ownedLocations || ['shop_basement', 'home_studio']);

  const renderCard = (loc, kind) => {
    const isOwned = owned.has(loc.id);
    const isCurrent = kind === 'shop' ? gameState.shopLocationId === loc.id : gameState.homeLocationId === loc.id;

    let actionBtn = '';
    if (isCurrent) {
      actionBtn = `<span class="badge badge-ok">Активно ✓</span>`;
    } else if (isOwned) {
      actionBtn = `<button class="btn btn-sage" data-select-loc="${kind}:${loc.id}" style="padding:6px 10px; font-size:11.5px;">Переехать</button>`;
    } else {
      actionBtn = `<button class="btn btn-primary" data-buy-loc="${kind}:${loc.id}" style="padding:6px 10px; font-size:11.5px;">Купить (${loc.price.toLocaleString('ru-RU')} ₽)</button>`;
    }

    return `
      <div class="realtor-card ${isCurrent ? 'current' : ''}">
        <div class="row-between">
          <strong style="font-size:13px;">${escapeHtml(loc.name)}</strong>
          ${actionBtn}
        </div>
        <p class="muted-text" style="font-size:11.5px;">${escapeHtml(loc.desc)}</p>
      </div>
    `;
  };

  body.innerHTML = `
    <div class="card-title" style="padding-left:4px;">🏪 Помещения под магазин</div>
    ${SHOP_LOCATIONS.map((l) => renderCard(l, 'shop')).join('')}
    <div class="card-title" style="padding-left:4px; margin-top:4px;">🏠 Квартиры для флориста</div>
    ${HOME_LOCATIONS.map((l) => renderCard(l, 'home')).join('')}
  `;

  body.querySelectorAll('[data-buy-loc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [kind, locId] = btn.dataset.buyLoc.split(':');
      const list = kind === 'shop' ? SHOP_LOCATIONS : HOME_LOCATIONS;
      const loc = list.find((l) => l.id === locId);
      if (!loc) return;
      if (gameState.money < loc.price) {
        showToast('Недостаточно денег на покупку недвижимости!');
        return;
      }

      gameState.money -= loc.price;
      gameState.totalSpent += loc.price;
      if (!Array.isArray(gameState.ownedLocations)) gameState.ownedLocations = ['shop_basement', 'home_studio'];
      if (!gameState.ownedLocations.includes(loc.id)) gameState.ownedLocations.push(loc.id);
      if (kind === 'shop') gameState.shopLocationId = loc.id;
      else gameState.homeLocationId = loc.id;

      gameState.mood = Math.min(100, gameState.mood + 10);
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`🎉 Поздравляем с переездом в «${loc.name}»!`);
      renderRealtorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-select-loc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [kind, locId] = btn.dataset.selectLoc.split(':');
      if (kind === 'shop') gameState.shopLocationId = locId;
      else gameState.homeLocationId = locId;
      saveState();
      showToast('✨ Локация переключена!');
      renderRealtorApp(body, onHudUpdate, showToast);
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
  const locId = gameState.shopLocationId || 'shop_basement';

  if (gameState.powerOutage) {
    ctx.fillStyle = gameState.candlesLit ? '#4E3F38' : '#3E373D';
  } else if (locId === 'shop_pavilion') {
    ctx.fillStyle = isEvening ? '#D7E2DA' : '#F4F8F2';
  } else if (locId === 'shop_boutique') {
    ctx.fillStyle = isEvening ? '#E0D0C4' : '#FAF3EB';
  } else {
    ctx.fillStyle = isEvening ? '#DFCBB9' : '#F6ECE1';
  }
  ctx.fillRect(0, 0, 480, 480);

  if (locId === 'shop_boutique') {
    ctx.strokeStyle = 'rgba(223, 184, 115, 0.65)';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 460, 460);
  }

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

  ctx.fillStyle = isEvening ? '#5E648B' : gameState.weather === 'rainy' ? '#95A9B8' : '#BCE1F5';
  ctx.fillRect(34, 58, 166, 128);
  ctx.fillStyle = season.id === 'winter' ? '#F2F7FA' : season.id === 'autumn' ? '#D98A4E' : locId === 'shop_basement' ? '#CFC3B7' : '#9CC494';
  ctx.fillRect(34, 154, 166, 32);
  ctx.strokeStyle = locId === 'shop_boutique' ? '#DFB873' : locId === 'shop_basement' ? '#8C6D56' : '#FFFDF9';
  ctx.lineWidth = 7;
  ctx.strokeRect(34, 58, 166, 128);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(117, 58);
  ctx.lineTo(117, 186);
  ctx.moveTo(34, 124);
  ctx.lineTo(200, 124);
  ctx.stroke();

  ctx.fillStyle = '#FFFDF9';
  ctx.fillRect(236, 58, 206, 54);
  ctx.strokeStyle = isShopDecorVisible('neon_sign') ? '#E58A94' : '#D5C3B3';
  ctx.lineWidth = isShopDecorVisible('neon_sign') ? 4.5 : 3;
  ctx.strokeRect(236, 58, 206, 54);
  ctx.fillStyle = isShopDecorVisible('neon_sign') ? '#C96577' : '#5C4A42';
  ctx.font = 'bold 19px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText((gameState.shopName || 'Fleur Atelier').slice(0, 18), 339, 91);

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

  ctx.fillStyle = '#C9A789';
  ctx.fillRect(24, 340, 432, 22);
  ctx.fillStyle = '#EADBC9';
  ctx.fillRect(0, 362, 480, 118);

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

  if (hasPumpkins) {
    ctx.save();
    ctx.fillStyle = '#D96E34';
    ctx.beginPath();
    ctx.ellipse(354, 336, 10, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
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