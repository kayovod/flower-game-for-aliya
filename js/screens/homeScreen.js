import {
  FLOWERS_CATALOG,
  DECOR_CATALOG,
  getGameDateObj,
  getSeasonInfo,
  getWeatherForSeason,
  getHolidayForDate
} from '../config.js';
import { gameState, saveState } from '../state.js';
import { playPurrSound, playClickSound } from '../sound.js';

let catPosPercent = 48;
let catDir = 1;
let catThought = 'Отдыхает в комнате 🐾';
let ballPosPercent = 66;
let ballRotationDeg = 0;
let catWalkTimer = null;
let catStartMoveTimer = null;
let catArriveTimer = null;
let catPurrTimer = null;
let isCatPurring = false;
let isCatChasingBall = false;
let showHomeDecorModal = false;

function isHomeDecorShown(id) {
  return (gameState.decor || []).includes(id) && !(gameState.hiddenDecor || []).includes(id);
}

function clearCatTimers() {
  if (catWalkTimer) {
    clearTimeout(catWalkTimer);
    catWalkTimer = null;
  }
  if (catStartMoveTimer) {
    clearTimeout(catStartMoveTimer);
    catStartMoveTimer = null;
  }
  if (catArriveTimer) {
    clearTimeout(catArriveTimer);
    catArriveTimer = null;
  }
  if (catPurrTimer) {
    clearTimeout(catPurrTimer);
    catPurrTimer = null;
  }
}

