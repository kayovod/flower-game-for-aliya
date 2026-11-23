This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
assets/
  icon.svg
css/
  bouquet.css
  client.css
  home.css
  layout.css
  phone.css
  shop.css
  variables.css
js/
  ai/
    aiCore.js
    clientGenerator.js
    clientTemplates.js
    jobsAi.js
    socialAi.js
  graphics/
    avatarSvg.js
    flowersSvg.js
    shopScenerySvg.js
  screens/
    phone/
      phoneCanvasSnap.js
      phoneDecor.js
      phoneDirect.js
      phoneInsta.js
      phoneRealtor.js
      phoneWholesale.js
    shop/
      shopClientZone.js
      shopInspector.js
    bouquetMaker.js
    financeSettingsScreen.js
    homeScreen.js
    phoneScreen.js
    shopScreen.js
    storageScreen.js
  план.txt
  ai.js
  config.js
  main.js
  sound.js
  state.js
index.html
manifest.json
sw.js
```

# Files

## File: assets/icon.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FCE8E6"/>
      <stop offset="100%" stop-color="#E7F0E5"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="115" fill="url(#bg)"/>
  <path d="M256 410 C256 410 256 260 256 230" stroke="#6B8E6E" stroke-width="18" stroke-linecap="round"/>
  <path d="M256 340 C210 330 185 295 190 275 C215 275 245 305 256 340 Z" fill="#82A885"/>
  <path d="M256 310 C305 300 330 265 322 245 C295 245 268 275 256 310 Z" fill="#6B8E6E"/>
  <circle cx="256" cy="145" r="46" fill="#F29E9D"/>
  <circle cx="204" cy="185" r="46" fill="#F6B8B7"/>
  <circle cx="308" cy="185" r="46" fill="#F6B8B7"/>
  <circle cx="222" cy="238" r="44" fill="#EB8786"/>
  <circle cx="290" cy="238" r="44" fill="#EB8786"/>
  <circle cx="256" cy="195" r="32" fill="#FDE08D"/>
</svg>
```

## File: css/bouquet.css
```css
/* Стол сборки букетов */
.bouquet-board-card {
  background: var(--bg-card);
  border: 1.5px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 10px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bouquet-canvas-wrap {
  position: relative;
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid #E5D7C8;
  background: #F4EAD9;
  touch-action: none; /* Важно для перетаскивания пальцем на телефоне */
}

#bouquet-canvas {
  display: block;
  width: 100%;
  height: auto;
  cursor: grab;
}

#bouquet-canvas:active {
  cursor: grabbing;
}

.canvas-price-pill {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255, 253, 249, 0.92);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  color: var(--sage-dark);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  pointer-events: none;
}

.canvas-hint-pill {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(74, 62, 57, 0.72);
  color: #FFFDF9;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  white-space: nowrap;
  pointer-events: none;
}

/* Панель инструментов */
.maker-toolbar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.tool-btn {
  border: 1.5px solid var(--border-soft);
  background: var(--bg-soft);
  color: var(--text-main);
  border-radius: var(--radius-sm);
  padding: 7px 4px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: all 0.15s ease;
}

.tool-btn.active {
  background: var(--bg-accent-soft);
  border-color: var(--primary);
  color: var(--primary-hover);
}

.tool-btn:disabled {
  opacity: 0.45;
  cursor: default;
}

/* Горизонтальная полка добавления цветов */
.flower-tray {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.tray-chip {
  position: relative;
  flex-shrink: 0;
  width: 78px;
  background: #FFFDF9;
  border: 1.5px solid var(--border-soft);
  border-radius: 12px;
  padding: 6px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  transition: transform 0.14s, border-color 0.14s;
}

.tray-chip:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
}

.tray-discount-badge {
  position: absolute;
  top: 3px;
  left: 3px;
  background: #FCE8E6;
  color: var(--primary-hover);
  font-size: 9px;
  font-weight: 800;
  padding: 1px 4px;
  border-radius: 5px;
}

.tray-chip-svg {
  width: 34px;
  height: 38px;
}

.tray-chip-name {
  font-size: 10.5px;
  font-weight: 800;
  color: var(--text-main);
}

.tray-chip-qty {
  font-size: 9.5px;
  font-weight: 700;
  color: var(--text-muted);
}

.tray-chip-fresh {
  font-size: 9px;
  font-weight: 800;
  color: var(--sage-dark);
}

/* Выбор упаковки и ленты */
.wrap-options-row {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.wrap-pill {
  flex-shrink: 0;
  border: 1.5px solid var(--border-soft);
  background: #FFFDF9;
  padding: 6px 10px;
  border-radius: 999px;
  font-family: var(--font-ui);
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-main);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.wrap-pill.active {
  border-color: var(--primary);
  background: var(--bg-accent-soft);
  color: var(--primary-hover);
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

/* Мини-список готовых букетов */
.ready-bouquets-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.ready-bouquet-card {
  flex-shrink: 0;
  width: 110px;
  background: #FFFDF9;
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.ready-bouquet-img {
  width: 84px;
  height: 84px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--border-soft);
}

/* Модальное окно Polaroid-снимка */
.polaroid-overlay {
  position: fixed;
  inset: 0;
  background: rgba(45, 35, 30, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
  animation: fadeInScreen 0.2s ease-out;
}

.polaroid-card {
  background: #FFFDF9;
  padding: 14px 14px 18px;
  border-radius: 14px;
  max-width: 300px;
  width: 100%;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.28);
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
}

.polaroid-card img {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--border-soft);
}
```

## File: css/client.css
```css
/* Карточка пришедшего клиента у прилавка */
.client-card {
  background: var(--bg-card);
  border: 1.5px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 12px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: fadeInScreen 0.25s ease-out;
}

.client-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.client-avatar {
  width: 68px;
  height: 68px;
  border-radius: 18px;
  background: var(--bg-soft);
  border: 2px solid #FFFDF9;
  box-shadow: 0 4px 10px rgba(74, 62, 57, 0.1);
  overflow: hidden;
  flex-shrink: 0;
}

.client-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.client-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-main);
}

.client-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.client-tag {
  background: var(--bg-soft);
  color: var(--text-muted);
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
}

/* Шкала настроения клиента */
.client-mood-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
}

/* Чат с клиентом */
.chat-box {
  background: #FAF6F0;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  padding: 10px;
  max-height: 195px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-bubble {
  max-width: 88%;
  padding: 8px 11px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.4;
  word-wrap: break-word;
}

.chat-bubble.client {
  align-self: flex-start;
  background: #FFFFFF;
  border: 1px solid var(--border-soft);
  border-bottom-left-radius: 4px;
  color: var(--text-main);
}

.chat-bubble.player {
  align-self: flex-end;
  background: var(--bg-accent-soft);
  border: 1px solid #F1CFC9;
  border-bottom-right-radius: 4px;
  color: var(--text-main);
}

.chat-bubble.system-note {
  align-self: center;
  background: var(--bg-sage-soft);
  color: var(--sage-dark);
  font-size: 11.5px;
  font-weight: 700;
  text-align: center;
}

.chat-typing {
  align-self: flex-start;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  font-style: italic;
  padding: 2px 6px;
}

/* Ввод сообщения */
.chat-input-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.chat-input-row .form-input {
  flex: 1;
  min-width: 0;
  padding: 9px 11px;
  font-size: 13px;
}

/* Плашка авто-ухода клиента */
.client-leaving-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: var(--bg-soft);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 8px 10px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-muted);
}

/* Меню выбора товара для предложения клиенту */
.offer-drawer {
  background: #FFFDF9;
  border: 1.5px dashed var(--primary);
  border-radius: var(--radius-md);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: fadeInScreen 0.18s ease-out;
}

.offer-item-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: var(--bg-soft);
  border-radius: 10px;
}

.offer-thumb {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  object-fit: cover;
  background: #FFFDF9;
  flex-shrink: 0;
}

.offer-price-input {
  width: 72px;
  padding: 5px 6px;
  border: 1.5px solid var(--border-soft);
  border-radius: 8px;
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 800;
  text-align: center;
  color: var(--text-main);
}

/* Превью поста из InstaFlower у клиента в зале */
.client-post-ref {
  display: flex;
  align-items: center;
  gap: 9px;
  background: #FFF8F5;
  border: 1.5px dashed var(--primary);
  border-radius: 11px;
  padding: 6px 8px;
  font-size: 11.5px;
}

.client-post-ref img {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
```

## File: css/home.css
```css
/* Уютная комната в квартире */
.home-room-scene {
  position: relative;
  border-radius: var(--radius-lg);
  padding: 14px 12px 10px;
  border: 1.5px solid var(--border-soft);
  box-shadow: var(--shadow-card);
  background: linear-gradient(180deg, #F4E6D8 0%, #E9D5C0 60%, #D2B89F 60%, #C1A388 100%);
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

/* Гирлянда-штора под потолком */
.home-fairy-lights {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 22px;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  pointer-events: none;
  z-index: 4;
}

.fairy-strand {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fairy-wire {
  width: 1px;
  height: 8px;
  background: rgba(140, 123, 115, 0.35);
}

.fairy-strand:nth-child(even) .fairy-wire {
  height: 14px;
}

.fairy-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #FFE599;
  box-shadow: 0 0 8px 2px rgba(255, 224, 130, 0.85);
  animation: twinkle 2.4s infinite ease-in-out;
}

.home-top-wall {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  min-height: 122px;
  position: relative;
  z-index: 2;
}

.home-window-wrap {
  position: relative;
  align-self: flex-start;
  flex-shrink: 0;
}

.home-window {
  width: 106px;
  height: 82px;
  border-radius: 14px;
  border: 4px solid #FFFDF9;
  background: linear-gradient(180deg, #6E769F 0%, #D99B8C 100%);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.14);
}

.home-window.day {
  background: linear-gradient(180deg, #AEDDF5 0%, #E7F5FA 100%);
}

/* Кружевные шторы */
.home-curtain {
  position: absolute;
  top: -2px;
  width: 24px;
  height: 88px;
  background: linear-gradient(180deg, rgba(255, 253, 249, 0.94), rgba(248, 238, 232, 0.88));
  border: 1px dashed #DECBC0;
  z-index: 5;
  pointer-events: none;
}

.home-curtain.left {
  left: -4px;
  border-radius: 6px 0 18px 4px;
}

.home-curtain.right {
  right: -4px;
  border-radius: 0 6px 4px 18px;
}

/* Визуальные предметы декора на стене и у стены */
.home-wall-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  min-width: 0;
}

.home-wall-bookshelf {
  width: 96px;
  height: 62px;
}

.home-hearts-wall {
  font-size: 13px;
  letter-spacing: 3px;
  filter: drop-shadow(0 2px 3px rgba(217, 138, 124, 0.35));
}

.home-sofa-wrap {
  position: absolute;
  bottom: 24px;
  left: 44%;
  transform: translateX(-50%);
  width: 114px;
  height: 54px;
  pointer-events: none;
  z-index: 2;
  filter: drop-shadow(0 3px 4px rgba(74, 62, 57, 0.14));
}

.home-lamp-wrap {
  width: 60px;
  height: 108px;
  position: relative;
  flex-shrink: 0;
  margin-bottom: -6px;
}

.home-lamp-glow {
  position: absolute;
  top: 4px;
  left: -16px;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 224, 145, 0.44) 0%, rgba(255, 224, 145, 0) 70%);
  pointer-events: none;
}

/* Интерактивная сцена пола, где гуляет кошка */
.home-walk-stage {
  position: relative;
  width: 100%;
  height: 108px;
  margin-top: 2px;
  z-index: 3;
}

.home-rug {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 164px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, #F7E5DC 0%, #E7C3B7 75%, #D6A698 100%);
  border: 2px dashed rgba(255, 253, 249, 0.75);
  pointer-events: none;
}

.home-cat-bed-floor {
  position: absolute;
  bottom: 6px;
  left: 42%;
  transform: translateX(-50%);
  width: 82px;
  height: 28px;
  pointer-events: none;
}

.home-tree-floor {
  position: absolute;
  bottom: 10px;
  right: 4px;
  width: 62px;
  height: 92px;
  pointer-events: none;
}

.home-plant-floor {
  position: absolute;
  bottom: 10px;
  left: 2px;
  width: 48px;
  height: 70px;
  pointer-events: none;
}

.home-pumpkins-floor {
  position: absolute;
  bottom: 8px;
  left: 46px;
  width: 54px;
  height: 36px;
  pointer-events: none;
}

/* Гуляющая кошка Пискля */
.cat-walker {
  position: absolute;
  bottom: 8px;
  left: 48%;
  transform: translateX(-50%);
  width: 76px;
  height: 76px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  z-index: 6;
  outline: none;
  user-select: none;
}

.cat-sprite-flip {
  width: 100%;
  height: 100%;
  transition: transform 0.2s ease;
}

.cat-body-bob {
  width: 100%;
  height: 100%;
}

.cat-walker.is-walking .cat-body-bob {
  animation: catWalkBob 0.36s infinite ease-in-out;
}

.cat-walker.is-purring .cat-body-bob {
  animation: catPurrBounce 0.45s infinite ease-in-out;
}

@keyframes catWalkBob {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(1.5deg); }
}

@keyframes catPurrBounce {
  0%, 100% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.07, 0.95) translateY(-5px); }
}

.cat-thought-bubble {
  position: absolute;
  bottom: 76px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 253, 249, 0.96);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 800;
  color: var(--text-main);
  white-space: nowrap;
  box-shadow: 0 3px 8px rgba(74, 62, 57, 0.1);
  pointer-events: none;
}

.cat-hearts-layer {
  position: absolute;
  inset: -24px 0 20px 0;
  pointer-events: none;
  overflow: visible;
}

.cat-heart-particle {
  position: absolute;
  bottom: 20px;
  font-size: 14px;
  animation: floatHeartUp 1.15s ease-out forwards;
}

@keyframes floatHeartUp {
  0% { opacity: 0; transform: translateY(0) scale(0.6); }
  20% { opacity: 1; transform: translateY(-10px) scale(1.05); }
  100% { opacity: 0; transform: translateY(-46px) scale(0.9); }
}

/* Панель управления кошкой и декором под комнатой */
.pet-spot {
  background: rgba(255, 253, 249, 0.94);
  border: 1.5px solid var(--border-soft);
  border-radius: 16px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  box-shadow: 0 4px 12px rgba(74, 62, 57, 0.08);
  z-index: 4;
}

/* Список переключения декора в модалке */
.decor-toggle-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  max-height: 55vh;
  overflow-y: auto;
}

.decor-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: var(--bg-soft);
  border-radius: 10px;
  padding: 7px 9px;
  font-size: 12px;
}

/* Мячик-игрушка для кошки на полу комнаты */
.home-cat-ball-floor {
  position: absolute;
  bottom: 7px;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  z-index: 5;
  transition: left 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s ease-out;
}

/* Новые квартиры: уютная студия, двушка с балконом, тёплая роскошная мансарда */
.home-room-scene.loc-home_studio {
  background:
    repeating-linear-gradient(90deg, rgba(255, 253, 249, 0.22) 0 18px, transparent 18px 36px),
    radial-gradient(circle at 80% 25%, rgba(255, 240, 214, 0.55), transparent 52%),
    linear-gradient(180deg, #F6E9DC 0%, #ECD8C5 58%, #D7BE9F 58%, #C4A588 100%);
}

.home-room-scene.loc-home_balcony {
  background:
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.28) 0 22px, transparent 22px 44px),
    linear-gradient(180deg, #FCF8F2 0%, #F1E9DD 58%, #E1CCB4 58%, #CEB39A 100%);
  border-color: #D2C3B3;
  padding-bottom: 12px;
}

.home-balcony-door {
  width: 90px;
  height: 116px;
  border-radius: 14px 14px 4px 4px;
  border: 4px solid #FFFDF9;
  background: linear-gradient(180deg, #AEDDF5 0%, #E1F3FA 100%);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: inset 0 3px 10px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(74, 62, 57, 0.12);
}

.home-balcony-door.night {
  background: linear-gradient(180deg, #3D456E 0%, #7F6D8F 100%);
}

/* Дорогая, светлая, тёплая и уютная мансарда с камином */
.home-room-scene.loc-home_loft {
  background:
    radial-gradient(circle at 82% 44%, rgba(255, 214, 138, 0.48) 0%, transparent 52%),
    radial-gradient(circle at 18% 22%, rgba(255, 248, 232, 0.65) 0%, transparent 45%),
    linear-gradient(180deg, #FFF9F0 0%, #F7EAD8 58%, #DFBE99 58%, #CCA47B 100%);
  border: 2px solid #DFBA8C;
  box-shadow: inset 0 0 28px rgba(255, 224, 165, 0.36), var(--shadow-card);
}

.home-loft-beams {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 22px;
  z-index: 2;
  pointer-events: none;
}

.home-studio-art {
  width: 52px;
  height: 38px;
  filter: drop-shadow(0 2px 3px rgba(74, 62, 57, 0.12));
}

.home-room-scene.loc-home_loft .home-window {
  width: 112px;
  height: 86px;
  border: 4px solid #FFFDF9;
  border-radius: 34px 34px 12px 12px;
  background: linear-gradient(180deg, #2C3764 0%, #58669A 70%, #8E82A1 100%);
  box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.18), 0 0 0 3px #E9D2B5;
}

.home-room-scene.loc-home_loft .home-window.day {
  background: linear-gradient(180deg, #A3D9F7 0%, #DFF2FC 75%, #F2E7DA 100%);
}

.home-fireplace {
  position: relative;
  width: 102px;
  height: 98px;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 12px rgba(255, 168, 76, 0.34));
}

.fireplace-flame {
  animation: fireFlicker 0.85s infinite alternate ease-in-out;
  transform-origin: center bottom;
}

@keyframes fireFlicker {
  0% { transform: scale(0.95, 0.96); opacity: 0.9; }
  100% { transform: scale(1.06, 1.08); opacity: 1; }
}

.home-rare-decor-spot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 3px 4px rgba(74, 62, 57, 0.2));
}

.home-cat-tower-floor {
  position: absolute;
  bottom: 10px;
  right: 54px;
  width: 68px;
  height: 112px;
  pointer-events: none;
  z-index: 2;
  filter: drop-shadow(0 3px 5px rgba(74, 62, 57, 0.16));
}

.home-window-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
```

## File: css/layout.css
```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: var(--font-ui);
  color: var(--text-main);
  background-color: var(--bg-desktop);
  overflow: hidden;
}

/* Центрирование 9:16 на ПК и фуллскрин на смартфонах */
.desktop-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 20% 20%, #F7EDE2 0%, #E7DDD0 100%);
}

.app-shell {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 430px;
  max-height: 900px;
  background-color: var(--bg-app);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (min-width: 480px) {
  .app-shell {
    height: 94vh;
    aspect-ratio: 9 / 16;
    width: auto;
    border-radius: 34px;
    border: 8px solid #FFFDF9;
    box-shadow: var(--shadow-phone);
  }
}

/* Верхняя панель статуса */
.top-bar {
  position: relative;
  min-height: var(--top-bar-height);
  height: auto;
  padding: max(7px, env(safe-area-inset-top)) 10px 7px;
  background: rgba(255, 253, 249, 0.96);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-soft);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  flex-shrink: 0;
  z-index: 25;
}

.top-bar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 7px;
  border-radius: 999px;
  background: var(--bg-soft);
  font-size: 10.5px;
  line-height: 1.25;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
  flex-shrink: 0;
}

.stat-pill.money {
  background: var(--bg-sage-soft);
  color: var(--sage-dark);
}

.stat-pill.mood {
  background: var(--bg-accent-soft);
  color: var(--primary-hover);
}

.top-date {
  font-size: 10.5px;
  line-height: 1.25;
  font-weight: 800;
  color: var(--text-main);
  background: var(--bg-soft);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Основная область экранов */
.screens-container {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.screen {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  padding: 16px;
  display: none;
  flex-direction: column;
  gap: 14px;
  animation: fadeInScreen 0.22s ease-out;
}

.screen.active {
  display: flex;
}

.screen > * {
  flex-shrink: 0;
}

.screen::-webkit-scrollbar {
  width: 5px;
}

.screen::-webkit-scrollbar-thumb {
  background: rgba(140, 123, 115, 0.25);
  border-radius: 999px;
}

.screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.screen-title {
  font-family: var(--font-title);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-main);
}

.card-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 7px;
}

.muted-text {
  font-size: 13px;
  line-height: 1.45;
  color: var(--text-muted);
}

/* Подвкладки */
.segmented-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  background: var(--bg-soft);
  padding: 4px;
  border-radius: var(--radius-sm);
}

.seg-btn {
  border: none;
  background: transparent;
  padding: 8px 10px;
  border-radius: 8px;
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.18s ease;
}

.seg-btn.active {
  background: var(--bg-card);
  color: var(--text-main);
  box-shadow: 0 2px 8px rgba(74, 62, 57, 0.08);
}

/* Формы и кнопки */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
}

.form-input, .form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid var(--border-soft);
  border-radius: var(--radius-sm);
  background: #FFFDFB;
  font-family: var(--font-ui);
  font-size: 13.5px;
  color: var(--text-main);
  outline: none;
  transition: border-color 0.18s;
}

.form-input:focus, .form-select:focus {
  border-color: var(--primary);
}

.btn {
  border: none;
  border-radius: var(--radius-sm);
  padding: 11px 14px;
  font-family: var(--font-ui);
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: transform 0.12s, background-color 0.18s, opacity 0.18s;
}

.btn:active {
  transform: scale(0.97);
}

.btn-primary {
  background: var(--primary);
  color: #FFFFFF;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-sage {
  background: var(--sage);
  color: #FFFFFF;
}

.btn-sage:hover {
  background: var(--sage-dark);
}

.btn-soft {
  background: var(--bg-soft);
  color: var(--text-main);
}

.btn-danger {
  background: #FCE8E8;
  color: var(--danger);
}

.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.badge-ok {
  background: var(--bg-sage-soft);
  color: var(--sage-dark);
}

.badge-warn {
  background: #FEF3DC;
  color: #9D6F1D;
}

.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

/* Заглушки для экранов следующих этапов */
.placeholder-box {
  flex: 1;
  border: 2px dashed var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.55);
}

.placeholder-icon {
  font-size: 42px;
}

/* Нижняя панель навигации */
.bottom-nav {
  height: var(--nav-bar-height);
  background: rgba(255, 253, 249, 0.96);
  border-top: 1px solid var(--border-soft);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 6px 8px;
  flex-shrink: 0;
  z-index: 20;
}

.nav-btn {
  position: relative;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.18s ease;
}

.nav-badge {
  position: absolute;
  top: 4px;
  right: 18px;
  min-width: 17px;
  height: 17px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--primary);
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(200, 120, 106, 0.45);
}

.nav-btn svg {
  width: 22px;
  height: 22px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.nav-btn.active {
  color: var(--primary-hover);
  background: var(--bg-accent-soft);
}

/* Всплывающие уведомления (Toast) */
.toast-container {
  position: absolute;
  top: 76px;
  left: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;
  z-index: 50;
}

.toast {
  background: rgba(74, 62, 57, 0.93);
  color: #FFFDF9;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  animation: fadeInScreen 0.2s ease-out;
}

/* Маскировка пароля/ключа без триггера менеджера паролей Google */
.masked-input {
  -webkit-text-security: disc;
}
```

## File: css/phone.css
```css
/* Корпус виртуального смартфона внутри игры */
.phone-frame {
  background: #FFFDF9;
  border: 2.5px solid #DFD3C6;
  border-radius: 26px;
  padding: 12px;
  box-shadow: 0 10px 26px rgba(74, 62, 57, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.phone-status-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 800;
  color: var(--text-muted);
}

.phone-notch {
  width: 68px;
  height: 6px;
  border-radius: 999px;
  background: #E2D6CA;
}

/* Док-панель 5 приложений */
.phone-apps-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
}

.phone-app-btn {
  border: 1.5px solid var(--border-soft);
  background: var(--bg-soft);
  border-radius: 12px;
  padding: 7px 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-family: var(--font-ui);
  font-size: 9.5px;
  font-weight: 800;
  color: var(--text-main);
  cursor: pointer;
  position: relative;
  transition: transform 0.14s, background-color 0.16s, border-color 0.16s;
}

.phone-app-btn:active {
  transform: scale(0.95);
}

.phone-app-btn.active {
  background: var(--bg-accent-soft);
  border-color: var(--primary);
  color: var(--primary-hover);
}

.phone-app-icon {
  font-size: 18px;
}

.phone-badge-dot {
  position: absolute;
  top: 4px;
  right: 5px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--primary);
  color: #fff;
  font-size: 9.5px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* InstaFlower */
.photo-picker-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.photo-pick-item {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border-radius: 10px;
  border: 2px solid var(--border-soft);
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.photo-pick-item.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(217, 138, 124, 0.3);
}

.photo-pick-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hashtags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.hashtag-chip {
  border: 1px solid var(--border-soft);
  background: var(--bg-soft);
  color: var(--text-muted);
  border-radius: 999px;
  padding: 4px 8px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.hashtag-chip.active {
  background: var(--bg-sage-soft);
  border-color: var(--sage);
  color: var(--sage-dark);
}

.insta-post-card {
  background: #FFFFFF;
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.insta-post-header {
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 800;
}

.insta-post-img {
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  background: var(--bg-soft);
}

.insta-post-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12.5px;
}

.insta-comments-box {
  background: var(--bg-soft);
  border-radius: 10px;
  padding: 7px 9px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11.5px;
}

/* Direct & Оптовик & Декор */
.dm-card {
  background: #FFFFFF;
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.wholesale-row {
  background: #FFFFFF;
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.wholesale-deal-card {
  background: linear-gradient(135deg, #FFF5F2 0%, #FDF8EE 100%);
  border: 1.5px dashed var(--primary);
  border-radius: 14px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.decor-item-card {
  background: #FFFFFF;
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.decor-item-card .row-between {
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 6px;
}

.decor-item-card > .btn {
  flex-shrink: 0;
  white-space: nowrap;
}

.decor-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

/* Мини-переписка и отказ в Direct */
.dm-thread {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: #FAF6F0;
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  padding: 7px 8px;
}

.dm-msg {
  font-size: 12px;
  line-height: 1.38;
  padding: 5px 8px;
  border-radius: 9px;
  max-width: 92%;
}

.dm-msg.client {
  align-self: flex-start;
  background: #FFFFFF;
  border: 1px solid var(--border-soft);
  color: var(--text-main);
}

.dm-msg.player {
  align-self: flex-end;
  background: var(--bg-accent-soft);
  color: var(--text-main);
}

.dm-msg.system {
  align-self: center;
  background: var(--bg-soft);
  color: var(--text-muted);
  font-size: 11px;
  text-align: center;
}

.reject-box {
  background: #FFF7F5;
  border: 1.5px dashed #E4A89D;
  border-radius: 11px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.reject-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.reject-chip {
  border: 1px solid #E4C3BC;
  background: #FFFFFF;
  color: var(--text-main);
  border-radius: 999px;
  padding: 4px 8px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.reject-chip:hover {
  background: #FCEAE6;
  border-color: var(--primary);
}

/* Список переписок Direct (свёрнутый вид) */
.dm-list-item {
  background: #FFFFFF;
  border: 1.5px solid var(--border-soft);
  border-radius: 14px;
  padding: 10px 11px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.12s, border-color 0.16s, background-color 0.16s;
}

.dm-list-item:active {
  transform: scale(0.98);
}

.dm-list-item.unread {
  border-color: var(--primary);
  background: #FFF9F7;
}

.dm-list-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  position: relative;
}

.dm-unread-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--primary);
  border: 2px solid #FFFFFF;
}

.dm-list-preview {
  font-size: 11.5px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.dm-chat-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  background: #FFFFFF;
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 7px 9px;
}

.dm-blocked-banner {
  background: #FCE8E8;
  border: 1px solid #E5B2B2;
  color: #9A4242;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 11.5px;
  font-weight: 700;
  text-align: center;
}

/* Ветка ответов на комментарии и Промо-акции в InstaFlower */
.insta-comment-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 4px 0;
  border-bottom: 1px dashed rgba(140, 123, 115, 0.18);
}

.insta-comment-item:last-child {
  border-bottom: none;
}

.insta-comment-reply {
  margin-left: 12px;
  padding: 4px 7px;
  border-left: 2px solid var(--primary);
  background: rgba(255, 255, 255, 0.72);
  border-radius: 0 6px 6px 0;
  font-size: 11px;
}

.insta-reply-row {
  display: flex;
  gap: 5px;
  margin-top: 3px;
}

.insta-promo-box {
  background: linear-gradient(135deg, #FFF7F4 0%, #F7FAF6 100%);
  border: 1.5px solid var(--border-soft);
  border-radius: 14px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.promo-option-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 9px;
  background: #FFFFFF;
  border: 1.5px solid var(--border-soft);
  border-radius: 10px;
  font-family: var(--font-ui);
  font-size: 11.5px;
  text-align: left;
  cursor: pointer;
}

.promo-option-btn:hover {
  border-color: var(--primary);
  background: #FFF9F7;
}

.dm-order-banner {
  font-size: 11.5px;
  line-height: 1.4;
  background: var(--bg-soft);
  border: 1px solid var(--border-soft);
  padding: 7px 9px;
  border-radius: 10px;
}

.dm-order-banner.agreed {
  background: var(--bg-sage-soft);
  border-color: var(--sage);
}

.dm-order-banner.cancelled {
  background: #FFF2F0;
  border-color: #E4B2AA;
}

/* Фото в переписке Direct и мини-галерея */
.dm-msg-photo {
  display: block;
  width: 140px;
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 4px;
  border: 1px solid rgba(74, 62, 57, 0.14);
}

.dm-photo-picker-box {
  background: var(--bg-soft);
  border: 1.5px dashed var(--primary);
  border-radius: 11px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dm-attached-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FFF7F4;
  border: 1px solid #E9C5BD;
  border-radius: 10px;
  padding: 5px 8px;
  font-size: 11.5px;
}

.dm-attached-preview img {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.dm-order-actions {
  display: flex;
  gap: 6px;
}

.dm-order-actions .btn {
  flex: 1;
  padding: 8px 9px;
  font-size: 12px;
}

/* Риелтор и Антикварная лавка */
.realtor-card {
  background: #FFFFFF;
  border: 1.5px solid var(--border-soft);
  border-radius: 14px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.realtor-card.current {
  border-color: var(--sage);
  background: #F6FAF5;
}

.antique-banner {
  background: linear-gradient(135deg, #FFF6E8 0%, #F9EFE2 100%);
  border: 1.5px dashed #D8A96A;
  border-radius: 14px;
  padding: 9px 10px;
  font-size: 11.5px;
  color: #5C4736;
}
/* Этап 4: Вакансии в InstaFlower и собеседования в Direct */
.job-form-box {
  background: linear-gradient(135deg, #F6FAF5 0%, #FFF9F5 100%);
  border: 1.5px solid var(--sage);
  border-radius: 14px;
  padding: 11px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.insta-job-card {
  background: linear-gradient(135deg, #FFFDF9 0%, #F4F9F3 100%);
  border: 1.5px solid var(--sage);
  border-radius: 14px;
  padding: 11px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.insta-job-details {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  font-size: 11px;
}

.job-detail-pill {
  background: #FFFFFF;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  padding: 3px 8px;
  font-weight: 700;
  color: var(--text-main);
}

.candidate-banner {
  background: linear-gradient(135deg, #F4F9F3 0%, #FFFDF9 100%);
  border: 1.5px solid var(--sage);
  border-radius: 12px;
  padding: 8px 10px;
  font-size: 11.5px;
  line-height: 1.4;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.candidate-banner.hired {
  background: var(--bg-sage-soft);
  border-color: var(--sage-dark);
}

.candidate-banner.rejected {
  background: #FFF2F0;
  border-color: #E4B2AA;
}

.interview-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.interview-chip {
  border: 1px solid #C6D8C5;
  background: #FFFFFF;
  color: var(--text-main);
  border-radius: 999px;
  padding: 4px 8px;
  font-family: var(--font-ui);
  font-size: 10.5px;
  font-weight: 700;
  cursor: pointer;
}

.interview-chip:hover {
  background: var(--bg-sage-soft);
  border-color: var(--sage);
}
```

## File: css/shop.css
```css
/* Сцена цветочного магазина */
.shop-scene {
  position: relative;
  border-radius: var(--radius-lg);
  padding: 14px;
  overflow: hidden;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
  background: linear-gradient(180deg, #F8EFE6 0%, #EFE2D3 100%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: background 0.5s ease;
}

.shop-scene.time-evening {
  background: linear-gradient(180deg, #E8DCD2 0%, #DEC9B8 100%);
}

/* Тёплый огонёк гирлянды */
.shop-garland {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 2px 6px;
}

.garland-bulb {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #FFE599;
  box-shadow: 0 0 8px 2px rgba(255, 222, 125, 0.75);
  animation: twinkle 2.8s infinite ease-in-out;
}

.garland-bulb:nth-child(even) {
  background: #FCD5CE;
  box-shadow: 0 0 8px 2px rgba(252, 200, 190, 0.75);
  animation-delay: 1.2s;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.65; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.12); }
}

/* Окно с видом и погодой */
.shop-window-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 10px;
  align-items: stretch;
}

.shop-window {
  position: relative;
  height: 90px;
  border-radius: 14px;
  border: 4px solid #FFFDF9;
  box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(74, 62, 57, 0.08);
  overflow: hidden;
  background: linear-gradient(180deg, #BFE3F7 0%, #E7F4FA 100%);
  transition: background 0.6s ease;
}

.shop-window.time-day.weather-sunny {
  background: linear-gradient(180deg, #A9DCF7 0%, #E3F3FB 100%);
}

.shop-window.time-evening {
  background: linear-gradient(180deg, #5C6287 0%, #D99B8C 100%);
}

.shop-window.weather-rainy {
  background: linear-gradient(180deg, #8DA3B5 0%, #C6D3DC 100%);
}

.shop-window.weather-frost {
  background: linear-gradient(180deg, #CBE0EE 0%, #EEF6FA 100%);
}

/* Переплёт окна */
.window-pane-v {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 3px;
  background: rgba(255, 253, 249, 0.85);
  transform: translateX(-50%);
  z-index: 3;
}

.window-pane-h {
  position: absolute;
  left: 0;
  right: 0;
  top: 52%;
  height: 3px;
  background: rgba(255, 253, 249, 0.85);
  z-index: 3;
}

/* Силуэт домиков/кустов за окном */
.window-horizon {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 26px;
  background: #A3C19E;
  border-radius: 40% 60% 0 0 / 16px 14px 0 0;
  z-index: 1;
}

.shop-window.weather-frost .window-horizon {
  background: #E8F1F5;
}

/* Солнце / Луна */
.window-celestial {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #FFE382;
  box-shadow: 0 0 16px rgba(255, 227, 130, 0.9);
  z-index: 1;
}

.shop-window.time-evening .window-celestial {
  background: #FFF6D6;
  box-shadow: 0 0 12px rgba(255, 246, 214, 0.8);
}

.shop-window.weather-rainy .window-celestial {
  opacity: 0.25;
}

/* Частицы дождя и снега */
.weather-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

.rain-drop {
  position: absolute;
  top: -12px;
  width: 2px;
  height: 11px;
  background: rgba(255, 255, 255, 0.65);
  border-radius: 2px;
  animation: rainFall 0.9s linear infinite;
}

@keyframes rainFall {
  to { transform: translate(-8px, 125px); }
}

.snow-flake {
  position: absolute;
  top: -10px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  animation: snowFall 2.8s linear infinite;
}

@keyframes snowFall {
  to { transform: translate(10px, 125px); }
}

/* Табличка смены и настроения справа от окна */
.shop-sign-box {
  background: #FFFDF9;
  border: 1.5px solid var(--border-soft);
  border-radius: 14px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

.sign-title {
  font-family: var(--font-title);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.sign-subtitle {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-muted);
}

/* Витрина с вазами */
.vases-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.vase-slot {
  background: rgba(255, 253, 249, 0.9);
  border: 1.5px solid var(--border-soft);
  border-radius: var(--radius-md);
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
  position: relative;
}

.vase-slot:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(90, 68, 56, 0.1);
}

.vase-slot.selected {
  border-color: var(--primary);
  background: #FFF9F7;
  box-shadow: 0 0 0 2px rgba(217, 138, 124, 0.25);
}

.vase-svg-wrap {
  width: 68px;
  height: 76px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: filter 0.3s ease, transform 0.3s ease;
}

.vase-svg-wrap.wilting {
  filter: saturate(0.65) sepia(0.2);
  transform: rotate(3deg);
}

.vase-qty-pill {
  position: absolute;
  top: 6px;
  right: 6px;
  background: var(--bg-soft);
  color: var(--text-main);
  font-size: 10.5px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 999px;
}

.vase-discount-tag {
  position: absolute;
  top: 6px;
  left: 6px;
  background: #FCE8E6;
  color: var(--primary-hover);
  font-size: 10px;
  font-weight: 800;
  padding: 2px 5px;
  border-radius: 6px;
}

.vase-name {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--text-main);
  text-align: center;
  line-height: 1.2;
}

.vase-price {
  font-size: 11px;
  font-weight: 700;
  color: var(--sage-dark);
}

/* Полоска свежести */
.freshness-bar-bg {
  width: 100%;
  height: 6px;
  background: #EAE2D8;
  border-radius: 999px;
  overflow: hidden;
}

.freshness-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.fresh-high { background: #7EB582; }
.fresh-mid  { background: #E6B85C; }
.fresh-low  { background: #DC7676; }

/* Деревянная полка под вазами */
.wooden-counter {
  height: 12px;
  background: linear-gradient(180deg, #D5B89B 0%, #B89677 100%);
  border-radius: 8px;
  margin-top: -6px;
  box-shadow: 0 4px 8px rgba(74, 62, 57, 0.14);
}

/* Карточка осмотра выбранного цветка */
.flower-inspector {
  background: var(--bg-card);
  border: 1.5px solid var(--border-soft);
  border-radius: var(--radius-md);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--shadow-card);
  animation: fadeInScreen 0.18s ease-out;
}

.inspector-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.inspector-preview {
  width: 66px;
  height: 74px;
  background: var(--bg-soft);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.inspector-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.inspector-actions .btn {
  padding: 9px 8px;
  font-size: 12px;
}

/* Всплывающее модальное окошко осмотра вазы */
.vase-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(45, 35, 30, 0.52);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 95;
  animation: fadeInScreen 0.16s ease-out;
}

.vase-modal-card {
  width: 100%;
  max-width: 360px;
}

/* Декор и форс-мажор в магазине */
.shop-scene.has-wallpaper {
  background-color: #F6EAE0;
  background-image:
    radial-gradient(circle at 12px 12px, rgba(217, 138, 124, 0.2) 3px, transparent 3.5px),
    radial-gradient(circle at 0 0, rgba(137, 168, 139, 0.14) 2px, transparent 2.5px);
  background-size: 24px 24px;
}

.shop-scene.power-out {
  background: linear-gradient(180deg, #4A434B 0%, #383138 100%);
  color: #F4EDE4;
}

.shop-scene.power-out.candles-lit {
  background: linear-gradient(180deg, #574841 0%, #43352E 100%);
  box-shadow: inset 0 0 40px rgba(255, 195, 110, 0.25);
}

.shop-neon-badge {
  align-self: center;
  padding: 3px 14px;
  border-radius: 999px;
  background: #FFFDF9;
  border: 2px solid #E896A4;
  color: #C96577;
  font-family: var(--font-title);
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 0 12px rgba(232, 150, 164, 0.5);
}

.power-alert-bar {
  background: rgba(255, 244, 219, 0.96);
  border: 1.5px solid #DFAB4E;
  color: #4A3E39;
  border-radius: 12px;
  padding: 9px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
}

/* Сезоны за окном магазина и квартиры */
.window-horizon.season-winter {
  background: #F2F7FA;
}

.window-horizon.season-early-spring {
  background: linear-gradient(125deg, #F0F6FA 36%, #8EB889 40%, #99C294 55%, #EFF5F9 60%, #8EB889 82%);
}

.window-horizon.season-summer {
  background: #9CC494;
}

.window-horizon.season-autumn {
  background: linear-gradient(90deg, #D98A4E 0%, #E3A857 50%, #C96E4B 100%);
}

.autumn-leaf {
  position: absolute;
  top: -10px;
  width: 7px;
  height: 5px;
  border-radius: 50% 0 50% 0;
  background: #D97A3E;
  animation: leafFall 3.2s linear infinite;
}

.autumn-leaf:nth-child(even) {
  background: #E6AD45;
}

@keyframes leafFall {
  to { transform: translate(16px, 125px) rotate(140deg); }
}

/* Приветственное окно настройки нового магазина */
.setup-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(45, 35, 30, 0.56);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 120;
  animation: fadeInScreen 0.2s ease-out;
}

.setup-modal-card {
  width: 100%;
  max-width: 375px;
  max-height: 90vh;
  overflow-y: auto;
  background: #FFFDF9;
  border: 2px solid var(--border-soft);
  border-radius: 22px;
  padding: 18px 16px;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 11px;
}

/* Очередь предзаказов в зале */
.preorders-queue-card {
  background: rgba(255, 253, 249, 0.94);
  border: 1.5px solid #D9C3B4;
  border-radius: 14px;
  padding: 9px 11px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preorder-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: var(--bg-soft);
  border-radius: 10px;
  padding: 6px 8px;
  font-size: 12px;
}

.preorder-row.due-now {
  background: #FDF2DD;
  border: 1px solid #E5B968;
}

/* Панель отказа живому клиенту в зале */
.client-reject-panel {
  background: #FFF7F5;
  border: 1.5px dashed #E4A89D;
  border-radius: 12px;
  padding: 9px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.client-reject-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.client-reject-chip {
  border: 1px solid #E4C3BC;
  background: #FFFFFF;
  color: var(--text-main);
  border-radius: 999px;
  padding: 4px 8px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.client-reject-chip:hover {
  background: #FCEAE6;
  border-color: var(--primary);
}

/* Визуальный SVG-декор торгового зала */
.shop-arch-svg-wrap {
  width: 100%;
  margin-top: -4px;
  pointer-events: none;
  filter: drop-shadow(0 2px 3px rgba(74, 62, 57, 0.12));
}

.shop-hearts-svg-wrap {
  width: 100%;
  margin-top: -6px;
  pointer-events: none;
  filter: drop-shadow(0 2px 3px rgba(217, 138, 124, 0.25));
}

.shop-decor-stage {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 8px 4px;
  background: rgba(255, 253, 249, 0.48);
  border: 1px solid rgba(213, 195, 179, 0.55);
  border-radius: 14px;
}

.shop-wall-objects {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 8px;
}

.shop-floor-shelf-wrap {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.shop-floor-objects {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 6px;
  margin-bottom: -2px;
}

.shop-shelf-plank {
  height: 9px;
  background: linear-gradient(180deg, #D5B89B 0%, #B48F6E 100%);
  border-radius: 6px;
  box-shadow: 0 3px 6px rgba(74, 62, 57, 0.16);
}

.shop-decor-svg-item {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  filter: drop-shadow(0 3px 4px rgba(74, 62, 57, 0.14));
}

/* Витрина готовых букетов на прилавке */
.counter-bouquets-box {
  background: rgba(255, 253, 249, 0.72);
  border: 1.5px solid var(--border-soft);
  border-radius: 14px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.counter-bouquets-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 3px;
}

.counter-bouquet-card {
  position: relative;
  flex-shrink: 0;
  width: 116px;
  background: #FFFDF9;
  border: 1.5px solid var(--border-soft);
  border-radius: 12px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  text-align: center;
  transition: transform 0.14s ease, border-color 0.14s ease;
}

.counter-bouquet-card.wanted {
  border-color: var(--primary);
  background: #FFF7F4;
  box-shadow: 0 0 0 2px rgba(217, 138, 124, 0.24);
}

.counter-wanted-badge {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: #FFFDF9;
  font-size: 9px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 999px;
  white-space: nowrap;
}

.counter-bouquet-img {
  width: 74px;
  height: 74px;
  border-radius: 9px;
  object-fit: cover;
  border: 1px solid var(--border-soft);
}

.counter-bouquet-price {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--sage-dark);
}

.counter-bouquet-desc {
  width: 100%;
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.counter-bouquet-meta {
  font-size: 9.5px;
  font-weight: 700;
  color: var(--text-muted);
}

.counter-sell-btn {
  width: 100%;
  padding: 5px 6px;
  font-size: 11px;
  margin-top: 2px;
}

/* Локации торгового зала — разный дизайн интерьера и окон */
.shop-scene.loc-shop_basement {
  background:
    linear-gradient(180deg, #F5EAE0 0%, #ECDAC8 58%, #DDC5AE 58%, #CFAF93 60%, #E6D3BF 60%, #D9C0A6 100%);
  border: 2px solid #D5BC9F;
}

.shop-scene.loc-shop_basement.time-evening {
  background:
    linear-gradient(180deg, #DFD0C4 0%, #D2BCAA 58%, #C0A38A 58%, #AE8E75 60%, #C8B19D 60%, #B89C84 100%);
}

.shop-scene.loc-shop_basement .shop-window {
  height: 98px;
  border: 4px solid #8C6D56;
  border-radius: 12px;
  box-shadow: inset 0 5px 12px rgba(45, 35, 30, 0.2), 0 0 0 3px #D8BFA8;
}

.shop-scene.loc-shop_pavilion {
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.42) 0 18px, transparent 18px 36px),
    linear-gradient(180deg, #FEFCF8 0%, #EEF5ED 62%, #DCEAD9 62%, #CDE0CA 100%);
  background-size: 36px 100%, 100% 100%;
  border: 2px solid #BDD1BC;
}

.shop-scene.loc-shop_pavilion.time-evening {
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.14) 0 18px, transparent 18px 36px),
    linear-gradient(180deg, #DDE7E0 0%, #CEDCD2 62%, #B9CCB9 62%, #A6BCAA 100%);
  background-size: 36px 100%, 100% 100%;
}

.shop-scene.loc-shop_pavilion .shop-window {
  height: 114px;
  border: 4px solid #FFFFFF;
  border-radius: 18px;
  box-shadow: inset 0 3px 10px rgba(74, 62, 57, 0.09), 0 4px 12px rgba(125, 158, 127, 0.16);
}

.shop-scene.loc-shop_boutique {
  background:
    repeating-linear-gradient(0deg, rgba(196, 152, 132, 0.14) 0 13px, rgba(255, 253, 249, 0.55) 13px 15px),
    linear-gradient(180deg, #FFFBF6 0%, #F7EBDF 62%, #E8D2BE 62%, #D7B99D 100%);
  border: 2.5px solid #DFB873;
  box-shadow: inset 0 8px 0 0 #FFFDF9, inset 0 12px 0 0 rgba(223, 184, 115, 0.58), var(--shadow-card);
}

.shop-scene.loc-shop_boutique.time-evening {
  background:
    repeating-linear-gradient(0deg, rgba(160, 120, 102, 0.16) 0 13px, rgba(235, 220, 208, 0.25) 13px 15px),
    linear-gradient(180deg, #E7D7CB 0%, #D9C3B4 62%, #C5A692 62%, #B2917B 100%);
}

.shop-scene.loc-shop_boutique .shop-window {
  height: 116px;
  border: 4px solid #DFB873;
  border-radius: 30px 30px 12px 12px;
  box-shadow: inset 0 4px 12px rgba(74, 62, 57, 0.14), 0 4px 12px rgba(223, 184, 115, 0.28);
}

.window-scenery-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* Архитектурные детали интерьера локаций */
.shop-arch-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: -4px;
  pointer-events: none;
}

.shop-hanging-plants {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
}

.shop-boutique-molding {
  width: 100%;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 2px solid rgba(223, 184, 115, 0.65);
  padding-bottom: 2px;
}

/* Полка под игрушки, шарики и конфеты в Павильоне и Бутике (чистый дизайн без текста) */
.shop-accessories-shelf {
  display: flex;
  flex-direction: column;
  padding: 2px 4px 0;
}

.shop-acc-items-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  flex-wrap: nowrap;
  gap: 8px;
  padding: 0 8px;
  margin-bottom: -2px;
}

.shop-acc-visual {
  position: relative;
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  width: 34px;
  height: 34px;
  filter: drop-shadow(0 2px 3px rgba(74, 62, 57, 0.16));
}

.shop-acc-plank {
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(180deg, #E2C7A8 0%, #C49E7B 100%);
  box-shadow: 0 3px 6px rgba(74, 62, 57, 0.14);
}

.shop-scene.loc-shop_boutique .shop-acc-plank {
  background: linear-gradient(180deg, #EED296 0%, #CFA75E 100%);
}
```

## File: css/variables.css
```css
:root {
  /* Пастельная палитра (Cozy Warm Aesthetic) */
  --bg-desktop: #EFE7DC;
  --bg-app: #FAF6F0;
  --bg-card: #FFFFFF;
  --bg-soft: #F4EDE4;
  --bg-accent-soft: #FCEAE6;
  --bg-sage-soft: #E9F1E7;

  /* Текст */
  --text-main: #4A3E39;
  --text-muted: #8C7B73;
  --text-light: #B3A49C;

  /* Акценты */
  --primary: #D98A7C;
  --primary-hover: #C8786A;
  --sage: #7D9E7F;
  --sage-dark: #5F7E61;
  --gold: #DFAB4E;
  --danger: #D16868;

  /* Границы и тени */
  --border-soft: #E8DDD2;
  --shadow-card: 0 6px 20px rgba(90, 68, 56, 0.07);
  --shadow-phone: 0 24px 60px rgba(74, 62, 57, 0.22);

  /* Размеры и скругления */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --top-bar-height: 68px;
  --nav-bar-height: 70px;

  /* Шрифты */
  --font-ui: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-title: 'Playfair Display', Georgia, serif;
}
```

## File: js/ai/aiCore.js
```javascript
/**
 * js/ai/aiCore.js
 * Базовое ядро: вызовы API провайдеров, обработка ошибок и базовые утилиты
 */

import { AI_PROVIDERS, FLOWERS_CATALOG } from '../config.js';
import { aiSettings } from '../state.js';

let offlineClientRunner = null;

export function registerOfflineClientRunner(runner) {
  offlineClientRunner = runner;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickUnused(arr, prevReplies = []) {
  const fresh = arr.filter((item) => !prevReplies.some((prev) => prev === item));
  return pickRandom(fresh.length ? fresh : arr);
}

export function generateProceduralNick(excludeSet = new Set()) {
  const syl1 = ['al', 'ar', 'da', 'di', 'ka', 'ma', 'le', 'ni', 'so', 'il', 'po', 'eg', 'na', 'ki', 'vi', 'ro', 'sv', 'pa', 'ks', 'ti', 'vl', 'ta', 'de', 'ol', 'se', 'yu', 'an', 'kr'];
  const syl2 = ['ena', 'tem', 'sha', 'ma', 'tya', 'ks', 'ra', 'kita', 'fa', 'ya', 'lina', 'gor', 'stya', 'rill', 'ka', 'man', 'ta', 'vel', 'nya', 'mur', 'd', 'nya', 'nis', 'lya', 'gey', 'lia', 'ton', 'tin'];
  const end = ['_spb', '_msk', '.art', '_life', '.k', '_m', '_94', '_98', '_01', '77', '24', '.fox', '_sun', '_v', '91', '03', '.pro', ''];

  for (let i = 0; i < 30; i++) {
    const candidate = `@${pickRandom(syl1)}${pickRandom(syl2)}${pickRandom(end)}`;
    if (!excludeSet.has(candidate.toLowerCase())) {
      return candidate;
    }
  }
  return `@user_${1000 + Math.floor(Math.random() * 8999)}`;
}

export function isRudeText(text) {
  const lower = String(text || '').toLowerCase();
  const rudeWords = [
    'дурак', 'идиот', 'тупой', 'тупая', 'урод', 'сволоч', 'тварь', 'мудак',
    'дебил', 'придурок', 'пошёл', 'пошел', 'пшел', 'отвали', 'отстань',
    'заткнись', 'бесишь', 'надоел', 'достал', 'хватит спамить', 'чё надо',
    'че надо', 'пошла', 'нахуй', 'нахер', 'бляд', 'блять', 'сука', 'пизд', 'хуй', 'ебан'
  ];
  return rudeWords.some((w) => lower.includes(w));
}

export function formatMinutesAsTime(totalMinutes) {
  const safe = Math.max(0, Math.min(23 * 60 + 59, Math.round(totalMinutes || 0)));
  const hh = String(Math.floor(safe / 60)).padStart(2, '0');
  const mm = String(safe % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function resolvePlayerGender(name, savedGender = 'auto') {
  if (savedGender === 'female' || savedGender === 'male') return savedGender;
  const clean = String(name || '').trim().toLowerCase();
  if (!clean) return 'female';

  const firstWord = clean.split(/[\s-]+/)[0];
  const knownMale = new Set([
    'никита', 'илья', 'фома', 'кузьма', 'лука', 'савва', 'данила', 'гаврила',
    'миша', 'дима', 'паша', 'серёжа', 'сережа', 'вова', 'коля', 'петя', 'ваня',
    'лёша', 'леша', 'гоша', 'юра', 'толя', 'костя', 'гена', 'витя', 'рома', 'ромка',
    'тима', 'стёпа', 'степа', 'слава', 'влад', 'шамиль', 'руслан', 'марат', 'дамир',
    'тимур', 'айдар', 'камиль', 'рамиль', 'эмиль', 'наиль', 'артур', 'андрей',
    'сергей', 'алексей', 'максим', 'денис', 'игорь', 'олег', 'роман', 'иван',
    'павел', 'кирилл', 'егор', 'антон', 'владимир', 'александр', 'дмитрий', 'михаил',
    'артём', 'артем', 'данил', 'даниил', 'матвей', 'марк', 'лев'
  ]);
  const knownFemale = new Set([
    'алия', 'алиюш', 'алиюша', 'алиюшка', 'аличка', 'альбина', 'гузель', 'алсу',
    'айгуль', 'ляйсан', 'адель', 'нинель', 'любовь', 'камилла', 'зарина', 'карина',
    'динара', 'индира'
  ]);

  if (knownFemale.has(firstWord)) return 'female';
  if (knownMale.has(firstWord)) return 'male';

  if (/(?:уш|юш|уша|юша|ечка|очка|енька|онька|ушка|юшка|а|я)$/i.test(firstWord)) {
    return 'female';
  }
  return 'male';
}

export function getBadgeRuleText(badgeName, playerGender) {
  if (playerGender === 'female') {
    return `Пол продавца «${badgeName}»: ЖЕНСКИЙ (девушка/женщина). Говори о ней и обращайся СТРОГО В ЖЕНСКОМ РОДЕ (например: «подсказала», «собрала», «такая внимательная», «молодец», «настоящая волшебница»). КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО обращаться к ней в мужском роде («ты такой молодец», «помог», «сделал»).`;
  }
  return `Пол продавца «${badgeName}»: МУЖСКОЙ (парень/мужчина). Говори о нём и обращайся СТРОГО В МУЖСКОМ РОДЕ (например: «подсказал», «собрал», «такой внимательный», «молодец», «настоящий мастер»). КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО обращаться в женском роде.`;
}

export function detectMentionedFlowers(text) {
  const lower = String(text || '').toLowerCase();
  const matchedIds = new Set();

  if (lower.includes('роз')) {
    if (lower.includes('красн') || lower.includes('ал') || lower.includes('борд')) matchedIds.add('rose_red');
    if (lower.includes('бел')) matchedIds.add('rose_white');
    if (lower.includes('розов') || lower.includes('пудр')) matchedIds.add('rose_pink');
    if (!lower.includes('красн') && !lower.includes('бел') && !lower.includes('розов') && !lower.includes('ал') && !lower.includes('борд') && !lower.includes('пудр')) {
      matchedIds.add('rose_red');
      matchedIds.add('rose_white');
      matchedIds.add('rose_pink');
    }
  }

  if (lower.includes('пион')) {
    if (lower.includes('корал')) matchedIds.add('peony_coral');
    if (lower.includes('розов')) matchedIds.add('peony_pink');
    if (!lower.includes('корал') && !lower.includes('розов')) {
      matchedIds.add('peony_pink');
      matchedIds.add('peony_coral');
    }
  }

  if (lower.includes('тюльпан') || lower.includes('тюльп')) {
    if (lower.includes('жёлт') || lower.includes('желт')) matchedIds.add('tulip_yellow');
    if (lower.includes('красн')) matchedIds.add('tulip_red');
    if (lower.includes('сирен') || lower.includes('фиолет') || lower.includes('сир')) matchedIds.add('tulip_purple');
    if (!lower.includes('жёлт') && !lower.includes('желт') && !lower.includes('красн') && !lower.includes('сирен') && !lower.includes('фиолет') && !lower.includes('сир')) {
      matchedIds.add('tulip_yellow');
      matchedIds.add('tulip_red');
      matchedIds.add('tulip_purple');
    }
  }

  if (lower.includes('гортенз')) matchedIds.add('hydrangea_blue');
  if (lower.includes('подсолнух')) matchedIds.add('sunflower');
  if (lower.includes('ромаш')) matchedIds.add('chamomile_white');
  if (lower.includes('лаванд')) matchedIds.add('lavender_purple');
  if (lower.includes('лили')) matchedIds.add('lily_white');
  if (lower.includes('ирис')) matchedIds.add('iris_blue');
  if (lower.includes('хризантем')) matchedIds.add('chrysanthemum_white');
  if (lower.includes('гвоздик')) matchedIds.add('carnation_red');
  if (lower.includes('гипсофил')) matchedIds.add('gypsophila');
  if (lower.includes('эвкалипт') || lower.includes('зелен')) matchedIds.add('eucalyptus');

  return Array.from(matchedIds);
}

export function stripCodeFences(str) {
  return String(str || '')
    .replace(new RegExp('\x60\x60\x60json', 'gi'), '')
    .replace(new RegExp('\x60\x60\x60', 'g'), '')
    .trim();
}

export function parseClientJson(rawText) {
  let cleaned = stripCodeFences(rawText);

  if (!cleaned) {
    throw new Error('ИИ вернул пустой ответ. Попробуй ещё раз или переключи провайдера.');
  }

  // 1. Попытка стандартного честного парсинга
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      const parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
      const allowedStatuses = ['talking', 'bought', 'left'];
      return {
        reply: String(parsed.reply || 'Хм, дайте подумать...').trim(),
        moodChange: Math.max(-20, Math.min(20, Number(parsed.moodChange) || 0)),
        dealStatus: allowedStatuses.includes(parsed.dealStatus) ? parsed.dealStatus : 'talking'
      };
    } catch (err) {
      // Если упало из-за внутренних кавычек, пробуем починить
    }
  }

  // 2. Умное извлечение reply, даже если внутри были кавычки или ответ оборвался
  const replyMatch = cleaned.match(/"reply"\s*:\s*"([\s\S]*?)(?:",\s*"moodChange"|",\s*"dealStatus"|"$|"\s*})/);
  if (replyMatch && replyMatch[1]) {
    let cleanReply = replyMatch[1].replace(/\\"/g, '"').replace(/\\n/g, ' ').trim();
    return {
      reply: cleanReply,
      moodChange: 0,
      dealStatus: 'talking'
    };
  }

  // 3. Если JSON совсем сломался — отдаём текст напрямую без мусора
  const plainText = cleaned.replace(/[{}\"]/g, '').replace(/reply:|moodChange:|dealStatus:/gi, '').trim();
  return {
    reply: plainText || cleaned,
    moodChange: 0,
    dealStatus: 'talking'
  };
}

export function formatApiError(status, rawMsg) {
  const raw = String(rawMsg || '');
  const lower = raw.toLowerCase();

  if (
    status === 401 ||
    status === 403 ||
    lower.includes('api key not valid') ||
    lower.includes('invalid api key') ||
    lower.includes('incorrect api key') ||
    lower.includes('unauthorized') ||
    lower.includes('authentication')
  ) {
    return 'Неверный или отклонённый API-ключ. Проверь ключ в «Касса и ИИ» → «Настройки и ИИ».';
  }

  const isDailyOrQuota =
    lower.includes('daily') ||
    lower.includes('per day') ||
    lower.includes('rpd') ||
    lower.includes('tpd') ||
    lower.includes('insufficient_quota') ||
    lower.includes('exceeded your current quota') ||
    lower.includes('resource_exhausted') ||
    lower.includes('insufficient') ||
    lower.includes('credits') ||
    lower.includes('balance') ||
    lower.includes('billing') ||
    lower.includes('limit: 0') ||
    (lower.includes('quota') && !lower.includes('per minute'));

  if (isDailyOrQuota) {
    return 'Дневной лимит или бесплатная квота у этого ИИ исчерпаны! Переключи модель/провайдера в «Касса и ИИ» или нажми «⚡ Включить встроенного бота».';
  }

  const isMinuteRateLimit =
    status === 429 ||
    lower.includes('rate limit') ||
    lower.includes('too many requests') ||
    lower.includes('per minute') ||
    lower.includes('rpm') ||
    lower.includes('tpm') ||
    lower.includes('try again in') ||
    lower.includes('retry in');

  if (isMinuteRateLimit) {
    const secMatch = raw.match(/(\d+)\s*(?:s|sec|second|секунд)/i);
    const waitHint = secMatch ? ` Подожди примерно ${secMatch[1]} сек. и нажми «Повторить»` : ' Подожди 15–30 сек. и нажми «Повторить»';
    return `Слишком много запросов в минуту (ошибка 429).${waitHint}, либо переключись на «⚡ Встроенный ИИ-движок».`;
  }

  if (status === 404 || (lower.includes('model') && (lower.includes('not found') || lower.includes('does not exist') || lower.includes('deprecated')))) {
    return `Модель не найдена или устарела (${raw || status}). Проверь название модели в «Касса и ИИ» → «Настройки и ИИ».`;
  }

  if (status >= 500) {
    return `Сервер этого ИИ временно перегружен (${status}). Попробуй нажать «Повторить» или переключись на встроенного бота.`;
  }

  return raw || `Ошибка сервера ИИ (${status})`;
}

export async function fetchWithTimeout(url, options, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Сервер не ответил за 12 сек. Попробуй снова или переключись на Встроенный режим.');
    }
    throw new Error('Нет связи с сервером (Failed to fetch). Проверь интернет/VPN или выбери Встроенный режим.');
  } finally {
    clearTimeout(timer);
  }
}

export async function callAI(messages) {
  const providerId = aiSettings.provider || 'offline';
  const providerMeta = AI_PROVIDERS[providerId] || AI_PROVIDERS.offline;
  const apiKey = String(aiSettings.apiKey || '').replace(/\s+/g, '');
  const model = String(aiSettings.model || providerMeta.defaultModel || '').trim();
  const baseUrl = String(aiSettings.baseUrl || providerMeta.defaultBaseUrl || '').trim().replace(/\/+$/, '');

  if (providerId === 'offline') {
    await sleep(240);
    if (offlineClientRunner) {
      return offlineClientRunner(messages);
    }
    return 'Работаю мгновенно!';
  }

  if (providerId === 'puter') {
    if (typeof window.puter === 'undefined' || !window.puter.ai) {
      throw new Error('Puter.js не загружен. Выбери другой режим в «Касса и ИИ».');
    }
    try {
      const response = await window.puter.ai.chat(messages, { model: model || 'gpt-4o-mini' });
      if (typeof response === 'string') return response;
      return response?.message?.content || response?.text || '';
    } catch (err) {
      throw new Error(formatApiError(err?.status || 429, err?.message || String(err)));
    }
  }

  if (!apiKey) {
    throw new Error('Не указан API-ключ. Зайди в «Касса и ИИ» → «Настройки и ИИ» и вставь ключ.');
  }

  if (providerId === 'gemini') {
    const systemMsg = messages.find((m) => m.role === 'system')?.content || '';
    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    const url = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: systemMsg ? { parts: [{ text: systemMsg }] } : undefined,
        contents
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(formatApiError(res.status, data?.error?.message));
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  if (providerId === 'claude') {
    const systemMsg = messages.find((m) => m.role === 'system')?.content || '';
    const chatMsgs = messages.filter((m) => m.role !== 'system');
    const res = await fetchWithTimeout(`${baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model,
        max_tokens: 900,
        system: systemMsg,
        messages: chatMsgs
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(formatApiError(res.status, data?.error?.message));
    return data?.content?.[0]?.text || '';
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  if (providerId === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'Fleur Atelier';
  }

  const res = await fetchWithTimeout(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.9,
      max_tokens: 1200
    })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(formatApiError(res.status, data?.error?.message));
  }

  return data?.choices?.[0]?.message?.content || '';
}

export async function testAiConnection() {
  const key = String(aiSettings.apiKey || '').replace(/\s+/g, '');
  const info = `[провайдер: ${aiSettings.provider}, модель: ${aiSettings.model}, длина ключа: ${key.length}]`;
  try {
    const reply = await callAI([
      { role: 'user', content: 'Ответь одним словом на русском: Работаю!' }
    ]);
    if (!reply.trim()) {
      throw new Error(`Пустой ответ. ${info}`);
    }
    return reply;
  } catch (err) {
    throw new Error(`${err.message} | ${info}`);
  }
}
```

## File: js/ai/clientGenerator.js
```javascript
/**
 * js/ai/clientGenerator.js
 * Генерация случайных клиентов, предзаказов и сборка системного промпта для ИИ
 */

import {
  FLOWERS_CATALOG,
  ACCESSORIES_CATALOG,
  getGameDateObj,
  getSeasonInfo,
  getHolidayForDate
} from '../config.js';
import { gameState } from '../state.js';
import {
  pickRandom,
  resolvePlayerGender,
  getBadgeRuleText,
  detectMentionedFlowers
} from './aiCore.js';
import {
  SKINS,
  YOUNG_HAIR,
  SENIOR_HAIR,
  SHIRT_COLORS,
  BG_TINTS,
  SEASONAL_PREFERENCES,
  generateProceduralClientName,
  generateProceduralOccasion,
  generateProceduralPreference,
  generateProceduralQuirk,
  generateProceduralPersonality
} from './clientTemplates.js';

export function generateRandomClient() {
  const gender = Math.random() < 0.56 ? 'female' : 'male';
  const name = generateProceduralClientName(gender);
  const isSeniorName = name.includes(' ');
  const age = isSeniorName ? 54 + Math.floor(Math.random() * 15) : 20 + Math.floor(Math.random() * 24);

  const personality = generateProceduralPersonality(gender);
  const quirk = generateProceduralQuirk();

  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const season = getSeasonInfo(curDate);
  const holiday = getHolidayForDate(curDate);
  const hasPromoToday = gameState.activePromo && gameState.activePromo.day === gameState.day;

  const bouquetPosts = (gameState.instaPosts || []).filter(
    (p) => !p.isJobPost && (p.type === 'bouquet' || (Array.isArray(p.items) && p.items.length > 0))
  );
  const viralPosts = (gameState.instaPosts || []).filter(
    (p) =>
      !p.isJobPost &&
      (String(p.verdict || '').includes('тренд') ||
        String(p.verdict || '').includes('рекомендац') ||
        (p.likes || 0) >= 25)
  );

  const postChance = hasPromoToday ? 0.42 : 0.27;
  let inspiredByPost = null;
  if (bouquetPosts.length > 0 && Math.random() < postChance) {
    const post = pickRandom(bouquetPosts.slice(0, 6));
    inspiredByPost = {
      id: post.id,
      photoUrl: post.photoUrl,
      description: post.detailsText || post.caption || 'Авторский букет из ленты',
      items: Array.isArray(post.items) ? post.items : detectMentionedFlowers(post.detailsText || ''),
      targetPrice: Number(post.targetPrice) || 0,
      caption: post.caption || ''
    };
  }

  const isViralClient =
    !inspiredByPost &&
    (viralPosts.length > 0 || hasPromoToday) &&
    Math.random() < (hasPromoToday ? 0.45 : 0.3);

  let occasion = generateProceduralOccasion(gender, holiday, season);
  if (inspiredByPost) {
    occasion = 'увидел(а) ваш пост в InstaFlower и хочет такой же букет'.replace(
      'увидел(а)',
      gender === 'female' ? 'увидела' : 'увидел'
    );
  } else if (isViralClient) {
    occasion = holiday
      ? `сезонный виральный заказ к празднику (${holiday.name})`
      : `сезонный тренд из соцсетей (${season.label})`;
  }

  let preference = generateProceduralPreference();
  if (inspiredByPost) {
    preference = `хочет точно такой же букет, как в вашем посте: ${inspiredByPost.description}`;
  } else if (isViralClient) {
    preference = `хочет трендовый сезонный букет (${season.label})`;
  }

  let baseBudget = 600 + Math.floor(Math.random() * 2000);
  if (inspiredByPost && inspiredByPost.targetPrice > 0) {
    baseBudget = Math.max(baseBudget, Math.round(inspiredByPost.targetPrice * 1.25));
  }
  if (isViralClient) baseBudget = Math.round(baseBudget * 1.25);
  if (holiday) baseBudget = Math.round(baseBudget * 1.35);

  const hairOptions = gender === 'female' ? ['long', 'bob', 'bun'] : ['short', 'quiff', 'buzz'];
  const hairColor = age >= 52 ? pickRandom(SENIOR_HAIR) : pickRandom(YOUNG_HAIR);
  const badgeName = String(gameState.playerBadgeName || '').trim();

  return {
    id: 'client_' + Date.now(),
    name,
    age,
    gender,
    personality,
    quirk,
    occasion,
    budget: Math.round(baseBudget / 50) * 50,
    preference,
    mood: inspiredByPost || isViralClient ? 75 : 65,
    status: 'talking',
    noticedBadge: Boolean(badgeName) && Math.random() < 0.42,
    inspiredByPost,
    isViralClient,
    appearance: {
      gender,
      age,
      skin: pickRandom(SKINS),
      hairStyle: pickRandom(hairOptions),
      hairColor,
      shirtColor: pickRandom(SHIRT_COLORS),
      hasGlasses: age >= 50 ? Math.random() < 0.65 : Math.random() < 0.25,
      hasBeard: gender === 'male' && (age >= 32 ? Math.random() < 0.45 : Math.random() < 0.15),
      bgTint: pickRandom(BG_TINTS)
    },
    history: [],
    chatLog: []
  };
}

export function generatePreorderClient(preorder) {
  const nick = String(preorder.senderName || '').toLowerCase();
  const seemsMale =
    nick.includes('artem') ||
    nick.includes('mikhail') ||
    nick.includes('oleg') ||
    nick.includes('roman') ||
    nick.includes('denis') ||
    nick.includes('dima') ||
    nick.includes('maxim') ||
    nick.includes('igor') ||
    nick.includes('nikita') ||
    nick.includes('ivan') ||
    nick.includes('sergey') ||
    nick.includes('pavel');
  const gender = seemsMale ? 'male' : 'female';
  const name = generateProceduralClientName(gender);
  const age = 22 + Math.floor(Math.random() * 16);
  const hairOptions = gender === 'female' ? ['long', 'bob', 'bun'] : ['short', 'quiff', 'buzz'];
  const flowerMeta = FLOWERS_CATALOG[preorder.typeId];
  const flowerName = preorder.flowerName || flowerMeta?.name || 'цветы';
  const badgeName = String(gameState.playerBadgeName || '').trim();

  return {
    id: 'client_pre_' + Date.now(),
    name: `${name} (${preorder.senderName})`,
    age,
    gender,
    personality: gender === 'female' ? 'аккуратная и пунктуальная натура' : 'пунктуальный и ответственный человек',
    quirk: 'целеустремлённый человек, пришёл ровно к оговорённому времени',
    occasion: `предзаказ из Direct на ${preorder.dueTimeLabel}`,
    budget: Math.round(preorder.reward * 1.25),
    preference: `заказывал(а) ${preorder.qty} шт. «${flowerName}» к ${preorder.dueTimeLabel}`,
    mood: 80,
    status: 'talking',
    noticedBadge: Boolean(badgeName) && Math.random() < 0.45,
    preorder: { ...preorder, flowerName },
    appearance: {
      gender,
      age,
      skin: pickRandom(SKINS),
      hairStyle: pickRandom(hairOptions),
      hairColor: pickRandom(YOUNG_HAIR),
      shirtColor: pickRandom(SHIRT_COLORS),
      hasGlasses: Math.random() < 0.25,
      hasBeard: gender === 'male' && Math.random() < 0.25,
      bgTint: pickRandom(BG_TINTS)
    },
    history: [],
    chatLog: []
  };
}

function getHumanFreshnessWord(freshness) {
  if (freshness >= 70) return 'свежие и крепкие';
  if (freshness >= 40) return 'обычные';
  return 'сильно подвявшие, поникшие';
}

export function buildClientSystemPrompt(client) {
  const genderRule =
    client.gender === 'female'
      ? 'Женщина (говори строго в ЖЕНСКОМ роде: пришла, искала, купила, рада)'
      : 'Мужчина (говори строго в МУЖСКОМ роде: пришёл, искал, купил, рад)';

  const vasesText = gameState.inventory.length
    ? gameState.inventory
        .map((item) => {
          const meta = FLOWERS_CATALOG[item.typeId];
          if (!meta) return '';
          const price = item.discounted ? Math.round(meta.price * 0.6) : meta.price;
          return `- ${meta.name} (${item.qty} шт., ${price} ₽/шт., состояние: ${getHumanFreshnessWord(item.freshness)}${item.discounted ? ', УЦЕНКА' : ''})`;
        })
        .filter(Boolean)
        .join('\n')
    : 'Сейчас вазы пустые.';

  const bouquetsText = gameState.readyBouquets.length
    ? gameState.readyBouquets
        .map((b, idx) => {
          const minFresh = Array.isArray(b.stems) && b.stems.length
            ? Math.min(...b.stems.map((s) => s.freshness ?? 85))
            : 85;
          const freshWord = getHumanFreshnessWord(minFresh);
          return `${idx + 1}. Готовый букет [id=${b.id}]: ${b.summary} (${b.stemsCount || b.items?.length || 1} шт., цветы: ${freshWord}) — цена ${b.price} ₽`;
        })
        .join('\n')
    : 'Готовых букетов на витрине пока нет.';

  const accessoriesText = (gameState.accessoriesInventory || []).some((a) => a.qty > 0)
    ? (gameState.accessoriesInventory || [])
        .filter((a) => a.qty > 0)
        .map((a) => {
          const meta = ACCESSORIES_CATALOG[a.id];
          return meta ? `- ${meta.name} (${a.qty} шт., ${meta.price} ₽)` : '';
        })
        .filter(Boolean)
        .join('\n')
    : 'Сопутствующих товаров (шариков, игрушек, конфет) сейчас нет.';

  const preorderSection = client.preorder
    ? `\nОСОБЫЙ СТАТУС — ЭТО ПРЕДЗАКАЗ ИЗ DIRECT:
- ПРЕДЗАКАЗ: typeId=${client.preorder.typeId} flowerName="${client.preorder.flowerName}" qty=${client.preorder.qty} reward=${client.preorder.reward} due="${client.preorder.dueTimeLabel}"
- Ты заранее заказал(а) в Direct ${client.preorder.qty} шт. «${client.preorder.flowerName}» к ${client.preorder.dueTimeLabel} за ${client.preorder.reward} ₽.${client.preorder.accessoryName ? `\n- Ты также хотел(а) добавить к заказу: ${client.preorder.accessoryName}.` : ''}
- Оценивай полученный букет АДЕКВАТНО и дружелюбно: не придирайся к добавленной зелени/гипсофиле/упаковке, если есть заказанные цветы! Если нужные цветы свежие и количество совпадает или больше — смело покупай ("dealStatus": "bought", "moodChange": 18).`
    : '';

  const postSection = client.inspiredByPost
    ? `\nКЛИЕНТ ПО ПОСТУ ИЗ INSTAFLOWER:
- ПОСТ_БУКЕТ: items=${(client.inspiredByPost.items || []).join(',')} desc="${client.inspiredByPost.description}" targetPrice=${client.inspiredByPost.targetPrice || 0}
- Ты увидел(а) этот букет в соцсети InstaFlower и хочешь точно такой же (или максимально близкий по основным цветам).`
    : '';

  const badgeName = String(gameState.playerBadgeName || '').trim();
  let badgeSection = '';
  if (badgeName && client.noticedBadge) {
    const playerGender = resolvePlayerGender(badgeName, gameState.playerGender);
    const ruleText = getBadgeRuleText(badgeName, playerGender);
    const alreadyCalledByName = (client.chatLog || []).some(
      (m) => m.sender === 'client' && m.text.toLowerCase().includes(badgeName.toLowerCase())
    );
    badgeSection = alreadyCalledByName
      ? `\n- ИМЯ И ПОЛ ФЛОРИСТА: ${ruleText} Ты уже называл(а) имя раньше, повторять его каждый раз не нужно.`
      : `\n- БЕЙДЖИК ФЛОРИСТА: На груди у продавца бейджик с именем «${badgeName}». ${ruleText} Обратись к продавцу по имени «${badgeName}» 1 раз естественно (в приветствии, уточнении или благодарности), не части с именем.`;
  }

  return `Ты отыгрываешь роль ЖИВОГО, АБСОЛЮТНО УНИКАЛЬНОГО покупателя в цветочном магазине "${gameState.shopName || 'Fleur Atelier'}".
ВАЖНО: Избегай любых заученных штампов и роботоподобных фраз. НИКОГДА не говори про «кнопки», «нажмите кнопку», «интерфейс». Ты живой человек с собственной историей, эмоциями и полной свободой общения — можешь шутить, делиться мыслями, спорить, сомневаться, флиртовать или уйти при откровенном хамстве.
ТВОИ ПАРАМЕТРЫ:
- Особенность характера: ${client.quirk || 'живой и искренний человек'}.
- Имя и возраст: ${client.name}, ${client.age} лет.
- ПОЛ И РОД РЕЧИ: ${genderRule}. Никогда не путай свой род!
- Характер: ${client.personality}.
- Повод покупки: ${client.occasion}.
- Максимальный бюджет: ${client.budget} ₽ (можешь торговаться, но не покупай то, что дороже бюджета больше чем на 10%).
- Пожелание/вкус: ${client.preference}.
- Текущее настроение: ${client.mood} из 100.${badgeSection}${preorderSection}${postSection}

АССОРТИМЕНТ МАГАЗИНА:
${vasesText}
${bouquetsText}
СОПУТСТВУЮЩИЕ ТОВАРЫ В НАЛИЧИИ:
${accessoriesText}

ПРАВИЛА:
1. Пиши строго на русском, живо, коротко (1–3 предложения). Никогда не называй проценты свежести цифрами.
2. Намекай на повод, бюджет или вкус естественно.
3. На "[Предложение продавца]":
   - Оцени свежесть (возмущайся ТОЛЬКО если указано, что цветы подвявшие/вялые), соответствие вкусу/поводу и цену относительно бюджета ${client.budget} ₽.
   - Подходит — соглашайся ("dealStatus": "bought", "moodChange": 15). ВАЖНО: если ставишь "bought", ты УЖЕ оплатил и забрал покупку — только поблагодари и попрощайся.
   - Дорого или не тот цветок — торгуйся или проси замену ("dealStatus": "talking", "moodChange": -5).
   - Грубость или игнорирование запрета — уходи ("dealStatus": "left", "moodChange": -20).
4. На "[Отказ продавца]":
   - Покажи в ответе, что понял(а) названную причину.
   - Если причина серьёзная или это повторный отказ — попрощайся и уйди ("dealStatus": "left", "moodChange": -10).
   - Если отказ первый и причина — нехватка цветка или бюджет, иногда можешь попытаться 1 раз предложить замену или поднять бюджет ("dealStatus": "talking", "moodChange": -4).
5. ГОТОВЫЕ БУКЕТЫ НА ВИТРИНЕ: Если в магазине есть готовый букет, который свежий, подходит по цветам/поводу и укладывается в бюджет ${client.budget} ₽, можешь прямо при приветствии или в разговоре спросить про него (например: «Ой, а что это за букетик за 1200 ₽ у вас стоит? Можно мне его?»).
6. СОПУТСТВУЮЩИЕ ТОВАРЫ: Если повод праздничный/романтический/день рождения/выписка (не траур!) и в наличии есть шарики, мягкие игрушки, конфеты или открытки в пределах бюджета ${client.budget} ₽, можешь попросить добавить подарок к цветам.

ОТВЕЧАЙ СТРОГО ОДНИМ ВАЛИДНЫМ JSON БЕЗ MARKDOWN:
{"reply": "твоя реплика", "moodChange": 0, "dealStatus": "talking"}`;
}
```

## File: js/ai/clientTemplates.js
```javascript
/**
 * js/ai/clientTemplates.js
 * Процедурные генераторы параметров, имён, поводов и характеров клиентов
 */

import { FLOWERS_CATALOG } from '../config.js';
import { pickRandom } from './aiCore.js';

export const SKINS = ['#FCE0D2', '#F5CBAF', '#E6B394'];
export const YOUNG_HAIR = ['#4E392E', '#7A543E', '#C98A5B', '#E3C07B', '#2F2928'];
export const SENIOR_HAIR = ['#B8B2AD', '#C9C3BE', '#8A847F'];
export const SHIRT_COLORS = ['#D98A7C', '#89A88B', '#8EA8C3', '#D4A5B8', '#DFB66B', '#9D8EB8'];
export const BG_TINTS = ['#F7EAE4', '#E9F0E8', '#E9EEF4', '#F5EBF2'];

export const SEASONAL_PREFERENCES = {
  winter: 'хочет зимний атмосферный букет: красные или белые розы, гвоздики, хризантемы и эвкалипт',
  'early-spring': 'ищет свежий весенний букет из тюльпанов, синих ирисов и лаванды',
  summer: 'хочет яркий летний хит из пионов, подсолнухов, ромашек или гортензии',
  autumn: 'хочет уютный осенний букет из подсолнухов, белых хризантем, коралловых пионов и эвкалипта'
};

export function generateProceduralClientName(gender) {
  const femaleFirst = ['Алис', 'Мар', 'Елен', 'Соф', 'Дар', 'Анн', 'Валер', 'Ксен', 'Полин', 'Ольг', 'Карин', 'Динар', 'Алин', 'Ян', 'Виктори', 'Ульян', 'Милан', 'Арин', 'Кир', 'Злат'];
  const femaleEnd = ['а', 'ия', 'ена', 'ушка', 'ечка', 'очка', 'яна'];
  const maleFirst = ['Артём', 'Дмитрий', 'Максим', 'Игорь', 'Никита', 'Михаил', 'Кирилл', 'Роман', 'Александр', 'Тимур', 'Артур', 'Марк', 'Денис', 'Павел', 'Егор', 'Глеб', 'Влад', 'Руслан', 'Савва', 'Лев'];
  const seniorLasts = ['Петрович', 'Сергеевич', 'Иванович', 'Андреевич', 'Михайлович', 'Николаевич'];

  if (gender === 'female') {
    return `${pickRandom(femaleFirst)}${pickRandom(femaleEnd)}`;
  }
  const name = pickRandom(maleFirst);
  if (Math.random() < 0.22) {
    return `${name} ${pickRandom(seniorLasts)}`;
  }
  return name;
}

export function generateProceduralOccasion(gender, holiday, season) {
  const recipients = gender === 'female'
    ? ['маме', 'подруге', 'сестре', 'бабушке', 'любимому преподавателю', 'коллеге', 'дочке']
    : ['девушке', 'жене', 'маме', 'бабушке', 'коллеге', 'лучшему другу'];
  
  const events = [
    'на день рождения',
    'на годовщину отношений',
    'в знак примирения после ссоры',
    'просто чтобы поднять настроение без повода',
    'на новоселье',
    'на выписку из роддома',
    'на первое свидание',
    'для уютного домашнего вечера',
    'в знак искренней благодарности'
  ];

  if (holiday && Math.random() < 0.6) {
    return `подарок к празднику (${holiday.name})`;
  }
  return `подарок для ${pickRandom(recipients)} (${pickRandom(events)}, сезон: ${season.label})`;
}

export function generateProceduralPreference() {
  const flowers = Object.values(FLOWERS_CATALOG);
  const f1 = pickRandom(flowers);
  let f2 = pickRandom(flowers);
  while (f2.id === f1.id) f2 = pickRandom(flowers);

  const styles = [
    `хочет нежный монобукет из свежих ${f1.name.toLowerCase()}`,
    `ищет стильный сборный микс из ${f1.name.toLowerCase()} и ${f2.name.toLowerCase()}`,
    `просит собрать воздушную композицию с акцентом на ${f1.name.toLowerCase()} в красивой упаковке`,
    `хочет яркий авторский букет, где главные цветы — ${f2.name.toLowerCase()}`
  ];
  return pickRandom(styles);
}

export function generateProceduralQuirk() {
  const quirks = [
    'говорит живо и с лёгкой иронией, любит подшучивать',
    'немного застенчивый, смущается и делает искренние комплименты',
    'прямолинейный и резковатый, ценит честность без лишней воды',
    'болтливый мечтатель, легко уходит в личные истории',
    'кокетливый и обаятельный, может пофлиртовать или пригласить на кофе при тёплом общении',
    'спокойный философ, рассуждает о жизни и настроении',
    'импульсивный, решает на эмоциях и любит неожиданные сочетания'
  ];
  return pickRandom(quirks);
}

export function generateProceduralPersonality(gender) {
  const traits = [
    { female: 'вежливая и нежная романтичная натура', male: 'вежливый и немного застенчивый романтик' },
    { female: 'вечно спешащая деловая леди, ценит лаконичность', male: 'вечно спешащий деловой человек, ценит лаконичность' },
    { female: 'ворчливая, но в душе добрая эстетка, любит поторговаться', male: 'ворчливый, но в душе добрый эстет, любит поторговаться' },
    { female: 'очень эмоциональная и душевная натура, обожает уют', male: 'очень душевный и чуткий собеседник, обожает уют' },
    { female: 'требовательная ценительница стиля с хорошим вкусом', male: 'требовательный ценитель стиля с хорошим вкусом' },
    { female: 'приветливый человек с ограниченным бюджетом, ищет душевный вариант', male: 'приветливый студент с ограниченным бюджетом, ищет душевный вариант' }
  ];
  const obj = pickRandom(traits);
  return gender === 'female' ? obj.female : obj.male;
}
```

## File: js/ai/jobsAi.js
```javascript
/**
 * js/ai/jobsAi.js
 * Кандидаты на работу, анкеты соискателей и собеседования в Direct
 */

import { gameState, aiSettings } from '../state.js';
import {
  callAI,
  stripCodeFences,
  sleep,
  pickRandom,
  generateProceduralNick,
  isRudeText,
  formatMinutesAsTime
} from './aiCore.js';

export const CANDIDATE_PROFILES = [
  {
    id: 'cand_lera',
    name: 'Лера',
    nick: '@lera_sketch',
    age: 20,
    gender: 'female',
    roleId: 'assistant',
    bio: 'Студентка художественного вуза, обожает пионы, нежную упаковку и творческий уют.',
    quirk: 'дружелюбная, немного волнуется, любит пастель, готова чуть уступить по ставке ради хорошего коллектива',
    salaryOffset: -50,
    minDiscount: 200,
    hasCar: false,
    opener: 'Здравствуйте! Увидела ваше объявление в ленте — я учусь на дизайнера и просто обожаю собирать нежные букеты! Очень хочу поработать у вас, подскажете про график и условия?'
  },
  {
    id: 'cand_maks',
    name: 'Макс',
    nick: '@max_atelier_pro',
    age: 27,
    gender: 'male',
    roleId: 'assistant',
    bio: 'Капризный флорист-эстет с опытом работы в дорогом салоне, мастер сложной спирали.',
    quirk: 'перфекционист, знает себе цену, любит спорить про стиль, но собирает шикарные букеты',
    salaryOffset: 300,
    minDiscount: 150,
    hasCar: false,
    opener: 'Добрый день. Откликнулся на вакансию флориста — два года работал в премиум-салоне, собираю идеальную спираль с закрытыми глазами. Но сразу честно скажу: ценю свой вкус и ниже достойной ставки не пойду. Пообщаемся?'
  },
  {
    id: 'cand_arina',
    name: 'Арина',
    nick: '@arina_quiet',
    age: 29,
    gender: 'female',
    roleId: 'assistant',
    bio: 'Спокойная и аккуратная флористка, следит за свежестью ваз как за собственным садом.',
    quirk: 'спокойная, надёжная, ценит порядок и стабильность, без лишних капризов',
    salaryOffset: 100,
    minDiscount: 150,
    hasCar: false,
    opener: 'Здравствуйте! Увидела вашу вакансию и решила написать. У меня уже есть опыт ухода за срезкой и сборки классических букетов, люблю тихую уютную атмосферу. Расскажите подробнее о сменах?'
  },
  {
    id: 'cand_sasha',
    name: 'Дядя Саша',
    nick: '@sasha_na_larguse',
    age: 53,
    gender: 'male',
    roleId: 'courier',
    bio: 'Опытный водитель на личном универсале, знает все дворы города и вежливо вручает букеты.',
    quirk: 'добродушный мужик с тёплым юмором, пунктуальный, переживает за бензин и сохранность букетов в багажнике',
    salaryOffset: 200,
    minDiscount: 200,
    hasCar: true,
    opener: 'Приветствую! Пишу по объявлению на курьера. Стаж за рулём 28 лет, свой просторный универсал, климат работает — цветы доедут как из холодильника. В городе каждую подворотню знаю. По деньгам и графику обсудим?'
  },
  {
    id: 'cand_kira',
    name: 'Кира',
    nick: '@kira_fast_ride',
    age: 23,
    gender: 'female',
    roleId: 'courier',
    bio: 'Энергичная курьерша с большим термокоробом, объезжает любые пробки за минуты.',
    quirk: 'бодрая, с шутками, обожает быстрые маршруты и чаевые, не любит сидеть без дела',
    salaryOffset: 0,
    minDiscount: 150,
    hasCar: false,
    opener: 'Привет! Видела вакансию курьера — я как раз ищу постоянную точку! Пробки объезжаю влёгкую, короб утеплённый, руки аккуратные. Когда можно выходить на первую смену?'
  },
  {
    id: 'cand_timur',
    name: 'Тимур',
    nick: '@timur_drive',
    age: 31,
    gender: 'male',
    roleId: 'courier',
    bio: 'Вежливый водитель на чистом седане, аккуратно привозит даже самые хрупкие композиции.',
    quirk: 'вежливый, деловой, быстро считает маршруты, любит чёткие договорённости',
    salaryOffset: 150,
    minDiscount: 150,
    hasCar: true,
    opener: 'Здравствуйте! Заинтересовала ваша вакансия курьера. Автомобиль свой, салон чистый и без запахов, умею общаться с требовательными клиентами при вручении букетов. Готов обсудить ставку.'
  }
];

export async function generateJobCandidateDm(jobPosting) {
  const hiredIds = new Set((gameState.employees || []).map((e) => e.candidateId));
  const alreadyAppliedIds = new Set(
    (gameState.directMessages || [])
      .filter((m) => m.jobApplication && m.jobApplication.jobId === jobPosting.id)
      .map((m) => m.jobApplication.candidateId)
  );

  let pool = CANDIDATE_PROFILES.filter(
    (c) => c.roleId === jobPosting.roleId && !hiredIds.has(c.id) && !alreadyAppliedIds.has(c.id)
  );

  if (!pool.length) {
    // Если все базовые кандидаты для этой роли уже писали/наняты — создаём уникального нового соискателя
    const isFemale = Math.random() < 0.55;
    const name = pickRandom(isFemale ? ['Кристина', 'Яна', 'Диана', 'Надя', 'Олеся'] : ['Владислав', 'Антон', 'Глеб', 'Стас', 'Егор']);
    const usedNicks = new Set((gameState.directMessages || []).map((m) => String(m.senderName || '').toLowerCase()));
    const nick = generateProceduralNick(usedNicks);
    const hasCar = jobPosting.roleId === 'courier' && Math.random() < 0.6;
    pool = [
      {
        id: 'cand_dyn_' + Date.now(),
        name,
        nick,
        age: 21 + Math.floor(Math.random() * 18),
        gender: isFemale ? 'female' : 'male',
        roleId: jobPosting.roleId,
        bio: jobPosting.roleId === 'assistant'
          ? 'Аккуратный соискатель с базовым опытом ухода за цветами и желанием учиться.'
          : hasCar
          ? 'Курьер на собственном компактном автомобиле, хорошо ориентируется в городе.'
          : 'Быстрый пеший/вело-курьер, всегда на связи и аккуратно носит букеты.',
        quirk: 'искренний, живой в общении, открыт к обсуждению смены и ставки',
        salaryOffset: pickRandom([-100, 0, 150, 200]),
        minDiscount: 150,
        hasCar,
        opener: jobPosting.roleId === 'assistant'
          ? `Здравствуйте! Меня зовут ${name}, увидел${isFemale ? 'а' : ''} вашу вакансию на должность «${jobPosting.roleName}». Очень люблю цветы и хочу работать у вас в «${jobPosting.locationName}»!`
          : `Добрый день! Меня зовут ${name}, откликаюсь на курьера в «${jobPosting.locationName}»${hasCar ? ' (есть своя машина)' : ''}. Готов${isFemale ? 'а' : ''} обсудить условия!`
      }
    ];
  }

  const profile = pickRandom(pool);
  const baseOffered = Math.max(400, Number(jobPosting.salary) || 1200);
  const askedSalary = Math.max(500, Math.round((baseOffered + profile.salaryOffset) / 50) * 50);
  const minAcceptSalary = Math.max(450, Math.round((askedSalary - (profile.minDiscount || 150)) / 50) * 50);

  let openerText = profile.opener;
  if (aiSettings.provider !== 'offline') {
    const prompt = `Ты отыгрываешь роль живого соискателя работы в Direct для цветочного магазина "${gameState.shopName || 'Fleur Atelier'}".
ТВОИ ДАННЫЕ:
- Имя: ${profile.name}, ${profile.age} лет, пол: ${profile.gender === 'female' ? 'женский' : 'мужской'}.
- Описание: ${profile.bio}
- Характер: ${profile.quirk}
- Вакансия: ${jobPosting.roleName} в точку «${jobPosting.locationName}», график «${jobPosting.scheduleLabel}», в объявлении указано ${baseOffered} ₽ за смену, ты хочешь около ${askedSalary} ₽.

Напиши ПЕРВОЕ живое сообщение работодателю (2–3 предложения на русском): поздоровайся, коротко расскажи о себе и покажи свой характер. НИКОГДА не упоминай никакие кнопки или интерфейс!
Отвечай только обычным текстом без JSON.`;
    try {
      const raw = await callAI([{ role: 'user', content: prompt }]);
      const clean = stripCodeFences(raw).trim();
      if (clean && clean.length > 15 && !clean.startsWith('{')) {
        openerText = clean;
      }
    } catch (err) {
      console.warn('Fallback первого письма кандидата:', err);
    }
  }

  const nowLabel = formatMinutesAsTime(gameState.timeMinutes || 540);
  return {
    id: 'dm_job_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
    senderName: `${profile.name} (${profile.nick})`,
    kind: 'job',
    text: openerText,
    read: false,
    blockedByPlayer: false,
    blockedByClient: false,
    day: gameState.day,
    createdTimeLabel: nowLabel,
    thread: [{ sender: 'client', text: openerText }],
    order: null,
    replyText: null,
    jobApplication: {
      jobId: jobPosting.id,
      candidateId: profile.id,
      candidateName: profile.name,
      nick: profile.nick,
      age: profile.age,
      gender: profile.gender,
      roleId: jobPosting.roleId,
      roleName: jobPosting.roleName,
      roleIcon: jobPosting.roleIcon,
      bio: profile.bio,
      quirk: profile.quirk,
      locationId: jobPosting.locationId,
      locationName: jobPosting.locationName,
      scheduleId: jobPosting.scheduleId,
      scheduleLabel: jobPosting.scheduleLabel,
      offeredSalary: baseOffered,
      askedSalary,
      agreedSalary: askedSalary,
      minAcceptSalary,
      hasCar: Boolean(profile.hasCar),
      status: 'interviewing'
    }
  };
}

export async function generateCandidateInterviewReply(dm, playerText) {
  const app = dm.jobApplication;
  if (!app) return { reply: 'Спасибо!', agreedSalary: 1200, blockedByClient: false };

  if (isRudeText(playerText)) {
    return {
      reply: 'Извините, но в таком тоне я даже не хочу дальше обсуждать работу. Всего доброго.',
      agreedSalary: app.agreedSalary,
      blockedByClient: true
    };
  }

  if (aiSettings.provider === 'offline') {
    await sleep(220);
    return runOfflineCandidateInterview(app, playerText);
  }

  const threadText = (dm.thread || [])
    .map((m) => `${m.sender === 'player' ? 'Работодатель' : m.sender === 'system' ? 'Система' : app.candidateName}: ${m.text}`)
    .join('\n');

  const prompt = `Ты проходишь живое собеседование в Direct на должность «${app.roleName}» в цветочном магазине "${gameState.shopName || 'Fleur Atelier'}".
ТВОЙ ПЕРСОНАЖ:
- Имя и возраст: ${app.candidateName}, ${app.age} лет (${app.gender === 'female' ? 'женщина — пиши в женском роде' : 'мужчина — пиши в мужском роде'}).
- О тебе: ${app.bio}
- Характер: ${app.quirk}
- Точка и график: «${app.locationName}», ${app.scheduleLabel}.
- Желаемая ставка: ${app.askedSalary} ₽/смену, сейчас обсуждается ${app.agreedSalary} ₽, твой крайний минимум: ${app.minAcceptSalary} ₽ (ниже этого не соглашайся, предлагай компромисс!).

ПЕРЕПИСКА:
${threadText}
ПОСЛЕДНЕЕ СООБЩЕНИЕ РАБОТОДАТЕЛЯ: "${playerText}"

ПРАВИЛА:
1. Отвечай живо, искренне, со своим характером и юмором (1–3 предложения). Никаких шаблонов!
2. НИКОГДА не упоминай кнопки, «нажмите принять» или интерфейс! Общайся как реальный соискатель в чате.
3. Если работодатель торгуется и предлагает конкретную зарплату >= ${app.minAcceptSalary}, соглашайся и ставь эту сумму в "agreedSalary". Если сумма ниже минимума — вежливо или с характером поспорь и назови свой минимум/середину.

ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{"reply": "твой живой ответ", "agreedSalary": ${app.agreedSalary}}`;

  try {
    const raw = await callAI([{ role: 'user', content: prompt }]);
    const cleaned = stripCodeFences(raw);
    const s = cleaned.indexOf('{');
    const e = cleaned.lastIndexOf('}');
    if (s !== -1 && e > s) {
      const parsed = JSON.parse(cleaned.slice(s, e + 1));
      const nextSalary = Math.max(app.minAcceptSalary, Math.min(10000, Number(parsed.agreedSalary) || app.agreedSalary));
      return {
        reply: String(parsed.reply || 'Договорились!').trim(),
        agreedSalary: nextSalary,
        blockedByClient: false
      };
    }
  } catch (err) {
    console.warn('Fallback собеседования:', err);
  }
  return runOfflineCandidateInterview(app, playerText);
}

function runOfflineCandidateInterview(app, playerText) {
  const lower = String(playerText || '').toLowerCase().trim();
  const isFem = app.gender === 'female';
  const readyWord = isFem ? 'готова' : 'готов';

  const salaryMatch = lower.match(/(\d{3,5})/);
  if (salaryMatch && (lower.includes('₽') || lower.includes('руб') || lower.includes('ставк') || lower.includes('зарпл') || lower.includes('оклад') || lower.includes('за смену') || lower.includes('предлаг') || lower.includes('давай') || lower.includes('устроит'))) {
    const proposed = Number(salaryMatch[1]);
    if (proposed >= app.agreedSalary) {
      return {
        reply: `${proposed} ₽ за смену — это вообще отлично! С таким предложением я точно ${readyWord} работать у вас с полной отдачей 🌸`,
        agreedSalary: proposed,
        blockedByClient: false
      };
    }
    if (proposed >= app.minAcceptSalary) {
      return {
        reply: app.candidateId === 'cand_maks'
          ? `Ладно, ${proposed} ₽ чуть ниже моих ожиданий, но лавка у вас стильная — договорились, выхожу на этих условиях.`
          : `Хорошо, ${proposed} ₽ меня вполне устроит! Главное, чтобы работалось дружно и без нервов.`,
        agreedSalary: proposed,
        blockedByClient: false
      };
    }
    const compromise = Math.round(((proposed + app.minAcceptSalary) / 2) / 50) * 50;
    const target = Math.max(app.minAcceptSalary, compromise);
    return {
      reply: app.hasCar
        ? `Эх, за ${proposed} ₽ мне даже бензин с амортизацией еле окупится! Давайте хотя бы ${target} ₽ за смену — и я ваш надёжный человек на колёсах.`
        : `Ой, ${proposed} ₽ всё-таки маловато с учётом нагрузки... Могу пойти навстречу до ${target} ₽ за смену — как вам?`,
      agreedSalary: target,
      blockedByClient: false
    };
  }

  if (lower.includes('опыт') || lower.includes('умее') || lower.includes('работал') || lower.includes('расскаж')) {
    const expText = app.roleId === 'assistant'
      ? (app.candidateId === 'cand_maks'
          ? 'Два года собирал сложные авторские композиции, знаю уход за пионами, гортензиями и умею делать идеальную упаковку. Воду в вазах меняю вовремя, не переживайте!'
          : `Опыта пока не так много, но руки растут откуда надо — аккуратно подрезаю стебли, меняю воду и легко соберу базовый красивый букет!`)
      : (app.hasCar
          ? `На доставках уже много лет — цветы вожу бережно, чтобы ни один лепесток не помялся, домофоны и пробки меня не пугают!`
          : 'Доставляю заказы шустро, всегда звоню клиенту заранее и вручаю букет с улыбкой!');
    return { reply: expText, agreedSalary: app.agreedSalary, blockedByClient: false };
  }

  if (lower.includes('график') || lower.includes('когда') || lower.includes('выйти') || lower.includes('время') || lower.includes('смен')) {
    return {
      reply: `График «${app.scheduleLabel}» мне подходит! Если договоримся по ставке (${app.agreedSalary} ₽/см.), могу выйти на точку «${app.locationName}» хоть со следующего рабочего дня.`,
      agreedSalary: app.agreedSalary,
      blockedByClient: false
    };
  }

  if (lower.includes('машин') || lower.includes('транспорт') || lower.includes('пробк') || lower.includes('достав')) {
    return {
      reply: app.hasCar
        ? 'Да, на своём авто — чистый салон, кондиционер летом и тёплая печка зимой, так что нежные розы в дороге не замёрзнут!'
        : app.roleId === 'courier'
        ? 'Своей машины нет, но я на шустром велосипеде с тёплым термокоробом — по городу часто быстрее машин приезжаю!'
        : 'До магазина добираюсь быстро, на работу никогда не опаздываю.',
      agreedSalary: app.agreedSalary,
      blockedByClient: false
    };
  }

  if (lower.includes('зарпл') || lower.includes('ставк') || lower.includes('денег') || lower.includes('оплат') || lower.includes('сколько хочешь')) {
    return {
      reply: `Я рассчитываю примерно на ${app.agreedSalary} ₽ за смену, но если что — можем обсудить условия по-человечески!`,
      agreedSalary: app.agreedSalary,
      blockedByClient: false
    };
  }

  return {
    reply: pickRandom([
      `Всё понял${isFem ? 'а' : ''}! Мне очень нравится атмосфера вашей лавки, с удовольствием поработаю у вас на точке «${app.locationName}».`,
      `Хороший вопрос! Я человек ответственный, с людьми общаться умею. Что скажете по моим условиям (${app.agreedSalary} ₽/см.)?`,
      `Да, конечно, для меня это не проблема! Буду рад${isFem ? 'а' : ''} стать частью вашей команды 🌸`
    ]),
    agreedSalary: app.agreedSalary,
    blockedByClient: false
  };
}

export async function generateCandidateHireReaction(dm, accepted, finalSalary) {
  const app = dm.jobApplication;
  const isFem = app?.gender === 'female';
  if (accepted) {
    return app?.candidateId === 'cand_sasha'
      ? `Ну всё, по рукам! Пошёл проверять масло и протирать багажник — за ${finalSalary} ₽ в смену отработаю на совесть!`
      : `Ура, спасибо за доверие! Очень рад${isFem ? 'а' : ''}, что договорились на ${finalSalary} ₽/см. — скоро приступлю к работе 🌸`;
  }
  return `Понял${isFem ? 'а' : ''}, спасибо за честный ответ и время. Удачи вашему цветочному магазину!`;
}
```

## File: js/ai/socialAi.js
```javascript
/**
 * js/ai/socialAi.js
 * Работа с соцсетями: посты/комментарии в InstaFlower и переписка/предзаказы в Direct
 */

import { FLOWERS_CATALOG, ACCESSORIES_CATALOG } from '../config.js';
import { gameState, aiSettings } from '../state.js';
import {
  callAI,
  stripCodeFences,
  sleep,
  pickRandom,
  generateProceduralNick,
  isRudeText,
  formatMinutesAsTime,
  detectMentionedFlowers,
  resolvePlayerGender,
  getBadgeRuleText
} from './aiCore.js';

export async function evaluateInstaPost({ type, caption, hashtags, detailsText }) {
  const hasPromoToday = gameState.activePromo && gameState.activePromo.day === gameState.day;

  if (aiSettings.provider === 'offline') {
    await sleep(320);
    return runOfflineInstaPost({ type, caption, hashtags, detailsText, hasPromoToday });
  }

  const prompt = `Ты — симулятор живой аудитории соцсети InstaFlower.
Флорист магазина "${gameState.shopName || 'Fleur Atelier'}" (сейчас ${gameState.followers} подписчиков, атмосфера ${gameState.mood}%${hasPromoToday ? `, запущена промо-акция «${gameState.activePromo.title}»` : ''}) выложил пост:
- Что на фото: ${type === 'bouquet' ? 'Собранный букет' : 'Интерьер витрины магазина'} (${detailsText}).
- Текст поста: "${caption || '(без текста)'}".
- Хэштеги: ${hashtags.join(' ') || '(нет)'}.

Оцени пост ЧЕСТНО, как в жизни (пост может не залететь, особенно если нет текста или скучно, а может залететь в рекомендации!):
1. likes: число от 2 до 140.
2. followerDelta: число от -1 до +30 (может быть 0, если пост обычный).
3. verdict: короткий статус ("Залетело в тренды 🔥" / "Тёплый отклик 🌸" / "Скромный охват" / "Не зашло 😕").
4. comments: массив из 2–3 коротких живых комментариев на русском. ВАЖНО: сам придумай 2–3 совершенно разных, уникальных, реалистичных ника обычных людей (разные имена/стили, без повторов, без фамилии Смирнова и без слов flowers/buket/flora).

ОТВЕЧАЙ СТРОГО ОДНИМ ВАЛИДНЫМ JSON БЕЗ MARKDOWN:
{"likes": 12, "followerDelta": 2, "verdict": "Тёплый отклик 🌸", "comments": [{"author": "@уникальный_ник", "text": "Очень нежно!"}]}`;

  try {
    const raw = await callAI([{ role: 'user', content: prompt }]);
    const cleaned = stripCodeFences(raw);
    const s = cleaned.indexOf('{');
    const e = cleaned.lastIndexOf('}');
    if (s !== -1 && e > s) {
      const parsed = JSON.parse(cleaned.slice(s, e + 1));
      const promoBonusLikes = hasPromoToday ? 10 : 0;
      const promoBonusFollowers = hasPromoToday ? 2 : 0;
      return {
        likes: Math.max(0, (Number(parsed.likes) || 5) + promoBonusLikes),
        followerDelta: Math.max(-3, Math.min(45, (Number(parsed.followerDelta) || 0) + promoBonusFollowers)),
        verdict: String(parsed.verdict || 'Опубликовано'),
        comments: Array.isArray(parsed.comments) ? parsed.comments.slice(0, 3) : []
      };
    }
  } catch (err) {
    console.warn('Fallback оценки поста:', err);
  }
  return runOfflineInstaPost({ type, caption, hashtags, detailsText, hasPromoToday });
}

function runOfflineInstaPost({ caption, hashtags, hasPromoToday }) {
  const textLen = (caption || '').trim().length;
  const tagCount = hashtags.length;
  const roll = Math.random() + (hasPromoToday ? 0.18 : 0);
  const n1 = generateProceduralNick();
  const n2 = generateProceduralNick(new Set([n1.toLowerCase()]));

  if (textLen < 4 && tagCount === 0 && !hasPromoToday) {
    return {
      likes: 2 + Math.floor(Math.random() * 6),
      followerDelta: 0,
      verdict: 'Пост не зашёл 😕 (пусто без текста)',
      comments: [
        { author: n1, text: pickRandom(['А где описание и стоимость?', 'Красиво, но расскажите хоть что за цветы и почём!', 'Подписи не хватает для охватов 😅']) }
      ]
    };
  }
  if (roll > 0.68 || (textLen > 18 && tagCount >= 2 && roll > 0.32)) {
    const gain = 5 + Math.floor(Math.random() * 14) + (hasPromoToday ? 3 : 0);
    return {
      likes: 30 + Math.floor(Math.random() * 55) + Math.round(gameState.followers * 0.2) + (hasPromoToday ? 14 : 0),
      followerDelta: gain,
      verdict: 'Залетело в рекомендации 🔥',
      comments: [
        { author: n1, text: pickRandom(['Вау, какие нежные оттенки! Подписалась 💐', 'Безумно красиво собрано, сохранила себе!', 'У вас золотые руки, такой уют от фото ❤️']) },
        { author: n2, text: pickRandom(['Скоро забегу за таким же!', 'Смотрится как с открытки ✨', 'Хочу точно такой же букет себе на выходные!']) }
      ]
    };
  }
  const smallGain = Math.random() > 0.35 ? 1 + Math.floor(Math.random() * 3) : hasPromoToday ? 2 : 0;
  return {
    likes: 7 + Math.floor(Math.random() * 18) + (hasPromoToday ? 8 : 0),
    followerDelta: smallGain,
    verdict: 'Спокойный охват 🌸',
    comments: [
      { author: n1, text: pickRandom(['Очень мило и уютно смотрится!', 'Нежное сочетание цветов 🌸', 'Отличный кадр, хочется заглянуть к вам!']) }
    ]
  };
}

export async function generateInstaCommentReply(post, comment, playerReply) {
  if (aiSettings.provider === 'offline') {
    await sleep(220);
    return runOfflineInstaCommentReply(comment, playerReply);
  }

  const prompt = `Пользователь ${comment.author} оставил под постом цветочного магазина "${gameState.shopName || 'Fleur Atelier'}" комментарий:
"${comment.text}"
Владелец магазина ответил ему:
"${playerReply}"

Реши, ответит ли подписчик повторно (примерно в 70% случаев отвечает тепло, если ему ответили нормально; если нахамили — отвечает резко; если ответ сухой «ок», может не отвечать).
ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{"shouldReply": true, "replyText": "живой короткий ответ подписчика", "bonusLikes": 2, "followerDelta": 1}`;

  try {
    const raw = await callAI([{ role: 'user', content: prompt }]);
    const cleaned = stripCodeFences(raw);
    const s = cleaned.indexOf('{');
    const e = cleaned.lastIndexOf('}');
    if (s !== -1 && e > s) {
      const parsed = JSON.parse(cleaned.slice(s, e + 1));
      return {
        shouldReply: Boolean(parsed.shouldReply),
        replyText: String(parsed.replyText || '').trim(),
        bonusLikes: Math.max(0, Math.min(5, Number(parsed.bonusLikes) || 1)),
        followerDelta: Math.max(-1, Math.min(2, Number(parsed.followerDelta) || 0))
      };
    }
  } catch (err) {
    console.warn('Fallback ответа на коммент:', err);
  }
  return runOfflineInstaCommentReply(comment, playerReply);
}

function runOfflineInstaCommentReply(comment, playerReply) {
  const lower = String(playerReply || '').toLowerCase();
  if (isRudeText(lower)) {
    return {
      shouldReply: true,
      replyText: 'Ну и манеры у вас... Отписываюсь 😕',
      bonusLikes: 0,
      followerDelta: -1
    };
  }

  if (Math.random() > 0.76) {
    return { shouldReply: false, replyText: '', bonusLikes: 1, followerDelta: 0 };
  }

  if (lower.includes('ждет') || lower.includes('ждём') || lower.includes('ждем') || lower.includes('забег') || lower.includes('приход') || lower.includes('гост')) {
    return {
      shouldReply: true,
      replyText: pickRandom([
        'Обязательно загляну на этой неделе за букетиком! ❤️',
        'Уже строю маршрут к вашей лавке, до встречи 🌸'
      ]),
      bonusLikes: 2,
      followerDelta: 1
    };
  }
  if (lower.includes('₽') || lower.includes('руб') || lower.includes('стоит') || lower.includes('цена') || lower.includes('скид')) {
    return {
      shouldReply: true,
      replyText: pickRandom([
        'О, цена очень приятная за такую красоту! Спасибо за ответ ✨',
        'Отлично, возьму на заметку — скоро закажу!'
      ]),
      bonusLikes: 2,
      followerDelta: 1
    };
  }

  return {
    shouldReply: true,
    replyText: pickRandom([
      'Очень приятно, что отвечаете каждому! Удачи вашему магазинчику 💐',
      'Спасибо вам за вдохновение и красоту в ленте ❤️',
      'Уже показала ваш профиль подруге, нам всё очень нравится!'
    ]),
    bonusLikes: 2,
    followerDelta: Math.random() < 0.55 ? 1 : 0
  };
}

function computePreorderDueSlot() {
  const openMin = (gameState.openHour || 9) * 60;
  const closeMin = (gameState.closeHour || 21) * 60;
  const curMin = Math.max(openMin, gameState.timeMinutes || openMin);
  const latestMin = closeMin - 15;

  if (latestMin - curMin < 35) return null;

  const rawOffset = 50 + Math.floor(Math.random() * 85);
  const clamped = Math.min(latestMin, curMin + rawOffset);
  const rounded = Math.round(clamped / 15) * 15;
  const finalMin = Math.max(curMin + 25, Math.min(latestMin, rounded));
  return {
    dueMinutes: finalMin,
    dueTimeLabel: formatMinutesAsTime(finalMin)
  };
}

function parseTimeMinutesFromText(text) {
  const str = String(text || '');
  const hmMatch = str.match(/\b([01]?\d|2[0-3])\s*[:.-]\s*([0-5]\d)\b/);
  if (hmMatch) {
    return Number(hmMatch[1]) * 60 + Number(hmMatch[2]);
  }
  const hourMatch = str.match(/(?:\b(?:к|в|до|на)\s+)([01]?\d|2[0-3])\b(?:\s*(?:час|ч\b|утра|дня|вечера))?/i);
  if (hourMatch) {
    const h = Number(hourMatch[1]);
    if (h >= 7 && h <= 23) return h * 60;
  }
  return null;
}

function parseQtyFromText(text) {
  const str = String(text || '');
  const m =
    str.match(/(\d{1,2})\s*(?:шт|штук|цветов|цветк|стебл|роз|пион|тюльпан|хризантем|гвоздик|лили|ирис|подсолнух|ромаш)/i) ||
    str.match(/из\s+(\d{1,2})\b/i);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 1 && n <= 35 ? n : null;
}

function parsePriceFromText(text) {
  const str = String(text || '');
  const m = str.match(/(\d{3,5})\s*(?:₽|руб|р\b)/i);
  if (!m) return null;
  const p = Number(m[1]);
  return p >= 100 && p <= 50000 ? p : null;
}

function resolveDueSlotFromContext(preferredLabel, existingOrder) {
  const openMin = (gameState.openHour || 9) * 60;
  const closeMin = (gameState.closeHour || 21) * 60;
  const curMin = Math.max(openMin, gameState.timeMinutes || openMin);

  if (curMin >= closeMin - 12) return null;

  const parsedMin = parseTimeMinutesFromText(preferredLabel);
  if (parsedMin !== null && parsedMin < closeMin - 5) {
    const finalMin = Math.max(curMin + 12, parsedMin);
    if (finalMin <= closeMin - 5) {
      return {
        dueMinutes: finalMin,
        dueTimeLabel: formatMinutesAsTime(finalMin)
      };
    }
  }

  if (existingOrder && existingOrder.dueMinutes && existingOrder.dueMinutes >= curMin + 5 && existingOrder.dueMinutes < closeMin - 5) {
    return {
      dueMinutes: existingOrder.dueMinutes,
      dueTimeLabel: formatMinutesAsTime(existingOrder.dueMinutes)
    };
  }

  const slot = computePreorderDueSlot();
  if (slot) return slot;

  const fallbackMin = Math.min(closeMin - 5, curMin + 15);
  return {
    dueMinutes: fallbackMin,
    dueTimeLabel: formatMinutesAsTime(fallbackMin)
  };
}

function buildDirectOrderData({ parsedOrder, playerText, replyText, existingOrder }) {
  const combinedText = `${playerText || ''} ${replyText || ''}`;
  const mentioned = detectMentionedFlowers(combinedText);
  const parsedTypeId = parsedOrder?.typeId && FLOWERS_CATALOG[parsedOrder.typeId] ? parsedOrder.typeId : null;
  const typeId = parsedTypeId || mentioned[0] || existingOrder?.typeId || 'rose_red';
  const meta = FLOWERS_CATALOG[typeId] || FLOWERS_CATALOG.rose_red;

  const qtyFromText = parseQtyFromText(replyText) ?? parseQtyFromText(playerText);
  const qty = Math.max(1, Math.min(35, Number(parsedOrder?.qty) || qtyFromText || existingOrder?.qty || 5));

  const priceFromText = parsePriceFromText(replyText) ?? parsePriceFromText(playerText);
  const defaultReward = meta.price * qty + 140;
  const reward = Math.max(100, Number(parsedOrder?.reward) || priceFromText || existingOrder?.reward || defaultReward);

  const timeCandidate = parsedOrder?.dueTime || replyText || playerText || existingOrder?.dueTimeLabel || '';
  const dueSlot = resolveDueSlotFromContext(timeCandidate, existingOrder);
  if (!dueSlot) return null;

  return {
    typeId: meta.id,
    flowerName: meta.name,
    qty,
    reward,
    dueMinutes: dueSlot.dueMinutes,
    dueTimeLabel: dueSlot.dueTimeLabel
  };
}

export async function generateDirectMessage() {
  const flowerKeys = Object.keys(FLOWERS_CATALOG);
  const randomFlowerId = pickRandom(flowerKeys);
  const randomFlower = FLOWERS_CATALOG[randomFlowerId];
  const qty = 3 + Math.floor(Math.random() * 5);

  const accList = Object.values(ACCESSORIES_CATALOG);
  const wantsAcc = Math.random() < 0.25;
  const randomAcc = wantsAcc ? pickRandom(accList) : null;

  const reward = randomFlower.price * qty + 140 + (randomAcc ? randomAcc.price : 0);
  const dueSlot = computePreorderDueSlot();
  const badgeName = String(gameState.playerBadgeName || '').trim();
  const knowsMasterName = Boolean(badgeName) && Math.random() < 0.35;

  if (aiSettings.provider === 'offline') {
    await sleep(220);
    return createFallbackDirectMessage(randomFlowerId, randomFlower.name, qty, reward, dueSlot, knowsMasterName, randomAcc);
  }

  const usedNicks = (gameState.directMessages || [])
    .slice(0, 15)
    .map((m) => m.senderName)
    .filter(Boolean);
  const usedSet = new Set(usedNicks.map((n) => n.toLowerCase()));
  const canPreorder = Boolean(dueSlot);
  const randomSeedHint = Math.floor(1000 + Math.random() * 9000);
  const accPromptPart = randomAcc ? ` и добавить к букету «${randomAcc.name}»` : '';

  const prompt = `Сгенерируй одно входящее сообщение в Direct для цветочного магазина "${gameState.shopName || 'Fleur Atelier'}" (только самовывоз, курьерской доставки нет; подписчиков: ${gameState.followers}, время: ${formatMinutesAsTime(gameState.timeMinutes || 540)}, seed=${randomSeedHint}).
Выбери ОДИН случайный тип:
${canPreorder ? `- "preorder": клиент спрашивает/просит предзаказ на ${qty} шт. "${randomFlower.name}"${accPromptPart}, заберёт сам ровно к ${dueSlot.dueTimeLabel} (бюджет ${reward} ₽). Обязательно упомяни время ${dueSlot.dueTimeLabel}!` : ''}
- "question": вопрос про самовывоз, уход за цветами, наличие сортов или сопутствующих подарков (шарики, мишки, конфеты).
- "review": тёплый отзыв или лёгкая критика про цены/упаковку.
ВАЖНО: Никогда не упоминай никакие кнопки, подтверждения кнопкой или интерфейс!
ВАЖНО про ник отправителя: ПРИДУМАЙ САМ каждый раз абсолютно новый, уникальный, реалистичный ник обычного человека (чередуй мужские и женские имена, разные стили с латиницей/точкой/цифрами/подчёркиванием). ЗАПРЕЩЕНО повторять эти уже занятые ники: ${usedNicks.join(', ') || 'пока нет'}, ЗАПРЕЩЕНО использовать фамилию Смирнова и слова flowers/buket/flora.

ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{
  "senderName": "@уникальный_ник_человека",
  "kind": "${canPreorder ? 'preorder" | "question" | "review' : 'question" | "review'}",
  "text": "короткое сообщение клиента 1-2 предложения"
}`;

  try {
    const raw = await callAI([{ role: 'user', content: prompt }]);
    const cleaned = stripCodeFences(raw);
    const s = cleaned.indexOf('{');
    const e = cleaned.lastIndexOf('}');
    if (s !== -1 && e > s) {
      const parsed = JSON.parse(cleaned.slice(s, e + 1));
      let kind = ['preorder', 'question', 'review'].includes(parsed.kind) ? parsed.kind : 'question';
      if (kind === 'preorder' && !dueSlot) kind = 'question';

      let senderName = String(parsed.senderName || '').trim().replace(/\s+/g, '_');
      if (senderName && !senderName.startsWith('@')) senderName = '@' + senderName;
      const lowerSender = senderName.toLowerCase();

      if (
        !senderName ||
        senderName.length < 3 ||
        lowerSender.includes('уникальный') ||
        lowerSender.includes('smirnova') ||
        lowerSender.includes('смирнова')
      ) {
        senderName = generateProceduralNick(usedSet);
      } else if (usedSet.has(lowerSender)) {
        const suffix = 10 + Math.floor(Math.random() * 89);
        senderName = `${senderName}${suffix}`;
      }

      const msgText = String(parsed.text || 'Здравствуйте! Подскажите, есть ли свежие цветы?');
      return {
        id: 'dm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
        senderName,
        kind,
        text: msgText,
        read: false,
        knowsMasterName,
        blockedByPlayer: false,
        blockedByClient: false,
        day: gameState.day,
        createdTimeLabel: formatMinutesAsTime(gameState.timeMinutes || 540),
        thread: [{ sender: 'client', text: msgText }],
        order:
          kind === 'preorder'
            ? {
                typeId: randomFlowerId,
                flowerName: randomFlower.name,
                qty,
                reward,
                dueMinutes: dueSlot.dueMinutes,
                dueTimeLabel: dueSlot.dueTimeLabel,
                accessoryId: randomAcc ? randomAcc.id : null,
                accessoryName: randomAcc ? randomAcc.name : null,
                accepted: false,
                rejected: false,
                done: false
              }
            : null,
        replyText: null
      };
    }
  } catch (err) {
    console.warn('Fallback Direct:', err);
  }
  return createFallbackDirectMessage(randomFlowerId, randomFlower.name, qty, reward, dueSlot, knowsMasterName, randomAcc);
}

function createFallbackDirectMessage(typeId, flowerName, qty, reward, dueSlot, knowsMasterName = false, randomAcc = null) {
  const roll = Math.random();
  const usedSet = new Set((gameState.directMessages || []).map((m) => String(m.senderName || '').toLowerCase()));
  const sender = generateProceduralNick(usedSet);
  const nowLabel = formatMinutesAsTime(gameState.timeMinutes || 540);
  const accPart = randomAcc ? ` и «${randomAcc.name}» к нему` : '';

  if (dueSlot && roll < 0.48) {
    const texts = [
      `Здравствуйте! Можно оформить предзаказ на ${qty} шт. «${flowerName}»${accPart} с получением к ${dueSlot.dueTimeLabel}? Бюджет ${reward} ₽!`,
      `Добрый день! Очень нужен букетик из ${qty} шт. (${flowerName})${accPart}, смогу забрать ровно в ${dueSlot.dueTimeLabel}. Сделаете за ${reward} ₽?`
    ];
    const msgText = pickRandom(texts);
    return {
      id: 'dm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      senderName: sender,
      kind: 'preorder',
      text: msgText,
      read: false,
      knowsMasterName,
      blockedByPlayer: false,
      blockedByClient: false,
      day: gameState.day,
      createdTimeLabel: nowLabel,
      thread: [{ sender: 'client', text: msgText }],
      order: {
        typeId,
        flowerName,
        qty,
        reward,
        dueMinutes: dueSlot.dueMinutes,
        dueTimeLabel: dueSlot.dueTimeLabel,
        accessoryId: randomAcc ? randomAcc.id : null,
        accessoryName: randomAcc ? randomAcc.name : null,
        accepted: false,
        rejected: false,
        done: false
      },
      replyText: null
    };
  }
  if (roll < 0.8) {
    const questions = [
      'Добрый день! Подскажите, как лучше ухаживать за букетом дома, чтобы дольше стоял?',
      'Здравствуйте! Есть ли у вас к цветам плюшевые мишки, конфеты или гелиевые шарики?',
      'Подскажите, пожалуйста, до скольких вы сегодня работаете? Боюсь не успеть зайти после работы.',
      'Привет! А у вас сегодня есть свежие пионы или нежные розы для подарка подруге?'
    ];
    const msgText = pickRandom(questions);
    return {
      id: 'dm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      senderName: sender,
      kind: 'question',
      text: msgText,
      read: false,
      knowsMasterName,
      blockedByPlayer: false,
      blockedByClient: false,
      day: gameState.day,
      createdTimeLabel: nowLabel,
      thread: [{ sender: 'client', text: msgText }],
      order: null,
      replyText: null
    };
  }
  const reviews = [
    'Брали у вас цветы на прошлой неделе — до сих пор стоят как новенькие, спасибо огромное!',
    'Видели ваши букеты в ленте — цвета красивые, но кажется цены чуть выше средних по району.',
    'Уютнейшая лавка! Мама была в полном восторге от оформления с лентой 🌸'
  ];
  const msgText = pickRandom(reviews);
  return {
    id: 'dm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
    senderName: sender,
    kind: 'review',
    text: msgText,
    read: false,
    knowsMasterName,
    blockedByPlayer: false,
    blockedByClient: false,
    day: gameState.day,
    createdTimeLabel: nowLabel,
    thread: [{ sender: 'client', text: msgText }],
    order: null,
    replyText: null
  };
}

export async function generateDirectRejectionReply(dm, reason, isSilent) {
  const cleanReason = String(reason || '').trim();
  const rLower = cleanReason.toLowerCase();
  const canTryRaise = Boolean(dm.order && !dm.order.budgetRaisedOnce);
  const isBudgetReason =
    canTryRaise &&
    !isSilent &&
    (rLower.includes('бюджет') || rLower.includes('мал') || rLower.includes('дорог') || rLower.includes('дешев') || rLower.includes('хватает'));

  if (aiSettings.provider === 'offline') {
    await sleep(220);
    return runOfflineDirectRejectionReply(dm, cleanReason, isSilent, isBudgetReason);
  }

  const orderInfo = dm.order
    ? `${dm.order.qty} шт. «${dm.order.flowerName}» к ${dm.order.dueTimeLabel} (бюджет ${dm.order.reward} ₽)`
    : 'предзаказ';

  const prompt = `Ты — уникальный живой клиент ${dm.senderName} в переписке Direct с цветочным магазином "${gameState.shopName || 'Fleur Atelier'}".
Ты просил(а) заказ: ${orderInfo}.
Флорист ответил отказом: ${isSilent ? '«К сожалению, не сможем взять заказ» (без объяснения причины).' : `«К сожалению, не сможем взять заказ (${cleanReason})».`}

Реагируй естественно и без заученных клише, никогда не упоминай никакие кнопки (1–2 предложения на русском):
${isBudgetReason
  ? '- Так как отказ из-за бюджета, можешь (если хочешь) ОДИН раз попробовать предложить доплатить 300 ₽ ("raisedBudgetAmount": 300), либо просто попрощаться ("raisedBudgetAmount": 0).'
  : '- Это окончательный отказ, так что с разным характером (с сожалением, спокойно или чуть обиженно) попрощайся и не предлагай больше доплат ("raisedBudgetAmount": 0).'}

ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{"reply": "ответ клиента", "moodDelta": -1, "raisedBudgetAmount": 0}`;

  try {
    const raw = await callAI([{ role: 'user', content: prompt }]);
    const cleaned = stripCodeFences(raw);
    const s = cleaned.indexOf('{');
    const e = cleaned.lastIndexOf('}');
    if (s !== -1 && e > s) {
      const parsed = JSON.parse(cleaned.slice(s, e + 1));
      const raised = isBudgetReason ? Math.max(0, Math.min(500, Number(parsed.raisedBudgetAmount) || 0)) : 0;
      return {
        reply: String(parsed.reply || 'Понял(а), тогда поищу другой вариант!').trim(),
        moodDelta: Math.max(-5, Math.min(2, Number(parsed.moodDelta) || -1)),
        raisedBudgetAmount: raised
      };
    }
  } catch (err) {
    console.warn('Fallback ответа на отказ в Direct:', err);
  }
  return runOfflineDirectRejectionReply(dm, cleanReason, isSilent, isBudgetReason);
}

function runOfflineDirectRejectionReply(dm, cleanReason, isSilent, isBudgetReason) {
  const rLower = cleanReason.toLowerCase();
  if (isSilent) {
    return {
      reply: pickRandom([
        'Очень жаль, но спасибо за ответ. Поищу тогда в другом месте!',
        'Эх, понятно... Хорошего вам дня, загляну как-нибудь позже!',
        'Жаль, что не сложилось! Удачи вашей лавке 🌸'
      ]),
      moodDelta: -1,
      raisedBudgetAmount: 0
    };
  }
  if (isBudgetReason && Math.random() < 0.48) {
    return {
      reply: 'Эх, жалко... А если я накину ещё 300 ₽ — тогда получится взять заказ? Очень хочется именно от вас!',
      moodDelta: -1,
      raisedBudgetAmount: 300
    };
  }
  if (isBudgetReason) {
    return {
      reply: 'Понял(а), к сожалению больше поднять бюджет сейчас не могу. Поищу вариант попроще, удачной смены!',
      moodDelta: -1,
      raisedBudgetAmount: 0
    };
  }
  if (rLower.includes('нет') || rLower.includes('цвет')) {
    return {
      reply: pickRandom([
        'Жаль, что нужных цветов нет... Попробую поискать в соседнем районе!',
        'Ох, понятно, раскупили! Ладно, спасибо что предупредили 🌸'
      ]),
      moodDelta: -1,
      raisedBudgetAmount: 0
    };
  }
  if (rLower.includes('успе') || rLower.includes('врем')) {
    return {
      reply: 'Понимаю, когда завал по заказам! Ничего страшного, загляну в другой день.',
      moodDelta: -1,
      raisedBudgetAmount: 0
    };
  }
  if (rLower.includes('закры')) {
    return {
      reply: 'Понял(а), раз уже закрываетесь — не буду задерживать! Хорошего вечера 👋',
      moodDelta: 0,
      raisedBudgetAmount: 0
    };
  }
  return {
    reply: `Услышал(а) вас («${cleanReason}»). Очень жаль, тогда поищу в другом месте!`,
    moodDelta: -1,
    raisedBudgetAmount: 0
  };
}

export async function generateDirectFollowUp(dm, playerText, attachedPhoto = null) {
  if (isRudeText(playerText)) {
    return {
      reply: 'Ну знаете, так общаться — перебор! Всего доброго, отправляю ваш профиль в чёрный список.',
      moodDelta: -5,
      followerDelta: -1,
      blockedByClient: true,
      proposedOrder: null
    };
  }

  const badgeName = String(gameState.playerBadgeName || '').trim();
  if (typeof dm.knowsMasterName !== 'boolean') {
    dm.knowsMasterName = Boolean(badgeName) && Math.random() < 0.35;
  }

  if (aiSettings.provider === 'offline') {
    await sleep(220);
    return runOfflineDirectFollowUp(dm, playerText, attachedPhoto);
  }

  const threadText = (dm.thread || [])
    .map((m) => `${m.sender === 'player' ? 'Флорист' : m.sender === 'system' ? 'Система' : dm.senderName}: ${m.photoDesc ? `[Отправил фото: ${m.photoDesc}] ` : ''}${m.text}`)
    .join('\n');

  const nowTime = formatMinutesAsTime(gameState.timeMinutes || 540);
  const closeTime = formatMinutesAsTime((gameState.closeHour || 21) * 60);

  let orderStatusStr = 'Заявки на предзаказ пока нет (идёт живое общение).';
  if (dm.order) {
    if (dm.order.accepted) {
      orderStatusStr = `Заказ УЖЕ согласован и принят в работу: ${dm.order.qty} шт. «${dm.order.flowerName}» к ${dm.order.dueTimeLabel} за ${dm.order.reward} ₽.`;
    } else if (dm.order.rejected) {
      orderStatusStr = `Заявка ранее была отклонена (${dm.order.qty} шт. «${dm.order.flowerName}»).`;
    } else {
      orderStatusStr = `Есть активная заявка в ожидании ответа флориста: ${dm.order.qty} шт. «${dm.order.flowerName}» к ${dm.order.dueTimeLabel} за ${dm.order.reward} ₽.`;
    }
  }

  const flowerListHint = Object.values(FLOWERS_CATALOG)
    .map((f) => `${f.id}:${f.name}`)
    .join(', ');

  let badgeHint = '';
  if (badgeName && dm.knowsMasterName) {
    const playerGender = resolvePlayerGender(badgeName, gameState.playerGender);
    const alreadyNamed = (dm.thread || []).some(
      (m) => m.sender === 'client' && m.text.toLowerCase().includes(badgeName.toLowerCase())
    );
    if (!alreadyNamed) {
      badgeHint = `\nИмя флориста: «${badgeName}». ${getBadgeRuleText(badgeName, playerGender)}`;
    }
  }

  const photoPromptPart = attachedPhoto
    ? `\nК ЭТОМУ СООБЩЕНИЮ ФЛОРИСТ ПРИКРЕПИЛ ФОТО: "${attachedPhoto.description || 'Авторский букет'}"${attachedPhoto.price ? ` (стоимость примерно ${attachedPhoto.price} ₽)` : ''}. Отреагируй абсолютно естественно и по-своему (без шаблонов): можешь восхититься, спросить что за конкретный цветок внутри, уточнить цену, размер, или просто поблагодарить — выбирай разную живую реакцию!`
    : '';

  const prompt = `Ты — абсолютно уникальный, живой клиент ${dm.senderName} в Direct цветочного магазина "${gameState.shopName || 'Fleur Atelier'}".
Сейчас время: ${nowTime}, лавка открыта до ${closeTime}.
Статус заявки: ${orderStatusStr}${badgeHint}${photoPromptPart}

Переписка:
${threadText}
Последнее сообщение флориста: "${playerText || '(отправил фото без текста)'}"

ВАЖНЕЙШИЕ ПРАВИЛА:
1. Никаких шаблонных фраз. Веди себя как реальный человек со своим настроением и характером — можешь пошутить, усомниться, поболтать, пофлиртовать, если уместно, или резко ответить, если флорист шутит странно (например, называет нереальную цену в 20000 ₽).
2. Веди себя как настоящий живой человек в мессенджере: НИКОГДА не говори про «кнопки», «нажмите принять/отказать», «подтвердите кнопкой», «интерфейс». Общайся естественно — договаривайся по-человечески словами!
3. Если заказа ещё вообще не было, но в диалоге вы с флористом договорились на букет к конкретному времени до закрытия — заполни "proposeOrder": {"typeId": "rose_red", "qty": 5, "reward": 1200, "dueTime": "18:00"}, иначе null.
4. "blockedByClient": true ТОЛЬКО при прямых грубых оскорблениях и матах.
Доступные id цветов: ${flowerListHint}.

ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{"reply": "твой живой ответ", "moodDelta": 1, "followerDelta": 0, "blockedByClient": false, "proposeOrder": null}`;

  try {
    const raw = await callAI([{ role: 'user', content: prompt }]);
    const cleaned = stripCodeFences(raw);
    const s = cleaned.indexOf('{');
    const e = cleaned.lastIndexOf('}');
    if (s !== -1 && e > s) {
      const parsed = JSON.parse(cleaned.slice(s, e + 1));
      const reply = String(parsed.reply || 'Понял(а), спасибо за ответ!').trim();
      let proposedOrder = null;

      if (!dm.order && parsed.proposeOrder && typeof parsed.proposeOrder === 'object') {
        proposedOrder = buildDirectOrderData({
          parsedOrder: parsed.proposeOrder,
          playerText,
          replyText: reply,
          existingOrder: null
        });
      }

      return {
        reply,
        moodDelta: Math.max(-5, Math.min(5, Number(parsed.moodDelta) || 0)),
        followerDelta: Math.max(-1, Math.min(2, Number(parsed.followerDelta) || 0)),
        blockedByClient: Boolean(parsed.blockedByClient),
        proposedOrder
      };
    }
  } catch (err) {
    console.warn('Fallback ответа в Direct:', err);
  }

  return runOfflineDirectFollowUp(dm, playerText, attachedPhoto);
}

function runOfflineDirectFollowUp(dm, playerText, attachedPhoto = null) {
  const badgeName = String(gameState.playerBadgeName || '').trim();
  const alreadyNamed = badgeName
    ? (dm.thread || []).some((m) => m.sender === 'client' && m.text.toLowerCase().includes(badgeName.toLowerCase()))
    : true;
  const useNameInDm = Boolean(badgeName && dm.knowsMasterName && !alreadyNamed && Math.random() < 0.45);
  const dmNameTag = useNameInDm ? `, ${badgeName}` : '';

  if (attachedPhoto) {
    if (attachedPhoto.type === 'shop') {
      return {
        reply: pickRandom([
          `Ого, какая уютная атмосфера у вас в зале${dmNameTag}! Прямо настроение поднялось 🌸`,
          `Ух ты, так красиво всё расставлено! Обязательно как-нибудь загляну вживую.`
        ]),
        moodDelta: 3,
        followerDelta: 1,
        blockedByClient: false,
        proposedOrder: null
      };
    }

    const desc = attachedPhoto.description || 'этот букет';
    const firstId = attachedPhoto.items?.[0];
    const flowerMeta = firstId ? FLOWERS_CATALOG[firstId] : null;
    const priceHint = attachedPhoto.price ? `${attachedPhoto.price} ₽` : '';

    const reactions = [
      flowerMeta
        ? `Ой, красиво! А вот это «${flowerMeta.name}» в составе, да? Очень гармонично смотрится!`
        : `Красиво собрано${dmNameTag}! Подскажите, что за основные цветочки тут внутри?`,
      priceHint
        ? `Ух ты, стильно выглядит (${desc})! Это выйдет примерно в ${priceHint}?`
        : `Очень нежное сочетание на снимке! Как долго такой букет простоит в вазе?`,
      `Вау, прямо как с открытки! Такой букетик точно произведёт впечатление 💐`,
      `Интересный вариант${dmNameTag}, цвета очень приятные! А вживую он такой же пышный?`
    ];

    let proposedOrder = null;
    const dueSlot = computePreorderDueSlot();
    if (!dm.order && dueSlot && attachedPhoto.items?.length && Math.random() < 0.45) {
      const meta = flowerMeta || FLOWERS_CATALOG.rose_red;
      const qty = Math.max(1, attachedPhoto.stemsCount || attachedPhoto.items.length || 3);
      const reward = attachedPhoto.price || (meta.price * qty + 100);
      proposedOrder = {
        typeId: meta.id,
        flowerName: meta.name,
        qty,
        reward,
        dueMinutes: dueSlot.dueMinutes,
        dueTimeLabel: dueSlot.dueTimeLabel
      };
    }

    return {
      reply: pickRandom(reactions),
      moodDelta: 3,
      followerDelta: 1,
      blockedByClient: false,
      proposedOrder
    };
  }

  const priceMention = parsePriceFromText(playerText);
  if (priceMention && dm.order && priceMention > dm.order.reward * 2) {
    return {
      reply: `${priceMention} ₽?! Вы шутите, надеюсь? 😄 За такую сумму я точно пас.`,
      moodDelta: -2,
      followerDelta: 0,
      blockedByClient: false,
      proposedOrder: null
    };
  }

  if (dm.order) {
    if (dm.order.accepted) {
      return {
        reply: pickRandom([
          `Хорошо${dmNameTag}, понял(а)! Тогда до встречи к ${dm.order.dueTimeLabel} 🌸`,
          `Супер, я уже планирую время, буду к ${dm.order.dueTimeLabel}!`
        ]),
        moodDelta: 1,
        followerDelta: 0,
        blockedByClient: false,
        proposedOrder: null
      };
    }
    if (dm.order.rejected) {
      return {
        reply: pickRandom([
          'Да, я уже понял(а), что заказ не получится взять. Хорошего дня!',
          'Ничего страшного, в следующий раз загляну к вам заранее.'
        ]),
        moodDelta: 0,
        followerDelta: 0,
        blockedByClient: false,
        proposedOrder: null
      };
    }
    return {
      reply: pickRandom([
        `Услышал(а) вас${dmNameTag}! Напишите тогда, берётесь ли за этот заказ к ${dm.order.dueTimeLabel}, чтобы я точно знал(а) 😊`,
        `Понял(а)! Ну что, получится подготовить к назначенному времени или лучше в другой день?`
      ]),
      moodDelta: 0,
      followerDelta: 0,
      blockedByClient: false,
      proposedOrder: null
    };
  }

  const dueSlot = computePreorderDueSlot();
  const mentioned = detectMentionedFlowers(playerText);
  if (dueSlot && playerText.trim().length >= 6 && Math.random() < (mentioned.length ? 0.55 : 0.3)) {
    const chosenId = mentioned.length ? pickRandom(mentioned) : pickRandom(Object.keys(FLOWERS_CATALOG));
    const meta = FLOWERS_CATALOG[chosenId] || FLOWERS_CATALOG.rose_red;
    const qty = parseQtyFromText(playerText) || (3 + Math.floor(Math.random() * 5));
    const reward = parsePriceFromText(playerText) || (meta.price * qty + 140);
    return {
      reply: `Ой, звучит отлично${dmNameTag}! Можно я тогда оставлю заявку на ${qty} шт. «${meta.name}» к ${dueSlot.dueTimeLabel} за ${reward} ₽? Жду вашего ответа!`,
      moodDelta: 3,
      followerDelta: 1,
      blockedByClient: false,
      proposedOrder: {
        typeId: meta.id,
        flowerName: meta.name,
        qty,
        reward,
        dueMinutes: dueSlot.dueMinutes,
        dueTimeLabel: dueSlot.dueTimeLabel
      }
    };
  }

  if (dm.kind === 'review') {
    return {
      reply: pickRandom([
        `И вам спасибо${dmNameTag} за душевную работу! Буду забегать чаще ❤️`,
        `Приятно, когда мастера так отвечают. Успехов вашему магазинчику!`
      ]),
      moodDelta: 2,
      followerDelta: 1,
      blockedByClient: false,
      proposedOrder: null
    };
  }

  return {
    reply: pickRandom([
      `Спасибо за ответ${dmNameTag}! Если что — скоро загляну к вам в гости 🌸`,
      `Понял(а), звучит здорово! Хорошего рабочего дня ✨`,
      `Круто, спасибо что подсказали! Будем на связи.`
    ]),
    moodDelta: 2,
    followerDelta: 1,
    blockedByClient: false,
    proposedOrder: null
  };
}
```

## File: js/graphics/avatarSvg.js
```javascript
/**
 * Генератор векторных портретов клиентов с учётом пола, возраста и эмоций
 */

export function getClientAvatarSvg(appearance, mood = 65) {
  const {
    gender = 'female',
    age = 28,
    skin = '#F9D9C6',
    hairStyle = 'bob',
    hairColor = '#6B4C3B',
    shirtColor = '#D98A7C',
    hasGlasses = false,
    hasBeard = false,
    bgTint = '#F2E7DC'
  } = appearance || {};

  const isMale = gender === 'male';
  const isSenior = age >= 52;
  const isHappy = mood >= 65;
  const isAngry = mood < 35;

  // Брови
  const browLeft = isAngry
    ? '<path d="M33 40 L43 43" stroke="#4A3E39" stroke-width="2" stroke-linecap="round"/>'
    : isHappy
    ? '<path d="M33 41 Q38 38 43 40" stroke="#4A3E39" stroke-width="1.8" stroke-linecap="round" fill="none"/>'
    : '<path d="M33 41 L43 41" stroke="#4A3E39" stroke-width="1.8" stroke-linecap="round"/>';

  const browRight = isAngry
    ? '<path d="M67 40 L57 43" stroke="#4A3E39" stroke-width="2" stroke-linecap="round"/>'
    : isHappy
    ? '<path d="M57 40 Q62 38 67 41" stroke="#4A3E39" stroke-width="1.8" stroke-linecap="round" fill="none"/>'
    : '<path d="M57 41 L67 41" stroke="#4A3E39" stroke-width="1.8" stroke-linecap="round"/>';

  // Ротик (у мужчин без помады, поспокойнее)
  const mouthColor = isMale ? '#7D5851' : '#B5625D';
  const mouth = isHappy
    ? `<path d="M43 60 Q50 65 57 60" stroke="${mouthColor}" stroke-width="2.1" stroke-linecap="round" fill="none"/>`
    : isAngry
    ? `<path d="M44 63 Q50 58 56 63" stroke="${mouthColor}" stroke-width="2.1" stroke-linecap="round" fill="none"/>`
    : `<path d="M45 61 L55 61" stroke="${mouthColor}" stroke-width="2" stroke-linecap="round"/>`;

  // Задний слой волос (только у женщин)
  let hairBack = '';
  if (!isMale) {
    if (hairStyle === 'long') {
      hairBack = `<path d="M23 42 Q21 76 29 88 L71 88 Q79 76 77 42 Q75 15 50 15 Q25 15 23 42 Z" fill="${hairColor}"/>`;
    } else if (hairStyle === 'bob') {
      hairBack = `<path d="M25 42 Q24 68 33 74 L67 74 Q76 68 75 42 Q73 16 50 16 Q27 16 25 42 Z" fill="${hairColor}"/>`;
    } else if (hairStyle === 'bun') {
      hairBack = `
        <circle cx="50" cy="13" r="11" fill="${hairColor}"/>
        <circle cx="50" cy="40" r="24" fill="${hairColor}"/>
      `;
    }
  }

  // Передние волосы
  let hairFront = '';
  if (isMale) {
    if (hairStyle === 'quiff') {
      hairFront = `<path d="M26 42 Q26 18 46 14 Q67 12 74 36 Q74 42 71 42 Q66 26 49 26 Q33 27 26 42 Z" fill="${hairColor}"/>`;
    } else if (hairStyle === 'buzz') {
      hairFront = `<path d="M27 38 Q28 19 50 19 Q72 19 73 38 Q65 28 50 28 Q35 28 27 38 Z" fill="${hairColor}"/>`;
    } else {
      hairFront = `<path d="M26 41 Q26 17 50 17 Q74 17 74 41 Q66 27 50 28 Q34 27 26 41 Z" fill="${hairColor}"/>`;
    }
  } else {
    hairFront = `<path d="M26 43 Q28 18 50 18 Q72 18 74 43 Q63 31 54 27 Q43 34 26 43 Z" fill="${hairColor}"/>`;
  }

  // Плечи (у мужчин шире)
  const shouldersSvg = isMale
    ? `<path d="M12 100 Q16 74 50 74 Q84 74 88 100 Z" fill="${shirtColor}"/>
       <path d="M40 73 L60 73 L50 84 Z" fill="#FFFDF9" opacity="0.7"/>`
    : `<path d="M18 100 Q22 76 50 76 Q78 76 82 100 Z" fill="${shirtColor}"/>`;

  // Румянец (только женщинам) и реснички
  const blushSvg = !isMale
    ? `<ellipse cx="35" cy="54" rx="4.5" ry="2.4" fill="#F29E9D" opacity="0.45"/>
       <ellipse cx="65" cy="54" rx="4.5" ry="2.4" fill="#F29E9D" opacity="0.45"/>
       <path d="M36 45 L33 43 M64 45 L67 43" stroke="#4A3E39" stroke-width="1.3" stroke-linecap="round"/>`
    : '';

  // Бородка/усы или морщины
  const beardSvg =
    isMale && hasBeard
      ? `<path d="M31 56 Q33 74 50 74 Q67 74 69 56 Q64 65 50 65 Q36 65 31 56 Z" fill="${hairColor}" opacity="0.82"/>`
      : '';

  const wrinklesSvg = isSenior
    ? `<path d="M42 29 L58 29" stroke="#C5A38D" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
       <path d="M32 52 Q34 55 34 59 M68 52 Q66 55 66 59" stroke="#C5A38D" stroke-width="1" fill="none" opacity="0.55"/>`
    : '';

  const glassesSvg = hasGlasses
    ? `
      <g stroke="#5E4F48" stroke-width="1.6" fill="rgba(255,255,255,0.22)">
        <circle cx="39" cy="47" r="7"/>
        <circle cx="61" cy="47" r="7"/>
        <line x1="46" y1="47" x2="54" y2="47"/>
      </g>
    `
    : '';

  // Форма лица: у мужчин чуть шире подбородок
  const faceRx = isMale ? 17 : 22;

  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${bgTint}"/>
      ${hairBack}
      ${shouldersSvg}
      <path d="M42 72 L58 72 L56 82 Q50 85 44 82 Z" fill="${skin}"/>
      <circle cx="27" cy="49" r="4.5" fill="${skin}"/>
      <circle cx="73" cy="49" r="4.5" fill="${skin}"/>
      <rect x="28" y="24" width="44" height="49" rx="${faceRx}" fill="${skin}"/>
      ${blushSvg}
      ${beardSvg}
      ${wrinklesSvg}
      <circle cx="39" cy="47" r="2.7" fill="#4A3E39"/>
      <circle cx="61" cy="47" r="2.7" fill="#4A3E39"/>
      <circle cx="38" cy="46" r="0.9" fill="#FFFFFF"/>
      <circle cx="60" cy="46" r="0.9" fill="#FFFFFF"/>
      ${browLeft}
      ${browRight}
      ${mouth}
      ${glassesSvg}
      ${hairFront}
    </svg>
  `;
}
```

## File: js/graphics/flowersSvg.js
```javascript
/**
 * Генератор векторных SVG-иллюстраций цветов и ваз
 */

export function getSingleFlowerWrappedSvg(flowerId) {
  const flowerArt = getSingleFlowerSvg(flowerId);
  return `
    <svg viewBox="22 8 56 72" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      ${flowerArt}
    </svg>
  `;
}

export function getFlowerSvgDataUrl(flowerId) {
  const svg = getSingleFlowerWrappedSvg(flowerId);
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export function getFlowerInVaseSvg(flowerId, vaseColor = '#E7D8C9') {
  const flowerArt = getSingleFlowerSvg(flowerId);

  return `
    <svg viewBox="0 0 100 115" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <!-- Несколько стеблей в вазе для пышности -->
      <g transform="translate(-10, 4) rotate(-8 50 75)">
        ${flowerArt}
      </g>
      <g transform="translate(10, 5) rotate(9 50 75)">
        ${flowerArt}
      </g>
      <g transform="translate(0, 0)">
        ${flowerArt}
      </g>

      <!-- Пастельная керамическая ваза -->
      <path d="M33 68 L67 68 L73 98 Q74 108 62 109 L38 109 Q26 108 27 98 Z" fill="${vaseColor}" stroke="#8C7B73" stroke-opacity="0.25" stroke-width="1.5"/>
      <!-- Горлышко вазы -->
      <ellipse cx="50" cy="68" rx="18" ry="4" fill="#FFFDF9" fill-opacity="0.65"/>
      <!-- Мягкий блик на вазе -->
      <path d="M35 76 Q33 90 36 101" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-opacity="0.55" fill="none"/>
    </svg>
  `;
}

export function getSingleFlowerSvg(flowerId) {
  switch (flowerId) {
    case 'rose_red':
      return `
        <path d="M50 75 Q48 55 50 38" stroke="#5E8561" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 58 Q36 53 38 45 Q46 47 49 55 Z" fill="#77A17A"/>
        <path d="M50 53 Q63 48 61 40 Q53 42 50 50 Z" fill="#648D67"/>
        <!-- Бутон розы -->
        <path d="M38 30 Q38 42 50 42 Q62 42 62 30 Q60 18 50 18 Q40 18 38 30 Z" fill="#D96B70"/>
        <path d="M41 28 Q42 38 50 38 Q58 38 59 28 Q56 20 50 20 Q44 20 41 28 Z" fill="#E98387"/>
        <path d="M44 26 Q50 33 56 26 Q53 20 50 21 Q46 21 44 26 Z" fill="#F4A4A7"/>
        <path d="M47 24 Q50 28 53 24" stroke="#B84B51" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      `;

    case 'peony_pink':
      return `
        <path d="M50 75 Q52 55 50 37" stroke="#688E6B" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M50 56 Q37 50 39 43 Q47 45 50 54 Z" fill="#82AA85"/>
        <!-- Пышные лепестки пиона -->
        <circle cx="43" cy="28" r="10" fill="#F2AEBA"/>
        <circle cx="57" cy="28" r="10" fill="#F2AEBA"/>
        <circle cx="50" cy="22" r="11" fill="#F6C1CA"/>
        <circle cx="46" cy="31" r="9" fill="#FAD4DA"/>
        <circle cx="54" cy="31" r="9" fill="#FAD4DA"/>
        <circle cx="50" cy="27" r="7" fill="#FCE6EA"/>
        <circle cx="50" cy="27" r="3.2" fill="#F7D774"/>
      `;

    case 'tulip_yellow':
      return `
        <path d="M50 75 L50 38" stroke="#66916A" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 70 Q34 55 39 39 Q46 53 49 66 Z" fill="#7CA880"/>
        <path d="M51 68 Q65 54 61 40 Q54 54 51 66 Z" fill="#6D9871"/>
        <!-- Чашечка тюльпана -->
        <path d="M39 24 Q39 40 50 40 Q61 40 61 24 L56 17 L50 23 L44 17 Z" fill="#F4C752"/>
        <path d="M44 23 Q44 38 50 39 Q56 38 56 23 L50 16 Z" fill="#FAD977"/>
      `;

    case 'chamomile_white':
      return `
        <path d="M50 75 Q49 54 50 33" stroke="#6E9971" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <path d="M50 56 Q39 51 40 45 Q47 47 50 54 Z" fill="#84B087"/>
        <!-- Лепестки ромашки -->
        <g fill="#FFFDF9" stroke="#E5DDD3" stroke-width="0.7">
          <ellipse cx="50" cy="18" rx="4" ry="8"/>
          <ellipse cx="50" cy="36" rx="4" ry="8"/>
          <ellipse cx="41" cy="27" rx="8" ry="4"/>
          <ellipse cx="59" cy="27" rx="8" ry="4"/>
          <ellipse cx="43" cy="20" rx="4" ry="7" transform="rotate(-45 43 20)"/>
          <ellipse cx="57" cy="20" rx="4" ry="7" transform="rotate(45 57 20)"/>
          <ellipse cx="43" cy="34" rx="4" ry="7" transform="rotate(45 43 34)"/>
          <ellipse cx="57" cy="34" rx="4" ry="7" transform="rotate(-45 57 34)"/>
        </g>
        <circle cx="50" cy="27" r="5.5" fill="#F5C84C"/>
        <circle cx="48.5" cy="25.5" r="1.5" fill="#FCE588"/>
      `;

    case 'lavender_purple':
      return `
        <path d="M50 75 L50 20" stroke="#6E8F71" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M50 61 Q39 55 41 48 Q47 52 50 59 Z" fill="#7FA182"/>
        <!-- Соцветия лаванды -->
        <ellipse cx="46" cy="40" rx="4.2" ry="3" fill="#A488C4"/>
        <ellipse cx="54" cy="38" rx="4.2" ry="3" fill="#B59AD4"/>
        <ellipse cx="46" cy="32" rx="4" ry="2.8" fill="#B59AD4"/>
        <ellipse cx="54" cy="30" rx="4" ry="2.8" fill="#9A7CB9"/>
        <ellipse cx="47" cy="24" rx="3.5" ry="2.6" fill="#C6AEE0"/>
        <ellipse cx="53" cy="22" rx="3.5" ry="2.6" fill="#B59AD4"/>
        <ellipse cx="50" cy="17" rx="3.5" ry="3.2" fill="#CEB9E6"/>
      `;
case 'rose_white':
      return `
        <path d="M50 75 Q48 55 50 38" stroke="#5E8561" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 58 Q36 53 38 45 Q46 47 49 55 Z" fill="#77A17A"/>
        <path d="M50 53 Q63 48 61 40 Q53 42 50 50 Z" fill="#648D67"/>
        <path d="M38 30 Q38 42 50 42 Q62 42 62 30 Q60 18 50 18 Q40 18 38 30 Z" fill="#EFE8DC" stroke="#DFD5C5" stroke-width="0.8"/>
        <path d="M41 28 Q42 38 50 38 Q58 38 59 28 Q56 20 50 20 Q44 20 41 28 Z" fill="#F8F4EC"/>
        <path d="M44 26 Q50 33 56 26 Q53 20 50 21 Q46 21 44 26 Z" fill="#FFFDF9"/>
        <path d="M47 24 Q50 28 53 24" stroke="#D1C3AE" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      `;

    case 'rose_pink':
      return `
        <path d="M50 75 Q48 55 50 38" stroke="#5E8561" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 58 Q36 53 38 45 Q46 47 49 55 Z" fill="#77A17A"/>
        <path d="M50 53 Q63 48 61 40 Q53 42 50 50 Z" fill="#648D67"/>
        <path d="M38 30 Q38 42 50 42 Q62 42 62 30 Q60 18 50 18 Q40 18 38 30 Z" fill="#EA90A0"/>
        <path d="M41 28 Q42 38 50 38 Q58 38 59 28 Q56 20 50 20 Q44 20 41 28 Z" fill="#F3AAB7"/>
        <path d="M44 26 Q50 33 56 26 Q53 20 50 21 Q46 21 44 26 Z" fill="#FAC7D0"/>
        <path d="M47 24 Q50 28 53 24" stroke="#CC6E80" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      `;

    case 'peony_coral':
      return `
        <path d="M50 75 Q52 55 50 37" stroke="#688E6B" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M50 56 Q37 50 39 43 Q47 45 50 54 Z" fill="#82AA85"/>
        <circle cx="43" cy="28" r="10" fill="#F2947E"/>
        <circle cx="57" cy="28" r="10" fill="#F2947E"/>
        <circle cx="50" cy="22" r="11" fill="#F6A692"/>
        <circle cx="46" cy="31" r="9" fill="#FBBAA9"/>
        <circle cx="54" cy="31" r="9" fill="#FBBAA9"/>
        <circle cx="50" cy="27" r="7" fill="#FDD0C4"/>
        <circle cx="50" cy="27" r="3.2" fill="#F7D774"/>
      `;

    case 'tulip_red':
      return `
        <path d="M50 75 L50 38" stroke="#66916A" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 70 Q34 55 39 39 Q46 53 49 66 Z" fill="#7CA880"/>
        <path d="M51 68 Q65 54 61 40 Q54 54 51 66 Z" fill="#6D9871"/>
        <path d="M39 24 Q39 40 50 40 Q61 40 61 24 L56 17 L50 23 L44 17 Z" fill="#D45058"/>
        <path d="M44 23 Q44 38 50 39 Q56 38 56 23 L50 16 Z" fill="#E86D74"/>
      `;

    case 'tulip_purple':
      return `
        <path d="M50 75 L50 38" stroke="#66916A" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M49 70 Q34 55 39 39 Q46 53 49 66 Z" fill="#7CA880"/>
        <path d="M51 68 Q65 54 61 40 Q54 54 51 66 Z" fill="#6D9871"/>
        <path d="M39 24 Q39 40 50 40 Q61 40 61 24 L56 17 L50 23 L44 17 Z" fill="#9A72BA"/>
        <path d="M44 23 Q44 38 50 39 Q56 38 56 23 L50 16 Z" fill="#B591D1"/>
      `;

    case 'hydrangea_blue':
      return `
        <path d="M50 75 L50 38" stroke="#5E8561" stroke-width="3.4" stroke-linecap="round" fill="none"/>
        <path d="M49 61 Q35 54 37 46 Q46 49 49 58 Z" fill="#76A079"/>
        <path d="M51 58 Q65 51 63 43 Q54 46 51 55 Z" fill="#68916B"/>
        <circle cx="43" cy="24" r="7" fill="#8FBCE0"/>
        <circle cx="57" cy="24" r="7" fill="#8FBCE0"/>
        <circle cx="50" cy="18" r="7.5" fill="#A5CDF0"/>
        <circle cx="40" cy="32" r="6.5" fill="#9BC5E8"/>
        <circle cx="60" cy="32" r="6.5" fill="#9BC5E8"/>
        <circle cx="50" cy="33" r="7.5" fill="#B3D7F5"/>
        <circle cx="50" cy="26" r="7" fill="#C4E1F8"/>
        <circle cx="45" cy="22" r="1.6" fill="#FFF8D6"/>
        <circle cx="55" cy="23" r="1.6" fill="#FFF8D6"/>
        <circle cx="50" cy="29" r="1.6" fill="#FFF8D6"/>
      `;

    case 'sunflower':
      return `
        <path d="M50 75 L50 35" stroke="#5D845F" stroke-width="3.6" stroke-linecap="round" fill="none"/>
        <path d="M49 59 Q35 53 37 44 Q46 47 49 56 Z" fill="#76A079"/>
        <g fill="#F4C438">
          <ellipse cx="50" cy="14" rx="3.8" ry="8"/>
          <ellipse cx="50" cy="38" rx="3.8" ry="8"/>
          <ellipse cx="38" cy="26" rx="8" ry="3.8"/>
          <ellipse cx="62" cy="26" rx="8" ry="3.8"/>
          <ellipse cx="41.5" cy="17.5" rx="3.6" ry="7.5" transform="rotate(-45 41.5 17.5)"/>
          <ellipse cx="58.5" cy="17.5" rx="3.6" ry="7.5" transform="rotate(45 58.5 17.5)"/>
          <ellipse cx="41.5" cy="34.5" rx="3.6" ry="7.5" transform="rotate(45 41.5 34.5)"/>
          <ellipse cx="58.5" cy="34.5" rx="3.6" ry="7.5" transform="rotate(-45 58.5 34.5)"/>
        </g>
        <circle cx="50" cy="26" r="8" fill="#5E402E"/>
        <circle cx="50" cy="26" r="5" fill="#73513B"/>
      `;

    case 'iris_blue':
      return `
        <path d="M50 75 L50 35" stroke="#5E8762" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M49 68 Q41 52 44 39 Q48 53 49 65 Z" fill="#77A17A"/>
        <path d="M50 13 Q57 20 50 30 Q43 20 50 13 Z" fill="#5D74C4"/>
        <path d="M36 25 Q43 20 49 29 Q41 34 36 25 Z" fill="#4D62B3"/>
        <path d="M64 25 Q57 20 51 29 Q59 34 64 25 Z" fill="#4D62B3"/>
        <path d="M41 37 Q46 28 50 30 Q48 39 41 37 Z" fill="#6F86D4"/>
        <path d="M59 37 Q54 28 50 30 Q52 39 59 37 Z" fill="#6F86D4"/>
        <ellipse cx="50" cy="29" rx="2.5" ry="4" fill="#F2C84B"/>
      `;

    case 'chrysanthemum_white':
      return `
        <path d="M50 75 L50 35" stroke="#628A65" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M50 56 Q38 51 40 44 Q47 47 50 54 Z" fill="#7CA67F"/>
        <g fill="#FFFDF9" stroke="#E0D8CE" stroke-width="0.6">
          <circle cx="50" cy="16" r="5"/>
          <circle cx="42" cy="19" r="5"/>
          <circle cx="58" cy="19" r="5"/>
          <circle cx="38" cy="26" r="5"/>
          <circle cx="62" cy="26" r="5"/>
          <circle cx="42" cy="33" r="5"/>
          <circle cx="58" cy="33" r="5"/>
          <circle cx="50" cy="36" r="5"/>
          <circle cx="46" cy="22" r="4.5"/>
          <circle cx="54" cy="22" r="4.5"/>
          <circle cx="46" cy="30" r="4.5"/>
          <circle cx="54" cy="30" r="4.5"/>
          <circle cx="50" cy="26" r="5"/>
        </g>
        <circle cx="50" cy="26" r="2.8" fill="#EFE4B8"/>
      `;

    case 'carnation_red':
      return `
        <path d="M50 75 L50 36" stroke="#5B8064" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <path d="M49 58 Q40 50 42 43 Q47 48 49 56 Z" fill="#6E9477"/>
        <path d="M46 37 L54 37 L52 31 L48 31 Z" fill="#5B8064"/>
        <path d="M37 26 Q39 36 50 35 Q61 36 63 26 L60 20 L56 23 L53 17 L50 22 L47 17 L44 23 L40 20 Z" fill="#C94652"/>
        <path d="M41 25 Q45 32 50 31 Q55 32 59 25 L55 20 L50 24 L45 20 Z" fill="#DE626E"/>
      `;

    case 'gypsophila':
      return `
        <path d="M50 75 L50 42" stroke="#7A9E7C" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M50 46 L39 27 M50 44 L61 28 M50 42 L50 20 M44 36 L36 33 M56 36 L64 34" stroke="#7A9E7C" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        <g fill="#FFFDF9" stroke="#E2DCD3" stroke-width="0.6">
          <circle cx="39" cy="27" r="3.4"/>
          <circle cx="35" cy="33" r="3"/>
          <circle cx="44" cy="21" r="3.2"/>
          <circle cx="50" cy="18" r="3.6"/>
          <circle cx="56" cy="22" r="3.1"/>
          <circle cx="61" cy="28" r="3.4"/>
          <circle cx="64" cy="34" r="2.9"/>
          <circle cx="48" cy="29" r="3.2"/>
          <circle cx="54" cy="32" r="3"/>
        </g>
      `;

    case 'eucalyptus':
      return `
        <path d="M50 75 Q49 48 50 15" stroke="#6E8D78" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <g fill="#84A893" stroke="#6B8E7A" stroke-width="0.6">
          <ellipse cx="42" cy="54" rx="5.5" ry="3.8" transform="rotate(-25 42 54)"/>
          <ellipse cx="58" cy="49" rx="5.5" ry="3.8" transform="rotate(25 58 49)"/>
          <ellipse cx="42" cy="41" rx="5.5" ry="3.8" transform="rotate(-25 42 41)"/>
          <ellipse cx="58" cy="36" rx="5.5" ry="3.8" transform="rotate(25 58 36)"/>
          <ellipse cx="43" cy="28" rx="5" ry="3.5" transform="rotate(-25 43 28)"/>
          <ellipse cx="57" cy="24" rx="5" ry="3.5" transform="rotate(25 57 24)"/>
          <ellipse cx="50" cy="15" rx="3.8" ry="4.5"/>
        </g>
      `;
    case 'lily_white':
    default:
      return `
        <path d="M50 75 L50 35" stroke="#5E8762" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M50 56 Q62 50 60 42 Q53 45 50 53 Z" fill="#77A37B"/>
        <!-- Звёздчатые лепестки лилии -->
        <path d="M50 12 Q57 22 50 32 Q43 22 50 12 Z" fill="#FFFDF9" stroke="#E7DED5" stroke-width="0.9"/>
        <path d="M35 24 Q44 21 50 31 Q40 33 35 24 Z" fill="#FFF8F5" stroke="#E7DED5" stroke-width="0.9"/>
        <path d="M65 24 Q56 21 50 31 Q60 33 65 24 Z" fill="#FFF8F5" stroke="#E7DED5" stroke-width="0.9"/>
        <path d="M39 39 Q44 30 50 31 Q47 40 39 39 Z" fill="#FFFDF9" stroke="#E7DED5" stroke-width="0.9"/>
        <path d="M61 39 Q56 30 50 31 Q53 40 61 39 Z" fill="#FFFDF9" stroke="#E7DED5" stroke-width="0.9"/>
        <circle cx="50" cy="29" r="3.2" fill="#F2B5B5"/>
        <circle cx="48" cy="26" r="1.2" fill="#E39B4B"/>
        <circle cx="52" cy="26" r="1.2" fill="#E39B4B"/>
      `;
  }
}
```

## File: js/graphics/shopScenerySvg.js
```javascript
/**
 * js/graphics/shopScenerySvg.js
 * Процедурная векторная графика и SVG-элементы торгового зала (окна, арки, декор)
 */

import { ACCESSORIES_CATALOG } from '../config.js';
import { gameState } from '../state.js';

export function isShopDecorVisible(id) {
  if (id === 'fridge') {
    return (
      Boolean(gameState.hasFridge || (gameState.decor || []).includes('fridge')) &&
      !(gameState.hiddenDecor || []).includes('fridge')
    );
  }
  return (gameState.decor || []).includes(id) && !(gameState.hiddenDecor || []).includes(id);
}

export function renderShopTopDecor(hasNeon) {
  const parts = [];
  if (isShopDecorVisible('shop_arch')) {
    parts.push(`
      <div class="shop-arch-svg-wrap" title="Цветочная арка с плющом">
        <svg viewBox="0 0 360 40" width="100%" height="36" preserveAspectRatio="none">
          <path d="M4,38 Q18,8 78,8 L282,8 Q342,8 356,38" fill="none" stroke="#5A8357" stroke-width="5" stroke-linecap="round"/>
          <path d="M12,35 Q30,13 90,12 L270,12 Q330,13 348,35" fill="none" stroke="#7AA573" stroke-width="3" stroke-linecap="round"/>
          <g fill="#6E9E69">
            <ellipse cx="32" cy="18" rx="9" ry="5" transform="rotate(-25 32 18)"/>
            <ellipse cx="64" cy="10" rx="9" ry="4.5" transform="rotate(10 64 10)"/>
            <ellipse cx="110" cy="9" rx="10" ry="4.5"/>
            <ellipse cx="155" cy="9" rx="9" ry="4.5" transform="rotate(-10 155 9)"/>
            <ellipse cx="205" cy="9" rx="9" ry="4.5" transform="rotate(10 205 9)"/>
            <ellipse cx="250" cy="9" rx="10" ry="4.5"/>
            <ellipse cx="296" cy="10" rx="9" ry="4.5" transform="rotate(-10 296 10)"/>
            <ellipse cx="328" cy="18" rx="9" ry="5" transform="rotate(25 328 18)"/>
          </g>
          <g>
            <circle cx="20" cy="28" r="5" fill="#F29AA4"/><circle cx="20" cy="28" r="2" fill="#FFE28A"/>
            <circle cx="88" cy="10" r="4.5" fill="#F6B8BF"/><circle cx="88" cy="10" r="1.8" fill="#FFE28A"/>
            <circle cx="180" cy="10" r="5" fill="#F29AA4"/><circle cx="180" cy="10" r="2" fill="#FFE28A"/>
            <circle cx="272" cy="10" r="4.5" fill="#F6B8BF"/><circle cx="272" cy="10" r="1.8" fill="#FFE28A"/>
            <circle cx="340" cy="28" r="5" fill="#F29AA4"/><circle cx="340" cy="28" r="2" fill="#FFE28A"/>
          </g>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('hearts_garland_shop')) {
    parts.push(`
      <div class="shop-hearts-svg-wrap" title="Гирлянда из сердечек">
        <svg viewBox="0 0 340 28" width="100%" height="26">
          <path d="M10,5 Q90,18 170,6 Q250,18 330,5" fill="none" stroke="#C99B95" stroke-width="1.6"/>
          ${[
            { x: 42, y: 12, c: '#E87A88' },
            { x: 96, y: 14, c: '#F4A6B1' },
            { x: 148, y: 10, c: '#DF5F73' },
            { x: 196, y: 10, c: '#F4A6B1' },
            { x: 248, y: 14, c: '#E87A88' },
            { x: 298, y: 12, c: '#DF5F73' }
          ]
            .map(
              (h) => `
            <g transform="translate(${h.x}, ${h.y})">
              <path d="M0,3 C-4,-2 -9,2 -5,7 L0,12 L5,7 C9,2 4,-2 0,3 Z" fill="${h.c}" stroke="#FFFDF9" stroke-width="0.9"/>
            </g>
          `
            )
            .join('')}
        </svg>
      </div>
    `);
  }
  if (hasNeon) {
    parts.push(
      `<div class="shop-neon-badge">✨ ${escapeHtml(gameState.shopName || 'Fleur Atelier')} ✨</div>`
    );
  }
  return parts.join('');
}

export function renderShopDecorVisuals() {
  const wallItems = [];
  const floorItems = [];

  if (isShopDecorVisible('wreath_shop')) {
    wallItems.push(`
      <div class="shop-decor-svg-item" title="Праздничный венок">
        <svg viewBox="0 0 64 64" width="52" height="52">
          <circle cx="32" cy="33" r="20" fill="none" stroke="#4D7D4E" stroke-width="11"/>
          <circle cx="32" cy="33" r="20" fill="none" stroke="#6E9F6C" stroke-width="7" stroke-dasharray="6 4"/>
          <circle cx="18" cy="22" r="2.6" fill="#D9534F"/>
          <circle cx="46" cy="24" r="2.6" fill="#D9534F"/>
          <circle cx="21" cy="46" r="2.6" fill="#E8B84B"/>
          <circle cx="44" cy="45" r="2.6" fill="#D9534F"/>
          <path d="M24,14 C20,8 29,7 32,14 C35,7 44,8 40,14 L32,18 Z" fill="#D95A62"/>
          <path d="M30,17 L24,27 M34,17 L40,27" stroke="#D95A62" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </div>
    `);
  }

  if (isShopDecorVisible('shop_mirror')) {
    wallItems.push(`
      <div class="shop-decor-svg-item" title="Винтажное зеркало">
        <svg viewBox="0 0 56 68" width="46" height="56">
          <ellipse cx="28" cy="34" rx="20" ry="27" fill="#C9A36B" stroke="#8F6E3E" stroke-width="2.5"/>
          <ellipse cx="28" cy="34" rx="15" ry="22" fill="#DCECF5" stroke="#EAD4A6" stroke-width="1.5"/>
          <path d="M20,22 L32,16 M18,32 L35,23" stroke="rgba(255,255,255,0.8)" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="28" cy="8" r="2.2" fill="#DFB66B"/>
        </svg>
      </div>
    `);
  }

  if (isShopDecorVisible('shop_chalkboard')) {
    wallItems.push(`
      <div class="shop-decor-svg-item" title="Меловая доска «Букет дня»">
        <svg viewBox="0 0 70 64" width="58" height="52">
          <path d="M20,12 L35,3 L50,12" fill="none" stroke="#9D7D63" stroke-width="2"/>
          <rect x="8" y="12" width="54" height="46" rx="5" fill="#A97D59" stroke="#7E5B3E" stroke-width="2"/>
          <rect x="13" y="17" width="44" height="36" rx="2" fill="#3B4540"/>
          <text x="35" y="28" text-anchor="middle" fill="#F5EFE6" font-size="7" font-weight="bold">БУКЕТ ДНЯ</text>
          <path d="M35,47 L35,36 M35,42 L30,39 M35,44 L40,40" stroke="#98C496" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="35" cy="35" r="3.5" fill="#F29AA4"/>
        </svg>
      </div>
    `);
  }

  if (gameState.hasFridge && !(gameState.hiddenDecor || []).includes('fridge')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Холодильная витрина">
        <svg viewBox="0 0 60 76" width="50" height="64">
          <rect x="8" y="6" width="44" height="66" rx="6" fill="#E8F3F7" stroke="#A6C1CC" stroke-width="2.5"/>
          <rect x="13" y="12" width="34" height="46" rx="3" fill="#D2EAF4"/>
          <line x1="13" y1="35" x2="47" y2="35" stroke="#A6C1CC" stroke-width="2"/>
          <circle cx="24" cy="27" r="4.5" fill="#E87A88"/><circle cx="35" cy="27" r="4.5" fill="#F2B8C0"/>
          <circle cx="25" cy="49" r="4.5" fill="#F4C752"/><circle cx="36" cy="49" r="4.5" fill="#B59ED6"/>
          <line x1="43" y1="26" x2="43" y2="42" stroke="#7EA6B8" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M18,18 L28,15 M18,22 L24,20" stroke="rgba(255,255,255,0.8)" stroke-width="2" stroke-linecap="round"/>
          <rect x="12" y="61" width="36" height="6" rx="2" fill="#B8D0DA"/>
        </svg>
      </div>
    `);
  }

  if (isShopDecorVisible('pumpkins_shop')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Осенние тыквы">
        <svg viewBox="0 0 88 58" width="76" height="50">
          <path d="M10,50 Q4,42 14,39 Q18,46 10,50 Z" fill="#D96E34"/>
          <path d="M77,50 Q84,42 74,39 Q70,46 77,50 Z" fill="#E6A445"/>
          <path d="M35,18 Q36,12 40,11" fill="none" stroke="#5A7247" stroke-width="3" stroke-linecap="round"/>
          <ellipse cx="36" cy="36" rx="19" ry="15" fill="#DF7135" stroke="#B55220" stroke-width="1.5"/>
          <ellipse cx="36" cy="36" rx="12" ry="15" fill="#EB8243"/>
          <ellipse cx="36" cy="36" rx="5.5" ry="15" fill="#F29457"/>
          <path d="M62,25 Q63,20 66,19" fill="none" stroke="#5A7247" stroke-width="2.5" stroke-linecap="round"/>
          <ellipse cx="62" cy="40" rx="13" ry="11" fill="#E8AE52" stroke="#C48B32" stroke-width="1.3"/>
          <ellipse cx="62" cy="40" rx="6" ry="11" fill="#F2C06B"/>
          <ellipse cx="20" cy="44" rx="9" ry="7.5" fill="#ED954B" stroke="#C26B27" stroke-width="1.2"/>
          <ellipse cx="20" cy="44" rx="4" ry="7.5" fill="#F6AC66"/>
        </svg>
      </div>
    `);
  }

  if (isShopDecorVisible('xmas_tree_shop')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Новогодняя ёлка">
        <svg viewBox="0 0 68 80" width="58" height="68">
          <rect x="27" y="64" width="14" height="10" rx="2" fill="#9E6B4B"/>
          <polygon points="34,26 11,64 57,64" fill="#3D7047"/>
          <polygon points="34,17 15,48 53,48" fill="#4B8556"/>
          <polygon points="34,10 20,33 48,33" fill="#5B9966"/>
          <path d="M23,28 Q34,34 45,28 M18,44 Q34,51 50,44 M14,58 Q34,65 54,58" fill="none" stroke="#FFE27A" stroke-width="2"/>
          <circle cx="28" cy="27" r="2.7" fill="#E45A63"/>
          <circle cx="40" cy="39" r="2.7" fill="#F4C752"/>
          <circle cx="24" cy="47" r="2.7" fill="#7FB8E0"/>
          <circle cx="44" cy="56" r="2.7" fill="#E45A63"/>
          <circle cx="30" cy="57" r="2.7" fill="#F4C752"/>
          <polygon points="34,2 36,7 41,7 37,10 38,15 34,12 30,15 31,10 27,7 32,7" fill="#FFD95E"/>
        </svg>
      </div>
    `);
  }

  if (isShopDecorVisible('vintage_vase')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Антикварная фарфоровая ваза">
        <svg viewBox="0 0 48 64" width="40" height="54">
          <ellipse cx="24" cy="59" rx="11" ry="3" fill="#B5C4D1"/>
          <path d="M17,18 Q13,34 15,52 Q24,58 33,52 Q35,34 31,18 Z" fill="#F8FBFE" stroke="#8CA8C4" stroke-width="1.8"/>
          <ellipse cx="24" cy="17" rx="8" ry="3" fill="#DDE8F2" stroke="#8CA8C4" stroke-width="1.5"/>
          <path d="M17,33 Q24,38 31,33" fill="none" stroke="#6E92B5" stroke-width="1.6"/>
          <circle cx="24" cy="42" r="4" fill="#89A9C9"/>
          <circle cx="24" cy="42" r="1.5" fill="#F8FBFE"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('retro_gramophone')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Ретро-граммофон">
        <svg viewBox="0 0 64 64" width="52" height="52">
          <rect x="10" y="42" width="40" height="16" rx="3" fill="#9A6844" stroke="#6E472B" stroke-width="1.8"/>
          <rect x="16" y="47" width="28" height="6" rx="2" fill="#C4935E"/>
          <ellipse cx="28" cy="42" rx="14" ry="3" fill="#2E2A2B"/>
          <path d="M36,41 L42,26" stroke="#D1A654" stroke-width="3" stroke-linecap="round"/>
          <path d="M40,26 C26,12 18,10 14,22 C18,32 30,30 40,26 Z" fill="#E3B964" stroke="#B68B3A" stroke-width="1.6"/>
          <ellipse cx="16" cy="20" rx="5" ry="9" transform="rotate(-18 16 20)" fill="#C99B45"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('marble_pedestal')) {
    floorItems.push(`
      <div class="shop-decor-svg-item" title="Мраморная тумба с кашпо">
        <svg viewBox="0 0 54 68" width="44" height="56">
          <rect x="11" y="56" width="32" height="7" rx="2" fill="#E9E5DF" stroke="#C5BEB4" stroke-width="1.3"/>
          <rect x="16" y="30" width="22" height="26" fill="#F6F3EE" stroke="#CEC7BD" stroke-width="1.3"/>
          <line x1="21" y1="32" x2="21" y2="54" stroke="#DCD5CA" stroke-width="1.4"/>
          <line x1="27" y1="32" x2="27" y2="54" stroke="#DCD5CA" stroke-width="1.4"/>
          <line x1="33" y1="32" x2="33" y2="54" stroke="#DCD5CA" stroke-width="1.4"/>
          <rect x="10" y="25" width="34" height="6" rx="2" fill="#ECE8E1" stroke="#C5BEB4" stroke-width="1.3"/>
          <polygon points="18,15 36,15 33,25 21,25" fill="#D9A78B"/>
          <circle cx="27" cy="11" r="7" fill="#7D9E7F"/>
          <circle cx="22" cy="12" r="4" fill="#F29AA4"/>
          <circle cx="32" cy="12" r="4" fill="#F6B8BF"/>
        </svg>
      </div>
    `);
  }
  if (isShopDecorVisible('gold_frame_art')) {
    wallItems.push(`
      <div class="shop-decor-svg-item" title="Картина в золотой раме">
        <svg viewBox="0 0 64 56" width="54" height="46">
          <rect x="6" y="6" width="52" height="44" rx="4" fill="#DFB66B" stroke="#A67E38" stroke-width="2"/>
          <rect x="12" y="12" width="40" height="32" rx="2" fill="#FAF4E8" stroke="#C49A4E" stroke-width="1.2"/>
          <path d="M32,39 Q32,26 26,22 M32,39 Q34,27 39,23" stroke="#6E9971" stroke-width="1.8" fill="none"/>
          <circle cx="25" cy="21" r="4.5" fill="#E87A88"/>
          <circle cx="39" cy="22" r="4.5" fill="#F4C752"/>
          <circle cx="32" cy="18" r="5" fill="#F29AA4"/>
        </svg>
      </div>
    `);
  }

  const accShelfHtml = renderShopAccessoriesBar(gameState.shopLocationId);
  if (!wallItems.length && !floorItems.length && !accShelfHtml) return '';

  return `
    ${
      wallItems.length || floorItems.length
        ? `
      <div class="shop-decor-stage">
        ${wallItems.length ? `<div class="shop-wall-objects">${wallItems.join('')}</div>` : ''}
        ${
          floorItems.length
            ? `
          <div class="shop-floor-shelf-wrap">
            <div class="shop-floor-objects">${floorItems.join('')}</div>
            <div class="shop-shelf-plank"></div>
          </div>
        `
            : ''
        }
      </div>
    `
        : ''
    }
    ${accShelfHtml}
  `;
}

export function renderShopArchDetails(locId) {
  if (locId === 'shop_pavilion') {
    return `
      <div class="shop-arch-details">
        <div class="shop-hanging-plants">
          <svg viewBox="0 0 64 34" width="56" height="30">
            <line x1="32" y1="0" x2="32" y2="10" stroke="#9C846E" stroke-width="1.5"/>
            <polygon points="20,10 44,10 39,22 25,22" fill="#D9A78B"/>
            <path d="M22,12 Q14,22 18,31 M30,12 Q30,24 28,33 M38,12 Q46,21 44,30" stroke="#6E9E69" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <circle cx="18" cy="24" r="3" fill="#7FB57B"/><circle cx="44" cy="23" r="3" fill="#7FB57B"/>
          </svg>
          <svg viewBox="0 0 64 34" width="56" height="30">
            <line x1="32" y1="0" x2="32" y2="10" stroke="#9C846E" stroke-width="1.5"/>
            <polygon points="20,10 44,10 39,22 25,22" fill="#E8E1D6"/>
            <path d="M22,12 Q15,20 19,29 M32,12 Q32,23 33,32 M41,12 Q48,20 45,29" stroke="#5A8357" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <circle cx="26" cy="20" r="2.8" fill="#F29AA4"/><circle cx="38" cy="21" r="2.8" fill="#F6B8BF"/>
          </svg>
        </div>
      </div>
    `;
  }
  if (locId === 'shop_boutique') {
    return `
      <div class="shop-arch-details">
        <div class="shop-boutique-molding">
          <svg viewBox="0 0 320 18" width="100%" height="16" preserveAspectRatio="none">
            <line x1="10" y1="9" x2="128" y2="9" stroke="#DFB873" stroke-width="2"/>
            <circle cx="160" cy="9" r="6" fill="none" stroke="#DFB873" stroke-width="2"/>
            <circle cx="160" cy="9" r="2.5" fill="#DFB873"/>
            <line x1="192" y1="9" x2="310" y2="9" stroke="#DFB873" stroke-width="2"/>
          </svg>
        </div>
      </div>
    `;
  }
  return '';
}

export function renderShopWindowScenery(locId, timeClass, seasonId, weather) {
  const isEve = timeClass === 'time-evening';
  const groundColor =
    seasonId === 'winter' ? '#EDF4F8' :
    seasonId === 'early-spring' ? '#A4C89B' :
    seasonId === 'autumn' ? '#D99455' : '#8EC289';
  const foliageColor =
    seasonId === 'winter' ? '#D6E4EC' :
    seasonId === 'early-spring' ? '#A8CFA0' :
    seasonId === 'autumn' ? '#E28743' : '#73B070';
  const foliageAccent =
    seasonId === 'winter' ? '#EDF4F8' :
    seasonId === 'early-spring' ? '#F7C6CF' :
    seasonId === 'autumn' ? '#F0B654' : '#8BC986';

  const skySun =
    weather === 'rainy'
      ? ''
      : isEve
      ? '<circle cx="135" cy="20" r="9" fill="#FFF3C4" opacity="0.9"/>'
      : '<circle cx="135" cy="20" r="10" fill="#FFE382"/>';

  if (locId === 'shop_pavilion') {
    return `
      <svg class="window-scenery-svg" viewBox="0 0 170 100" preserveAspectRatio="none">
        ${skySun}
        <path d="M0,74 Q45,62 95,70 Q135,62 170,72 L170,100 L0,100 Z" fill="${groundColor}"/>
        <circle cx="28" cy="48" r="18" fill="${foliageColor}"/>
        <circle cx="42" cy="54" r="13" fill="${foliageAccent}"/>
        <rect x="25" y="64" width="5" height="14" fill="#8C6D56"/>
        <circle cx="144" cy="46" r="19" fill="${foliageColor}"/>
        <circle cx="129" cy="54" r="12" fill="${foliageAccent}"/>
        <rect x="142" y="63" width="5" height="15" fill="#8C6D56"/>
        <ellipse cx="86" cy="84" rx="26" ry="7" fill="#D5DEE3" stroke="#A6B7C2" stroke-width="1.5"/>
        <ellipse cx="86" cy="83" rx="20" ry="4.5" fill="#8CCAE8"/>
        <rect x="82" y="68" width="8" height="15" fill="#E3E9EC"/>
        <ellipse cx="86" cy="68" rx="13" ry="3.5" fill="#D5DEE3"/>
        <path d="M86,66 Q79,53 73,68 M86,66 Q93,53 99,68 M86,66 L86,52" stroke="#BEE8FA" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    `;
  }

  if (locId === 'shop_boutique') {
    const winLight = isEve ? '#FFE599' : '#BFE0F2';
    return `
      <svg class="window-scenery-svg" viewBox="0 0 170 100" preserveAspectRatio="none">
        ${skySun}
        <rect x="6" y="28" width="38" height="58" fill="#EBD7C5" stroke="#C9AD96" stroke-width="1"/>
        <polygon points="4,28 25,14 46,28" fill="#B57B6E"/>
        <rect x="13" y="36" width="8" height="12" rx="4" fill="${winLight}"/>
        <rect x="28" y="36" width="8" height="12" rx="4" fill="${winLight}"/>
        <rect x="46" y="34" width="42" height="52" fill="#F4E7D8" stroke="#D1B9A2" stroke-width="1"/>
        <rect x="54" y="42" width="9" height="13" fill="${winLight}"/>
        <rect x="70" y="42" width="9" height="13" fill="${winLight}"/>
        <rect x="114" y="24" width="48" height="62" fill="#E5D5C8" stroke="#BEA795" stroke-width="1"/>
        <polygon points="112,24 138,10 164,24" fill="#8C7B73"/>
        <rect x="122" y="34" width="10" height="14" rx="5" fill="${winLight}"/>
        <rect x="142" y="34" width="10" height="14" rx="5" fill="${winLight}"/>
        <rect x="0" y="78" width="170" height="22" fill="#C9BEB4"/>
        <path d="M0,78 Q85,73 170,78" stroke="#A6978B" stroke-width="1.5" fill="none"/>
        <circle cx="98" cy="64" r="10" fill="${foliageColor}"/>
        <line x1="106" y1="84" x2="106" y2="44" stroke="#4A3E39" stroke-width="2"/>
        <circle cx="106" cy="42" r="4.5" fill="#FFE694"/>
      </svg>
    `;
  }

  return `
    <svg class="window-scenery-svg" viewBox="0 0 170 100" preserveAspectRatio="none">
      ${skySun}
      <rect x="0" y="62" width="170" height="38" fill="#D7CCC2"/>
      <line x1="0" y1="74" x2="170" y2="74" stroke="#BEB1A5" stroke-width="1.5"/>
      <line x1="30" y1="74" x2="22" y2="100" stroke="#BEB1A5" stroke-width="1"/>
      <line x1="85" y1="74" x2="85" y2="100" stroke="#BEB1A5" stroke-width="1"/>
      <line x1="140" y1="74" x2="148" y2="100" stroke="#BEB1A5" stroke-width="1"/>
      <circle cx="28" cy="58" r="13" fill="${foliageColor}"/>
      <circle cx="40" cy="61" r="9" fill="${foliageAccent}"/>
      <rect x="96" y="57" width="44" height="11" rx="2" fill="#A67C5B"/>
      <circle cx="105" cy="54" r="4.5" fill="#F29AA4"/>
      <circle cx="118" cy="53" r="5" fill="#FFE28A"/>
      <circle cx="131" cy="54" r="4.5" fill="#F6B8BF"/>
      ${seasonId === 'winter' ? '<path d="M0,62 Q85,57 170,62 L170,69 L0,69 Z" fill="#F2F7FA"/>' : ''}
      <line x1="152" y1="74" x2="152" y2="18" stroke="#5C4E48" stroke-width="2.5"/>
      <circle cx="152" cy="18" r="4.5" fill="${isEve ? '#FFE599' : '#FFF8DC'}"/>
    </svg>
  `;
}

function getAccessoryShelfSvg(accId) {
  if (accId === 'balloon_heart') {
    return `
      <svg viewBox="0 0 34 36" width="32" height="34">
        <path d="M17,24 L17,34" stroke="#C9A88C" stroke-width="1.2"/>
        <path d="M17,10 C12,3 3,8 8,16 L17,25 L26,16 C31,8 22,3 17,10 Z" fill="#E86474" stroke="#C44858" stroke-width="1.2"/>
        <ellipse cx="12" cy="11" rx="2" ry="1.2" transform="rotate(-30 12 11)" fill="rgba(255,255,255,0.65)"/>
      </svg>
    `;
  }
  if (accId === 'balloon_star') {
    return `
      <svg viewBox="0 0 34 36" width="32" height="34">
        <path d="M17,24 L17,34" stroke="#C9A88C" stroke-width="1.2"/>
        <polygon points="17,3 21,11 30,12 23,18 25,27 17,22 9,27 11,18 4,12 13,11" fill="#F5C954" stroke="#D19D2E" stroke-width="1.2"/>
      </svg>
    `;
  }
  if (accId === 'plush_bear') {
    return `
      <svg viewBox="0 0 34 36" width="32" height="34">
        <circle cx="10" cy="10" r="4" fill="#C48F64"/><circle cx="24" cy="10" r="4" fill="#C48F64"/>
        <ellipse cx="17" cy="25" rx="9" ry="8" fill="#C48F64"/>
        <circle cx="17" cy="14" r="7.5" fill="#D19C72"/>
        <ellipse cx="17" cy="16" rx="3.5" ry="2.6" fill="#F0D4B8"/>
        <circle cx="17" cy="15" r="1.2" fill="#4A3E39"/>
        <circle cx="14.5" cy="12.5" r="1" fill="#4A3E39"/><circle cx="19.5" cy="12.5" r="1" fill="#4A3E39"/>
        <path d="M13,22 L21,22 L17,25 Z" fill="#E87A88"/>
      </svg>
    `;
  }
  if (accId === 'plush_bunny') {
    return `
      <svg viewBox="0 0 34 36" width="32" height="34">
        <ellipse cx="13" cy="8" rx="2.5" ry="6.5" fill="#EFE8E2" stroke="#D6CCC2" stroke-width="1"/>
        <ellipse cx="21" cy="8" rx="2.5" ry="6.5" fill="#EFE8E2" stroke="#D6CCC2" stroke-width="1"/>
        <ellipse cx="17" cy="26" rx="8" ry="7.5" fill="#EFE8E2" stroke="#D6CCC2" stroke-width="1"/>
        <circle cx="17" cy="16" r="6.5" fill="#FAF6F2" stroke="#D6CCC2" stroke-width="1"/>
        <circle cx="14.8" cy="15.5" r="1" fill="#4A3E39"/><circle cx="19.2" cy="15.5" r="1" fill="#4A3E39"/>
        <circle cx="17" cy="17.5" r="1.1" fill="#F29AA4"/>
      </svg>
    `;
  }
  if (accId === 'choco_box') {
    return `
      <svg viewBox="0 0 34 36" width="32" height="34">
        <rect x="5" y="15" width="24" height="17" rx="3" fill="#8C5346" stroke="#6B3B30" stroke-width="1.2"/>
        <line x1="17" y1="15" x2="17" y2="32" stroke="#DFB66B" stroke-width="2.2"/>
        <line x1="5" y1="23" x2="29" y2="23" stroke="#DFB66B" stroke-width="2.2"/>
        <circle cx="17" cy="23" r="2.5" fill="#F5D07B"/>
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 34 36" width="32" height="34">
      <rect x="6" y="16" width="22" height="16" rx="2" fill="#FFFDF9" stroke="#D8C2B4" stroke-width="1.2"/>
      <path d="M6,16 L17,25 L28,16" fill="none" stroke="#D8C2B4" stroke-width="1.2"/>
      <circle cx="17" cy="24" r="2.2" fill="#E87A88"/>
    </svg>
  `;
}

export function renderShopAccessoriesBar(locId) {
  if (locId === 'shop_basement') return '';
  const items = (gameState.accessoriesInventory || []).filter((a) => a.qty > 0);
  if (!items.length) return '';

  const visualsHtml = items
    .map((a) => {
      const meta = ACCESSORIES_CATALOG[a.id];
      if (!meta) return '';
      return `
        <div class="shop-acc-visual" title="${escapeAttr(meta.name)} (${a.qty} шт.)">
          ${getAccessoryShelfSvg(a.id)}
        </div>
      `;
    })
    .join('');

  return `
    <div class="shop-accessories-shelf">
      <div class="shop-acc-items-row">${visualsHtml}</div>
      <div class="shop-acc-plank"></div>
    </div>
  `;
}

export function renderWeatherParticles(weather, seasonId) {
  if (weather === 'rainy') {
    return Array.from({ length: 14 }, (_, idx) => {
      const left = 5 + ((idx * 7) % 90);
      const delay = (idx * 0.14).toFixed(2);
      return `<span class="rain-drop" style="left:${left}%; animation-delay:${delay}s;"></span>`;
    }).join('');
  }
  if (weather === 'frost' || seasonId === 'winter') {
    return Array.from({ length: 14 }, (_, idx) => {
      const left = 4 + ((idx * 11) % 92);
      const delay = (idx * 0.25).toFixed(2);
      return `<span class="snow-flake" style="left:${left}%; animation-delay:${delay}s;"></span>`;
    }).join('');
  }
  if (seasonId === 'autumn') {
    return Array.from({ length: 8 }, (_, idx) => {
      const left = 8 + ((idx * 13) % 86);
      const delay = (idx * 0.35).toFixed(2);
      return `<span class="autumn-leaf" style="left:${left}%; animation-delay:${delay}s;"></span>`;
    }).join('');
  }
  return '';
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
```

## File: js/screens/phone/phoneCanvasSnap.js
```javascript
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
```

## File: js/screens/phone/phoneDecor.js
```javascript
/**
 * js/screens/phone/phoneDecor.js
 * Декор и антиквариат: ежедневный редкий ассортимент и склад украшений
 */

import { DECOR_CATALOG, SHOP_LOCATIONS } from '../../config.js';
import { gameState, saveState, ensureDailyRareDecor } from '../../state.js';
import { playCoinSound } from '../../sound.js';

export function renderDecorApp(body, onHudUpdate, showToast) {
  const activeTab = window._fleurDecorSubTab || 'shop';
  const rareIds = ensureDailyRareDecor();
  const ownedSet = new Set([...(gameState.decor || []), ...(gameState.decorInventory || [])]);
  const fridgeItem = DECOR_CATALOG.find((d) => d.id === 'fridge');

  const todayItems = [
    ...(fridgeItem ? [fridgeItem] : []),
    ...rareIds.map((id) => DECOR_CATALOG.find((d) => d.id === id)).filter(Boolean)
  ];

  const currentShopLoc =
    SHOP_LOCATIONS.find((l) => l.id === gameState.shopLocationId) || SHOP_LOCATIONS[0];
  const visibleShopDecorCount = DECOR_CATALOG.filter(
    (d) =>
      d.place === 'Магазин' &&
      d.id !== 'fridge' &&
      ownedSet.has(d.id) &&
      !(gameState.hiddenDecor || []).includes(d.id)
  ).length;

  const shopListHtml = todayItems
    .map((item) => {
      const owned = ownedSet.has(item.id) || (item.id === 'fridge' && gameState.hasFridge);
      const isHidden = (gameState.hiddenDecor || []).includes(item.id);
      const rareBadge = item.isRare ? ' • ✨ Редкое' : '';

      let btnHtml = `
        <button class="btn btn-primary" data-buy-decor="${item.id}" style="padding:7px 10px; font-size:11.5px;">
          ${item.price} ₽
        </button>
      `;
      if (owned && item.id === 'fridge') {
        btnHtml = `<span class="badge badge-ok">Куплен ✓</span>`;
      } else if (owned) {
        btnHtml = `
          <button class="btn ${isHidden ? 'btn-sage' : 'btn-soft'}" data-toggle-decor-phone="${item.id}" style="padding:7px 9px; font-size:11px;">
            ${isHidden ? 'Повесить' : '✓ Висит'}
          </button>
        `;
      }

      return `
        <div class="decor-item-card">
          <div class="decor-icon-box">${item.icon}</div>
          <div style="flex:1; min-width:0;">
            <div class="row-between">
              <strong style="font-size:12.5px;">${item.name}</strong>
              <span class="badge badge-ok">${item.place}${rareBadge}</span>
            </div>
            <p class="muted-text" style="font-size:11px; margin-top:2px;">${item.effectText}</p>
          </div>
          ${btnHtml}
        </div>
      `;
    })
    .join('');

  const ownedItems = DECOR_CATALOG.filter(
    (d) => ownedSet.has(d.id) || (d.id === 'fridge' && gameState.hasFridge)
  );
  const wardrobeHtml = ownedItems.length
    ? ownedItems
        .map((item) => {
          const isHidden = (gameState.hiddenDecor || []).includes(item.id);
          return `
            <div class="decor-item-card">
              <div class="decor-icon-box">${item.icon}</div>
              <div style="flex:1; min-width:0;">
                <strong style="font-size:12.5px;">${item.name}</strong>
                <div class="muted-text" style="font-size:11px;">${item.place} • ${item.category || 'Обычный'}</div>
              </div>
              <button class="btn ${isHidden ? 'btn-sage' : 'btn-soft'}" data-toggle-decor-phone="${item.id}" style="padding:7px 10px; font-size:11.5px;">
                ${isHidden ? '📦 Достать' : '✓ В интерьере'}
              </button>
            </div>
          `;
        })
        .join('')
    : `<p class="muted-text" style="text-align:center; padding:14px;">Склад декора пока пуст — загляни в Антикварную лавку!</p>`;

  body.innerHTML = `
    <div class="segmented-tabs">
      <button class="seg-btn ${activeTab === 'shop' ? 'active' : ''}" data-decor-subtab="shop">
        🏺 Антикварная лавка
      </button>
      <button class="seg-btn ${activeTab === 'wardrobe' ? 'active' : ''}" data-decor-subtab="wardrobe">
        📦 Склад (${ownedItems.length})
      </button>
    </div>

    ${
      activeTab === 'shop'
        ? `
      <div class="antique-banner">
        <strong>🏺 Завоз на сегодня (День ${gameState.day})</strong><br/>
        Каждый день сюда привозят 2–3 случайных предмета декора и антиквариата. Заглядывай каждое утро!
      </div>
      ${shopListHtml}
    `
        : `
      <p class="muted-text" style="font-size:11.5px; padding:0 4px;">
        Все покупки сохраняются навсегда. Слоты зала (${currentShopLoc.name}): <strong>${visibleShopDecorCount}/${currentShopLoc.maxWallDecor}</strong>.
      </p>
      ${wardrobeHtml}
    `
    }
  `;

  body.querySelectorAll('[data-decor-subtab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window._fleurDecorSubTab = btn.dataset.decorSubtab;
      renderDecorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-buy-decor]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = DECOR_CATALOG.find((d) => d.id === btn.dataset.buyDecor);
      if (!item) return;
      if (gameState.money < item.price) {
        showToast('Недостаточно денег!');
        return;
      }

      gameState.money -= item.price;
      gameState.totalSpent += item.price;
      if (item.id === 'fridge') gameState.hasFridge = true;
      if (!gameState.decor.includes(item.id)) gameState.decor.push(item.id);
      if (!Array.isArray(gameState.decorInventory)) gameState.decorInventory = [];
      if (!gameState.decorInventory.includes(item.id)) gameState.decorInventory.push(item.id);

      const canHangInShop =
        item.place !== 'Магазин' ||
        item.id === 'fridge' ||
        visibleShopDecorCount < currentShopLoc.maxWallDecor;
      if (!Array.isArray(gameState.hiddenDecor)) gameState.hiddenDecor = [];
      if (canHangInShop) {
        gameState.hiddenDecor = gameState.hiddenDecor.filter((id) => id !== item.id);
      } else if (!gameState.hiddenDecor.includes(item.id)) {
        gameState.hiddenDecor.push(item.id);
      }

      gameState.mood = Math.min(100, gameState.mood + item.moodBonus);
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(
        canHangInShop
          ? `✨ Куплено и размещено: ${item.name}!`
          : `📦 Куплено на склад: ${item.name} (в зале нет свободных мест)`
      );
      renderDecorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-toggle-decor-phone]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggleDecorPhone;
      const item = DECOR_CATALOG.find((d) => d.id === id);
      if (!Array.isArray(gameState.hiddenDecor)) gameState.hiddenDecor = [];
      if (gameState.hiddenDecor.includes(id)) {
        if (
          item?.place === 'Магазин' &&
          id !== 'fridge' &&
          visibleShopDecorCount >= currentShopLoc.maxWallDecor
        ) {
          showToast(
            `В локации «${currentShopLoc.name}» заняты все ${currentShopLoc.maxWallDecor} места для декора!`
          );
          return;
        }
        gameState.hiddenDecor = gameState.hiddenDecor.filter((x) => x !== id);
        showToast('✨ Украшение размещено!');
      } else {
        gameState.hiddenDecor.push(id);
        showToast('📦 Украшение убрано на склад');
      }
      saveState();
      renderDecorApp(body, onHudUpdate, showToast);
    });
  });
}
```

## File: js/screens/phone/phoneDirect.js
```javascript
/**
 * js/screens/phone/phoneDirect.js
 * Чаты Direct: общение с клиентами, предзаказы, прикрепление снимков и собеседования
 */

import { FLOWERS_CATALOG } from '../../config.js';
import { gameState, saveState, getTotalGameMinutes } from '../../state.js';
import {
  generateDirectMessage,
  generateDirectFollowUp,
  generateDirectRejectionReply,
  generateJobCandidateDm,
  generateCandidateInterviewReply,
  generateCandidateHireReaction
} from '../../ai.js';
import { playCoinSound, playBellSound } from '../../sound.js';

let isFetchingDm = false;
let openedDmId = null;
let busyDmId = null;
let showDmPhotoPicker = false;
let selectedDmPhotoId = null;
let showDmRejectMenu = false;

const DIRECT_REJECT_TEMPLATES = [
  'Нет таких цветов',
  'Не успеем к этому времени',
  'Слишком маленький бюджет',
  'Магазин уже закрывается'
];

export function renderDirectApp(body, onHudUpdate, showToast, onRefreshPhone) {
  const refresh = onRefreshPhone || (() => renderDirectApp(body, onHudUpdate, showToast, onRefreshPhone));

  if (openedDmId) {
    const activeDm = gameState.directMessages.find((m) => m.id === openedDmId);
    if (activeDm) {
      renderOpenedDmChat(activeDm, body, onHudUpdate, showToast, refresh);
      return;
    }
    openedDmId = null;
  }

  const listHtml = gameState.directMessages.length
    ? gameState.directMessages.map((dm) => renderDmListItem(dm)).join('')
    : `<p class="muted-text" style="text-align:center; padding: 14px;">Сообщений пока нет. Новые письма приходят сами по ходу дня или по кнопке сверху!</p>`;

  body.innerHTML = `
    <button class="btn btn-sage" id="btn-check-dm" ${isFetchingDm ? 'disabled' : ''}>
      ${isFetchingDm ? '⏳ Загружаем сообщения...' : '📩 Проверить новые сообщения'}
    </button>
    ${listHtml}
  `;

  document.getElementById('btn-check-dm')?.addEventListener('click', async () => {
    if (isFetchingDm) return;
    isFetchingDm = true;
    renderDirectApp(body, onHudUpdate, showToast, refresh);
    try {
      const openJob = (gameState.jobPostings || []).find(
        (j) => j.status === 'open' && (j.respondedCount || 0) < 3
      );
      const totalMin = getTotalGameMinutes();
      const shouldSpawnJob =
        openJob && (totalMin >= (openJob.nextResponseTotalMin || 0) || Math.random() < 0.65);

      if (shouldSpawnJob) {
        const dm = await generateJobCandidateDm(openJob);
        openJob.respondedCount = (openJob.respondedCount || 0) + 1;
        openJob.nextResponseTotalMin = totalMin + 130 + Math.floor(Math.random() * 110);
        dm.read = false;
        gameState.directMessages.unshift(dm);
        trimDirectMessages();
        saveState();
        onHudUpdate();
        showToast(`💼 Отклик на вакансию от ${dm.jobApplication?.candidateName || dm.senderName}!`);
      } else {
        const dm = await generateDirectMessage();
        dm.read = false;
        gameState.directMessages.unshift(dm);
        trimDirectMessages();
        saveState();
        onHudUpdate();
        showToast(`Новое сообщение от ${dm.senderName}`);
      }
    } finally {
      isFetchingDm = false;
      refresh();
    }
  });

  body.querySelectorAll('[data-open-dm]').forEach((row) => {
    row.addEventListener('click', () => {
      const dm = gameState.directMessages.find((m) => m.id === row.dataset.openDm);
      if (!dm) return;
      openedDmId = dm.id;
      showDmPhotoPicker = false;
      selectedDmPhotoId = null;
      showDmRejectMenu = false;
      if (!dm.read) {
        dm.read = true;
        saveState();
        onHudUpdate();
      }
      refresh();
    });
  });
}

function renderDmListItem(dm) {
  const thread = Array.isArray(dm.thread) && dm.thread.length ? dm.thread : [{ sender: 'client', text: dm.text }];
  const lastMsg = thread[thread.length - 1]?.text || dm.text || '';

  let icon = '💬';
  let statusText = 'Вопрос';
  let statusClass = 'badge-warn';

  if (dm.blockedByClient || dm.blockedByPlayer) {
    icon = '⛔';
    statusText = 'Заблокирован';
    statusClass = 'badge-warn';
  } else if (dm.jobApplication) {
    icon = dm.jobApplication.roleIcon || '💼';
    if (dm.jobApplication.status === 'hired') {
      statusText = 'В команде ✓';
      statusClass = 'badge-ok';
    } else if (dm.jobApplication.status === 'rejected') {
      statusText = 'Отказано';
      statusClass = 'badge-warn';
    } else {
      statusText = 'Собеседование';
      statusClass = 'badge-ok';
    }
  } else if (dm.kind === 'review' && !dm.order) {
    icon = '⭐';
    statusText = 'Отзыв';
  } else if (dm.order) {
    icon = '💐';
    if (dm.order.done) {
      statusText = 'Выполнен ✓';
      statusClass = 'badge-ok';
    } else if (dm.order.rejected) {
      statusText = 'Отменён';
      statusClass = 'badge-warn';
    } else if (dm.order.accepted) {
      statusText = `Ждём ${dm.order.dueTimeLabel}`;
      statusClass = 'badge-ok';
    } else {
      statusText = `Запрос ${dm.order.dueTimeLabel}`;
      statusClass = 'badge-warn';
    }
  }

  return `
    <div class="dm-list-item ${!dm.read ? 'unread' : ''}" data-open-dm="${dm.id}">
      <div class="dm-list-avatar">
        ${icon}
        ${!dm.read ? '<span class="dm-unread-dot"></span>' : ''}
      </div>
      <div style="flex:1; min-width:0;">
        <div class="row-between">
          <strong style="font-size:13px;">${escapeHtml(dm.senderName)}</strong>
          <span class="badge ${statusClass}" style="font-size:10px;">${statusText}</span>
        </div>
        <div class="dm-list-preview">${escapeHtml(lastMsg)}</div>
      </div>
      <span class="muted-text" style="font-size:10.5px; flex-shrink:0;">${dm.createdTimeLabel || ''}</span>
    </div>
  `;
}

function renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh) {
  if (dm.jobApplication) {
    renderJobInterviewChat(dm, body, onHudUpdate, showToast, refresh);
    return;
  }

  const isBusy = busyDmId === dm.id;
  const hasOrder = Boolean(dm.order);
  const flowerName = dm.order?.flowerName || FLOWERS_CATALOG[dm.order?.typeId]?.name || 'цветы';
  const vaseMatch = hasOrder
    ? gameState.inventory.find((v) => v.typeId === dm.order.typeId && v.qty >= dm.order.qty)
    : null;
  const accLine = dm.order?.accessoryName ? ` + 🎁 ${dm.order.accessoryName}` : '';

  const threadList = Array.isArray(dm.thread) && dm.thread.length
    ? dm.thread
    : [
        { sender: 'client', text: dm.text },
        ...(dm.replyText ? [{ sender: 'player', text: dm.replyText }] : [])
      ];

  const threadHtml = threadList
    .map(
      (m) => `
      <div class="dm-msg ${m.sender}">
        ${m.photoUrl ? `<img class="dm-msg-photo" src="${m.photoUrl}" alt="Фото букета" />` : ''}
        ${m.text ? `<span>${escapeHtml(m.text)}</span>` : ''}
      </div>
    `
    )
    .join('');

  const isBlocked = Boolean(dm.blockedByClient || dm.blockedByPlayer);
  const preObj = hasOrder
    ? gameState.preorders.find((p) => p.dmId === dm.id && p.status !== 'cancelled')
    : null;
  const alreadyInShop = preObj && preObj.status === 'in_shop';
  const canAcceptOrder =
    hasOrder && !dm.order.done && !dm.order.accepted && !dm.order.rejected && !isBlocked && !alreadyInShop;
  const canRejectOrder = hasOrder && !dm.order.done && !dm.order.rejected && !isBlocked && !alreadyInShop;

  let orderBannerHtml = '';
  if (hasOrder) {
    if (dm.order.done) {
      orderBannerHtml = `
        <div class="dm-order-banner agreed">
          ✅ <strong>Выполнен:</strong> ${dm.order.qty} шт. «${escapeHtml(flowerName)}»${escapeHtml(accLine)} • клиент забрал заказ.
        </div>
      `;
    } else if (dm.order.rejected) {
      orderBannerHtml = `
        <div class="dm-order-banner cancelled">
          ❌ <strong>Заказ отменён:</strong> клиент предупреждён и не придёт (можно договориться заново в чате).
        </div>
      `;
    } else if (dm.order.accepted) {
      orderBannerHtml = `
        <div class="dm-order-banner agreed">
          ✅ <strong>Принят в работу!</strong> ${dm.order.qty} шт. «${escapeHtml(flowerName)}»${escapeHtml(accLine)} • к ${dm.order.dueTimeLabel} • ${dm.order.reward} ₽
          ${
            vaseMatch
              ? `<span style="color:var(--sage-dark); font-weight:800;"> • В наличии ✓</span>`
              : `<span style="color:#9D6F1D; font-weight:800;"> • Докупи к приходу</span>`
          }
        </div>
      `;
    } else {
      orderBannerHtml = `
        <div class="dm-order-banner">
          💐 <strong>Запрос клиента:</strong> ${dm.order.qty} шт. «${escapeHtml(flowerName)}»${escapeHtml(accLine)} • к ${dm.order.dueTimeLabel} • ~${dm.order.reward} ₽
          ${
            vaseMatch
              ? `<span style="color:var(--sage-dark); font-weight:800;"> • В наличии ✓</span>`
              : `<span style="color:#9D6F1D; font-weight:800;"> • Нет в вазах</span>`
          }
        </div>
      `;
    }
  }

  const savedPhotos = gameState.savedPhotos || [];
  const attachedPhoto = selectedDmPhotoId
    ? savedPhotos.find((p) => p.id === selectedDmPhotoId) || null
    : null;

  const photoPickerHtml = showDmPhotoPicker
    ? `
      <div class="dm-photo-picker-box">
        <div class="row-between">
          <strong style="font-size:11.5px;">📷 Выбери снимок из галереи Polaroid:</strong>
          <button class="btn btn-soft" id="btn-dm-close-photos" style="padding:2px 7px; font-size:11px;">✕</button>
        </div>
        ${
          savedPhotos.length
            ? `<div class="photo-picker-row">
              ${savedPhotos
                .map(
                  (p) => `
                <div class="photo-pick-item ${p.id === selectedDmPhotoId ? 'selected' : ''}" data-pick-dm-photo="${p.id}" title="${escapeAttr(p.description || 'Снимок')}">
                  <img src="${p.dataUrl}" alt="Фото" />
                </div>
              `
                )
                .join('')}
            </div>`
            : `<p class="muted-text" style="font-size:11px;">Галерея пуста! Сфоткай букет на Столе сборки (кнопка «📸 Сфотать») или зал в InstaFlower.</p>`
        }
      </div>
    `
    : '';

  const attachedPreviewHtml = attachedPhoto
    ? `
      <div class="dm-attached-preview">
        <img src="${attachedPhoto.dataUrl}" alt="Вложение" />
        <div style="flex:1; min-width:0;">
          <strong>📷 Фото прикреплено</strong>
          <div class="muted-text" style="font-size:10.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${escapeHtml(attachedPhoto.description || 'Снимок букета')}
          </div>
        </div>
        <button class="btn btn-soft" id="btn-dm-clear-photo" style="padding:3px 7px; font-size:11px;">✕</button>
      </div>
    `
    : '';

  const rejectMenuHtml =
    showDmRejectMenu && canRejectOrder
      ? `
      <div class="reject-box">
        <div class="row-between">
          <strong style="font-size:11.5px;">Выбери причину отказа:</strong>
          <button class="btn btn-soft" id="btn-dm-close-reject" style="padding:2px 7px; font-size:10.5px;">✕</button>
        </div>
        <div class="reject-chips">
          ${DIRECT_REJECT_TEMPLATES.map(
            (tpl) => `
            <button class="reject-chip" data-dm-reject-tpl="${escapeAttr(tpl)}" ${isBusy ? 'disabled' : ''}>
              ${escapeHtml(tpl)}
            </button>
          `
          ).join('')}
        </div>
        <div style="display:flex; gap:5px;">
          <input type="text" class="form-input" id="dm-reject-custom-input" autocomplete="off" data-form-type="other" data-lpignore="true" placeholder="Своя причина..." style="padding:6px 8px; font-size:11.5px;" ${isBusy ? 'disabled' : ''} />
          <button class="btn btn-danger" id="btn-dm-reject-custom" style="padding:6px 9px; font-size:11.5px;" ${isBusy ? 'disabled' : ''}>Отказать</button>
        </div>
        <button class="btn btn-soft" id="btn-dm-reject-silent" style="padding:6px 8px; font-size:11px;" ${isBusy ? 'disabled' : ''}>
          🔇 Молчаливый отказ («К сожалению, не сможем взять заказ»)
        </button>
      </div>
    `
      : '';

  body.innerHTML = `
    <div class="dm-chat-topbar">
      <button class="btn btn-soft" id="btn-dm-back" style="padding:5px 9px; font-size:11.5px;">← Чаты</button>
      <div style="flex:1; min-width:0; text-align:center;">
        <strong style="font-size:13px;">${escapeHtml(dm.senderName)}</strong>
      </div>
      ${
        dm.blockedByClient
          ? `<span class="badge badge-warn">В ЧС</span>`
          : dm.blockedByPlayer
          ? `<button class="btn btn-soft" id="btn-dm-unblock" style="padding:5px 8px; font-size:11px;">Разблок.</button>`
          : `<button class="btn btn-danger" id="btn-dm-block" style="padding:5px 8px; font-size:11px;">🚫 Блок</button>`
      }
    </div>

    <div class="dm-card">
      <div class="dm-thread" style="max-height: 245px; overflow-y: auto;">
        ${threadHtml}
        ${isBusy ? `<div class="dm-msg system">💬 ${escapeHtml(dm.senderName)} печатает...</div>` : ''}
      </div>

      ${orderBannerHtml}

      ${
        canAcceptOrder || canRejectOrder
          ? `
        <div class="dm-order-actions">
          ${
            canAcceptOrder
              ? `<button class="btn btn-sage" id="btn-dm-accept-order" ${isBusy ? 'disabled' : ''}>
              ✅ Принять заказ
            </button>`
              : ''
          }
          ${
            canRejectOrder
              ? `<button class="btn btn-danger" id="btn-dm-toggle-reject" ${isBusy ? 'disabled' : ''}>
              ${dm.order.accepted ? '🚫 Отменить заказ' : '🚫 Отказать'}
            </button>`
              : ''
          }
        </div>
      `
          : ''
      }

      ${rejectMenuHtml}

      ${
        dm.blockedByClient
          ? `<div class="dm-blocked-banner">⛔ Пользователь заблокировал вас из-за грубого общения. Переписка закрыта.</div>`
          : dm.blockedByPlayer
          ? `<div class="dm-blocked-banner">🚫 Вы заблокировали этого пользователя.</div>`
          : alreadyInShop
          ? `<span class="badge badge-warn" style="align-self:flex-start;">🔔 Клиент уже в зале забирает заказ! Перейди в «Магазин».</span>`
          : !(hasOrder && dm.order.done)
          ? `
        ${photoPickerHtml}
        ${attachedPreviewHtml}
        <div class="row-between" style="gap: 5px;">
          <button
            class="btn ${showDmPhotoPicker || attachedPhoto ? 'btn-primary' : 'btn-soft'}"
            id="btn-dm-photo-toggle"
            title="Прикрепить фото"
            style="padding: 7px 9px; font-size: 13px; flex-shrink: 0;"
            ${isBusy ? 'disabled' : ''}
          >
            📷
          </button>
          <input type="text" class="form-input" id="dm-reply-${dm.id}" data-dm-reply-input="${dm.id}" autocomplete="off" data-form-type="other" data-lpignore="true" placeholder="Напиши клиенту в Direct..." style="padding: 7px 10px; font-size: 12.5px; flex:1; min-width:0;" ${isBusy ? 'disabled' : ''} />
          <button class="btn btn-primary" data-reply-dm="${dm.id}" ${isBusy ? 'disabled' : ''} style="padding: 8px 12px; font-size: 12.5px; flex-shrink:0;">➤</button>
        </div>
      `
          : ''
      }
    </div>
  `;

  const threadEl = body.querySelector('.dm-thread');
  if (threadEl) threadEl.scrollTop = threadEl.scrollHeight;

  document.getElementById('btn-dm-back')?.addEventListener('click', () => {
    openedDmId = null;
    showDmPhotoPicker = false;
    selectedDmPhotoId = null;
    showDmRejectMenu = false;
    refresh();
  });

  document.getElementById('btn-dm-block')?.addEventListener('click', () => {
    dm.blockedByPlayer = true;
    if (dm.order && !dm.order.done) {
      dm.order.accepted = false;
      dm.order.rejected = true;
      gameState.preorders = gameState.preorders.filter((p) => p.dmId !== dm.id);
    }
    if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
    dm.thread.push({ sender: 'system', text: '🚫 Вы заблокировали этого пользователя.' });
    saveState();
    onHudUpdate();
    showToast(`Пользователь ${dm.senderName} заблокирован`);
    refresh();
  });

  document.getElementById('btn-dm-unblock')?.addEventListener('click', () => {
    dm.blockedByPlayer = false;
    if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
    dm.thread.push({ sender: 'system', text: '🔓 Вы разблокировали этого пользователя.' });
    saveState();
    showToast(`Пользователь ${dm.senderName} разблокирован`);
    refresh();
  });

  document.getElementById('btn-dm-photo-toggle')?.addEventListener('click', () => {
    showDmPhotoPicker = !showDmPhotoPicker;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-dm-close-photos')?.addEventListener('click', () => {
    showDmPhotoPicker = false;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh);
  });

  body.querySelectorAll('[data-pick-dm-photo]').forEach((el) => {
    el.addEventListener('click', () => {
      selectedDmPhotoId = el.dataset.pickDmPhoto;
      showDmPhotoPicker = false;
      renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh);
    });
  });

  document.getElementById('btn-dm-clear-photo')?.addEventListener('click', () => {
    selectedDmPhotoId = null;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-dm-accept-order')?.addEventListener('click', () => {
    handleDirectAcceptOrder(dm.id, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-dm-toggle-reject')?.addEventListener('click', () => {
    showDmRejectMenu = !showDmRejectMenu;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-dm-close-reject')?.addEventListener('click', () => {
    showDmRejectMenu = false;
    renderOpenedDmChat(dm, body, onHudUpdate, showToast, refresh);
  });

  body.querySelectorAll('[data-dm-reject-tpl]').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleDirectRejectOrder(dm.id, btn.dataset.dmRejectTpl, false, body, onHudUpdate, showToast, refresh);
    });
  });

  document.getElementById('btn-dm-reject-custom')?.addEventListener('click', () => {
    const reason = document.getElementById('dm-reject-custom-input')?.value.trim();
    if (!reason) {
      showToast('Напиши причину или выбери готовый вариант');
      return;
    }
    handleDirectRejectOrder(dm.id, reason, false, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-dm-reject-silent')?.addEventListener('click', () => {
    handleDirectRejectOrder(
      dm.id,
      'К сожалению, не сможем взять заказ',
      true,
      body,
      onHudUpdate,
      showToast,
      refresh
    );
  });

  body.querySelectorAll('[data-reply-dm]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(`dm-reply-${dm.id}`);
      const text = input?.value.trim() || '';
      const photo = selectedDmPhotoId
        ? (gameState.savedPhotos || []).find((p) => p.id === selectedDmPhotoId) || null
        : null;
      if (!text && !photo) return;
      handleDirectReply(dm.id, text, body, onHudUpdate, showToast, photo, refresh);
    });
  });

  body.querySelectorAll('[data-dm-reply-input]').forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !busyDmId) {
        const text = input.value.trim() || '';
        const photo = selectedDmPhotoId
          ? (gameState.savedPhotos || []).find((p) => p.id === selectedDmPhotoId) || null
          : null;
        if (!text && !photo) return;
        handleDirectReply(dm.id, text, body, onHudUpdate, showToast, photo, refresh);
      }
    });
  });
}

function renderJobInterviewChat(dm, body, onHudUpdate, showToast, refresh) {
  const app = dm.jobApplication;
  const isBusy = busyDmId === dm.id;
  const isFinished = app.status === 'hired' || app.status === 'rejected' || dm.blockedByClient;

  const threadList = Array.isArray(dm.thread) && dm.thread.length
    ? dm.thread
    : [{ sender: 'client', text: dm.text }];

  const threadHtml = threadList
    .map(
      (m) => `
      <div class="dm-msg ${m.sender}">
        <span>${escapeHtml(m.text)}</span>
      </div>
    `
    )
    .join('');

  let bannerClass = '';
  let statusBadge = `<span class="badge badge-ok">Собеседование</span>`;
  if (app.status === 'hired') {
    bannerClass = 'hired';
    statusBadge = `<span class="badge badge-ok">В команде ✓</span>`;
  } else if (app.status === 'rejected' || dm.blockedByClient) {
    bannerClass = 'rejected';
    statusBadge = `<span class="badge badge-warn">Отказ</span>`;
  }

  const lowerBargain = Math.max(450, Math.round((app.agreedSalary - 150) / 50) * 50);
  const quickQuestions = [
    'Расскажите о своём опыте',
    'Подойдёт этот график?',
    app.roleId === 'courier' ? 'Есть свой транспорт?' : 'Умеете ухаживать за цветами?',
    `Договоримся за ${lowerBargain} ₽/см.?`
  ];

  body.innerHTML = `
    <div class="dm-chat-topbar">
      <button class="btn btn-soft" id="btn-dm-back" style="padding:5px 9px; font-size:11.5px;">← Чаты</button>
      <div style="flex:1; min-width:0; text-align:center;">
        <strong style="font-size:13px;">${app.roleIcon || '💼'} ${escapeHtml(app.candidateName)}, ${app.age}</strong>
      </div>
      ${statusBadge}
    </div>

    <div class="dm-card">
      <div class="candidate-banner ${bannerClass}">
        <div class="row-between">
          <strong>${escapeHtml(app.roleName)} • ${escapeHtml(app.locationName)}</strong>
          <strong>${app.agreedSalary} ₽/см.</strong>
        </div>
        <div class="muted-text" style="font-size:11px;">${escapeHtml(app.bio)}</div>
        <div class="muted-text" style="font-size:10.5px;">🕒 ${escapeHtml(app.scheduleLabel)}${app.hasCar ? ' • 🚗 Своё авто' : ''}</div>
      </div>

      <div class="dm-thread" style="max-height: 225px; overflow-y: auto;">
        ${threadHtml}
        ${isBusy ? `<div class="dm-msg system">💬 ${escapeHtml(app.candidateName)} печатает...</div>` : ''}
      </div>

      ${
        !isFinished
          ? `
        <div class="interview-chips">
          ${quickQuestions
            .map(
              (q) => `
            <button class="interview-chip" data-interview-q="${escapeAttr(q)}" ${isBusy ? 'disabled' : ''}>
              ${escapeHtml(q)}
            </button>
          `
            )
            .join('')}
        </div>

        <div class="dm-order-actions">
          <button class="btn btn-sage" id="btn-hire-candidate" ${isBusy ? 'disabled' : ''}>
            🤝 Принять на работу (${app.agreedSalary} ₽)
          </button>
          <button class="btn btn-danger" id="btn-reject-candidate" ${isBusy ? 'disabled' : ''}>
            🚫 Отказать
          </button>
        </div>

        <div class="row-between" style="gap: 5px;">
          <input type="text" class="form-input" id="dm-reply-${dm.id}" data-job-reply-input="${dm.id}" autocomplete="off" data-form-type="other" data-lpignore="true" placeholder="Задай вопрос или поторгуйся по ставке..." style="padding: 7px 10px; font-size: 12px; flex:1; min-width:0;" ${isBusy ? 'disabled' : ''} />
          <button class="btn btn-primary" id="btn-send-job-reply" ${isBusy ? 'disabled' : ''} style="padding: 8px 12px; font-size: 12.5px; flex-shrink:0;">➤</button>
        </div>
      `
          : ''
      }
    </div>
  `;

  const threadEl = body.querySelector('.dm-thread');
  if (threadEl) threadEl.scrollTop = threadEl.scrollHeight;

  document.getElementById('btn-dm-back')?.addEventListener('click', () => {
    openedDmId = null;
    refresh();
  });

  body.querySelectorAll('[data-interview-q]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isBusy) return;
      handleInterviewMessage(dm.id, btn.dataset.interviewQ, body, onHudUpdate, showToast, refresh);
    });
  });

  document.getElementById('btn-send-job-reply')?.addEventListener('click', () => {
    const input = document.getElementById(`dm-reply-${dm.id}`);
    const text = input?.value.trim();
    if (text && !isBusy) handleInterviewMessage(dm.id, text, body, onHudUpdate, showToast, refresh);
  });

  document.querySelector(`[data-job-reply-input="${dm.id}"]`)?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isBusy) {
      const text = e.currentTarget.value.trim();
      if (text) handleInterviewMessage(dm.id, text, body, onHudUpdate, showToast, refresh);
    }
  });

  document.getElementById('btn-hire-candidate')?.addEventListener('click', () => {
    handleHireCandidate(dm.id, body, onHudUpdate, showToast, refresh);
  });

  document.getElementById('btn-reject-candidate')?.addEventListener('click', () => {
    handleRejectCandidate(dm.id, body, onHudUpdate, showToast, refresh);
  });
}

async function handleInterviewMessage(dmId, text, body, onHudUpdate, showToast, refresh) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || !dm.jobApplication || busyDmId) return;

  if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
  dm.thread.push({ sender: 'player', text });
  dm.read = true;
  busyDmId = dmId;
  renderJobInterviewChat(dm, body, onHudUpdate, showToast, refresh);

  try {
    const res = await generateCandidateInterviewReply(dm, text);
    dm.thread.push({ sender: 'client', text: res.reply });
    dm.jobApplication.agreedSalary = res.agreedSalary;
    if (res.blockedByClient) {
      dm.blockedByClient = true;
      dm.jobApplication.status = 'rejected';
      showToast(`⛔ ${dm.jobApplication.candidateName} ушёл со собеседования!`);
    }
    saveState();
  } finally {
    busyDmId = null;
    refresh();
  }
}

async function handleHireCandidate(dmId, body, onHudUpdate, showToast, refresh) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  const app = dm?.jobApplication;
  if (!dm || !app || busyDmId || app.status !== 'interviewing') return;

  busyDmId = dmId;
  app.status = 'hired';
  const finalSalary = Number(app.agreedSalary) || Number(app.offeredSalary) || 1200;

  if (!Array.isArray(gameState.employees)) gameState.employees = [];
  gameState.employees.push({
    id: 'emp_' + Date.now(),
    candidateId: app.candidateId,
    name: app.candidateName,
    nick: app.nick,
    age: app.age,
    gender: app.gender,
    roleId: app.roleId,
    roleName: app.roleName,
    roleIcon: app.roleIcon,
    salary: finalSalary,
    scheduleId: app.scheduleId,
    scheduleLabel: app.scheduleLabel,
    locationId: app.locationId,
    locationName: app.locationName,
    hasCar: Boolean(app.hasCar),
    hiredDay: gameState.day,
    mood: 90
  });

  const jobObj = (gameState.jobPostings || []).find((j) => j.id === app.jobId);
  if (jobObj) jobObj.status = 'filled';

  if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
  dm.thread.push({
    sender: 'player',
    text: `🤝 Добро пожаловать в команду! Договорились: «${app.roleName}» в «${app.locationName}» за ${finalSalary} ₽/смену.`
  });

  renderJobInterviewChat(dm, body, onHudUpdate, showToast, refresh);

  try {
    const reply = await generateCandidateHireReaction(dm, true, finalSalary);
    dm.thread.push({ sender: 'client', text: reply });
    dm.thread.push({
      sender: 'system',
      text: `✅ ${app.candidateName} принят${app.gender === 'female' ? 'а' : ''} на работу (${finalSalary} ₽/см.)!`
    });
    gameState.mood = Math.min(100, gameState.mood + 4);
    playCoinSound();
    saveState();
    onHudUpdate();
    showToast(`🤝 ${app.candidateName} теперь в вашей команде!`);
  } finally {
    busyDmId = null;
    refresh();
  }
}

async function handleRejectCandidate(dmId, body, onHudUpdate, showToast, refresh) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  const app = dm?.jobApplication;
  if (!dm || !app || busyDmId || app.status !== 'interviewing') return;

  busyDmId = dmId;
  app.status = 'rejected';
  if (!Array.isArray(dm.thread)) dm.thread = [{ sender: 'client', text: dm.text }];
  dm.thread.push({
    sender: 'player',
    text: 'Спасибо за отклик! К сожалению, пока мы не готовы сделать вам предложение о работе.'
  });

  renderJobInterviewChat(dm, body, onHudUpdate, showToast, refresh);

  try {
    const reply = await generateCandidateHireReaction(dm, false, app.agreedSalary);
    dm.thread.push({ sender: 'client', text: reply });
    dm.thread.push({ sender: 'system', text: '❌ Кандидат отклонён.' });
    saveState();
    showToast(`Собеседование с ${app.candidateName} завершено`);
  } finally {
    busyDmId = null;
    refresh();
  }
}

function syncAgreedPreorder(dm, orderData) {
  dm.kind = 'preorder';
  dm.order = {
    ...dm.order,
    ...orderData,
    accepted: true,
    rejected: false,
    done: false
  };

  if (!Array.isArray(gameState.preorders)) gameState.preorders = [];
  const existing = gameState.preorders.find(
    (p) => p.dmId === dm.id && (p.status === 'waiting' || p.status === 'in_shop')
  );
  if (existing) {
    existing.typeId = orderData.typeId;
    existing.flowerName = orderData.flowerName;
    existing.qty = orderData.qty;
    existing.reward = orderData.reward;
    existing.dueMinutes = orderData.dueMinutes;
    existing.dueTimeLabel = orderData.dueTimeLabel;
    existing.accessoryId = orderData.accessoryId || null;
    existing.accessoryName = orderData.accessoryName || null;
  } else {
    gameState.preorders.push({
      id: 'pre_' + dm.id + '_' + Date.now(),
      dmId: dm.id,
      senderName: dm.senderName,
      typeId: orderData.typeId,
      flowerName: orderData.flowerName,
      qty: orderData.qty,
      reward: orderData.reward,
      dueMinutes: orderData.dueMinutes,
      dueTimeLabel: orderData.dueTimeLabel,
      accessoryId: orderData.accessoryId || null,
      accessoryName: orderData.accessoryName || null,
      day: gameState.day,
      status: 'waiting'
    });
  }
}

async function handleDirectAcceptOrder(dmId, body, onHudUpdate, showToast, refresh) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || !dm.order || busyDmId || dm.blockedByClient || dm.blockedByPlayer) return;

  showDmRejectMenu = false;
  if (!Array.isArray(dm.thread)) {
    dm.thread = [{ sender: 'client', text: dm.text }];
  }

  syncAgreedPreorder(dm, dm.order);
  const accPart = dm.order.accessoryName ? ` и «${dm.order.accessoryName}»` : '';
  const playerMsg = `✅ Приняли ваш заказ! Подготовим ${dm.order.qty} шт. «${dm.order.flowerName}»${accPart} к ${dm.order.dueTimeLabel}. Ждём вас! 🌸`;
  dm.thread.push({ sender: 'player', text: playerMsg });
  dm.thread.push({
    sender: 'system',
    text: `✅ Предзаказ подтверждён: визит к ${dm.order.dueTimeLabel} (${dm.order.reward} ₽).`
  });
  dm.read = true;
  busyDmId = dmId;

  renderDirectApp(body, onHudUpdate, showToast, refresh);

  try {
    const res = await generateDirectFollowUp(dm, playerMsg, null);
    dm.thread.push({ sender: 'client', text: res.reply });
    gameState.mood = Math.min(100, gameState.mood + 2);
    saveState();
    onHudUpdate();
    showToast(`🤝 Предзаказ от ${dm.senderName} принят на ${dm.order.dueTimeLabel}!`);
  } finally {
    busyDmId = null;
    refresh();
  }
}

async function handleDirectRejectOrder(dmId, reason, isSilent, body, onHudUpdate, showToast, refresh) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || !dm.order || busyDmId || dm.blockedByClient || dm.blockedByPlayer) return;

  showDmRejectMenu = false;
  if (!Array.isArray(dm.thread)) {
    dm.thread = [{ sender: 'client', text: dm.text }];
  }

  const playerMsg = isSilent
    ? 'К сожалению, не сможем взять заказ.'
    : `К сожалению, не сможем взять заказ (${reason}).`;

  dm.thread.push({ sender: 'player', text: playerMsg });
  dm.order.accepted = false;
  dm.order.rejected = true;
  gameState.preorders = gameState.preorders.filter((p) => !(p.dmId === dm.id && p.status !== 'done'));
  dm.read = true;
  busyDmId = dmId;

  renderDirectApp(body, onHudUpdate, showToast, refresh);

  try {
    const res = await generateDirectRejectionReply(dm, reason, isSilent);
    dm.thread.push({ sender: 'client', text: res.reply });

    if (res.raisedBudgetAmount > 0 && dm.order && !dm.order.budgetRaisedOnce) {
      dm.order.budgetRaisedOnce = true;
      dm.order.reward = Number(dm.order.reward || 500) + res.raisedBudgetAmount;
      dm.order.rejected = false;
      dm.thread.push({
        sender: 'system',
        text: `💡 Клиент один раз поднял бюджет на +${res.raisedBudgetAmount} ₽ (теперь: ${dm.order.reward} ₽).`
      });
      showToast(`💬 ${dm.senderName} предложил(а) доплатить до ${dm.order.reward} ₽!`);
    } else {
      dm.thread.push({ sender: 'system', text: '❌ Заказ отклонён.' });
      showToast(`❌ Заказ от ${dm.senderName} отклонён`);
    }

    gameState.mood = Math.max(10, Math.min(100, gameState.mood + (res.moodDelta || 0)));
    saveState();
    onHudUpdate();
  } finally {
    busyDmId = null;
    refresh();
  }
}

async function handleDirectReply(dmId, text, body, onHudUpdate, showToast, attachedPhoto = null, refresh) {
  const dm = gameState.directMessages.find((m) => m.id === dmId);
  if (!dm || busyDmId || dm.blockedByClient || dm.blockedByPlayer) return;
  if (dm.order && dm.order.done) return;

  if (!Array.isArray(dm.thread)) {
    dm.thread = [{ sender: 'client', text: dm.text }];
  }

  const cleanText = String(text || '').trim();
  dm.thread.push({
    sender: 'player',
    text: cleanText,
    photoUrl: attachedPhoto ? attachedPhoto.dataUrl : undefined,
    photoDesc: attachedPhoto ? attachedPhoto.description : undefined
  });

  if (cleanText) dm.replyText = cleanText;
  dm.read = true;
  busyDmId = dmId;
  selectedDmPhotoId = null;
  showDmPhotoPicker = false;
  showDmRejectMenu = false;

  renderDirectApp(body, onHudUpdate, showToast, refresh);

  try {
    const res = await generateDirectFollowUp(dm, cleanText, attachedPhoto);
    dm.thread.push({ sender: 'client', text: res.reply });

    if (res.blockedByClient) {
      dm.blockedByClient = true;
      if (dm.order && !dm.order.done) {
        dm.order.accepted = false;
        dm.order.rejected = true;
        gameState.preorders = gameState.preorders.filter((p) => p.dmId !== dm.id);
      }
      gameState.followers = Math.max(0, gameState.followers - 1);
      gameState.mood = Math.max(10, gameState.mood - 5);
      showToast(`⛔ ${dm.senderName} заблокировал(а) вас за грубость!`);
    } else if (!dm.order && res.proposedOrder) {
      dm.kind = 'preorder';
      dm.order = {
        ...res.proposedOrder,
        accepted: false,
        rejected: false,
        done: false
      };
      showToast(`💐 ${dm.senderName} просит предзаказ — прими или откажи в чате!`);
    } else {
      showToast(`💬 ${dm.senderName} ответил(а) в Direct`);
    }

    if (!res.blockedByClient && !dm.rewardedFollowUp) {
      dm.rewardedFollowUp = true;
      gameState.mood = Math.max(0, Math.min(100, gameState.mood + (res.moodDelta || 2)));
      if ((cleanText.length >= 6 || attachedPhoto) && res.followerDelta > 0) {
        gameState.followers += res.followerDelta;
      }
    }

    saveState();
    onHudUpdate();
  } finally {
    busyDmId = null;
    refresh();
  }
}

function trimDirectMessages() {
  if (gameState.directMessages.length <= 14) return;
  const keepImportant = gameState.directMessages.filter(
    (m) =>
      !m.read ||
      (m.order && m.order.accepted && !m.order.done) ||
      (m.jobApplication && m.jobApplication.status === 'interviewing')
  );
  const others = gameState.directMessages.filter(
    (m) =>
      m.read &&
      !(m.order && m.order.accepted && !m.order.done) &&
      !(m.jobApplication && m.jobApplication.status === 'interviewing')
  );
  const combined = [...keepImportant, ...others];
  gameState.directMessages = combined.slice(0, Math.max(14, keepImportant.length));
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
```

## File: js/screens/phone/phoneInsta.js
```javascript
/**
 * js/screens/phone/phoneInsta.js
 * Соцсеть InstaFlower: лента, посты, хэштеги, комментарии, промо и вакансии
 */

import {
  INSTA_HASHTAGS,
  DECOR_CATALOG,
  SHOP_LOCATIONS,
  JOB_ROLES,
  JOB_SCHEDULES
} from '../../config.js';
import { gameState, saveState, getTotalGameMinutes } from '../../state.js';
import { evaluateInstaPost, generateInstaCommentReply } from '../../ai.js';
import { playShutterSound, playCoinSound, playBellSound } from '../../sound.js';
import { captureShopInteriorPhoto, isShopDecorVisible } from './phoneCanvasSnap.js';

let selectedPhotoIndex = 0;
let selectedTags = ['#флористика', '#уютнаялавка'];
let isPosting = false;
let openCommentReplyKey = null;
let busyCommentKey = null;

let showJobForm = false;
let draftJobRoleId = 'assistant';
let draftJobSalary = 1200;
let draftJobScheduleId = 'full';
let draftJobLocationId = '';

const PROMO_CAMPAIGNS = [
  {
    id: 'promo_target',
    title: 'Таргет: букеты дня',
    desc: 'Чаще приходят по фото из постов и пишут в Direct',
    cost: 250,
    bonusType: 'target'
  },
  {
    id: 'promo_cozy',
    title: 'Акция «Уютный день»',
    desc: '+лайки, +подписчики к постам и больше гостей в зале',
    cost: 200,
    bonusType: 'cozy'
  },
  {
    id: 'promo_seasonal',
    title: 'Сезонный хит в топ',
    desc: 'Виральные сезонные клиенты с бюджетом +25%',
    cost: 350,
    bonusType: 'seasonal'
  }
];

export function renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone) {
  const refresh = onRefreshPhone || (() => renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone));
  const photos = gameState.savedPhotos || [];
  if (selectedPhotoIndex >= photos.length) selectedPhotoIndex = 0;
  const currentPhoto = photos[selectedPhotoIndex] || null;
  const handle = escapeHtml(gameState.instaHandle || '@fleur_atelier');

  const ownedShopLocs = SHOP_LOCATIONS.filter((l) =>
    (gameState.ownedLocations || ['shop_basement']).includes(l.id)
  );
  if (!draftJobLocationId || !ownedShopLocs.some((l) => l.id === draftJobLocationId)) {
    draftJobLocationId = gameState.shopLocationId || ownedShopLocs[0]?.id || 'shop_basement';
  }

  const openJobsCount = (gameState.jobPostings || []).filter((j) => j.status === 'open').length;

  const jobSectionHtml = showJobForm
    ? `
      <div class="job-form-box">
        <div class="row-between">
          <strong style="font-size:13px;">📢 Новая вакансия в ленту</strong>
          <button class="btn btn-soft" id="btn-close-job-form" style="padding:3px 8px; font-size:11px;">✕</button>
        </div>

        <div class="form-group">
          <label class="form-label" for="job-role-select">Должность</label>
          <select class="form-select" id="job-role-select" style="padding:7px 10px; font-size:12.5px;">
            ${JOB_ROLES.map((r) => `<option value="${r.id}" ${r.id === draftJobRoleId ? 'selected' : ''}>${r.icon} ${r.name}</option>`).join('')}
          </select>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
          <div class="form-group">
            <label class="form-label" for="job-salary-input">Ставка (₽/смена)</label>
            <input type="number" class="form-input" id="job-salary-input" value="${draftJobSalary}" min="400" step="50" style="padding:7px 10px; font-size:12.5px;" />
          </div>
          <div class="form-group">
            <label class="form-label" for="job-location-select">Точка</label>
            <select class="form-select" id="job-location-select" style="padding:7px 10px; font-size:12px;">
              ${ownedShopLocs.map((l) => `<option value="${l.id}" ${l.id === draftJobLocationId ? 'selected' : ''}>${escapeHtml(l.name)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="job-schedule-select">График работы</label>
          <select class="form-select" id="job-schedule-select" style="padding:7px 10px; font-size:12px;">
            ${JOB_SCHEDULES.map((s) => `<option value="${s.id}" ${s.id === draftJobScheduleId ? 'selected' : ''}>${s.label}</option>`).join('')}
          </select>
        </div>

        <button class="btn btn-sage" id="btn-publish-job" style="padding:9px 12px; font-size:12.5px;">
          📢 Опубликовать вакансию
        </button>
      </div>
    `
    : `
      <button class="btn btn-sage" id="btn-open-job-form" style="padding:9px 12px; font-size:12.5px;">
        📢 Подать объявление о работе ${openJobsCount > 0 ? `(активно: ${openJobsCount})` : ''}
      </button>
    `;

  const activePromo =
    gameState.activePromo && gameState.activePromo.day === gameState.day ? gameState.activePromo : null;

  const promoHtml = activePromo
    ? `
      <div class="insta-promo-box">
        <div class="row-between">
          <strong style="font-size:12.5px;">📣 Акция на сегодня запущена</strong>
          <span class="badge badge-ok">Активна</span>
        </div>
        <div class="muted-text" style="font-size:11.5px;">
          <strong>${escapeHtml(activePromo.title)}</strong> — ${escapeHtml(activePromo.desc)}
        </div>
      </div>
    `
    : `
      <div class="insta-promo-box">
        <strong style="font-size:12.5px;">📣 Промо-акция в соцсети (на весь день)</strong>
        ${PROMO_CAMPAIGNS.map((p) => `
          <button class="promo-option-btn" data-launch-promo="${p.id}">
            <div style="flex:1; min-width:0;">
              <strong>${escapeHtml(p.title)}</strong>
              <div class="muted-text" style="font-size:10.5px;">${escapeHtml(p.desc)}</div>
            </div>
            <span class="badge badge-warn">${p.cost} ₽</span>
          </button>
        `).join('')}
      </div>
    `;

  const pickerHtml = photos.length
    ? photos
        .map(
          (p, idx) => `
        <div class="photo-pick-item ${idx === selectedPhotoIndex ? 'selected' : ''}" data-pick-photo="${idx}">
          <img src="${p.dataUrl}" alt="Фото ${idx + 1}" />
        </div>
      `
        )
        .join('')
    : `<p class="muted-text" style="font-size:12px;">В галерее пока пусто — сфоткай букет на Столе сборки или нажми кнопку ниже, чтобы снять витрину!</p>`;

  const tagsHtml = INSTA_HASHTAGS.map(
    (tag) => `
      <button class="hashtag-chip ${selectedTags.includes(tag) ? 'active' : ''}" data-toggle-tag="${tag}">
        ${tag}
      </button>
    `
  ).join('');

  const feedHtml = gameState.instaPosts.length
    ? gameState.instaPosts.map((post) => renderInstaPostCard(post, handle)).join('')
    : `<p class="muted-text" style="text-align:center; padding: 12px;">Лента пока пуста. Опубликуй свой первый пост, чтобы набирать подписчиков и приводить гостей из соцсети!</p>`;

  body.innerHTML = `
    ${jobSectionHtml}

    ${promoHtml}

    <div class="card" style="padding: 12px;">
      <div class="row-between">
        <div class="card-title">✨ Новый пост (${handle})</div>
        <button class="btn btn-soft" id="btn-snap-interior" style="padding: 5px 8px; font-size: 11px;">
          📷 Снять зал
        </button>
      </div>

      <div class="photo-picker-row">${pickerHtml}</div>

      ${currentPhoto ? `
        <input type="text" class="form-input" id="insta-caption" autocomplete="off" data-form-type="other" data-lpignore="true" placeholder="Напиши душевную подпись к фото..." />
        <div class="hashtags-row">${tagsHtml}</div>
        <button class="btn btn-primary" id="btn-publish-post" ${isPosting ? 'disabled' : ''}>
          ${isPosting ? '⏳ Аудитория смотрит пост...' : '🚀 Опубликовать пост'}
        </button>
      ` : ''}
    </div>

    <div class="card-title" style="padding-left: 4px;">📱 Твоя лента (${gameState.instaPosts.length})</div>
    ${feedHtml}
  `;

  document.getElementById('btn-open-job-form')?.addEventListener('click', () => {
    showJobForm = true;
    renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
  });

  document.getElementById('btn-close-job-form')?.addEventListener('click', () => {
    showJobForm = false;
    renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
  });

  document.getElementById('job-role-select')?.addEventListener('change', (e) => {
    draftJobRoleId = e.target.value;
    const roleMeta = JOB_ROLES.find((r) => r.id === draftJobRoleId);
    if (roleMeta) draftJobSalary = roleMeta.baseSalary;
    renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
  });

  document.getElementById('job-salary-input')?.addEventListener('input', (e) => {
    draftJobSalary = Math.max(400, Number(e.target.value) || 1200);
  });

  document.getElementById('job-location-select')?.addEventListener('change', (e) => {
    draftJobLocationId = e.target.value;
  });

  document.getElementById('job-schedule-select')?.addEventListener('change', (e) => {
    draftJobScheduleId = e.target.value;
  });

  document.getElementById('btn-publish-job')?.addEventListener('click', () => {
    const roleMeta = JOB_ROLES.find((r) => r.id === draftJobRoleId) || JOB_ROLES[0];
    const locMeta = SHOP_LOCATIONS.find((l) => l.id === draftJobLocationId) || SHOP_LOCATIONS[0];
    const schedMeta = JOB_SCHEDULES.find((s) => s.id === draftJobScheduleId) || JOB_SCHEDULES[0];
    const salary = Math.max(
      400,
      Number(document.getElementById('job-salary-input')?.value) || roleMeta.baseSalary
    );

    const jobId = 'job_' + Date.now();
    const totalNow = getTotalGameMinutes();
    const delayMins = 80 + Math.floor(Math.random() * 70);

    if (!Array.isArray(gameState.jobPostings)) gameState.jobPostings = [];
    gameState.jobPostings.unshift({
      id: jobId,
      roleId: roleMeta.id,
      roleName: roleMeta.name,
      roleIcon: roleMeta.icon,
      salary,
      scheduleId: schedMeta.id,
      scheduleLabel: schedMeta.label,
      locationId: locMeta.id,
      locationName: locMeta.name,
      day: gameState.day,
      postedTotalMin: totalNow,
      nextResponseTotalMin: totalNow + delayMins,
      respondedCount: 0,
      status: 'open'
    });

    gameState.instaPosts.unshift({
      id: 'post_job_' + Date.now(),
      isJobPost: true,
      jobId,
      roleIcon: roleMeta.icon,
      roleName: roleMeta.name,
      salary,
      scheduleLabel: schedMeta.label,
      locationName: locMeta.name,
      likes: 6 + Math.floor(Math.random() * 10),
      followerDelta: 1,
      verdict: 'Вакансия открыта 📢',
      hashtags: ['#работа', '#вакансия', '#флористика'],
      comments: [
        { author: '@marina_v', text: 'Отправлю знакомой, как раз искала подработку в уютном месте!' },
        { author: '@artem_life', text: `Отличная ставка (${salary} ₽/см.), удачи с поисками!` }
      ]
    });

    gameState.followers += 1;
    showJobForm = false;
    playBellSound();
    saveState();
    onHudUpdate();
    showToast('📢 Вакансия опубликована! Отклики придут в Direct через пару игровых часов.');
    refresh();
  });

  body.querySelectorAll('[data-launch-promo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const camp = PROMO_CAMPAIGNS.find((c) => c.id === btn.dataset.launchPromo);
      if (!camp) return;
      if (gameState.money < camp.cost) {
        showToast('Недостаточно денег для запуска акции!');
        return;
      }
      gameState.money -= camp.cost;
      gameState.totalSpent += camp.cost;
      gameState.activePromo = {
        id: camp.id,
        title: camp.title,
        desc: camp.desc,
        bonusType: camp.bonusType,
        day: gameState.day,
        cost: camp.cost
      };
      gameState.mood = Math.min(100, gameState.mood + 3);
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`📣 Запущена акция «${camp.title}»!`);
      renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
    });
  });

  body.querySelectorAll('[data-pick-photo]').forEach((el) => {
    el.addEventListener('click', () => {
      selectedPhotoIndex = Number(el.dataset.pickPhoto);
      renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
    });
  });

  body.querySelectorAll('[data-toggle-tag]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.toggleTag;
      if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter((t) => t !== tag);
      } else if (selectedTags.length < 4) {
        selectedTags.push(tag);
      } else {
        showToast('Максимум 4 хэштега в посте');
      }
      renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
    });
  });

  body.querySelectorAll('[data-open-comment-reply]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.openCommentReply;
      openCommentReplyKey = openCommentReplyKey === key ? null : key;
      renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
    });
  });

  body.querySelectorAll('[data-send-comment-reply]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sendCommentReply;
      const [postId, idxStr] = key.split(':');
      const input = document.getElementById(`comment-reply-input-${postId}-${idxStr}`);
      const text = input?.value.trim();
      if (!text) return;
      handleCommentReply(postId, Number(idxStr), text, body, onHudUpdate, showToast, refresh);
    });
  });

  document.getElementById('btn-snap-interior')?.addEventListener('click', () => {
    playShutterSound();
    const shopPhotoUrl = captureShopInteriorPhoto();
    const activeDecorNames = DECOR_CATALOG.filter(
      (d) => d.place === 'Магазин' && isShopDecorVisible(d.id)
    ).map((d) => d.name);
    const decorNote = activeDecorNames.length ? `, декор: ${activeDecorNames.join(', ')}` : '';

    gameState.savedPhotos.unshift({
      id: 'shop_' + Date.now(),
      dataUrl: shopPhotoUrl,
      type: 'shop',
      description: `Уютный интерьер цветочной лавки (${gameState.inventory.length} ваз с цветами${decorNote})`,
      day: gameState.day
    });
    if (gameState.savedPhotos.length > 10) gameState.savedPhotos = gameState.savedPhotos.slice(0, 10);
    selectedPhotoIndex = 0;
    saveState();
    showToast('📸 Снимок зала сделан!');
    renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);
  });

  document.getElementById('btn-publish-post')?.addEventListener('click', async () => {
    if (!currentPhoto || isPosting) return;
    const caption = document.getElementById('insta-caption')?.value.trim() || '';
    isPosting = true;
    renderInstaApp(body, onHudUpdate, showToast, onRefreshPhone);

    try {
      const postType = currentPhoto.type === 'shop' ? 'shop' : 'bouquet';
      const detailsText = currentPhoto.description || 'Авторский букет';
      const result = await evaluateInstaPost({
        type: postType,
        caption,
        hashtags: selectedTags,
        detailsText
      });

      gameState.instaPosts.unshift({
        id: 'post_' + Date.now(),
        photoUrl: currentPhoto.dataUrl,
        type: postType,
        detailsText,
        items: Array.isArray(currentPhoto.items) ? [...currentPhoto.items] : [],
        targetPrice: Number(currentPhoto.price) || 0,
        caption,
        hashtags: [...selectedTags],
        likes: result.likes,
        followerDelta: result.followerDelta,
        verdict: result.verdict,
        comments: result.comments
      });

      gameState.followers = Math.max(0, gameState.followers + result.followerDelta);
      if (result.followerDelta > 0) {
        gameState.mood = Math.min(100, gameState.mood + 2);
      }
      saveState();
      onHudUpdate();
      showToast(`${result.verdict} (${result.followerDelta >= 0 ? '+' : ''}${result.followerDelta} подп.)`);
    } finally {
      isPosting = false;
      refresh();
    }
  });
}

function renderInstaPostCard(post, handle) {
  const commentsHtml = post.comments?.length
    ? `
      <div class="insta-comments-box">
        ${post.comments
          .map((c, idx) => {
            const key = `${post.id}:${idx}`;
            const isOpen = openCommentReplyKey === key;
            const isBusy = busyCommentKey === key;
            return `
              <div class="insta-comment-item">
                <div class="row-between" style="align-items:flex-start;">
                  <div><strong>${escapeHtml(c.author)}:</strong> ${escapeHtml(c.text)}</div>
                  ${!c.ownerReply ? `
                    <button class="btn btn-soft" data-open-comment-reply="${key}" style="padding:2px 6px; font-size:10px; flex-shrink:0;">
                      Ответить
                    </button>
                  ` : ''}
                </div>
                ${c.ownerReply ? `
                  <div class="insta-comment-reply">
                    <strong>${handle}:</strong> ${escapeHtml(c.ownerReply)}
                  </div>
                ` : ''}
                ${c.followUpReply ? `
                  <div class="insta-comment-reply" style="border-left-color: var(--sage);">
                    <strong>${escapeHtml(c.author)}:</strong> ${escapeHtml(c.followUpReply)}
                  </div>
                ` : ''}
                ${isBusy ? `<div class="muted-text" style="font-size:10.5px;">💬 ${escapeHtml(c.author)} печатает...</div>` : ''}
                ${isOpen && !c.ownerReply ? `
                  <div class="insta-reply-row">
                    <input type="text" class="form-input" id="comment-reply-input-${post.id}-${idx}" autocomplete="off" data-form-type="other" data-lpignore="true" placeholder="Ответить подписчику..." style="padding:4px 7px; font-size:11px;" />
                    <button class="btn btn-primary" data-send-comment-reply="${key}" style="padding:4px 8px; font-size:11px;">➤</button>
                  </div>
                ` : ''}
              </div>
            `;
          })
          .join('')}
      </div>
    `
    : '';

  if (post.isJobPost) {
    const jobObj = (gameState.jobPostings || []).find((j) => j.id === post.jobId);
    const isClosed = jobObj && jobObj.status !== 'open';
    return `
      <div class="insta-job-card">
        <div class="row-between">
          <span style="font-size:12px; font-weight:800;">🌸 ${handle}</span>
          <span class="badge ${isClosed ? 'badge-warn' : 'badge-ok'}">${isClosed ? 'Сотрудник нанят ✓' : 'Вакансия открыта 📢'}</span>
        </div>
        <strong style="font-size:14px;">${post.roleIcon || '💼'} Ищем: ${escapeHtml(post.roleName)}</strong>
        <div class="insta-job-details">
          <span class="job-detail-pill">💰 ${post.salary} ₽ / смена</span>
          <span class="job-detail-pill">🏪 ${escapeHtml(post.locationName)}</span>
          <span class="job-detail-pill">🕒 ${escapeHtml(post.scheduleLabel)}</span>
        </div>
        <div class="row-between" style="font-size:12px;">
          <strong>❤️ ${post.likes || 5}</strong>
          <span class="muted-text" style="font-size:11px;">Отклики приходят в Direct</span>
        </div>
        ${commentsHtml}
      </div>
    `;
  }

  return `
    <div class="insta-post-card">
      <div class="insta-post-header">
        <span>🌸 ${handle}</span>
        <span class="badge ${post.followerDelta > 0 ? 'badge-ok' : 'badge-warn'}">${post.verdict}</span>
      </div>
      <img class="insta-post-img" src="${post.photoUrl}" alt="Пост" />
      <div class="insta-post-body">
        <div class="row-between">
          <strong>❤️ ${post.likes}</strong>
          <span class="muted-text" style="font-size:11.5px;">
            Подписчики: ${post.followerDelta >= 0 ? `+${post.followerDelta}` : post.followerDelta}
          </span>
        </div>
        ${post.caption ? `<p>${escapeHtml(post.caption)}</p>` : ''}
        <p class="muted-text" style="font-size:11px; color: var(--sage-dark);">${post.hashtags.join(' ')}</p>
        ${commentsHtml}
      </div>
    </div>
  `;
}

async function handleCommentReply(postId, commentIdx, text, body, onHudUpdate, showToast, refresh) {
  const post = gameState.instaPosts.find((p) => p.id === postId);
  const comment = post?.comments?.[commentIdx];
  if (!post || !comment || comment.ownerReply || busyCommentKey) return;

  const key = `${postId}:${commentIdx}`;
  comment.ownerReply = text;
  openCommentReplyKey = null;
  busyCommentKey = key;
  renderInstaApp(body, onHudUpdate, showToast, refresh);

  try {
    const res = await generateInstaCommentReply(post, comment, text);
    if (res.shouldReply && res.replyText) {
      comment.followUpReply = res.replyText;
    }
    post.likes = Math.max(0, (post.likes || 0) + (res.bonusLikes || 0));
    if (res.followerDelta) {
      gameState.followers = Math.max(0, gameState.followers + res.followerDelta);
      post.followerDelta = (post.followerDelta || 0) + res.followerDelta;
    }
    gameState.mood = Math.min(100, Math.max(10, gameState.mood + (res.followerDelta < 0 ? -2 : 1)));
    saveState();
    onHudUpdate();
    if (res.shouldReply && res.replyText) {
      showToast(`💬 ${comment.author} ответил(а) под постом!`);
    } else {
      showToast('💬 Ответ на комментарий опубликован!');
    }
  } finally {
    busyCommentKey = null;
    refresh();
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
```

## File: js/screens/phone/phoneRealtor.js
```javascript
/**
 * js/screens/phone/phoneRealtor.js
 * Агентство недвижимости: покупка и смена помещений магазина и квартир
 */

import { SHOP_LOCATIONS, HOME_LOCATIONS } from '../../config.js';
import { gameState, saveState } from '../../state.js';
import { playCoinSound } from '../../sound.js';

export function renderRealtorApp(body, onHudUpdate, showToast) {
  const owned = new Set(gameState.ownedLocations || ['shop_basement', 'home_studio']);

  const renderCard = (loc, kind) => {
    const isOwned = owned.has(loc.id);
    const isCurrent =
      kind === 'shop' ? gameState.shopLocationId === loc.id : gameState.homeLocationId === loc.id;

    let actionBtn = '';
    if (isCurrent) {
      actionBtn = `<span class="badge badge-ok">Активно ✓</span>`;
    } else if (isOwned) {
      actionBtn = `<button class="btn btn-sage" data-select-loc="${kind}:${loc.id}" style="padding:6px 10px; font-size:11.5px;">Переехать</button>`;
    } else {
      actionBtn = `<button class="btn btn-primary" data-buy-loc="${kind}:${loc.id}" style="padding:6px 10px; font-size:11.5px;">Купить (${loc.price.toLocaleString('ru-RU')} ₽)</button>`;
    }

    return `
      <div class="realtor-card ${isCurrent ? 'current' : ''}">
        <div class="row-between">
          <strong style="font-size:13px;">${escapeHtml(loc.name)}</strong>
          ${actionBtn}
        </div>
        <p class="muted-text" style="font-size:11.5px;">${escapeHtml(loc.desc)}</p>
      </div>
    `;
  };

  body.innerHTML = `
    <div class="card-title" style="padding-left:4px;">🏪 Помещения под магазин</div>
    ${SHOP_LOCATIONS.map((l) => renderCard(l, 'shop')).join('')}
    <div class="card-title" style="padding-left:4px; margin-top:4px;">🏠 Квартиры для флориста</div>
    ${HOME_LOCATIONS.map((l) => renderCard(l, 'home')).join('')}
  `;

  body.querySelectorAll('[data-buy-loc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [kind, locId] = btn.dataset.buyLoc.split(':');
      const list = kind === 'shop' ? SHOP_LOCATIONS : HOME_LOCATIONS;
      const loc = list.find((l) => l.id === locId);
      if (!loc) return;
      if (gameState.money < loc.price) {
        showToast('Недостаточно денег на покупку недвижимости!');
        return;
      }

      gameState.money -= loc.price;
      gameState.totalSpent += loc.price;
      if (!Array.isArray(gameState.ownedLocations)) {
        gameState.ownedLocations = ['shop_basement', 'home_studio'];
      }
      if (!gameState.ownedLocations.includes(loc.id)) {
        gameState.ownedLocations.push(loc.id);
      }
      if (kind === 'shop') gameState.shopLocationId = loc.id;
      else gameState.homeLocationId = loc.id;

      gameState.mood = Math.min(100, gameState.mood + 10);
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`🎉 Поздравляем с переездом в «${loc.name}»!`);
      renderRealtorApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-select-loc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [kind, locId] = btn.dataset.selectLoc.split(':');
      if (kind === 'shop') gameState.shopLocationId = locId;
      else gameState.homeLocationId = locId;
      saveState();
      showToast('✨ Локация переключена!');
      renderRealtorApp(body, onHudUpdate, showToast);
    });
  });
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
```

## File: js/screens/phone/phoneWholesale.js
```javascript
/**
 * js/screens/phone/phoneWholesale.js
 * Оптовый поставщик: регулярный прайс, акции дня, термозащита и сопутствующие товары
 */

import {
  FLOWERS_CATALOG,
  ACCESSORIES_CATALOG,
  getGameDateObj,
  getHolidayForDate
} from '../../config.js';
import { gameState, saveState } from '../../state.js';
import { getSingleFlowerWrappedSvg } from '../../graphics/flowersSvg.js';
import { playCoinSound } from '../../sound.js';

let frostThermalWrap = true;

export function ensureWholesaleDeals() {
  if (gameState.wholesaleDay === gameState.day && gameState.wholesaleDeals.length > 0) return;

  const keys = Object.keys(FLOWERS_CATALOG);
  const f1 = FLOWERS_CATALOG[keys[Math.floor(Math.random() * keys.length)]];
  const f2 = FLOWERS_CATALOG[keys[Math.floor(Math.random() * keys.length)]];

  gameState.wholesaleDay = gameState.day;
  gameState.wholesaleDeals = [
    {
      id: 'deal_defect_' + gameState.day,
      title: `Уценка (замятая коробка): ${f1.name}`,
      typeId: f1.id,
      qty: 8,
      freshness: 58,
      price: Math.round(f1.wholesalePrice * 8 * 0.55),
      tag: 'Брак -45%, свежесть 58%',
      bought: false
    },
    {
      id: 'deal_promo_' + gameState.day,
      title: `Акция дня: ${f2.name} (свежайшие)`,
      typeId: f2.id,
      qty: 6,
      freshness: 100,
      price: Math.round(f2.wholesalePrice * 6 * 0.78),
      tag: 'Скидка -22%, свежесть 100%',
      bought: false
    }
  ];
  saveState();
}

export function renderWholesaleApp(body, onHudUpdate, showToast) {
  ensureWholesaleDeals();

  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const isHoliday = Boolean(getHolidayForDate(curDate));
  const priceMult = isHoliday ? 2 : 1;
  const isFrost = gameState.weather === 'frost';
  const thermalFee = isFrost && frostThermalWrap ? 100 : 0;

  const dealsHtml = gameState.wholesaleDeals
    .map((d) => {
      const finalPrice = d.price * priceMult + (d.bought ? 0 : thermalFee);
      return `
      <div class="wholesale-deal-card">
        <div class="row-between">
          <strong style="font-size:12.5px;">🔥 ${d.title}</strong>
          <span class="badge badge-warn">${d.tag}</span>
        </div>
        <div class="row-between">
          <span class="muted-text">${d.qty} шт. • Итого: <strong>${finalPrice} ₽</strong></span>
          <button class="btn btn-primary" data-buy-deal="${d.id}" ${d.bought ? 'disabled style="opacity:0.5;"' : ''} style="padding:6px 10px; font-size:11.5px;">
            ${d.bought ? 'Куплено' : 'Заказать'}
          </button>
        </div>
      </div>
    `;
    })
    .join('');

  const accessoriesHtml = Object.values(ACCESSORIES_CATALOG)
    .map((acc) => {
      const owned = (gameState.accessoriesInventory || []).find((a) => a.id === acc.id)?.qty || 0;
      const cost1 = acc.wholesalePrice;
      const cost3 = Math.round(acc.wholesalePrice * 3 * 0.92);
      return `
      <div class="wholesale-row">
        <div style="width:42px; height:42px; border-radius:10px; background:var(--bg-soft); display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0;">
          ${acc.icon}
        </div>
        <div style="flex:1; min-width:0;">
          <strong style="font-size:12.5px;">${acc.name}</strong>
          <p class="muted-text" style="font-size:11px;">Розница: ${acc.price} ₽ • На полке: ${owned} шт.</p>
        </div>
        <div style="display:flex; flex-direction:column; gap:4px;">
          <button class="btn btn-soft" data-buy-acc="${acc.id}:1" style="padding:5px 8px; font-size:11px;">
            +1 шт (${cost1}₽)
          </button>
          <button class="btn btn-sage" data-buy-acc="${acc.id}:3" style="padding:5px 8px; font-size:11px;">
            +3 шт (${cost3}₽)
          </button>
        </div>
      </div>
    `;
    })
    .join('');

  const catalogHtml = Object.values(FLOWERS_CATALOG)
    .map((f) => {
      const price5 = f.wholesalePrice * 5 * priceMult + thermalFee;
      const price10 = Math.round(f.wholesalePrice * 10 * 0.92) * priceMult + thermalFee;
      return `
      <div class="wholesale-row">
        <div style="width:42px; height:48px; flex-shrink:0;">${getSingleFlowerWrappedSvg(f.id)}</div>
        <div style="flex:1; min-width:0;">
          <strong style="font-size:13px;">${f.name}</strong>
          <p class="muted-text" style="font-size:11px;">Опт: ${f.wholesalePrice * priceMult} ₽/шт • Свежесть 100%</p>
        </div>
        <div style="display:flex; flex-direction:column; gap:4px;">
          <button class="btn btn-soft" data-buy-wh="${f.id}:5" style="padding:5px 8px; font-size:11px;">
            +5 шт (${price5}₽)
          </button>
          <button class="btn btn-sage" data-buy-wh="${f.id}:10" style="padding:5px 8px; font-size:11px;">
            +10 шт (${price10}₽)
          </button>
        </div>
      </div>
    `;
    })
    .join('');

  body.innerHTML = `
    ${isHoliday ? '<div class="badge badge-warn" style="text-align:center;">🎉 Праздничный день: оптовые цены поставщиков x2!</div>' : ''}
    ${isFrost ? `
      <label class="card" style="padding:10px; flex-direction:row; align-items:center; gap:8px; cursor:pointer;">
        <input type="checkbox" id="chk-thermal-wrap" ${frostThermalWrap ? 'checked' : ''} />
        <span style="font-size:12px;">❄️ На улице мороз! Термоупаковка (+100 ₽, без неё риск подморозить цветы)</span>
      </label>
    ` : ''}

    ${dealsHtml}
    <div class="card-title" style="padding-left:4px;">🎁 Сопутствующие товары (шарики, игрушки, конфеты)</div>
    ${accessoriesHtml}
    <div class="card-title" style="padding-left:4px;">📦 Обычный прайс поставщика</div>
    ${catalogHtml}
  `;

  document.getElementById('chk-thermal-wrap')?.addEventListener('change', (e) => {
    frostThermalWrap = e.target.checked;
    renderWholesaleApp(body, onHudUpdate, showToast);
  });

  body.querySelectorAll('[data-buy-deal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const deal = gameState.wholesaleDeals.find((d) => d.id === btn.dataset.buyDeal);
      if (!deal || deal.bought) return;
      const cost = deal.price * priceMult + thermalFee;
      if (gameState.money < cost) {
        showToast('Недостаточно денег на счёте!');
        return;
      }
      const actualFresh =
        isFrost && !frostThermalWrap && Math.random() < 0.5
          ? Math.max(25, deal.freshness - 25)
          : deal.freshness;
      deal.bought = true;
      buyFlowersBatch(deal.typeId, deal.qty, actualFresh, cost, onHudUpdate, showToast);
      renderWholesaleApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-buy-acc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [accId, qtyStr] = btn.dataset.buyAcc.split(':');
      const qty = Number(qtyStr);
      const acc = ACCESSORIES_CATALOG[accId];
      if (!acc) return;
      const cost = qty === 3 ? Math.round(acc.wholesalePrice * 3 * 0.92) : acc.wholesalePrice;
      if (gameState.money < cost) {
        showToast('Недостаточно денег на счёте!');
        return;
      }

      gameState.money -= cost;
      gameState.totalSpent += cost;
      if (!Array.isArray(gameState.accessoriesInventory)) gameState.accessoriesInventory = [];
      const existing = gameState.accessoriesInventory.find((a) => a.id === accId);
      if (existing) {
        existing.qty += qty;
      } else {
        gameState.accessoriesInventory.push({ id: accId, qty });
      }
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`🎁 Доставлено: ${acc.icon} ${acc.shortName} (+${qty} шт.)`);
      renderWholesaleApp(body, onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-buy-wh]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [typeId, qtyStr] = btn.dataset.buyWh.split(':');
      const qty = Number(qtyStr);
      const f = FLOWERS_CATALOG[typeId];
      if (!f) return;
      const baseCost = qty === 10 ? Math.round(f.wholesalePrice * 10 * 0.92) : f.wholesalePrice * 5;
      const cost = baseCost * priceMult + thermalFee;
      if (gameState.money < cost) {
        showToast('Недостаточно денег на счёте!');
        return;
      }
      const froze = isFrost && !frostThermalWrap && Math.random() < 0.5;
      const fresh = froze ? 65 : 100;
      buyFlowersBatch(typeId, qty, fresh, cost, onHudUpdate, showToast);
      if (froze) showToast('🥶 Партия подмёрзла в дороге! Свежесть 65%');
      renderWholesaleApp(body, onHudUpdate, showToast);
    });
  });
}

function buyFlowersBatch(typeId, qty, freshness, cost, onHudUpdate, showToast) {
  gameState.money -= cost;
  gameState.totalSpent += cost;

  const existing = gameState.inventory.find(
    (v) => v.typeId === typeId && !v.discounted && Math.abs(v.freshness - freshness) <= 12
  );

  if (existing) {
    existing.qty += qty;
    existing.freshness = Math.round((existing.freshness + freshness) / 2);
  } else {
    gameState.inventory.push({
      uid: 'vase_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      typeId,
      qty,
      freshness,
      discounted: false,
      wateredThisShift: false
    });
  }

  playCoinSound();
  saveState();
  onHudUpdate();
  showToast(`🚚 Доставлено: ${FLOWERS_CATALOG[typeId].shortName} (+${qty} шт.)`);
}
```

## File: js/screens/shop/shopClientZone.js
```javascript
/**
 * js/screens/shop/shopClientZone.js
 * Зона живых клиентов в торговом зале: карточка, чат, торг, предложения товаров и оплата
 */

import { FLOWERS_CATALOG, ACCESSORIES_CATALOG } from '/js/config.js';
import { gameState, aiSettings, saveState, addGameMinutes } from '/js/state.js';
import { getClientAvatarSvg } from '/js/graphics/avatarSvg.js';
import { getSingleFlowerWrappedSvg } from '/js/graphics/flowersSvg.js';
import {
  generateRandomClient,
  generatePreorderClient,
  buildClientSystemPrompt,
  callAI,
  parseClientJson
} from '/js/ai.js';
import { playBellSound, playCoinSound } from '/js/sound.js';

let activeClient = null;
let isAiThinking = false;
let showOfferDrawer = false;
let showRejectPanel = false;
let pendingOffer = null;
let lastFailedRequest = null;

const SHOP_REJECT_TEMPLATES = [
  'Нет нужных цветов в наличии',
  'Много заказов, не успеем собрать',
  'Бюджет маловат для такого букета',
  'Лавка скоро закрывается'
];

export function getActiveClient() {
  return activeClient;
}

export function setActiveClient(client) {
  activeClient = client;
}

export function getIsAiThinking() {
  return isAiThinking;
}

export function isClientTalkingNow() {
  return Boolean(activeClient && activeClient.status === 'talking');
}

export function checkPreorderArrival(onHudUpdate, showToast, renderShopMain) {
  if (!Array.isArray(gameState.preorders)) return false;

  let cleaned = false;
  gameState.preorders.forEach((p) => {
    if (p.day < gameState.day && (p.status === 'waiting' || p.status === 'in_shop')) {
      p.status = 'expired';
      const dm = (gameState.directMessages || []).find((m) => m.id === p.dmId);
      if (dm && dm.order && !dm.order.done) {
        dm.order.accepted = false;
        dm.order.rejected = true;
      }
      cleaned = true;
    }
  });
  if (cleaned) saveState();

  if (isClientTalkingNow() || isAiThinking) return false;

  const curMin = gameState.timeMinutes || 540;
  const duePreorder = gameState.preorders.find(
    (p) =>
      p.day === gameState.day &&
      ((p.status === 'in_shop' && !activeClient) || (p.status === 'waiting' && curMin >= p.dueMinutes))
  );
  if (!duePreorder) return false;

  duePreorder.status = 'in_shop';
  saveState();
  playBellSound();
  showToast(`🕒 Пришёл заказчик по предзаказу: ${duePreorder.senderName} (${duePreorder.dueTimeLabel})!`);
  summonPreorderClient(duePreorder, onHudUpdate, showToast, renderShopMain);
  return true;
}

export function renderClientZoneHtml(closedNow, waitingDue) {
  if (!activeClient) {
    if (waitingDue) {
      return `
        <div class="card" style="padding: 12px; text-align: center;">
          <p class="muted-text">🕒 У двери уже ждёт заказчик по предзаказу на ${waitingDue.dueTimeLabel}!</p>
          <button class="btn btn-primary" id="btn-call-due-preorder" data-preorder-id="${waitingDue.id}">
            🔔 Пригласить ${escapeHtml(waitingDue.senderName)}
          </button>
        </div>
      `;
    }
    if (closedNow) {
      return `
        <div class="card" style="padding: 12px; text-align: center;">
          <p class="muted-text">🌙 Рабочий день окончен — новые клиенты уже не заходят. Можешь дособирать букеты на завтра или отправиться в «🏠 Домик» спать.</p>
        </div>
      `;
    }
    return `
      <div class="card" style="padding: 12px; text-align: center;">
        <p class="muted-text">В зале пока тихо. Открой дверь для нового покупателя!</p>
        <button class="btn btn-primary" id="btn-call-client" ${isAiThinking ? 'disabled' : ''}>
          🔔 Позвать следующего клиента
        </button>
      </div>
    `;
  }

  const moodClass = activeClient.mood >= 65 ? 'fresh-high' : activeClient.mood >= 35 ? 'fresh-mid' : 'fresh-low';
  const shortPersona = activeClient.personality.split(',')[0];

  const chatHtml = activeClient.chatLog
    .map((m) => {
      if (m.sender === 'system') return `<div class="chat-bubble system-note">${escapeHtml(m.text)}</div>`;
      return `<div class="chat-bubble ${m.sender}">${escapeHtml(m.text)}</div>`;
    })
    .join('');

  const isFinished = activeClient.status !== 'talking';
  const showRecoveryActions = Boolean(lastFailedRequest && !isAiThinking && !isFinished);
  const wantedBouquet =
    !isFinished && activeClient.wantedBouquetId
      ? gameState.readyBouquets.find((b) => b.id === activeClient.wantedBouquetId)
      : null;

  return `
    <div class="client-card">
      <div class="client-header">
        <div class="client-avatar">
          ${getClientAvatarSvg(activeClient.appearance, activeClient.mood)}
        </div>
        <div class="client-info">
          <div class="client-name">
            ${escapeHtml(activeClient.name)}, ${activeClient.age}
            ${activeClient.preorder ? '<span class="badge badge-ok" style="margin-left:4px;">Предзаказ</span>' : ''}
            ${isFinished ? '<span class="badge badge-warn" style="margin-left:4px;">Завершён</span>' : ''}
          </div>
          <div class="client-tags">
            <span class="client-tag">${escapeHtml(shortPersona)}</span>
            <span class="client-tag">🎁 ${escapeHtml(activeClient.occasion)}</span>
          </div>
          <div class="client-mood-row">
            <span>Настроение: ${activeClient.mood}%</span>
            <div class="freshness-bar-bg" style="flex:1;">
              <div class="freshness-bar-fill ${moodClass}" style="width: ${activeClient.mood}%"></div>
            </div>
          </div>
        </div>
      </div>

      ${activeClient.inspiredByPost ? `
        <div class="client-post-ref">
          <img src="${activeClient.inspiredByPost.photoUrl}" alt="Пост" />
          <div style="flex:1; min-width:0;">
            <strong>📸 Запрос по вашему посту в InstaFlower</strong>
            <div class="muted-text" style="font-size:11px;">${escapeHtml(activeClient.inspiredByPost.description)}</div>
          </div>
        </div>
      ` : ''}

      <div class="chat-box" id="client-chat-box">
        ${chatHtml}
        ${isAiThinking ? '<div class="chat-typing">💬 Клиент думает...</div>' : ''}
      </div>

      ${showRecoveryActions ? `
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="btn btn-soft" id="btn-retry-ai" style="flex:1; font-size:12px; padding:7px 8px;">
            🔄 Повторить
          </button>
          <button class="btn btn-sage" id="btn-switch-offline-ai" style="flex:1; font-size:12px; padding:7px 8px;">
            ⚡ Включить встроенного бота
          </button>
        </div>
      ` : ''}

      ${wantedBouquet ? `
        <button class="btn btn-sage" id="btn-sell-wanted-bouquet" data-bouquet-id="${wantedBouquet.id}" ${isAiThinking ? 'disabled' : ''}>
          ⚡ Продать букет с витрины в 1 клик (${wantedBouquet.price} ₽)
        </button>
      ` : ''}

      ${isFinished ? (
        waitingDue
          ? `<button class="btn btn-primary" id="btn-call-due-preorder" data-preorder-id="${waitingDue.id}">🔔 Впустить предзаказчика (${escapeHtml(waitingDue.senderName)})</button>`
          : closedNow
          ? `<div class="muted-text" style="text-align:center; font-size:12px;">🌙 Лавка уже закрыта. Пора в «🏠 Домик» отдыхать!</div>`
          : `<button class="btn btn-primary" id="btn-call-client">🔔 Позвать следующего клиента</button>`
      ) : `
        <div class="chat-input-row">
          <input
            type="text"
            class="form-input"
            id="client-chat-input"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            data-form-type="other"
            data-lpignore="true"
            placeholder="Напиши клиенту..."
            ${isAiThinking ? 'disabled' : ''}
          />
          <button class="btn btn-sage" id="btn-send-chat" ${isAiThinking ? 'disabled' : ''} title="Отправить">
            ➤
          </button>
        </div>

        <div style="display:flex; gap:6px;">
          <button class="btn btn-primary" id="btn-toggle-offer" ${isAiThinking ? 'disabled' : ''} style="flex:1;">
            ${showOfferDrawer ? '✕ Скрыть витрину' : '💐 Предложить'}
          </button>
          <button class="btn btn-danger" id="btn-toggle-reject" ${isAiThinking ? 'disabled' : ''} style="padding: 10px 12px;">
            🚫 Отказать
          </button>
        </div>

        ${showRejectPanel ? renderClientRejectPanel() : ''}
        ${showOfferDrawer ? renderOfferDrawer() : ''}
      `}
    </div>
  `;
}

function renderClientRejectPanel() {
  return `
    <div class="client-reject-panel">
      <div class="row-between">
        <strong style="font-size:12px;">Причина отказа (можно не указывать):</strong>
        <button class="btn btn-soft" id="btn-close-reject-panel" style="padding:2px 7px; font-size:11px;">✕</button>
      </div>
      <div class="client-reject-chips">
        ${SHOP_REJECT_TEMPLATES.map((tpl) => `
          <button class="client-reject-chip" data-shop-reject-tpl="${escapeAttr(tpl)}" ${isAiThinking ? 'disabled' : ''}>
            ${escapeHtml(tpl)}
          </button>
        `).join('')}
      </div>
      <div style="display:flex; gap:6px;">
        <input
          type="text"
          class="form-input"
          id="shop-reject-reason-input"
          autocomplete="off"
          data-form-type="other"
          data-lpignore="true"
          placeholder="Своя причина (необязательно)..."
          style="padding:7px 9px; font-size:12px;"
          ${isAiThinking ? 'disabled' : ''}
        />
        <button class="btn btn-danger" id="btn-send-custom-shop-reject" ${isAiThinking ? 'disabled' : ''} style="padding:7px 10px; font-size:12px;">
          Отказать
        </button>
      </div>
    </div>
  `;
}

function renderOfferDrawer() {
  const readyHtml = gameState.readyBouquets.length
    ? gameState.readyBouquets
        .map(
          (b) => `
        <div class="offer-item-row">
          <img class="offer-thumb" src="${b.thumbnail}" alt="Букет" />
          <div style="flex:1; min-width:0;">
            <strong style="font-size:12px;">Готовый букет</strong>
            <p class="muted-text" style="font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${b.summary}</p>
          </div>
          <input type="number" class="offer-price-input" id="price-b-${b.id}" value="${b.price}" min="50" autocomplete="off" data-form-type="other" />
          <button class="btn btn-sage" data-offer-bouquet="${b.id}" style="padding:6px 9px; font-size:11.5px;">
            Дать
          </button>
        </div>
      `
        )
        .join('')
    : `<p class="muted-text" style="font-size:11.5px;">Готовых букетов нет — их можно собрать во вкладке «💐 Стол сборки».</p>`;

  const accessoriesHtml = (gameState.accessoriesInventory || [])
    .filter((acc) => acc.qty > 0)
    .map((acc) => {
      const meta = ACCESSORIES_CATALOG[acc.id];
      if (!meta) return '';
      return `
        <div class="offer-item-row">
          <div class="offer-thumb" style="display:flex; align-items:center; justify-content:center; font-size:24px;">${meta.icon}</div>
          <div style="flex:1; min-width:0;">
            <strong style="font-size:12px;">${meta.name}</strong>
            <p class="muted-text" style="font-size:11px;">Подарок • В наличии: ${acc.qty} шт.</p>
          </div>
          <input type="number" class="offer-price-input" id="price-acc-${acc.id}" value="${meta.price}" min="50" autocomplete="off" data-form-type="other" />
          <button class="btn btn-soft" data-offer-acc="${acc.id}" style="padding:6px 9px; font-size:11.5px;">
            Дать
          </button>
        </div>
      `;
    })
    .join('');

  const vasesHtml = gameState.inventory.length
    ? gameState.inventory
        .map((item) => {
          const meta = FLOWERS_CATALOG[item.typeId];
          if (!meta) return '';
          const unitPrice = getActualFlowerPrice(item, meta);
          return `
            <div class="offer-item-row">
              <div class="offer-thumb" style="padding:3px;">${getSingleFlowerWrappedSvg(item.typeId)}</div>
              <div style="flex:1; min-width:0;">
                <strong style="font-size:12px;">${meta.shortName} (1 шт.)</strong>
                <p class="muted-text" style="font-size:11px;">Свежесть ${item.freshness}% • Ост: ${item.qty}</p>
              </div>
              <input type="number" class="offer-price-input" id="price-v-${item.uid}" value="${unitPrice}" min="30" autocomplete="off" data-form-type="other" />
              <button class="btn btn-soft" data-offer-vase="${item.uid}" style="padding:6px 9px; font-size:11.5px;">
                Дать
              </button>
            </div>
          `;
        })
        .join('')
    : '';

  return `
    <div class="offer-drawer">
      <strong style="font-size:12.5px;">Выбери товар и цену для торга:</strong>
      ${readyHtml}
      ${accessoriesHtml ? `<strong style="font-size:12px; margin-top:2px;">🎁 Шарики, игрушки и конфеты:</strong>${accessoriesHtml}` : ''}
      ${vasesHtml}
    </div>
  `;
}

function getActualFlowerPrice(item, meta) {
  return item.discounted ? Math.round(meta.price * 0.6) : meta.price;
}

function getBouquetFreshnessWord(bouquet) {
  if (!Array.isArray(bouquet.stems) || bouquet.stems.length === 0) return 'свежие';
  const minFresh = Math.min(...bouquet.stems.map((s) => s.freshness ?? 85));
  if (minFresh < 40) return 'подвявшие, поникшие';
  if (minFresh < 70) return 'обычной свежести';
  return 'свежие';
}

function getVaseFreshnessWord(freshness) {
  if (freshness < 40) return 'подвявший, поникший';
  if (freshness < 70) return 'обычной свежести';
  return 'свежий';
}

function detectRequestedBouquetId(replyText) {
  if (!Array.isArray(gameState.readyBouquets) || gameState.readyBouquets.length === 0) return null;
  const text = String(replyText || '');
  const lower = text.toLowerCase();

  const idMatch = text.match(/\[id=([^\]]+)\]/);
  if (idMatch) {
    const byId = gameState.readyBouquets.find((b) => b.id === idMatch[1]);
    if (byId) return byId.id;
  }

  const mentionsBouquet =
    lower.includes('букет') ||
    lower.includes('витрин') ||
    lower.includes('прилав') ||
    lower.includes('стоит') ||
    lower.includes('можно мне его') ||
    lower.includes('заберу его');
  if (!mentionsBouquet) return null;

  const byPrice = gameState.readyBouquets.find((b) => lower.includes(String(b.price)));
  if (byPrice) return byPrice.id;

  if (
    gameState.readyBouquets.length === 1 &&
    (lower.includes('можно мне его') || lower.includes('что это за букет'))
  ) {
    return gameState.readyBouquets[0].id;
  }
  return null;
}

function cleanClientReplyText(text) {
  return String(text || '').replace(/\s*\[id=[^\]]+\]/g, '').trim();
}

export function handleCounterBouquetSell(bouquetId, onHudUpdate, showToast, renderShopMain) {
  if (!activeClient || isAiThinking || activeClient.status !== 'talking') return;
  const bouquet = gameState.readyBouquets.find((b) => b.id === bouquetId);
  if (!bouquet) return;

  const freshWord = getBouquetFreshnessWord(bouquet);
  const isWilted = freshWord.includes('подвявш');
  const clientAskedForThis = activeClient.wantedBouquetId === bouquetId;

  if (clientAskedForThis && !isWilted && !activeClient.preorder && bouquet.price <= activeClient.budget * 1.15) {
    showOfferDrawer = false;
    showRejectPanel = false;
    lastFailedRequest = null;

    activeClient.chatLog.push({
      sender: 'player',
      text: `💐 Продали букет с витрины (${bouquet.summary}) за ${bouquet.price} ₽`
    });

    const soldPrice = bouquet.price;
    const tip = completeSale(
      {
        kind: 'bouquet',
        id: bouquet.id,
        price: soldPrice,
        summary: `Готовый букет (${bouquet.summary})`
      },
      onHudUpdate,
      showToast
    );

    activeClient.chatLog.push({
      sender: 'client',
      text: `Ой, какая красота! С огромным удовольствием забираю за ${soldPrice} ₽, спасибо! 🌸`
    });
    activeClient.chatLog.push({
      sender: 'system',
      text: tip > 0
        ? `✅ Сделка состоялась! Продано за ${soldPrice} ₽ + чаевые ${tip} ₽ 🌟`
        : `✅ Сделка состоялась! Продано за ${soldPrice} ₽`
    });

    activeClient.status = 'bought';
    activeClient.wantedBouquetId = null;
    renderShopMain();
    return;
  }

  const offer = {
    kind: 'bouquet',
    id: bouquet.id,
    price: bouquet.price,
    summary: `Готовый букет (${bouquet.summary})`
  };
  const promptMsg = `[Предложение продавца]: Я предлагаю вам готовый букет с витрины (${bouquet.summary}, ${bouquet.stemsCount} шт., цветы ${freshWord}) за ${bouquet.price} ₽.`;
  showOfferDrawer = false;
  sendPlayerMessage(promptMsg, offer, onHudUpdate, showToast, renderShopMain, `Предложили букет с витрины за ${bouquet.price} ₽`);
}

export async function summonNextClient(onHudUpdate, showToast, renderShopMain) {
  if (isAiThinking) return;
  activeClient = generateRandomClient();
  pendingOffer = null;
  showOfferDrawer = false;
  showRejectPanel = false;
  lastFailedRequest = null;
  isAiThinking = true;

  const systemPrompt = buildClientSystemPrompt(activeClient);
  activeClient.history = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Ты только что вошёл в цветочный магазин. Поприветствуй продавца и скажи или намекни, что ищешь.' }
  ];

  renderShopMain();
  await requestSummonGreeting(onHudUpdate, showToast, renderShopMain);
}

export async function summonPreorderClient(preorder, onHudUpdate, showToast, renderShopMain) {
  if (isAiThinking) return;
  activeClient = generatePreorderClient(preorder);
  pendingOffer = null;
  showOfferDrawer = false;
  showRejectPanel = false;
  lastFailedRequest = null;
  isAiThinking = true;

  const systemPrompt = buildClientSystemPrompt(activeClient);
  activeClient.history = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Ты только что вошёл в цветочный магазин за своим предзаказом из Direct. Поприветствуй продавца и напомни про свой заказ ко времени.' }
  ];

  renderShopMain();
  await requestSummonGreeting(onHudUpdate, showToast, renderShopMain);
}

async function requestSummonGreeting(onHudUpdate, showToast, renderShopMain) {
  if (!activeClient) return;
  try {
    activeClient.history[0].content = buildClientSystemPrompt(activeClient);
    const raw = await callAI(activeClient.history);
    const parsed = parseClientJson(raw);
    const wantedId = detectRequestedBouquetId(parsed.reply);
    if (wantedId) {
      activeClient.wantedBouquetId = wantedId;
    }
    const cleanReply = cleanClientReplyText(parsed.reply);
    activeClient.history.push({ role: 'assistant', content: raw });
    activeClient.chatLog.push({ sender: 'client', text: cleanReply });
    lastFailedRequest = null;
  } catch (err) {
    lastFailedRequest = { type: 'summon' };
    activeClient.chatLog.push({
      sender: 'system',
      text: `⚠️ Не удалось связаться с ИИ: ${err.message}`
    });
  } finally {
    isAiThinking = false;
    renderShopMain();
  }
}

export async function retryLastAiRequest(onHudUpdate, showToast, renderShopMain) {
  if (!activeClient || isAiThinking || !lastFailedRequest) return;
  const retryData = lastFailedRequest;
  lastFailedRequest = null;

  if (activeClient.chatLog.length && activeClient.chatLog[activeClient.chatLog.length - 1].sender === 'system') {
    activeClient.chatLog.pop();
  }

  isAiThinking = true;
  renderShopMain();

  if (retryData.type === 'summon') {
    await requestSummonGreeting(onHudUpdate, showToast, renderShopMain);
    return;
  }

  if (retryData.type === 'message') {
    await executePlayerMessageCall(retryData.aiText, retryData.offerObj, retryData.displayText, onHudUpdate, showToast, renderShopMain);
  }
}

export function sendPlayerRejection(reason, onHudUpdate, showToast, renderShopMain) {
  showRejectPanel = false;
  const promptMsg = `[Отказ продавца]: ${reason}`;
  const displayMsg = `🚫 Отказали в заказе: «${reason}»`;
  sendPlayerMessage(promptMsg, null, onHudUpdate, showToast, renderShopMain, displayMsg);
}

export async function sendPlayerMessage(aiText, offerObj, onHudUpdate, showToast, renderShopMain, displayText = null) {
  if (!activeClient || isAiThinking || activeClient.status !== 'talking') return;
  if (offerObj) pendingOffer = offerObj;
  lastFailedRequest = null;

  isAiThinking = true;
  activeClient.chatLog.push({ sender: 'player', text: displayText || aiText });
  renderShopMain();

  await executePlayerMessageCall(aiText, offerObj, displayText, onHudUpdate, showToast, renderShopMain);
}

async function executePlayerMessageCall(aiText, offerObj, displayText, onHudUpdate, showToast, renderShopMain) {
  if (!activeClient) return;
  if (activeClient.history[0]?.role === 'system') {
    activeClient.history[0].content = buildClientSystemPrompt(activeClient);
  }
  activeClient.history.push({ role: 'user', content: aiText });

  try {
    const raw = await callAI(activeClient.history);
    const parsed = parseClientJson(raw);
    const wantedId = detectRequestedBouquetId(parsed.reply);
    if (wantedId) {
      activeClient.wantedBouquetId = wantedId;
    }
    const cleanReply = cleanClientReplyText(parsed.reply);

    activeClient.history.push({ role: 'assistant', content: raw });
    activeClient.chatLog.push({ sender: 'client', text: cleanReply });

    activeClient.mood = Math.max(0, Math.min(100, activeClient.mood + parsed.moodChange));

    if (
      parsed.dealStatus === 'talking' &&
      !activeClient.boostedAfterReject &&
      (cleanReply.includes('300 ₽') || cleanReply.toLowerCase().includes('накин') || cleanReply.toLowerCase().includes('увелич'))
    ) {
      activeClient.budget += 300;
      activeClient.boostedAfterReject = true;
    }

    if (parsed.dealStatus === 'bought' && pendingOffer) {
      const soldPrice = pendingOffer.price;
      const tip = completeSale(pendingOffer, onHudUpdate, showToast);
      activeClient.status = 'bought';
      activeClient.wantedBouquetId = null;
      activeClient.chatLog.push({
        sender: 'system',
        text: tip > 0
          ? `✅ Сделка состоялась! Продано за ${soldPrice} ₽ + чаевые ${tip} ₽ 🌟`
          : `✅ Сделка состоялась! Продано за ${soldPrice} ₽`
      });
    } else if (parsed.dealStatus === 'bought' && !pendingOffer) {
      activeClient.chatLog.push({
        sender: 'system',
        text: '💡 Клиент согласен! Нажми «💐 Предложить» или кнопку на витрине, чтобы провести оплату.'
      });
    } else if (parsed.dealStatus === 'left' || activeClient.mood <= 0) {
      activeClient.status = 'left';
      activeClient.wantedBouquetId = null;
      if (activeClient.preorder) {
        markPreorderCancelled(activeClient.preorder, 'Клиент ушёл без заказа');
      }
      gameState.mood = Math.max(10, gameState.mood - 3);
      saveState();
      onHudUpdate();
      activeClient.chatLog.push({
        sender: 'system',
        text: '💨 Клиент ушёл без покупки.'
      });
    }
    lastFailedRequest = null;
  } catch (err) {
    if (activeClient.history[activeClient.history.length - 1]?.role === 'user') {
      activeClient.history.pop();
    }
    lastFailedRequest = { type: 'message', aiText, offerObj, displayText };
    activeClient.chatLog.push({
      sender: 'system',
      text: `⚠️ Ошибка ИИ: ${err.message}`
    });
  } finally {
    isAiThinking = false;
    renderShopMain();
  }
}

function markPreorderCancelled(preorder, reasonNote) {
  const p = (gameState.preorders || []).find((item) => item.id === preorder.id);
  if (p) p.status = 'cancelled';
  const dm = (gameState.directMessages || []).find((m) => m.id === preorder.dmId);
  if (dm && dm.order) {
    dm.order.rejected = true;
    dm.order.accepted = false;
    if (!Array.isArray(dm.thread)) dm.thread = [];
    dm.thread.push({ sender: 'system', text: `❌ ${reasonNote}` });
  }
}

function completeSale(offer, onHudUpdate, showToast) {
  if (offer.kind === 'bouquet') {
    gameState.readyBouquets = gameState.readyBouquets.filter((b) => b.id !== offer.id);
  } else if (offer.kind === 'vase') {
    const vase = gameState.inventory.find((v) => v.uid === offer.id);
    if (vase) {
      vase.qty -= 1;
      if (vase.qty <= 0) {
        gameState.inventory = gameState.inventory.filter((v) => v.uid !== offer.id);
      }
    }
  } else if (offer.kind === 'accessory') {
    const acc = (gameState.accessoriesInventory || []).find((a) => a.id === offer.id);
    if (acc) {
      acc.qty -= 1;
      if (acc.qty <= 0) {
        gameState.accessoriesInventory = gameState.accessoriesInventory.filter((a) => a.id !== offer.id);
      }
    }
  }

  let tip = 0;
  if (activeClient?.preorder) {
    const pre = activeClient.preorder;
    const curMin = gameState.timeMinutes || 540;
    const onTime = curMin <= pre.dueMinutes + 45;

    if (onTime && activeClient.mood >= 70) {
      tip = 50 + Math.round((offer.price * 0.1) / 10) * 10;
      gameState.followers += 1;
    }

    const pObj = (gameState.preorders || []).find((item) => item.id === pre.id);
    if (pObj) pObj.status = 'done';

    const dm = (gameState.directMessages || []).find((m) => m.id === pre.dmId);
    if (dm && dm.order) {
      dm.order.done = true;
      dm.order.finalEarned = offer.price + tip;
      if (!Array.isArray(dm.thread)) dm.thread = [];
      dm.thread.push({
        sender: 'client',
        text: tip > 0
          ? `Букет просто волшебный! Спасибо, что всё успели к ${pre.dueTimeLabel} — оставила вам +${tip} ₽ чаевых 🌟`
          : `Спасибо за букет! Забрали заказ, будем заглядывать к вам ещё 🌸`
      });
    }
  }

  let postFollowerGain = 0;
  if (activeClient?.inspiredByPost) {
    postFollowerGain = 1;
    gameState.followers += 1;
  }

  const totalGain = offer.price + tip;
  gameState.money += totalGain;
  gameState.totalEarned += totalGain;
  gameState.bouquetsSold += 1;
  gameState.energy = Math.max(10, gameState.energy - 5);
  gameState.mood = Math.min(100, gameState.mood + (tip > 0 ? 5 : 3));
  pendingOffer = null;

  const justClosed = addGameMinutes(10);
  playCoinSound();
  onHudUpdate();
  if (justClosed) {
    showToast(`💰 Продано (+${totalGain} ₽)! Смена закончилась — пора отдыхать.`);
  } else if (tip > 0) {
    showToast(`💰 Предзаказ выдан! +${offer.price} ₽ и +${tip} ₽ чаевых 🌟`);
  } else if (postFollowerGain > 0) {
    showToast(`📸 Букет по посту продан! +${offer.price} ₽ и +1 подписчик 🌸`);
  } else {
    showToast(`💰 Продано! +${offer.price} ₽ в кассу`);
  }
  return tip;
}

export function toggleOfferDrawer() {
  showOfferDrawer = !showOfferDrawer;
  if (showOfferDrawer) showRejectPanel = false;
}

export function toggleRejectPanel() {
  showRejectPanel = !showRejectPanel;
  if (showRejectPanel) showOfferDrawer = false;
}

export function closeRejectPanel() {
  showRejectPanel = false;
}

export function getShowOfferDrawer() {
  return showOfferDrawer;
}

export function getShowRejectPanel() {
  return showRejectPanel;
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
```

## File: js/screens/shop/shopInspector.js
```javascript
/**
 * js/screens/shop/shopInspector.js
 * Модальное окно осмотра вазы: смена воды, уценка, списание и добавление в букет
 */

import { FLOWERS_CATALOG } from '/js/config.js';
import { getSingleFlowerWrappedSvg } from '/js/graphics/flowersSvg.js';

export function getActualFlowerPrice(item, meta) {
  return item.discounted ? Math.round(meta.price * 0.6) : meta.price;
}

export function renderInspectorModal(item) {
  const meta = FLOWERS_CATALOG[item.typeId];
  if (!meta) return '';

  const price = getActualFlowerPrice(item, meta);
  const statusText =
    item.freshness >= 70
      ? 'Свежие и ароматные'
      : item.freshness >= 40
      ? 'Начинают подвядать'
      : 'Пора уценить или списать!';

  return `
    <div class="vase-modal-overlay" id="vase-modal-overlay">
      <div class="flower-inspector vase-modal-card">
        <div class="row-between">
          <strong style="font-size: 15px;">Осмотр цветка</strong>
          <button class="btn btn-soft" id="btn-close-inspector" style="padding: 5px 10px; font-size: 12px;">
            ✕ Закрыть
          </button>
        </div>

        <div class="inspector-top">
          <div class="inspector-preview">
            ${getSingleFlowerWrappedSvg(item.typeId)}
          </div>
          <div style="flex: 1;">
            <div class="row-between">
              <strong>${meta.name}</strong>
              <span class="badge ${item.freshness >= 40 ? 'badge-ok' : 'badge-warn'}">${item.freshness}%</span>
            </div>
            <p class="muted-text" style="margin-top: 2px;">${statusText} • В наличии: ${item.qty} шт.</p>
            <p class="muted-text">Цена за стебель: <strong>${price} ₽</strong></p>
          </div>
        </div>

        <div class="inspector-actions">
          <button class="btn btn-primary" id="btn-add-to-bouquet" style="grid-column: 1 / -1;">
            💐 Взять стебель на стол сборки
          </button>
          <button class="btn btn-sage" id="btn-water-flower" ${item.wateredThisShift ? 'disabled style="opacity:0.55;"' : ''}>
            💧 Сменить воду (+8%)
          </button>
          <button class="btn btn-soft" id="btn-discount-flower" ${item.discounted || item.freshness >= 65 ? 'disabled style="opacity:0.55;"' : ''}>
            🏷️ Уценить (-40%)
          </button>
          <button class="btn btn-danger" id="btn-discard-flower" style="grid-column: 1 / -1;">
            🗑️ Списать партию (${item.qty} шт.)
          </button>
        </div>
      </div>
    </div>
  `;
}
```

## File: js/screens/bouquetMaker.js
```javascript
import { FLOWERS_CATALOG, WRAPPINGS, RIBBONS } from '../config.js';
import { gameState, saveState, addGameMinutes } from '../state.js';
import { getFlowerSvgDataUrl, getSingleFlowerWrappedSvg } from '../graphics/flowersSvg.js';
import { playPaperSound, playShutterSound } from '../sound.js';

const imageCache = {};
let activeTool = 'move'; // 'move' | 'scissors'
let selectedStemId = null;
let draggingStem = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

let savedScreenScrollTop = 0;
let savedTrayScrollLeft = 0;
let savedWrapScrollLeft = 0;
let savedRibbonScrollLeft = 0;

function getCachedFlowerImage(typeId, onLoadCallback) {
  if (imageCache[typeId]) return imageCache[typeId];
  const img = new Image();
  img.onload = () => {
    if (onLoadCallback) onLoadCallback();
  };
  img.src = getFlowerSvgDataUrl(typeId);
  imageCache[typeId] = img;
  return img;
}

function captureScrollPositions() {
  const screen = document.getElementById('screen-shop');
  const tray = document.querySelector('.flower-tray');
  const wrapRows = document.querySelectorAll('.wrap-options-row');
  if (screen) savedScreenScrollTop = screen.scrollTop;
  if (tray) savedTrayScrollLeft = tray.scrollLeft;
  if (wrapRows[0]) savedWrapScrollLeft = wrapRows[0].scrollLeft;
  if (wrapRows[1]) savedRibbonScrollLeft = wrapRows[1].scrollLeft;
}

function restoreScrollPositions() {
  const screen = document.getElementById('screen-shop');
  const tray = document.querySelector('.flower-tray');
  const wrapRows = document.querySelectorAll('.wrap-options-row');
  if (screen) screen.scrollTop = savedScreenScrollTop;
  if (tray) tray.scrollLeft = savedTrayScrollLeft;
  if (wrapRows[0]) wrapRows[0].scrollLeft = savedWrapScrollLeft;
  if (wrapRows[1]) wrapRows[1].scrollLeft = savedRibbonScrollLeft;
}

/** Добавить цветок из вазы в черновик букета */
export function addFlowerToDraftBouquet(vaseUid, showToast, count = 1, silent = false) {
  const vase = gameState.inventory.find((i) => i.uid === vaseUid);
  if (!vase || vase.qty <= 0) {
    if (!silent) showToast('В этой вазе закончились цветы');
    return false;
  }

  const addQty = Math.min(count, vase.qty);
  vase.qty -= addQty;
  if (vase.qty <= 0) {
    gameState.inventory = gameState.inventory.filter((i) => i.uid !== vaseUid);
  }

  const draft = gameState.currentBouquet;
  const meta = FLOWERS_CATALOG[vase.typeId];
  const unitPrice = vase.discounted ? Math.round(meta.price * 0.6) : meta.price;

  for (let i = 0; i < addQty; i++) {
    const index = draft.stems.length;
    const col = index % 7;
    const row = Math.floor(index / 7);
    const spreadAngle = (col - 3) * 0.13;
    const newStem = {
      id: 'stem_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      typeId: vase.typeId,
      price: unitPrice,
      freshness: vase.freshness,
      discounted: vase.discounted,
      x: 280 + (col - 3) * 24 + (row % 2 === 1 ? 10 : 0),
      y: 235 + (row % 3) * 18,
      angle: spreadAngle,
      trimmed: false
    };
    draft.stems.push(newStem);
    selectedStemId = newStem.id;
  }

  playPaperSound();
  saveState();
  if (!silent) {
    showToast(addQty > 1 ? `+ ${meta.shortName} (${addQty} шт.) добавлены` : `+ ${meta.shortName} добавлен в букет`);
  }
  return true;
}

export function renderBouquetMaker(container, onHudUpdate, showToast, onRefreshParent) {
  const draft = gameState.currentBouquet;
  const totalPrice = calculateBouquetPrice(draft);

  const trayHtml = gameState.inventory.length
    ? gameState.inventory
        .map((item) => {
          const meta = FLOWERS_CATALOG[item.typeId];
          if (!meta) return '';
          const unitPrice = item.discounted ? Math.round(meta.price * 0.6) : meta.price;
          const freshClass = item.freshness >= 65 ? 'fresh-high' : item.freshness >= 35 ? 'fresh-mid' : 'fresh-low';
          return `
            <button class="tray-chip" data-add-vase="${item.uid}">
              ${item.discounted ? '<span class="tray-discount-badge">-40%</span>' : ''}
              <div class="tray-chip-svg">${getSingleFlowerWrappedSvg(item.typeId)}</div>
              <span class="tray-chip-name">${meta.shortName}</span>
              <span class="tray-chip-qty">${item.qty} шт • ${unitPrice}₽</span>
              <div class="freshness-bar-bg" style="height:4px;">
                <div class="freshness-bar-fill ${freshClass}" style="width:${item.freshness}%"></div>
              </div>
              <span class="tray-chip-fresh">${item.freshness}%</span>
            </button>
          `;
        })
        .join('')
    : `<p class="muted-text">Вазы пусты</p>`;

  const wrapsHtml = WRAPPINGS.map(
    (w) => `
      <button class="wrap-pill ${draft.wrappingId === w.id ? 'active' : ''}" data-wrap-id="${w.id}">
        <span class="color-dot" style="background:${w.type === 'none' ? '#fff' : w.type === 'clear' ? 'linear-gradient(135deg,#eef6fa,#fff)' : w.color};"></span>
        ${w.name} ${w.price > 0 ? `(+${w.price}₽)` : ''}
      </button>
    `
  ).join('');

  const ribbonsHtml = RIBBONS.map(
    (r) => `
      <button class="wrap-pill ${draft.ribbonId === r.id ? 'active' : ''}" data-ribbon-id="${r.id}">
        <span class="color-dot" style="background:${r.color === 'transparent' ? '#fff' : r.color};"></span>
        ${r.name} ${r.price > 0 ? `(+${r.price}₽)` : ''}
      </button>
    `
  ).join('');

  const selectedIndex = draft.stems.findIndex((s) => s.id === selectedStemId);
  const canMoveUp = selectedIndex !== -1 && selectedIndex < draft.stems.length - 1;
  const canMoveDown = selectedIndex > 0;

  const readyHtml =
    gameState.readyBouquets.length > 0
      ? `
      <div class="card">
        <div class="card-title">🎀 Готовые букеты на витрине (${gameState.readyBouquets.length})</div>
        <div class="ready-bouquets-list">
          ${gameState.readyBouquets
            .map(
              (b) => `
            <div class="ready-bouquet-card" style="width: 126px;">
              <img class="ready-bouquet-img" src="${b.thumbnail}" alt="Букет" />
              <strong style="font-size:12px;">${b.price} ₽</strong>
              <span class="muted-text" style="font-size:10.5px;">${b.stemsCount} стеб.</span>
              <div style="display:flex; gap:4px; width:100%; margin-top:2px;">
                <button class="btn btn-soft" data-edit-bouquet="${b.id}" style="flex:1; padding:4px; font-size:10.5px;">✏️ Изм.</button>
                <button class="btn btn-danger" data-del-bouquet="${b.id}" style="padding:4px 6px; font-size:10.5px;" title="Разобрать в вазы">🗑️</button>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>`
      : '';

  container.innerHTML = `
    <div class="bouquet-board-card">
      <div class="bouquet-canvas-wrap">
        <canvas id="bouquet-canvas" width="560" height="540"></canvas>
        <div class="canvas-price-pill">💐 На столе (${draft.stems.length} шт.): ${totalPrice} ₽</div>
        <div class="canvas-hint-pill">
          ${activeTool === 'move' ? '✋ Тяни цветок • выбирай слой (время на паузе)' : '✂️ Нажми на цветок, чтобы подрезать'}
        </div>
      </div>

      <div class="maker-toolbar">
        <button class="tool-btn ${activeTool === 'move' ? 'active' : ''}" id="tool-move">
          <span>✋</span><span>Двигать</span>
        </button>
        <button class="tool-btn ${activeTool === 'scissors' ? 'active' : ''}" id="tool-scissors">
          <span>✂️</span><span>Секатор</span>
        </button>
        <button class="tool-btn" id="tool-rot-left" ${!selectedStemId ? 'disabled' : ''}>
          <span>⟲</span><span>Наклон</span>
        </button>
        <button class="tool-btn" id="tool-rot-right" ${!selectedStemId ? 'disabled' : ''}>
          <span>⟳</span><span>Наклон</span>
        </button>
      </div>

      <div class="maker-toolbar">
        <button class="tool-btn" id="tool-layer-up" ${!canMoveUp ? 'disabled' : ''}>
          <span>⬆️</span><span>Поверх</span>
        </button>
        <button class="tool-btn" id="tool-layer-down" ${!canMoveDown ? 'disabled' : ''}>
          <span>⬇️</span><span>Глубже</span>
        </button>
        <button class="tool-btn" id="btn-remove-stem" ${!selectedStemId ? 'disabled' : ''}>
          <span>↩️</span><span>Убрать</span>
        </button>
        <button class="tool-btn" id="btn-clear-table" ${draft.stems.length === 0 ? 'disabled' : ''}>
          <span>🧹</span><span>Очистить</span>
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🌷 Добавить цветы (свайпай полку)</div>
      <div class="flower-tray">${trayHtml}</div>
    </div>

    <div class="card">
      <div class="card-title">🎁 Упаковка и лента</div>
      <div class="wrap-options-row">${wrapsHtml}</div>
      <div class="wrap-options-row">${ribbonsHtml}</div>
    </div>

    <div class="row-between" style="gap: 8px;">
      <button class="btn btn-sage" id="btn-photo-bouquet" style="flex: 1;" ${draft.stems.length === 0 ? 'disabled' : ''}>
        📸 Сфотать
      </button>
      <button class="btn btn-primary" id="btn-save-bouquet" style="flex: 1.4;" ${draft.stems.length === 0 ? 'disabled' : ''}>
        ✅ Готов к продаже
      </button>
    </div>

    ${readyHtml}
  `;

  setupCanvasAndEvents(container, onHudUpdate, showToast, onRefreshParent);
  restoreScrollPositions();
}

function calculateBouquetPrice(draft) {
  const wrap = WRAPPINGS.find((w) => w.id === draft.wrappingId) || WRAPPINGS[0];
  const ribbon = RIBBONS.find((r) => r.id === draft.ribbonId) || RIBBONS[0];

  let flowersSum = 0;
  let trimmedBonus = 0;
  draft.stems.forEach((s) => {
    flowersSum += s.price;
    if (s.trimmed) trimmedBonus += 15;
  });

  if (draft.stems.length === 0) return 0;
  const craftBonus = draft.stems.length >= 3 ? 50 : 0;
  return flowersSum + wrap.price + ribbon.price + trimmedBonus + craftBonus;
}

function setupCanvasAndEvents(container, onHudUpdate, showToast, onRefreshParent) {
  const canvas = document.getElementById('bouquet-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const draft = gameState.currentBouquet;

  const refreshKeepingScroll = () => {
    captureScrollPositions();
    onRefreshParent();
  };

  draft.stems.forEach((s) => getCachedFlowerImage(s.typeId, () => drawBouquetCanvas(ctx, canvas)));
  drawBouquetCanvas(ctx, canvas);

  const getCanvasPoint = (e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  canvas.addEventListener('pointerdown', (e) => {
    const pt = getCanvasPoint(e);
    const hit = [...draft.stems]
      .reverse()
      .find((s) => Math.hypot(pt.x - s.x, pt.y - (s.y - 30)) < 68);

    if (!hit) {
      selectedStemId = null;
      drawBouquetCanvas(ctx, canvas);
      return;
    }

    selectedStemId = hit.id;

    if (activeTool === 'scissors') {
      if (!hit.trimmed) {
        hit.trimmed = true;
        playPaperSound();
        saveState();
        showToast('✂️ Стебель подрезан! (+15 ₽ к ценности)');
        refreshKeepingScroll();
      } else {
        showToast('Этот стебель уже аккуратно подрезан');
      }
      return;
    }

    draggingStem = hit;
    dragOffsetX = pt.x - hit.x;
    dragOffsetY = pt.y - hit.y;
    canvas.setPointerCapture(e.pointerId);
    drawBouquetCanvas(ctx, canvas);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!draggingStem) return;
    const pt = getCanvasPoint(e);
    draggingStem.x = Math.max(85, Math.min(475, pt.x - dragOffsetX));
    draggingStem.y = Math.max(115, Math.min(400, pt.y - dragOffsetY));
    drawBouquetCanvas(ctx, canvas);
  });

  canvas.addEventListener('pointerup', () => {
    if (draggingStem) {
      draggingStem = null;
      saveState();
      refreshKeepingScroll();
    }
  });

  document.getElementById('tool-move')?.addEventListener('click', () => {
    activeTool = 'move';
    refreshKeepingScroll();
  });

  document.getElementById('tool-scissors')?.addEventListener('click', () => {
    activeTool = 'scissors';
    refreshKeepingScroll();
  });

  document.getElementById('tool-rot-left')?.addEventListener('click', () => {
    const stem = draft.stems.find((s) => s.id === selectedStemId);
    if (!stem) return;
    stem.angle = Math.max(-0.85, stem.angle - 0.14);
    saveState();
    drawBouquetCanvas(ctx, canvas);
  });

  document.getElementById('tool-rot-right')?.addEventListener('click', () => {
    const stem = draft.stems.find((s) => s.id === selectedStemId);
    if (!stem) return;
    stem.angle = Math.min(0.85, stem.angle + 0.14);
    saveState();
    drawBouquetCanvas(ctx, canvas);
  });

  document.getElementById('tool-layer-up')?.addEventListener('click', () => {
    const idx = draft.stems.findIndex((s) => s.id === selectedStemId);
    if (idx === -1 || idx >= draft.stems.length - 1) return;
    const [stem] = draft.stems.splice(idx, 1);
    draft.stems.splice(idx + 1, 0, stem);
    saveState();
    refreshKeepingScroll();
  });

  document.getElementById('tool-layer-down')?.addEventListener('click', () => {
    const idx = draft.stems.findIndex((s) => s.id === selectedStemId);
    if (idx <= 0) return;
    const [stem] = draft.stems.splice(idx, 1);
    draft.stems.splice(idx - 1, 0, stem);
    saveState();
    refreshKeepingScroll();
  });

  document.getElementById('btn-remove-stem')?.addEventListener('click', () => {
    const stem = draft.stems.find((s) => s.id === selectedStemId);
    if (!stem) return;
    returnStemToInventory(stem);
    draft.stems = draft.stems.filter((s) => s.id !== stem.id);
    selectedStemId = null;
    saveState();
    showToast('Стебель возвращён в вазу');
    refreshKeepingScroll();
  });

  document.getElementById('btn-clear-table')?.addEventListener('click', () => {
    draft.stems.forEach((s) => returnStemToInventory(s));
    draft.stems = [];
    selectedStemId = null;
    saveState();
    showToast('Все цветы возвращены в вазы');
    refreshKeepingScroll();
  });

  container.querySelectorAll('[data-add-vase]').forEach((btn) => {
    btn.addEventListener('click', () => {
      captureScrollPositions();
      if (addFlowerToDraftBouquet(btn.dataset.addVase, showToast)) {
        onRefreshParent();
      }
    });
  });

  container.querySelectorAll('[data-wrap-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      draft.wrappingId = btn.dataset.wrapId;
      playPaperSound();
      saveState();
      refreshKeepingScroll();
    });
  });

  container.querySelectorAll('[data-ribbon-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      draft.ribbonId = btn.dataset.ribbonId;
      playPaperSound();
      saveState();
      refreshKeepingScroll();
    });
  });

  container.querySelectorAll('[data-edit-bouquet]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bId = btn.dataset.editBouquet;
      const ready = gameState.readyBouquets.find((b) => b.id === bId);
      if (!ready) return;

      if (draft.stems.length > 0) {
        draft.stems.forEach((s) => returnStemToInventory(s));
      }

      if (Array.isArray(ready.stems) && ready.stems.length > 0) {
        draft.stems = ready.stems.map((s) => ({ ...s }));
      } else {
        draft.stems = (ready.items || []).map((typeId, index) => {
          const meta = FLOWERS_CATALOG[typeId];
          return {
            id: 'stem_' + Date.now() + '_' + index,
            typeId,
            price: meta ? meta.price : 200,
            freshness: 85,
            discounted: false,
            x: 280 + ((index % 7) - 3) * 24,
            y: 240 + Math.floor(index / 7) * 18,
            angle: ((index % 7) - 3) * 0.13,
            trimmed: false
          };
        });
      }

      draft.wrappingId = ready.wrappingId || 'craft';
      draft.ribbonId = ready.ribbonId || 'satin_rose';
      gameState.readyBouquets = gameState.readyBouquets.filter((b) => b.id !== bId);
      selectedStemId = draft.stems[0]?.id || null;
      playPaperSound();
      saveState();
      showToast('✏️ Букет возвращён на стол для редактирования');
      refreshKeepingScroll();
    });
  });

  container.querySelectorAll('[data-del-bouquet]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bId = btn.dataset.delBouquet;
      const ready = gameState.readyBouquets.find((b) => b.id === bId);
      if (!ready) return;

      if (Array.isArray(ready.stems) && ready.stems.length > 0) {
        ready.stems.forEach((s) => returnStemToInventory(s));
      } else {
        (ready.items || []).forEach((typeId) => returnStemToInventory({ typeId, freshness: 85, discounted: false }));
      }

      gameState.readyBouquets = gameState.readyBouquets.filter((b) => b.id !== bId);
      saveState();
      showToast('Букет разобран, цветы снова в вазах');
      refreshKeepingScroll();
    });
  });

  document.getElementById('btn-photo-bouquet')?.addEventListener('click', () => {
    const prevSelected = selectedStemId;
    selectedStemId = null;
    drawBouquetCanvas(ctx, canvas, true);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    selectedStemId = prevSelected;
    drawBouquetCanvas(ctx, canvas, false);

    playShutterSound();
    gameState.savedPhotos.unshift({
      id: 'photo_' + Date.now(),
      dataUrl,
      type: 'bouquet',
      price: calculateBouquetPrice(draft),
      stemsCount: draft.stems.length,
      items: draft.stems.map((s) => s.typeId),
      description: describeBouquet(draft),
      day: gameState.day
    });
    if (gameState.savedPhotos.length > 10) {
      gameState.savedPhotos = gameState.savedPhotos.slice(0, 10);
    }
    saveState();
    showPolaroidModal(dataUrl, calculateBouquetPrice(draft));
  });

  document.getElementById('btn-save-bouquet')?.addEventListener('click', () => {
    const prevSelected = selectedStemId;
    selectedStemId = null;
    drawBouquetCanvas(ctx, canvas, true);
    const thumbnail = canvas.toDataURL('image/jpeg', 0.78);
    selectedStemId = prevSelected;

    const ready = {
      id: 'bouquet_' + Date.now(),
      price: calculateBouquetPrice(draft),
      stemsCount: draft.stems.length,
      summary: describeBouquet(draft),
      thumbnail,
      items: draft.stems.map((s) => s.typeId),
      stems: draft.stems.map((s) => ({ ...s })),
      wrappingId: draft.wrappingId,
      ribbonId: draft.ribbonId
    };

    gameState.readyBouquets.unshift(ready);
    draft.stems = [];
    selectedStemId = null;
    playPaperSound();
    const justClosed = addGameMinutes(20);
    onHudUpdate();
    if (justClosed) {
      showToast('🌙 Смена закончилась! Пора пойти домой поспать — иначе завтра будешь уставшим.');
    } else {
      showToast(`💐 Букет за ${ready.price} ₽ готов (+20 мин)!`);
    }
    refreshKeepingScroll();
  });
}

function drawBouquetCanvas(ctx, canvas, isPhotoMode = false) {
  const w = canvas.width;
  const h = canvas.height;
  const draft = gameState.currentBouquet;

  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#F7EFE5');
  bgGrad.addColorStop(1, '#EADBC9');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.fillStyle = '#FFFDF9';
  ctx.shadowColor = 'rgba(90, 68, 56, 0.08)';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2 - 10, 210, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = '#E5D8CA';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(w / 2, h / 2 - 10, 198, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  const wrap = WRAPPINGS.find((wp) => wp.id === draft.wrappingId) || WRAPPINGS[0];
  const ribbon = RIBBONS.find((rb) => rb.id === draft.ribbonId) || RIBBONS[0];

  if (wrap.type !== 'none') {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(145, 225);
    ctx.lineTo(280, 165);
    ctx.lineTo(415, 225);
    ctx.lineTo(318, 465);
    ctx.lineTo(242, 465);
    ctx.closePath();

    ctx.fillStyle = wrap.color;
    ctx.fill();
    ctx.strokeStyle = wrap.accent;
    ctx.lineWidth = 3;
    ctx.stroke();

    if (wrap.type === 'newspaper') {
      ctx.clip();
      ctx.strokeStyle = 'rgba(110, 96, 84, 0.25)';
      ctx.lineWidth = 2;
      for (let y = 185; y < 440; y += 16) {
        ctx.beginPath();
        ctx.moveTo(160, y);
        ctx.lineTo(400, y - 8);
        ctx.stroke();
      }
    } else if (wrap.type === 'mesh') {
      ctx.clip();
      ctx.strokeStyle = 'rgba(223, 171, 78, 0.4)';
      ctx.lineWidth = 1.5;
      for (let i = -150; i < 550; i += 22) {
        ctx.beginPath();
        ctx.moveTo(i, 160);
        ctx.lineTo(i + 180, 470);
        ctx.moveTo(i + 180, 160);
        ctx.lineTo(i, 470);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  draft.stems.forEach((stem) => {
    const img = getCachedFlowerImage(stem.typeId);
    if (!img || !img.complete) return;

    ctx.save();
    ctx.translate(stem.x, stem.y);
    ctx.rotate(stem.angle);

    const drawW = 148;
    const drawH = stem.trimmed ? 175 : 205;

    ctx.drawImage(img, -drawW / 2, -drawH + 55, drawW, drawH);

    if (!isPhotoMode && stem.id === selectedStemId) {
      ctx.strokeStyle = '#D98A7C';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.arc(0, -45, 58, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  });

  if (wrap.type !== 'none') {
    ctx.save();
    if (wrap.type === 'clear') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.strokeStyle = 'rgba(195, 222, 236, 0.9)';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(165, 275);
      ctx.lineTo(280, 355);
      ctx.lineTo(315, 465);
      ctx.lineTo(245, 465);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(395, 275);
      ctx.lineTo(280, 355);
      ctx.lineTo(245, 465);
      ctx.lineTo(315, 465);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(205, 315);
      ctx.lineTo(245, 370);
      ctx.moveTo(360, 310);
      ctx.lineTo(315, 385);
      ctx.stroke();
    } else {
      ctx.fillStyle = wrap.accent;
      ctx.globalAlpha = wrap.type === 'mesh' ? 0.65 : 0.9;
      ctx.beginPath();
      ctx.moveTo(165, 275);
      ctx.lineTo(280, 355);
      ctx.lineTo(312, 465);
      ctx.lineTo(245, 465);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = wrap.color;
      ctx.beginPath();
      ctx.moveTo(395, 275);
      ctx.lineTo(280, 355);
      ctx.lineTo(245, 465);
      ctx.lineTo(315, 465);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  if (ribbon.id !== 'none' && draft.stems.length > 0) {
    ctx.save();
    ctx.fillStyle = ribbon.color;
    ctx.beginPath();
    ctx.roundRect(242, 350, 76, 16, 6);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(264, 358, 20, 11, -0.3, 0, Math.PI * 2);
    ctx.ellipse(296, 358, 20, 11, 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = ribbon.color;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(276, 362);
    ctx.lineTo(256, 398);
    ctx.moveTo(284, 362);
    ctx.lineTo(304, 398);
    ctx.stroke();

    ctx.fillStyle = '#FFFDF9';
    ctx.beginPath();
    ctx.arc(280, 358, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (isPhotoMode) {
    ctx.save();
    ctx.fillStyle = 'rgba(74, 62, 57, 0.5)';
    ctx.font = 'bold 18px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${gameState.shopName || 'Fleur Atelier'} 🌸`, w - 20, h - 18);
    ctx.restore();
  }
}

function returnStemToInventory(stem) {
  const existing = gameState.inventory.find(
    (i) => i.typeId === stem.typeId && i.discounted === !!stem.discounted
  );
  if (existing) {
    existing.qty += 1;
  } else {
    const meta = FLOWERS_CATALOG[stem.typeId];
    if (!meta) return;
    gameState.inventory.push({
      uid: 'vase_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      typeId: stem.typeId,
      qty: 1,
      freshness: stem.freshness || 80,
      discounted: !!stem.discounted,
      wateredThisShift: false
    });
  }
}

function describeBouquet(draft) {
  const counts = {};
  draft.stems.forEach((s) => {
    const name = FLOWERS_CATALOG[s.typeId]?.shortName || 'Цветок';
    counts[name] = (counts[name] || 0) + 1;
  });
  const list = Object.entries(counts)
    .map(([name, qty]) => `${name} (${qty})`)
    .join(', ');
  const wrap = WRAPPINGS.find((w) => w.id === draft.wrappingId)?.name || '';
  return `${list}${wrap && wrap !== 'Без упаковки' ? ` • ${wrap}` : ''}`;
}

function showPolaroidModal(dataUrl, price) {
  const modal = document.createElement('div');
  modal.className = 'polaroid-overlay';
  modal.innerHTML = `
    <div class="polaroid-card">
      <img src="${dataUrl}" alt="Снимок букета" />
      <strong style="font-family: var(--font-title); font-size: 17px;">Снимок готов! 📸</strong>
      <p class="muted-text">Букет оценён в <strong>${price} ₽</strong>. Фото сохранено в память телефона для InstaFlower!</p>
      <button class="btn btn-primary" id="btn-close-polaroid">Отлично</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#btn-close-polaroid').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}
```

## File: js/screens/financeSettingsScreen.js
```javascript
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
```

## File: js/screens/homeScreen.js
```javascript
import {
  FLOWERS_CATALOG,
  DECOR_CATALOG,
  HOME_LOCATIONS,
  getGameDateObj,
  getSeasonInfo,
  getWeatherForSeason,
  getHolidayForDate
} from '../config.js';
import { gameState, saveState } from '../state.js';
import { playPurrSound, playClickSound } from '../sound.js';

let catPosPercent = 48;
let catDir = 1;
let catThought = 'Отдыхает в комнате 🐾';
let ballPosPercent = 66;
let ballRotationDeg = 0;
let catWalkTimer = null;
let catStartMoveTimer = null;
let catArriveTimer = null;
let catPurrTimer = null;
let isCatPurring = false;
let isCatChasingBall = false;
let showHomeDecorModal = false;

function isHomeDecorShown(id) {
  const owned = new Set([...(gameState.decor || []), ...(gameState.decorInventory || [])]);
  return owned.has(id) && !(gameState.hiddenDecor || []).includes(id);
}

function clearCatTimers() {
  if (catWalkTimer) {
    clearTimeout(catWalkTimer);
    catWalkTimer = null;
  }
  if (catStartMoveTimer) {
    clearTimeout(catStartMoveTimer);
    catStartMoveTimer = null;
  }
  if (catArriveTimer) {
    clearTimeout(catArriveTimer);
    catArriveTimer = null;
  }
  if (catPurrTimer) {
    clearTimeout(catPurrTimer);
    catPurrTimer = null;
  }
}

export function renderHomeScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-home');
  if (!container) return;

  clearCatTimers();
  isCatPurring = false;
  isCatChasingBall = false;

  const isDay = gameState.timeIndex < 2;
  const currentHome = HOME_LOCATIONS.find((h) => h.id === gameState.homeLocationId) || HOME_LOCATIONS[0];
  const hasLamp = isHomeDecorShown('cozy_lamp');
  const hasBooks = isHomeDecorShown('bookshelf');
  const hasBed = isHomeDecorShown('cat_bed');
  const hasBall = isHomeDecorShown('cat_ball');
  const hasSofa = isHomeDecorShown('home_sofa');
  const hasRug = isHomeDecorShown('home_rug');
  const hasPlant = isHomeDecorShown('home_plant');
  const hasCurtains = isHomeDecorShown('home_curtains');
  const hasTree = isHomeDecorShown('xmas_tree_home');
  const hasFairy = isHomeDecorShown('fairy_lights_home');
  const hasPumpkins = isHomeDecorShown('pumpkins_home');
  const hasHearts = isHomeDecorShown('heart_pillow_home');

  const hasDesignerLamp = isHomeDecorShown('designer_lamp');
  const hasCatTower = isHomeDecorShown('cat_tower');
  const hasDresser = isHomeDecorShown('antique_dresser');
  const hasVinyl = isHomeDecorShown('botanical_vinyl');

  const petName = gameState.petName || 'Пискля';
  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const season = getSeasonInfo(curDate);

  const ownedSet = new Set([...(gameState.decor || []), ...(gameState.decorInventory || [])]);
  const ownedHomeDecorCount = DECOR_CATALOG.filter(
    (d) => d.place === 'Квартира' && ownedSet.has(d.id)
  ).length;

  const balconyHtml = currentHome.id === 'home_balcony'
    ? renderBalconyDoorHtml(isDay, season.id)
    : '';

  const fireplaceHtml = currentHome.id === 'home_loft'
    ? renderLoftFireplaceHtml()
    : '';

  container.innerHTML = `
    <div class="screen-header">
      <div>
        <h1 class="screen-title">${escapeHtml(currentHome.name)}</h1>
      </div>
      <div style="display:flex; gap:5px; align-items:center;">
        <button class="btn btn-soft" id="btn-open-home-decor" style="padding:5px 9px; font-size:11.5px;">
          🎨 Декор (${ownedHomeDecorCount})
        </button>
        <span class="badge badge-ok">⚡ ${gameState.energy}%</span>
      </div>
    </div>

    ${gameState.rentWarning ? `
      <div class="card" style="background:#FCE8E8; border-color:#E5A1A1; padding:10px;">
        <strong style="color:var(--danger); font-size:13px;">⚠️ Письмо от арендодателя</strong>
        <p class="muted-text" style="color:#6E3838;">Баланс ушёл в минус после оплаты аренды! Постарайся заработать и выйти в плюс.</p>
      </div>
    ` : ''}

    <div class="home-room-scene loc-${currentHome.id}">
      ${renderHomeBackdropDetails(currentHome.id)}

      ${hasFairy ? `
        <div class="home-fairy-lights">
          ${Array.from({ length: 10 }, () => `
            <div class="fairy-strand">
              <span class="fairy-wire"></span>
              <span class="fairy-dot"></span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="home-top-wall">
        <div class="home-window-wrap">
          ${hasCurtains ? '<div class="home-curtain left"></div><div class="home-curtain right"></div>' : ''}
          <div class="home-window ${isDay ? 'day' : ''}">
            ${renderHomeWindowScenery(currentHome.id, isDay, season.id)}
            <div class="window-pane-v"></div>
            <div class="window-pane-h"></div>
          </div>
        </div>

        <div class="home-wall-center">
          ${hasHearts ? '<div class="home-hearts-wall">💖 💕 💖</div>' : ''}
          ${!hasBooks && currentHome.id === 'home_studio' ? renderStudioArtHtml() : ''}
          ${hasBooks ? getBookshelfSvg() : ''}
          <div style="display:flex; gap:6px; align-items:flex-end; justify-content:center; flex-wrap:wrap;">
            ${hasDresser ? getAntiqueDresserSvg() : ''}
            ${hasVinyl ? getBotanicalVinylSvg() : ''}
            ${hasDesignerLamp ? getDesignerLampSvg() : ''}
          </div>
        </div>

        ${fireplaceHtml}
        ${balconyHtml}
        ${hasLamp ? getFloorLampSvg() : ''}
      </div>

      <div class="home-walk-stage" id="home-walk-stage">
        ${hasSofa ? getSofaSvg() : ''}
        ${hasRug ? '<div class="home-rug"></div>' : ''}
        ${hasBed ? getCatBedFloorSvg() : ''}
        ${hasPlant ? getFicusPlantSvg() : ''}
        ${hasCatTower ? getCatTowerSvg() : ''}
        ${hasPumpkins ? getHomePumpkinsSvg() : ''}
        ${hasTree ? getHomeXmasTreeSvg() : ''}
        ${hasBall ? `
          <button
            type="button"
            class="home-cat-ball-floor"
            id="cat-toy-ball"
            style="left: ${ballPosPercent}%; transform: translateX(-50%) rotate(${ballRotationDeg}deg);"
            title="Бросить мячик для ${escapeHtml(petName)}"
          >
            ${getCatBallSvg()}
          </button>
        ` : ''}

        <button
          type="button"
          class="cat-walker"
          id="pisklya-walker"
          style="left: ${catPosPercent}%;"
          title="Погладить ${escapeHtml(petName)}"
        >
          <span class="cat-thought-bubble" id="cat-thought-bubble">${escapeHtml(catThought)}</span>
          <span class="cat-hearts-layer" id="cat-hearts-layer"></span>
          <div class="cat-sprite-flip" id="cat-sprite-flip" style="transform: scaleX(${catDir});">
            <div class="cat-body-bob">
              ${getPisklyaCatSvg(gameState.petMood)}
            </div>
          </div>
        </button>
      </div>

      <div class="pet-spot">
        <div class="row-between">
          <strong style="font-size:14px;">🐱 Кошка ${escapeHtml(petName)}</strong>
          <span class="badge badge-ok" id="pet-mood-badge">${gameState.petMood}%</span>
        </div>
        <p class="muted-text" style="font-size:11.5px;">
          Нажми на гуляющую кошку, чтобы погладить её${hasBall ? ', или катни мячик для игры!' : ', или покорми вкусняшкой!'}
        </p>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-primary" id="btn-pet-cat" style="flex:1; padding:6px 8px; font-size:12px;">
            🖐️ Погладить
          </button>
          ${hasBall ? `
            <button class="btn btn-sage" id="btn-play-ball" style="flex:1; padding:6px 8px; font-size:12px;">
              🎾 Мячик
            </button>
          ` : ''}
          <button class="btn btn-soft" id="btn-feed-cat" style="flex:1; padding:6px 8px; font-size:12px;" ${gameState.petFedToday ? 'disabled style="opacity:0.55;"' : ''}>
            ${gameState.petFedToday ? '🐟 Сыта' : '🐟 Покормить'}
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🌙 Завершить рабочий день</div>
      <p class="muted-text">
        Сон восстановит силы и переведёт время на следующее утро. До оплаты аренды (${gameState.weeklyRent} ₽): <strong>${gameState.daysUntilRent} дн.</strong>
      </p>
      <p class="muted-text" style="font-size:11.5px;">
        💡 Новые квартиры можно купить в «📱 Телефон» → «🏢 Риелтор», а редкий декор — в «🛋️ Декор».
      </p>
      <button class="btn btn-primary" id="btn-sleep-next-day">
        🛏️ Лечь спать (Новый день)
      </button>
    </div>

    ${showHomeDecorModal ? renderHomeDecorModal() : ''}
  `;

  bindHomeEvents(onHudUpdate, showToast);
  scheduleNextCatWalk(1100);
}

function renderHomeDecorModal() {
  const homeItems = DECOR_CATALOG.filter((d) => d.place === 'Квартира' && (gameState.decor || []).includes(d.id));
  const listHtml = homeItems.length
    ? homeItems
        .map((item) => {
          const isHidden = (gameState.hiddenDecor || []).includes(item.id);
          return `
            <div class="decor-toggle-row">
              <div style="display:flex; align-items:center; gap:7px; flex:1; min-width:0;">
                <span style="font-size:18px;">${item.icon}</span>
                <div style="min-width:0;">
                  <strong style="font-size:12px;">${escapeHtml(item.name)}</strong>
                  <div class="muted-text" style="font-size:10px;">${item.category || 'Обычный'}</div>
                </div>
              </div>
              <button class="btn ${isHidden ? 'btn-sage' : 'btn-soft'}" data-toggle-home-decor="${item.id}" style="padding:5px 9px; font-size:11px;">
                ${isHidden ? 'Повесить' : 'Убрать'}
              </button>
            </div>
          `;
        })
        .join('')
    : `<p class="muted-text" style="text-align:center; padding:12px 4px;">У тебя пока нет купленного декора для квартиры. Загляни в «📱 Телефон» → «🛋️ Декор»!</p>`;

  return `
    <div class="vase-modal-overlay" id="home-decor-modal-overlay">
      <div class="flower-inspector vase-modal-card">
        <div class="row-between">
          <strong style="font-size:15px;">🎨 Оформление квартиры</strong>
          <button class="btn btn-soft" id="btn-close-home-decor" style="padding:5px 10px; font-size:12px;">✕</button>
        </div>
        <p class="muted-text" style="font-size:11.5px;">Вешай и убирай купленную мебель, ёлку, шторы, мячик и сезонные украшения по настроению:</p>
        <div class="decor-toggle-list">${listHtml}</div>
      </div>
    </div>
  `;
}

function bindHomeEvents(onHudUpdate, showToast) {
  const petName = gameState.petName || 'Пискля';

  document.getElementById('pisklya-walker')?.addEventListener('click', () => {
    triggerCatPetReaction(petName, onHudUpdate, showToast);
  });

  document.getElementById('btn-pet-cat')?.addEventListener('click', () => {
    triggerCatPetReaction(petName, onHudUpdate, showToast);
  });

  document.getElementById('cat-toy-ball')?.addEventListener('click', () => {
    triggerCatPlayWithBall(petName, onHudUpdate, showToast);
  });

  document.getElementById('btn-play-ball')?.addEventListener('click', () => {
    triggerCatPlayWithBall(petName, onHudUpdate, showToast);
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

  document.getElementById('btn-open-home-decor')?.addEventListener('click', () => {
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

  document.querySelectorAll('[data-toggle-home-decor]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggleHomeDecor;
      if (!Array.isArray(gameState.hiddenDecor)) gameState.hiddenDecor = [];
      if (gameState.hiddenDecor.includes(id)) {
        gameState.hiddenDecor = gameState.hiddenDecor.filter((x) => x !== id);
        showToast('✨ Украшение размещено в комнате!');
      } else {
        gameState.hiddenDecor.push(id);
        showToast('📦 Убрано в коробку (можно вернуть в любой момент)');
      }
      saveState();
      renderHomeScreen(onHudUpdate, showToast);
    });
  });
}

function freezeCatAtCurrentPosition() {
  const walker = document.getElementById('pisklya-walker');
  const stage = document.getElementById('home-walk-stage');
  if (!walker || !stage) return;

  const stageRect = stage.getBoundingClientRect();
  const walkerRect = walker.getBoundingClientRect();
  if (stageRect.width > 0) {
    const currentCenterPct = ((walkerRect.left - stageRect.left + walkerRect.width / 2) / stageRect.width) * 100;
    catPosPercent = Math.max(12, Math.min(86, Math.round(currentCenterPct * 10) / 10));
    walker.style.transition = 'none';
    walker.style.left = `${catPosPercent}%`;
  }
}

function rollToyBallElement(newBallX) {
  const ballEl = document.getElementById('cat-toy-ball');
  const delta = newBallX - ballPosPercent;
  ballRotationDeg += Math.round(delta * 10);
  ballPosPercent = newBallX;
  if (ballEl) {
    ballEl.style.left = `${ballPosPercent}%`;
    ballEl.style.transform = `translateX(-50%) rotate(${ballRotationDeg}deg)`;
  }
}

function scheduleNextCatWalk(delayMs = 2800) {
  if (catWalkTimer) clearTimeout(catWalkTimer);
  catWalkTimer = setTimeout(() => {
    const screen = document.getElementById('screen-home');
    const walker = document.getElementById('pisklya-walker');
    const flip = document.getElementById('cat-sprite-flip');
    const bubble = document.getElementById('cat-thought-bubble');
    if (!screen || !screen.classList.contains('active') || !walker || !flip || isCatPurring || isCatChasingBall) {
      scheduleNextCatWalk(2400);
      return;
    }

    const hasBall = isHomeDecorShown('cat_ball');
    const targets = [
      { x: 16, label: 'Смотрит в окно 🪟' },
      { x: 42, label: isHomeDecorShown('cat_bed') ? 'Отдыхает у лежанки 🧶' : 'Греется в центре 🐾' },
      { x: 76, label: isHomeDecorShown('xmas_tree_home') ? 'Любуется ёлочкой 🎄' : isHomeDecorShown('cozy_lamp') ? 'Греется у торшера 💡' : 'Гуляет по комнате 🐾' },
      { x: Math.round(22 + Math.random() * 52), label: 'Мягко шагает 🐾' }
    ];

    if (gameState.homeLocationId === 'home_balcony') {
      targets.push({ x: 88, label: 'Гуляет на балконе 🌿' });
    } else if (gameState.homeLocationId === 'home_loft') {
      targets.push({ x: 84, label: 'Греется у камина 🔥' });
    }

    if (hasBall) {
      const targetBallX = Math.max(16, Math.min(82, ballPosPercent));
      targets.push({ x: targetBallX, label: 'Гоняет мячик! 🎾', isBall: true });
      targets.push({ x: targetBallX, label: 'Гоняет мячик! 🎾', isBall: true });
    }

    const available = targets.filter((t) => Math.abs(t.x - catPosPercent) >= 8 || t.isBall);
    const chosen = available[Math.floor(Math.random() * available.length)] || targets[0];

    const dist = Math.abs(chosen.x - catPosPercent);
    const speedMsPerPct = chosen.isBall ? 46 : 60;
    const durationMs = Math.max(900, Math.round(dist * speedMsPerPct));

    catDir = chosen.x >= catPosPercent ? 1 : -1;
    flip.style.transform = `scaleX(${catDir})`;
    walker.classList.add('is-walking');
    walker.style.transition = `left ${durationMs}ms linear`;
    walker.style.left = `${chosen.x}%`;

    catThought = chosen.isBall ? 'Охотится на мячик! 🎾' : 'Идёт по комнате... 🐾';
    if (bubble) bubble.textContent = catThought;

    if (catArriveTimer) clearTimeout(catArriveTimer);
    catArriveTimer = setTimeout(() => {
      catPosPercent = chosen.x;
      walker.classList.remove('is-walking');

      if (chosen.isBall && isHomeDecorShown('cat_ball')) {
        const nextBallX = ballPosPercent > 50 ? 18 + Math.round(Math.random() * 18) : 64 + Math.round(Math.random() * 18);
        rollToyBallElement(nextBallX);
        catThought = 'Отбила мячик лапкой! 🎾';
        if (bubble) bubble.textContent = catThought;
        scheduleNextCatWalk(1600);
        return;
      }

      catThought = chosen.label;
      if (bubble) bubble.textContent = catThought;
      scheduleNextCatWalk(2600 + Math.floor(Math.random() * 2400));
    }, durationMs);
  }, delayMs);
}

function triggerCatPlayWithBall(petName, onHudUpdate, showToast) {
  const walker = document.getElementById('pisklya-walker');
  const flip = document.getElementById('cat-sprite-flip');
  const bubble = document.getElementById('cat-thought-bubble');
  const heartsLayer = document.getElementById('cat-hearts-layer');

  if (!walker || !flip || isCatChasingBall) return;

  playClickSound();
  clearCatTimers();
  isCatPurring = false;
  isCatChasingBall = true;

  freezeCatAtCurrentPosition();
  walker.classList.remove('is-purring', 'is-walking');

  const newBallX = ballPosPercent > 50 ? 16 + Math.round(Math.random() * 18) : 66 + Math.round(Math.random() * 18);
  rollToyBallElement(newBallX);

  const catchX = Math.max(14, Math.min(84, newBallX + (newBallX > 50 ? -6 : 6)));
  const dist = Math.abs(catchX - catPosPercent);
  const runMs = Math.max(1250, Math.round(dist * 46));

  catDir = catchX >= catPosPercent ? 1 : -1;
  flip.style.transform = `scaleX(${catDir})`;
  catThought = 'Заметила мячик! 🎾';
  if (bubble) bubble.textContent = catThought;

  catStartMoveTimer = setTimeout(() => {
    const curWalker = document.getElementById('pisklya-walker');
    const curBubble = document.getElementById('cat-thought-bubble');
    if (!curWalker) {
      isCatChasingBall = false;
      return;
    }

    curWalker.classList.add('is-walking');
    curWalker.style.transition = `left ${runMs}ms linear`;
    curWalker.style.left = `${catchX}%`;
    catThought = 'Бежит за мячиком! 🎾';
    if (curBubble) curBubble.textContent = catThought;

    catArriveTimer = setTimeout(() => {
      isCatChasingBall = false;
      catPosPercent = catchX;
      curWalker.classList.remove('is-walking');
      curWalker.classList.add('is-purring');
      isCatPurring = true;

      const wasLowMood = gameState.petMood < 100;
      gameState.petMood = Math.min(100, gameState.petMood + 5);
      if (wasLowMood) {
        gameState.mood = Math.min(100, gameState.mood + 1);
      }
      saveState();
      onHudUpdate();

      const moodBadge = document.getElementById('pet-mood-badge');
      if (moodBadge) moodBadge.textContent = `${gameState.petMood}%`;

      catThought = 'Поймала мячик! 🐾';
      if (curBubble) curBubble.textContent = catThought;

      if (heartsLayer) {
        ['🎾', '✨', '💕'].forEach((sym, i) => {
          const span = document.createElement('span');
          span.className = 'cat-heart-particle';
          span.textContent = sym;
          span.style.left = `${16 + i * 18}px`;
          span.style.animationDelay = `${i * 0.1}s`;
          heartsLayer.appendChild(span);
          setTimeout(() => span.remove(), 1250);
        });
      }

      playPurrSound();
      showToast(`🎾 ${petName} весело поймала мячик!`);

      catPurrTimer = setTimeout(() => {
        isCatPurring = false;
        curWalker.classList.remove('is-purring');
        scheduleNextCatWalk(1600);
      }, 1100);
    }, runMs);
  }, 90);
}

function triggerCatPetReaction(petName, onHudUpdate, showToast) {
  const walker = document.getElementById('pisklya-walker');
  const bubble = document.getElementById('cat-thought-bubble');
  const heartsLayer = document.getElementById('cat-hearts-layer');

  playPurrSound();
  gameState.petMood = Math.min(100, gameState.petMood + 8);
  gameState.mood = Math.min(100, gameState.mood + 2);
  saveState();
  onHudUpdate();

  const moodBadge = document.getElementById('pet-mood-badge');
  if (moodBadge) moodBadge.textContent = `${gameState.petMood}%`;

  if (walker) {
    clearCatTimers();
    isCatChasingBall = false;
    freezeCatAtCurrentPosition();

    isCatPurring = true;
    walker.classList.remove('is-walking');
    walker.classList.add('is-purring');
    catThought = 'Мррр! Люблю тебя 💖';
    if (bubble) bubble.textContent = catThought;

    if (heartsLayer) {
      const symbols = ['💖', '💕', '✨', '❤️'];
      symbols.forEach((sym, i) => {
        const span = document.createElement('span');
        span.className = 'cat-heart-particle';
        span.textContent = sym;
        span.style.left = `${14 + i * 16 + Math.round(Math.random() * 8)}px`;
        span.style.animationDelay = `${i * 0.11}s`;
        heartsLayer.appendChild(span);
        setTimeout(() => span.remove(), 1350);
      });
    }

    catPurrTimer = setTimeout(() => {
      isCatPurring = false;
      walker.classList.remove('is-purring');
      catThought = 'Довольно мурлычет 🐱';
      if (bubble) bubble.textContent = catThought;
      scheduleNextCatWalk(1800);
    }, 1650);
  }

  showToast(`🐱 Мррр! ${petName} мурлычет от удовольствия (+2% атмосферы)`);
}

function sleepToNextDay(onHudUpdate, showToast) {
  const lateMinutes = (gameState.timeMinutes || 540) - (gameState.closeHour || 21) * 60;
  const overworked = lateMinutes >= 120;

  gameState.day += 1;
  gameState.timeIndex = 0;
  gameState.timeMinutes = (gameState.openHour || 9) * 60;
  gameState.shownCloseHint = false;
  gameState.energy = overworked ? 65 : 100;
  if (overworked) {
    gameState.mood = Math.max(20, gameState.mood - 8);
  }
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
  const tiredMsg = overworked ? ' 🥱 Ты поздно лёг — сегодня меньше сил (65%).' : '';
  showToast(`☀️ Доброе утро, День ${gameState.day}!${tiredMsg}${extraMsg}`);
}

function getCatBallSvg() {
  return `
    <svg viewBox="0 0 32 32" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#F29F8F" stroke="#C96C5E" stroke-width="2"/>
      <path d="M5 10 Q16 17 27 10" stroke="#FFFDF9" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M5 22 Q16 15 27 22" stroke="#FFE599" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <circle cx="12" cy="10" r="2.2" fill="rgba(255,255,255,0.6)"/>
    </svg>
  `;
}

function getPisklyaCatSvg(mood) {
  const browHappy = mood >= 60
    ? '<path d="M34 38 Q39 35 44 38" stroke="#D99B5E" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M56 38 Q61 35 66 38" stroke="#D99B5E" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
    : '';

  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 76 Q89 65 84 40 Q81 32 76 38 Q78 58 67 71 Z" fill="#322A28"/>
      <path d="M81 45 Q84 54 78 63" stroke="#C88248" stroke-width="3" stroke-linecap="round" fill="none"/>

      <ellipse cx="50" cy="70" rx="23" ry="17" fill="#2A2321"/>
      <ellipse cx="60" cy="68" rx="9" ry="11" fill="#8C5937" opacity="0.55"/>

      <path d="M39 58 Q50 56 61 58 Q63 72 50 78 Q37 72 39 58 Z" fill="#D99B5E"/>
      <path d="M43 60 Q50 59 57 60 Q57 70 50 74 Q43 70 43 60 Z" fill="#E9BA86"/>

      <ellipse cx="42" cy="83" rx="5.5" ry="4" fill="#2A2321"/>
      <ellipse cx="58" cy="83" rx="5.5" ry="4" fill="#2A2321"/>
      <ellipse cx="42" cy="84" rx="3.2" ry="2.2" fill="#D99B5E"/>
      <ellipse cx="58" cy="84" rx="3.2" ry="2.2" fill="#D99B5E"/>

      <polygon points="27,36 30,13 45,26" fill="#2A2321"/>
      <polygon points="73,36 70,13 55,26" fill="#2A2321"/>
      <polygon points="31,31 32,18 41,26" fill="#B57A5C"/>
      <polygon points="69,31 68,18 59,26" fill="#B57A5C"/>

      <ellipse cx="50" cy="43" rx="23" ry="19" fill="#2A2321"/>
      <polygon points="25,44 29,39 30,50" fill="#2A2321"/>
      <polygon points="75,44 71,39 70,50" fill="#2A2321"/>

      <path d="M46 25 Q52 24 53 31 Q50 38 46 35 Q44 30 46 25 Z" fill="#E29A55"/>
      <circle cx="57" cy="49" r="3" fill="#B87642" opacity="0.6"/>

      <ellipse cx="40" cy="43" rx="4.4" ry="3.8" fill="#F2B84B"/>
      <ellipse cx="60" cy="43" rx="4.4" ry="3.8" fill="#F2B84B"/>
      <ellipse cx="40" cy="43" rx="2.1" ry="2.9" fill="#231D1B"/>
      <ellipse cx="60" cy="43" rx="2.1" ry="2.9" fill="#231D1B"/>
      <circle cx="38.8" cy="41.6" r="1.2" fill="#FFFFFF"/>
      <circle cx="58.8" cy="41.6" r="1.2" fill="#FFFFFF"/>
      ${browHappy}

      <polygon points="48,49 52,49 50,51.5" fill="#E89A94"/>
      <path d="M46 53 Q50 56 54 53" stroke="#D99B5E" stroke-width="1.4" fill="none" stroke-linecap="round"/>

      <line x1="23" y1="47" x2="35" y2="49" stroke="#C7B6AA" stroke-width="1.1"/>
      <line x1="23" y1="51" x2="35" y2="51" stroke="#C7B6AA" stroke-width="1.1"/>
      <line x1="77" y1="47" x2="65" y2="49" stroke="#C7B6AA" stroke-width="1.1"/>
      <line x1="77" y1="51" x2="65" y2="51" stroke="#C7B6AA" stroke-width="1.1"/>
    </svg>
  `;
}

function getCatBedFloorSvg() {
  return `
    <div class="home-cat-bed-floor" title="Лежанка с игрушкой">
      <svg viewBox="0 0 90 32" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="45" cy="20" rx="41" ry="11" fill="#E8A598"/>
        <ellipse cx="45" cy="18" rx="33" ry="8" fill="#FCEAE6"/>
        <circle cx="11" cy="21" r="5" fill="#DFAB4E"/>
      </svg>
    </div>
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

function getSofaSvg() {
  return `
    <div class="home-sofa-wrap" title="Пастельный диванчик">
      <svg viewBox="0 0 130 65" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="14" width="102" height="26" rx="10" fill="#E5B6AE"/>
        <rect x="6" y="28" width="16" height="26" rx="6" fill="#D99E94"/>
        <rect x="108" y="28" width="16" height="26" rx="6" fill="#D99E94"/>
        <rect x="18" y="34" width="94" height="18" rx="6" fill="#F2CFC8"/>
        <rect x="22" y="52" width="7" height="9" rx="2" fill="#8C6D56"/>
        <rect x="101" y="52" width="7" height="9" rx="2" fill="#8C6D56"/>
      </svg>
    </div>
  `;
}

function getFicusPlantSvg() {
  return `
    <div class="home-plant-floor" title="Фикус в кашпо">
      <svg viewBox="0 0 60 90" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <polygon points="18,62 42,62 38,86 22,86" fill="#D9A78B"/>
        <rect x="28" y="36" width="4" height="26" fill="#6E5542"/>
        <ellipse cx="22" cy="40" rx="11" ry="7" transform="rotate(-25 22 40)" fill="#6C936E"/>
        <ellipse cx="38" cy="34" rx="12" ry="7" transform="rotate(22 38 34)" fill="#7EA680"/>
        <ellipse cx="30" cy="22" rx="10" ry="12" fill="#8BB58D"/>
      </svg>
    </div>
  `;
}

function getHomeXmasTreeSvg() {
  return `
    <div class="home-tree-floor" title="Домашняя ёлка с огоньками">
      <svg viewBox="0 0 80 115" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="34" y="92" width="12" height="16" rx="2" fill="#7D5C43"/>
        <polygon points="40,14 14,50 66,50" fill="#5D8760"/>
        <polygon points="40,34 10,74 70,74" fill="#4E7851"/>
        <polygon points="40,56 6,96 74,96" fill="#416944"/>
        <circle cx="40" cy="11" r="5" fill="#F5C954"/>
        <circle cx="32" cy="42" r="3.5" fill="#E87A82"/>
        <circle cx="48" cy="60" r="3.5" fill="#F5C954"/>
        <circle cx="28" cy="78" r="3.5" fill="#89B9DF"/>
        <circle cx="52" cy="84" r="3.5" fill="#E87A82"/>
      </svg>
    </div>
  `;
}

function getHomePumpkinsSvg() {
  return `
    <div class="home-pumpkins-floor" title="Осенние тыквы и свечи">
      <svg viewBox="0 0 70 46" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="32" rx="14" ry="11" fill="#E07D3C"/>
        <ellipse cx="24" cy="32" rx="8" ry="11" fill="#EA8F4E"/>
        <rect x="22" y="17" width="4" height="5" rx="1" fill="#5D7D4E"/>
        <ellipse cx="48" cy="35" rx="10" ry="8" fill="#D46A34"/>
        <rect x="34" y="26" width="6" height="14" rx="1" fill="#FFF7E2"/>
        <ellipse cx="37" cy="23" rx="2" ry="3.5" fill="#FFBE42"/>
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

function renderHomeBackdropDetails(homeId) {
  if (homeId !== 'home_loft') return '';
  return `
    <div class="home-loft-beams">
      <svg viewBox="0 0 360 22" width="100%" height="22" preserveAspectRatio="none">
        <path d="M0,12 L105,0 L255,0 L360,12 L360,18 L252,6 L108,6 L0,18 Z" fill="#C79F73"/>
        <rect x="0" y="0" width="360" height="5" fill="#B58A5E"/>
        <circle cx="180" cy="11" r="4" fill="#FFE6A3"/>
      </svg>
    </div>
  `;
}

function renderHomeWindowScenery(homeId, isDay, seasonId) {
  const leafColor =
    seasonId === 'winter' ? '#DAE7F0' :
    seasonId === 'early-spring' ? '#A4CB9C' :
    seasonId === 'autumn' ? '#E28C4A' : '#79B375';
  const groundColor =
    seasonId === 'winter' ? '#EDF4F8' :
    seasonId === 'autumn' ? '#D6955A' : '#95C18E';

  if (homeId === 'home_loft') {
    return `
      <svg class="home-window-svg" viewBox="0 0 124 88" preserveAspectRatio="none">
        ${isDay ? `
          <circle cx="96" cy="22" r="10" fill="#FFE68C"/>
          <ellipse cx="38" cy="24" rx="16" ry="7" fill="rgba(255,255,255,0.85)"/>
          <ellipse cx="48" cy="22" rx="11" ry="6" fill="rgba(255,255,255,0.9)"/>
          <path d="M18,36 Q22,32 26,36 Q30,32 34,36" stroke="#6F869C" stroke-width="1.3" fill="none"/>
        ` : `
          <circle cx="96" cy="22" r="10" fill="#FFF4C2"/>
          <circle cx="100" cy="20" r="8" fill="#323D6D"/>
          <circle cx="24" cy="18" r="1.5" fill="#FFFDF5"/>
          <circle cx="44" cy="13" r="1.8" fill="#FFE8A3"/>
          <circle cx="68" cy="24" r="1.4" fill="#FFFDF5"/>
          <circle cx="32" cy="36" r="1.3" fill="#FFFDF5"/>
          <circle cx="78" cy="39" r="1.7" fill="#FFE8A3"/>
          <circle cx="54" cy="33" r="1.2" fill="#FFFDF5"/>
        `}
        <polygon points="0,88 0,68 26,56 54,70 54,88" fill="${isDay ? '#D69E86' : '#4E445A'}"/>
        <polygon points="48,88 48,66 86,54 124,68 124,88" fill="${isDay ? '#E0B298' : '#3F374A'}"/>
        <rect x="64" y="69" width="6" height="8" rx="1" fill="${isDay ? '#D4EAF7' : '#FFE394'}"/>
        <rect x="78" y="69" width="6" height="8" rx="1" fill="${isDay ? '#D4EAF7' : '#FFE394'}"/>
        <rect x="20" y="72" width="6" height="7" rx="1" fill="${isDay ? '#D4EAF7' : '#FFE394'}"/>
        ${seasonId === 'winter' ? '<path d="M0,68 L26,56 L54,70 L86,54 L124,68" stroke="#F4F9FC" stroke-width="2.5" fill="none"/>' : ''}
      </svg>
    `;
  }

  if (homeId === 'home_balcony') {
    return `
      <svg class="home-window-svg" viewBox="0 0 106 82" preserveAspectRatio="none">
        ${isDay
          ? '<circle cx="84" cy="18" r="8" fill="#FFE484"/><ellipse cx="32" cy="20" rx="14" ry="6" fill="rgba(255,255,255,0.8)"/>'
          : '<circle cx="84" cy="18" r="8" fill="#FFF4C4"/><circle cx="26" cy="16" r="1.3" fill="#FFF"/>'}
        <path d="M0,62 Q35,54 70,60 Q92,56 106,62 L106,82 L0,82 Z" fill="${groundColor}"/>
        <circle cx="28" cy="48" r="14" fill="${leafColor}"/>
        <circle cx="76" cy="50" r="12" fill="${leafColor}"/>
        <rect x="26" y="56" width="4" height="12" fill="#8C6D56"/>
        <rect x="74" y="56" width="4" height="12" fill="#8C6D56"/>
      </svg>
    `;
  }

  return `
    <svg class="home-window-svg" viewBox="0 0 106 82" preserveAspectRatio="none">
      ${isDay ? '<circle cx="84" cy="18" r="8" fill="#FFE382"/>' : '<circle cx="84" cy="18" r="7" fill="#FFF3BF"/>'}
      <rect x="54" y="42" width="42" height="34" fill="#F2DEC8" stroke="#CBB19A" stroke-width="1"/>
      <polygon points="50,42 75,26 100,42" fill="#C97E6D"/>
      <rect x="63" y="49" width="8" height="10" fill="${isDay ? '#BFE2F5' : '#FFE494'}"/>
      <rect x="79" y="49" width="8" height="10" fill="${isDay ? '#BFE2F5' : '#FFE494'}"/>
      <rect x="0" y="66" width="106" height="16" fill="${groundColor}"/>
      <circle cx="24" cy="48" r="14" fill="${leafColor}"/>
      <rect x="22" y="56" width="4" height="14" fill="#8C6D56"/>
      <polygon points="10,72 22,72 20,80 12,80" fill="#D9A78B"/>
      <circle cx="16" cy="68" r="4.5" fill="#7D9E7F"/>
      <circle cx="16" cy="66" r="2.2" fill="#F29AA4"/>
    </svg>
  `;
}

function renderBalconyDoorHtml(isDay, seasonId) {
  const isWinter = seasonId === 'winter';
  const isEarlySpring = seasonId === 'early-spring';
  const isAutumn = seasonId === 'autumn';

  const floorBg = isWinter
    ? '#EAF2F7'
    : isEarlySpring
    ? '#C9D8C6'
    : isAutumn
    ? '#D7A36E'
    : '#94BF8E';

  const boxPlants = isWinter
    ? `
      <circle cx="28" cy="61" r="6" fill="#4E7B52"/>
      <circle cx="44" cy="59" r="7" fill="#5D8C61"/>
      <circle cx="60" cy="61" r="6" fill="#4E7B52"/>
      <path d="M22,58 Q34,53 44,56 Q56,53 66,58" stroke="#F4F9FC" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="34" cy="60" r="1.8" fill="#D9534F"/>
      <circle cx="52" cy="59" r="1.8" fill="#D9534F"/>
    `
    : isAutumn
    ? `
      <circle cx="28" cy="61" r="6" fill="#D97A3E"/>
      <circle cx="44" cy="59" r="7" fill="#E6A64C"/>
      <circle cx="60" cy="61" r="6" fill="#C9653B"/>
    `
    : `
      <circle cx="28" cy="61" r="6" fill="#79B475"/>
      <circle cx="44" cy="60" r="7" fill="#79B475"/>
      <circle cx="60" cy="61" r="6" fill="#79B475"/>
      <circle cx="30" cy="59" r="2.5" fill="#F29AA4"/>
      <circle cx="45" cy="58" r="2.5" fill="#FFE28A"/>
      <circle cx="58" cy="59" r="2.5" fill="#F6B8BF"/>
    `;

  const balconyPot = isWinter
    ? `
      <polygon points="56,98 72,98 69,112 59,112" fill="#C98D72"/>
      <polygon points="64,76 53,97 75,97" fill="#4D7D52"/>
      <path d="M58,86 Q64,83 70,86" stroke="#F4F9FC" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `
    : `
      <polygon points="56,98 72,98 69,112 59,112" fill="#C98D72"/>
      <circle cx="64" cy="91" r="9" fill="${isAutumn ? '#D98544' : '#6E9E69'}"/>
    `;

  const snowFlakes = isWinter
    ? `
      <circle cx="16" cy="28" r="1.8" fill="#FFFFFF"/>
      <circle cx="34" cy="40" r="1.5" fill="#FFFFFF"/>
      <circle cx="58" cy="30" r="1.8" fill="#FFFFFF"/>
      <circle cx="74" cy="46" r="1.5" fill="#FFFFFF"/>
      <circle cx="24" cy="52" r="1.4" fill="#FFFFFF"/>
    `
    : '';

  return `
    <div class="home-balcony-door ${isDay ? '' : 'night'}" title="Панорамный балкон">
      <svg viewBox="0 0 88 118" width="100%" height="100%">
        <rect x="0" y="72" width="88" height="46" fill="${floorBg}"/>
        ${isWinter ? '<path d="M0,74 Q22,69 44,74 Q66,69 88,74 L88,80 L0,80 Z" fill="#FFFFFF"/>' : ''}
        ${isDay
          ? '<circle cx="68" cy="18" r="8" fill="#FFE58C"/>'
          : '<circle cx="68" cy="18" r="7" fill="#FFF3C4"/><circle cx="20" cy="16" r="1.4" fill="#FFF"/><circle cx="38" cy="12" r="1.4" fill="#FFE699"/>'}
        ${snowFlakes}
        <path d="M4,8 Q44,20 84,8" stroke="#D9C3B0" stroke-width="1.2" fill="none"/>
        <circle cx="20" cy="12" r="2.2" fill="#FFE694"/>
        <circle cx="44" cy="14" r="2.2" fill="#FFE694"/>
        <circle cx="68" cy="12" r="2.2" fill="#FFE694"/>
        <line x1="0" y1="74" x2="88" y2="74" stroke="#FFFDF9" stroke-width="4"/>
        <line x1="16" y1="74" x2="16" y2="118" stroke="#FFFDF9" stroke-width="2.5"/>
        <line x1="44" y1="0" x2="44" y2="118" stroke="#FFFDF9" stroke-width="3"/>
        <line x1="72" y1="74" x2="72" y2="118" stroke="#FFFDF9" stroke-width="2.5"/>
        <rect x="18" y="64" width="52" height="11" rx="2" fill="#D9A78B"/>
        ${boxPlants}
        ${balconyPot}
      </svg>
    </div>
  `;
}

function renderLoftFireplaceHtml() {
  return `
    <div class="home-fireplace" style="margin-bottom:-4px;" title="Светлый резной камин">
      <svg viewBox="0 0 102 98" width="100%" height="100%">
        <rect x="10" y="24" width="82" height="72" rx="4" fill="#FAF4EC" stroke="#DCC8B4" stroke-width="2"/>
        <rect x="4" y="18" width="94" height="8" rx="3" fill="#EBD7C2" stroke="#D1B79C" stroke-width="1.5"/>
        <rect x="16" y="8" width="6" height="10" rx="1" fill="#FFFDF9"/>
        <ellipse cx="19" cy="5" rx="2" ry="3.5" fill="#FFB945"/>
        <rect x="26" y="10" width="5" height="8" rx="1" fill="#FCEAE6"/>
        <ellipse cx="28.5" cy="7" rx="1.8" ry="3" fill="#FFB945"/>
        <rect x="40" y="6" width="18" height="12" rx="2" fill="#DFB873"/>
        <rect x="43" y="8" width="12" height="8" fill="#FAF4E8"/>
        <polygon points="73,10 83,10 81,18 75,18" fill="#C8D9C7"/>
        <path d="M78,10 Q75,4 72,2 M78,10 Q81,3 84,2" stroke="#6E9971" stroke-width="1.6" fill="none"/>
        <path d="M26,96 L26,50 Q51,33 76,50 L76,96 Z" fill="#46373B"/>
        <ellipse cx="51" cy="84" rx="22" ry="8" fill="#6E4E3E"/>
        <rect x="35" y="81" width="32" height="6" rx="3" fill="#8C5D43"/>
        <g class="fireplace-flame">
          <path d="M51,50 Q64,68 56,82 Q51,87 46,82 Q38,68 51,50 Z" fill="#FF8C3B"/>
          <path d="M51,59 Q59,71 54,81 Q50,84 48,79 Q44,71 51,59 Z" fill="#FFE073"/>
        </g>
      </svg>
    </div>
  `;
}

function renderStudioArtHtml() {
  return `
    <div class="home-studio-art" title="Ботанический постер">
      <svg viewBox="0 0 48 36" width="100%" height="100%">
        <rect x="4" y="3" width="40" height="30" rx="3" fill="#FFFDF9" stroke="#C9A88C" stroke-width="2"/>
        <path d="M24,27 L24,12 M24,21 L18,17 M24,18 L30,14" stroke="#7D9E7F" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="24" cy="11" r="4" fill="#F29AA4"/>
      </svg>
    </div>
  `;
}

function getCatTowerSvg() {
  return `
    <div class="home-cat-tower-floor" title="Большой кошачий городок до потолка">
      <svg viewBox="0 0 70 118" width="100%" height="100%">
        <rect x="10" y="106" width="50" height="8" rx="3" fill="#D5B89B"/>
        <rect x="18" y="64" width="7" height="42" fill="#E3C8A8"/>
        <rect x="45" y="36" width="7" height="70" fill="#E3C8A8"/>
        <rect x="14" y="80" width="26" height="26" rx="4" fill="#F2D7C9" stroke="#D1A694" stroke-width="1.5"/>
        <circle cx="27" cy="94" r="6.5" fill="#4A3E39"/>
        <rect x="12" y="58" width="28" height="7" rx="3" fill="#EBD0B9"/>
        <rect x="30" y="32" width="32" height="7" rx="3" fill="#EBD0B9"/>
        <ellipse cx="46" cy="16" rx="14" ry="6" fill="#FCEAE6" stroke="#E0A599" stroke-width="1.5"/>
        <rect x="43" y="18" width="6" height="14" fill="#E3C8A8"/>
        <circle cx="20" cy="70" r="3" fill="#F29AA4"/>
        <line x1="20" y1="65" x2="20" y2="68" stroke="#A88C72" stroke-width="1.2"/>
      </svg>
    </div>
  `;
}

function getDesignerLampSvg() {
  return `
    <span class="home-rare-decor-spot" title="Дизайнерский витражный торшер">
      <svg viewBox="0 0 38 64" width="32" height="54">
        <rect x="17" y="24" width="4" height="34" fill="#735743"/>
        <ellipse cx="19" cy="59" rx="10" ry="3" fill="#5E4635"/>
        <polygon points="9,8 29,8 34,25 4,25" fill="#FCE6B4" stroke="#C98A4B" stroke-width="1.5"/>
        <polygon points="14,8 24,8 21,25 17,25" fill="#F29AA4" opacity="0.75"/>
        <polygon points="9,8 14,8 17,25 4,25" fill="#89B9DF" opacity="0.7"/>
      </svg>
    </span>
  `;
}

function getAntiqueDresserSvg() {
  return `
    <span class="home-rare-decor-spot" title="Старинное трюмо с зеркалом">
      <svg viewBox="0 0 46 60" width="38" height="50">
        <ellipse cx="23" cy="18" rx="12" ry="15" fill="#C9A36B" stroke="#8F6E3E" stroke-width="1.5"/>
        <ellipse cx="23" cy="18" rx="9" ry="12" fill="#DCECF5"/>
        <rect x="7" y="34" width="32" height="20" rx="2" fill="#A97D59" stroke="#7E5B3E" stroke-width="1.5"/>
        <line x1="10" y1="44" x2="36" y2="44" stroke="#7E5B3E" stroke-width="1.2"/>
        <circle cx="23" cy="39" r="1.6" fill="#DFB66B"/>
        <circle cx="23" cy="49" r="1.6" fill="#DFB66B"/>
        <rect x="9" y="54" width="4" height="5" fill="#7E5B3E"/>
        <rect x="33" y="54" width="4" height="5" fill="#7E5B3E"/>
      </svg>
    </span>
  `;
}

function getBotanicalVinylSvg() {
  return `
    <span class="home-rare-decor-spot" title="Винтажный проигрыватель дома">
      <svg viewBox="0 0 48 42" width="40" height="35">
        <rect x="4" y="16" width="40" height="20" rx="4" fill="#B88B61" stroke="#855E3B" stroke-width="1.5"/>
        <rect x="8" y="10" width="32" height="8" rx="2" fill="#D5B08B"/>
        <ellipse cx="22" cy="18" rx="11" ry="3.5" fill="#2B2729"/>
        <ellipse cx="22" cy="18" rx="3.5" ry="1.2" fill="#E89A94"/>
        <path d="M35,14 L29,18" stroke="#DFB66B" stroke-width="2" stroke-linecap="round"/>
        <circle cx="13" cy="26" r="4" fill="#6E4E3E"/>
        <circle cx="35" cy="26" r="2.2" fill="#DFB66B"/>
      </svg>
    </span>
  `;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
```

## File: js/screens/phoneScreen.js
```javascript
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
          <span class="phone-app-icon">🏺</span>
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
```

## File: js/screens/shopScreen.js
```javascript
/**
 * js/screens/shopScreen.js
 * Главный экран цветочного магазина: витрина ваз, прилавок, смена времени и управление залом
 */

import {
  FLOWERS_CATALOG,
  TIME_PERIODS,
  WEATHERS,
  DECOR_CATALOG,
  SHOP_LOCATIONS,
  getGameDateObj,
  getSeasonInfo,
  getHolidayForDate,
  AI_PROVIDERS,
  AI_SETTINGS_KEY
} from '/js/config.js';
import { gameState, aiSettings, saveState, advanceShift, isShopClosedNow } from '/js/state.js';
import { getFlowerInVaseSvg } from '/js/graphics/flowersSvg.js';
import { renderBouquetMaker, addFlowerToDraftBouquet } from '/js/screens/bouquetMaker.js';
import { playBellSound, playPaperSound } from '/js/sound.js';

import {
  renderShopTopDecor,
  renderShopDecorVisuals,
  renderShopArchDetails,
  renderShopWindowScenery,
  renderWeatherParticles
} from '/js/graphics/shopScenerySvg.js';
import {
  checkPreorderArrival,
  isClientTalkingNow,
  renderClientZoneHtml,
  handleCounterBouquetSell,
  summonNextClient,
  summonPreorderClient,
  retryLastAiRequest,
  sendPlayerRejection,
  sendPlayerMessage,
  toggleOfferDrawer,
  toggleRejectPanel,
  closeRejectPanel,
  getActiveClient
} from '/js/screens/shop/shopClientZone.js';
import { renderInspectorModal, getActualFlowerPrice } from '/js/screens/shop/shopInspector.js';

let selectedVaseUid = null;
let shopSubTab = 'hall'; // 'hall' | 'bouquet'
let showShopDecorModal = false;

export { checkPreorderArrival, isClientTalkingNow };

export function isBouquetMakerOpen() {
  return shopSubTab === 'bouquet';
}

export function renderShopScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-shop');
  if (!container) return;

  const stemsCount = gameState.currentBouquet?.stems?.length || 0;
  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const season = getSeasonInfo(curDate);
  const isHoliday = getHolidayForDate(curDate);
  const closedNow = isShopClosedNow();

  const openStr = String(gameState.openHour || 9).padStart(2, '0') + ':00';
  const closeStr = String(gameState.closeHour || 21).padStart(2, '0') + ':00';

  container.innerHTML = `
    <div class="screen-header">
      <h1 class="screen-title">${escapeHtml(gameState.shopName || 'Fleur Atelier')}</h1>
      <div style="display:flex; gap:5px; align-items:center;">
        ${gameState.hasFridge ? '<span class="badge badge-ok" title="Холодильник замедляет увядание">❄️</span>' : ''}
        <span class="badge ${closedNow ? 'badge-warn' : isHoliday ? 'badge-warn' : 'badge-ok'}">
          ${closedNow ? '🌙 Закрыто' : isHoliday ? '🎉 Праздник!' : `${openStr}–${closeStr}`}
        </span>
      </div>
    </div>

    <div class="segmented-tabs">
      <button class="seg-btn ${shopSubTab === 'hall' ? 'active' : ''}" data-shop-tab="hall">
        🏪 Зал и клиенты
      </button>
      <button class="seg-btn ${shopSubTab === 'bouquet' ? 'active' : ''}" data-shop-tab="bouquet">
        💐 Стол сборки ${stemsCount > 0 ? `(${stemsCount})` : ''}
      </button>
    </div>

    <div id="shop-subtab-content" style="display: flex; flex-direction: column; gap: 12px;"></div>
  `;

  container.querySelectorAll('[data-shop-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextSubTab = btn.dataset.shopTab;
      if (nextSubTab !== shopSubTab) {
        shopSubTab = nextSubTab;
        renderShopScreen(onHudUpdate, showToast);
        container.scrollTop = 0;
        if (shopSubTab === 'hall' && !isShopClosedNow()) {
          checkPreorderArrival(onHudUpdate, showToast, () => renderShopScreen(onHudUpdate, showToast));
        }
      }
    });
  });

  const subContent = document.getElementById('shop-subtab-content');
  if (shopSubTab === 'bouquet') {
    renderBouquetMaker(subContent, onHudUpdate, showToast, () => {
      renderShopScreen(onHudUpdate, showToast);
    });
    return;
  }

  const timeClass = gameState.timeIndex === 2 || closedNow ? 'time-evening' : 'time-day';
  const weatherClass = `weather-${gameState.weather}`;
  const weatherObj = WEATHERS.find((w) => w.id === gameState.weather) || WEATHERS[0];
  const periodName = closedNow ? 'После закрытия' : TIME_PERIODS[gameState.timeIndex] || 'Утро';

  const wallpaperClass = isShopDecorShown('vintage_wallpaper') ? 'has-wallpaper' : '';
  const powerClass = gameState.powerOutage
    ? gameState.candlesLit
      ? 'power-out candles-lit'
      : 'power-out'
    : '';
  const hasNeon = isShopDecorShown('neon_sign');
  const currentLoc = SHOP_LOCATIONS.find((l) => l.id === gameState.shopLocationId) || SHOP_LOCATIONS[0];

  const vasesHtml = gameState.inventory.length
    ? gameState.inventory.map((item) => renderVaseSlot(item)).join('')
    : `<div class="muted-text" style="grid-column: 1 / -1; text-align: center; padding: 18px 8px;">
         Вазы пусты! Закажи свежие цветы в «📱 Телефон» → «🚚 Опт».
       </div>`;

  const selectedItem = gameState.inventory.find((i) => i.uid === selectedVaseUid) || null;
  const waitingDue = (gameState.preorders || []).find(
    (p) =>
      p.day === gameState.day &&
      (p.status === 'in_shop' || (p.status === 'waiting' && (gameState.timeMinutes || 540) >= p.dueMinutes))
  );

  subContent.innerHTML = `
    <div class="shop-scene loc-${currentLoc.id} ${timeClass} ${wallpaperClass} ${powerClass}">
      <div class="shop-garland">
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
      </div>

      ${renderShopArchDetails(currentLoc.id)}

      ${renderShopTopDecor(hasNeon)}

      ${
        gameState.powerOutage
          ? `
        <div class="power-alert-bar">
          <span>${gameState.candlesLit ? '🕯️ В лавке горят уютные свечи!' : '⚡ Отключили свет! В лавке темно.'}</span>
          ${!gameState.candlesLit ? '<button class="btn btn-primary" id="btn-light-candles" style="padding:5px 9px; font-size:11px;">🕯️ Зажечь свечи</button>' : ''}
        </div>
      `
          : ''
      }

      <div class="shop-window-row">
        <div class="shop-window ${timeClass} ${weatherClass}">
          ${renderShopWindowScenery(currentLoc.id, timeClass, season.id, gameState.weather)}
          <div class="weather-particles">${renderWeatherParticles(gameState.weather, season.id)}</div>
          <div class="window-pane-v"></div>
          <div class="window-pane-h"></div>
        </div>

        <div class="shop-sign-box">
          <div class="sign-title">${periodName}</div>
          <div class="sign-subtitle">${weatherObj.icon} ${season.label}</div>
          <div style="display:flex; gap:4px; width:100%;">
            <button class="btn btn-soft" id="btn-next-shift" style="flex:1; padding: 6px 4px; font-size: 11px;" ${closedNow ? 'disabled style="opacity:0.5;"' : ''}>
              ⏩ Смена
            </button>
            <button class="btn btn-soft" id="btn-open-shop-decor" style="padding: 6px 8px; font-size: 11px;" title="Повесить или убрать декор зала">
              🎨 Декор
            </button>
          </div>
        </div>
      </div>

      ${renderShopDecorVisuals()}

      ${renderPreordersQueue()}

      ${renderClientZoneHtml(closedNow, waitingDue)}

      <div class="vases-grid">
        ${vasesHtml}
      </div>

      ${renderCounterReadyBouquets()}

      <div class="wooden-counter"></div>
    </div>

    ${selectedItem ? renderInspectorModal(selectedItem) : ''}
    ${showShopDecorModal ? renderShopDecorModal() : ''}
  `;

  bindShopEvents(subContent, onHudUpdate, showToast);
  scrollChatToBottom();
}

function isShopDecorShown(id) {
  const owned = new Set([...(gameState.decor || []), ...(gameState.decorInventory || [])]);
  return owned.has(id) && !(gameState.hiddenDecor || []).includes(id);
}

function renderCounterReadyBouquets() {
  if (!Array.isArray(gameState.readyBouquets) || gameState.readyBouquets.length === 0) {
    return '';
  }

  const clientTalking = isClientTalkingNow();
  const activeClient = getActiveClient();
  const wantedId = clientTalking ? activeClient?.wantedBouquetId : null;

  const cardsHtml = gameState.readyBouquets
    .map((b) => {
      const isWanted = wantedId === b.id;
      const freshWord = getBouquetFreshnessWord(b);
      const isWilted = freshWord.includes('подвявш');
      return `
        <div class="counter-bouquet-card ${isWanted ? 'wanted' : ''}">
          ${isWanted ? '<span class="counter-wanted-badge">Хочет купить!</span>' : ''}
          <img class="counter-bouquet-img" src="${b.thumbnail}" alt="Готовый букет" />
          <div class="counter-bouquet-price">${b.price} ₽</div>
          <div class="counter-bouquet-desc" title="${escapeAttr(b.summary)}">${escapeHtml(b.summary)}</div>
          <div class="counter-bouquet-meta">${b.stemsCount || b.items?.length || 1} шт.${isWilted ? ' • вянет' : ''}</div>
          ${
            clientTalking
              ? `
            <button
              class="btn ${isWanted ? 'btn-primary' : 'btn-sage'} counter-sell-btn"
              data-counter-sell-bouquet="${b.id}"
            >
              ${isWanted ? '⚡ Продать' : '🤝 Продать'}
            </button>
          `
              : `
            <button class="btn btn-soft counter-sell-btn" data-counter-open-maker="${b.id}">
              💐 На стол
            </button>
          `
          }
        </div>
      `;
    })
    .join('');

  return `
    <div class="counter-bouquets-box">
      <div class="row-between" style="padding: 0 2px;">
        <strong style="font-size: 12px;">💐 Готовые букеты на витрине (${gameState.readyBouquets.length})</strong>
        <span class="muted-text" style="font-size: 10.5px;">${clientTalking ? 'Нажми, чтобы продать' : 'Ждут покупателя'}</span>
      </div>
      <div class="counter-bouquets-row">
        ${cardsHtml}
      </div>
    </div>
  `;
}

function getBouquetFreshnessWord(bouquet) {
  if (!Array.isArray(bouquet.stems) || bouquet.stems.length === 0) return 'свежие';
  const minFresh = Math.min(...bouquet.stems.map((s) => s.freshness ?? 85));
  if (minFresh < 40) return 'подвявшие, поникшие';
  if (minFresh < 70) return 'обычной свежести';
  return 'свежие';
}

function renderShopDecorModal() {
  const ownedSet = new Set([...(gameState.decor || []), ...(gameState.decorInventory || [])]);
  const shopItems = DECOR_CATALOG.filter(
    (d) => d.place === 'Магазин' && d.id !== 'fridge' && ownedSet.has(d.id)
  );
  const currentLoc = SHOP_LOCATIONS.find((l) => l.id === gameState.shopLocationId) || SHOP_LOCATIONS[0];
  const visibleCount = shopItems.filter((item) => !(gameState.hiddenDecor || []).includes(item.id)).length;

  const listHtml = shopItems.length
    ? shopItems
        .map((item) => {
          const isHidden = (gameState.hiddenDecor || []).includes(item.id);
          return `
            <div class="decor-toggle-row">
              <div style="display:flex; align-items:center; gap:7px; flex:1; min-width:0;">
                <span style="font-size:18px;">${item.icon}</span>
                <div style="min-width:0;">
                  <strong style="font-size:12px;">${escapeHtml(item.name)}</strong>
                  <div class="muted-text" style="font-size:10px;">${item.category || 'Обычный'}</div>
                </div>
              </div>
              <button class="btn ${isHidden ? 'btn-sage' : 'btn-soft'}" data-toggle-shop-decor="${item.id}" style="padding:5px 9px; font-size:11px;">
                ${isHidden ? 'Повесить' : 'Убрать'}
              </button>
            </div>
          `;
        })
        .join('')
    : `<p class="muted-text" style="text-align:center; padding:12px 4px;">У тебя пока нет украшений для зала. Загляни в «📱 Телефон» → «🏺 Декор»!</p>`;

  return `
    <div class="vase-modal-overlay" id="shop-decor-modal-overlay">
      <div class="flower-inspector vase-modal-card">
        <div class="row-between">
          <strong style="font-size:15px;">🎨 Декор зала (${visibleCount}/${currentLoc.maxWallDecor})</strong>
          <button class="btn btn-soft" id="btn-close-shop-decor" style="padding:5px 10px; font-size:12px;">✕</button>
        </div>
        <p class="muted-text" style="font-size:11.5px;">Помещение «${escapeHtml(currentLoc.name)}» вмещает до ${currentLoc.maxWallDecor} украшений:</p>
        <div class="decor-toggle-list">${listHtml}</div>
      </div>
    </div>
  `;
}

function renderPreordersQueue() {
  const activePreorders = (gameState.preorders || []).filter(
    (p) => p.day === gameState.day && (p.status === 'waiting' || p.status === 'in_shop')
  );
  if (!activePreorders.length) return '';

  const curMin = gameState.timeMinutes || 540;
  const rowsHtml = activePreorders
    .sort((a, b) => a.dueMinutes - b.dueMinutes)
    .map((p) => {
      const isDue = curMin >= p.dueMinutes;
      const inShop = p.status === 'in_shop';
      const activeClient = getActiveClient();
      const talkingToThisPreorder =
        activeClient && activeClient.preorder && activeClient.preorder.id === p.id && activeClient.status === 'talking';
      const accHint = p.accessoryName ? ` + ${p.accessoryName}` : '';
      return `
        <div class="preorder-row ${isDue || inShop ? 'due-now' : ''}">
          <div style="flex:1; min-width:0;">
            <strong>${escapeHtml(p.senderName)}</strong> • <span>${p.dueTimeLabel}</span>
            <div class="muted-text" style="font-size:11px;">
              ${p.qty} шт. «${escapeHtml(p.flowerName)}»${escapeHtml(accHint)} (${p.reward} ₽)
            </div>
          </div>
          ${
            inShop
              ? talkingToThisPreorder
                ? '<span class="badge badge-ok">У прилавка</span>'
                : `<button class="btn btn-primary" data-call-inshop="${p.id}" style="padding:5px 9px; font-size:11px;">🔔 Принять</button>`
              : `
            <button class="btn btn-soft" data-go-assemble="${p.id}" style="padding:5px 8px; font-size:11px;">
              💐 Собрать
            </button>
          `
          }
        </div>
      `;
    })
    .join('');

  return `
    <div class="preorders-queue-card">
      <div class="row-between">
        <strong style="font-size:12px;">📋 Предзаказы на сегодня (${activePreorders.length})</strong>
        <span class="muted-text" style="font-size:10.5px;">Придут сами ко времени</span>
      </div>
      ${rowsHtml}
    </div>
  `;
}

function renderVaseSlot(item) {
  const meta = FLOWERS_CATALOG[item.typeId];
  if (!meta) return '';

  const price = getActualFlowerPrice(item, meta);
  const freshClass = item.freshness >= 65 ? 'fresh-high' : item.freshness >= 35 ? 'fresh-mid' : 'fresh-low';
  const wiltingClass = item.freshness < 45 ? 'wilting' : '';
  const isSelected = item.uid === selectedVaseUid ? 'selected' : '';

  return `
    <div class="vase-slot ${isSelected}" data-vase-uid="${item.uid}">
      ${item.discounted ? '<span class="vase-discount-tag">-40%</span>' : ''}
      <span class="vase-qty-pill">${item.qty} шт</span>
      <div class="vase-svg-wrap ${wiltingClass}">
        ${getFlowerInVaseSvg(item.typeId, meta.vaseColor)}
      </div>
      <div class="vase-name">${meta.shortName}</div>
      <div class="vase-price">${price} ₽</div>
      <div class="freshness-bar-bg" title="Свежесть ${item.freshness}%">
        <div class="freshness-bar-fill ${freshClass}" style="width: ${item.freshness}%"></div>
      </div>
    </div>
  `;
}

function bindShopEvents(container, onHudUpdate, showToast) {
  const renderShopMain = () => renderShopScreen(onHudUpdate, showToast);

  document.getElementById('btn-light-candles')?.addEventListener('click', () => {
    gameState.candlesLit = true;
    gameState.mood = Math.min(100, gameState.mood + 6);
    playPaperSound();
    saveState();
    onHudUpdate();
    renderShopMain();
    showToast('🕯️ Свечи зажжены! В лавке снова уютно.');
  });

  document.getElementById('btn-open-shop-decor')?.addEventListener('click', () => {
    showShopDecorModal = true;
    renderShopMain();
  });

  document.getElementById('btn-close-shop-decor')?.addEventListener('click', () => {
    showShopDecorModal = false;
    renderShopMain();
  });

  document.getElementById('shop-decor-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'shop-decor-modal-overlay') {
      showShopDecorModal = false;
      renderShopMain();
    }
  });

  container.querySelectorAll('[data-toggle-shop-decor]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggleShopDecor;
      if (!Array.isArray(gameState.hiddenDecor)) gameState.hiddenDecor = [];
      if (gameState.hiddenDecor.includes(id)) {
        const currentLoc = SHOP_LOCATIONS.find((l) => l.id === gameState.shopLocationId) || SHOP_LOCATIONS[0];
        const ownedSet = new Set([...(gameState.decor || []), ...(gameState.decorInventory || [])]);
        const visibleCount = DECOR_CATALOG.filter(
          (d) =>
            d.place === 'Магазин' &&
            d.id !== 'fridge' &&
            ownedSet.has(d.id) &&
            !gameState.hiddenDecor.includes(d.id)
        ).length;
        if (visibleCount >= currentLoc.maxWallDecor) {
          showToast(`В локации «${currentLoc.name}» заняты все ${currentLoc.maxWallDecor} мест!`);
          return;
        }
        gameState.hiddenDecor = gameState.hiddenDecor.filter((x) => x !== id);
        showToast('✨ Украшение повешено в зале!');
      } else {
        gameState.hiddenDecor.push(id);
        showToast('📦 Украшение убрано на склад');
      }
      saveState();
      renderShopMain();
    });
  });

  container.querySelectorAll('[data-go-assemble]').forEach((btn) => {
    btn.addEventListener('click', () => {
      shopSubTab = 'bouquet';
      renderShopMain();
      showToast('💐 Собери букет для предзаказа на столе сборки!');
    });
  });

  container.querySelectorAll('[data-counter-sell-bouquet]').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleCounterBouquetSell(btn.dataset.counterSellBouquet, onHudUpdate, showToast, renderShopMain);
    });
  });

  document.getElementById('btn-sell-wanted-bouquet')?.addEventListener('click', (e) => {
    const bId = e.currentTarget.dataset.bouquetId;
    handleCounterBouquetSell(bId, onHudUpdate, showToast, renderShopMain);
  });

  container.querySelectorAll('[data-counter-open-maker]').forEach((btn) => {
    btn.addEventListener('click', () => {
      shopSubTab = 'bouquet';
      renderShopMain();
    });
  });

  document.getElementById('btn-call-due-preorder')?.addEventListener('click', (e) => {
    const pId = e.currentTarget.dataset.preorderId;
    const pre = gameState.preorders.find((p) => p.id === pId);
    if (!pre) return;
    pre.status = 'in_shop';
    saveState();
    playBellSound();
    summonPreorderClient(pre, onHudUpdate, showToast, renderShopMain);
  });

  container.querySelectorAll('[data-call-inshop]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pre = gameState.preorders.find((p) => p.id === btn.dataset.callInshop);
      if (!pre) return;
      if (isClientTalkingNow()) {
        showToast('Сначала заверши разговор с текущим покупателем!');
        return;
      }
      playBellSound();
      summonPreorderClient(pre, onHudUpdate, showToast, renderShopMain);
    });
  });

  document.getElementById('btn-call-client')?.addEventListener('click', () => {
    if (isShopClosedNow()) {
      showToast('🌙 Лавка закрыта — пора отдыхать!');
      return;
    }
    playBellSound();
    summonNextClient(onHudUpdate, showToast, renderShopMain);
  });

  document.getElementById('btn-retry-ai')?.addEventListener('click', () => {
    retryLastAiRequest(onHudUpdate, showToast, renderShopMain);
  });

  document.getElementById('btn-switch-offline-ai')?.addEventListener('click', () => {
    aiSettings.provider = 'offline';
    aiSettings.model = AI_PROVIDERS.offline.defaultModel;
    try {
      localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(aiSettings));
    } catch (e) {
      console.warn('Не удалось сохранить настройки ИИ:', e);
    }
    showToast('⚡ Включён встроенный умный бот!');
    retryLastAiRequest(onHudUpdate, showToast, renderShopMain);
  });

  const chatInput = document.getElementById('client-chat-input');
  document.getElementById('btn-send-chat')?.addEventListener('click', () => {
    const text = chatInput?.value.trim();
    if (text) sendPlayerMessage(text, null, onHudUpdate, showToast, renderShopMain);
  });

  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const text = chatInput.value.trim();
      if (text) sendPlayerMessage(text, null, onHudUpdate, showToast, renderShopMain);
    }
  });

  document.getElementById('btn-toggle-offer')?.addEventListener('click', () => {
    toggleOfferDrawer();
    renderShopMain();
  });

  document.getElementById('btn-toggle-reject')?.addEventListener('click', () => {
    toggleRejectPanel();
    renderShopMain();
  });

  document.getElementById('btn-close-reject-panel')?.addEventListener('click', () => {
    closeRejectPanel();
    renderShopMain();
  });

  container.querySelectorAll('[data-shop-reject-tpl]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const reason = btn.dataset.shopRejectTpl;
      sendPlayerRejection(reason, onHudUpdate, showToast, renderShopMain);
    });
  });

  document.getElementById('btn-send-custom-shop-reject')?.addEventListener('click', () => {
    const reason =
      document.getElementById('shop-reject-reason-input')?.value.trim() ||
      'К сожалению, не сможем выполнить этот заказ';
    sendPlayerRejection(reason, onHudUpdate, showToast, renderShopMain);
  });

  container.querySelectorAll('[data-offer-bouquet]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bId = btn.dataset.offerBouquet;
      const bouquet = gameState.readyBouquets.find((b) => b.id === bId);
      if (!bouquet) return;
      const priceInput = document.getElementById(`price-b-${bId}`);
      const customPrice = Math.max(50, Number(priceInput?.value) || bouquet.price);

      const offer = {
        kind: 'bouquet',
        id: bouquet.id,
        price: customPrice,
        summary: `Готовый букет (${bouquet.summary})`
      };
      const freshWord = getBouquetFreshnessWord(bouquet);
      const promptMsg = `[Предложение продавца]: Я предлагаю вам готовый букет (${bouquet.summary}, ${bouquet.stemsCount} шт., цветы ${freshWord}) за ${customPrice} ₽.`;
      toggleOfferDrawer();
      sendPlayerMessage(
        promptMsg,
        offer,
        onHudUpdate,
        showToast,
        renderShopMain,
        `Предложили букет за ${customPrice} ₽`
      );
    });
  });

  container.querySelectorAll('[data-offer-acc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const accId = btn.dataset.offerAcc;
      const acc = (gameState.accessoriesInventory || []).find((a) => a.id === accId && a.qty > 0);
      const meta = ACCESSORIES_CATALOG[accId];
      if (!acc || !meta) return;
      const priceInput = document.getElementById(`price-acc-${accId}`);
      const customPrice = Math.max(50, Number(priceInput?.value) || meta.price);

      const offer = {
        kind: 'accessory',
        id: meta.id,
        price: customPrice,
        summary: meta.name
      };
      const promptMsg = `[Предложение продавца]: Я предлагаю вам сопутствующий товар «${meta.name}» (${meta.category}, 1 шт.) за ${customPrice} ₽.`;
      toggleOfferDrawer();
      sendPlayerMessage(
        promptMsg,
        offer,
        onHudUpdate,
        showToast,
        renderShopMain,
        `Предложили ${meta.icon} ${meta.shortName} за ${customPrice} ₽`
      );
    });
  });

  container.querySelectorAll('[data-offer-vase]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.offerVase;
      const vase = gameState.inventory.find((v) => v.uid === uid);
      if (!vase) return;
      const meta = FLOWERS_CATALOG[vase.typeId];
      const priceInput = document.getElementById(`price-v-${uid}`);
      const customPrice = Math.max(30, Number(priceInput?.value) || getActualFlowerPrice(vase, meta));

      const offer = {
        kind: 'vase',
        id: vase.uid,
        price: customPrice,
        summary: `${meta.name} (1 шт.)`
      };
      const freshWord = getVaseFreshnessWord(vase.freshness);
      const promptMsg = `[Предложение продавца]: Я предлагаю вам цветок ${meta.name} (1 шт., ${freshWord}) за ${customPrice} ₽.`;
      toggleOfferDrawer();
      sendPlayerMessage(
        promptMsg,
        offer,
        onHudUpdate,
        showToast,
        renderShopMain,
        `Предложили ${meta.shortName} за ${customPrice} ₽`
      );
    });
  });

  container.querySelectorAll('[data-vase-uid]').forEach((slot) => {
    slot.addEventListener('click', () => {
      selectedVaseUid = slot.dataset.vaseUid;
      renderShopMain();
    });
  });

  document.getElementById('vase-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'vase-modal-overlay') {
      selectedVaseUid = null;
      renderShopMain();
    }
  });

  document.getElementById('btn-close-inspector')?.addEventListener('click', () => {
    selectedVaseUid = null;
    renderShopMain();
  });

  document.getElementById('btn-add-to-bouquet')?.addEventListener('click', () => {
    const added = addFlowerToDraftBouquet(selectedVaseUid, showToast);
    if (added) {
      if (!gameState.inventory.find((i) => i.uid === selectedVaseUid)) {
        selectedVaseUid = null;
      }
      renderShopMain();
    }
  });

  document.getElementById('btn-next-shift')?.addEventListener('click', () => {
    advanceShift();
    onHudUpdate();
    renderShopMain();
    checkPreorderArrival(onHudUpdate, showToast, renderShopMain);
    if (isShopClosedNow()) {
      showToast('🌙 Смена закончилась! Пора домой спать, иначе завтра будешь уставшим.');
    } else {
      showToast('Смена сменилась, время идёт вперёд');
    }
  });

  document.getElementById('btn-water-flower')?.addEventListener('click', () => {
    const item = gameState.inventory.find((i) => i.uid === selectedVaseUid);
    if (!item || item.wateredThisShift) return;
    item.freshness = Math.min(100, item.freshness + 8);
    item.wateredThisShift = true;
    saveState();
    renderShopMain();
    showToast('Вода в вазе освежена! (+8% свежести)');
  });

  document.getElementById('btn-discount-flower')?.addEventListener('click', () => {
    const item = gameState.inventory.find((i) => i.uid === selectedVaseUid);
    if (!item || item.discounted) return;
    item.discounted = true;
    saveState();
    renderShopMain();
    showToast('Установлена уценка -40%');
  });

  document.getElementById('btn-discard-flower')?.addEventListener('click', () => {
    gameState.inventory = gameState.inventory.filter((i) => i.uid !== selectedVaseUid);
    selectedVaseUid = null;
    gameState.mood = Math.min(100, gameState.mood + 3);
    saveState();
    onHudUpdate();
    renderShopMain();
    showToast('Увядшие цветы списаны, витрина стала чище');
  });
}

function scrollChatToBottom() {
  const box = document.getElementById('client-chat-box');
  if (box) box.scrollTop = box.scrollHeight;
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
```

## File: js/screens/storageScreen.js
```javascript

```

## File: js/план.txt
```
1. сделать чтоб ИИ всегда полностью отвечал, а то щас бывает не дописывает, по середине слова останавливается
```

## File: js/ai.js
```javascript
/**
 * js/ai.js
 * Главный фасад ИИ-модуля игры.
 * Аккумулирует и экспортирует весь функционал из подмодулей ai/
 */

// 1. Базовые сетевые вызовы ИИ, парсинг JSON и системные утилиты
export {
  callAI,
  testAiConnection,
  stripCodeFences,
  parseClientJson,
  formatApiError,
  fetchWithTimeout,
  sleep,
  isRudeText,
  formatMinutesAsTime,
  resolvePlayerGender,
  getBadgeRuleText,
  detectMentionedFlowers,
  pickRandom,
  pickUnused,
  generateProceduralNick
} from './ai/aiCore.js';

// 2. Генерация клиентов зала и системные промпты
export {
  generateRandomClient,
  generatePreorderClient,
  buildClientSystemPrompt
} from './ai/clientGenerator.js';

// 3. Соцсеть InstaFlower (посты, комменты) и переписка Direct (предзаказы, торг, фото)
export {
  evaluateInstaPost,
  generateInstaCommentReply,
  generateDirectMessage,
  generateDirectRejectionReply,
  generateDirectFollowUp
} from './ai/socialAi.js';

// 4. Вакансии, анкеты соискателей и живые собеседования в Direct
export {
  CANDIDATE_PROFILES,
  generateJobCandidateDm,
  generateCandidateInterviewReply,
  generateCandidateHireReaction
} from './ai/jobsAi.js';
```

## File: js/config.js
```javascript
export const STORAGE_KEY = 'fleur_atelier_save_v1';
export const AI_SETTINGS_KEY = 'fleur_atelier_ai_settings_v1';

export const WEATHERS = [
  { id: 'sunny', label: 'Солнечно', icon: '☀️' },
  { id: 'rainy', label: 'Дождь', icon: '🌧️' },
  { id: 'frost', label: 'Мороз', icon: '❄️' }
];

export const TIME_PERIODS = ['Утро', 'День', 'Вечер'];

export const HOLIDAYS = [
  { day: 7, name: 'День Влюблённых (14 Февраля)', demandMult: 3, priceMult: 2 },
  { day: 14, name: 'Праздник Весны (8 Марта)', demandMult: 3, priceMult: 2 }
];

export const FLOWERS_CATALOG = {
  rose_red: {
    id: 'rose_red',
    name: 'Красная роза',
    shortName: 'Роза красн.',
    color: 'красный',
    price: 220,
    wholesalePrice: 110,
    decayPerShift: 8,
    vaseColor: '#EBD9CE'
  },
  rose_white: {
    id: 'rose_white',
    name: 'Белая роза',
    shortName: 'Роза белая',
    color: 'белый',
    price: 230,
    wholesalePrice: 115,
    decayPerShift: 8,
    vaseColor: '#EAE6DF'
  },
  rose_pink: {
    id: 'rose_pink',
    name: 'Розовая роза',
    shortName: 'Роза розов.',
    color: 'розовый',
    price: 225,
    wholesalePrice: 110,
    decayPerShift: 8,
    vaseColor: '#F3E1E3'
  },
  peony_pink: {
    id: 'peony_pink',
    name: 'Розовый пион',
    shortName: 'Пион розов.',
    color: 'розовый',
    price: 320,
    wholesalePrice: 165,
    decayPerShift: 10,
    vaseColor: '#DCE6DB'
  },
  peony_coral: {
    id: 'peony_coral',
    name: 'Коралловый пион',
    shortName: 'Пион корал.',
    color: 'коралловый',
    price: 340,
    wholesalePrice: 175,
    decayPerShift: 10,
    vaseColor: '#F5E2DA'
  },
  tulip_yellow: {
    id: 'tulip_yellow',
    name: 'Жёлтый тюльпан',
    shortName: 'Тюльп. жёлт.',
    color: 'жёлтый',
    price: 160,
    wholesalePrice: 75,
    decayPerShift: 7,
    vaseColor: '#E9DFCF'
  },
  tulip_red: {
    id: 'tulip_red',
    name: 'Красный тюльпан',
    shortName: 'Тюльп. крас.',
    color: 'красный',
    price: 165,
    wholesalePrice: 80,
    decayPerShift: 7,
    vaseColor: '#EFE0DC'
  },
  tulip_purple: {
    id: 'tulip_purple',
    name: 'Сиреневый тюльпан',
    shortName: 'Тюльп. сир.',
    color: 'сиреневый',
    price: 175,
    wholesalePrice: 85,
    decayPerShift: 7,
    vaseColor: '#E5DFEE'
  },
  hydrangea_blue: {
    id: 'hydrangea_blue',
    name: 'Голубая гортензия',
    shortName: 'Гортензия',
    color: 'голубой',
    price: 360,
    wholesalePrice: 185,
    decayPerShift: 9,
    vaseColor: '#DCE7EF'
  },
  sunflower: {
    id: 'sunflower',
    name: 'Подсолнух',
    shortName: 'Подсолнух',
    color: 'жёлтый',
    price: 210,
    wholesalePrice: 100,
    decayPerShift: 6,
    vaseColor: '#EDE6D1'
  },
  chamomile_white: {
    id: 'chamomile_white',
    name: 'Ромашка',
    shortName: 'Ромашка',
    color: 'белый',
    price: 120,
    wholesalePrice: 55,
    decayPerShift: 6,
    vaseColor: '#F3DFDC'
  },
  lavender_purple: {
    id: 'lavender_purple',
    name: 'Лаванда',
    shortName: 'Лаванда',
    color: 'сиреневый',
    price: 190,
    wholesalePrice: 90,
    decayPerShift: 3,
    vaseColor: '#DFD9EA'
  },
  lily_white: {
    id: 'lily_white',
    name: 'Белая лилия',
    shortName: 'Лилия',
    color: 'белый',
    price: 280,
    wholesalePrice: 145,
    decayPerShift: 8,
    vaseColor: '#D6E4EA'
  },
  iris_blue: {
    id: 'iris_blue',
    name: 'Синий ирис',
    shortName: 'Ирис',
    color: 'синий',
    price: 185,
    wholesalePrice: 90,
    decayPerShift: 7,
    vaseColor: '#DFE4EE'
  },
  chrysanthemum_white: {
    id: 'chrysanthemum_white',
    name: 'Белая хризантема',
    shortName: 'Хризантема',
    color: 'белый',
    price: 180,
    wholesalePrice: 85,
    decayPerShift: 5,
    vaseColor: '#EBE6DF'
  },
  carnation_red: {
    id: 'carnation_red',
    name: 'Красная гвоздика',
    shortName: 'Гвоздика',
    color: 'красный',
    price: 140,
    wholesalePrice: 65,
    decayPerShift: 5,
    vaseColor: '#EADAD9'
  },
  gypsophila: {
    id: 'gypsophila',
    name: 'Гипсофила',
    shortName: 'Гипсофила',
    color: 'белый',
    price: 140,
    wholesalePrice: 65,
    decayPerShift: 4,
    vaseColor: '#E8EAE6'
  },
  eucalyptus: {
    id: 'eucalyptus',
    name: 'Веточка эвкалипта',
    shortName: 'Эвкалипт',
    color: 'зелёный',
    price: 130,
    wholesalePrice: 60,
    decayPerShift: 3,
    vaseColor: '#DCE5DD'
  }
};

export const AI_PROVIDERS = {
  offline: {
    id: 'offline',
    name: '⚡ Встроенный ИИ-движок (Без ключа, мгновенно)',
    needsKey: false,
    defaultBaseUrl: '',
    defaultModel: 'local-florist-v1'
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral AI (Бесплатно без карты, быстрый)',
    needsKey: true,
    defaultBaseUrl: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-small-latest'
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter (Бесплатные модели)',
    needsKey: true,
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'baidu/ernie-5.5-flash-preview:free'
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini (Бесплатно, без карты)',
    needsKey: true,
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-2.0-flash'
  },
  groq: {
    id: 'groq',
    name: 'Groq (Бесплатно, без карты)',
    needsKey: true,
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile'
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek API',
    needsKey: true,
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat'
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (ChatGPT API)',
    needsKey: true,
    defaultBaseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini'
  },
  claude: {
    id: 'claude',
    name: 'Anthropic Claude API',
    needsKey: true,
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-5-haiku-latest'
  },
  custom: {
    id: 'custom',
    name: 'Свой OpenAI-совместимый API',
    needsKey: true,
    defaultBaseUrl: '',
    defaultModel: ''
  }
};

export const WRAPPINGS = [
  { id: 'none', name: 'Без упаковки', type: 'none', price: 0, color: 'transparent', accent: 'transparent' },
  { id: 'clear_film', name: 'Прозрачная плёнка', type: 'clear', price: 50, color: 'rgba(255,255,255,0.35)', accent: 'rgba(205,228,238,0.85)' },
  { id: 'craft', name: 'Крафт-бумага', type: 'paper', price: 60, color: '#D9B99B', accent: '#C49F7E' },
  { id: 'newspaper', name: 'Винтажная газета', type: 'newspaper', price: 75, color: '#EDE4D3', accent: '#D5C7B2' },
  { id: 'pink_film', name: 'Пудровая матовая', type: 'paper', price: 90, color: '#F5CBD0', accent: '#E8A9B2' },
  { id: 'sage_paper', name: 'Шалфейная бумага', type: 'paper', price: 100, color: '#C6D8C5', accent: '#A6BEA5' },
  { id: 'cream_paper', name: 'Молочный шёлк', type: 'paper', price: 95, color: '#F7F0E4', accent: '#E4D8C3' },
  { id: 'sky_film', name: 'Небесно-голубая', type: 'paper', price: 95, color: '#C8DFEE', accent: '#A7C6DC' },
  { id: 'lavender_film', name: 'Лавандовая калька', type: 'paper', price: 105, color: '#DFD2EB', accent: '#C5B3D6' },
  { id: 'peach_paper', name: 'Персиковая калька', type: 'paper', price: 100, color: '#F6D3BA', accent: '#E5B99A' },
  { id: 'black_matte', name: 'Чёрная премиум', type: 'paper', price: 130, color: '#454144', accent: '#2E2B2D' },
  { id: 'gold_mesh', name: 'Золотая сетка', type: 'mesh', price: 120, color: '#F2DDA8', accent: '#DFAB4E' }
];

export const RIBBONS = [
  { id: 'none', name: 'Без ленты', price: 0, color: 'transparent' },
  { id: 'twine', name: 'Бечёвка', price: 20, color: '#A88C72' },
  { id: 'cream', name: 'Кремовая', price: 40, color: '#EFE3CF' },
  { id: 'satin_rose', name: 'Розовая', price: 45, color: '#E07A86' },
  { id: 'crimson', name: 'Алая атласная', price: 50, color: '#C94C58' },
  { id: 'burgundy', name: 'Бордовый бархат', price: 65, color: '#8A3346' },
  { id: 'sage', name: 'Мятно-шалфейная', price: 45, color: '#7D9E7F' },
  { id: 'sky', name: 'Небесная', price: 45, color: '#7EA8C9' },
  { id: 'lavender', name: 'Лавандовая', price: 50, color: '#9E85BD' },
  { id: 'sunny', name: 'Солнечная', price: 45, color: '#E8BC4A' },
  { id: 'choco', name: 'Шоколадная', price: 50, color: '#6E4E3E' },
  { id: 'black', name: 'Чёрная атласная', price: 55, color: '#332E30' },
  { id: 'gold', name: 'Золотая', price: 60, color: '#DFAB4E' }
];

export const ACCESSORIES_CATALOG = {
  balloon_heart: {
    id: 'balloon_heart',
    name: 'Гелиевый шар «Сердце»',
    shortName: 'Шар «Сердце»',
    icon: '🎈',
    category: 'шарик',
    price: 290,
    wholesalePrice: 140
  },
  balloon_star: {
    id: 'balloon_star',
    name: 'Гелиевый шар «Звезда»',
    shortName: 'Шар «Звезда»',
    icon: '🌟',
    category: 'шарик',
    price: 270,
    wholesalePrice: 130
  },
  plush_bear: {
    id: 'plush_bear',
    name: 'Плюшевый мишка',
    shortName: 'Мишка',
    icon: '🧸',
    category: 'игрушка',
    price: 850,
    wholesalePrice: 420
  },
  plush_bunny: {
    id: 'plush_bunny',
    name: 'Плюшевый зайка',
    shortName: 'Зайка',
    icon: '🐰',
    category: 'игрушка',
    price: 790,
    wholesalePrice: 390
  },
  choco_box: {
    id: 'choco_box',
    name: 'Коробка конфет ассорти',
    shortName: 'Конфеты',
    icon: '🍫',
    category: 'конфеты',
    price: 580,
    wholesalePrice: 280
  },
  postcard: {
    id: 'postcard',
    name: 'Открытка с пожеланием',
    shortName: 'Открытка',
    icon: '💌',
    category: 'открытка',
    price: 150,
    wholesalePrice: 60
  }
};

export const INSTA_HASHTAGS = [
  '#флористика',
  '#авторскийбукет',
  '#уютнаялавка',
  '#цветыдня',
  '#розы',
  '#подароксдушой',
  '#скидки'
];

export const DECOR_CATALOG = [
  {
    id: 'fridge',
    name: 'Холодильная витрина',
    place: 'Магазин',
    category: 'Обычный',
    icon: '❄️',
    price: 1900,
    effectText: 'Цветы вянут на 35% медленнее!',
    moodBonus: 8
  },
  {
    id: 'neon_sign',
    name: 'Тёплая вывеска «Fleur»',
    place: 'Магазин',
    category: 'Обычный',
    icon: '✨',
    price: 750,
    effectText: '+6% к атмосфере и красивее фото витрины',
    moodBonus: 6
  },
  {
    id: 'vintage_wallpaper',
    name: 'Винтажные обои',
    place: 'Магазин',
    category: 'Обычный',
    icon: '🖼️',
    price: 650,
    effectText: '+5% к уюту магазина',
    moodBonus: 5
  },
  {
    id: 'shop_arch',
    name: 'Цветочная арка с плющом',
    place: 'Магазин',
    category: 'Обычный',
    icon: '🌿',
    price: 890,
    effectText: 'Зелёные ветки над прилавком (+6% атмосферы)',
    moodBonus: 6
  },
  {
    id: 'shop_mirror',
    name: 'Винтажное зеркало',
    place: 'Магазин',
    category: 'Обычный',
    icon: '💎',
    price: 480,
    effectText: 'Зрительно расширяет зал (+4% атмосферы)',
    moodBonus: 4
  },
  {
    id: 'shop_chalkboard',
    name: 'Меловая доска «Букет дня»',
    place: 'Магазин',
    category: 'Обычный',
    icon: '📋',
    price: 420,
    effectText: 'Стильная табличка у витрины (+4% атмосферы)',
    moodBonus: 4
  },
  {
    id: 'xmas_tree_shop',
    name: 'Новогодняя ёлка в зал',
    place: 'Магазин',
    category: 'Праздник',
    icon: '🎄',
    price: 950,
    effectText: 'Нарядная ёлочка с шарами (+7% атмосферы)',
    moodBonus: 7
  },
  {
    id: 'wreath_shop',
    name: 'Праздничный венок на стену',
    place: 'Магазин',
    category: 'Сезон',
    icon: '🎀',
    price: 450,
    effectText: 'Венок с лентами и шишками (+4% атмосферы)',
    moodBonus: 4
  },
  {
    id: 'hearts_garland_shop',
    name: 'Гирлянда из сердечек',
    place: 'Магазин',
    category: 'Праздник',
    icon: '💕',
    price: 390,
    effectText: 'Романтичное настроение ко Дню Влюблённых (+5%)',
    moodBonus: 5
  },
  {
    id: 'pumpkins_shop',
    name: 'Осенние тыквы на полку',
    place: 'Магазин',
    category: 'Сезон',
    icon: '🎃',
    price: 460,
    effectText: 'Тёплый осенний акцент в зале (+5% атмосферы)',
    moodBonus: 5
  },
  {
    id: 'cozy_lamp',
    name: 'Тёплый торшер',
    place: 'Квартира',
    category: 'Обычный',
    icon: '🛋️',
    price: 550,
    effectText: 'Мягкое освещение дома (+4% к атмосфере)',
    moodBonus: 4
  },
  {
    id: 'cat_bed',
    name: 'Лежанка с игрушкой',
    place: 'Квартира',
    category: 'Обычный',
    icon: '🧶',
    price: 600,
    effectText: 'Любимое место для кошки (+5% к атмосфере)',
    moodBonus: 5
  },
  {
    id: 'cat_ball',
    name: 'Мячик для кошки',
    place: 'Квартира',
    category: 'Обычный',
    icon: '🎾',
    price: 320,
    effectText: 'Кошка весело гоняет мячик по комнате (+4% атмосферы)',
    moodBonus: 4
  },
  {
    id: 'bookshelf',
    name: 'Полка с книгами по ботанике',
    place: 'Квартира',
    category: 'Обычный',
    icon: '📚',
    price: 820,
    effectText: 'Вдохновение и +5% к атмосфере',
    moodBonus: 5
  },
  {
    id: 'home_sofa',
    name: 'Пастельный диванчик',
    place: 'Квартира',
    category: 'Обычный',
    icon: '🪑',
    price: 1100,
    effectText: 'Уютная мебель для отдыха дома (+7% атмосферы)',
    moodBonus: 7
  },
  {
    id: 'home_rug',
    name: 'Мягкий круглый коврик',
    place: 'Квартира',
    category: 'Обычный',
    icon: '⭕',
    price: 450,
    effectText: 'Тёплый коврик под лапки Пискли (+4% атмосферы)',
    moodBonus: 4
  },
  {
    id: 'home_plant',
    name: 'Фикус в кашпо',
    place: 'Квартира',
    category: 'Обычный',
    icon: '🌱',
    price: 520,
    effectText: 'Живая зелень дома (+5% атмосферы)',
    moodBonus: 5
  },
  {
    id: 'home_curtains',
    name: 'Кружевные шторы на окно',
    place: 'Квартира',
    category: 'Обычный',
    icon: '🎐',
    price: 490,
    effectText: 'Воздушные занавески у окна (+4% атмосферы)',
    moodBonus: 4
  },
  {
    id: 'xmas_tree_home',
    name: 'Домашняя ёлка с огоньками',
    place: 'Квартира',
    category: 'Праздник',
    icon: '🎄',
    price: 920,
    effectText: 'Волшебный новогодний уют дома (+7% атмосферы)',
    moodBonus: 7
  },
  {
    id: 'fairy_lights_home',
    name: 'Гирлянда-штора дома',
    place: 'Квартира',
    category: 'Праздник',
    icon: '🌟',
    price: 440,
    effectText: 'Тёплые огоньки под потолком (+5% атмосферы)',
    moodBonus: 5
  },
  {
    id: 'pumpkins_home',
    name: 'Осенние тыквы и свечи',
    place: 'Квартира',
    category: 'Сезон',
    icon: '🎃',
    price: 410,
    effectText: 'Осенний декор для уюта дома (+4% атмосферы)',
    moodBonus: 4
  },
  {
    id: 'heart_pillow_home',
    name: 'Декор из сердечек',
    place: 'Квартира',
    category: 'Праздник',
    icon: '💖',
    price: 360,
    effectText: 'Романтичное украшение комнаты (+4% атмосферы)',
    moodBonus: 4
  },
  {
    id: 'vintage_vase',
    name: 'Антикварная фарфоровая ваза',
    place: 'Магазин',
    category: 'Антиквариат',
    isRare: true,
    icon: '🏺',
    price: 1350,
    effectText: 'Редкий фарфор ручной росписи (+7% атмосферы)',
    moodBonus: 7
  },
  {
    id: 'retro_gramophone',
    name: 'Ретро-граммофон',
    place: 'Магазин',
    category: 'Антиквариат',
    isRare: true,
    icon: '📻',
    price: 2200,
    effectText: 'Винтажный шарм в зале (+9% атмосферы)',
    moodBonus: 9
  },
  {
    id: 'gold_frame_art',
    name: 'Картина в золотой раме',
    place: 'Магазин',
    category: 'Антиквариат',
    isRare: true,
    icon: '🖼️',
    price: 1650,
    effectText: 'Ботанический натюрморт XIX века (+7% атмосферы)',
    moodBonus: 7
  },
  {
    id: 'marble_pedestal',
    name: 'Мраморная тумба с кашпо',
    place: 'Магазин',
    category: 'Антиквариат',
    isRare: true,
    icon: '🏛️',
    price: 1900,
    effectText: 'Роскошная подставка под букеты (+8% атмосферы)',
    moodBonus: 8
  },
  {
    id: 'designer_lamp',
    name: 'Дизайнерский витражный торшер',
    place: 'Квартира',
    category: 'Антиквариат',
    isRare: true,
    icon: '🪔',
    price: 1600,
    effectText: 'Тёплое мозаичное свечение дома (+7% атмосферы)',
    moodBonus: 7
  },
  {
    id: 'cat_tower',
    name: 'Большой кошачий городок',
    place: 'Квартира',
    category: 'Антиквариат',
    isRare: true,
    icon: '🏰',
    price: 2400,
    effectText: 'Многоуровневый комплекс для Пискли (+9% атмосферы)',
    moodBonus: 9
  },
  {
    id: 'antique_dresser',
    name: 'Старинное трюмо с зеркалом',
    place: 'Квартира',
    category: 'Антиквариат',
    isRare: true,
    icon: '🪞',
    price: 1850,
    effectText: 'Уютная винтажная мебель для комнаты (+7% атмосферы)',
    moodBonus: 7
  },
  {
    id: 'botanical_vinyl',
    name: 'Винтажный проигрыватель дома',
    place: 'Квартира',
    category: 'Антиквариат',
    isRare: true,
    icon: '💿',
    price: 1500,
    effectText: 'Тёплый винил вечерами (+6% атмосферы)',
    moodBonus: 6
  }
];

export const SHOP_LOCATIONS = [
  {
    id: 'shop_basement',
    name: 'Уютный подвальчик',
    price: 0,
    maxVases: 6,
    maxWallDecor: 2,
    windowView: 'Тротуар тихой улочки',
    desc: 'Небольшой камерный зал: вид на тротуар, до 2 настенных украшений и стартовая витрина.'
  },
  {
    id: 'shop_pavilion',
    name: 'Светлый павильон в сквере',
    price: 12000,
    maxVases: 9,
    maxWallDecor: 5,
    windowView: 'Цветущий парк и фонтан',
    desc: 'Панорамные окна в пол, вид на парк и фонтан, полка под подарки, 9 ваз и до 5 украшений.'
  },
  {
    id: 'shop_boutique',
    name: 'Бутик на главной улице',
    price: 35000,
    maxVases: 12,
    maxWallDecor: 12,
    windowView: 'Исторический проспект',
    desc: 'Старинный кирпич, лепнина, золотые рейлы, вид на проспект, 12 ваз и место для всех коллекций.'
  }
];

export const HOME_LOCATIONS = [
  {
    id: 'home_studio',
    name: 'Крошечная студия',
    price: 0,
    desc: 'Уютная стартовая комната с диванчиком, окном во двор и местом для Пискли.'
  },
  {
    id: 'home_balcony',
    name: 'Двушка с балконом',
    price: 15000,
    desc: 'Просторные комнаты и панорамный балкон с растениями — Пискля гуляет по двум зонам!'
  },
  {
    id: 'home_loft',
    name: 'Мансарда с камином',
    price: 45000,
    desc: 'Светлая деревянная мансарда со звёздным небом, живым каменным камином и простором.'
  }
];

export const JOB_ROLES = [
  { id: 'assistant', name: 'Флорист-помощник', icon: '💐', baseSalary: 1200 },
  { id: 'courier', name: 'Курьер', icon: '🚗', baseSalary: 1400 }
];

export const JOB_SCHEDULES = [
  { id: 'full', label: 'Полный день (09:00–21:00)' },
  { id: 'morning', label: 'Утренние смены (09:00–15:00)' },
  { id: 'flex', label: 'Гибкий график / выходные' }
];

/** Возвращает объект Date для текущего игрового дня от выбранной даты старта */
export function getGameDateObj(startDateStr, dayOffset = 0) {
  const parts = String(startDateStr || '2026-02-08').split('-').map(Number);
  const y = parts[0] || 2026;
  const m = (parts[1] || 2) - 1;
  const d = parts[2] || 8;
  return new Date(y, m, d + dayOffset);
}

/**
 * Сезон за окном:
 * - 1 марта .. 14 апреля: ранняя весна (снег + проглядывает трава)
 * - 15 апреля .. 14 сентября: тепло (солнце и зелёная трава)
 * - 15 сентября .. 4 ноября: осень (оранжевая листва и листья)
 * - 5 ноября .. конец февраля: зима (снег)
 */
export function getSeasonInfo(dateObj) {
  const md = (dateObj.getMonth() + 1) * 100 + dateObj.getDate();

  if (md >= 301 && md <= 414) {
    return { id: 'early-spring', label: 'Ранняя весна' };
  }
  if (md >= 415 && md <= 914) {
    return { id: 'summer', label: 'Тепло' };
  }
  if (md >= 915 && md <= 1104) {
    return { id: 'autumn', label: 'Осень' };
  }
  return { id: 'winter', label: 'Зима' };
}

/** Погода с учётом текущего времени года */
export function getWeatherForSeason(seasonId) {
  const r = Math.random();
  if (seasonId === 'winter') return r < 0.65 ? 'frost' : 'sunny';
  if (seasonId === 'early-spring') return r < 0.45 ? 'sunny' : r < 0.75 ? 'rainy' : 'frost';
  if (seasonId === 'autumn') return r < 0.55 ? 'rainy' : 'sunny';
  return r < 0.72 ? 'sunny' : 'rainy';
}

/** Проверка праздника по реальному числу календаря */
export function getHolidayForDate(dateObj) {
  const m = dateObj.getMonth() + 1;
  const d = dateObj.getDate();
  if (m === 1 && d <= 7) return { name: 'Новогодние каникулы 🎄', demandMult: 2, priceMult: 1.5 };
  if (m === 2 && d === 14) return { name: 'День Влюблённых (14 Февраля) ❤️', demandMult: 3, priceMult: 2 };
  if (m === 2 && d === 23) return { name: 'День защитника Отечества (23 Февраля)', demandMult: 2, priceMult: 1.5 };
  if (m === 3 && d === 8) return { name: 'Международный женский день (8 Марта) 🌷', demandMult: 3, priceMult: 2 };
  if (m === 5 && d === 1) return { name: 'Праздник Весны (1 Мая)', demandMult: 2, priceMult: 1.3 };
  if (m === 5 && d === 9) return { name: 'День Победы (9 Мая)', demandMult: 2.5, priceMult: 1.5 };
  if (m === 9 && d === 1) return { name: 'День Знаний (1 Сентября) 📚', demandMult: 3, priceMult: 2 };
  if (m === 10 && d === 5) return { name: 'День Учителя', demandMult: 2.5, priceMult: 1.6 };
  if (m === 11 && d >= 24 && d <= 30 && dateObj.getDay() === 0) return { name: 'День Матери 💐', demandMult: 2.5, priceMult: 1.6 };
  if (m === 12 && d === 31) return { name: 'Канун Нового Года ✨', demandMult: 2.5, priceMult: 1.8 };
  return null;
}
```

## File: js/main.js
```javascript
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
```

## File: js/sound.js
```javascript
import { gameState } from './state.js';

let audioCtx = null;
let rainSource = null;
let musicTimer = null;
let currentAmbient = 'none';

function getCtx() {
  if (!gameState.soundEnabled) return null;
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioCtx = new AudioCtx();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/** Мягкий клик для любых кнопок и вкладок */
export function playClickSound() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.04);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {}
}

/** Нежный звон дверного колокольчика */
export function playBellSound() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [880, 1174].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.22, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.52);
    });
  } catch (e) {}
}

/** Щелчок затвора камеры */
export function playShutterSound() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.09);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  } catch (e) {}
}

/** Шелест бумаги и стеблей */
export function playPaperSound() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const bufferSize = Math.floor(ctx.sampleRate * 0.11);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1700;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch (e) {}
}

/** Звон монеток при продаже */
export function playCoinSound() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [987, 1318, 1567].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0.22, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.32);
    });
  } catch (e) {}
}

/** Настоящее мягкое кошачье мурлыканье (вдох-выдох с вибрацией 26 Гц) */
export function playPurrSound() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    [0, 0.72].forEach((offset) => {
      const carrier = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const mainGain = ctx.createGain();

      carrier.type = 'sawtooth';
      carrier.frequency.setValueAtTime(64, now + offset);

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(26, now + offset);
      lfoGain.gain.setValueAtTime(0.18, now + offset);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now + offset);

      mainGain.gain.setValueAtTime(0.001, now + offset);
      mainGain.gain.linearRampToValueAtTime(0.32, now + offset + 0.18);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.62);

      lfo.connect(lfoGain);
      lfoGain.connect(mainGain.gain);
      carrier.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      carrier.start(now + offset);
      lfo.start(now + offset);
      carrier.stop(now + offset + 0.65);
      lfo.stop(now + offset + 0.65);
    });
  } catch (e) {}
}

/** Остановка всех фоновых звуков */
export function stopAmbient() {
  if (rainSource) {
    try { rainSource.stop(); } catch (e) {}
    rainSource = null;
  }
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
  currentAmbient = 'none';
}

/** Запуск выбранного фонового режима: 'none' | 'rain' | 'music' */
export function setAmbientMode(mode) {
  stopAmbient();
  if (!gameState.soundEnabled || mode === 'none') {
    return;
  }

  const ctx = getCtx();
  if (!ctx) return;
  currentAmbient = mode;

  if (mode === 'rain') {
    startRainLoop(ctx);
  } else if (mode === 'music') {
    startCozyMusicLoop(ctx);
  }
}

function startRainLoop(ctx) {
  try {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.03 * white) / 1.03;
      lastOut = data[i];
    }

    rainSource = ctx.createBufferSource();
    rainSource.buffer = buffer;
    rainSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 720;

    const gain = ctx.createGain();
    gain.gain.value = 0.16;

    rainSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    rainSource.start();
  } catch (e) {}
}

function startCozyMusicLoop(ctx) {
  // Тёплые пастельные аккорды (Cmaj7 -> Am7 -> Fmaj7 -> G6)
  const chords = [
    [261.63, 329.63, 392.0, 493.88],
    [220.0, 261.63, 329.63, 392.0],
    [174.61, 220.0, 261.63, 329.63],
    [196.0, 246.94, 293.66, 329.63]
  ];
  let step = 0;

  const playStep = () => {
    if (!gameState.soundEnabled || currentAmbient !== 'music') {
      stopAmbient();
      return;
    }
    const chordIdx = Math.floor(step / 4) % chords.length;
    const noteIdx = step % 4;
    const freq = chords[chordIdx][noteIdx];

    playSoftPianoNote(ctx, freq, 1.8, 0.09);
    if (noteIdx === 0) {
      playSoftPianoNote(ctx, chords[chordIdx][0] / 2, 2.8, 0.07);
    }
    step += 1;
  };

  playStep();
  musicTimer = setInterval(playStep, 750);
}

function playSoftPianoNote(ctx, freq, duration, volume) {
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  } catch (e) {}
}
```

## File: js/state.js
```javascript
import {
  STORAGE_KEY,
  AI_SETTINGS_KEY,
  FLOWERS_CATALOG,
  DECOR_CATALOG,
  getGameDateObj,
  getSeasonInfo,
  getWeatherForSeason
} from './config.js';

export function createInitialInventory() {
  return [
    { uid: 'vase_1', typeId: 'rose_red', qty: 12, freshness: 95, discounted: false, wateredThisShift: false },
    { uid: 'vase_2', typeId: 'peony_pink', qty: 8, freshness: 88, discounted: false, wateredThisShift: false },
    { uid: 'vase_3', typeId: 'tulip_yellow', qty: 10, freshness: 72, discounted: false, wateredThisShift: false },
    { uid: 'vase_4', typeId: 'chamomile_white', qty: 15, freshness: 52, discounted: false, wateredThisShift: false },
    { uid: 'vase_5', typeId: 'lavender_purple', qty: 9, freshness: 98, discounted: false, wateredThisShift: false },
    { uid: 'vase_6', typeId: 'lily_white', qty: 6, freshness: 85, discounted: false, wateredThisShift: false },
    { uid: 'vase_7', typeId: 'gypsophila', qty: 10, freshness: 94, discounted: false, wateredThisShift: false },
    { uid: 'vase_8', typeId: 'eucalyptus', qty: 10, freshness: 96, discounted: false, wateredThisShift: false }
  ];
}

export function createInitialState() {
  const startDate = '2026-02-08';
  const season = getSeasonInfo(getGameDateObj(startDate, 0));

  return {
    isSetupDone: false,
    shopName: 'Fleur Atelier',
    instaHandle: '@fleur_atelier',
    playerBadgeName: '',
    playerGender: 'auto',
    startDate,
    openHour: 9,
    closeHour: 21,
    money: 3500,
    day: 1,
    timeIndex: 0,
    timeMinutes: 9 * 60,
    shownCloseHint: false,
    weather: getWeatherForSeason(season.id),
    followers: 0,
    mood: 85,
    weeklyRent: 1800,
    daysUntilRent: 7,
    hasFridge: false,
    soundEnabled: true,
    ambientMode: 'none',
    totalEarned: 0,
    totalSpent: 0,
    bouquetsSold: 0,
    inventory: createInitialInventory(),
    accessoriesInventory: [],
    readyBouquets: [],
    savedPhotos: [],
    currentBouquet: {
      stems: [],
      wrappingId: 'craft',
      ribbonId: 'satin_rose'
    },
    instaPosts: [],
    activePromo: null,
    directMessages: [],
    preorders: [],
    jobPostings: [],
    employees: [],
    lastAutoDmKey: '',
    wholesaleDay: 0,
    wholesaleDeals: [],
    energy: 100,
    petName: 'Пискля',
    playerBadgeGender: 'auto',
    petMood: 80,
    petFedToday: false,
    powerOutage: false,
    candlesLit: false,
    rentWarning: false,
    decor: [],
    decorInventory: [],
    hiddenDecor: [],
    shopLocationId: 'shop_basement',
    homeLocationId: 'home_studio',
    ownedLocations: ['shop_basement', 'home_studio'],
    rareShopDay: 0,
    rareShopIds: []
  };
}

export function createInitialAiSettings() {
  return {
    provider: 'openrouter',
    apiKey: '',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'baidu/ernie-5.5-flash-preview:free'
  };
}

export let gameState = loadState();
export let aiSettings = loadAiSettings();

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    const state = { ...createInitialState(), ...parsed };

    if (!Array.isArray(state.inventory) || state.inventory.length === 0) {
      state.inventory = createInitialInventory();
    }
    if (!Array.isArray(state.accessoriesInventory)) state.accessoriesInventory = [];
    if (!Array.isArray(state.readyBouquets)) state.readyBouquets = [];
    if (!Array.isArray(state.savedPhotos)) state.savedPhotos = [];
    if (!Array.isArray(state.instaPosts)) state.instaPosts = [];
    if (!state.activePromo || typeof state.activePromo !== 'object') state.activePromo = null;
    if (!Array.isArray(state.directMessages)) state.directMessages = [];
    if (!Array.isArray(state.preorders)) state.preorders = [];
    if (!Array.isArray(state.jobPostings)) state.jobPostings = [];
    if (!Array.isArray(state.employees)) state.employees = [];
    if (typeof state.lastAutoDmKey !== 'string') state.lastAutoDmKey = '';
    state.directMessages = state.directMessages.map((dm) => ({
      read: Boolean(dm.replyText || dm.rejected || (dm.order && dm.order.done)),
      thread: Array.isArray(dm.thread) ? dm.thread : [],
      blockedByPlayer: Boolean(dm.blockedByPlayer),
      blockedByClient: Boolean(dm.blockedByClient),
      jobApplication: dm.jobApplication || null,
      ...dm
    }));
    if (!Array.isArray(state.wholesaleDeals)) state.wholesaleDeals = [];
    if (!Array.isArray(state.decor)) state.decor = [];
    if (!Array.isArray(state.decorInventory)) state.decorInventory = [];
    state.decor = Array.from(new Set([...state.decor, ...state.decorInventory]));
    state.decorInventory = [...state.decor];
    if (!Array.isArray(state.hiddenDecor)) state.hiddenDecor = [];
    if (!state.shopLocationId) state.shopLocationId = 'shop_basement';
    if (!state.homeLocationId) state.homeLocationId = 'home_studio';
    if (!Array.isArray(state.ownedLocations)) state.ownedLocations = ['shop_basement', 'home_studio'];
    if (!state.ownedLocations.includes('shop_basement')) state.ownedLocations.push('shop_basement');
    if (!state.ownedLocations.includes('home_studio')) state.ownedLocations.push('home_studio');
    if (typeof state.rareShopDay !== 'number') state.rareShopDay = 0;
    if (!Array.isArray(state.rareShopIds)) state.rareShopIds = [];

    if (!state.currentBouquet || !Array.isArray(state.currentBouquet.stems)) {
      state.currentBouquet = { stems: [], wrappingId: 'craft', ribbonId: 'satin_rose' };
    }
    if (typeof state.timeMinutes !== 'number') {
      state.timeMinutes = (state.openHour || 9) * 60;
    }
    if (typeof state.shownCloseHint !== 'boolean') state.shownCloseHint = false;
    if (!state.petName) state.petName = 'Пискля';
    if (typeof state.playerBadgeName !== 'string') state.playerBadgeName = '';
    if (!['auto', 'female', 'male'].includes(state.playerBadgeGender)) state.playerBadgeGender = 'auto';
    if (!state.shopName) state.shopName = 'Fleur Atelier';
    if (!state.instaHandle) state.instaHandle = '@fleur_atelier';
    if (!['auto', 'female', 'male'].includes(state.playerGender)) state.playerGender = 'auto';
    if (!state.startDate) state.startDate = '2026-02-08';

    if (typeof parsed.isSetupDone !== 'boolean') {
      state.isSetupDone = state.day > 1 || state.bouquetsSold > 0;
    }

    if (state.instaPosts.length === 0 && state.followers === 120) {
      state.followers = 0;
    }

    return state;
  } catch (err) {
    console.warn('Не удалось прочитать сохранение, запущена новая игра:', err);
    return createInitialState();
  }
}

export function ensureDailyRareDecor() {
  if (gameState.rareShopDay === gameState.day && Array.isArray(gameState.rareShopIds) && gameState.rareShopIds.length > 0) {
    return gameState.rareShopIds;
  }
  const owned = new Set(gameState.decorInventory || gameState.decor || []);
  const rotatable = DECOR_CATALOG.filter((d) => d.id !== 'fridge');
  const unowned = rotatable.filter((d) => !owned.has(d.id));
  const pool = unowned.length >= 2 ? unowned : rotatable;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const count = Math.min(shuffled.length, Math.random() < 0.5 ? 2 : 3);
  gameState.rareShopDay = gameState.day;
  gameState.rareShopIds = shuffled.slice(0, count).map((d) => d.id);
  saveState();
  return gameState.rareShopIds;
}

export function getTotalGameMinutes() {
  return ((gameState.day || 1) - 1) * 1440 + (gameState.timeMinutes || 540);
}

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (err) {
    console.error('Ошибка сохранения игры:', err);
  }
}

export function resetState() {
  gameState = createInitialState();
  saveState();
}

export function loadAiSettings() {
  try {
    const raw = localStorage.getItem(AI_SETTINGS_KEY);
    if (!raw) return createInitialAiSettings();
    return { ...createInitialAiSettings(), ...JSON.parse(raw) };
  } catch (err) {
    return createInitialAiSettings();
  }
}

export function saveAiSettings(newSettings) {
  aiSettings = { ...aiSettings, ...newSettings };
  try {
    localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(aiSettings));
  } catch (err) {
    console.error('Ошибка сохранения настроек ИИ:', err);
  }
}

/** Проверка, закрыт ли магазин по времени */
export function isShopClosedNow() {
  const closeMin = (gameState.closeHour || 21) * 60;
  return (gameState.timeMinutes || 540) >= closeMin;
}

/** Синхронизация Утро/День/Вечер с часами */
export function syncTimeIndexWithMinutes() {
  const openMin = (gameState.openHour || 9) * 60;
  const closeMin = (gameState.closeHour || 21) * 60;
  const span = Math.max(120, closeMin - openMin);
  const cur = gameState.timeMinutes || openMin;

  if (cur < openMin + span * 0.35) {
    gameState.timeIndex = 0;
  } else if (cur < openMin + span * 0.72) {
    gameState.timeIndex = 1;
  } else {
    gameState.timeIndex = 2;
  }
}

/** Прибавить минуты к игровым часам (возвращает true, если лавка впервые закрылась) */
export function addGameMinutes(mins) {
  const wasClosed = isShopClosedNow();
  const maxMin = 23 * 60 + 55;
  gameState.timeMinutes = Math.min(maxMin, (gameState.timeMinutes || 540) + mins);
  syncTimeIndexWithMinutes();

  const justClosed = !wasClosed && isShopClosedNow() && !gameState.shownCloseHint;
  if (justClosed) {
    gameState.shownCloseHint = true;
  }
  saveState();
  return justClosed;
}

/** Изменение текущей игровой даты с пересчётом сезона и погоды */
export function setCurrentGameDate(targetDateStr) {
  const parts = String(targetDateStr || '').split('-').map(Number);
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return;

  const target = new Date(parts[0], parts[1] - 1, parts[2]);
  const newStart = new Date(target.getFullYear(), target.getMonth(), target.getDate() - (gameState.day - 1));
  const y = newStart.getFullYear();
  const m = String(newStart.getMonth() + 1).padStart(2, '0');
  const d = String(newStart.getDate()).padStart(2, '0');

  gameState.startDate = `${y}-${m}-${d}`;
  const season = getSeasonInfo(target);
  gameState.weather = getWeatherForSeason(season.id);
  saveState();
}

/** Продвинуть смену (Утро -> День -> Вечер -> Закрытие, без телепортации домой) */
export function advanceShift() {
  const openMin = (gameState.openHour || 9) * 60;
  const closeMin = (gameState.closeHour || 21) * 60;
  const midMin = Math.round((openMin + closeMin) / 2);
  const eveMin = Math.max(openMin + 60, closeMin - 90);

  if (gameState.timeIndex === 0) {
    gameState.timeIndex = 1;
    gameState.timeMinutes = Math.max(gameState.timeMinutes, midMin);
  } else if (gameState.timeIndex === 1) {
    gameState.timeIndex = 2;
    gameState.timeMinutes = Math.max(gameState.timeMinutes, eveMin);
  } else {
    gameState.timeMinutes = Math.max(gameState.timeMinutes, closeMin);
  }

  const fridgeFactor = gameState.hasFridge ? 0.65 : 1;
  let wiltingCount = 0;

  gameState.inventory.forEach((item) => {
    const meta = FLOWERS_CATALOG[item.typeId];
    if (!meta) return;
    item.wateredThisShift = false;
    item.freshness = Math.max(0, Math.round(item.freshness - meta.decayPerShift * fridgeFactor));
    if (item.freshness <= 25) wiltingCount += 1;
  });

  if (wiltingCount > 0) {
    gameState.mood = Math.max(20, gameState.mood - wiltingCount * 3);
  } else {
    gameState.mood = Math.min(100, gameState.mood + 2);
  }

  saveState();
}
```

## File: index.html
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#E8A598" />
  <title>Fleur Atelier — Симулятор цветочного магазина</title>

  <link rel="manifest" href="./manifest.json" />
  <link rel="icon" href="./assets/icon.svg" type="image/svg+xml" />

  <!-- Уютные шрифты с поддержкой кириллицы -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />

  <!-- Стили -->
  <link rel="stylesheet" href="./css/variables.css" />
  <link rel="stylesheet" href="./css/layout.css" />
  <link rel="stylesheet" href="./css/shop.css" />
  <link rel="stylesheet" href="./css/bouquet.css" />
  <link rel="stylesheet" href="./css/client.css" />
  <link rel="stylesheet" href="./css/phone.css" />
  <link rel="stylesheet" href="./css/home.css" />

  <!-- Puter.js v2 CDN -->
  <script src="https://js.puter.com/v2/"></script>
</head>
<body>
  <div class="desktop-wrapper">
    <div class="app-shell">
      <!-- Верхняя панель статуса -->
      <header class="top-bar">
        <div class="top-bar-row">
          <div class="stat-pill money" id="hud-money">💰 3 500 ₽</div>
          <div class="stat-pill top-date" id="hud-date">День 1 • Утро</div>
        </div>
        <div class="top-bar-row">
          <div class="stat-pill" id="hud-weather">☀️ Солнечно</div>
          <div class="stat-pill" id="hud-followers">🌸 0 подп.</div>
          <div class="stat-pill mood" id="hud-mood">✨ Атмосфера: 85%</div>
        </div>
      </header>

      <!-- Уведомления поверх экрана -->
      <div class="toast-container" id="toast-container"></div>

      <!-- Контейнер 4 экранов -->
      <main class="screens-container">
        <section class="screen active" id="screen-shop"></section>
        <section class="screen" id="screen-phone"></section>
        <section class="screen" id="screen-home"></section>
        <section class="screen" id="screen-finance"></section>
      </main>

      <!-- Нижняя панель навигации (4 ключевые вкладки) -->
      <nav class="bottom-nav" aria-label="Основная навигация">
        <button class="nav-btn active" data-target="shop">
          <svg viewBox="0 0 24 24">
            <path d="M3 9l2-5h14l2 5" />
            <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
            <path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8" />
          </svg>
          <span>Магазин</span>
        </button>

        <button class="nav-btn" data-target="phone">
          <span class="nav-badge" id="phone-nav-badge" style="display: none;">0</span>
          <svg viewBox="0 0 24 24">
            <rect x="6" y="2" width="12" height="20" rx="2.5" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          <span>Телефон</span>
        </button>

        <button class="nav-btn" data-target="home">
          <svg viewBox="0 0 24 24">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
            <path d="M9 21v-6h6v6" />
          </svg>
          <span>Домик</span>
        </button>

        <button class="nav-btn" data-target="finance">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Касса и ИИ</span>
        </button>
      </nav>
    </div>
  </div>

  <script type="module" src="./js/main.js"></script>
</body>
</html>
```

## File: manifest.json
```json
{
  "name": "Fleur Atelier — Симулятор цветочного магазина",
  "short_name": "Fleur Atelier",
  "description": "Уютный симулятор цветочного магазина с ИИ-клиентами и сборкой букетов.",
  "start_url": "./index.html",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FAF6F0",
  "theme_color": "#E8A598",
  "icons": [
    {
      "src": "./assets/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

## File: sw.js
```javascript
const CACHE_NAME = 'fleur-atelier-v8';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon.svg',
  './css/variables.css',
  './css/layout.css',
  './css/shop.css',
  './css/bouquet.css',
  './css/client.css',
  './css/phone.css',
  './css/home.css',
  './js/config.js',
  './js/state.js',
  './js/sound.js',
  './js/ai.js',
  './js/main.js',
  './js/graphics/flowersSvg.js',
  './js/graphics/avatarSvg.js',
  './js/graphics/shopScenerySvg.js',
  './js/ai/aiCore.js',
  './js/ai/clientAi.js',
  './js/ai/jobsAi.js',
  './js/ai/socialAi.js',
  './js/screens/shopScreen.js',
  './js/screens/bouquetMaker.js',
  './js/screens/phoneScreen.js',
  './js/screens/homeScreen.js',
  './js/screens/financeSettingsScreen.js',
  './js/screens/phone/phoneInsta.js',
  './js/screens/phone/phoneDirect.js',
  './js/screens/phone/phoneWholesale.js',
  './js/screens/phone/phoneDecor.js',
  './js/screens/phone/phoneRealtor.js',
  './js/screens/phone/phoneCanvasSnap.js',
  './js/screens/shop/shopClientZone.js',
  './js/screens/shop/shopInspector.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
```
