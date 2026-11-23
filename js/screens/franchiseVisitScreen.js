/**
 * js/screens/franchiseVisitScreen.js
 * Личные визиты на свои точки франшизы: уникальный интерьер, сотрудник за прилавком и ИИ-события
 */

import { FRANCHISE_CATALOG } from '../config.js';
import { gameState, saveState } from '../state.js';
import {
  generateBranchVisitEvent,
  resolveBranchEventDecision,
  generateBranchEmployeeChatReply
} from '../ai.js';
import { playCoinSound, playBellSound } from '../sound.js';

const branchChats = {};
const activeBranchEvents = {};

export function openBranchVisitModal(branchId, onHudUpdate, showToast, onClose) {
  const existing = document.getElementById('branch-visit-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'branch-visit-overlay';
  overlay.className = 'vase-modal-overlay';
  document.body.appendChild(overlay);

  let isBusy = false;

  const render = () => {
    const meta = FRANCHISE_CATALOG.find((b) => b.id === branchId);
    const branchState = (gameState.franchises || []).find((b) => b.id === branchId);
    if (!meta || !branchState) {
      overlay.remove();
      return;
    }

    const emp = (gameState.employees || []).find((e) => e.branchId === branchId) || null;
    const allEmps = gameState.employees || [];
    const currentEvent = activeBranchEvents[branchId] || null;
    const chatHistory = branchChats[branchId] || [];

    const interiorSvg = getBranchInteriorSvg(meta.id);

    const empSelectOptions = [
      `<option value="">— Выбрать сотрудника на точку —</option>`,
      ...allEmps.map((e) => {
        const where = e.branchId
          ? FRANCHISE_CATALOG.find((b) => b.id === e.branchId)?.name || 'Филиал'
          : 'Главная лавка';
        return `<option value="${e.id}" ${e.branchId === branchId ? 'selected' : ''}>${e.roleIcon} ${escapeHtml(e.name)} (${where})</option>`;
      })
    ].join('');

    const eventSectionHtml = !emp
      ? `<div class="muted-text" style="font-size:11.5px; text-align:center; padding:8px;">
          Назначь сотрудника на эту точку, чтобы она открылась и начали происходить живые события.
        </div>`
      : currentEvent
      ? `
        <div class="branch-event-card">
          <div class="row-between">
            <strong style="font-size:12.5px;">⚡ ${escapeHtml(currentEvent.title)}</strong>
            <span class="badge badge-warn">Событие</span>
          </div>
          <p style="font-size:12px; line-height:1.4;">${escapeHtml(currentEvent.description)}</p>
          <div class="dm-msg client" style="font-size:11.5px; max-width:100%;">
            <strong>${escapeHtml(emp.name)}:</strong> «${escapeHtml(currentEvent.employeePrompt)}»
          </div>
          ${
            currentEvent.resolvedText
              ? `
            <div class="dm-order-banner agreed" style="font-size:11.5px;">
              ✅ <strong>Итог:</strong> ${escapeHtml(currentEvent.resolvedText)}
            </div>
            <button class="btn btn-soft" id="btn-new-branch-event" ${isBusy ? 'disabled' : ''} style="padding:6px 10px; font-size:11.5px;">
              🎲 Ещё событие на точке
            </button>
          `
              : `
            <div style="display:flex; gap:5px;">
              <input type="text" class="form-input" id="branch-event-decision" autocomplete="off" placeholder="Твоё решение для сотрудника..." style="padding:7px 9px; font-size:12px; flex:1;" ${isBusy ? 'disabled' : ''} />
              <button class="btn btn-primary" id="btn-resolve-branch-event" ${isBusy ? 'disabled' : ''} style="padding:7px 11px; font-size:12px;">Решить</button>
            </div>
          `
          }
        </div>
      `
      : `
        <button class="btn btn-sage" id="btn-trigger-branch-event" ${isBusy ? 'disabled' : ''}>
          ${isBusy ? '⏳ Осматриваем точку...' : '🎲 Проверить обстановку (случайное событие)'}
        </button>
      `;

    const chatSectionHtml = emp
      ? `
        <div class="team-talk-box">
          <strong style="font-size:11.5px;">💬 Поболтать с ${escapeHtml(emp.name)} за прилавком</strong>
          <div class="dm-thread" id="branch-chat-thread" style="max-height:125px; overflow-y:auto;">
            ${
              chatHistory.length
                ? chatHistory
                    .map(
                      (m) => `
                  <div class="dm-msg ${m.sender === 'player' ? 'player' : 'client'}" style="font-size:11.5px;">
                    ${escapeHtml(m.text)}
                  </div>
                `
                    )
                    .join('')
                : `<div class="muted-text" style="font-size:11px; text-align:center;">Спроси, как идут продажи на «${escapeHtml(meta.name)}» 🌸</div>`
            }
          </div>
          <div style="display:flex; gap:5px;">
            <input type="text" class="form-input" id="branch-chat-input" autocomplete="off" placeholder="Сказать сотруднику..." style="padding:6px 8px; font-size:11.5px; flex:1;" ${isBusy ? 'disabled' : ''} />
            <button class="btn btn-primary" id="btn-send-branch-chat" ${isBusy ? 'disabled' : ''} style="padding:6px 10px; font-size:11.5px;">➤</button>
          </div>
        </div>
      `
      : '';

    overlay.innerHTML = `
      <div class="setup-modal-card" style="max-height:92vh;">
        <div class="row-between">
          <strong style="font-size:14.5px;">${meta.icon} ${escapeHtml(meta.name)}</strong>
          <button class="btn btn-soft" id="btn-close-branch-visit" style="padding:5px 10px; font-size:12px;">← Уехать</button>
        </div>

        <div class="branch-scene ${meta.themeClass}">
          ${interiorSvg}
          <div class="branch-counter">
            ${
              emp
                ? `<div class="branch-employee-card">
                    <span style="font-size:20px;">${emp.roleIcon || '🌷'}</span>
                    <div>
                      <strong style="font-size:12px;">${escapeHtml(emp.name)} за прилавком</strong>
                      <div class="muted-text" style="font-size:10.5px;">${escapeHtml(emp.roleName)} • Настроение ${emp.mood || 90}%</div>
                    </div>
                  </div>`
                : `<div class="branch-employee-card">
                    <span style="font-size:18px;">🪑</span>
                    <div class="muted-text" style="font-size:11px;">Прилавок пустует — точка закрыта без сотрудника</div>
                  </div>`
            }
          </div>
        </div>

        <div class="row-between" style="font-size:11.5px; background:var(--bg-soft); padding:7px 9px; border-radius:10px;">
          <span>Выручка сегодня: <strong>+${branchState.todayEarned || 0} ₽</strong></span>
          <span>Всего: <strong>${branchState.totalEarned || 0} ₽</strong></span>
        </div>

        ${
          allEmps.length
            ? `<div style="display:flex; gap:6px; align-items:center;">
                <select class="form-select" id="branch-assign-emp" style="padding:6px 8px; font-size:11.5px; flex:1;">
                  ${empSelectOptions}
                </select>
                <button class="btn btn-soft" id="btn-assign-emp-here" style="padding:6px 9px; font-size:11.5px;">Назначить</button>
              </div>`
            : `<p class="muted-text" style="font-size:11px;">У тебя пока нет нанятых сотрудников — опубликуй вакансию в InstaFlower!</p>`
        }

        ${eventSectionHtml}
        ${chatSectionHtml}
      </div>
    `;

    const chatEl = overlay.querySelector('#branch-chat-thread');
    if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;

    overlay.querySelector('#btn-close-branch-visit')?.addEventListener('click', () => {
      overlay.remove();
      if (onClose) onClose();
    });

    overlay.querySelector('#btn-assign-emp-here')?.addEventListener('click', () => {
      const selId = overlay.querySelector('#branch-assign-emp')?.value;
      if (!selId) return;
      const targetEmp = (gameState.employees || []).find((e) => e.id === selId);
      if (!targetEmp) return;
      // Если кто-то уже стоял здесь — возвращаем его в главную лавку
      (gameState.employees || []).forEach((e) => {
        if (e.branchId === branchId && e.id !== targetEmp.id) e.branchId = null;
      });
      targetEmp.branchId = branchId;
      saveState();
      showToast(`👤 ${targetEmp.name} переведён(а) на «${meta.name}»!`);
      render();
    });

    const triggerEvent = async () => {
      if (isBusy || !emp) return;
      isBusy = true;
      render();
      try {
        const ev = await generateBranchVisitEvent(meta, branchState, emp);
        activeBranchEvents[branchId] = ev;
        playBellSound();
      } catch (err) {
        showToast('Не удалось получить событие от ИИ: ' + err.message);
      } finally {
        isBusy = false;
        render();
      }
    };

    overlay.querySelector('#btn-trigger-branch-event')?.addEventListener('click', triggerEvent);
    overlay.querySelector('#btn-new-branch-event')?.addEventListener('click', triggerEvent);

    const resolveEvent = async () => {
      const decision = overlay.querySelector('#branch-event-decision')?.value.trim();
      const ev = activeBranchEvents[branchId];
      if (!decision || !ev || isBusy || !emp) return;
      isBusy = true;
      render();
      try {
        const res = await resolveBranchEventDecision(meta, branchState, emp, ev, decision);
        ev.resolvedText = res.outcomeText;

        gameState.money += res.moneyDelta;
        if (res.moneyDelta >= 0) {
          gameState.totalEarned += res.moneyDelta;
          branchState.totalEarned = (branchState.totalEarned || 0) + res.moneyDelta;
          branchState.todayEarned = (branchState.todayEarned || 0) + res.moneyDelta;
        } else {
          gameState.totalSpent += Math.abs(res.moneyDelta);
          branchState.totalSpent = (branchState.totalSpent || 0) + Math.abs(res.moneyDelta);
        }

        if (!Array.isArray(gameState.franchiseLedger)) gameState.franchiseLedger = [];
        gameState.franchiseLedger.unshift({
          day: gameState.day,
          branchId: meta.id,
          branchName: meta.name,
          revenue: res.moneyDelta > 0 ? res.moneyDelta : 0,
          expenses: res.moneyDelta < 0 ? Math.abs(res.moneyDelta) : 0,
          net: res.moneyDelta,
          note: `Визит: ${ev.title}`
        });
        gameState.franchiseLedger = gameState.franchiseLedger.slice(0, 45);

        gameState.mood = Math.max(0, Math.min(100, gameState.mood + res.moodDelta));
        gameState.followers = Math.max(0, gameState.followers + res.followersDelta);
        if (res.moneyDelta > 0) playCoinSound();
        saveState();
        onHudUpdate();
        showToast(
          res.moneyDelta >= 0
            ? `✨ Событие решено: +${res.moneyDelta} ₽!`
            : `🔧 Событие решено: ${res.moneyDelta} ₽`
        );
      } catch (err) {
        showToast('Ошибка ИИ: ' + err.message);
      } finally {
        isBusy = false;
        render();
      }
    };

    overlay.querySelector('#btn-resolve-branch-event')?.addEventListener('click', resolveEvent);
    overlay.querySelector('#branch-event-decision')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') resolveEvent();
    });

    const sendChat = async () => {
      const input = overlay.querySelector('#branch-chat-input');
      const text = input?.value.trim();
      if (!text || isBusy || !emp) return;
      if (!Array.isArray(branchChats[branchId])) branchChats[branchId] = [];
      branchChats[branchId].push({ sender: 'player', text });
      isBusy = true;
      render();
      try {
        const reply = await generateBranchEmployeeChatReply(meta, branchState, emp, branchChats[branchId], text);
        branchChats[branchId].push({ sender: 'emp', text: reply });
        saveState();
      } catch (err) {
        showToast('Ошибка ответа ИИ: ' + err.message);
      } finally {
        isBusy = false;
        render();
      }
    };

    overlay.querySelector('#btn-send-branch-chat')?.addEventListener('click', sendChat);
    overlay.querySelector('#branch-chat-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendChat();
    });
  };

  render();
}

