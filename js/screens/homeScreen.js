import {
  FLOWERS_CATALOG,
  getGameDateObj,
  getSeasonInfo,
  getWeatherForSeason,
  getHolidayForDate
} from '../config.js';
import { gameState, saveState } from '../state.js';
import { playPurrSound } from '../sound.js';

export function renderHomeScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-home');
  if (!container) return;

  const isDay = gameState.timeIndex < 2;
  const hasLamp = gameState.decor.includes('cozy_lamp');
  const hasBooks = gameState.decor.includes('bookshelf');
  const hasBed = gameState.decor.includes('cat_bed');
  const petName = gameState.petName || 'Пискля';
  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const season = getSeasonInfo(curDate);

  container.innerHTML = `
    <div class="screen-header">
      <h1 class="screen-title">Уютная квартира</h1>
      <span class="badge badge-ok">⚡ Силы: ${gameState.energy}%</span>
    </div>

    ${gameState.rentWarning ? `
      <div class="card" style="background:#FCE8E8; border-color:#E5A1A1; padding:10px;">
        <strong style="color:var(--danger); font-size:13px;">⚠️ Письмо от арендодателя</strong>
        <p class="muted-text" style="color:#6E3838;">Баланс ушёл в минус после оплаты аренды! Постарайся заработать и выйти в плюс.</p>
      </div>
    ` : ''}

    <!-- Сцена комнаты с визуальным декором -->
    <div class="home-room-scene">
      <div class="home-top-wall">
        <div class="home-window ${isDay ? 'day' : ''}">
          <div class="window-horizon season-${season.id}" style="height:20px;"></div>
          <div class="window-pane-v"></div>
          <div class="window-pane-h"></div>
        </div>

        ${hasBooks ? getBookshelfSvg() : ''}
        ${hasLamp ? getFloorLampSvg() : ''}
      </div>

      ${(!hasBooks && !hasLamp && !hasBed) ? `
        <p class="muted-text" style="font-size:11px; text-align:center;">
          Комната пока скромная — купи торшер, полку книг или лежанку в 📱 Телефон → Декор!
        </p>
      ` : ''}

      <div class="home-floor-row">
        <div class="pet-spot">
          <button class="pet-svg-btn" id="btn-pet-cat" title="Погладить ${escapeHtml(petName)}">
            ${getPisklyaCatSvg(gameState.petMood, hasBed)}
          </button>
          <div style="flex:1; min-width:0;">
            <div class="row-between">
              <strong style="font-size:14px;">Кошка ${escapeHtml(petName)}</strong>
              <span class="badge badge-ok">${gameState.petMood}%</span>
            </div>
            <p class="muted-text" style="font-size:11.5px; margin-top:2px;">
              Погладь кошку, чтобы она замурчала, или угости вкусняшкой!
            </p>
            <button class="btn btn-soft" id="btn-feed-cat" style="margin-top:6px; padding:5px 10px; font-size:11.5px;" ${gameState.petFedToday ? 'disabled style="opacity:0.55;"' : ''}>
              ${gameState.petFedToday ? '🐟 Покормлена сегодня' : '🐟 Покормить (бесплатно)'}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🌙 Завершить рабочий день</div>
      <p class="muted-text">
        Сон полностью восстановит силы и переведёт время на следующее утро. До оплаты аренды (${gameState.weeklyRent} ₽): <strong>${gameState.daysUntilRent} дн.</strong>
      </p>
      <p class="muted-text" style="font-size:11.5px;">
        💡 Имя питомца и фоновая музыка/дождь настраиваются в разделе «⚙️ Касса и ИИ» → «Настройки и ИИ».
      </p>
      <button class="btn btn-primary" id="btn-sleep-next-day">
        🛏️ Лечь спать (Новый день)
      </button>
    </div>
  `;

  document.getElementById('btn-pet-cat')?.addEventListener('click', () => {
    playPurrSound();
    gameState.petMood = Math.min(100, gameState.petMood + 8);
    gameState.mood = Math.min(100, gameState.mood + 2);
    saveState();
    onHudUpdate();
    renderHomeScreen(onHudUpdate, showToast);
    showToast(`🐱 Мррр! ${petName} мурлычет от удовольствия (+2% атмосферы)`);
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
}

function sleepToNextDay(onHudUpdate, showToast) {
  gameState.day += 1;
  gameState.timeIndex = 0;
  gameState.timeMinutes = (gameState.openHour || 9) * 60;
  gameState.energy = 100;
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
  showToast(`☀️ Доброе утро, День ${gameState.day}!${extraMsg}`);
}

/** Пушистая чёрно-рыжая кошка Пискля по фото (добрые янтарные глаза и рыжее пятнышко на лбу) */
function getPisklyaCatSvg(mood, hasBed) {
  const bedSvg = hasBed
    ? `<ellipse cx="50" cy="88" rx="44" ry="10" fill="#E8A598"/>
       <ellipse cx="50" cy="86" rx="36" ry="7" fill="#FCEAE6"/>
       <circle cx="14" cy="85" r="5" fill="#DFAB4E"/>`
    : '';

  const browHappy = mood >= 60
    ? '<path d="M34 38 Q39 35 44 38" stroke="#D99B5E" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M56 38 Q61 35 66 38" stroke="#D99B5E" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
    : '';

  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      ${bedSvg}
      <!-- Пушистый хвост трубой -->
      <path d="M70 76 Q89 65 84 40 Q81 32 76 38 Q78 58 67 71 Z" fill="#322A28"/>
      <path d="M81 45 Q84 54 78 63" stroke="#C88248" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Пушистое тело и рыжеватая спинка/бочок -->
      <ellipse cx="50" cy="70" rx="23" ry="17" fill="#2A2321"/>
      <ellipse cx="60" cy="68" rx="9" ry="11" fill="#8C5937" opacity="0.55"/>

      <!-- Светло-рыжая пушистая грудка (манишка) -->
      <path d="M39 58 Q50 56 61 58 Q63 72 50 78 Q37 72 39 58 Z" fill="#D99B5E"/>
      <path d="M43 60 Q50 59 57 60 Q57 70 50 74 Q43 70 43 60 Z" fill="#E9BA86"/>

      <!-- Передние лапки с рыжими подпалинами -->
      <ellipse cx="42" cy="83" rx="5.5" ry="4" fill="#2A2321"/>
      <ellipse cx="58" cy="83" rx="5.5" ry="4" fill="#2A2321"/>
      <ellipse cx="42" cy="84" rx="3.2" ry="2.2" fill="#D99B5E"/>
      <ellipse cx="58" cy="84" rx="3.2" ry="2.2" fill="#D99B5E"/>

      <!-- Пушистые ушки -->
      <polygon points="27,36 30,13 45,26" fill="#2A2321"/>
      <polygon points="73,36 70,13 55,26" fill="#2A2321"/>
      <polygon points="31,31 32,18 41,26" fill="#B57A5C"/>
      <polygon points="69,31 68,18 59,26" fill="#B57A5C"/>

      <!-- Пушистая голова с мягкими пучками меха -->
      <ellipse cx="50" cy="43" rx="23" ry="19" fill="#2A2321"/>
      <polygon points="25,44 29,39 30,50" fill="#2A2321"/>
      <polygon points="75,44 71,39 70,50" fill="#2A2321"/>

      <!-- Характерное рыжее пятнышко на лбу -->
      <path d="M46 25 Q52 24 53 31 Q50 38 46 35 Q44 30 46 25 Z" fill="#E29A55"/>
      <circle cx="57" cy="49" r="3" fill="#B87642" opacity="0.6"/>

      <!-- Добрые золотисто-янтарные глазки -->
      <ellipse cx="40" cy="43" rx="4.4" ry="3.8" fill="#F2B84B"/>
      <ellipse cx="60" cy="43" rx="4.4" ry="3.8" fill="#F2B84B"/>
      <ellipse cx="40" cy="43" rx="2.1" ry="2.9" fill="#231D1B"/>
      <ellipse cx="60" cy="43" rx="2.1" ry="2.9" fill="#231D1B"/>
      <circle cx="38.8" cy="41.6" r="1.2" fill="#FFFFFF"/>
      <circle cx="58.8" cy="41.6" r="1.2" fill="#FFFFFF"/>
      ${browHappy}

      <!-- Носик и милый ротик -->
      <polygon points="48,49 52,49 50,51.5" fill="#E89A94"/>
      <path d="M46 53 Q50 56 54 53" stroke="#D99B5E" stroke-width="1.4" fill="none" stroke-linecap="round"/>

      <!-- Усики -->
      <line x1="23" y1="47" x2="35" y2="49" stroke="#C7B6AA" stroke-width="1.1"/>
      <line x1="23" y1="51" x2="35" y2="51" stroke="#C7B6AA" stroke-width="1.1"/>
      <line x1="77" y1="47" x2="65" y2="49" stroke="#C7B6AA" stroke-width="1.1"/>
      <line x1="77" y1="51" x2="65" y2="51" stroke="#C7B6AA" stroke-width="1.1"/>
    </svg>
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