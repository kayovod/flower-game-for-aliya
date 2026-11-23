/**
 * js/screens/financeSettingsScreen.js
 * Бухгалтерия сети, управление сотрудниками, профиль лавки, бейджик и настройки ИИ
 */

import { AI_PROVIDERS, JOB_ROLES, FRANCHISE_CATALOG } from '../config.js';
import { gameState, aiSettings, saveState, saveAiSettings, resetState, setCurrentGameDate } from '../state.js';
import { testAiConnection, resolvePlayerGender } from '../ai.js';
import { openBranchVisitModal } from './franchiseVisitScreen.js';

let activeTab = 'cash';
let isTestingAi = false;
let showApiKey = false;
let aiStatusMessage = null;

export function renderFinanceSettingsScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-finance');
  if (!container) return;

  const headerHtml = `
    <div class="screen-header">
      <h1 class="screen-title">Касса и ИИ</h1>
      <span class="badge ${gameState.rentWarning ? 'badge-warn' : 'badge-ok'}">
        Аренда через ${gameState.daysUntilRent} дн.
      </span>
    </div>

    <div class="segmented-tabs">
      <button class="seg-btn ${activeTab === 'cash' ? 'active' : ''}" data-fin-tab="cash">💰 Касса</button>
      <button class="seg-btn ${activeTab === 'settings' ? 'active' : ''}" data-fin-tab="settings">🤖 Настройки и ИИ</button>
    </div>
  `;

  if (activeTab === 'cash') {
    const netProfit = gameState.totalEarned - gameState.totalSpent;
    const employees = Array.isArray(gameState.employees) ? gameState.employees : [];
    const franchises = Array.isArray(gameState.franchises) ? gameState.franchises : [];
    const ledger = Array.isArray(gameState.franchiseLedger) ? gameState.franchiseLedger : [];

    const totalBranchEarned = franchises.reduce((s, b) => s + (b.totalEarned || 0), 0);
    const totalDailySalaries = employees.reduce((s, e) => s + (Number(e.salary) || 0), 0);
    const totalWeeklyBranchRent = franchises.reduce((s, b) => {
      const meta = FRANCHISE_CATALOG.find((m) => m.id === b.id);
      return s + (meta ? meta.weeklyRent : 0);
    }, 0);

    const employeesHtml = employees.length
      ? employees
          .map((emp) => {
            const roleMeta = JOB_ROLES.find((r) => r.id === emp.roleId);
            const branchOptions = [
              `<option value="" ${!emp.branchId ? 'selected' : ''}>🏪 Главная лавка</option>`,
              ...franchises.map((b) => `<option value="${b.id}" ${emp.branchId === b.id ? 'selected' : ''}>🏢 ${escapeHtml(b.name)}</option>`)
            ].join('');

            return `
              <div class="dm-card" style="padding:10px; gap:6px;">
                <div class="row-between">
                  <div style="flex:1; min-width:0;">
                    <strong style="font-size:13px;">${roleMeta?.icon || '👤'} ${escapeHtml(emp.name)}, ${emp.age}</strong>
                    <div class="muted-text" style="font-size:11.5px;">
                      ${escapeHtml(emp.roleName)} • ${emp.salary} ₽/смену • ${escapeHtml(emp.scheduleLabel)}
                    </div>
                  </div>
                  <button class="btn btn-danger" data-fire-emp="${emp.id}" style="padding:5px 9px; font-size:11px;">Уволить</button>
                </div>
                ${
                  franchises.length
                    ? `<div style="display:flex; gap:6px; align-items:center;">
                        <span class="muted-text" style="font-size:11px;">Точка:</span>
                        <select class="form-select" data-move-emp="${emp.id}" style="padding:5px 8px; font-size:11.5px; flex:1;">
                          ${branchOptions}
                        </select>
                      </div>`
                    : ''
                }
              </div>
            `;
          })
          .join('')
      : `<p class="muted-text" style="font-size:12px;">Сотрудников пока нет. Подай объявление в «Телефон → Insta»!</p>`;

    const franchisesSummaryHtml = franchises.length
      ? franchises
          .map((b) => {
            const meta = FRANCHISE_CATALOG.find((m) => m.id === b.id);
            const assigned = employees.filter((e) => e.branchId === b.id);
            const branchStaffSal = assigned.reduce((s, e) => s + (Number(e.salary) || 0), 0);
            return `
              <div class="dm-card" style="padding:10px; gap:5px;">
                <div class="row-between">
                  <strong style="font-size:12.5px;">${meta?.icon || '🏢'} ${escapeHtml(b.name)}</strong>
                  <button class="btn btn-sage" data-cash-visit-branch="${b.id}" style="padding:4px 9px; font-size:11px;">🚗 Визит</button>
                </div>
                <div class="muted-text" style="font-size:11.5px;">
                  Команда: <strong>${assigned.length ? assigned.map((e) => e.name).join(', ') : 'никто (точка закрыта)'}</strong>
                </div>
                <div class="row-between" style="font-size:11.5px;">
                  <span>Сегодня: <strong>+${b.todayEarned || 0} ₽</strong></span>
                  <span>Всего: <strong>${b.totalEarned || 0} ₽</strong></span>
                  <span>Расход/д.: <strong>~${Math.round((meta?.weeklyRent || 0) / 7) + branchStaffSal} ₽</strong></span>
                </div>
              </div>
            `;
          })
          .join('')
      : `<p class="muted-text" style="font-size:12px;">Филиалов пока нет — их можно открыть в «Телефон → Риелтор → Франшиза».</p>`;

    const ledgerHtml = ledger.length
      ? ledger
          .slice(0, 8)
          .map(
            (row) => `
          <div class="ledger-row">
            <span class="muted-text">Д${row.day}</span>
            <span style="flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(row.branchName)} (${escapeHtml(row.note || '')})</span>
            <strong style="color:${row.net >= 0 ? 'var(--sage-dark)' : 'var(--danger)'};">${row.net >= 0 ? '+' : ''}${row.net} ₽</strong>
          </div>
        `
          )
          .join('')
      : `<p class="muted-text" style="font-size:11.5px;">Проводок по сети пока нет — отчёт появится после закрытия дня или визита.</p>`;

    container.innerHTML = `
      ${headerHtml}
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
        <div class="card" style="padding:12px; gap:4px;">
          <span class="muted-text" style="font-size:11.5px;">💰 В кассе сейчас</span>
          <strong style="font-size:17px; color:var(--sage-dark);">${gameState.money} ₽</strong>
        </div>
        <div class="card" style="padding:12px; gap:4px;">
          <span class="muted-text" style="font-size:11.5px;">📈 Всего заработано</span>
          <strong style="font-size:17px; color:var(--text-main);">${gameState.totalEarned} ₽</strong>
        </div>
        <div class="card" style="padding:12px; gap:4px;">
          <span class="muted-text" style="font-size:11.5px;">🏢 Выручка филиалов</span>
          <strong style="font-size:16px; color:var(--text-main);">${totalBranchEarned} ₽</strong>
        </div>
        <div class="card" style="padding:12px; gap:4px;">
          <span class="muted-text" style="font-size:11.5px;">⚖️ Чистый баланс</span>
          <strong style="font-size:16px; color:${netProfit >= 0 ? 'var(--sage-dark)' : 'var(--danger)'};">${netProfit >= 0 ? '+' : ''}${netProfit} ₽</strong>
        </div>
      </div>

      <div class="card">
        <div class="row-between">
          <div class="card-title">🏢 Сводная бухгалтерия сети (${franchises.length} точ.)</div>
          <span class="badge badge-warn">${gameState.weeklyRent + totalWeeklyBranchRent} ₽/нед</span>
        </div>
        <div class="row-between" style="font-size:12.5px;">
          <span class="muted-text">Аренда главной лавки (через ${gameState.daysUntilRent} дн.)</span>
          <strong>${gameState.weeklyRent} ₽/нед</strong>
        </div>
        <div class="row-between" style="font-size:12.5px;">
          <span class="muted-text">Зарплаты команды (${employees.length} чел.)</span>
          <strong>${totalDailySalaries} ₽/день</strong>
        </div>
        ${franchisesSummaryHtml}
        <div style="display:flex; flex-direction:column; gap:5px; margin-top:4px;">
          <strong style="font-size:12px;">📋 Последние проводки по филиалам:</strong>
          ${ledgerHtml}
        </div>
      </div>

      <div class="card">
        <div class="row-between">
          <div class="card-title">👥 Команда (${employees.length})</div>
          <span class="muted-text" style="font-size:11.5px;">Распределение по точкам</span>
        </div>
        ${employeesHtml}
      </div>

      <div class="card">
        <div class="card-title">🏷️ Профиль лавки и бейджик</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
          <div class="form-group">
            <label class="form-label">Название магазина</label>
            <input type="text" class="form-input" id="shop-name-input" autocomplete="off" value="${escapeAttr(gameState.shopName || 'Fleur Atelier')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Ник в InstaFlower</label>
            <input type="text" class="form-input" id="insta-handle-input" autocomplete="off" value="${escapeAttr(gameState.instaHandle || '@fleur_atelier')}" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Твоё имя на бейджике для клиентов</label>
          <input type="text" class="form-input" id="badge-name-input" autocomplete="off" value="${escapeAttr(gameState.playerBadgeName || '')}" placeholder="Например: Алия" />
        </div>
        <div class="form-group">
          <label class="form-label">Пол на бейджике (как к тебе обращаться ИИ)</label>
          <select class="form-select" id="badge-gender-select">
            <option value="auto" ${gameState.playerBadgeGender === 'auto' ? 'selected' : ''}>Определять автоматически по имени</option>
            <option value="female" ${gameState.playerBadgeGender === 'female' ? 'selected' : ''}>Женский (флористка, она)</option>
            <option value="male" ${gameState.playerBadgeGender === 'male' ? 'selected' : ''}>Мужской (флорист, он)</option>
          </select>
          <div id="badge-gender-detected" class="muted-text" style="font-size:11.5px; margin-top:2px;"></div>
        </div>
        <button class="btn btn-sage" id="btn-save-badge">💾 Сохранить профиль и бейджик</button>
      </div>
    `;

    container.querySelectorAll('[data-fire-emp]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const emp = (gameState.employees || []).find((e) => e.id === btn.dataset.fireEmp);
        if (!emp) return;
        gameState.employees = gameState.employees.filter((e) => e.id !== emp.id);
        saveState();
        showToast(`${emp.name} уволен(а) из команды`);
        renderFinanceSettingsScreen(onHudUpdate, showToast);
      });
    });

    container.querySelectorAll('[data-move-emp]').forEach((sel) => {
      sel.addEventListener('change', () => {
        const emp = (gameState.employees || []).find((e) => e.id === sel.dataset.moveEmp);
        if (!emp) return;
        emp.branchId = sel.value || null;
        const targetName = emp.branchId
          ? FRANCHISE_CATALOG.find((b) => b.id === emp.branchId)?.name || 'филиал'
          : 'Главная лавка';
        saveState();
        showToast(`👤 ${emp.name} назначен(а): «${targetName}»`);
        renderFinanceSettingsScreen(onHudUpdate, showToast);
      });
    });

    container.querySelectorAll('[data-cash-visit-branch]').forEach((btn) => {
      btn.addEventListener('click', () => {
        openBranchVisitModal(btn.dataset.cashVisitBranch, onHudUpdate, showToast, () => {
          renderFinanceSettingsScreen(onHudUpdate, showToast);
        });
      });
    });

    const updateGenderHint = () => {
      const previewEl = document.getElementById('badge-gender-detected');
      if (!previewEl) return;
      const tmpName = document.getElementById('badge-name-input')?.value.trim() || '';
      const tmpMode = document.getElementById('badge-gender-select')?.value || 'auto';
      const prevN = gameState.playerBadgeName;
      const prevG = gameState.playerBadgeGender;
      gameState.playerBadgeName = tmpName;
      gameState.playerBadgeGender = tmpMode;
      const detected = resolvePlayerGender();
      gameState.playerBadgeName = prevN;
      gameState.playerBadgeGender = prevG;

      const labelMap = {
        female: '👩 Женский (обращение: флористка, она)',
        male: '👨 Мужской (обращение: флорист, он)',
        neutral: '🙂 Нейтральный (введи имя или выбери вручную)'
      };
      previewEl.textContent = `Определённый пол: ${labelMap[detected] || labelMap.neutral}`;
    };
    updateGenderHint();
    document.getElementById('badge-name-input')?.addEventListener('input', updateGenderHint);
    document.getElementById('badge-gender-select')?.addEventListener('change', updateGenderHint);

    document.getElementById('btn-save-badge')?.addEventListener('click', () => {
      const shopInput = document.getElementById('shop-name-input')?.value.trim();
      let instaInput = document.getElementById('insta-handle-input')?.value.trim();
      if (instaInput && !instaInput.startsWith('@')) instaInput = '@' + instaInput;
      const nameInput = document.getElementById('badge-name-input')?.value.trim() || '';
      const genderSel = document.getElementById('badge-gender-select')?.value || 'auto';

      if (shopInput) gameState.shopName = shopInput;
      if (instaInput) gameState.instaHandle = instaInput;
      gameState.playerBadgeName = nameInput;
      gameState.playerBadgeGender = genderSel;
      saveState();
      onHudUpdate();
      showToast('✨ Профиль лавки и бейджик сохранены!');
      renderFinanceSettingsScreen(onHudUpdate, showToast);
    });
  } else {
    const provMeta = AI_PROVIDERS[aiSettings.provider] || AI_PROVIDERS.openrouter;
    const curDateObj = new Date(
      Number((gameState.startDate || '2026-02-08').split('-')[0]),
      Number((gameState.startDate || '2026-02-08').split('-')[1]) - 1,
      Number((gameState.startDate || '2026-02-08').split('-')[2]) + (gameState.day - 1)
    );
    const curIso = `${curDateObj.getFullYear()}-${String(curDateObj.getMonth() + 1).padStart(2, '0')}-${String(curDateObj.getDate()).padStart(2, '0')}`;

    const providerOptions = Object.values(AI_PROVIDERS)
      .map((p) => `<option value="${p.id}" ${p.id === aiSettings.provider ? 'selected' : ''}>${p.name}</option>`)
      .join('');

    container.innerHTML = `
      ${headerHtml}
      <div class="card">
        <div class="card-title">🤖 Подключение ИИ для живых диалогов</div>
        <p class="muted-text" style="font-size:12px;">${provMeta.hint}</p>

        <div class="form-group">
          <label class="form-label">Провайдер ИИ</label>
          <select class="form-select" id="ai-provider-select">${providerOptions}</select>
        </div>

        ${
          provMeta.needsKey
            ? `
          <div class="form-group">
            <label class="form-label">API-ключ</label>
            <div style="display:flex; gap:6px; align-items:center;">
              <input
                type="text"
                class="form-input ${showApiKey ? '' : 'masked-input'}"
                id="ai-key-input"
                name="fleur_ai_token"
                autocomplete="off"
                spellcheck="false"
                value="${escapeAttr(aiSettings.apiKey)}"
                placeholder="Вставь API-ключ..."
                style="flex:1;"
              />
              <button class="btn btn-soft" id="btn-toggle-key-vis" type="button" title="Показать / скрыть ключ" style="padding:10px 11px;">
                ${showApiKey ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        `
            : ''
        }

        <div class="form-group">
          <label class="form-label">Базовый URL</label>
          <input type="text" class="form-input" id="ai-url-input" autocomplete="off" value="${escapeAttr(aiSettings.baseUrl)}" placeholder="https://..." />
        </div>

        <div class="form-group">
          <label class="form-label">Модель ИИ</label>
          <input type="text" class="form-input" id="ai-model-input" autocomplete="off" value="${escapeAttr(aiSettings.model)}" placeholder="например gemini-2.5-flash" />
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-primary" id="btn-save-ai" style="flex:1;">💾 Сохранить ИИ</button>
          <button class="btn btn-sage" id="btn-test-ai" style="flex:1;" ${isTestingAi ? 'disabled' : ''}>
            ${isTestingAi ? '⏳ Проверка...' : '⚡ Тест'}
          </button>
        </div>

        ${
          aiStatusMessage
            ? `<div class="dm-order-banner ${aiStatusMessage.ok ? 'agreed' : 'cancelled'}" style="margin-top:4px;">
                ${aiStatusMessage.ok ? '✅' : '⚠️'} ${escapeHtml(aiStatusMessage.text)}
              </div>`
            : ''
        }
      </div>

      <div class="card">
        <div class="card-title">📅 Дата и календарь в игре</div>
        <p class="muted-text" style="font-size:12px;">Можешь переключить дату на любой сезон или праздник (например, 14 февраля или 8 марта).</p>
        <div style="display:flex; gap:8px; align-items:center;">
          <input type="date" class="form-input" id="game-date-input" value="${curIso}" style="flex:1;" />
          <button class="btn btn-soft" id="btn-apply-date">Применить</button>
        </div>
      </div>

      <div class="card">
        <div class="card-title">🛠️ Служебная строка</div>
        <p class="muted-text" style="font-size:11.5px;">Введи служебный пароль (или сразу «admin 50000»), чтобы добавить деньги.</p>
        <div style="display:flex; gap:6px;">
          <input type="text" class="form-input" id="admin-cmd-input" autocomplete="off" spellcheck="false" placeholder="Пароль или команда..." style="flex:1;" />
          <button class="btn btn-soft" id="btn-admin-run">Ввод</button>
        </div>
        ${
          window._fleurAdminUnlocked
            ? `<div style="display:flex; gap:6px; margin-top:4px;">
                <input type="number" class="form-input" id="admin-money-amount" value="50000" min="1" style="flex:1;" />
                <button class="btn btn-sage" id="btn-admin-add-money">+ Начислить ₽</button>
              </div>`
            : ''
        }
      </div>

      <div class="card">
        <div class="card-title">💾 Сохранение игры</div>
        <p class="muted-text" style="font-size:11.5px;">При обновлении файлов игры старое сохранение не теряется. Можно также скачать резервную копию:</p>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-soft" id="btn-export-save" style="flex:1; font-size:12px;">💾 Скачать</button>
          <button class="btn btn-soft" id="btn-import-save" style="flex:1; font-size:12px;">📥 Загрузить</button>
          <input type="file" id="import-save-file" accept=".json" style="display:none;" />
        </div>
        <button class="btn btn-danger" id="btn-reset-game">🗑️ Начать игру заново</button>
      </div>
    `;

    document.getElementById('ai-provider-select')?.addEventListener('change', (e) => {
      const nextId = e.target.value;
      const meta = AI_PROVIDERS[nextId] || AI_PROVIDERS.openrouter;
      aiStatusMessage = null;
      saveAiSettings({
        provider: nextId,
        baseUrl: meta.baseUrl,
        model: meta.defaultModel
      });
      renderFinanceSettingsScreen(onHudUpdate, showToast);
    });

    function readFormAndSave() {
      const keyInput = document.getElementById('ai-key-input');
      const urlInput = document.getElementById('ai-url-input');
      const modelInput = document.getElementById('ai-model-input');
      saveAiSettings({
        apiKey: keyInput ? keyInput.value.trim() : aiSettings.apiKey,
        baseUrl: urlInput ? urlInput.value.trim() : aiSettings.baseUrl,
        model: modelInput ? modelInput.value.trim() : aiSettings.model
      });
    }

    document.getElementById('btn-toggle-key-vis')?.addEventListener('click', () => {
      readFormAndSave();
      showApiKey = !showApiKey;
      renderFinanceSettingsScreen(onHudUpdate, showToast);
    });

    document.getElementById('btn-save-ai')?.addEventListener('click', () => {
      readFormAndSave();
      aiStatusMessage = { ok: true, text: 'Настройки ИИ сохранены!' };
      showToast('✅ Настройки ИИ сохранены!');
      renderFinanceSettingsScreen(onHudUpdate, showToast);
    });

    document.getElementById('btn-test-ai')?.addEventListener('click', async () => {
      readFormAndSave();
      isTestingAi = true;
      aiStatusMessage = null;
      renderFinanceSettingsScreen(onHudUpdate, showToast);
      try {
        const res = await testAiConnection();
        if (res.ok) {
          aiStatusMessage = { ok: true, text: `Успешно! Ответ ИИ: «${res.reply}»` };
          showToast(`⚡ ИИ отвечает: «${res.reply}»`);
        } else {
          aiStatusMessage = { ok: false, text: res.error };
          showToast('⚠️ ' + res.error);
        }
      } catch (err) {
        aiStatusMessage = { ok: false, text: err.message };
        showToast('⚠️ ' + err.message);
      } finally {
        isTestingAi = false;
        renderFinanceSettingsScreen(onHudUpdate, showToast);
      }
    });

    document.getElementById('btn-apply-date')?.addEventListener('click', () => {
      const val = document.getElementById('game-date-input')?.value;
      if (!val) return;
      setCurrentGameDate(val);
      onHudUpdate();
      showToast('📅 Дата и сезон обновлены!');
    });

    const runAdminCmd = () => {
      const raw = document.getElementById('admin-cmd-input')?.value.trim() || '';
      const parts = raw.split(/\s+/);
      if (parts[0].toLowerCase() === 'admin') {
        window._fleurAdminUnlocked = true;
        const quickSum = Number(parts[1]);
        if (quickSum > 0) {
          gameState.money += Math.round(quickSum);
          saveState();
          onHudUpdate();
          showToast(`💰 Начислено +${Math.round(quickSum)} ₽!`);
        } else {
          showToast('🔓 Служебная панель открыта!');
        }
        renderFinanceSettingsScreen(onHudUpdate, showToast);
      } else {
        showToast('Неверный служебный пароль');
      }
    };
    document.getElementById('btn-admin-run')?.addEventListener('click', runAdminCmd);
    document.getElementById('admin-cmd-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runAdminCmd();
    });

    document.getElementById('btn-admin-add-money')?.addEventListener('click', () => {
      const sum = Math.round(Number(document.getElementById('admin-money-amount')?.value) || 0);
      if (sum <= 0) return;
      gameState.money += sum;
      saveState();
      onHudUpdate();
      showToast(`💰 В кассу добавлено +${sum} ₽!`);
      renderFinanceSettingsScreen(onHudUpdate, showToast);
    });

    document.getElementById('btn-export-save')?.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(gameState, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fleur-atelier-day-${gameState.day}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('💾 Файл сохранения скачан!');
    });

    document.getElementById('btn-import-save')?.addEventListener('click', () => {
      document.getElementById('import-save-file')?.click();
    });

    document.getElementById('import-save-file')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          Object.assign(gameState, parsed);
          saveState();
          onHudUpdate();
          showToast('📥 Сохранение успешно загружено!');
          renderFinanceSettingsScreen(onHudUpdate, showToast);
        } catch (err) {
          showToast('⚠️ Неверный файл сохранения');
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-reset-game')?.addEventListener('click', () => {
      const ok1 = confirm('Сбросить прогресс и начать цветочную лавку с 1-го дня?');
      if (!ok1) return;
      const ok2 = confirm('Точно удалить текущее сохранение? Настройки API-ключа при этом останутся.');
      if (!ok2) return;
      resetState();
      onHudUpdate();
      showToast('Новая игра началась!');
      renderFinanceSettingsScreen(onHudUpdate, showToast);
    });
  }

  container.querySelectorAll('[data-fin-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.finTab;
      renderFinanceSettingsScreen(onHudUpdate, showToast);
    });
  });
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}