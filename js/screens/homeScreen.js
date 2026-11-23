/**
 * js/screens/homeScreen.js
 * Уютная квартира флориста: пушистая черепаховая кошка, мячик, сон, безлимитный декор и расчёт сети
 */

import {
  FLOWERS_CATALOG,
  WEATHERS,
  HOME_LOCATIONS,
  FRANCHISE_CATALOG,
  DECOR_CATALOG,
  getGameDateObj,
  getSeasonInfo,
  getWeatherForSeason,
  getHolidayForDate
} from '../config.js';
import { gameState, saveState } from '../state.js';
import { renderExtraHomeWallDecor, renderExtraHomeFloorDecor } from '../graphics/homeDecorSvg.js';
import { playPurrSound, playClickSound } from '../sound.js';

let catWalkTimer = null;
let catPosX = 48;
let catDir = 1;
let catIsWalking = false;
let catIsPurring = false;
let catMoodBubble = '';
let catBubbleTimer = null;
let catBallPosX = 28;
let catChasingBall = false;
let showHomeDecorModal = false;

function isHomeDecorShown(id) {
  const owned =
    (gameState.decorInventory && gameState.decorInventory.includes(id)) ||
    (gameState.decor && gameState.decor.includes(id));
  if (!owned) return false;
  return !(gameState.hiddenDecor || []).includes(id);
}

