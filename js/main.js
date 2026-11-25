/**
 * js/main.js
 * Точка входа: пароль, инициализация, живое время (1 мин = 20 сек), роутинг и таймеры
 */

import { WEATHERS, FLOWERS_CATALOG, FRANCHISE_CATALOG, getGameDateObj, getSeasonInfo, getWeatherForSeason } from './config.js';
import { gameState, saveState, addGameMinutes, isShopClosedNow, getTotalGameMinutes } from './state.js';
import {
  callAI,
  stripCodeFences,
  formatMinutesAsTime,
  generateDirectMessage,
  generateJobCandidateDm,
  generateEmployeeSpontaneousDm,
  generateCourierForceMajeure,
  generateCourierDeliveryReport,
  generatePostDeliveryClientFeedback
} from './ai.js';
import {
  renderShopScreen,
  isBouquetMakerOpen,
  isClientTalkingNow,
  checkPreorderArrival
} from './screens/shopScreen.js';
import { renderPhoneScreen } from './screens/phoneScreen.js';
import { renderHomeScreen } from './screens/homeScreen.js';
import { renderFinanceSettingsScreen } from './screens/financeSettingsScreen.js';
import { playClickSound, playBellSound, playCoinSound, setAmbientMode } from './sound.js';

const AUTH_UNLOCK_KEY = 'fleur_atelier_unlocked_v1';
const SECRET_PASSWORD = 'ШамильАлияНавсегда';

let ambientStarted = false;
let activeToastTimer = null;
let currentNavTab = 'shop';
let clockTimerId = null;
let isClientDmPending = false;
let isEmployeeDmPending = false;
let isJobDmPending = false;
let isTeamTickPending = false;
let nextAutoDmRealMs = Date.now() + 28000;
let nextEmployeeDmRealMs = Date.now() + 65000;
let nextFranchiseTickRealMs = Date.now() + 75000;

document.addEventListener('DOMContentLoaded', () => {
  showPasswordGateIfNeeded();
});

