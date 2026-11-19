import { AI_PROVIDERS, getGameDateObj, getHolidayForDate, getSeasonInfo } from '../config.js';
import { gameState, aiSettings, saveState, saveAiSettings, resetState, setCurrentGameDate } from '../state.js';
import { testAiConnection, resolvePlayerGender } from '../ai.js';
import { setAmbientMode, stopAmbient } from '../sound.js';

let currentSubTab = 'finance'; // 'finance' | 'settings'
const ADMIN_UNLOCK_KEY = 'fleur_atelier_admin_v1';

export function renderFinanceSettingsScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-finance');
  if (!container) return;

  container.innerHTML = `
    <div class="screen-header">
      <h1 class="screen-title">Касса и ИИ</h1>
    </div>

    <div class="segmented-tabs">
      <button class="seg-btn ${currentSubTab === 'finance' ? 'active' : ''}" data-subtab="finance">
        💰 Бухгалтерия
      </button>
      <button class="seg-btn ${currentSubTab === 'settings' ? 'active' : ''}" data-subtab="settings">
        ⚙️ Настройки и ИИ
      </button>
    </div>

    <div id="finance-subtab-body" style="display: flex; flex-direction: column; gap: 12px;"></div>
    <div id="finance-admin-footer" style="margin-top: 8px;"></div>
  `;

  container.querySelectorAll('[data-subtab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentSubTab = btn.dataset.subtab;
      renderFinanceSettingsScreen(onHudUpdate, showToast);
    });
  });

  const body = document.getElementById('finance-subtab-body');
  if (currentSubTab === 'finance') {
    renderFinanceTab(body, onHudUpdate, showToast);
  } else {
    renderSettingsTab(body, onHudUpdate, showToast);
  }
  renderAdminFooter(onHudUpdate, showToast);
}

function renderFinanceTab(body, onHudUpdate, showToast) {
  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const todayHoliday = getHolidayForDate(curDate);
  const holidayText = todayHoliday
    ? `🎉 Сегодня ${todayHoliday.name}! Спрос x3, цены поставщиков x2.`
    : 'Ближайшие крупные праздники: 14 Февраля, 8 Марта, 1 Сентября и др.';

  const balanceBadge =
    gameState.money >= 0
      ? '<span class="badge badge-ok">Плюс</span>'
      : '<span class="badge badge-warn">Долг арендодателю!</span>';

  const employees = Array.isArray(gameState.employees) ? gameState.employees : [];
  const totalPayroll = employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);
  const employeesHtml = employees.length
    ? employees
        .map(
          (emp) => `
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; background:var(--bg-soft); padding:8px 10px; border-radius:10px;">
            <div style="flex:1; min-width:0;">
              <strong style="font-size:12.5px;">${emp.roleIcon || '💼'} ${escapeHtml(emp.name)}, ${emp.age}</strong>
              <div class="muted-text" style="font-size:11px;">
                ${escapeHtml(emp.roleName)} • ${escapeHtml(emp.locationName)}
              </div>
              <div class="muted-text" style="font-size:10.5px;">
                🕒 ${escapeHtml(emp.scheduleLabel)}${emp.hasCar ? ' • 🚗 Своё авто' : ''} • <strong>${emp.salary} ₽/см.</strong>
              </div>
            </div>
            <button class="btn btn-danger" data-fire-emp="${emp.id}" style="padding:5px 8px; font-size:11px; flex-shrink:0;">
              Уволить
            </button>
          </div>
        `
        )
        .join('')
    : `<p class="muted-text" style="font-size:12px;">Команда пока не набрана. Подай объявление в «📱 Телефон» → «📸 Insta» кнопкой «📢 Подать объявление о работе»!</p>`;

  body.innerHTML = `
    <div class="card">
      <div class="row-between">
        <div class="card-title">🏦 Состояние счёта</div>
        ${balanceBadge}
      </div>
      <div class="row-between">
        <span class="muted-text">Текущий баланс:</span>
        <strong>${gameState.money.toLocaleString('ru-RU')} ₽</strong>
      </div>
      <div class="row-between">
        <span class="muted-text">Еженедельная аренда и свет:</span>
        <strong>${gameState.weeklyRent.toLocaleString('ru-RU')} ₽</strong>
      </div>
      <div class="row-between">
        <span class="muted-text">До оплаты аренды:</span>
        <strong>${gameState.daysUntilRent} дн.</strong>
      </div>
    </div>

    <div class="card">
      <div class="row-between">
        <div class="card-title">👥 Команда лавки (${employees.length})</div>
        ${employees.length ? `<span class="badge badge-ok">${totalPayroll.toLocaleString('ru-RU')} ₽/см.</span>` : ''}
      </div>
      <div style="display:flex; flex-direction:column; gap:7px;">
        ${employeesHtml}
      </div>
    </div>

    <div class="card">
      <div class="card-title">📊 Статистика лавки</div>
      <div class="row-between">
        <span class="muted-text">Продано букетов/цветов:</span>
        <strong>${gameState.bouquetsSold}</strong>
      </div>
      <div class="row-between">
        <span class="muted-text">Всего заработано:</span>
        <strong>${gameState.totalEarned.toLocaleString('ru-RU')} ₽</strong>
      </div>
      <div class="row-between">
        <span class="muted-text">Всего потрачено:</span>
        <strong>${gameState.totalSpent.toLocaleString('ru-RU')} ₽</strong>
      </div>
    </div>

    <div class="card">
      <div class="card-title">📅 Календарь сезонности</div>
      <p class="muted-text">${holidayText}</p>
    </div>
  `;

  body.querySelectorAll('[data-fire-emp]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const empId = btn.dataset.fireEmp;
      const emp = (gameState.employees || []).find((e) => e.id === empId);
      if (!emp) return;
      if (confirm(`Точно уволить сотрудника ${emp.name} (${emp.roleName})?`)) {
        gameState.employees = (gameState.employees || []).filter((e) => e.id !== empId);
        saveState();
        showToast(`${emp.name} уволен(а) из команды`);
        renderFinanceSettingsScreen(onHudUpdate, showToast);
      }
    });
  });
}