export function renderHomeScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-home');
  if (!container) return;

  const isDay = gameState.timeIndex < 2 && gameState.timeMinutes < 17 * 60;
  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const season = getSeasonInfo(curDate);
  const isRainy = gameState.weather === 'rainy';
  const isFrost = gameState.weather === 'frost';

  const currentHomeLoc =
    HOME_LOCATIONS.find((l) => l.id === gameState.homeLocationId) || HOME_LOCATIONS[0];
  const locClass = `loc-${currentHomeLoc.id}`;

  const hasSofa = isHomeDecorShown('home_sofa');
  const hasRug = isHomeDecorShown('home_rug');
  const hasBed = isHomeDecorShown('cat_bed');
  const hasLamp = isHomeDecorShown('floor_lamp');
  const hasCurtains = isHomeDecorShown('home_curtains');
  const hasBooks = isHomeDecorShown('home_bookshelf');
  const hasPlant = isHomeDecorShown('home_plant');
  const hasFairyLights = isHomeDecorShown('home_fairy_lights');
  const hasPumpkins = isHomeDecorShown('home_pumpkins');
  const hasTree = isHomeDecorShown('home_xmas_tree');
  const hasHearts = isHomeDecorShown('home_hearts');
  const hasCatBall = isHomeDecorShown('cat_ball');
  const hasCatTower = isHomeDecorShown('cat_tower');
  const hasTiffany = isHomeDecorShown('tiffany_lamp_rare');
  const hasMirror = isHomeDecorShown('vintage_mirror');
  const hasMusicBox = isHomeDecorShown('music_box_rare');
  const hasVinyl = isHomeDecorShown('botanical_vinyl');

  const extraWallHtml = renderExtraHomeWallDecor();
  const extraFloorHtml = renderExtraHomeFloorDecor();

  const petName = gameState.petName || 'Пискля';
  const homeOwnedCount = DECOR_CATALOG.filter(
    (d) =>
      d.place === 'Квартира' &&
      ((gameState.decorInventory && gameState.decorInventory.includes(d.id)) ||
        (gameState.decor && gameState.decor.includes(d.id)))
  ).length;

  const windowScenery = getHomeWindowScenery(isDay, season, isRainy, isFrost);
  const hasAnyHomeDecor =
    hasBooks || hasTiffany || hasMirror || hasMusicBox || hasVinyl || hasHearts || Boolean(extraWallHtml);

  const loftBeamsHtml = currentHomeLoc.id === 'home_loft' ? getLoftBeamsSvg() : '';
  const studioArtHtml = currentHomeLoc.id === 'home_studio' && !hasAnyHomeDecor ? getStudioArtSvg() : '';
  const studioBedHtml = currentHomeLoc.id === 'home_studio' ? getBedCornerSvg() : '';
  const fireplaceHtml = currentHomeLoc.id === 'home_loft' ? getHomeFireplaceSvg() : '';
  const balconyHtml =
    currentHomeLoc.id === 'home_balcony'
      ? getBalconyDoorSvg(isDay, season, isRainy, isFrost)
      : '';
  const hasDesignerLamp = currentHomeLoc.id === 'home_balcony';

  container.innerHTML = `
    <div class="screen-header">
      <h1 class="screen-title">${currentHomeLoc.name}</h1>
      <div style="display:flex; gap:6px; align-items:center;">
        <button class="btn btn-soft" id="btn-home-decor-toggle" style="padding:5px 9px; font-size:11.5px;">
          🎨 Декор (${homeOwnedCount})
        </button>
        <span class="badge badge-ok">⚡ ${gameState.energy}%</span>
      </div>
    </div>

    <div class="home-room-scene ${locClass}">
      ${loftBeamsHtml}
      ${
        hasFairyLights
          ? `
        <div class="home-fairy-lights">
          ${Array.from({ length: 12 })
            .map(
              () => `
            <div class="fairy-strand">
              <div class="fairy-wire"></div>
              <div class="fairy-dot"></div>
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }

      <div class="home-top-wall">
        <div class="home-window-wrap">
          <div class="home-window ${isDay ? 'day' : ''}">
            ${windowScenery}
            <div class="window-pane-v"></div>
            <div class="window-pane-h"></div>
          </div>
          ${hasCurtains ? '<div class="home-curtain left"></div><div class="home-curtain right"></div>' : ''}
        </div>

        <div class="home-wall-center">
          ${hasHearts ? '<div class="home-hearts-wall">💕 💗 💕</div>' : ''}
          ${studioArtHtml}
          ${hasBooks ? getBookshelfSvg() : ''}
          <div style="display:flex; gap:6px; align-items:flex-end; justify-content:center; flex-wrap:wrap;">
            ${hasTiffany ? getTiffanyLampSvg() : ''}
            ${hasMirror ? getVintageMirrorSvg() : ''}
            ${hasMusicBox ? getMusicBoxSvg() : ''}
            ${hasVinyl ? getVinylSvg() : ''}
            ${hasDesignerLamp ? getDesignerLampSvg() : ''}
            ${extraWallHtml}
          </div>
        </div>

        ${fireplaceHtml}
        ${balconyHtml}
        ${hasLamp ? getFloorLampSvg() : ''}
      </div>

      <div class="home-walk-stage" id="home-walk-stage">
        ${studioBedHtml}
        ${hasSofa ? getSofaSvg() : ''}
        ${hasRug ? '<div class="home-rug"></div>' : ''}
        ${hasBed ? getCatBedFloorSvg() : ''}
        ${hasPlant ? getFicusPlantSvg() : ''}
        ${hasCatTower ? getCatTowerSvg() : ''}
        ${hasPumpkins ? getHomePumpkinsSvg() : ''}
        ${hasTree ? getHomeXmasTreeSvg() : ''}
        ${extraFloorHtml}

        ${
          hasCatBall
            ? `
          <button class="home-cat-ball-floor" id="btn-cat-ball" title="Толкнуть мячик для ${escapeHtml(petName)}" style="left: ${catBallPosX}%;">
            ${getCatBallSvg()}
          </button>
        `
            : ''
        }

        <button
          class="cat-walker ${catIsWalking ? 'is-walking' : ''} ${catIsPurring ? 'is-purring' : ''}"
          id="btn-pet-cat"
          title="Погладить ${escapeHtml(petName)}"
          style="left: ${catPosX}%;"
        >
          ${catMoodBubble ? `<div class="cat-thought-bubble">${catMoodBubble}</div>` : ''}
          <div class="cat-hearts-layer" id="cat-hearts-layer"></div>
          <div class="cat-sprite-flip" style="transform: scaleX(${catDir});">
            <div class="cat-body-bob">
              ${getCatSvg()}
            </div>
          </div>
        </button>
      </div>
    </div>

    <div class="pet-spot">
      <div class="row-between">
        <div style="display:flex; align-items:center; gap:6px;">
          <strong style="font-size:13.5px;">🐾 ${escapeHtml(petName)}</strong>
          <button class="btn btn-soft" id="btn-rename-pet" style="padding:2px 7px; font-size:10.5px;">✏️ Имя</button>
        </div>
        <span class="badge ${gameState.petMood >= 70 ? 'badge-ok' : 'badge-warn'}">
          Радость: ${gameState.petMood}%
        </span>
      </div>
      <div class="muted-text" style="font-size:11.5px;">
        Нажми на ${escapeHtml(petName)} на полу, чтобы погладить${hasCatBall ? ', или кинь ей мячик!' : '!'}
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-primary" id="btn-pet-play" style="flex:1; padding:9px;">
          💕 Погладить
        </button>
        <button class="btn btn-sage" id="btn-feed-pet" style="flex:1; padding:9px;" ${gameState.petFedToday ? 'disabled' : ''}>
          ${gameState.petFedToday ? '🍲 Накормлена' : '🐟 Покормить (60 ₽)'}
        </button>
      </div>
      ${
        hasCatBall
          ? `<button class="btn btn-soft" id="btn-throw-ball" style="padding:8px;">
              🧶 Кинуть мячик
            </button>`
          : ''
      }
    </div>

    <div class="card">
      <div class="row-between">
        <div>
          <h3 class="section-title">Отдых и новый день</h3>
          <p class="muted-text" style="font-size:12px;">
            Сон до 09:00 следующего дня, смена погоды, утренний уход флориста и отчёт сети.
          </p>
        </div>
      </div>

      <button class="btn btn-sage" id="btn-sleep-next-day" style="padding: 13px;">
        🌙 Лечь спать и начать День ${gameState.day + 1}
      </button>
    </div>

    ${showHomeDecorModal ? renderHomeDecorModalHtml() : ''}
  `;

  bindHomeEvents(container, onHudUpdate, showToast);
  startCatWalkLoop();
}

function renderHomeDecorModalHtml() {
  const ownedIds = Array.from(
    new Set([...(gameState.decorInventory || []), ...(gameState.decor || [])])
  );
  const homeDecorItems = DECOR_CATALOG.filter(
    (d) => d.place === 'Квартира' && ownedIds.includes(d.id)
  );

  const listHtml = homeDecorItems.length
    ? homeDecorItems
        .map((item) => {
          const isHidden = (gameState.hiddenDecor || []).includes(item.id);
          return `
            <div class="decor-toggle-row">
              <div style="display:flex; align-items:center; gap:8px; min-width:0;">
                <span style="font-size:18px;">${item.icon}</span>
                <div style="min-width:0;">
                  <strong style="font-size:12px;">${item.name}</strong>
                  <div class="muted-text" style="font-size:10.5px;">${item.effectText}</div>
                </div>
              </div>
              <button class="btn ${isHidden ? 'btn-sage' : 'btn-soft'}" data-toggle-home-decor="${item.id}" style="padding:5px 9px; font-size:11px; flex-shrink:0;">
                ${isHidden ? 'Поставить' : 'Убрать'}
              </button>
            </div>
          `;
        })
        .join('')
    : `<p class="muted-text" style="font-size:12px; text-align:center; padding:10px;">Для квартиры пока ничего не куплено. Загляни в «Телефон → Декор»!</p>`;

  return `
    <div class="vase-modal-overlay" id="home-decor-modal-overlay">
      <div class="setup-modal-card" style="max-width:355px;">
        <div class="row-between">
          <strong style="font-size:15px;">🎨 Декор квартиры (без ограничений)</strong>
          <button class="btn btn-soft" id="btn-close-home-decor" style="padding:5px 10px; font-size:12px;">✕</button>
        </div>
        <div class="decor-toggle-list">${listHtml}</div>
      </div>
    </div>
  `;
}

function startCatWalkLoop() {
  if (catWalkTimer) clearInterval(catWalkTimer);

  catWalkTimer = setInterval(() => {
    const walker = document.getElementById('btn-pet-cat');
    if (!walker || !document.getElementById('screen-home')?.classList.contains('active')) {
      clearInterval(catWalkTimer);
      catWalkTimer = null;
      return;
    }

    if (catChasingBall) return;

    if (Math.random() < 0.72) {
      const targetX = 16 + Math.random() * 68;
      if (Math.abs(targetX - catPosX) < 6) return;

      catDir = targetX > catPosX ? 1 : -1;
      catIsWalking = true;
      catPosX = Math.round(targetX);

      walker.style.transition = 'left 2.4s ease-in-out';
      walker.style.left = `${catPosX}%`;
      walker.classList.add('is-walking');
      const flipEl = walker.querySelector('.cat-sprite-flip');
      if (flipEl) flipEl.style.transform = `scaleX(${catDir})`;

      setTimeout(() => {
        catIsWalking = false;
        walker.classList.remove('is-walking');
      }, 2400);
    }
  }, 3600);
}

function triggerCatPurr(bubbleText, onHudUpdate, showToast) {
  playPurrSound();
  gameState.petMood = Math.min(100, gameState.petMood + 5);
  gameState.mood = Math.min(100, gameState.mood + 2);
  saveState();
  onHudUpdate();

  catIsPurring = true;
  catMoodBubble = bubbleText || 'Мур-р-р ♥';
  if (catBubbleTimer) clearTimeout(catBubbleTimer);

  const walker = document.getElementById('btn-pet-cat');
  if (walker) {
    walker.classList.add('is-purring');
    let bubbleEl = walker.querySelector('.cat-thought-bubble');
    if (!bubbleEl) {
      bubbleEl = document.createElement('div');
      bubbleEl.className = 'cat-thought-bubble';
      walker.prepend(bubbleEl);
    }
    bubbleEl.textContent = catMoodBubble;

    const heartsLayer = document.getElementById('cat-hearts-layer');
    if (heartsLayer) {
      ['💖', '✨', '💕', '🐾'].forEach((symbol, i) => {
        const span = document.createElement('span');
        span.className = 'cat-heart-particle';
        span.textContent = symbol;
        span.style.left = `${14 + i * 16 + Math.random() * 8}px`;
        span.style.animationDelay = `${i * 0.1}s`;
        heartsLayer.appendChild(span);
        setTimeout(() => span.remove(), 1300);
      });
    }
  }

  catBubbleTimer = setTimeout(() => {
    catIsPurring = false;
    catMoodBubble = '';
    const w = document.getElementById('btn-pet-cat');
    if (w) {
      w.classList.remove('is-purring');
      w.querySelector('.cat-thought-bubble')?.remove();
    }
  }, 1500);

  showToast(`${gameState.petName || 'Пискля'}: «Мур-мур!» (+2% атмосферы)`);
}

function bindHomeEvents(container, onHudUpdate, showToast) {
  document.getElementById('btn-home-decor-toggle')?.addEventListener('click', () => {
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

  container.querySelectorAll('[data-toggle-home-decor]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggleHomeDecor;
      if (!Array.isArray(gameState.hiddenDecor)) gameState.hiddenDecor = [];
      if (gameState.hiddenDecor.includes(id)) {
        gameState.hiddenDecor = gameState.hiddenDecor.filter((x) => x !== id);
      } else {
        gameState.hiddenDecor.push(id);
      }
      saveState();
      renderHomeScreen(onHudUpdate, showToast);
    });
  });

  const handleThrowBall = () => {
    const ballEl = document.getElementById('btn-cat-ball');
    const walker = document.getElementById('btn-pet-cat');
    if (!ballEl || !walker || catChasingBall) return;

    playClickSound();
    catChasingBall = true;
    const nextBallX = catBallPosX < 50 ? 64 + Math.round(Math.random() * 20) : 14 + Math.round(Math.random() * 22);
    catBallPosX = nextBallX;
    ballEl.style.left = `${nextBallX}%`;
    ballEl.style.transform = `translateX(-50%) rotate(${nextBallX * 14}deg)`;

    const targetCatX = nextBallX > catPosX ? Math.max(14, nextBallX - 8) : Math.min(82, nextBallX + 8);
    catDir = targetCatX >= catPosX ? 1 : -1;
    catPosX = targetCatX;

    walker.style.transition = 'left 1.1s ease-out';
    walker.style.left = `${catPosX}%`;
    walker.classList.add('is-walking');
    const flipEl = walker.querySelector('.cat-sprite-flip');
    if (flipEl) flipEl.style.transform = `scaleX(${catDir})`;

    setTimeout(() => {
      walker.classList.remove('is-walking');
      catChasingBall = false;
      triggerCatPurr('Тыгыдык! 🧶', onHudUpdate, showToast);
    }, 1150);
  };

  document.getElementById('btn-cat-ball')?.addEventListener('click', handleThrowBall);
  document.getElementById('btn-throw-ball')?.addEventListener('click', handleThrowBall);

  document.getElementById('btn-rename-pet')?.addEventListener('click', () => {
    const newName = prompt('Как назвать твою кошку?', gameState.petName || 'Пискля');
    if (newName && newName.trim()) {
      gameState.petName = newName.trim().slice(0, 20);
      saveState();
      showToast(`Кошку теперь зовут ${gameState.petName}! 🐾`);
      renderHomeScreen(onHudUpdate, showToast);
    }
  });

  document.getElementById('btn-pet-cat')?.addEventListener('click', () => {
    triggerCatPurr('Мур-р-р ♥', onHudUpdate, showToast);
  });

  document.getElementById('btn-pet-play')?.addEventListener('click', () => {
    triggerCatPurr('Люблю тебя ♥', onHudUpdate, showToast);
  });

  document.getElementById('btn-feed-pet')?.addEventListener('click', () => {
    if (gameState.petFedToday) return;
    if (gameState.money < 60) {
      showToast('Не хватает 60 ₽ на лакомство!');
      return;
    }
    gameState.money -= 60;
    gameState.totalSpent += 60;
    gameState.petFedToday = true;
    gameState.petMood = Math.min(100, gameState.petMood + 15);
    gameState.mood = Math.min(100, gameState.mood + 3);
    saveState();
    onHudUpdate();
    triggerCatPurr('Вкусно! Мяу~', onHudUpdate, showToast);
    renderHomeScreen(onHudUpdate, showToast);
  });

  document.getElementById('btn-sleep-next-day')?.addEventListener('click', () => {
    sleepToNextDay(onHudUpdate, showToast);
  });
}