function showPasswordGateIfNeeded() {
  if (localStorage.getItem(AUTH_UNLOCK_KEY) === '1') {
    startApp();
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'setup-modal-overlay';
  overlay.style.zIndex = '200';
  overlay.innerHTML = `
    <div class="setup-modal-card" style="max-width:340px; text-align:center;">
      <div style="font-size:32px;">🔐🌸</div>
      <h2 style="font-family:var(--font-title); font-size:21px; color:var(--text-main);">
        Доступ в Fleur Atelier
      </h2>
      <p class="muted-text" style="font-size:12.5px;">
        Введи пароль, чтобы открыть цветочную лавку
      </p>

      <input
        type="text"
        class="form-input masked-input"
        id="gate-password-input"
        name="fleur_gate_pin"
        autocomplete="off"
        data-form-type="other"
        data-lpignore="true"
        placeholder="Пароль..."
        style="text-align:center; font-size:14px;"
      />
      <p id="gate-error-msg" style="color:var(--danger); font-size:11.5px; font-weight:700; min-height:16px;"></p>

      <button class="btn btn-primary" id="btn-gate-enter" style="padding:11px; font-size:14px;">
        Войти 🌿
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  const input = document.getElementById('gate-password-input');
  const errEl = document.getElementById('gate-error-msg');
  const btn = document.getElementById('btn-gate-enter');

  const tryEnter = () => {
    const val = (input?.value || '').trim();
    if (val === SECRET_PASSWORD) {
      localStorage.setItem(AUTH_UNLOCK_KEY, '1');
      overlay.remove();
      startApp();
    } else {
      if (errEl) errEl.textContent = 'Неверный пароль. Попробуй ещё раз 🌸';
      if (input) input.focus();
    }
  };

  btn?.addEventListener('click', tryEnter);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryEnter();
  });
  setTimeout(() => input?.focus(), 80);
}

function startApp() {
  if (!gameState.isSetupDone) {
    gameState.isSetupDone = true;
    saveState();
  }
  bindTopSounds();
  bindNavigation();
  setupGlobalAudioUnlock();
  renderAll();
  startGameClock();
}

function bindTopSounds() {
  const soundBtn = document.getElementById('btn-toggle-sound');
  const ambientBtn = document.getElementById('btn-toggle-ambient');

  const syncButtons = () => {
    if (soundBtn) {
      soundBtn.textContent = gameState.soundEnabled ? '🔊' : '🔇';
      soundBtn.title = gameState.soundEnabled ? 'Звук включён' : 'Звук выключен';
    }
    if (ambientBtn) {
      const icons = { none: '🎵', cozy: '🎶', rain: '🌧️' };
      const titles = { none: 'Фон: выкл', cozy: 'Фон: уютная музыка', rain: 'Фон: шум дождя' };
      ambientBtn.textContent = icons[gameState.ambientMode] || '🎵';
      ambientBtn.title = titles[gameState.ambientMode] || 'Фон';
    }
  };

  syncButtons();

  soundBtn?.addEventListener('click', () => {
    gameState.soundEnabled = !gameState.soundEnabled;
    if (!gameState.soundEnabled) setAmbientMode('none');
    else setAmbientMode(gameState.ambientMode);
    saveState();
    syncButtons();
    if (gameState.soundEnabled) playClickSound();
  });

  ambientBtn?.addEventListener('click', () => {
    const modes = ['none', 'cozy', 'rain'];
    const idx = modes.indexOf(gameState.ambientMode);
    gameState.ambientMode = modes[(idx + 1) % modes.length];
    ambientStarted = true;
    setAmbientMode(gameState.ambientMode);
    saveState();
    syncButtons();
    const names = { none: 'Фоновый звук выключен', cozy: 'Включена нежная музыка 🎶', rain: 'Включён шум дождя 🌧️' };
    showToast(names[gameState.ambientMode]);
  });
}

function bindNavigation() {
  const buttons = document.querySelectorAll('.nav-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.target;
      if (!targetTab) return;
      playClickSound();
      if (targetTab === currentNavTab) {
        const curScreen = document.getElementById(`screen-${targetTab}`);
        if (curScreen) curScreen.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      switchTab(targetTab);
    });
  });
}

function switchTab(tabName) {
  currentNavTab = tabName;

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === tabName);
  });

  document.querySelectorAll('.screen').forEach((sec) => {
    sec.classList.toggle('active', sec.id === `screen-${tabName}`);
  });

  if (tabName === 'shop') {
    renderShopScreen(updateHud, showToast);
  } else if (tabName === 'phone') {
    renderPhoneScreen(updateHud, showToast);
  } else if (tabName === 'home') {
    renderHomeScreen(updateHud, showToast);
  } else if (tabName === 'finance') {
    renderFinanceSettingsScreen(updateHud, showToast);
  }
}

function setupGlobalAudioUnlock() {
  const unlock = () => {
    if (!ambientStarted && gameState.soundEnabled && gameState.ambientMode !== 'none') {
      ambientStarted = true;
      setAmbientMode(gameState.ambientMode);
    }
    document.removeEventListener('pointerdown', unlock);
  };
  document.addEventListener('pointerdown', unlock);
}

/** Игровые часы: 1 игровая минута каждые 20 секунд реального времени */
function startGameClock() {
  if (clockTimerId) clearInterval(clockTimerId);

  clockTimerId = setInterval(() => {
    if (!isShopClosedNow()) {
      const onBouquetTable = currentNavTab === 'shop' && isBouquetMakerOpen();
      const wasEvening = gameState.timeIndex;
      const justClosed = addGameMinutes(1);
      updateHud();

      if (gameState.timeIndex !== wasEvening && currentNavTab === 'shop' && !onBouquetTable) {
        const scr = document.getElementById('screen-shop');
        const st = scr ? scr.scrollTop : 0;
        renderShopScreen(updateHud, showToast);
        if (scr) scr.scrollTop = st;
      }

      if (justClosed) {
        playBellSound();
        showToast(`🌙 ${gameState.closeHour || 21}:00 — лавка закрывается! Пора в Домик отдыхать.`, 4500);
        if (currentNavTab === 'shop' && !onBouquetTable && !isClientTalkingNow()) {
          renderShopScreen(updateHud, showToast);
        }
      }

      if (!onBouquetTable) {
        checkPreorderArrival(updateHud, showToast);
      }
      maybeReceiveAutoDirectMessage();
      maybeReceiveEmployeeSpontaneousDm();
      processFranchisePassiveIncome();
    }

    if (!isShopClosedNow() || currentNavTab === 'phone') {
      maybeReceiveJobCandidateDm();
    }

    processFloristTasks();
    processActiveDeliveries();
  }, 20000);
}

function ensureEmployeeDmThread(emp) {
  let dm = (gameState.directMessages || []).find((m) => m.kind === 'employee' && m.employeeId === emp.id);
  if (!dm) {
    dm = {
      id: 'dm_emp_' + emp.id,
      senderName: `${emp.name} (${emp.roleName})`,
      kind: 'employee',
      employeeId: emp.id,
      text: 'Привет! На связи.',
      read: true,
      blockedByPlayer: false,
      blockedByClient: false,
      day: gameState.day,
      createdTimeLabel: formatMinutesAsTime(gameState.timeMinutes || 540),
      thread: []
    };
    gameState.directMessages.unshift(dm);
  }
  return dm;
}

function refreshActiveTabIfSafe() {
  const isTyping = document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');
  if (isTyping) return;
  const activeScreen = document.getElementById(`screen-${currentNavTab}`);
  const prevScroll = activeScreen ? activeScreen.scrollTop : 0;

  if (currentNavTab === 'phone') {
    renderPhoneScreen(updateHud, showToast);
  } else if (currentNavTab === 'shop' && !isBouquetMakerOpen() && !isClientTalkingNow()) {
    renderShopScreen(updateHud, showToast);
  }

  if (activeScreen) activeScreen.scrollTop = prevScroll;
}

/** Пассивная выручка работающих филиалов сети по ходу дня */
function processFranchisePassiveIncome() {
  const franchises = gameState.franchises || [];
  if (!franchises.length) return;
  const now = Date.now();
  if (now < nextFranchiseTickRealMs) return;

  nextFranchiseTickRealMs = now + 95000;
  let totalTickGain = 0;

  franchises.forEach((b) => {
    const hasStaff = (gameState.employees || []).some((e) => e.branchId === b.id);
    if (!hasStaff || (b.todayTicks || 0) >= 4) return;

    const meta = FRANCHISE_CATALOG.find((m) => m.id === b.id);
    if (!meta) return;

    const dailyTarget = meta.minDailyRevenue + Math.random() * (meta.maxDailyRevenue - meta.minDailyRevenue);
    const chunk = Math.round(dailyTarget / 4);
    b.todayTicks = (b.todayTicks || 0) + 1;
    b.todayEarned = (b.todayEarned || 0) + chunk;
    b.totalEarned = (b.totalEarned || 0) + chunk;
    totalTickGain += chunk;
  });

  if (totalTickGain > 0) {
    gameState.money += totalTickGain;
    gameState.totalEarned += totalTickGain;
    saveState();
    updateHud();
    showToast(`🏢 Филиалы сети принесли +${totalTickGain} ₽ выручки!`);
  }
}

/** Выполнение поручений флориста на закупку цветов */
async function processFloristTasks() {
  if (isTeamTickPending) return;
  const now = Date.now();
  const dueTask = (gameState.floristTasks || []).find((t) => t.status === 'in_progress' && now >= (t.readyRealMs || 0));
  if (!dueTask) return;

  isTeamTickPending = true;
  try {
    dueTask.status = 'done';
    const existing = gameState.inventory.find((v) => v.typeId === dueTask.typeId && !v.discounted && v.freshness >= 85);
    if (existing) {
      existing.qty += dueTask.qty;
      existing.freshness = Math.round((existing.freshness + 100) / 2);
    } else {
      gameState.inventory.push({
        uid: 'vase_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
        typeId: dueTask.typeId,
        qty: dueTask.qty,
        freshness: 100,
        discounted: false,
        wateredThisShift: false
      });
    }

    const emp = (gameState.employees || []).find((e) => e.id === dueTask.employeeId);
    if (emp) {
      let reportText = `Привёз(ла) ${dueTask.qty} шт. «${dueTask.flowerName}» (${dueTask.cost} ₽), уже в вазах! 🌸`;
      try {
        const raw = await callAI([{
          role: 'user',
          content: `Ты — флорист-помощник ${emp.name} (${emp.gender === 'female' ? 'женщина' : 'мужчина'}), только что привёз с оптовой базы ${dueTask.qty} шт. «${dueTask.flowerName}» за ${dueTask.cost} ₽ по поручению руководителя. Напиши живой короткий отчёт (1–2 предложения) в Direct. Без JSON!`
        }]);
        const clean = stripCodeFences(raw).trim();
        if (clean && !clean.startsWith('{')) reportText = clean;
      } catch (e) {
        console.warn('Не удалось получить ИИ-отчёт по закупке:', e);
      }
      const dm = ensureEmployeeDmThread(emp);
      dm.thread.push({ sender: 'client', text: reportText });
      dm.text = reportText;
      dm.read = false;
    }

    saveState();
    updateHud();
    playBellSound();
    showToast(`🛒 ${dueTask.employeeName} привёз(ла) ${dueTask.qty} шт. «${dueTask.flowerName}»!`, 4500);
    refreshActiveTabIfSafe();
  } finally {
    isTeamTickPending = false;
  }
}

/** Время в пути курьера, ИИ-форс-мажоры с ожиданием ответа, отчёты о доставке и отзыв клиента */
async function processActiveDeliveries() {
  if (isTeamTickPending) return;
  const now = Date.now();
  const active = (gameState.deliveries || []).find(
    (d) => d.status === 'in_transit' && now >= (d.nextTickRealMs || 0)
  );
  if (!active) return;

  const courier = (gameState.employees || []).find((e) => e.id === active.courierId);
  if (!courier) return;

  isTeamTickPending = true;
  try {
    const nextRem = Math.max(0, (active.remainingMin || 12) - 12);

    if (!active.issueTriggered && nextRem > 0 && Math.random() < 0.55) {
      const fm = await generateCourierForceMajeure(courier, active);
      active.remainingMin = nextRem;
      active.nextTickRealMs = now + 20000;
      active.issueTriggered = true;
      active.status = 'issue_waiting';
      active.issueTitle = fm.issueTitle;

      const dm = ensureEmployeeDmThread(courier);
      dm.thread.push({ sender: 'client', text: fm.message });
      dm.text = fm.message;
      dm.read = false;

      saveState();
      updateHud();
      playBellSound();
      showToast(`⚠️ Форс-мажор у курьера ${courier.name}! Ответь в Direct!`, 5000);
      refreshActiveTabIfSafe();
      return;
    }

    if (nextRem <= 0) {
      const report = await generateCourierDeliveryReport(courier, active);
      active.remainingMin = 0;
      active.status = 'delivered';

      const orderDm = (gameState.directMessages || []).find((m) => m.id === active.dmId);
      if (orderDm && orderDm.order) {
        orderDm.order.done = true;
      }

      const totalGain = Number(active.reward || 0) + Number(report.tip || 0);
      gameState.money += totalGain;
      gameState.totalEarned += totalGain;
      gameState.bouquetsSold += 1;
      gameState.mood = Math.min(100, gameState.mood + 4);

      const dm = ensureEmployeeDmThread(courier);
      dm.thread.push({ sender: 'client', text: report.message });
      dm.thread.push({
        sender: 'system',
        text: `✅ Доставка завершена! В кассу зачислено +${totalGain} ₽${report.tip > 0 ? ` (из них ${report.tip} ₽ чаевых)` : ''}.`
      });
      dm.text = report.message;
      dm.read = false;

      saveState();
      updateHud();
      playCoinSound();
      showToast(`🚚 ${courier.name} доставил(а) заказ (${active.address})! +${totalGain} ₽`, 5200);
      refreshActiveTabIfSafe();

      // С вероятностью 65% клиент сам напишет отзыв после получения букета
      if (orderDm && Math.random() < 0.65) {
        setTimeout(async () => {
          try {
            const fb = await generatePostDeliveryClientFeedback(orderDm, active);
            if (fb && fb.reply) {
              if (!Array.isArray(orderDm.thread)) orderDm.thread = [];
              orderDm.thread.push({ sender: 'client', text: fb.reply });
              orderDm.text = fb.reply;
              orderDm.read = false;
              gameState.mood = Math.max(10, Math.min(100, gameState.mood + fb.moodDelta));
              gameState.followers = Math.max(0, gameState.followers + fb.followerDelta);
              saveState();
              updateHud();
              playBellSound();
              showToast(`💬 ${orderDm.senderName} оставил(а) отзыв после доставки!`, 4500);
              refreshActiveTabIfSafe();
            }
          } catch (err) {
            console.warn('Не удалось получить отзыв клиента после доставки:', err);
          }
        }, 4500);
      }
      return;
    }

    active.remainingMin = nextRem;
    active.nextTickRealMs = now + 20000;
    saveState();
    refreshActiveTabIfSafe();
  } catch (err) {
    console.warn('Ошибка тика доставки, повтор через 15 сек:', err);
    active.nextTickRealMs = Date.now() + 15000;
    saveState();
  } finally {
    isTeamTickPending = false;
  }
}

/** Сотрудники периодически пишут в Direct (только если не заняты доставкой/закупкой!) */
async function maybeReceiveEmployeeSpontaneousDm() {
  if (isEmployeeDmPending || isTeamTickPending) return;
  const now = Date.now();
  if (now < nextEmployeeDmRealMs) return;

  const busyDeliveryIds = new Set(
    (gameState.deliveries || [])
      .filter((d) => d.status === 'in_transit' || d.status === 'issue_waiting')
      .map((d) => d.courierId)
  );
  const busyTaskIds = new Set(
    (gameState.floristTasks || [])
      .filter((t) => t.status === 'in_progress')
      .map((t) => t.employeeId)
  );

  const freeEmployees = (gameState.employees || []).filter(
    (e) => !busyDeliveryIds.has(e.id) && !busyTaskIds.has(e.id)
  );
  if (!freeEmployees.length) return;

  const unreadCount = (gameState.directMessages || []).filter((m) => !m.read).length;
  if (unreadCount >= 10) {
    nextEmployeeDmRealMs = now + 40000;
    return;
  }

  nextEmployeeDmRealMs = now + 150000 + Math.floor(Math.random() * 90000);
  const emp = freeEmployees[Math.floor(Math.random() * freeEmployees.length)];
  const existingEmpDm = (gameState.directMessages || []).find((m) => m.kind === 'employee' && m.employeeId === emp.id);

  isEmployeeDmPending = true;
  try {
    const text = await generateEmployeeSpontaneousDm(emp, existingEmpDm?.thread || []);
    const dm = ensureEmployeeDmThread(emp);
    dm.thread.push({ sender: 'client', text });
    dm.text = text;
    dm.createdTimeLabel = formatMinutesAsTime(gameState.timeMinutes || 540);
    dm.read = false;
    saveState();
    updateHud();
    playBellSound();
    showToast(`💬 ${emp.name} написал(а) тебе в Direct!`, 4000);
    refreshActiveTabIfSafe();
  } catch (err) {
    console.warn('Не удалось получить авто-сообщение сотрудника:', err);
    nextEmployeeDmRealMs = Date.now() + 30000;
  } finally {
    isEmployeeDmPending = false;
  }
}

/** Автоматический отклик кандидатов на открытые вакансии в случайный момент */
async function maybeReceiveJobCandidateDm() {
  if (isJobDmPending) return;
  const openJobs = (gameState.jobPostings || []).filter((j) => j.status === 'open');
  if (!openJobs.length) return;

  const now = Date.now();
  let stateUpdated = false;

  openJobs.forEach((j) => {
    if (typeof j.nextResponseRealMs !== 'number') {
      j.nextResponseRealMs = now + 20000 + Math.floor(Math.random() * 25000);
      stateUpdated = true;
    }
  });
  if (stateUpdated) saveState();

  const dueJob = openJobs.find((j) => {
    const activeForJob = (gameState.directMessages || []).filter(
      (m) =>
        m.jobApplication &&
        m.jobApplication.jobId === j.id &&
        m.jobApplication.status === 'interviewing' &&
        !m.blockedByClient
    ).length;
    return activeForJob < 1 && now >= j.nextResponseRealMs;
  });
  if (!dueJob) return;

  isJobDmPending = true;
  try {
    const dm = await generateJobCandidateDm(dueJob);
    dueJob.respondedCount = (dueJob.respondedCount || 0) + 1;
    dueJob.nextResponseRealMs = Date.now() + 30000 + Math.floor(Math.random() * 40000);

    if (dm) {
      dm.read = false;
      gameState.directMessages.unshift(dm);
      saveState();
      updateHud();
      playBellSound();
      showToast(`💼 Отклик на вакансию в Direct от ${dm.jobApplication?.candidateName || dm.senderName}!`, 4500);
      refreshActiveTabIfSafe();
    } else {
      saveState();
    }
  } catch (err) {
    console.warn('Не удалось получить отклик кандидата:', err);
  } finally {
    isJobDmPending = false;
  }
}

/** Автоматический приход сообщений и предзаказов в Direct по ходу дня */
async function maybeReceiveAutoDirectMessage() {
  if (isClientDmPending) return;

  const now = Date.now();
  if (now < nextAutoDmRealMs) return;

  const unreadCount = gameState.directMessages.filter((m) => !m.read).length;
  if (unreadCount >= 10) {
    nextAutoDmRealMs = now + 25000;
    return;
  }

  nextAutoDmRealMs = now + 75000 + Math.floor(Math.random() * 55000);
  isClientDmPending = true;

  try {
    const dm = await generateDirectMessage();
    if (dm) {
      dm.read = false;
      gameState.directMessages.unshift(dm);
      if (gameState.directMessages.length > 16) {
        const keepImportant = gameState.directMessages.filter(
          (m) =>
            !m.read ||
            m.kind === 'employee' ||
            (m.order && m.order.accepted && !m.order.done) ||
            (m.jobApplication && m.jobApplication.status === 'interviewing')
        );
        const others = gameState.directMessages.filter(
          (m) =>
            m.read &&
            m.kind !== 'employee' &&
            !(m.order && m.order.accepted && !m.order.done) &&
            !(m.jobApplication && m.jobApplication.status === 'interviewing')
        );
        gameState.directMessages = [...keepImportant, ...others].slice(0, Math.max(16, keepImportant.length));
      }
      saveState();
      updateHud();
      playBellSound();

      const msgType = dm.order?.isDelivery
        ? 'запрос на доставку'
        : dm.order
        ? 'предзаказ'
        : 'сообщение';
      showToast(`💬 Новое ${msgType} в Direct от ${dm.senderName}!`, 4000);
      refreshActiveTabIfSafe();
    }
  } catch (err) {
    console.warn('Не удалось получить авто-сообщение Direct:', err);
    nextAutoDmRealMs = Date.now() + 20000;
  } finally {
    isClientDmPending = false;
  }
}

function renderAll() {
  updateHud();
  switchTab(currentNavTab);
}

function updateHud() {
  const moneyEl = document.getElementById('hud-money');
  const dayTimeEl = document.getElementById('hud-date');
  const weatherEl = document.getElementById('hud-weather');
  const followersEl = document.getElementById('hud-followers');
  const moodEl = document.getElementById('hud-mood');
  const phoneBadge = document.getElementById('phone-nav-badge');

  if (moneyEl) moneyEl.textContent = `💰 ${gameState.money} ₽`;

  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const season = getSeasonInfo(curDate);
  const clockStr = formatMinutesAsTime(gameState.timeMinutes ?? 540);
  const closedMark = isShopClosedNow() ? ' • Закрыто' : '';
  if (dayTimeEl) {
    dayTimeEl.textContent = `День ${gameState.day} (${formatShortDate(curDate)}) • ${clockStr}${closedMark}`;
  }

  const weatherMeta = WEATHERS.find((w) => w.id === gameState.weather) || WEATHERS[0];
  if (weatherEl) {
    weatherEl.textContent = `${season.icon} ${weatherMeta.icon} ${weatherMeta.label}`;
  }

  if (followersEl) followersEl.textContent = `🌸 ${gameState.followers} подп.`;
  if (moodEl) moodEl.textContent = `✨ Атмосфера: ${gameState.mood}%`;

  const unreadDms = gameState.directMessages.filter((m) => !m.read).length;
  if (phoneBadge) {
    if (unreadDms > 0) {
      phoneBadge.textContent = unreadDms;
      phoneBadge.style.display = 'flex';
    } else {
      phoneBadge.style.display = 'none';
    }
  }
}

function formatShortDate(d) {
  const m = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  return `${d.getDate()} ${m[d.getMonth()]}`;
}

function showToast(msg, duration = 3400) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  container.innerHTML = '';
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);

  if (activeToastTimer) clearTimeout(activeToastTimer);
  activeToastTimer = setTimeout(() => {
    toast.remove();
  }, duration);
}