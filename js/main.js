import { WEATHERS, getGameDateObj, getSeasonInfo, getWeatherForSeason } from './config.js';
import { gameState, saveState, addGameMinutes, isShopClosedNow, getTotalGameMinutes } from './state.js';
import { generateDirectMessage, generateJobCandidateDm } from './ai.js';
import {
  renderShopScreen,
  isBouquetMakerOpen,
  isClientTalkingNow,
  checkPreorderArrival
} from './screens/shopScreen.js';
import { renderPhoneScreen } from './screens/phoneScreen.js';
import { renderHomeScreen } from './screens/homeScreen.js';
import { renderFinanceSettingsScreen } from './screens/financeSettingsScreen.js';
import { playClickSound, playBellSound, setAmbientMode } from './sound.js';

const AUTH_UNLOCK_KEY = 'fleur_atelier_unlocked_v1';
const SECRET_PASSWORD = 'ШамильАлияНавсегда';

let ambientStarted = false;
let activeToastTimer = null;
let currentNavTab = 'shop';
let clockTimerId = null;
let isAutoDmPending = false;
let nextAutoDmRealMs = Date.now() + 75000;
const screenScrollMemory = { shop: 0, phone: 0, home: 0, finance: 0 };

function checkPasswordAndStart() {
  let isUnlocked = false;
  try {
    isUnlocked = localStorage.getItem(AUTH_UNLOCK_KEY) === '1';
  } catch (e) {
    isUnlocked = false;
  }

  if (isUnlocked) {
    initApp();
  } else {
    showPasswordLockScreen();
  }
}