export function renderHomeScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-home');
  if (!container) return;

  clearCatTimers();
  isCatPurring = false;
  isCatChasingBall = false;

  const isDay = gameState.timeIndex < 2;
  const hasLamp = isHomeDecorShown('cozy_lamp');
  const hasBooks = isHomeDecorShown('bookshelf');
  const hasBed = isHomeDecorShown('cat_bed');
  const hasBall = isHomeDecorShown('cat_ball');
  const hasSofa = isHomeDecorShown('home_sofa');
  const hasRug = isHomeDecorShown('home_rug');
  const hasPlant = isHomeDecorShown('home_plant');
  const hasCurtains = isHomeDecorShown('home_curtains');
  const hasTree = isHomeDecorShown('xmas_tree_home');
  const hasFairy = isHomeDecorShown('fairy_lights_home');
  const hasPumpkins = isHomeDecorShown('pumpkins_home');
  const hasHearts = isHomeDecorShown('heart_pillow_home');

  const petName = gameState.petName || 'Пискля';
  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const season = getSeasonInfo(curDate);

  const ownedHomeDecorCount = DECOR_CATALOG.filter(
    (d) => d.place === 'Квартира' && (gameState.decor || []).includes(d.id)
  ).length;

  container.innerHTML = `
    <div class="screen-header">
      <h1 class="screen-title">Уютная квартира</h1>
      <div style="display:flex; gap:5px; align-items:center;">
        <button class="btn btn-soft" id="btn-open-home-decor" style="padding:5px 9px; font-size:11.5px;">
          🎨 Декор (${ownedHomeDecorCount})
        </button>
        <span class="badge badge-ok">⚡ ${gameState.energy}%</span>
      </div>
    </div>

    ${gameState.rentWarning ? `
      <div class="card" style="background:#FCE8E8; border-color:#E5A1A1; padding:10px;">
        <strong style="color:var(--danger); font-size:13px;">⚠️ Письмо от арендодателя</strong>
        <p class="muted-text" style="color:#6E3838;">Баланс ушёл в минус после оплаты аренды! Постарайся заработать и выйти в плюс.</p>
      </div>
    ` : ''}

    <div class="home-room-scene">
      ${hasFairy ? `
        <div class="home-fairy-lights">
          ${Array.from({ length: 10 }, () => `
            <div class="fairy-strand">
              <span class="fairy-wire"></span>
              <span class="fairy-dot"></span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="home-top-wall">
        <div class="home-window-wrap">
          ${hasCurtains ? '<div class="home-curtain left"></div><div class="home-curtain right"></div>' : ''}
          <div class="home-window ${isDay ? 'day' : ''}">
            <div class="window-horizon season-${season.id}" style="height:20px;"></div>
            <div class="window-pane-v"></div>
            <div class="window-pane-h"></div>
          </div>
        </div>

        <div class="home-wall-center">
          ${hasHearts ? '<div class="home-hearts-wall">💖 💕 💖</div>' : ''}
          ${hasBooks ? getBookshelfSvg() : ''}
          ${hasSofa ? getSofaSvg() : ''}
        </div>

        ${hasLamp ? getFloorLampSvg() : ''}
      </div>

      <div class="home-walk-stage" id="home-walk-stage">
        ${hasRug ? '<div class="home-rug"></div>' : ''}
        ${hasBed ? getCatBedFloorSvg() : ''}
        ${hasPlant ? getFicusPlantSvg() : ''}
        ${hasPumpkins ? getHomePumpkinsSvg() : ''}
        ${hasTree ? getHomeXmasTreeSvg() : ''}
        ${hasBall ? `
          <button
            type="button"
            class="home-cat-ball-floor"
            id="cat-toy-ball"
            style="left: ${ballPosPercent}%; transform: translateX(-50%) rotate(${ballRotationDeg}deg);"
            title="Бросить мячик для ${escapeHtml(petName)}"
          >
            ${getCatBallSvg()}
          </button>
        ` : ''}

        <button
          type="button"
          class="cat-walker"
          id="pisklya-walker"
          style="left: ${catPosPercent}%;"
          title="Погладить ${escapeHtml(petName)}"
        >
          <span class="cat-thought-bubble" id="cat-thought-bubble">${escapeHtml(catThought)}</span>
          <span class="cat-hearts-layer" id="cat-hearts-layer"></span>
          <div class="cat-sprite-flip" id="cat-sprite-flip" style="transform: scaleX(${catDir});">
            <div class="cat-body-bob">
              ${getPisklyaCatSvg(gameState.petMood)}
            </div>
          </div>
        </button>
      </div>

      <div class="pet-spot">
        <div class="row-between">
          <strong style="font-size:14px;">🐱 Кошка ${escapeHtml(petName)}</strong>
          <span class="badge badge-ok" id="pet-mood-badge">${gameState.petMood}%</span>
        </div>
        <p class="muted-text" style="font-size:11.5px;">
          Нажми на гуляющую кошку, чтобы погладить её${hasBall ? ', или катни мячик для игры!' : ', или покорми вкусняшкой!'}
        </p>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-primary" id="btn-pet-cat" style="flex:1; padding:6px 8px; font-size:12px;">
            🖐️ Погладить
          </button>
          ${hasBall ? `
            <button class="btn btn-sage" id="btn-play-ball" style="flex:1; padding:6px 8px; font-size:12px;">
              🎾 Мячик
            </button>
          ` : ''}
          <button class="btn btn-soft" id="btn-feed-cat" style="flex:1; padding:6px 8px; font-size:12px;" ${gameState.petFedToday ? 'disabled style="opacity:0.55;"' : ''}>
            ${gameState.petFedToday ? '🐟 Сыта' : '🐟 Покормить'}
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🌙 Завершить рабочий день</div>
      <p class="muted-text">
        Сон восстановит силы и переведёт время на следующее утро. До оплаты аренды (${gameState.weeklyRent} ₽): <strong>${gameState.daysUntilRent} дн.</strong>
      </p>
      <p class="muted-text" style="font-size:11.5px;">
        💡 Имя питомца, дата, режим работы и музыка настраиваются в «⚙️ Касса и ИИ» → «Настройки и ИИ».
      </p>
      <button class="btn btn-primary" id="btn-sleep-next-day">
        🛏️ Лечь спать (Новый день)
      </button>
    </div>

    ${showHomeDecorModal ? renderHomeDecorModal() : ''}
  `;

  bindHomeEvents(onHudUpdate, showToast);
  scheduleNextCatWalk(1100);
}

function renderHomeDecorModal() {
  const homeItems = DECOR_CATALOG.filter((d) => d.place === 'Квартира' && (gameState.decor || []).includes(d.id));
  const listHtml = homeItems.length
    ? homeItems
        .map((item) => {
          const isHidden = (gameState.hiddenDecor || []).includes(item.id);
          return `
            <div class="decor-toggle-row">
              <div style="display:flex; align-items:center; gap:7px; flex:1; min-width:0;">
                <span style="font-size:18px;">${item.icon}</span>
                <div style="min-width:0;">
                  <strong style="font-size:12px;">${escapeHtml(item.name)}</strong>
                  <div class="muted-text" style="font-size:10px;">${item.category || 'Обычный'}</div>
                </div>
              </div>
              <button class="btn ${isHidden ? 'btn-sage' : 'btn-soft'}" data-toggle-home-decor="${item.id}" style="padding:5px 9px; font-size:11px;">
                ${isHidden ? 'Повесить' : 'Убрать'}
              </button>
            </div>
          `;
        })
        .join('')
    : `<p class="muted-text" style="text-align:center; padding:12px 4px;">У тебя пока нет купленного декора для квартиры. Загляни в «📱 Телефон» → «🛋️ Декор»!</p>`;

  return `
    <div class="vase-modal-overlay" id="home-decor-modal-overlay">
      <div class="flower-inspector vase-modal-card">
        <div class="row-between">
          <strong style="font-size:15px;">🎨 Оформление квартиры</strong>
          <button class="btn btn-soft" id="btn-close-home-decor" style="padding:5px 10px; font-size:12px;">✕</button>
        </div>
        <p class="muted-text" style="font-size:11.5px;">Вешай и убирай купленную мебель, ёлку, шторы, мячик и сезонные украшения по настроению:</p>
        <div class="decor-toggle-list">${listHtml}</div>
      </div>
    </div>
  `;
}

function bindHomeEvents(onHudUpdate, showToast) {
  const petName = gameState.petName || 'Пискля';

  document.getElementById('pisklya-walker')?.addEventListener('click', () => {
    triggerCatPetReaction(petName, onHudUpdate, showToast);
  });

  document.getElementById('btn-pet-cat')?.addEventListener('click', () => {
    triggerCatPetReaction(petName, onHudUpdate, showToast);
  });

  document.getElementById('cat-toy-ball')?.addEventListener('click', () => {
    triggerCatPlayWithBall(petName, onHudUpdate, showToast);
  });

  document.getElementById('btn-play-ball')?.addEventListener('click', () => {
    triggerCatPlayWithBall(petName, onHudUpdate, showToast);
  });

  document.getElementById('btn-feed-cat')?.addEventListener('click', () => {
    if (gameState.petFedToday) return;
    playPurrSound();
    gameState.petFedToday = true;
    gameState.petMood = 100;
    gameState.mood = Math.min(100, gameState.mood + 4);
    saveState();
    onHudUpdate();
    renderHomeScreen(onHudUpdate, showToast);
    showToast(`🐟 ${petName} вкусно поела и замурчала!`);
  });

  document.getElementById('btn-sleep-next-day')?.addEventListener('click', () => {
    sleepToNextDay(onHudUpdate, showToast);
  });

  document.getElementById('btn-open-home-decor')?.addEventListener('click', () => {
    showHomeDecorModal = true;
    renderHomeScreen(onHudUpdate, showToast);
  });

  document.getElementById('btn-close-home-decor')?.addEventListener('click', () => {
    showHomeDecorModal = false;
    renderHomeScreen(onHudUpdate, showToast);
  });

  document.getElementById('home-decor-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'home-decor-modal-overlay') {
      showHomeDecorModal = false;
      renderHomeScreen(onHudUpdate, showToast);
    }
  });

  document.querySelectorAll('[data-toggle-home-decor]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggleHomeDecor;
      if (!Array.isArray(gameState.hiddenDecor)) gameState.hiddenDecor = [];
      if (gameState.hiddenDecor.includes(id)) {
        gameState.hiddenDecor = gameState.hiddenDecor.filter((x) => x !== id);
        showToast('✨ Украшение размещено в комнате!');
      } else {
        gameState.hiddenDecor.push(id);
        showToast('📦 Убрано в коробку (можно вернуть в любой момент)');
      }
      saveState();
      renderHomeScreen(onHudUpdate, showToast);
    });
  });
}