function getBranchInteriorSvg(branchId) {
  if (branchId === 'branch_mall_island') {
    return `
      <svg viewBox="0 0 320 96" width="100%" height="96">
        <rect x="0" y="0" width="320" height="96" fill="none"/>
        <polygon points="18,12 95,12 72,72 18,72" fill="rgba(255,255,255,0.45)" stroke="#C6D6DF" stroke-width="2"/>
        <line x1="28" y1="26" x2="80" y2="64" stroke="#9EB6C4" stroke-width="3"/>
        <rect x="115" y="10" width="90" height="22" rx="8" fill="#FFFDF9" stroke="#D98A7C" stroke-width="1.5"/>
        <text x="160" y="25" text-anchor="middle" fill="#6E4E3E" font-size="9" font-weight="bold">FLEUR • ТЦ</text>
        <rect x="225" y="18" width="76" height="54" rx="6" fill="rgba(255,255,255,0.6)" stroke="#B7CEDB" stroke-width="2"/>
        <circle cx="246" cy="48" r="10" fill="#F29AA4"/><circle cx="268" cy="44" r="11" fill="#F6CA51"/><circle cx="284" cy="50" r="9" fill="#93BEEB"/>
      </svg>
    `;
  }
  if (branchId === 'branch_metro_pavilion') {
    return `
      <svg viewBox="0 0 320 96" width="100%" height="96">
        <rect x="12" y="10" width="110" height="64" rx="8" fill="#5D688A" stroke="#FFFDF9" stroke-width="2.5"/>
        <circle cx="42" cy="34" r="12" fill="#D95364"/>
        <text x="42" y="38" text-anchor="middle" fill="#FFF" font-size="12" font-weight="bold">М</text>
        <circle cx="96" cy="24" r="4" fill="#FFE694"/><circle cx="110" cy="42" r="3" fill="#FCD5CE"/>
        <rect x="136" y="14" width="172" height="24" rx="10" fill="#3D3139" stroke="#E896A4" stroke-width="2"/>
        <text x="222" y="30" text-anchor="middle" fill="#FFE599" font-size="10" font-weight="bold">✨ ЦВЕТЫ У МЕТРО ✨</text>
        <circle cx="168" cy="62" r="11" fill="#D95364"/><circle cx="198" cy="58" r="11" fill="#FFFDF8"/><circle cx="228" cy="62" r="11" fill="#A78CC9"/>
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 320 96" width="100%" height="96">
      <line x1="160" y1="0" x2="160" y2="12" stroke="#DFB873" stroke-width="2"/>
      <ellipse cx="160" cy="22" rx="34" ry="8" fill="#FFF7DA" stroke="#DFB873" stroke-width="2"/>
      <circle cx="136" cy="25" r="3.5" fill="#FFE694"/><circle cx="160" cy="28" r="4" fill="#FFE694"/><circle cx="184" cy="25" r="3.5" fill="#FFE694"/>
      <path d="M24,80 L24,28 Q62,6 100,28 L100,80" fill="none" stroke="#DFB873" stroke-width="3"/>
      <path d="M220,80 L220,28 Q258,6 296,28 L296,80" fill="none" stroke="#DFB873" stroke-width="3"/>
      <circle cx="62" cy="56" r="13" fill="#F6B1BE"/><circle cx="258" cy="56" r="13" fill="#D58CD4"/>
    </svg>
  `;
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}