function showPasswordLockScreen() {
  const overlay = document.createElement('div');
  overlay.className = 'setup-modal-overlay';
  overlay.id = 'password-lock-overlay';
  overlay.style.background = 'rgba(239, 231, 220, 0.96)';

  overlay.innerHTML = `
    <div class="setup-modal-card" style="text-align: center;">
      <div style="font-size: 38px;">🔐🌷</div>
      <h2 style="font-family: var(--font-title); font-size: 22px;">Закрытый вход</h2>
      <p class="muted-text" style="font-size: 12.5px;">
        Эта уютная цветочная лавка создана только для своих. Введи секретный пароль один раз — дальше браузер запомнит тебя!
      </p>

      <div class="form-group" style="text-align: left; margin-top: 4px;">
        <label class="form-label" for="lock-password-input">Секретный пароль</label>
        <div style="display: flex; gap: 6px; align-items: center;">
          <input
            type="text"
            class="form-input masked-input"
            id="lock-password-input"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            data-form-type="other"
            data-lpignore="true"
            placeholder="Введи пароль..."
            style="flex: 1;"
          />
          <button type="button" class="btn btn-soft" id="btn-toggle-lock-eye" style="padding: 10px 12px;">
            👁️
          </button>
        </div>
      </div>

      <p id="lock-error-msg" style="display: none; color: var(--danger); font-size: 12px; font-weight: 700;"></p>

      <button class="btn btn-primary" id="btn-unlock-game" style="margin-top: 4px;">
        🔓 Открыть игру
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  const input = document.getElementById('lock-password-input');
  const eyeBtn = document.getElementById('btn-toggle-lock-eye');
  const unlockBtn = document.getElementById('btn-unlock-game');
  const errorMsg = document.getElementById('lock-error-msg');

  eyeBtn.addEventListener('click', () => {
    const isHidden = input.classList.toggle('masked-input');
    eyeBtn.textContent = isHidden ? '👁️' : '🙈';
  });

  const tryUnlock = () => {
    const val = input.value.trim();
    if (val === SECRET_PASSWORD) {
      try {
        localStorage.setItem(AUTH_UNLOCK_KEY, '1');
      } catch (e) {}
      overlay.remove();
      initApp();
      showToast('💖 Добро пожаловать в Fleur Atelier!');
    } else {
      errorMsg.style.display = 'block';
      errorMsg.textContent = 'Неверный пароль 💔 Проверь раскладку и заглавные буквы.';
    }
  };

  unlockBtn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock();
  });
}

function initApp() {
  registerServiceWorker();
  setupNavigation();
  setupGlobalClickSounds();
  renderAll();
  startGameClock();
  if (gameState.isSetupDone && !isShopClosedNow()) {
    checkPreorderArrival(updateHud, showToast);
  }
  if (!gameState.isSetupDone) {
    showWelcomeSetupModal();
  }
}

function startGameClock() {
  if (clockTimerId) clearInterval(clockTimerId);
  clockTimerId = setInterval(() => {
    if (document.querySelector('.setup-modal-overlay, .vase-modal-overlay, .polaroid-overlay')) return;
    if (currentNavTab === 'finance') return;

    const onBouquetTable = currentNavTab === 'shop' && isBouquetMakerOpen();
    if (!onBouquetTable) {
      const justClosed = addGameMinutes(4);
      updateHud();

      if (justClosed) {
        showToast('🌙 Смена закончилась! Пора пойти домой поспать — иначе завтра будешь уставшим.');
        if (currentNavTab === 'shop' && !isClientTalkingNow()) {
          renderShopScreen(updateHud, showToast);
        }
      }
    }

   if (!isShopClosedNow()) {
      if (!onBouquetTable) {
        checkPreorderArrival(updateHud, showToast);
      }
      maybeReceiveJobCandidateDm();
      maybeReceiveAutoDirectMessage();
    }
  }, 15000);
}

/** Автоматический отклик кандидатов на опубликованные вакансии через несколько игровых часов */
async function maybeReceiveJobCandidateDm() {
  if (isAutoDmPending) return;
  const openJobs = (gameState.jobPostings || []).filter((j) => j.status === 'open');
  if (!openJobs.length) return;

  const totalMin = getTotalGameMinutes();
  const dueJob = openJobs.find((j) => totalMin >= (j.nextResponseTotalMin || 0) && (j.respondedCount || 0) < 3);
  if (!dueJob) return;

  isAutoDmPending = true;
  try {
    const dm = await generateJobCandidateDm(dueJob);
    dueJob.respondedCount = (dueJob.respondedCount || 0) + 1;
    dueJob.nextResponseTotalMin = totalMin + 130 + Math.floor(Math.random() * 110);

    if (dm) {
      dm.read = false;
      gameState.directMessages.unshift(dm);
      saveState();
      updateHud();
      playBellSound();
      showToast(`💼 Отклик на вакансию в Direct от ${dm.jobApplication?.candidateName || dm.senderName}!`);

      const isTypingInPhone =
        currentNavTab === 'phone' &&
        document.activeElement &&
        document.activeElement.tagName === 'INPUT';
      if (currentNavTab === 'phone' && !isTypingInPhone) {
        renderPhoneScreen(updateHud, showToast);
      }
    } else {
      saveState();
    }
  } catch (err) {
    console.warn('Не удалось получить отклик кандидата:', err);
  } finally {
    isAutoDmPending = false;
  }
}

/** Автоматический приход сообщений и предзаказов в Direct по ходу дня */
async function maybeReceiveAutoDirectMessage() {
  if (isAutoDmPending) return;
  const now = Date.now();
  if (now < nextAutoDmRealMs) return;

  const unreadCount = (gameState.directMessages || []).filter((m) => !m.read).length;
  if (unreadCount >= 2) {
    nextAutoDmRealMs = now + 55000;
    return;
  }

  const followers = gameState.followers || 0;
  const hasPromoToday = gameState.activePromo && gameState.activePromo.day === gameState.day;
  const speedReduction = Math.min(40000, followers * 250);
  const promoMult = hasPromoToday ? 0.85 : 1;

  const minWait = Math.round((130000 - speedReduction) * promoMult);
  const maxWait = Math.round((190000 - speedReduction) * promoMult);
  nextAutoDmRealMs = now + minWait + Math.floor(Math.random() * Math.max(15000, maxWait - minWait));

  isAutoDmPending = true;
  try {
    const dm = await generateDirectMessage();
    dm.read = false;
    gameState.directMessages.unshift(dm);
    if (gameState.directMessages.length > 14) {
      const important = gameState.directMessages.filter(
        (m) => !m.read || (m.order && m.order.accepted && !m.order.done)
      );
      const rest = gameState.directMessages.filter(
        (m) => m.read && !(m.order && m.order.accepted && !m.order.done)
      );
      gameState.directMessages = [...important, ...rest].slice(0, Math.max(14, important.length));
    }
    saveState();
    updateHud();
    playBellSound();
    showToast(`📩 Новое сообщение в Direct от ${dm.senderName}!`);

    const isTypingInPhone =
      currentNavTab === 'phone' &&
      document.activeElement &&
      document.activeElement.tagName === 'INPUT';
    if (currentNavTab === 'phone' && !isTypingInPhone) {
      renderPhoneScreen(updateHud, showToast);
    }
  } catch (err) {
    console.warn('Не удалось получить авто-сообщение Direct:', err);
  } finally {
    isAutoDmPending = false;
  }
}

function renderAll() {
  updateHud();
  renderShopScreen(updateHud, showToast);
  renderPhoneScreen(updateHud, showToast);
  renderHomeScreen(updateHud, showToast);
  renderFinanceSettingsScreen(updateHud, showToast);
}

function setupGlobalClickSounds() {
  document.addEventListener('click', (e) => {
    if (!ambientStarted && gameState.soundEnabled && gameState.ambientMode !== 'none') {
      ambientStarted = true;
      setAmbientMode(gameState.ambientMode);
    }
    const interactive = e.target.closest('button, .vase-slot, .photo-pick-item');
    if (interactive && !interactive.disabled) {
      playClickSound();
    }
  });
}

function setupNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const screens = document.querySelectorAll('.screen');

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const targetScreen = document.getElementById(`screen-${target}`);

      if (currentNavTab === target) {
        screenScrollMemory[target] = 0;
        if (targetScreen) {
          targetScreen.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      const prevScreen = document.getElementById(`screen-${currentNavTab}`);
      if (prevScreen) {
        screenScrollMemory[currentNavTab] = prevScreen.scrollTop;
      }

      currentNavTab = target;

      navButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      screens.forEach((screen) => {
        screen.classList.toggle('active', screen.id === `screen-${target}`);
      });

      if (target === 'shop') {
        renderShopScreen(updateHud, showToast);
        checkPreorderArrival(updateHud, showToast);
      } else if (target === 'phone') {
        renderPhoneScreen(updateHud, showToast);
      } else if (target === 'home') {
        renderHomeScreen(updateHud, showToast);
      } else if (target === 'finance') {
        renderFinanceSettingsScreen(updateHud, showToast);
      }

      const savedScroll = screenScrollMemory[target] || 0;
      if (targetScreen) {
        requestAnimationFrame(() => {
          targetScreen.scrollTop = savedScroll;
        });
      }
    });
  });
}

/** Приветственное окно настройки новой лавки */
function showWelcomeSetupModal() {
  if (document.getElementById('welcome-setup-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'setup-modal-overlay';
  overlay.id = 'welcome-setup-overlay';

  overlay.innerHTML = `
    <div class="setup-modal-card">
      <div style="text-align:center;">
        <div style="font-size:34px;">🌷</div>
        <h2 style="font-family:var(--font-title); font-size:21px; margin-top:2px;">Открытие цветочной лавки</h2>
        <p class="muted-text" style="font-size:12px; margin-top:3px;">Придумай название компании, свой ник и выбери дату начала бизнеса!</p>
      </div>

      <div class="form-group">
        <label class="form-label" for="setup-shop-name">Название цветочного магазина</label>
        <input type="text" class="form-input" id="setup-shop-name" autocomplete="off" data-form-type="other" value="${escapeAttr(gameState.shopName || 'Fleur Atelier')}" maxlength="24" />
      </div>

      <div class="form-group">
        <label class="form-label" for="setup-insta-handle">Ник канала в InstaFlower</label>
        <input type="text" class="form-input" id="setup-insta-handle" autocomplete="off" data-form-type="other" value="${escapeAttr(gameState.instaHandle || '@fleur_atelier')}" maxlength="24" />
      </div>

      <div class="form-group">
        <label class="form-label" for="setup-start-date">Дата старта бизнеса</label>
        <input type="date" class="form-input" id="setup-start-date" value="${gameState.startDate || '2026-02-08'}" />
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <div class="form-group">
          <label class="form-label" for="setup-open-hour">Открытие</label>
          <select class="form-select" id="setup-open-hour">
            <option value="8">08:00</option>
            <option value="9" selected>09:00</option>
            <option value="10">10:00</option>
            <option value="11">11:00</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="setup-close-hour">Закрытие</label>
          <select class="form-select" id="setup-close-hour">
            <option value="19">19:00</option>
            <option value="20">20:00</option>
            <option value="21" selected>21:00</option>
            <option value="22">22:00</option>
          </select>
        </div>
      </div>

      <button class="btn btn-primary" id="btn-confirm-setup" style="margin-top:4px;">
        🌸 Открыть магазин!
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('btn-confirm-setup').addEventListener('click', () => {
    const shopName = document.getElementById('setup-shop-name').value.trim() || 'Fleur Atelier';
    let insta = document.getElementById('setup-insta-handle').value.trim() || '@fleur_atelier';
    if (!insta.startsWith('@')) insta = '@' + insta;

    const startDate = document.getElementById('setup-start-date').value || '2026-02-08';
    const openHour = Number(document.getElementById('setup-open-hour').value) || 9;
    const closeHour = Number(document.getElementById('setup-close-hour').value) || 21;

    gameState.shopName = shopName;
    gameState.instaHandle = insta;
    gameState.startDate = startDate;
    gameState.openHour = openHour;
    gameState.closeHour = closeHour;
    gameState.timeMinutes = openHour * 60;
    gameState.shownCloseHint = false;

    const season = getSeasonInfo(getGameDateObj(startDate, 0));
    gameState.weather = getWeatherForSeason(season.id);
    gameState.isSetupDone = true;

    saveState();
    overlay.remove();
    renderAll();
    showToast(`🌸 Лавка «${shopName}» открыта!`);
  });
}