function freezeCatAtCurrentPosition() {
  const walker = document.getElementById('pisklya-walker');
  const stage = document.getElementById('home-walk-stage');
  if (!walker || !stage) return;

  const stageRect = stage.getBoundingClientRect();
  const walkerRect = walker.getBoundingClientRect();
  if (stageRect.width > 0) {
    const currentCenterPct = ((walkerRect.left - stageRect.left + walkerRect.width / 2) / stageRect.width) * 100;
    catPosPercent = Math.max(12, Math.min(86, Math.round(currentCenterPct * 10) / 10));
    walker.style.transition = 'none';
    walker.style.left = `${catPosPercent}%`;
  }
}

function rollToyBallElement(newBallX) {
  const ballEl = document.getElementById('cat-toy-ball');
  const delta = newBallX - ballPosPercent;
  ballRotationDeg += Math.round(delta * 10);
  ballPosPercent = newBallX;
  if (ballEl) {
    ballEl.style.left = `${ballPosPercent}%`;
    ballEl.style.transform = `translateX(-50%) rotate(${ballRotationDeg}deg)`;
  }
}

function scheduleNextCatWalk(delayMs = 2800) {
  if (catWalkTimer) clearTimeout(catWalkTimer);
  catWalkTimer = setTimeout(() => {
    const screen = document.getElementById('screen-home');
    const walker = document.getElementById('pisklya-walker');
    const flip = document.getElementById('cat-sprite-flip');
    const bubble = document.getElementById('cat-thought-bubble');
    if (!screen || !screen.classList.contains('active') || !walker || !flip || isCatPurring || isCatChasingBall) {
      scheduleNextCatWalk(2400);
      return;
    }

    const hasBall = isHomeDecorShown('cat_ball');
    const targets = [
      { x: 16, label: 'Смотрит в окно 🪟' },
      { x: 42, label: isHomeDecorShown('cat_bed') ? 'Отдыхает у лежанки 🧶' : 'Греется в центре 🐾' },
      { x: 76, label: isHomeDecorShown('xmas_tree_home') ? 'Любуется ёлочкой 🎄' : isHomeDecorShown('cozy_lamp') ? 'Греется у торшера 💡' : 'Гуляет по комнате 🐾' },
      { x: Math.round(22 + Math.random() * 52), label: 'Мягко шагает 🐾' }
    ];

    if (hasBall) {
      const targetBallX = Math.max(16, Math.min(82, ballPosPercent));
      targets.push({ x: targetBallX, label: 'Гоняет мячик! 🎾', isBall: true });
      targets.push({ x: targetBallX, label: 'Гоняет мячик! 🎾', isBall: true });
    }

    const available = targets.filter((t) => Math.abs(t.x - catPosPercent) >= 8 || t.isBall);
    const chosen = available[Math.floor(Math.random() * available.length)] || targets[0];

    const dist = Math.abs(chosen.x - catPosPercent);
    const speedMsPerPct = chosen.isBall ? 46 : 60;
    const durationMs = Math.max(900, Math.round(dist * speedMsPerPct));

    catDir = chosen.x >= catPosPercent ? 1 : -1;
    flip.style.transform = `scaleX(${catDir})`;
    walker.classList.add('is-walking');
    walker.style.transition = `left ${durationMs}ms linear`;
    walker.style.left = `${chosen.x}%`;

    catThought = chosen.isBall ? 'Охотится на мячик! 🎾' : 'Идёт по комнате... 🐾';
    if (bubble) bubble.textContent = catThought;

    if (catArriveTimer) clearTimeout(catArriveTimer);
    catArriveTimer = setTimeout(() => {
      catPosPercent = chosen.x;
      walker.classList.remove('is-walking');

      if (chosen.isBall && isHomeDecorShown('cat_ball')) {
        const nextBallX = ballPosPercent > 50 ? 18 + Math.round(Math.random() * 18) : 64 + Math.round(Math.random() * 18);
        rollToyBallElement(nextBallX);
        catThought = 'Отбила мячик лапкой! 🎾';
        if (bubble) bubble.textContent = catThought;
        scheduleNextCatWalk(1600);
        return;
      }

      catThought = chosen.label;
      if (bubble) bubble.textContent = catThought;
      scheduleNextCatWalk(2600 + Math.floor(Math.random() * 2400));
    }, durationMs);
  }, delayMs);
}