async function renderSettingsTab(body, onHudUpdate, showToast) {
  const selectedProvider = AI_PROVIDERS[aiSettings.provider] || AI_PROVIDERS.openrouter;
  const providerOptions = Object.values(AI_PROVIDERS)
    .map(
      (p) =>
        `<option value="${p.id}" ${p.id === aiSettings.provider ? 'selected' : ''}>${p.name}</option>`
    )
    .join('');

  const curDateObj = getGameDateObj(gameState.startDate, gameState.day - 1);
  const curDateStr = `${curDateObj.getFullYear()}-${String(curDateObj.getMonth() + 1).padStart(2, '0')}-${String(curDateObj.getDate()).padStart(2, '0')}`;
  const curSeason = getSeasonInfo(curDateObj);

  const badgeName = (gameState.playerBadgeName || '').trim();
  const resolvedBadgeGender = resolvePlayerGender(badgeName, gameState.playerGender);
  const badgeStatusHtml = !badgeName
    ? '<span class="badge badge-warn">Снят</span>'
    : `<span class="badge badge-ok">${resolvedBadgeGender === 'female' ? '👩 Жен. род' : '👨 Муж. род'}</span>`;

  body.innerHTML = `
    <div class="card">
      <div class="row-between">
        <div class="card-title">🏪 Лавка, график и дата</div>
        <span class="badge badge-ok">${curSeason.label}</span>
      </div>
      <div class="form-group">
        <label class="form-label" for="set-shop-name">Название магазина</label>
        <input type="text" class="form-input" id="set-shop-name" autocomplete="off" data-form-type="other" data-lpignore="true" value="${escapeAttr(gameState.shopName || 'Fleur Atelier')}" maxlength="24" />
      </div>
      <div class="form-group">
        <label class="form-label" for="set-insta-handle">Ник канала в InstaFlower</label>
        <input type="text" class="form-input" id="set-insta-handle" autocomplete="off" data-form-type="other" data-lpignore="true" value="${escapeAttr(gameState.instaHandle || '@fleur_atelier')}" maxlength="24" />
      </div>
      <div class="form-group">
        <label class="form-label" for="set-current-date">Дата и время года за окном</label>
        <input type="date" class="form-input" id="set-current-date" value="${curDateStr}" />
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <div class="form-group">
          <label class="form-label" for="set-open-hour">Открытие</label>
          <select class="form-select" id="set-open-hour">
            ${[7, 8, 9, 10, 11].map((h) => `<option value="${h}" ${(gameState.openHour || 9) === h ? 'selected' : ''}>${String(h).padStart(2, '0')}:00</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="set-close-hour">Закрытие</label>
          <select class="form-select" id="set-close-hour">
            ${[18, 19, 20, 21, 22, 23].map((h) => `<option value="${h}" ${(gameState.closeHour || 21) === h ? 'selected' : ''}>${String(h).padStart(2, '0')}:00</option>`).join('')}
          </select>
        </div>
      </div>
      <button class="btn btn-primary" id="btn-save-shop-profile">💾 Сохранить параметры лавки</button>
    </div>

    <div class="card">
      <div class="row-between">
        <div class="card-title">🏷️ Бейджик флориста</div>
        ${badgeStatusHtml}
      </div>
      <p class="muted-text" style="font-size:12px;">
        Если впишешь имя на бейджике, клиенты в зале и в Direct будут иногда обращаться к тебе по имени (как в жизни — не всегда, но приятно).
      </p>
      <div class="form-group">
        <label class="form-label" for="badge-name-input">Твоё имя на бейджике</label>
        <input
          type="text"
          class="form-input"
          id="badge-name-input"
          autocomplete="off"
          data-form-type="other"
          data-lpignore="true"
          placeholder="Например: Алия (оставь пустым, чтобы снять)"
          value="${escapeAttr(gameState.playerBadgeName || '')}"
          maxlength="20"
        />
      </div>
      <div class="form-group">
        <label class="form-label" for="badge-gender-select">Обращение к тебе (род)</label>
        <select class="form-select" id="badge-gender-select">
          <option value="auto" ${(gameState.playerGender || 'auto') === 'auto' ? 'selected' : ''}>✨ Определять автоматически по имени</option>
          <option value="female" ${gameState.playerGender === 'female' ? 'selected' : ''}>👩 Женский род (подсказала, молодец)</option>
          <option value="male" ${gameState.playerGender === 'male' ? 'selected' : ''}>👨 Мужской род (подсказал, молодец)</option>
        </select>
      </div>
      <button class="btn btn-primary" id="btn-save-badge">🏷️ Сохранить бейджик</button>
    </div>

    <div class="card">
      <div class="card-title">🔊 Звук и Фоновая музыка</div>
      <button class="btn ${gameState.soundEnabled ? 'btn-sage' : 'btn-soft'}" id="btn-toggle-sound">
        ${gameState.soundEnabled ? '🔊 Все звуки игры: Включены' : '🔇 Все звуки игры: Выключены'}
      </button>

      <div class="form-group">
        <label class="form-label" for="ambient-mode-select">Фоновая атмосфера</label>
        <select class="form-select" id="ambient-mode-select" ${!gameState.soundEnabled ? 'disabled' : ''}>
          <option value="none" ${gameState.ambientMode === 'none' ? 'selected' : ''}>🔇 Без фона</option>
          <option value="music" ${gameState.ambientMode === 'music' ? 'selected' : ''}>🎹 Спокойная уютная музыка</option>
          <option value="rain" ${gameState.ambientMode === 'rain' ? 'selected' : ''}>🌧️ Мягкий шум дождя</option>
        </select>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🐱 Питомец в Домике</div>
      <div class="form-group">
        <label class="form-label" for="pet-name-input">Имя кошки</label>
        <div style="display:flex; gap:6px;">
          <input type="text" class="form-input" id="pet-name-input" autocomplete="off" data-form-type="other" data-lpignore="true" value="${escapeAttr(gameState.petName || 'Пискля')}" maxlength="20" style="flex:1;" />
          <button class="btn btn-primary" id="btn-save-pet-name" style="padding:10px 14px;">Сохранить</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🧠 Настройка ИИ и API-ключа</div>
      <p class="muted-text">
        Ключ сохраняется только в памяти твоего браузера. Рекомендуется Gemini или OpenRouter.
      </p>

      <div class="form-group">
        <label class="form-label" for="ai-provider-select">Провайдер ИИ</label>
        <select class="form-select" id="ai-provider-select">${providerOptions}</select>
      </div>

      <div id="custom-api-fields" style="display: ${selectedProvider.needsKey ? 'flex' : 'none'}; flex-direction: column; gap: 10px;">
        <div class="form-group">
          <label class="form-label" for="ai-api-key">API-ключ</label>
          <div style="display: flex; gap: 6px; align-items: center;">
            <input
              type="text"
              class="form-input masked-input"
              id="ai-api-key"
              name="fleur-custom-key"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
              data-form-type="other"
              data-lpignore="true"
              placeholder="Вставь ключ (sk-or-..., sk-..., AIza...)"
              value="${escapeAttr(aiSettings.apiKey)}"
              style="flex: 1;"
            />
            <button type="button" class="btn btn-soft" id="btn-toggle-key-eye" title="Показать / скрыть ключ" style="padding: 10px 12px;">
              👁️
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="ai-model-input">Название модели</label>
          <input
            type="text"
            class="form-input"
            id="ai-model-input"
            autocomplete="off"
            data-form-type="other"
            data-lpignore="true"
            placeholder="${selectedProvider.defaultModel}"
            value="${escapeAttr(aiSettings.model || selectedProvider.defaultModel)}"
          />
        </div>

        <details style="font-size: 12px; color: var(--text-muted);">
          <summary style="cursor: pointer; font-weight: 700;">Расширенные настройки (Base URL)</summary>
          <div class="form-group" style="margin-top: 8px;">
            <input
              type="text"
              class="form-input"
              id="ai-baseurl-input"
              autocomplete="off"
              data-form-type="other"
              data-lpignore="true"
              placeholder="${selectedProvider.defaultBaseUrl}"
              value="${escapeAttr(aiSettings.baseUrl || selectedProvider.defaultBaseUrl)}"
            />
          </div>
        </details>
      </div>

      <button class="btn btn-primary" id="btn-save-ai">💾 Сохранить настройки ИИ</button>
      <button class="btn btn-sage" id="btn-test-ai">🧪 Проверить связь с ИИ</button>
      <div id="ai-test-result" class="muted-text" style="display:none; padding: 8px; background: var(--bg-soft); border-radius: 8px;"></div>
    </div>

    <div class="card">
      <div class="card-title">🗑️ Сброс прогресса</div>
      <button class="btn btn-danger" id="btn-reset-game">🗑️ Начать игру заново</button>
      <p style="margin-top: 8px; padding: 10px; border-radius: 12px; background: var(--bg-accent-soft); color: var(--primary-hover); font-size: 12.5px; font-weight: 800; text-align: center; line-height: 1.45;">
        Моей единственной и самой любимой полноценная игра, только для тебя Алиюш ❤️
      </p>
    </div>
  `;

  setupAiForm(showToast);
  setupGameControls(onHudUpdate, showToast);
}

function setupAiForm(showToast) {
  const select = document.getElementById('ai-provider-select');
  const fields = document.getElementById('custom-api-fields');
  const keyInput = document.getElementById('ai-api-key');
  const modelInput = document.getElementById('ai-model-input');
  const baseUrlInput = document.getElementById('ai-baseurl-input');
  const saveBtn = document.getElementById('btn-save-ai');
  const testBtn = document.getElementById('btn-test-ai');
  const testResult = document.getElementById('ai-test-result');

  const toggleEyeBtn = document.getElementById('btn-toggle-key-eye');
  toggleEyeBtn?.addEventListener('click', () => {
    const isHidden = keyInput.classList.toggle('masked-input');
    toggleEyeBtn.textContent = isHidden ? '👁️' : '🙈';
  });

  select.addEventListener('change', () => {
    const provider = AI_PROVIDERS[select.value];
    fields.style.display = provider.needsKey ? 'flex' : 'none';
    modelInput.value = provider.defaultModel;
    baseUrlInput.value = provider.defaultBaseUrl;
  });

  const applyFormToSettings = () => {
    const providerId = select.value;
    const provider = AI_PROVIDERS[providerId];
    const apiKey = keyInput.value.trim();

    if (provider.needsKey && !apiKey) {
      showToast('Вставь API-ключ для выбранного провайдера');
      return false;
    }

    saveAiSettings({
      provider: providerId,
      apiKey,
      model: modelInput.value.trim() || provider.defaultModel,
      baseUrl: baseUrlInput.value.trim() || provider.defaultBaseUrl
    });
    return true;
  };

  saveBtn.addEventListener('click', () => {
    if (!applyFormToSettings()) return;
    const provider = AI_PROVIDERS[select.value];
    showToast(`Настройки ИИ сохранены (${provider.name})`);
  });

  testBtn.addEventListener('click', async () => {
    if (!applyFormToSettings()) return;
    testBtn.disabled = true;
    testBtn.textContent = '⏳ Проверяем...';
    testResult.style.display = 'block';
    testResult.textContent = 'Отправляем пробный запрос...';

    try {
      const reply = await testAiConnection();
      testResult.textContent = `✅ Связь работает! Ответ ИИ: «${reply}»`;
      showToast('ИИ подключен и отвечает!');
    } catch (err) {
      testResult.textContent = `❌ Ошибка: ${err.message}`;
    } finally {
      testBtn.disabled = false;
      testBtn.textContent = '🧪 Проверить связь с ИИ';
    }
  });
}

function setupGameControls(onHudUpdate, showToast) {
  const soundBtn = document.getElementById('btn-toggle-sound');
  const ambientSelect = document.getElementById('ambient-mode-select');
  const petInput = document.getElementById('pet-name-input');
  const savePetBtn = document.getElementById('btn-save-pet-name');
  const saveShopBtn = document.getElementById('btn-save-shop-profile');
  const saveBadgeBtn = document.getElementById('btn-save-badge');
  const resetBtn = document.getElementById('btn-reset-game');

  saveShopBtn?.addEventListener('click', () => {
    const shopName = document.getElementById('set-shop-name')?.value.trim() || 'Fleur Atelier';
    let insta = document.getElementById('set-insta-handle')?.value.trim() || '@fleur_atelier';
    if (!insta.startsWith('@')) insta = '@' + insta;
    const openHour = Number(document.getElementById('set-open-hour')?.value) || 9;
    const closeHour = Number(document.getElementById('set-close-hour')?.value) || 21;
    const newDate = document.getElementById('set-current-date')?.value;

    gameState.shopName = shopName;
    gameState.instaHandle = insta;
    gameState.openHour = openHour;
    gameState.closeHour = closeHour;
    gameState.shownCloseHint = (gameState.timeMinutes || 540) >= closeHour * 60;

    if (newDate) setCurrentGameDate(newDate);
    else saveState();

    onHudUpdate();
    renderSettingsTab(document.getElementById('finance-subtab-body'), onHudUpdate, showToast);
    showToast(`✨ Настройки лавки «${shopName}» и дата обновлены!`);
  });

  soundBtn.addEventListener('click', () => {
    gameState.soundEnabled = !gameState.soundEnabled;
    if (!gameState.soundEnabled) {
      stopAmbient();
    } else if (gameState.ambientMode !== 'none') {
      setAmbientMode(gameState.ambientMode);
    }
    saveState();
    renderFinanceSettingsScreen(onHudUpdate, showToast);
    showToast(gameState.soundEnabled ? 'Звук включён' : 'Звук полностью выключен');
  });

  ambientSelect.addEventListener('change', () => {
    gameState.ambientMode = ambientSelect.value;
    setAmbientMode(gameState.ambientMode);
    saveState();
    showToast(
      gameState.ambientMode === 'music'
        ? '🎹 Спокойная музыка включена'
        : gameState.ambientMode === 'rain'
        ? '🌧️ Шум дождя включён'
        : 'Фон выключен'
    );
  });

  savePetBtn.addEventListener('click', () => {
    const newName = petInput.value.trim() || 'Пискля';
    gameState.petName = newName;
    saveState();
    showToast(`🐱 Имя питомца изменено на «${newName}»`);
  });

  saveBadgeBtn?.addEventListener('click', () => {
    const badgeName = document.getElementById('badge-name-input')?.value.trim() || '';
    const genderMode = document.getElementById('badge-gender-select')?.value || 'auto';
    gameState.playerBadgeName = badgeName;
    gameState.playerGender = ['auto', 'female', 'male'].includes(genderMode) ? genderMode : 'auto';
    saveState();
    renderSettingsTab(document.getElementById('finance-subtab-body'), onHudUpdate, showToast);
    if (badgeName) {
      const resolved = resolvePlayerGender(badgeName, gameState.playerGender);
      showToast(`🏷️ Бейджик «${badgeName}» надет (${resolved === 'female' ? 'женский род' : 'мужской род'})!`);
    } else {
      showToast('🏷️ Бейджик снят');
    }
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Точно сбросить весь прогресс магазина? Настройки API-ключа сохранятся.')) {
      stopAmbient();
      resetState();
      window.location.reload();
    }
  });
}

function renderAdminFooter(onHudUpdate, showToast) {
  const footer = document.getElementById('finance-admin-footer');
  if (!footer) return;

  let isUnlocked = false;
  try {
    isUnlocked = localStorage.getItem(ADMIN_UNLOCK_KEY) === '1';
  } catch (e) {
    isUnlocked = false;
  }

  if (!isUnlocked) {
    footer.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:center; gap:6px; opacity:0.7;">
        <input
          type="text"
          class="form-input"
          id="admin-secret-input"
          autocomplete="off"
          data-form-type="other"
          data-lpignore="true"
          placeholder="Служебная строка..."
          style="padding:5px 9px; font-size:11px; max-width:165px;"
        />
      </div>
    `;
    const input = document.getElementById('admin-secret-input');
    const tryUnlockAdmin = () => {
      if (input?.value.trim().toLowerCase() === 'admin') {
        try {
          localStorage.setItem(ADMIN_UNLOCK_KEY, '1');
        } catch (e) {}
        showToast('🔓 Панель баланса разблокирована!');
        renderAdminFooter(onHudUpdate, showToast);
      }
    };
    input?.addEventListener('input', tryUnlockAdmin);
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tryUnlockAdmin();
    });
    return;
  }

  footer.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:center; gap:6px;">
      <input
        type="number"
        class="form-input"
        id="admin-money-input"
        autocomplete="off"
        data-form-type="other"
        value="${gameState.money}"
        placeholder="Сумма ₽..."
        style="padding:5px 9px; font-size:12px; width:135px;"
      />
      <button class="btn btn-sage" id="btn-admin-apply-money" style="padding:5px 10px; font-size:11.5px;">
        💰 Задать ₽
      </button>
    </div>
  `;

  const applyMoney = () => {
    const val = Number(document.getElementById('admin-money-input')?.value);
    if (Number.isNaN(val)) return;
    gameState.money = Math.round(val);
    gameState.rentWarning = gameState.money < 0;
    saveState();
    onHudUpdate();
    if (currentSubTab === 'finance') {
      renderFinanceTab(document.getElementById('finance-subtab-body'), onHudUpdate, showToast);
    }
    showToast(`💰 Баланс изменён: ${gameState.money.toLocaleString('ru-RU')} ₽`);
  };

  document.getElementById('btn-admin-apply-money')?.addEventListener('click', applyMoney);
  document.getElementById('admin-money-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') applyMoney();
  });
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