function sleepToNextDay(onHudUpdate, showToast) {
  gameState.day += 1;
  gameState.timeIndex = 0;
  gameState.timeMinutes = (gameState.openHour || 9) * 60;
  gameState.shownCloseHint = false;
  gameState.preorders = [];
  gameState.deliveries = (gameState.deliveries || []).filter((d) => d.status === 'delivered');

  const curLoc = HOME_LOCATIONS.find((l) => l.id === gameState.homeLocationId);
  const locBonus = curLoc ? curLoc.energyBonus : 0;
  const energyBonus = (isHomeDecorShown('cat_bed') ? 8 : 0) + locBonus;
  gameState.energy = Math.min(100, 88 + energyBonus);
  gameState.petFedToday = false;

  const newDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const newSeason = getSeasonInfo(newDate);
  gameState.weather = getWeatherForSeason(newSeason.id);

  const fridgeFactor = gameState.hasFridge ? 0.65 : 1;
  gameState.inventory.forEach((item) => {
    const meta = FLOWERS_CATALOG[item.typeId];
    if (!meta) return;
    item.wateredThisShift = false;
    item.freshness = Math.max(0, Math.round(item.freshness - meta.decayPerShift * fridgeFactor));
  });

  const florist = (gameState.employees || []).find((e) => e.roleId === 'assistant');
  let autoWateredCount = 0;
  if (florist) {
    gameState.inventory.forEach((item) => {
      if (item.freshness < 75) {
        item.freshness = Math.min(100, item.freshness + 10);
        item.wateredThisShift = true;
        autoWateredCount += 1;
      }
    });
  }

  gameState.daysUntilRent -= 1;
  let extraMsg = '';
  if (gameState.daysUntilRent <= 0) {
    gameState.money -= gameState.weeklyRent;
    gameState.totalSpent += gameState.weeklyRent;
    gameState.daysUntilRent = 7;
    gameState.rentWarning = gameState.money < 0;
    extraMsg = ` Списана аренда -${gameState.weeklyRent} ₽.`;
  }

  let networkEarnedToday = 0;
  let networkRentToday = 0;
  if (!Array.isArray(gameState.franchiseLedger)) gameState.franchiseLedger = [];

  (gameState.franchises || []).forEach((b) => {
    const meta = FRANCHISE_CATALOG.find((m) => m.id === b.id);
    if (!meta) return;

    const branchStaff = (gameState.employees || []).filter((e) => e.branchId === b.id);
    let dayRev = b.todayEarned || 0;
    if (branchStaff.length > 0 && (b.todayTicks || 0) < 4) {
      const remChunks = 4 - (b.todayTicks || 0);
      const dailyTarget = meta.minDailyRevenue + Math.random() * (meta.maxDailyRevenue - meta.minDailyRevenue);
      const restGain = Math.round((dailyTarget / 4) * remChunks);
      dayRev += restGain;
      networkEarnedToday += restGain;
      gameState.money += restGain;
      gameState.totalEarned += restGain;
      b.totalEarned = (b.totalEarned || 0) + restGain;
    }

    let rentPaid = 0;
    b.daysUntilRent = (b.daysUntilRent ?? 7) - 1;
    if (b.daysUntilRent <= 0) {
      rentPaid = meta.weeklyRent;
      b.daysUntilRent = 7;
      b.totalSpent = (b.totalSpent || 0) + rentPaid;
      gameState.money -= rentPaid;
      gameState.totalSpent += rentPaid;
      networkRentToday += rentPaid;
    }

    const staffSal = branchStaff.reduce((s, e) => s + (e.hiredDay < gameState.day ? Number(e.salary) || 0 : 0), 0);
    if (dayRev > 0 || rentPaid > 0 || staffSal > 0) {
      gameState.franchiseLedger.unshift({
        day: gameState.day - 1,
        branchId: b.id,
        branchName: b.name,
        revenue: dayRev,
        expenses: rentPaid + staffSal,
        net: dayRev - rentPaid - staffSal,
        note: branchStaff.length ? 'Смена сети' : 'Простой'
      });
    }
    b.todayEarned = 0;
    b.todayTicks = 0;
  });
  gameState.franchiseLedger = gameState.franchiseLedger.slice(0, 45);

  const totalSalaries = (gameState.employees || []).reduce(
    (sum, e) => sum + (e.hiredDay < gameState.day ? Number(e.salary) || 0 : 0),
    0
  );
  if (totalSalaries > 0) {
    gameState.money -= totalSalaries;
    gameState.totalSpent += totalSalaries;
    extraMsg += ` 💼 Зарплата команды: -${totalSalaries} ₽.`;
  }
  if (networkEarnedToday > 0) extraMsg += ` 🏢 Доход сети: +${networkEarnedToday} ₽.`;
  if (networkRentToday > 0) extraMsg += ` 🧾 Аренда филиалов: -${networkRentToday} ₽.`;

  if (florist && autoWateredCount > 0) {
    extraMsg += ` 💧 ${florist.name} утром сменил(а) воду в ${autoWateredCount} увядающих ваз(ах)!`;
    let dm = (gameState.directMessages || []).find((m) => m.kind === 'employee' && m.employeeId === florist.id);
    if (!dm) {
      dm = {
        id: 'dm_emp_' + florist.id,
        senderName: `${florist.name} (${florist.roleName})`,
        kind: 'employee',
        employeeId: florist.id,
        text: '',
        read: false,
        day: gameState.day,
        createdTimeLabel: '09:00',
        thread: []
      };
      gameState.directMessages.unshift(dm);
    }
    const morningNote = `Доброе утро! Сменил воду в ${autoWateredCount} увядающих вазах, витрина свежая 💧🌸`;
    dm.thread.push({ sender: 'client', text: morningNote });
    dm.text = morningNote;
    dm.read = false;
  }

  gameState.powerOutage = Math.random() < 0.22;
  gameState.candlesLit = false;

  const holiday = getHolidayForDate(newDate);
  if (holiday) extraMsg += ` 🎉 Сегодня ${holiday.name}!`;
  else if (gameState.powerOutage) extraMsg += ' ⚡ В магазине отключили свет — зажги свечи!';

  saveState();
  onHudUpdate();

  const wLabel = WEATHERS.find((w) => w.id === gameState.weather)?.label || 'Ясно';
  showToast(`Доброе утро! День ${gameState.day}. Погода: ${wLabel}.${extraMsg}`);
  renderHomeScreen(onHudUpdate, showToast);
}

