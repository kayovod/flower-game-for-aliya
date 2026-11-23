/**
 * js/screens/phone/phoneRealtor.js
 * Риелтор: переезд главной лавки/квартиры и покупка новых точек франшизы
 */

import { SHOP_LOCATIONS, HOME_LOCATIONS, FRANCHISE_CATALOG } from '../../config.js';
import { gameState, saveState } from '../../state.js';
import { openBranchVisitModal } from '../franchiseVisitScreen.js';
import { playCoinSound } from '../../sound.js';

export function renderRealtorApp(body, onHudUpdate, showToast) {
  const activeTab = window._fleurRealtorTab || 'main';
  const ownedSet = new Set(gameState.ownedLocations || ['shop_basement', 'home_studio']);
  const ownedBranches = Array.isArray(gameState.franchises) ? gameState.franchises : [];

  const renderShopList = SHOP_LOCATIONS.map((loc) => {
    const isCurrent = gameState.shopLocationId === loc.id;
    const isOwned = ownedSet.has(loc.id);
    let btnHtml = '';
    if (isCurrent) {
      btnHtml = `<span class="badge badge-ok">Текущая лавка</span>`;
    } else if (isOwned) {
      btnHtml = `<button class="btn btn-sage" data-switch-shop="${loc.id}" style="padding:6px 10px; font-size:11.5px;">Переехать</button>`;
    } else {
      btnHtml = `<button class="btn btn-primary" data-buy-shop="${loc.id}" style="padding:6px 10px; font-size:11.5px;">Купить ${loc.price} ₽</button>`;
    }

    return `
      <div class="realtor-card ${isCurrent ? 'current' : ''}">
        <div class="row-between">
          <strong style="font-size:13px;">🏪 ${loc.name}</strong>
          ${btnHtml}
        </div>
        <p class="muted-text" style="font-size:11.5px;">${loc.desc}</p>
        <div class="muted-text" style="font-size:11px;">🪟 Вид: ${loc.windowView} • 🏺 До ${loc.maxVases} ваз</div>
      </div>
    `;
  }).join('');

  const renderHomeList = HOME_LOCATIONS.map((loc) => {
    const isCurrent = gameState.homeLocationId === loc.id;
    const isOwned = ownedSet.has(loc.id);
    let btnHtml = '';
    if (isCurrent) {
      btnHtml = `<span class="badge badge-ok">Текущее жильё</span>`;
    } else if (isOwned) {
      btnHtml = `<button class="btn btn-sage" data-switch-home="${loc.id}" style="padding:6px 10px; font-size:11.5px;">Заселиться</button>`;
    } else {
      btnHtml = `<button class="btn btn-primary" data-buy-home="${loc.id}" style="padding:6px 10px; font-size:11.5px;">Купить ${loc.price} ₽</button>`;
    }

    return `
      <div class="realtor-card ${isCurrent ? 'current' : ''}">
        <div class="row-between">
          <strong style="font-size:13px;">🏡 ${loc.name}</strong>
          ${btnHtml}
        </div>
        <p class="muted-text" style="font-size:11.5px;">${loc.desc}</p>
      </div>
    `;
  }).join('');

  const renderFranchiseList = FRANCHISE_CATALOG.map((branch) => {
    const ownedObj = ownedBranches.find((b) => b.id === branch.id);
    const staffCount = (gameState.employees || []).filter((e) => e.branchId === branch.id).length;

    return `
      <div class="realtor-card ${ownedObj ? 'current' : ''}">
        <div class="row-between">
          <strong style="font-size:13px;">${branch.icon} ${branch.name}</strong>
          ${
            ownedObj
              ? `<button class="btn btn-sage" data-visit-branch="${branch.id}" style="padding:6px 10px; font-size:11.5px;">🚗 Визит</button>`
              : `<button class="btn btn-primary" data-buy-branch="${branch.id}" style="padding:6px 10px; font-size:11.5px;">Открыть ${branch.price} ₽</button>`
          }
        </div>
        <p class="muted-text" style="font-size:11.5px;">${branch.desc}</p>
        <div class="muted-text" style="font-size:11px;">
          💵 Выручка/день: ~${branch.minDailyRevenue}–${branch.maxDailyRevenue} ₽ • 🧾 Аренда: ${branch.weeklyRent} ₽/нед.
        </div>
        ${
          ownedObj
            ? `<div style="font-size:11px; color:var(--sage-dark); font-weight:800;">
                ✓ В вашей сети • Команда: ${staffCount > 0 ? `${staffCount} чел. (работает)` : 'пока нет (назначь в Кассе или на визите)'}
              </div>`
            : ''
        }
      </div>
    `;
  }).join('');

  body.innerHTML = `
    <div class="segmented-tabs">
      <button class="seg-btn ${activeTab === 'main' ? 'active' : ''}" data-realtor-tab="main">
        🏠 Главная точка
      </button>
      <button class="seg-btn ${activeTab === 'franchise' ? 'active' : ''}" data-realtor-tab="franchise">
        🏢 Франшиза (${ownedBranches.length}/${FRANCHISE_CATALOG.length})
      </button>
    </div>

    ${
      activeTab === 'main'
        ? `
      <div class="dm-card">
        <strong style="font-size:13.5px;">🏢 Торговые помещения (переезд главной лавки)</strong>
        ${renderShopList}
      </div>

      <div class="dm-card">
        <strong style="font-size:13.5px;">🏡 Квартиры и дома</strong>
        ${renderHomeList}
      </div>
    `
        : `
      <div class="antique-banner">
        <strong>🏢 Цветочная сеть по городу</strong><br/>
        Покупай дополнительные филиалы! Назначь сотрудника на точку в «Кассе» (или при визите), и точка будет приносить пассивную выручку каждый день.
      </div>
      ${renderFranchiseList}
    `
    }
  `;

  body.querySelectorAll('[data-realtor-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window._fleurRealtorTab = btn.dataset.realtorTab;
      renderRealtorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-buy-branch]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const meta = FRANCHISE_CATALOG.find((b) => b.id === btn.dataset.buyBranch);
      if (!meta) return;
      if ((gameState.franchises || []).some((b) => b.id === meta.id)) return;
      if (gameState.money < meta.price) {
        showToast(`Не хватает денег! Нужно ${meta.price} ₽`);
        return;
      }

      gameState.money -= meta.price;
      gameState.totalSpent += meta.price;
      if (!Array.isArray(gameState.franchises)) gameState.franchises = [];
      gameState.franchises.push({
        id: meta.id,
        name: meta.name,
        boughtDay: gameState.day,
        totalEarned: 0,
        totalSpent: meta.price,
        todayEarned: 0,
        todayTicks: 0,
        daysUntilRent: 7,
        mood: 88,
        lastEventDay: 0
      });

      gameState.mood = Math.min(100, gameState.mood + 8);
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`🎉 Открыт новый филиал сети: «${meta.name}»!`);
      renderRealtorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-visit-branch]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openBranchVisitModal(btn.dataset.visitBranch, onHudUpdate, showToast, () => {
        renderRealtorApp(body, onHudUpdate, showToast);
      });
    });
  });

  body.querySelectorAll('[data-buy-shop]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const loc = SHOP_LOCATIONS.find((l) => l.id === btn.dataset.buyShop);
      if (!loc) return;
      if (gameState.money < loc.price) {
        showToast('Недостаточно денег для покупки помещения!');
        return;
      }
      gameState.money -= loc.price;
      gameState.totalSpent += loc.price;
      if (!gameState.ownedLocations.includes(loc.id)) gameState.ownedLocations.push(loc.id);
      gameState.shopLocationId = loc.id;
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`🎉 С новосельем! Теперь твой магазин: «${loc.name}»!`);
      renderRealtorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-switch-shop]').forEach((btn) => {
    btn.addEventListener('click', () => {
      gameState.shopLocationId = btn.dataset.switchShop;
      saveState();
      showToast('Магазин переехал в выбранное помещение!');
      renderRealtorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-buy-home]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const loc = HOME_LOCATIONS.find((l) => l.id === btn.dataset.buyHome);
      if (!loc) return;
      if (gameState.money < loc.price) {
        showToast('Недостаточно денег на покупку жилья!');
        return;
      }
      gameState.money -= loc.price;
      gameState.totalSpent += loc.price;
      if (!gameState.ownedLocations.includes(loc.id)) gameState.ownedLocations.push(loc.id);
      gameState.homeLocationId = loc.id;
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`🏡 Поздравляю! Ты переехала в: «${loc.name}»!`);
      renderRealtorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-switch-home]').forEach((btn) => {
    btn.addEventListener('click', () => {
      gameState.homeLocationId = btn.dataset.switchHome;
      saveState();
      showToast('Ты переехала в выбранную квартиру!');
      renderRealtorApp(body, onHudUpdate, showToast);
    });
  });
}