function triggerCatPlayWithBall(petName, onHudUpdate, showToast) {
  const walker = document.getElementById('pisklya-walker');
  const flip = document.getElementById('cat-sprite-flip');
  const bubble = document.getElementById('cat-thought-bubble');
  const heartsLayer = document.getElementById('cat-hearts-layer');

  if (!walker || !flip || isCatChasingBall) return;

  playClickSound();
  clearCatTimers();
  isCatPurring = false;
  isCatChasingBall = true;

  freezeCatAtCurrentPosition();
  walker.classList.remove('is-purring', 'is-walking');

  const newBallX = ballPosPercent > 50 ? 16 + Math.round(Math.random() * 18) : 66 + Math.round(Math.random() * 18);
  rollToyBallElement(newBallX);

  const catchX = Math.max(14, Math.min(84, newBallX + (newBallX > 50 ? -6 : 6)));
  const dist = Math.abs(catchX - catPosPercent);
  const runMs = Math.max(1250, Math.round(dist * 46));

  catDir = catchX >= catPosPercent ? 1 : -1;
  flip.style.transform = `scaleX(${catDir})`;
  catThought = 'Заметила мячик! 🎾';
  if (bubble) bubble.textContent = catThought;

  // Отдельный кадр после фиксации позиции, чтобы браузер гарантированно плавно проиграл весь бег
  catStartMoveTimer = setTimeout(() => {
    const curWalker = document.getElementById('pisklya-walker');
    const curBubble = document.getElementById('cat-thought-bubble');
    if (!curWalker) {
      isCatChasingBall = false;
      return;
    }

    curWalker.classList.add('is-walking');
    curWalker.style.transition = `left ${runMs}ms linear`;
    curWalker.style.left = `${catchX}%`;
    catThought = 'Бежит за мячиком! 🎾';
    if (curBubble) curBubble.textContent = catThought;

    catArriveTimer = setTimeout(() => {
      isCatChasingBall = false;
      catPosPercent = catchX;
      curWalker.classList.remove('is-walking');
      curWalker.classList.add('is-purring');
      isCatPurring = true;

      const wasLowMood = gameState.petMood < 100;
      gameState.petMood = Math.min(100, gameState.petMood + 5);
      if (wasLowMood) {
        gameState.mood = Math.min(100, gameState.mood + 1);
      }
      saveState();
      onHudUpdate();

      const moodBadge = document.getElementById('pet-mood-badge');
      if (moodBadge) moodBadge.textContent = `${gameState.petMood}%`;

      catThought = 'Поймала мячик! 🐾';
      if (curBubble) curBubble.textContent = catThought;

      if (heartsLayer) {
        ['🎾', '✨', '💕'].forEach((sym, i) => {
          const span = document.createElement('span');
          span.className = 'cat-heart-particle';
          span.textContent = sym;
          span.style.left = `${16 + i * 18}px`;
          span.style.animationDelay = `${i * 0.1}s`;
          heartsLayer.appendChild(span);
          setTimeout(() => span.remove(), 1250);
        });
      }

      playPurrSound();
      showToast(`🎾 ${petName} весело поймала мячик!`);

      catPurrTimer = setTimeout(() => {
        isCatPurring = false;
        curWalker.classList.remove('is-purring');
        scheduleNextCatWalk(1600);
      }, 1100);
    }, runMs);
  }, 90);
}