export function updateHud() {
  const moneyEl = document.getElementById('hud-money');
  const dateEl = document.getElementById('hud-date');
  const weatherEl = document.getElementById('hud-weather');
  const followersEl = document.getElementById('hud-followers');
  const moodEl = document.getElementById('hud-mood');
  const phoneBadge = document.getElementById('phone-nav-badge');

  const weatherObj = WEATHERS.find((w) => w.id === gameState.weather) || WEATHERS[0];

  const d = getGameDateObj(gameState.startDate, gameState.day - 1);
  const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const wd = weekdays[d.getDay()];
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();

  const totalMin = gameState.timeMinutes ?? 540;
  const hh = String(Math.floor(totalMin / 60)).padStart(2, '0');
  const min = String(totalMin % 60).padStart(2, '0');

  moneyEl.textContent = `💰 ${gameState.money.toLocaleString('ru-RU')} ₽`;
  dateEl.textContent = `${wd}, ${dd}.${mm}.${yyyy} • ${hh}:${min}`;
  weatherEl.textContent = `${weatherObj.icon} ${weatherObj.label}`;
  followersEl.textContent = `🌸 ${gameState.followers} подп.`;
  moodEl.textContent = `✨ Атмосфера: ${gameState.mood}%`;

  if (phoneBadge) {
    const unreadCount = (gameState.directMessages || []).filter((m) => !m.read).length;
    if (unreadCount > 0) {
      phoneBadge.textContent = unreadCount > 9 ? '9+' : String(unreadCount);
      phoneBadge.style.display = 'flex';
    } else {
      phoneBadge.style.display = 'none';
    }
  }
}

export function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  let toast = container.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    container.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.animation = 'none';
  toast.offsetHeight;
  toast.style.animation = '';

  if (activeToastTimer) clearTimeout(activeToastTimer);
  activeToastTimer = setTimeout(() => {
    toast.remove();
    activeToastTimer = null;
  }, 2600);
}

function escapeAttr(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('Service Worker не зарегистрирован:', err);
    });
  }
}

document.addEventListener('DOMContentLoaded', checkPasswordAndStart);