function getHomeWindowScenery(isDay, season, isRainy, isFrost) {
  const skyText = isDay
    ? '<circle cx="80" cy="18" r="10" fill="#FFE382" opacity="0.9"/>'
    : '<circle cx="80" cy="18" r="8" fill="#FFF7D6"/><circle cx="24" cy="14" r="1.5" fill="#FFF"/><circle cx="48" cy="22" r="1.5" fill="#FFF"/>';
  const hillFill = season.id === 'winter' || isFrost ? '#F2F7FA' : season.id === 'autumn' ? '#D98A4E' : '#8EB889';
  const rainSvg = isRainy ? '<line x1="25" y1="8" x2="20" y2="28" stroke="#FFF" stroke-width="1.5" opacity="0.6"/><line x1="55" y1="16" x2="50" y2="36" stroke="#FFF" stroke-width="1.5" opacity="0.6"/>' : '';
  return `<svg class="home-window-svg" viewBox="0 0 106 82">${skyText}<path d="M0,62 Q35,52 65,60 T106,58 L106,82 L0,82 Z" fill="${hillFill}"/>${rainSvg}</svg>`;
}

function getBalconyDoorSvg(isDay, season, isRainy, isFrost) {
  const hillColor = season.id === 'winter' || isFrost ? '#EDF4F8' : season.id === 'autumn' ? '#D6894C' : '#96BF91';
  const celestial = isDay ? '<circle cx="68" cy="22" r="9" fill="#FFE382"/>' : '<circle cx="68" cy="22" r="8" fill="#FFF6D6"/>';
  const rain = isRainy ? '<line x1="24" y1="14" x2="18" y2="34" stroke="#FFF" stroke-width="1.5" opacity="0.6"/>' : '';
  return `
    <div class="home-balcony-door ${isDay ? '' : 'night'}" title="Выход на балкон">
      <svg viewBox="0 0 90 116" width="100%" height="100%">
        ${celestial}
        <path d="M0,78 Q45,68 90,78 L90,116 L0,116 Z" fill="${hillColor}"/>
        <line x1="0" y1="76" x2="90" y2="76" stroke="#8C7B73" stroke-width="3"/>
        <line x1="18" y1="76" x2="18" y2="116" stroke="#8C7B73" stroke-width="2"/>
        <line x1="45" y1="76" x2="45" y2="116" stroke="#8C7B73" stroke-width="2"/>
        <line x1="72" y1="76" x2="72" y2="116" stroke="#8C7B73" stroke-width="2"/>
        <line x1="45" y1="0" x2="45" y2="116" stroke="#FFFDF9" stroke-width="3"/>
        ${rain}
      </svg>
    </div>
  `;
}