function triggerCatPetReaction(petName, onHudUpdate, showToast) {
  const walker = document.getElementById('pisklya-walker');
  const bubble = document.getElementById('cat-thought-bubble');
  const heartsLayer = document.getElementById('cat-hearts-layer');

  playPurrSound();
  gameState.petMood = Math.min(100, gameState.petMood + 8);
  gameState.mood = Math.min(100, gameState.mood + 2);
  saveState();
  onHudUpdate();

  const moodBadge = document.getElementById('pet-mood-badge');
  if (moodBadge) moodBadge.textContent = `${gameState.petMood}%`;

  if (walker) {
    clearCatTimers();
    isCatChasingBall = false;
    freezeCatAtCurrentPosition();

    isCatPurring = true;
    walker.classList.remove('is-walking');
    walker.classList.add('is-purring');
    catThought = 'Мррр! Люблю тебя 💖';
    if (bubble) bubble.textContent = catThought;

    if (heartsLayer) {
      const symbols = ['💖', '💕', '✨', '❤️'];
      symbols.forEach((sym, i) => {
        const span = document.createElement('span');
        span.className = 'cat-heart-particle';
        span.textContent = sym;
        span.style.left = `${14 + i * 16 + Math.round(Math.random() * 8)}px`;
        span.style.animationDelay = `${i * 0.11}s`;
        heartsLayer.appendChild(span);
        setTimeout(() => span.remove(), 1350);
      });
    }

    catPurrTimer = setTimeout(() => {
      isCatPurring = false;
      walker.classList.remove('is-purring');
      catThought = 'Довольно мурлычет 🐱';
      if (bubble) bubble.textContent = catThought;
      scheduleNextCatWalk(1800);
    }, 1650);
  }

  showToast(`🐱 Мррр! ${petName} мурлычет от удовольствия (+2% атмосферы)`);
}

