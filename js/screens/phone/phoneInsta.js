/**
 * js/screens/phone/phoneInsta.js
 * Соцсеть InstaFlower: лента, посты, хэштеги, комментарии, промо и вакансии
 */

import {
  INSTA_HASHTAGS,
  DECOR_CATALOG,
  SHOP_LOCATIONS,
  JOB_ROLES,
  JOB_SCHEDULES
} from '../../config.js';
import { gameState, saveState, getTotalGameMinutes } from '../../state.js';
import { evaluateInstaPost, generateInstaCommentReply } from '../../ai.js';
import { playShutterSound, playCoinSound, playBellSound } from '../../sound.js';
import { captureShopInteriorPhoto, isShopDecorVisible } from './phoneCanvasSnap.js';

let selectedPhotoIndex = 0;
let selectedTags = ['#флористика', '#уютнаялавка'];
let isPosting = false;
let openCommentReplyKey = null;
let busyCommentKey = null;

let showJobForm = false;
let draftJobRoleId = 'assistant';
let draftJobSalary = 1200;
let draftJobScheduleId = 'full';
let draftJobLocationId = '';

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

export function renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone) {
  const refresh = onRefreshPhone || (() => renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone));
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
    renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
  });

  document.getElementById('btn-close-job-form')?.addEventListener('click', () => {
    showJobForm = false;
    renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
  });

  document.getElementById('job-role-select')?.addEventListener('change', (e) => {
    draftJobRoleId = e.target.value;
    const roleMeta = JOB_ROLES.find((r) => r.id === draftJobRoleId);
    if (roleMeta) draftJobSalary = roleMeta.baseSalary;
    renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
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
    const salary = Math.max(
      400,
      Number(document.getElementById('job-salary-input')?.value) || roleMeta.baseSalary
    );

    const jobId = 'job_' + Date.now();
    const totalNow = getTotalGameMinutes();
    const realDelayMs = 25000 + Math.floor(Math.random() * 45000);

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
      nextResponseRealMs: Date.now() + realDelayMs,
      respondedCount: 0,
      status: 'open'
    });

    const newJobPost = {
      id: 'post_job_' + Date.now(),
      isJobPost: true,
      jobId,
      roleIcon: roleMeta.icon,
      roleName: roleMeta.name,
      salary,
      scheduleLabel: schedMeta.label,
      locationName: locMeta.name,
      likes: 4 + Math.floor(Math.random() * 8),
      followerDelta: 1,
      verdict: 'Вакансия открыта 📢',
      hashtags: ['#работа', '#вакансия', '#флористика'],
      comments: []
    };
    gameState.instaPosts.unshift(newJobPost);

    gameState.followers += 1;
    showJobForm = false;
    playBellSound();
    saveState();
    onHudUpdate();
    showToast('📢 Вакансия опубликована! Кандидат сам напишет в Direct в ближайшее время.');

    evaluateInstaPost({
      type: 'shop',
      caption: `Ищем в команду: ${roleMeta.name} (${salary} ₽/см., ${locMeta.name}, ${schedMeta.label})`,
      hashtags: ['#работа', '#вакансия', '#флористика'],
      detailsText: `Объявление о вакансии в цветочном магазине: ${roleMeta.name}, ставка ${salary} ₽`
    })
      .then((res) => {
        if (res && Array.isArray(res.comments) && res.comments.length) {
          newJobPost.comments = res.comments;
          newJobPost.likes = Math.max(newJobPost.likes, res.likes || newJobPost.likes);
          saveState();
          refresh();
        }
      })
      .catch(() => {});
    refresh();
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
      renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
    });
  });

  body.querySelectorAll('[data-pick-photo]').forEach((el) => {
    el.addEventListener('click', () => {
      selectedPhotoIndex = Number(el.dataset.pickPhoto);
      renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
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
      renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
    });
  });

  body.querySelectorAll('[data-open-comment-reply]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.openCommentReply;
      openCommentReplyKey = openCommentReplyKey === key ? null : key;
      renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
    });
  });

  body.querySelectorAll('[data-send-comment-reply]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sendCommentReply;
      const [postId, idxStr] = key.split(':');
      const input = document.getElementById(`comment-reply-input-${postId}-${idxStr}`);
      const text = input?.value.trim();
      if (!text) return;
      handleCommentReply(postId, Number(idxStr), text, body, onHudUpdate, showToast, refresh);
    });
  });

  document.getElementById('btn-snap-interior')?.addEventListener('click', () => {
    playShutterSound();
    const shopPhotoUrl = captureShopInteriorPhoto();
    const activeDecorNames = DECOR_CATALOG.filter(
      (d) => d.place === 'Магазин' && isShopDecorVisible(d.id)
    ).map((d) => d.name);
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
    renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
  });

  document.getElementById('btn-publish-post')?.addEventListener('click', async () => {
    if (!currentPhoto || isPosting) return;
    const caption = document.getElementById('insta-caption')?.value.trim() || '';
    isPosting = true;
    renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);

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
      refresh();
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

async function handleCommentReply(postId, commentIdx, text, body, onHudUpdate, showToast, refresh) {
  const post = gameState.instaPosts.find((p) => p.id === postId);
  const comment = post?.comments?.[commentIdx];
  if (!post || !comment || comment.ownerReply || busyCommentKey) return;

  const key = `${postId}:${commentIdx}`;
  comment.ownerReply = text;
  openCommentReplyKey = null;
  busyCommentKey = key;
  renderInstaApp(body, onHudUpdate, showToast, refresh);

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
    refresh();
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}