function getHomeFireplaceSvg() {
  return `
    <div class="home-fireplace" title="Живой камин в мансарде">
      <svg viewBox="0 0 102 98" width="100%" height="100%">
        <rect x="8" y="24" width="86" height="72" rx="6" fill="#E8D7C5" stroke="#C4A68C" stroke-width="2"/>
        <rect x="4" y="18" width="94" height="10" rx="3" fill="#B8906E"/>
        <path d="M26,96 L26,54 Q51,38 76,54 L76,96 Z" fill="#43332E"/>
        <g class="fireplace-flame">
          <path d="M40,92 Q45,62 51,54 Q58,64 62,92 Z" fill="#FF9436"/>
          <path d="M45,92 Q50,70 53,65 Q57,74 58,92 Z" fill="#FFE073"/>
        </g>
        <rect x="34" y="88" width="34" height="6" rx="3" fill="#6E4A36"/>
      </svg>
    </div>
  `;
}

function getCatBedFloorSvg() {
  return `
    <div class="home-cat-bed-floor">
      <svg viewBox="0 0 82 28" width="100%" height="100%">
        <ellipse cx="41" cy="18" rx="36" ry="9" fill="#E7B1A8" stroke="#C98A7E" stroke-width="2"/>
        <ellipse cx="41" cy="17" rx="26" ry="6" fill="#FAF0E8"/>
      </svg>
    </div>
  `;
}

