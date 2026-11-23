/**
 * js/screens/phoneScreen.js
 * Диспетчер экрана смартфона: переключение приложений (Insta, Direct, Опт, Декор, Риелтор)
 */

import { gameState } from '../state.js';
import { formatMinutesAsTime } from '../ai.js';
import { renderInstaApp } from './phone/phoneInsta.js';
import { renderDirectApp } from './phone/phoneDirect.js';
import { renderWholesaleApp } from './phone/phoneWholesale.js';
import { renderDecorApp } from './phone/phoneDecor.js';
import { renderRealtorApp } from './phone/phoneRealtor.js';

let activeApp = 'insta';

export function renderPhoneScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-phone');
  if (!container) return;

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
          <span class="phone-app-icon">🎨</span>
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
      if (activeApp === btn.dataset.phoneApp) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      activeApp = btn.dataset.phoneApp;
      renderPhoneScreen(onHudUpdate, showToast);
    });
  });

  const body = document.getElementById('phone-app-body');
  if (activeApp === 'insta') {
    renderInstaApp(body, onHudUpdate, showToast, () => renderPhoneScreen(onHudUpdate, showToast));
  } else if (activeApp === 'direct') {
    renderDirectApp(body, onHudUpdate, showToast, () => renderPhoneScreen(onHudUpdate, showToast));
  } else if (activeApp === 'wholesale') {
    renderWholesaleApp(body, onHudUpdate, showToast);
  } else if (activeApp === 'decor') {
    renderDecorApp(body, onHudUpdate, showToast);
  } else {
    renderRealtorApp(body, onHudUpdate, showToast);
  }
}