function sleepToNextDay(onHudUpdate, showToast) {
  const lateMinutes = (gameState.timeMinutes || 540) - (gameState.closeHour || 21) * 60;
  const overworked = lateMinutes >= 120;

  gameState.day += 1;
  gameState.timeIndex = 0;
  gameState.timeMinutes = (gameState.openHour || 9) * 60;
  gameState.shownCloseHint = false;
  gameState.energy = overworked ? 65 : 100;
  if (overworked) {
    gameState.mood = Math.max(20, gameState.mood - 8);
  }
  gameState.petFedToday = false;
  gameState.petMood = Math.max(40, gameState.petMood - 10);

  const newDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const season = getSeasonInfo(newDate);
  gameState.weather = getWeatherForSeason(season.id);

  const fridgeFactor = gameState.hasFridge ? 0.65 : 1;
  gameState.inventory.forEach((item) => {
    const meta = FLOWERS_CATALOG[item.typeId];
    if (!meta) return;
    item.wateredThisShift = false;
    item.freshness = Math.max(0, Math.round(item.freshness - meta.decayPerShift * fridgeFactor));
  });

  gameState.daysUntilRent -= 1;
  let extraMsg = '';
  if (gameState.daysUntilRent <= 0) {
    gameState.money -= gameState.weeklyRent;
    gameState.totalSpent += gameState.weeklyRent;
    gameState.daysUntilRent = 7;
    gameState.rentWarning = gameState.money < 0;
    extraMsg = ` Списана аренда -${gameState.weeklyRent} ₽.`;
  }

  gameState.powerOutage = Math.random() < 0.22;
  gameState.candlesLit = false;

  const holiday = getHolidayForDate(newDate);
  if (holiday) {
    extraMsg += ` 🎉 Сегодня ${holiday.name}!`;
  } else if (gameState.powerOutage) {
    extraMsg += ' ⚡ В магазине отключили свет — зажги свечи!';
  }

  saveState();
  onHudUpdate();
  renderHomeScreen(onHudUpdate, showToast);
  const tiredMsg = overworked ? ' 🥱 Ты поздно лёг — сегодня меньше сил (65%).' : '';
  showToast(`☀️ Доброе утро, День ${gameState.day}!${tiredMsg}${extraMsg}`);
}

function getCatBallSvg() {
  return `
    <svg viewBox="0 0 32 32" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#F29F8F" stroke="#C96C5E" stroke-width="2"/>
      <path d="M5 10 Q16 17 27 10" stroke="#FFFDF9" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M5 22 Q16 15 27 22" stroke="#FFE599" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <circle cx="12" cy="10" r="2.2" fill="rgba(255,255,255,0.6)"/>
    </svg>
  `;
}