function getSofaSvg() {
  return `
    <div class="home-sofa-wrap">
      <svg viewBox="0 0 114 54" width="100%" height="100%">
        <rect x="10" y="12" width="94" height="24" rx="10" fill="#E4ADA3"/>
        <rect x="4" y="22" width="14" height="24" rx="6" fill="#D5968B"/>
        <rect x="96" y="22" width="14" height="24" rx="6" fill="#D5968B"/>
        <rect x="14" y="28" width="86" height="16" rx="5" fill="#EEC1B8"/>
        <rect x="20" y="44" width="6" height="8" rx="2" fill="#8C6D56"/>
        <rect x="88" y="44" width="6" height="8" rx="2" fill="#8C6D56"/>
        <rect x="24" y="16" width="16" height="14" rx="4" fill="#FFF7EB"/>
      </svg>
    </div>
  `;
}

function getFloorLampSvg() {
  return `
    <div class="home-lamp-wrap">
      <div class="home-lamp-glow"></div>
      <svg viewBox="0 0 60 108" width="100%" height="100%">
        <line x1="30" y1="28" x2="30" y2="98" stroke="#9C7A5C" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="30" cy="99" rx="16" ry="4" fill="#8C6A4D"/>
        <polygon points="12,30 48,30 40,8 20,8" fill="#FFE6A8" stroke="#D9A86C" stroke-width="2"/>
      </svg>
    </div>
  `;
}

function getBookshelfSvg() {
  return `
    <div class="home-wall-bookshelf">
      <svg viewBox="0 0 96 62" width="100%" height="100%">
        <rect x="8" y="34" width="80" height="7" rx="3" fill="#B8906E"/>
        <rect x="14" y="12" width="9" height="22" rx="2" fill="#D98A7C"/>
        <rect x="25" y="16" width="8" height="18" rx="2" fill="#9BB59B"/>
        <rect x="35" y="10" width="10" height="24" rx="2" fill="#E8C67B"/>
        <rect x="47" y="15" width="8" height="19" rx="2" fill="#B89CC9"/>
        <polygon points="68,34 80,34 78,24 70,24" fill="#E6A492"/>
        <path d="M74,24 Q80,32 76,48 M71,24 Q64,34 67,46" stroke="#6E9E69" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    </div>
  `;
}

function getFicusPlantSvg() {
  return `
    <div class="home-plant-floor">
      <svg viewBox="0 0 48 70" width="100%" height="100%">
        <polygon points="14,66 34,66 38,44 10,44" fill="#FAF0E2" stroke="#D9C3B0" stroke-width="2"/>
        <line x1="24" y1="44" x2="24" y2="18" stroke="#7E5B3E" stroke-width="3"/>
        <ellipse cx="15" cy="24" rx="9" ry="5" transform="rotate(-25 15 24)" fill="#7EB57B"/>
        <ellipse cx="33" cy="22" rx="9" ry="5" transform="rotate(25 33 22)" fill="#6E9E69"/>
        <ellipse cx="24" cy="13" rx="8" ry="6" fill="#89BF86"/>
      </svg>
    </div>
  `;
}

function getHomePumpkinsSvg() {
  return `
    <div class="home-pumpkins-floor">
      <svg viewBox="0 0 54 36" width="100%" height="100%">
        <ellipse cx="20" cy="24" rx="14" ry="10" fill="#E68A3E"/>
        <ellipse cx="38" cy="26" rx="10" ry="7" fill="#D9742B"/>
        <path d="M20,14 Q22,9 24,11" stroke="#5B875B" stroke-width="2.5" fill="none"/>
      </svg>
    </div>
  `;
}

function getHomeXmasTreeSvg() {
  return `
    <div class="home-tree-floor">
      <svg viewBox="0 0 62 92" width="100%" height="100%">
        <rect x="26" y="76" width="10" height="12" fill="#7E5B3E"/>
        <polygon points="31,10 10,44 52,44" fill="#5D8C61"/>
        <polygon points="31,26 7,62 55,62" fill="#4E7B52"/>
        <polygon points="31,42 4,78 58,78" fill="#3F6943"/>
        <circle cx="31" cy="9" r="4.5" fill="#FFE073"/>
        <circle cx="24" cy="36" r="3" fill="#E87A88"/>
        <circle cx="38" cy="48" r="3" fill="#FFE382"/>
        <circle cx="22" cy="64" r="3" fill="#89B9DF"/>
      </svg>
    </div>
  `;
}

function getCatBallSvg() {
  return `
    <svg viewBox="0 0 28 28" width="100%" height="100%">
      <circle cx="14" cy="14" r="11" fill="#F29AA4" stroke="#D16E7A" stroke-width="1.5"/>
      <path d="M7,10 Q14,16 21,9 M6,17 Q14,12 22,18" stroke="#FFFDF9" stroke-width="1.6" fill="none"/>
    </svg>
  `;
}

