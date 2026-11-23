/**
 * js/screens/phone/phoneCanvasSnap.js
 * Генерация снимка интерьера магазина на Canvas для галереи и соцсетей
 */

import {
  FLOWERS_CATALOG,
  DECOR_CATALOG,
  SHOP_LOCATIONS,
  getGameDateObj,
  getSeasonInfo
} from '../../config.js';
import { gameState } from '../../state.js';

export function isShopDecorVisible(id) {
  if (id === 'fridge') {
    return (
      Boolean(gameState.hasFridge || (gameState.decor || []).includes('fridge')) &&
      !(gameState.hiddenDecor || []).includes('fridge')
    );
  }
  return (gameState.decor || []).includes(id) && !(gameState.hiddenDecor || []).includes(id);
}

export function captureShopInteriorPhoto() {
  const c = document.createElement('canvas');
  c.width = 480;
  c.height = 480;
  const ctx = c.getContext('2d');

  const isEvening =
    gameState.timeIndex === 2 ||
    (gameState.timeMinutes || 540) >= (gameState.closeHour || 21) * 60;
  const season = getSeasonInfo(getGameDateObj(gameState.startDate, gameState.day - 1));
  const locId = gameState.shopLocationId || 'shop_basement';

  // Фоновая заливка зала
  if (gameState.powerOutage) {
    ctx.fillStyle = gameState.candlesLit ? '#4E3F38' : '#3E373D';
  } else if (locId === 'shop_pavilion') {
    ctx.fillStyle = isEvening ? '#D7E2DA' : '#F4F8F2';
  } else if (locId === 'shop_boutique') {
    ctx.fillStyle = isEvening ? '#E0D0C4' : '#FAF3EB';
  } else {
    ctx.fillStyle = isEvening ? '#DFCBB9' : '#F6ECE1';
  }
  ctx.fillRect(0, 0, 480, 480);

  // Молдинги для бутика
  if (locId === 'shop_boutique') {
    ctx.strokeStyle = 'rgba(223, 184, 115, 0.65)';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 460, 460);
  }

  // Винтажные обои
  if (isShopDecorVisible('vintage_wallpaper')) {
    ctx.fillStyle = 'rgba(217, 138, 124, 0.18)';
    for (let x = 22; x < 480; x += 44) {
      for (let y = 26; y < 340; y += 44) {
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = 'rgba(137, 168, 139, 0.14)';
    for (let x = 44; x < 480; x += 44) {
      for (let y = 48; y < 340; y += 44) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Окно на улицу
  ctx.fillStyle = isEvening
    ? '#5E648B'
    : gameState.weather === 'rainy'
    ? '#95A9B8'
    : '#BCE1F5';
  ctx.fillRect(34, 58, 166, 128);
  ctx.fillStyle =
    season.id === 'winter'
      ? '#F2F7FA'
      : season.id === 'autumn'
      ? '#D98A4E'
      : locId === 'shop_basement'
      ? '#CFC3B7'
      : '#9CC494';
  ctx.fillRect(34, 154, 166, 32);
  ctx.strokeStyle =
    locId === 'shop_boutique'
      ? '#DFB873'
      : locId === 'shop_basement'
      ? '#8C6D56'
      : '#FFFDF9';
  ctx.lineWidth = 7;
  ctx.strokeRect(34, 58, 166, 128);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(117, 58);
  ctx.lineTo(117, 186);
  ctx.moveTo(34, 124);
  ctx.lineTo(200, 124);
  ctx.stroke();

  // Вывеска с названием
  ctx.fillStyle = '#FFFDF9';
  ctx.fillRect(236, 58, 206, 54);
  ctx.strokeStyle = isShopDecorVisible('neon_sign') ? '#E58A94' : '#D5C3B3';
  ctx.lineWidth = isShopDecorVisible('neon_sign') ? 4.5 : 3;
  ctx.strokeRect(236, 58, 206, 54);
  ctx.fillStyle = isShopDecorVisible('neon_sign') ? '#C96577' : '#5C4A42';
  ctx.font = 'bold 19px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText((gameState.shopName || 'Fleur Atelier').slice(0, 18), 339, 91);

  // Цветочная арка
  if (isShopDecorVisible('shop_arch')) {
    ctx.strokeStyle = '#5A8357';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(6, 52);
    ctx.quadraticCurveTo(30, 14, 110, 14);
    ctx.lineTo(370, 14);
    ctx.quadraticCurveTo(450, 14, 474, 52);
    ctx.stroke();

    for (let lx = 38; lx <= 442; lx += 44) {
      ctx.fillStyle = '#6E9E69';
      ctx.beginPath();
      ctx.ellipse(lx, 18, 11, 5.5, lx % 88 === 0 ? 0.3 : -0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    [22, 126, 240, 354, 458].forEach((fx, idx) => {
      const fy = idx === 0 || idx === 4 ? 36 : 16;
      ctx.fillStyle = idx % 2 === 0 ? '#F29AA4' : '#F6B8BF';
      ctx.beginPath();
      ctx.arc(fx, fy, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFE28A';
      ctx.beginPath();
      ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Гирлянда из сердечек
  if (isShopDecorVisible('hearts_garland_shop')) {
    ctx.strokeStyle = '#C99B95';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 32);
    ctx.quadraticCurveTo(130, 52, 240, 34);
    ctx.quadraticCurveTo(350, 52, 460, 32);
    ctx.stroke();
    [60, 130, 200, 280, 350, 420].forEach((hx, idx) => {
      const hy = idx % 2 === 0 ? 44 : 40;
      ctx.fillStyle = idx % 2 === 0 ? '#E87A88' : '#F4A6B1';
      ctx.beginPath();
      ctx.arc(hx - 4, hy, 4.5, 0, Math.PI * 2);
      ctx.arc(hx + 4, hy, 4.5, 0, Math.PI * 2);
      ctx.lineTo(hx, hy + 10);
      ctx.closePath();
      ctx.fill();
    });
  }

  // Венок
  if (isShopDecorVisible('wreath_shop')) {
    ctx.save();
    ctx.strokeStyle = '#4D7D4E';
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.arc(248, 165, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#D95A62';
    ctx.beginPath();
    ctx.ellipse(240, 141, 8, 5, -0.3, 0, Math.PI * 2);
    ctx.ellipse(256, 141, 8, 5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    [231, 265, 248].forEach((bx, i) => {
      ctx.fillStyle = i === 2 ? '#E8B84B' : '#D9534F';
      ctx.beginPath();
      ctx.arc(bx, i === 2 ? 185 : 165, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // Зеркало
  if (isShopDecorVisible('shop_mirror')) {
    ctx.save();
    ctx.fillStyle = '#C9A36B';
    ctx.strokeStyle = '#8F6E3E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(324, 168, 22, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#DCECF5';
    ctx.beginPath();
    ctx.ellipse(324, 168, 16, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(315, 158);
    ctx.lineTo(331, 150);
    ctx.moveTo(313, 170);
    ctx.lineTo(333, 160);
    ctx.stroke();
    ctx.restore();
  }

  // Меловая доска
  if (isShopDecorVisible('shop_chalkboard')) {
    ctx.save();
    ctx.fillStyle = '#A97D59';
    ctx.fillRect(368, 136, 70, 56);
    ctx.fillStyle = '#3B4540';
    ctx.fillRect(374, 142, 58, 44);
    ctx.fillStyle = '#F5EFE6';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('БУКЕТ ДНЯ', 403, 154);
    ctx.strokeStyle = '#98C496';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(403, 178);
    ctx.lineTo(403, 166);
    ctx.stroke();
    ctx.fillStyle = '#F29AA4';
    ctx.beginPath();
    ctx.arc(403, 164, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Холодильник
  if (isShopDecorVisible('fridge')) {
    ctx.save();
    ctx.fillStyle = '#E8F3F7';
    ctx.strokeStyle = '#A6C1CC';
    ctx.lineWidth = 3;
    ctx.fillRect(392, 206, 62, 134);
    ctx.strokeRect(392, 206, 62, 134);
    ctx.fillStyle = '#D2EAF4';
    ctx.fillRect(399, 214, 48, 102);
    ctx.strokeStyle = '#A6C1CC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(399, 265);
    ctx.lineTo(447, 265);
    ctx.stroke();
    ctx.fillStyle = '#E87A88';
    ctx.beginPath();
    ctx.arc(415, 250, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F4C752';
    ctx.beginPath();
    ctx.arc(431, 250, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#B59ED6';
    ctx.beginPath();
    ctx.arc(423, 302, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Новогодняя ёлка
  if (isShopDecorVisible('xmas_tree_shop')) {
    ctx.save();
    ctx.fillStyle = '#9E6B4B';
    ctx.fillRect(42, 316, 20, 24);
    ctx.fillStyle = '#3D7047';
    ctx.beginPath();
    ctx.moveTo(52, 232);
    ctx.lineTo(14, 322);
    ctx.lineTo(90, 322);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#4B8556';
    ctx.beginPath();
    ctx.moveTo(52, 208);
    ctx.lineTo(22, 278);
    ctx.lineTo(82, 278);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFD95E';
    ctx.beginPath();
    ctx.arc(52, 202, 7, 0, Math.PI * 2);
    ctx.fill();
    [
      { x: 44, y: 254, c: '#E45A63' },
      { x: 62, y: 268, c: '#F4C752' },
      { x: 36, y: 296, c: '#7FB8E0' },
      { x: 64, y: 304, c: '#E45A63' }
    ].forEach((b) => {
      ctx.fillStyle = b.c;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // Прилавок
  ctx.fillStyle = '#C9A789';
  ctx.fillRect(24, 340, 432, 22);
  ctx.fillStyle = '#EADBC9';
  ctx.fillRect(0, 362, 480, 118);

  // Вазы на прилавке
  const vaseColors = ['#EBD9CE', '#DCE6DB', '#F3DFDC', '#DFD9EA'];
  const count = Math.min(4, Math.max(1, gameState.inventory.length));
  const hasPumpkins = isShopDecorVisible('pumpkins_shop');
  const startX = hasPumpkins ? 70 : 95;
  const stepX = hasPumpkins ? 72 : 88;

  for (let i = 0; i < count; i++) {
    const item = gameState.inventory[i];
    const meta = item ? FLOWERS_CATALOG[item.typeId] : null;
    const vx = startX + i * stepX;
    ctx.fillStyle = meta?.vaseColor || vaseColors[i % vaseColors.length];
    ctx.fillRect(vx, 282, 38, 58);
    ctx.fillStyle = '#6E9971';
    ctx.fillRect(vx + 16, 238, 6, 44);
    ctx.fillStyle =
      meta?.color === 'красный'
        ? '#E2626B'
        : meta?.color === 'жёлтый'
        ? '#F4C752'
        : meta?.color === 'белый'
        ? '#FFFDF9'
        : meta?.color === 'сиреневый'
        ? '#B296D4'
        : meta?.color === 'голубой' || meta?.color === 'синий'
        ? '#79AFDC'
        : '#E98387';
    ctx.beginPath();
    ctx.arc(vx + 19, 232, 15, 0, Math.PI * 2);
    ctx.fill();
  }

  // Тыквы на прилавке
  if (hasPumpkins) {
    ctx.save();
    ctx.fillStyle = '#D96E34';
    ctx.beginPath();
    ctx.ellipse(354, 336, 10, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5A7247';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(384, 300);
    ctx.lineTo(388, 290);
    ctx.stroke();
    ctx.fillStyle = '#DF7135';
    ctx.beginPath();
    ctx.ellipse(384, 321, 22, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F29457';
    ctx.beginPath();
    ctx.ellipse(384, 321, 8, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E8AE52';
    ctx.beginPath();
    ctx.ellipse(420, 326, 15, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F5C776';
    ctx.beginPath();
    ctx.ellipse(420, 326, 6, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Свечи при аварии электросети
  if (gameState.powerOutage && gameState.candlesLit) {
    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(36, 314, 12, 26);
    ctx.fillStyle = 'rgba(255, 200, 90, 0.35)';
    ctx.beginPath();
    ctx.arc(42, 304, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFB74D';
    ctx.beginPath();
    ctx.ellipse(42, 306, 4, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Водяной знак с названием магазина
  ctx.fillStyle = 'rgba(74, 62, 57, 0.55)';
  ctx.font = 'bold 16px Georgia, serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${gameState.shopName || 'Fleur Atelier'} 🌸`, 460, 460);

  return c.toDataURL('image/jpeg', 0.85);
}