function getPisklyaCatSvg(mood) {
  const browHappy = mood >= 60
    ? '<path d="M34 38 Q39 35 44 38" stroke="#D99B5E" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M56 38 Q61 35 66 38" stroke="#D99B5E" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
    : '';

  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 76 Q89 65 84 40 Q81 32 76 38 Q78 58 67 71 Z" fill="#322A28"/>
      <path d="M81 45 Q84 54 78 63" stroke="#C88248" stroke-width="3" stroke-linecap="round" fill="none"/>

      <ellipse cx="50" cy="70" rx="23" ry="17" fill="#2A2321"/>
      <ellipse cx="60" cy="68" rx="9" ry="11" fill="#8C5937" opacity="0.55"/>

      <path d="M39 58 Q50 56 61 58 Q63 72 50 78 Q37 72 39 58 Z" fill="#D99B5E"/>
      <path d="M43 60 Q50 59 57 60 Q57 70 50 74 Q43 70 43 60 Z" fill="#E9BA86"/>

      <ellipse cx="42" cy="83" rx="5.5" ry="4" fill="#2A2321"/>
      <ellipse cx="58" cy="83" rx="5.5" ry="4" fill="#2A2321"/>
      <ellipse cx="42" cy="84" rx="3.2" ry="2.2" fill="#D99B5E"/>
      <ellipse cx="58" cy="84" rx="3.2" ry="2.2" fill="#D99B5E"/>

      <polygon points="27,36 30,13 45,26" fill="#2A2321"/>
      <polygon points="73,36 70,13 55,26" fill="#2A2321"/>
      <polygon points="31,31 32,18 41,26" fill="#B57A5C"/>
      <polygon points="69,31 68,18 59,26" fill="#B57A5C"/>

      <ellipse cx="50" cy="43" rx="23" ry="19" fill="#2A2321"/>
      <polygon points="25,44 29,39 30,50" fill="#2A2321"/>
      <polygon points="75,44 71,39 70,50" fill="#2A2321"/>

      <path d="M46 25 Q52 24 53 31 Q50 38 46 35 Q44 30 46 25 Z" fill="#E29A55"/>
      <circle cx="57" cy="49" r="3" fill="#B87642" opacity="0.6"/>

      <ellipse cx="40" cy="43" rx="4.4" ry="3.8" fill="#F2B84B"/>
      <ellipse cx="60" cy="43" rx="4.4" ry="3.8" fill="#F2B84B"/>
      <ellipse cx="40" cy="43" rx="2.1" ry="2.9" fill="#231D1B"/>
      <ellipse cx="60" cy="43" rx="2.1" ry="2.9" fill="#231D1B"/>
      <circle cx="38.8" cy="41.6" r="1.2" fill="#FFFFFF"/>
      <circle cx="58.8" cy="41.6" r="1.2" fill="#FFFFFF"/>
      ${browHappy}

      <polygon points="48,49 52,49 50,51.5" fill="#E89A94"/>
      <path d="M46 53 Q50 56 54 53" stroke="#D99B5E" stroke-width="1.4" fill="none" stroke-linecap="round"/>

      <line x1="23" y1="47" x2="35" y2="49" stroke="#C7B6AA" stroke-width="1.1"/>
      <line x1="23" y1="51" x2="35" y2="51" stroke="#C7B6AA" stroke-width="1.1"/>
      <line x1="77" y1="47" x2="65" y2="49" stroke="#C7B6AA" stroke-width="1.1"/>
      <line x1="77" y1="51" x2="65" y2="51" stroke="#C7B6AA" stroke-width="1.1"/>
    </svg>
  `;
}

function getCatBedFloorSvg() {
  return `
    <div class="home-cat-bed-floor" title="Лежанка с игрушкой">
      <svg viewBox="0 0 90 32" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="45" cy="20" rx="41" ry="11" fill="#E8A598"/>
        <ellipse cx="45" cy="18" rx="33" ry="8" fill="#FCEAE6"/>
        <circle cx="11" cy="21" r="5" fill="#DFAB4E"/>
      </svg>
    </div>
  `;
}

function getBookshelfSvg() {
  return `
    <div class="home-wall-bookshelf" title="Полка с книгами по ботанике">
      <svg viewBox="0 0 120 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="58" width="108" height="9" rx="3" fill="#B8906E"/>
        <rect x="18" y="67" width="6" height="9" fill="#9A7455"/>
        <rect x="96" y="67" width="6" height="9" fill="#9A7455"/>
        <rect x="14" y="24" width="12" height="34" rx="2" fill="#7D9E7F"/>
        <rect x="27" y="29" width="10" height="29" rx="2" fill="#D98A7C"/>
        <rect x="38" y="21" width="13" height="37" rx="2" fill="#DFAB4E"/>
        <rect x="52" y="32" width="11" height="26" rx="2" fill="#8EA8C3"/>
        <path d="M80 58 L76 42 L96 42 L92 58 Z" fill="#E8A598"/>
        <circle cx="86" cy="36" r="6" fill="#7D9E7F"/>
        <circle cx="81" cy="39" r="5" fill="#96B898"/>
        <circle cx="91" cy="39" r="5" fill="#6B8E6E"/>
      </svg>
    </div>
  `;
}

function getSofaSvg() {
  return `
    <div class="home-sofa-wrap" title="Пастельный диванчик">
      <svg viewBox="0 0 130 65" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="14" width="102" height="26" rx="10" fill="#E5B6AE"/>
        <rect x="6" y="28" width="16" height="26" rx="6" fill="#D99E94"/>
        <rect x="108" y="28" width="16" height="26" rx="6" fill="#D99E94"/>
        <rect x="18" y="34" width="94" height="18" rx="6" fill="#F2CFC8"/>
        <rect x="22" y="52" width="7" height="9" rx="2" fill="#8C6D56"/>
        <rect x="101" y="52" width="7" height="9" rx="2" fill="#8C6D56"/>
      </svg>
    </div>
  `;
}

function getFicusPlantSvg() {
  return `
    <div class="home-plant-floor" title="Фикус в кашпо">
      <svg viewBox="0 0 60 90" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <polygon points="18,62 42,62 38,86 22,86" fill="#D9A78B"/>
        <rect x="28" y="36" width="4" height="26" fill="#6E5542"/>
        <ellipse cx="22" cy="40" rx="11" ry="7" transform="rotate(-25 22 40)" fill="#6C936E"/>
        <ellipse cx="38" cy="34" rx="12" ry="7" transform="rotate(22 38 34)" fill="#7EA680"/>
        <ellipse cx="30" cy="22" rx="10" ry="12" fill="#8BB58D"/>
      </svg>
    </div>
  `;
}

function getHomeXmasTreeSvg() {
  return `
    <div class="home-tree-floor" title="Домашняя ёлка с огоньками">
      <svg viewBox="0 0 80 115" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="34" y="92" width="12" height="16" rx="2" fill="#7D5C43"/>
        <polygon points="40,14 14,50 66,50" fill="#5D8760"/>
        <polygon points="40,34 10,74 70,74" fill="#4E7851"/>
        <polygon points="40,56 6,96 74,96" fill="#416944"/>
        <circle cx="40" cy="11" r="5" fill="#F5C954"/>
        <circle cx="32" cy="42" r="3.5" fill="#E87A82"/>
        <circle cx="48" cy="60" r="3.5" fill="#F5C954"/>
        <circle cx="28" cy="78" r="3.5" fill="#89B9DF"/>
        <circle cx="52" cy="84" r="3.5" fill="#E87A82"/>
      </svg>
    </div>
  `;
}

function getHomePumpkinsSvg() {
  return `
    <div class="home-pumpkins-floor" title="Осенние тыквы и свечи">
      <svg viewBox="0 0 70 46" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="32" rx="14" ry="11" fill="#E07D3C"/>
        <ellipse cx="24" cy="32" rx="8" ry="11" fill="#EA8F4E"/>
        <rect x="22" y="17" width="4" height="5" rx="1" fill="#5D7D4E"/>
        <ellipse cx="48" cy="35" rx="10" ry="8" fill="#D46A34"/>
        <rect x="34" y="26" width="6" height="14" rx="1" fill="#FFF7E2"/>
        <ellipse cx="37" cy="23" rx="2" ry="3.5" fill="#FFBE42"/>
      </svg>
    </div>
  `;
}

function getFloorLampSvg() {
  return `
    <div class="home-lamp-wrap" title="Тёплый торшер">
      <div class="home-lamp-glow"></div>
      <svg viewBox="0 0 80 130" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="38" y="42" width="4" height="78" fill="#8C6D56"/>
        <ellipse cx="40" cy="121" rx="18" ry="5" fill="#735743"/>
        <polygon points="24,14 56,14 64,44 16,44" fill="#FCE6B4" stroke="#E0BA73" stroke-width="2"/>
        <ellipse cx="40" cy="44" rx="23" ry="4" fill="#FFF3CF" opacity="0.8"/>
      </svg>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}