function getCatSvg() {
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <radialGradient id="catBodyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#44332C"/>
          <stop offset="70%" stop-color="#2B201C"/>
          <stop offset="100%" stop-color="#1E1512"/>
        </radialGradient>
        <radialGradient id="catChestGrad" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#F2D2A9"/>
          <stop offset="70%" stop-color="#DFAD72"/>
          <stop offset="100%" stop-color="#C47D3E"/>
        </radialGradient>
        <linearGradient id="catGingerSpot" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E89E52"/>
          <stop offset="100%" stop-color="#BA6A2B"/>
        </linearGradient>
        <radialGradient id="catEyeGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FFE173"/>
          <stop offset="65%" stop-color="#F0AE2B"/>
          <stop offset="100%" stop-color="#C77B14"/>
        </radialGradient>
      </defs>

      <!-- Мягкая тень под сидящей кошкой -->
      <ellipse cx="52" cy="91" rx="24" ry="5" fill="rgba(74, 62, 57, 0.18)"/>

      <!-- Пушистый хвост, который мягко шевелится -->
      <g class="cat-tail-svg">
        <path d="M30,80 Q10,75 11,53 Q12,42 20,45 Q24,50 22,64 Q24,72 34,75 Z" fill="url(#catBodyGrad)"/>
        <path d="M13,54 Q15,45 20,47 Q21,57 17,62 Z" fill="url(#catGingerSpot)" opacity="0.82"/>
      </g>

      <!-- Сидящее пушистое тело -->
      <path d="M31,79 Q28,55 44,48 L62,48 Q77,56 73,80 Q71,89 52,89 Q33,89 31,79 Z" fill="url(#catBodyGrad)"/>
      <!-- Мягкие черепаховые переливы на боках -->
      <path d="M33,66 Q38,54 46,60 Q45,73 35,76 Z" fill="url(#catGingerSpot)" opacity="0.58"/>
      <path d="M62,56 Q72,62 71,75 Q64,74 61,63 Z" fill="url(#catGingerSpot)" opacity="0.48"/>

      <!-- Пушистая светло-золотистая грудка -->
      <path d="M41,51 Q52,48 63,51 Q66,68 58,76 Q52,80 46,76 Q38,68 41,51 Z" fill="url(#catChestGrad)"/>

      <!-- Аккуратные сидящие лапки -->
      <path d="M40,66 Q39,81 42,88 Q46,90 49,87 Q48,74 47,66 Z" fill="#2A1F1B"/>
      <ellipse cx="44.5" cy="87.5" rx="4.5" ry="3.2" fill="#E9C292"/>
      <path d="M56,66 Q55,74 54,87 Q57,90 61,88 Q64,81 62,66 Z" fill="#322520"/>
      <ellipse cx="58.5" cy="87.5" rx="4.5" ry="3.2" fill="#DE9A59"/>

      <!-- Пушистая голова и щёчки -->
      <path d="M33,36 Q32,20 52,19 Q72,20 71,36 Q73,47 64,52 Q52,56 40,52 Q31,47 33,36 Z" fill="url(#catBodyGrad)"/>
      <!-- Пушистые щёчки -->
      <ellipse cx="36" cy="42" rx="6" ry="5" fill="#3B2D27"/>
      <ellipse cx="68" cy="42" rx="6" ry="5" fill="#362823"/>

      <!-- Мягкие пушистые ушки -->
      <path d="M34,28 Q31,10 43,14 Q47,18 46,24 Z" fill="#281E1A"/>
      <path d="M36,24 Q35,14 42,17 Q44,20 43,23 Z" fill="#E3A89C" opacity="0.72"/>
      <path d="M70,28 Q73,10 61,14 Q57,18 58,24 Z" fill="url(#catGingerSpot)"/>
      <path d="M68,24 Q69,14 62,17 Q60,20 61,23 Z" fill="#E8B2A6" opacity="0.78"/>

      <!-- Характерный золотисто-рыжий лучик на лбу (как на фото) -->
      <path d="M49,21 Q54,23 54,32 Q53,37 51,39 Q48,34 46,25 Z" fill="url(#catGingerSpot)" opacity="0.9"/>
      <ellipse cx="61" cy="31" rx="6" ry="4" fill="url(#catGingerSpot)" opacity="0.45"/>

      <!-- Мордочка: тёплая область носика и улыбка -->
      <ellipse cx="52" cy="44" rx="7.5" ry="5.5" fill="#E5BE92" opacity="0.85"/>
      <polygon points="49.5,41.5 54.5,41.5 52,44.2" fill="#E58592"/>
      <path d="M47,45.5 Q49.5,48 52,45.5 Q54.5,48 57,45.5" fill="none" stroke="#3D2C26" stroke-width="1.3" stroke-linecap="round"/>

      <!-- Живые выразительные янтарные глаза, смотрящие на тебя + моргание -->
      <g class="cat-eyes-group">
        <ellipse cx="43" cy="35.5" rx="4.6" ry="4.4" fill="url(#catEyeGrad)"/>
        <ellipse cx="61" cy="35.5" rx="4.6" ry="4.4" fill="url(#catEyeGrad)"/>
        <ellipse cx="43.2" cy="35.5" rx="1.9" ry="3.2" fill="#181210"/>
        <ellipse cx="61.2" cy="35.5" rx="1.9" ry="3.2" fill="#181210"/>
        <circle cx="41.6" cy="33.8" r="1.4" fill="#FFFDF9"/>
        <circle cx="59.6" cy="33.8" r="1.4" fill="#FFFDF9"/>
        <circle cx="44.6" cy="37.2" r="0.6" fill="#FFFDF9" opacity="0.8"/>
        <circle cx="62.6" cy="37.2" r="0.6" fill="#FFFDF9" opacity="0.8"/>
        <!-- Веки для анимации моргания -->
        <ellipse class="cat-eyelid" cx="43" cy="35.5" rx="5" ry="4.8" fill="#2E221D"/>
        <ellipse class="cat-eyelid" cx="61" cy="35.5" rx="5" ry="4.8" fill="#2E221D"/>
      </g>

      <!-- Тонкие светлые усики -->
      <path d="M39,43 L25,41 M39,45.5 L24,46.5 M65,43 L79,41 M65,45.5 L80,46.5" stroke="#F4EAE0" stroke-width="1.1" stroke-linecap="round" opacity="0.85"/>
    </svg>
  `;
}

function getCatTowerSvg() {
  return `
    <div class="home-cat-tower-floor" title="Домик-когтеточка для кошки">
      <svg viewBox="0 0 68 112" width="100%" height="100%">
        <rect x="8" y="98" width="52" height="10" rx="4" fill="#E7C5BC"/>
        <rect x="20" y="54" width="8" height="44" fill="#D5B28E"/>
        <rect x="40" y="34" width="8" height="64" fill="#D5B28E"/>
        <rect x="10" y="52" width="34" height="24" rx="5" fill="#F2D7D0" stroke="#D9A89E" stroke-width="1.5"/>
        <circle cx="27" cy="64" r="6" fill="#5D4641"/>
        <rect x="28" y="26" width="32" height="9" rx="4" fill="#E7C5BC"/>
      </svg>
    </div>
  `;
}

function getTiffanyLampSvg() {
  return `
    <span class="home-rare-decor-spot" title="Витражная лампа Тиффани">
      <svg viewBox="0 0 36 44" width="30" height="36">
        <line x1="18" y1="22" x2="18" y2="39" stroke="#6E4E3E" stroke-width="3"/>
        <ellipse cx="18" cy="40" rx="9" ry="3" fill="#6E4E3E"/>
        <path d="M5,23 Q18,5 31,23 Z" fill="#FFE694" stroke="#6E4E3E" stroke-width="1.5"/>
        <path d="M11,23 L14,13 M18,23 L18,12 M25,23 L22,13" stroke="#D96B78" stroke-width="2"/>
      </svg>
    </span>
  `;
}

function getVintageMirrorSvg() {
  return `
    <span class="home-rare-decor-spot" title="Резное трюмо с зеркалом">
      <svg viewBox="0 0 38 48" width="30" height="38">
        <ellipse cx="19" cy="18" rx="13" ry="15" fill="#DFB66B" stroke="#9C7530" stroke-width="1.5"/>
        <ellipse cx="19" cy="18" rx="9.5" ry="11.5" fill="#DDF0FA"/>
        <rect x="6" y="34" width="26" height="10" rx="2" fill="#B8906E"/>
      </svg>
    </span>
  `;
}

function getMusicBoxSvg() {
  return `
    <span class="home-rare-decor-spot" title="Музыкальная шкатулка с балериной">
      <svg viewBox="0 0 36 36" width="28" height="28">
        <rect x="6" y="18" width="24" height="12" rx="3" fill="#D98A7C" stroke="#9E5649" stroke-width="1.5"/>
        <circle cx="18" cy="11" r="2.5" fill="#FFE6D5"/>
        <path d="M18,13 L14,18 L22,18 Z" fill="#FFFDF9"/>
      </svg>
    </span>
  `;
}

function getVinylSvg() {
  return `
    <span class="home-rare-decor-spot" title="Винтажный проигрыватель">
      <svg viewBox="0 0 40 32" width="34" height="26">
        <rect x="4" y="6" width="32" height="22" rx="4" fill="#B88765" stroke="#7E563B" stroke-width="1.5"/>
        <circle cx="17" cy="17" r="7.5" fill="#3B3332"/>
        <circle cx="17" cy="17" r="2.5" fill="#E896A4"/>
        <line x1="29" y1="11" x2="23" y2="18" stroke="#E5D5C5" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </span>
  `;
}

function getStudioArtSvg() {
  return `
    <div class="home-studio-art">
      <svg viewBox="0 0 60 44" width="100%" height="100%">
        <rect x="4" y="4" width="24" height="32" rx="3" fill="#FFFDF9" stroke="#C9A88C" stroke-width="2"/>
        <circle cx="16" cy="18" r="5" fill="#E896A4"/>
        <rect x="34" y="8" width="22" height="28" rx="3" fill="#FFFDF9" stroke="#C9A88C" stroke-width="2"/>
        <path d="M45,28 L45,17 M45,23 L40,20" stroke="#7D9E7F" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
  `;
}

function getLoftBeamsSvg() {
  return `
    <div class="home-loft-beams">
      <svg viewBox="0 0 360 22" width="100%" height="100%" preserveAspectRatio="none">
        <rect x="0" y="0" width="360" height="8" fill="#A97D59"/>
        <polygon points="56,8 68,8 62,22" fill="#8E6545"/>
        <polygon points="292,8 304,8 298,22" fill="#8E6545"/>
      </svg>
    </div>
  `;
}

function getBedCornerSvg() {
  return `
    <div style="position:absolute; bottom:16px; left:6px; width:84px; height:42px; pointer-events:none; z-index:1;">
      <svg viewBox="0 0 84 42" width="100%" height="100%">
        <rect x="4" y="10" width="8" height="28" rx="2" fill="#8C6D56"/>
        <rect x="10" y="20" width="66" height="16" rx="4" fill="#F2D7D0"/>
        <rect x="12" y="14" width="18" height="9" rx="3" fill="#FFFDF9"/>
        <rect x="10" y="34" width="66" height="5" fill="#B8906E"/>
      </svg>
    </div>
  `;
}

function getDesignerLampSvg() {
  return `
    <span class="home-rare-decor-spot" title="Настольная лампа">
      <svg viewBox="0 0 34 40" width="28" height="32">
        <line x1="17" y1="18" x2="17" y2="34" stroke="#9C7A5C" stroke-width="2.5"/>
        <ellipse cx="17" cy="35" rx="8" ry="2.5" fill="#9C7A5C"/>
        <polygon points="7,20 27,20 22,7 12,7" fill="#FFF3D4" stroke="#D9B47E" stroke-width="1.5"/>
      </svg>
    </span>
  `;
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}