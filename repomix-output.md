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
````
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
  graphics/
    avatarSvg.js
    flowersSvg.js
  screens/
    bouquetMaker.js
    financeSettingsScreen.js
    homeScreen.js
    phoneScreen.js
    shopScreen.js
    storageScreen.js
  ai.js
  config.js
  main.js
  sound.js
  state.js
index.html
manifest.json
sw.js
````

# Files

## File: assets/icon.svg
````xml
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
````

## File: css/bouquet.css
````css
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
  flex-shrink: 0;
  width: 72px;
  background: #FFFDF9;
  border: 1.5px solid var(--border-soft);
  border-radius: 12px;
  padding: 6px 4px;
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
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
}

/* Выбор упаковки и ленты */
.wrap-options-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.wrap-pill {
  border: 1.5px solid var(--border-soft);
  background: #FFFDF9;
  padding: 5px 9px;
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
````

## File: css/client.css
````css
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
}

.chat-input-row .form-input {
  flex: 1;
  padding: 9px 11px;
  font-size: 13px;
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
````

## File: css/home.css
````css
/* Уютная комната в квартире */
.home-room-scene {
  position: relative;
  border-radius: var(--radius-lg);
  padding: 14px 14px 12px;
  border: 1.5px solid var(--border-soft);
  box-shadow: var(--shadow-card);
  background: linear-gradient(180deg, #F4E6D8 0%, #E9D5C0 66%, #D2B89F 66%, #C1A388 100%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}

.home-top-wall {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  min-height: 112px;
  position: relative;
}

.home-window {
  width: 108px;
  height: 82px;
  border-radius: 14px;
  border: 4px solid #FFFDF9;
  background: linear-gradient(180deg, #6E769F 0%, #D99B8C 100%);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.14);
}

.home-window.day {
  background: linear-gradient(180deg, #AEDDF5 0%, #E7F5FA 100%);
}

/* Визуальные предметы декора в интерьере */
.home-wall-bookshelf {
  width: 112px;
  height: 76px;
}

.home-lamp-wrap {
  width: 74px;
  height: 120px;
  position: relative;
  flex-shrink: 0;
}

.home-lamp-glow {
  position: absolute;
  top: 6px;
  left: -14px;
  width: 102px;
  height: 102px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 224, 145, 0.42) 0%, rgba(255, 224, 145, 0) 70%);
  pointer-events: none;
}

/* Зона кошки и лежанки */
.home-floor-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  padding-top: 2px;
}

.pet-spot {
  background: rgba(255, 253, 249, 0.93);
  border: 1.5px solid var(--border-soft);
  border-radius: 18px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  box-shadow: 0 4px 12px rgba(74, 62, 57, 0.08);
}

.pet-svg-btn {
  width: 82px;
  height: 82px;
  border: none;
  background: var(--bg-soft);
  border-radius: 18px;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
  transition: transform 0.14s ease;
}

.pet-svg-btn:active {
  transform: scale(0.92);
}
````

## File: css/layout.css
````css
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
  height: var(--top-bar-height);
  padding: 10px 14px;
  background: rgba(255, 253, 249, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-soft);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  flex-shrink: 0;
  z-index: 20;
}

.top-bar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--bg-soft);
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
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
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
}

/* Основная область экранов */
.screens-container {
  position: relative;
  flex: 1;
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
````

## File: css/phone.css
````css
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

/* Док-панель 4 приложений */
.phone-apps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.phone-app-btn {
  border: 1.5px solid var(--border-soft);
  background: var(--bg-soft);
  border-radius: 14px;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-family: var(--font-ui);
  font-size: 10.5px;
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
  font-size: 20px;
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
````

## File: css/shop.css
````css
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
  background-image: radial-gradient(rgba(217, 138, 124, 0.16) 2px, transparent 2px);
  background-size: 22px 22px;
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
````

## File: css/variables.css
````css
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
````

## File: js/graphics/avatarSvg.js
````javascript
/**
 * Генератор милых векторных портретов клиентов с эмоциями
 */

export function getClientAvatarSvg(appearance, mood = 65) {
  const {
    gender = 'female',
    skin = '#F9D9C6',
    hairStyle = 'bob',
    hairColor = '#6B4C3B',
    shirtColor = '#D98A7C',
    hasGlasses = false,
    bgTint = '#F2E7DC'
  } = appearance || {};

  const isHappy = mood >= 65;
  const isAngry = mood < 35;

  // Глаза и брови в зависимости от настроения
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

  // Ротик
  const mouth = isHappy
    ? '<path d="M43 60 Q50 66 57 60" stroke="#A65E58" stroke-width="2.2" stroke-linecap="round" fill="none"/>'
    : isAngry
    ? '<path d="M44 63 Q50 58 56 63" stroke="#A65E58" stroke-width="2.2" stroke-linecap="round" fill="none"/>'
    : '<path d="M45 61 L55 61" stroke="#A65E58" stroke-width="2" stroke-linecap="round"/>';

  // Задний слой волос
  let hairBack = '';
  if (hairStyle === 'long') {
    hairBack = `<path d="M24 42 Q22 76 30 88 L70 88 Q78 76 76 42 Q74 16 50 16 Q26 16 24 42 Z" fill="${hairColor}"/>`;
  } else if (hairStyle === 'bob') {
    hairBack = `<path d="M25 42 Q24 68 33 74 L67 74 Q76 68 75 42 Q73 16 50 16 Q27 16 25 42 Z" fill="${hairColor}"/>`;
  } else if (hairStyle === 'bun') {
    hairBack = `
      <circle cx="50" cy="14" r="11" fill="${hairColor}"/>
      <circle cx="50" cy="40" r="24" fill="${hairColor}"/>
    `;
  }

  // Передняя чёлка/причёска
  let hairFront = '';
  if (gender === 'male' || hairStyle === 'short') {
    hairFront = `
      <path d="M26 42 Q26 17 50 17 Q74 17 74 42 Q66 28 50 29 Q34 28 26 42 Z" fill="${hairColor}"/>
    `;
  } else {
    hairFront = `
      <path d="M26 43 Q28 18 50 18 Q72 18 74 43 Q63 31 54 27 Q43 34 26 43 Z" fill="${hairColor}"/>
    `;
  }

  const glassesSvg = hasGlasses
    ? `
      <g stroke="#5E4F48" stroke-width="1.6" fill="rgba(255,255,255,0.22)">
        <circle cx="39" cy="47" r="7"/>
        <circle cx="61" cy="47" r="7"/>
        <line x1="46" y1="47" x2="54" y2="47"/>
      </g>
    `
    : '';

  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${bgTint}"/>
      ${hairBack}
      <!-- Плечи и свитер -->
      <path d="M18 100 Q22 76 50 76 Q78 76 82 100 Z" fill="${shirtColor}"/>
      <path d="M42 74 L58 74 L56 82 Q50 85 44 82 Z" fill="${skin}"/>
      <!-- Ушки -->
      <circle cx="27" cy="49" r="4.5" fill="${skin}"/>
      <circle cx="73" cy="49" r="4.5" fill="${skin}"/>
      <!-- Лицо -->
      <rect x="28" y="24" width="44" height="49" rx="22" fill="${skin}"/>
      <!-- Румянец -->
      <ellipse cx="35" cy="54" rx="4.5" ry="2.5" fill="#F29E9D" opacity="0.5"/>
      <ellipse cx="65" cy="54" rx="4.5" ry="2.5" fill="#F29E9D" opacity="0.5"/>
      <!-- Глазки -->
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
````

## File: js/graphics/flowersSvg.js
````javascript
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
````

## File: js/screens/bouquetMaker.js
````javascript
import { FLOWERS_CATALOG, WRAPPINGS, RIBBONS } from '../config.js';
import { gameState, saveState } from '../state.js';
import { getFlowerSvgDataUrl, getSingleFlowerWrappedSvg } from '../graphics/flowersSvg.js';
import { playPaperSound, playShutterSound } from '../sound.js';

const imageCache = {};
let activeTool = 'move'; // 'move' | 'scissors'
let selectedStemId = null;
let draggingStem = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

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

/** Добавить цветок из вазы в черновик букета */
export function addFlowerToDraftBouquet(vaseUid, showToast) {
  const vase = gameState.inventory.find((i) => i.uid === vaseUid);
  if (!vase || vase.qty <= 0) {
    showToast('В этой вазе закончились цветы');
    return false;
  }

  const draft = gameState.currentBouquet;
  if (draft.stems.length >= 11) {
    showToast('На столе максимум 11 стеблей в одном букете');
    return false;
  }

  vase.qty -= 1;
  if (vase.qty <= 0) {
    gameState.inventory = gameState.inventory.filter((i) => i.uid !== vaseUid);
  }

  const meta = FLOWERS_CATALOG[vase.typeId];
  const unitPrice = vase.discounted ? Math.round(meta.price * 0.6) : meta.price;

  const index = draft.stems.length;
  const spreadAngle = ((index % 5) - 2) * 0.16;
  const newStem = {
    id: 'stem_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    typeId: vase.typeId,
    price: unitPrice,
    freshness: vase.freshness,
    discounted: vase.discounted,
    x: 280 + ((index % 5) - 2) * 32,
    y: 250 + Math.floor(index / 5) * 18,
    angle: spreadAngle,
    trimmed: false
  };

  draft.stems.push(newStem);
  selectedStemId = newStem.id;
  playPaperSound();
  saveState();
  showToast(`+ ${meta.shortName} добавлен в букет`);
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
          return `
            <button class="tray-chip" data-add-vase="${item.uid}">
              <div class="tray-chip-svg">${getSingleFlowerWrappedSvg(item.typeId)}</div>
              <span class="tray-chip-name">${meta.shortName}</span>
              <span class="tray-chip-qty">${item.qty} шт</span>
            </button>
          `;
        })
        .join('')
    : `<p class="muted-text">Вазы пусты</p>`;

  const wrapsHtml = WRAPPINGS.map(
    (w) => `
      <button class="wrap-pill ${draft.wrappingId === w.id ? 'active' : ''}" data-wrap-id="${w.id}">
        <span class="color-dot" style="background:${w.color === 'transparent' ? '#fff' : w.color};"></span>
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
        <div class="canvas-price-pill">💐 Итого: ${totalPrice} ₽</div>
        <div class="canvas-hint-pill">
          ${activeTool === 'move' ? '✋ Тяни цветок по столу' : '✂️ Нажми на цветок, чтобы подрезать'}
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

      <div class="row-between" style="gap: 8px;">
        <button class="btn btn-soft" id="btn-remove-stem" style="flex:1; padding:8px; font-size:12px;" ${!selectedStemId ? 'disabled' : ''}>
          ↩️ Убрать стебель
        </button>
        <button class="btn btn-soft" id="btn-clear-table" style="padding:8px 12px; font-size:12px;" ${draft.stems.length === 0 ? 'disabled' : ''}>
          🧹 Разобрать
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🌷 Добавить цветы со склада</div>
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

  setupCanvasAndEvents(container, showToast, onRefreshParent);
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

function setupCanvasAndEvents(container, showToast, onRefreshParent) {
  const canvas = document.getElementById('bouquet-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const draft = gameState.currentBouquet;

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
        onRefreshParent();
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
    draggingStem.x = Math.max(95, Math.min(465, pt.x - dragOffsetX));
    draggingStem.y = Math.max(120, Math.min(395, pt.y - dragOffsetY));
    drawBouquetCanvas(ctx, canvas);
  });

  canvas.addEventListener('pointerup', () => {
    if (draggingStem) {
      draggingStem = null;
      saveState();
      onRefreshParent();
    }
  });

  document.getElementById('tool-move')?.addEventListener('click', () => {
    activeTool = 'move';
    onRefreshParent();
  });

  document.getElementById('tool-scissors')?.addEventListener('click', () => {
    activeTool = 'scissors';
    onRefreshParent();
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

  document.getElementById('btn-remove-stem')?.addEventListener('click', () => {
    const stem = draft.stems.find((s) => s.id === selectedStemId);
    if (!stem) return;
    returnStemToInventory(stem);
    draft.stems = draft.stems.filter((s) => s.id !== stem.id);
    selectedStemId = null;
    saveState();
    showToast('Стебель возвращён в вазу');
    onRefreshParent();
  });

  document.getElementById('btn-clear-table')?.addEventListener('click', () => {
    draft.stems.forEach((s) => returnStemToInventory(s));
    draft.stems = [];
    selectedStemId = null;
    saveState();
    showToast('Все цветы возвращены в вазы');
    onRefreshParent();
  });

  container.querySelectorAll('[data-add-vase]').forEach((btn) => {
    btn.addEventListener('click', () => {
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
      onRefreshParent();
    });
  });

  container.querySelectorAll('[data-ribbon-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      draft.ribbonId = btn.dataset.ribbonId;
      playPaperSound();
      saveState();
      onRefreshParent();
    });
  });

  // Редактировать готовый букет
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
            x: 280 + ((index % 5) - 2) * 32,
            y: 250 + Math.floor(index / 5) * 18,
            angle: ((index % 5) - 2) * 0.16,
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
      onRefreshParent();
    });
  });

  // Разобрать готовый букет обратно в вазы
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
      onRefreshParent();
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
      price: calculateBouquetPrice(draft),
      stemsCount: draft.stems.length,
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
    saveState();
    showToast(`💐 Букет за ${ready.price} ₽ готов к продаже!`);
    onRefreshParent();
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

  if (wrap.id !== 'none') {
    ctx.save();
    ctx.fillStyle = wrap.color;
    ctx.strokeStyle = wrap.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(145, 225);
    ctx.lineTo(280, 165);
    ctx.lineTo(415, 225);
    ctx.lineTo(318, 465);
    ctx.lineTo(242, 465);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
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

  if (wrap.id !== 'none') {
    ctx.save();
    ctx.fillStyle = wrap.accent;
    ctx.globalAlpha = 0.88;
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
    ctx.fillText('Fleur Atelier 🌸', w - 20, h - 18);
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
````

## File: js/screens/financeSettingsScreen.js
````javascript
import { AI_PROVIDERS, getGameDateObj, getHolidayForDate } from '../config.js';
import { gameState, aiSettings, saveState, saveAiSettings, resetState } from '../state.js';
import { testAiConnection } from '../ai.js';
import { setAmbientMode, stopAmbient } from '../sound.js';

let currentSubTab = 'finance'; // 'finance' | 'settings'

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
  `;

  container.querySelectorAll('[data-subtab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentSubTab = btn.dataset.subtab;
      renderFinanceSettingsScreen(onHudUpdate, showToast);
    });
  });

  const body = document.getElementById('finance-subtab-body');
  if (currentSubTab === 'finance') {
    renderFinanceTab(body);
  } else {
    renderSettingsTab(body, onHudUpdate, showToast);
  }
}

function renderFinanceTab(body) {
  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const todayHoliday = getHolidayForDate(curDate);
  const holidayText = todayHoliday
    ? `🎉 Сегодня ${todayHoliday.name}! Спрос x3, цены поставщиков x2.`
    : 'Ближайшие крупные праздники: 14 Февраля и 8 Марта (спрос x3).';

  const balanceBadge =
    gameState.money >= 0
      ? '<span class="badge badge-ok">Плюс</span>'
      : '<span class="badge badge-warn">Долг арендодателю!</span>';

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
}

async function renderSettingsTab(body, onHudUpdate, showToast) {
  const selectedProvider = AI_PROVIDERS[aiSettings.provider] || AI_PROVIDERS.openrouter;
  const providerOptions = Object.values(AI_PROVIDERS)
    .map(
      (p) =>
        `<option value="${p.id}" ${p.id === aiSettings.provider ? 'selected' : ''}>${p.name}</option>`
    )
    .join('');

  body.innerHTML = `
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
          <input type="text" class="form-input" id="pet-name-input" value="${escapeAttr(gameState.petName || 'Пискля')}" maxlength="20" style="flex:1;" />
          <button class="btn btn-primary" id="btn-save-pet-name" style="padding:10px 14px;">Сохранить</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🧠 Настройка ИИ и API-ключа</div>
      <p class="muted-text">
        Ключ сохраняется только в памяти твоего браузера. Рекомендуется OpenRouter с моделью <code>baidu/ernie-5.5-flash-preview:free</code>.
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
              type="password"
              class="form-input"
              id="ai-api-key"
              name="fleur-custom-key"
              autocomplete="new-password"
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
      <div class="row-between">
        <div class="card-title">☁️ Аккаунт Puter.js (если нужен)</div>
        <span class="badge badge-warn" id="puter-status-badge">Проверка...</span>
      </div>
      <div class="row-between" style="gap: 8px;">
        <button class="btn btn-soft" id="btn-puter-signin" style="flex: 1;">Войти в Puter</button>
        <button class="btn btn-soft" id="btn-puter-signout" style="display: none;">Выйти</button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🗑️ Сброс прогресса</div>
      <button class="btn btn-danger" id="btn-reset-game">🗑️ Начать игру заново</button>
      <p style="margin-top: 8px; padding: 10px; border-radius: 12px; background: var(--bg-accent-soft); color: var(--primary-hover); font-size: 12.5px; font-weight: 800; text-align: center; line-height: 1.45;">
        Моей единственной и самой любимой полноценная игра, только для тебя Алиюш ❤️
      </p>
    </div>
  `;

  setupPuterBlock(showToast);
  setupAiForm(showToast);
  setupGameControls(onHudUpdate, showToast);
}

async function setupPuterBlock(showToast) {
  const badge = document.getElementById('puter-status-badge');
  const btnIn = document.getElementById('btn-puter-signin');
  const btnOut = document.getElementById('btn-puter-signout');
  if (!badge || !btnIn || !btnOut) return;

  const refreshStatus = async () => {
    if (typeof window.puter === 'undefined' || !window.puter.auth) {
      badge.className = 'badge badge-warn';
      badge.textContent = 'Не загружен';
      return;
    }
    try {
      const signedIn = window.puter.auth.isSignedIn();
      if (signedIn) {
        const user = await window.puter.auth.getUser();
        badge.className = 'badge badge-ok';
        badge.textContent = `Вход: ${user?.username || 'Активен'}`;
        btnIn.style.display = 'none';
        btnOut.style.display = 'inline-flex';
      } else {
        badge.className = 'badge badge-warn';
        badge.textContent = 'Не подключен';
        btnIn.style.display = 'inline-flex';
        btnOut.style.display = 'none';
      }
    } catch (err) {
      badge.className = 'badge badge-warn';
      badge.textContent = 'Гость';
    }
  };

  btnIn.addEventListener('click', async () => {
    try {
      await window.puter.auth.signIn();
      showToast('Успешный вход в Puter!');
      refreshStatus();
    } catch (err) {
      showToast('Авторизация отменена или недоступна');
    }
  });

  btnOut.addEventListener('click', async () => {
    try {
      await window.puter.auth.signOut();
      showToast('Вы вышли из аккаунта Puter');
      refreshStatus();
    } catch (err) {
      showToast('Не удалось выйти');
    }
  });

  refreshStatus();
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
    const isHidden = keyInput.type === 'password';
    keyInput.type = isHidden ? 'text' : 'password';
    toggleEyeBtn.textContent = isHidden ? '🙈' : '👁️';
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
  const resetBtn = document.getElementById('btn-reset-game');

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

  resetBtn.addEventListener('click', () => {
    if (confirm('Точно сбросить весь прогресс магазина? Настройки API-ключа сохранятся.')) {
      stopAmbient();
      resetState();
      window.location.reload();
    }
  });
}

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
````

## File: js/screens/homeScreen.js
````javascript
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
````

## File: js/screens/phoneScreen.js
````javascript
import {
  FLOWERS_CATALOG,
  INSTA_HASHTAGS,
  DECOR_CATALOG,
  getGameDateObj,
  getSeasonInfo,
  getHolidayForDate
} from '../config.js';
import { gameState, saveState } from '../state.js';
import { getSingleFlowerWrappedSvg } from '../graphics/flowersSvg.js';
import { evaluateInstaPost, generateDirectMessage } from '../ai.js';
import { playShutterSound, playCoinSound } from '../sound.js';

let activeApp = 'insta';
let selectedPhotoIndex = 0;
let selectedTags = ['#флористика', '#уютнаялавка'];
let isPosting = false;
let isFetchingDm = false;
let frostThermalWrap = true;

export function renderPhoneScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-phone');
  if (!container) return;

  ensureWholesaleDeals();

  const unreadDms = gameState.directMessages.filter((m) => !m.replyText && !(m.order && m.order.done)).length;

  container.innerHTML = `
    <div class="screen-header">
      <h1 class="screen-title">Смартфон</h1>
      <span class="badge badge-ok">Сеть 5G 🌸</span>
    </div>

    <div class="phone-frame">
      <div class="phone-status-strip">
        <span>12:40</span>
        <span class="phone-notch"></span>
        <span>🔋 94%</span>
      </div>

      <div class="phone-apps-grid">
        <button class="phone-app-btn ${activeApp === 'insta' ? 'active' : ''}" data-phone-app="insta">
          <span class="phone-app-icon">📸</span>
          <span>InstaFlower</span>
        </button>

        <button class="phone-app-btn ${activeApp === 'direct' ? 'active' : ''}" data-phone-app="direct">
          ${unreadDms > 0 ? `<span class="phone-badge-dot">${unreadDms}</span>` : ''}
          <span class="phone-app-icon">💬</span>
          <span>Direct</span>
        </button>

        <button class="phone-app-btn ${activeApp === 'wholesale' ? 'active' : ''}" data-phone-app="wholesale">
          <span class="phone-app-icon">🚚</span>
          <span>Оптовик</span>
        </button>

        <button class="phone-app-btn ${activeApp === 'decor' ? 'active' : ''}" data-phone-app="decor">
          <span class="phone-app-icon">🛋️</span>
          <span>Декор</span>
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
  if (activeApp === 'insta') renderInstaApp(body, onHudUpdate, showToast);
  else if (activeApp === 'direct') renderDirectApp(body, onHudUpdate, showToast);
  else if (activeApp === 'wholesale') renderWholesaleApp(body, onHudUpdate, showToast);
  else renderDecorApp(body, onHudUpdate, showToast);
}

/* ==================== 1. INSTAFLOWER ==================== */
function renderInstaApp(body, onHudUpdate, showToast) {
  const photos = gameState.savedPhotos || [];
  if (selectedPhotoIndex >= photos.length) selectedPhotoIndex = 0;
  const currentPhoto = photos[selectedPhotoIndex] || null;
  const handle = escapeHtml(gameState.instaHandle || '@fleur_atelier');

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
    ? gameState.instaPosts
        .map(
          (post) => `
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
            ${post.comments?.length ? `
              <div class="insta-comments-box">
                ${post.comments.map((c) => `<div><strong>${escapeHtml(c.author)}:</strong> ${escapeHtml(c.text)}</div>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `
        )
        .join('')
    : `<p class="muted-text" style="text-align:center; padding: 12px;">Лента пока пуста. Опубликуй свой первый пост, чтобы набирать подписчиков с нуля!</p>`;

  body.innerHTML = `
    <div class="card" style="padding: 12px;">
      <div class="row-between">
        <div class="card-title">✨ Новый пост (${handle})</div>
        <button class="btn btn-soft" id="btn-snap-interior" style="padding: 5px 8px; font-size: 11px;">
          📷 Снять зал
        </button>
      </div>

      <div class="photo-picker-row">${pickerHtml}</div>

      ${currentPhoto ? `
        <input type="text" class="form-input" id="insta-caption" placeholder="Напиши душевную подпись к фото..." />
        <div class="hashtags-row">${tagsHtml}</div>
        <button class="btn btn-primary" id="btn-publish-post" ${isPosting ? 'disabled' : ''}>
          ${isPosting ? '⏳ Аудитория смотрит пост...' : '🚀 Опубликовать пост'}
        </button>
      ` : ''}
    </div>

    <div class="card-title" style="padding-left: 4px;">📱 Твоя лента (${gameState.instaPosts.length})</div>
    ${feedHtml}
  `;

  body.querySelectorAll('[data-pick-photo]').forEach((el) => {
    el.addEventListener('click', () => {
      selectedPhotoIndex = Number(el.dataset.pickPhoto);
      renderInstaApp(body, onHudUpdate, showToast);
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
      renderInstaApp(body, onHudUpdate, showToast);
    });
  });

  document.getElementById('btn-snap-interior')?.addEventListener('click', () => {
    playShutterSound();
    const shopPhotoUrl = captureShopInteriorPhoto();
    gameState.savedPhotos.unshift({
      id: 'shop_' + Date.now(),
      dataUrl: shopPhotoUrl,
      type: 'shop',
      description: `Уютный интерьер цветочной лавки (${gameState.inventory.length} ваз с цветами)`,
      day: gameState.day
    });
    if (gameState.savedPhotos.length > 10) gameState.savedPhotos = gameState.savedPhotos.slice(0, 10);
    selectedPhotoIndex = 0;
    saveState();
    showToast('📸 Снимок зала сделан!');
    renderInstaApp(body, onHudUpdate, showToast);
  });

  document.getElementById('btn-publish-post')?.addEventListener('click', async () => {
    if (!currentPhoto || isPosting) return;
    const caption = document.getElementById('insta-caption')?.value.trim() || '';
    isPosting = true;
    renderInstaApp(body, onHudUpdate, showToast);

    try {
      const result = await evaluateInstaPost({
        type: currentPhoto.type === 'shop' ? 'shop' : 'bouquet',
        caption,
        hashtags: selectedTags,
        detailsText: currentPhoto.description || 'Авторский букет'
      });

      gameState.instaPosts.unshift({
        id: 'post_' + Date.now(),
        photoUrl: currentPhoto.dataUrl,
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
      renderPhoneScreen(onHudUpdate, showToast);
    }
  });
}

/* ==================== 2. DIRECT ==================== */
function renderDirectApp(body, onHudUpdate, showToast) {
  const listHtml = gameState.directMessages.length
    ? gameState.directMessages
        .map((dm) => {
          const hasOrder = dm.kind === 'preorder' && dm.order;
          const vase = hasOrder ? gameState.inventory.find((v) => v.typeId === dm.order.typeId && v.qty >= dm.order.qty) : null;

          return `
          <div class="dm-card">
            <div class="row-between">
              <strong>${escapeHtml(dm.senderName)}</strong>
              <span class="badge ${dm.kind === 'preorder' ? 'badge-ok' : 'badge-warn'}">
                ${dm.kind === 'preorder' ? 'Предзаказ' : dm.kind === 'question' ? 'Вопрос' : 'Отзыв'}
              </span>
            </div>
            <p style="font-size:12.5px; line-height:1.4;">${escapeHtml(dm.text)}</p>

            ${hasOrder && !dm.order.done ? `
              <button class="btn ${vase ? 'btn-sage' : 'btn-soft'}" data-fulfill-dm="${dm.id}" ${!vase ? 'disabled' : ''} style="padding:7px; font-size:12px;">
                ${vase ? `💐 Выполнить заказ (+${dm.order.reward} ₽)` : `Не хватает цветов в вазах (нужно ${dm.order.qty} шт.)`}
              </button>
            ` : ''}

            ${hasOrder && dm.order.done ? `<span class="badge badge-ok" style="align-self:flex-start;">✅ Заказ выполнен (+${dm.order.reward} ₽)</span>` : ''}

            ${dm.replyText ? `
              <div class="muted-text" style="background: var(--bg-soft); padding: 6px 8px; border-radius: 8px; font-size: 11.5px;">
                <strong>Твой ответ:</strong> ${escapeHtml(dm.replyText)}
              </div>
            ` : `
              <div class="row-between" style="gap: 6px;">
                <input type="text" class="form-input" id="dm-reply-${dm.id}" placeholder="Быстрый ответ..." style="padding: 6px 9px; font-size: 12px;" />
                <button class="btn btn-primary" data-reply-dm="${dm.id}" style="padding: 7px 10px; font-size: 12px;">Отправить</button>
              </div>
            `}
          </div>
        `;
        })
        .join('')
    : `<p class="muted-text" style="text-align:center; padding: 14px;">Сообщений пока нет. Нажми кнопку сверху, чтобы проверить Директ!</p>`;

  body.innerHTML = `
    <button class="btn btn-sage" id="btn-check-dm" ${isFetchingDm ? 'disabled' : ''}>
      ${isFetchingDm ? '⏳ Загружаем сообщения...' : '📩 Проверить новые сообщения'}
    </button>
    ${listHtml}
  `;

  document.getElementById('btn-check-dm')?.addEventListener('click', async () => {
    if (isFetchingDm) return;
    isFetchingDm = true;
    renderDirectApp(body, onHudUpdate, showToast);
    try {
      const dm = await generateDirectMessage();
      gameState.directMessages.unshift(dm);
      if (gameState.directMessages.length > 8) gameState.directMessages = gameState.directMessages.slice(0, 8);
      saveState();
      showToast(`Новое сообщение от ${dm.senderName}`);
    } finally {
      isFetchingDm = false;
      renderPhoneScreen(onHudUpdate, showToast);
    }
  });

  body.querySelectorAll('[data-fulfill-dm]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dm = gameState.directMessages.find((m) => m.id === btn.dataset.fulfillDm);
      if (!dm || !dm.order || dm.order.done) return;
      const vase = gameState.inventory.find((v) => v.typeId === dm.order.typeId && v.qty >= dm.order.qty);
      if (!vase) return;

      vase.qty -= dm.order.qty;
      if (vase.qty <= 0) {
        gameState.inventory = gameState.inventory.filter((v) => v.uid !== vase.uid);
      }

      dm.order.done = true;
      gameState.money += dm.order.reward;
      gameState.totalEarned += dm.order.reward;
      gameState.bouquetsSold += 1;
      gameState.followers += 1;
      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`🎉 Предзаказ выполнен! +${dm.order.reward} ₽ и +1 подписчик`);
      renderPhoneScreen(onHudUpdate, showToast);
    });
  });

  body.querySelectorAll('[data-reply-dm]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dmId = btn.dataset.replyDm;
      const dm = gameState.directMessages.find((m) => m.id === dmId);
      const input = document.getElementById(`dm-reply-${dmId}`);
      const text = input?.value.trim();
      if (!dm || !text) return;

      dm.replyText = text;
      gameState.mood = Math.min(100, gameState.mood + 2);
      if (text.length >= 8) gameState.followers += 1;
      saveState();
      onHudUpdate();
      showToast('Ответ отправлен (+лояльность!)');
      renderPhoneScreen(onHudUpdate, showToast);
    });
  });
}

/* ==================== 3. ОПТОВЫЙ ПОСТАВЩИК ==================== */
function ensureWholesaleDeals() {
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

function renderWholesaleApp(body, onHudUpdate, showToast) {
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
      const actualFresh = isFrost && !frostThermalWrap && Math.random() < 0.5 ? Math.max(25, deal.freshness - 25) : deal.freshness;
      deal.bought = true;
      buyFlowersBatch(deal.typeId, deal.qty, actualFresh, cost, onHudUpdate, showToast);
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

/* ==================== 4. HOME & DECO ==================== */
function renderDecorApp(body, onHudUpdate, showToast) {
  const itemsHtml = DECOR_CATALOG.map((item) => {
    const owned = gameState.decor.includes(item.id) || (item.id === 'fridge' && gameState.hasFridge);
    return `
      <div class="decor-item-card">
        <div class="decor-icon-box">${item.icon}</div>
        <div style="flex:1; min-width:0;">
          <div class="row-between">
            <strong style="font-size:13px;">${item.name}</strong>
            <span class="badge badge-ok">${item.place}</span>
          </div>
          <p class="muted-text" style="font-size:11px; margin-top:2px;">${item.effectText}</p>
        </div>
        <button class="btn ${owned ? 'btn-soft' : 'btn-primary'}" data-buy-decor="${item.id}" ${owned ? 'disabled' : ''} style="padding:7px 10px; font-size:11.5px;">
          ${owned ? 'Куплено ✓' : `${item.price} ₽`}
        </button>
      </div>
    `;
  }).join('');

  body.innerHTML = `
    <p class="muted-text" style="padding: 0 4px;">Покупай технику и уютный декор для лавки и квартиры!</p>
    ${itemsHtml}
  `;

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
      gameState.mood = Math.min(100, gameState.mood + item.moodBonus);

      playCoinSound();
      saveState();
      onHudUpdate();
      showToast(`✨ Куплено: ${item.name}!`);
      renderDecorApp(body, onHudUpdate, showToast);
    });
  });
}

function captureShopInteriorPhoto() {
  const c = document.createElement('canvas');
  c.width = 480;
  c.height = 480;
  const ctx = c.getContext('2d');

  const isEvening = gameState.timeIndex === 2;
  const season = getSeasonInfo(getGameDateObj(gameState.startDate, gameState.day - 1));
  ctx.fillStyle = isEvening ? '#DFCBB9' : '#F6ECE1';
  ctx.fillRect(0, 0, 480, 480);

  if (gameState.decor.includes('vintage_wallpaper')) {
    ctx.fillStyle = 'rgba(217, 138, 124, 0.14)';
    for (let x = 25; x < 480; x += 60) {
      for (let y = 30; y < 340; y += 60) {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.fillStyle = isEvening ? '#5E648B' : gameState.weather === 'rainy' ? '#95A9B8' : '#BCE1F5';
  ctx.fillRect(45, 55, 190, 145);
  // Горизонт в окне по сезону
  ctx.fillStyle = season.id === 'winter' ? '#F2F7FA' : season.id === 'autumn' ? '#D98A4E' : '#9CC494';
  ctx.fillRect(45, 165, 190, 35);

  ctx.strokeStyle = '#FFFDF9';
  ctx.lineWidth = 8;
  ctx.strokeRect(45, 55, 190, 145);

  ctx.fillStyle = '#FFFDF9';
  ctx.fillRect(265, 75, 165, 65);
  ctx.strokeStyle = gameState.decor.includes('neon_sign') ? '#E58A94' : '#D5C3B3';
  ctx.lineWidth = 4;
  ctx.strokeRect(265, 75, 165, 65);
  ctx.fillStyle = '#5C4A42';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText((gameState.shopName || 'Fleur Atelier').slice(0, 16), 347, 114);

  ctx.fillStyle = '#C9A789';
  ctx.fillRect(30, 340, 420, 22);
  ctx.fillStyle = '#EADBC9';
  ctx.fillRect(0, 362, 480, 118);

  const vaseColors = ['#EBD9CE', '#DCE6DB', '#F3DFDC', '#DFD9EA'];
  const count = Math.min(4, Math.max(1, gameState.inventory.length));
  for (let i = 0; i < count; i++) {
    const vx = 85 + i * 95;
    ctx.fillStyle = vaseColors[i % vaseColors.length];
    ctx.fillRect(vx, 280, 42, 60);
    ctx.fillStyle = '#6E9971';
    ctx.fillRect(vx + 18, 235, 6, 45);
    ctx.fillStyle = i % 2 === 0 ? '#E98387' : '#F4C752';
    ctx.beginPath();
    ctx.arc(vx + 21, 228, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(74, 62, 57, 0.55)';
  ctx.font = 'bold 16px Georgia, serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${gameState.shopName || 'Fleur Atelier'} 🌸`, 460, 460);

  return c.toDataURL('image/jpeg', 0.85);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
````

## File: js/screens/shopScreen.js
````javascript
import {
  FLOWERS_CATALOG,
  TIME_PERIODS,
  WEATHERS,
  getGameDateObj,
  getSeasonInfo,
  getHolidayForDate
} from '../config.js';
import { gameState, saveState, advanceShift } from '../state.js';
import { getFlowerInVaseSvg, getSingleFlowerWrappedSvg } from '../graphics/flowersSvg.js';
import { getClientAvatarSvg } from '../graphics/avatarSvg.js';
import { renderBouquetMaker, addFlowerToDraftBouquet } from './bouquetMaker.js';
import { generateRandomClient, buildClientSystemPrompt, callAI, parseClientJson } from '../ai.js';
import { playBellSound, playCoinSound, playPaperSound } from '../sound.js';

let selectedVaseUid = null;
let shopSubTab = 'hall';

let activeClient = null;
let isAiThinking = false;
let showOfferDrawer = false;
let pendingOffer = null;

export function renderShopScreen(onHudUpdate, showToast) {
  const container = document.getElementById('screen-shop');
  if (!container) return;

  const stemsCount = gameState.currentBouquet?.stems?.length || 0;
  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const season = getSeasonInfo(curDate);
  const isHoliday = getHolidayForDate(curDate);

  const openStr = String(gameState.openHour || 9).padStart(2, '0') + ':00';
  const closeStr = String(gameState.closeHour || 21).padStart(2, '0') + ':00';

  container.innerHTML = `
    <div class="screen-header">
      <h1 class="screen-title">${escapeHtml(gameState.shopName || 'Fleur Atelier')}</h1>
      <div style="display:flex; gap:5px; align-items:center;">
        ${gameState.hasFridge ? '<span class="badge badge-ok" title="Холодильник замедляет увядание">❄️</span>' : ''}
        <span class="badge ${isHoliday ? 'badge-warn' : 'badge-ok'}">${isHoliday ? '🎉 Праздник!' : `${openStr}–${closeStr}`}</span>
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
      shopSubTab = btn.dataset.shopTab;
      renderShopScreen(onHudUpdate, showToast);
    });
  });

  const subContent = document.getElementById('shop-subtab-content');
  if (shopSubTab === 'bouquet') {
    renderBouquetMaker(subContent, onHudUpdate, showToast, () => {
      renderShopScreen(onHudUpdate, showToast);
    });
    return;
  }

  const timeClass = gameState.timeIndex === 2 ? 'time-evening' : 'time-day';
  const weatherClass = `weather-${gameState.weather}`;
  const weatherObj = WEATHERS.find((w) => w.id === gameState.weather) || WEATHERS[0];
  const periodName = TIME_PERIODS[gameState.timeIndex] || 'Утро';

  const wallpaperClass = gameState.decor.includes('vintage_wallpaper') ? 'has-wallpaper' : '';
  const powerClass = gameState.powerOutage ? (gameState.candlesLit ? 'power-out candles-lit' : 'power-out') : '';
  const hasNeon = gameState.decor.includes('neon_sign');

  const vasesHtml = gameState.inventory.length
    ? gameState.inventory.map((item) => renderVaseSlot(item)).join('')
    : `<div class="muted-text" style="grid-column: 1 / -1; text-align: center; padding: 18px 8px;">
         Вазы пусты! Закажи свежие цветы в «📱 Телефон» → «🚚 Оптовик».
       </div>`;

  const selectedItem = gameState.inventory.find((i) => i.uid === selectedVaseUid) || null;

  subContent.innerHTML = `
    <div class="shop-scene ${timeClass} ${wallpaperClass} ${powerClass}">
      <div class="shop-garland">
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
        <span class="garland-bulb"></span>
      </div>

      ${hasNeon ? `<div class="shop-neon-badge">✨ ${escapeHtml(gameState.shopName || 'Fleur Atelier')} ✨</div>` : ''}

      ${gameState.powerOutage ? `
        <div class="power-alert-bar">
          <span>${gameState.candlesLit ? '🕯️ В лавке горят уютные свечи!' : '⚡ Отключили свет! В лавке темно.'}</span>
          ${!gameState.candlesLit ? '<button class="btn btn-primary" id="btn-light-candles" style="padding:5px 9px; font-size:11px;">🕯️ Зажечь свечи</button>' : ''}
        </div>
      ` : ''}

      <div class="shop-window-row">
        <div class="shop-window ${timeClass} ${weatherClass}">
          <div class="window-celestial"></div>
          <div class="window-horizon season-${season.id}"></div>
          <div class="weather-particles">${renderWeatherParticles(gameState.weather, season.id)}</div>
          <div class="window-pane-v"></div>
          <div class="window-pane-h"></div>
        </div>

        <div class="shop-sign-box">
          <div class="sign-title">${periodName}</div>
          <div class="sign-subtitle">${weatherObj.icon} ${season.label}</div>
          <button class="btn btn-soft" id="btn-next-shift" style="width: 100%; padding: 7px 6px; font-size: 11.5px;">
            ⏩ След. смена
          </button>
        </div>
      </div>

      ${renderClientZone()}

      <div class="vases-grid">
        ${vasesHtml}
      </div>
      <div class="wooden-counter"></div>
    </div>

    ${selectedItem ? renderInspectorModal(selectedItem) : ''}
  `;

  bindShopEvents(subContent, onHudUpdate, showToast);
  scrollChatToBottom();
}

function renderClientZone() {
  if (!activeClient) {
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

  return `
    <div class="client-card">
      <div class="client-header">
        <div class="client-avatar">
          ${getClientAvatarSvg(activeClient.appearance, activeClient.mood)}
        </div>
        <div class="client-info">
          <div class="client-name">${activeClient.name}, ${activeClient.age}</div>
          <div class="client-tags">
            <span class="client-tag">${shortPersona}</span>
            <span class="client-tag">🎁 ${activeClient.occasion}</span>
          </div>
          <div class="client-mood-row">
            <span>Настроение: ${activeClient.mood}%</span>
            <div class="freshness-bar-bg" style="flex:1;">
              <div class="freshness-bar-fill ${moodClass}" style="width: ${activeClient.mood}%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-box" id="client-chat-box">
        ${chatHtml}
        ${isAiThinking ? '<div class="chat-typing">💬 Клиент думает...</div>' : ''}
      </div>

      ${isFinished ? `
        <button class="btn btn-primary" id="btn-call-client">
          🔔 Позвать следующего клиента
        </button>
      ` : `
        <div class="chat-input-row">
          <input
            type="text"
            class="form-input"
            id="client-chat-input"
            placeholder="Напиши клиенту..."
            ${isAiThinking ? 'disabled' : ''}
          />
          <button class="btn btn-sage" id="btn-send-chat" ${isAiThinking ? 'disabled' : ''}>
            ➤
          </button>
        </div>

        <button class="btn btn-primary" id="btn-toggle-offer" ${isAiThinking ? 'disabled' : ''}>
          ${showOfferDrawer ? '✕ Скрыть витрину предложений' : '💐 Предложить букет или цветок'}
        </button>

        ${showOfferDrawer ? renderOfferDrawer() : ''}
      `}
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
          <input type="number" class="offer-price-input" id="price-b-${b.id}" value="${b.price}" min="50" />
          <button class="btn btn-sage" data-offer-bouquet="${b.id}" style="padding:6px 9px; font-size:11.5px;">
            Дать
          </button>
        </div>
      `
        )
        .join('')
    : `<p class="muted-text" style="font-size:11.5px;">Готовых букетов нет — их можно собрать во вкладке «💐 Стол сборки».</p>`;

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
              <input type="number" class="offer-price-input" id="price-v-${item.uid}" value="${unitPrice}" min="30" />
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
      ${vasesHtml}
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

function renderInspectorModal(item) {
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

function bindShopEvents(container, onHudUpdate, showToast) {
  document.getElementById('btn-light-candles')?.addEventListener('click', () => {
    gameState.candlesLit = true;
    gameState.mood = Math.min(100, gameState.mood + 6);
    playPaperSound();
    saveState();
    onHudUpdate();
    renderShopScreen(onHudUpdate, showToast);
    showToast('🕯️ Свечи зажжены! В лавке снова уютно.');
  });

  document.getElementById('btn-call-client')?.addEventListener('click', () => {
    playBellSound();
    summonNextClient(onHudUpdate, showToast);
  });

  const chatInput = document.getElementById('client-chat-input');
  document.getElementById('btn-send-chat')?.addEventListener('click', () => {
    const text = chatInput?.value.trim();
    if (text) sendPlayerMessage(text, null, onHudUpdate, showToast);
  });

  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isAiThinking) {
      const text = chatInput.value.trim();
      if (text) sendPlayerMessage(text, null, onHudUpdate, showToast);
    }
  });

  document.getElementById('btn-toggle-offer')?.addEventListener('click', () => {
    showOfferDrawer = !showOfferDrawer;
    renderShopScreen(onHudUpdate, showToast);
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
      const promptMsg = `[Предложение продавца]: Я предлагаю вам готовый букет (${bouquet.summary}) за ${customPrice} ₽.`;
      showOfferDrawer = false;
      sendPlayerMessage(promptMsg, offer, onHudUpdate, showToast, `Предложили букет за ${customPrice} ₽`);
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
      const promptMsg = `[Предложение продавца]: Я предлагаю вам цветок ${meta.name} (свежесть ${vase.freshness}%) за ${customPrice} ₽.`;
      showOfferDrawer = false;
      sendPlayerMessage(promptMsg, offer, onHudUpdate, showToast, `Предложили ${meta.shortName} за ${customPrice} ₽`);
    });
  });

  container.querySelectorAll('[data-vase-uid]').forEach((slot) => {
    slot.addEventListener('click', () => {
      selectedVaseUid = slot.dataset.vaseUid;
      renderShopScreen(onHudUpdate, showToast);
    });
  });

  document.getElementById('vase-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'vase-modal-overlay') {
      selectedVaseUid = null;
      renderShopScreen(onHudUpdate, showToast);
    }
  });

  document.getElementById('btn-close-inspector')?.addEventListener('click', () => {
    selectedVaseUid = null;
    renderShopScreen(onHudUpdate, showToast);
  });

  document.getElementById('btn-add-to-bouquet')?.addEventListener('click', () => {
    const added = addFlowerToDraftBouquet(selectedVaseUid, showToast);
    if (added) {
      if (!gameState.inventory.find((i) => i.uid === selectedVaseUid)) {
        selectedVaseUid = null;
      }
      renderShopScreen(onHudUpdate, showToast);
    }
  });

  document.getElementById('btn-next-shift')?.addEventListener('click', () => {
    advanceShift();
    onHudUpdate();
    renderShopScreen(onHudUpdate, showToast);
    showToast('Смена сменилась, время идёт вперёд');
  });

  document.getElementById('btn-water-flower')?.addEventListener('click', () => {
    const item = gameState.inventory.find((i) => i.uid === selectedVaseUid);
    if (!item || item.wateredThisShift) return;
    item.freshness = Math.min(100, item.freshness + 8);
    item.wateredThisShift = true;
    saveState();
    renderShopScreen(onHudUpdate, showToast);
    showToast('Вода в вазе освежена! (+8% свежести)');
  });

  document.getElementById('btn-discount-flower')?.addEventListener('click', () => {
    const item = gameState.inventory.find((i) => i.uid === selectedVaseUid);
    if (!item || item.discounted) return;
    item.discounted = true;
    saveState();
    renderShopScreen(onHudUpdate, showToast);
    showToast('Установлена уценка -40%');
  });

  document.getElementById('btn-discard-flower')?.addEventListener('click', () => {
    gameState.inventory = gameState.inventory.filter((i) => i.uid !== selectedVaseUid);
    selectedVaseUid = null;
    gameState.mood = Math.min(100, gameState.mood + 3);
    saveState();
    onHudUpdate();
    renderShopScreen(onHudUpdate, showToast);
    showToast('Увядшие цветы списаны, витрина стала чище');
  });
}

async function summonNextClient(onHudUpdate, showToast) {
  if (isAiThinking) return;
  activeClient = generateRandomClient();
  pendingOffer = null;
  showOfferDrawer = false;
  isAiThinking = true;

  const systemPrompt = buildClientSystemPrompt(activeClient);
  activeClient.history = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Ты только что вошёл в цветочный магазин. Поприветствуй продавца и скажи или намекни, что ищешь.' }
  ];

  renderShopScreen(onHudUpdate, showToast);

  try {
    const raw = await callAI(activeClient.history);
    const parsed = parseClientJson(raw);
    activeClient.history.push({ role: 'assistant', content: raw });
    activeClient.chatLog.push({ sender: 'client', text: parsed.reply });
  } catch (err) {
    activeClient.chatLog.push({
      sender: 'system',
      text: `⚠️ Не удалось связаться с ИИ: ${err.message}`
    });
  } finally {
    isAiThinking = false;
    renderShopScreen(onHudUpdate, showToast);
  }
}

async function sendPlayerMessage(aiText, offerObj, onHudUpdate, showToast, displayText = null) {
  if (!activeClient || isAiThinking || activeClient.status !== 'talking') return;
  if (offerObj) pendingOffer = offerObj;

  isAiThinking = true;
  activeClient.chatLog.push({ sender: 'player', text: displayText || aiText });
  activeClient.history.push({ role: 'user', content: aiText });

  renderShopScreen(onHudUpdate, showToast);

  try {
    const raw = await callAI(activeClient.history);
    const parsed = parseClientJson(raw);
    activeClient.history.push({ role: 'assistant', content: raw });
    activeClient.chatLog.push({ sender: 'client', text: parsed.reply });

    activeClient.mood = Math.max(0, Math.min(100, activeClient.mood + parsed.moodChange));

    if (parsed.dealStatus === 'bought' && pendingOffer) {
      completeSale(pendingOffer, onHudUpdate, showToast);
      activeClient.status = 'bought';
      activeClient.chatLog.push({
        sender: 'system',
        text: `✅ Сделка состоялась! Продано за ${pendingOffer.price} ₽`
      });
    } else if (parsed.dealStatus === 'bought' && !pendingOffer) {
      activeClient.chatLog.push({
        sender: 'system',
        text: '💡 Клиент согласен! Нажми «Предложить букет или цветок», чтобы провести оплату.'
      });
    } else if (parsed.dealStatus === 'left' || activeClient.mood <= 0) {
      activeClient.status = 'left';
      gameState.mood = Math.max(10, gameState.mood - 3);
      saveState();
      onHudUpdate();
      activeClient.chatLog.push({
        sender: 'system',
        text: '💨 Клиент ушёл без покупки.'
      });
    }
  } catch (err) {
    activeClient.chatLog.push({
      sender: 'system',
      text: `⚠️ Ошибка ИИ: ${err.message}`
    });
  } finally {
    isAiThinking = false;
    renderShopScreen(onHudUpdate, showToast);
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
  }

  gameState.money += offer.price;
  gameState.totalEarned += offer.price;
  gameState.bouquetsSold += 1;
  gameState.energy = Math.max(10, gameState.energy - 5);
  const closeLimit = (gameState.closeHour || 21) * 60;
  gameState.timeMinutes = Math.min(closeLimit, (gameState.timeMinutes || 540) + 20);
  gameState.mood = Math.min(100, gameState.mood + 3);
  pendingOffer = null;

  playCoinSound();
  saveState();
  onHudUpdate();
  showToast(`💰 Продано! +${offer.price} ₽ в кассу`);
}

function scrollChatToBottom() {
  const box = document.getElementById('client-chat-box');
  if (box) box.scrollTop = box.scrollHeight;
}

function getActualFlowerPrice(item, meta) {
  return item.discounted ? Math.round(meta.price * 0.6) : meta.price;
}

function renderWeatherParticles(weather, seasonId) {
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
````

## File: js/screens/storageScreen.js
````javascript

````

## File: js/ai.js
````javascript
import { AI_PROVIDERS, FLOWERS_CATALOG, getGameDateObj, getHolidayForDate } from './config.js';
import { aiSettings, gameState } from './state.js';

const CLIENT_TEMPLATES = {
  femaleNames: ['Алиса', 'Марина', 'Елена', 'София', 'Дарья', 'Анна Сергеевна', 'Валерия', 'Ксения'],
  maleNames: ['Артём', 'Дмитрий', 'Максим', 'Игорь', 'Никита', 'Михаил Петрович', 'Кирилл'],
  skins: ['#FCE0D2', '#F5CBAF', '#E6B394'],
  hairColors: ['#4E392E', '#7A543E', '#C98A5B', '#E3C07B', '#2F2928', '#B8B2AD'],
  shirtColors: ['#D98A7C', '#89A88B', '#8EA8C3', '#D4A5B8', '#DFB66B', '#9D8EB8'],
  bgTints: ['#F7EAE4', '#E9F0E8', '#E9EEF4', '#F5EBF2'],
  personalities: [
    'вежливый и немного застенчивый романтик',
    'вечно спешащий деловой человек, ценит лаконичность',
    'ворчливый, но в душе добрый эстет, любит поторговаться',
    'очень эмоциональная и душевная натура, обожает уют',
    'требовательный ценитель стиля с хорошим вкусом',
    'приветливый студент с ограниченным бюджетом, ищет душевный вариант'
  ],
  occasions: [
    'первое свидание',
    'извинение после ссоры',
    'день рождения мамы',
    'юбилей бабушки',
    'просто украсить дом к ужину',
    'годовщина отношений',
    'подарок лучшей подруге'
  ],
  preferences: [
    'обожает красные розы или нежные пионы',
    'ищет что-то солнечное, тёплое и жёлтое (тюльпаны или ромашки)',
    'ненавидит белые лилии — считает их слишком резкими по запаху',
    'очень любит сиреневую лаванду и уютный минимализм',
    'не хочет слишком пафосных роз, ищет милый полевой или весенний букет',
    'готов переплатить за красивую упаковку и аккуратную ленту',
    'не любит ромашки — считает их слишком простыми'
  ]
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Генерация уникального клиента на JS */
export function generateRandomClient() {
  const gender = Math.random() < 0.58 ? 'female' : 'male';
  const name = pickRandom(gender === 'female' ? CLIENT_TEMPLATES.femaleNames : CLIENT_TEMPLATES.maleNames);
  const age = name.includes(' ') ? 54 + Math.floor(Math.random() * 16) : 19 + Math.floor(Math.random() * 24);
  const personality = pickRandom(CLIENT_TEMPLATES.personalities);
  const occasion = pickRandom(CLIENT_TEMPLATES.occasions);
  const preference = pickRandom(CLIENT_TEMPLATES.preferences);

  const isHoliday = Boolean(getHolidayForDate(getGameDateObj(gameState.startDate, gameState.day - 1)));
  let baseBudget = 550 + Math.floor(Math.random() * 1900);
  if (personality.includes('студент')) baseBudget = 400 + Math.floor(Math.random() * 550);
  if (personality.includes('ценитель')) baseBudget = 1200 + Math.floor(Math.random() * 2200);
  if (isHoliday) baseBudget = Math.round(baseBudget * 1.35);

  const hairOptions = gender === 'female' ? ['long', 'bob', 'bun'] : ['short'];

  return {
    id: 'client_' + Date.now(),
    name,
    age,
    gender,
    personality,
    occasion,
    budget: Math.round(baseBudget / 50) * 50,
    preference,
    mood: 65,
    status: 'talking',
    appearance: {
      gender,
      skin: pickRandom(CLIENT_TEMPLATES.skins),
      hairStyle: pickRandom(hairOptions),
      hairColor: name.includes(' ') ? '#B8B2AD' : pickRandom(CLIENT_TEMPLATES.hairColors),
      shirtColor: pickRandom(CLIENT_TEMPLATES.shirtColors),
      hasGlasses: Math.random() < 0.35,
      bgTint: pickRandom(CLIENT_TEMPLATES.bgTints)
    },
    history: [],
    chatLog: []
  };
}

/** Сборка системного промпта под текущего клиента и ассортимент лавки */
export function buildClientSystemPrompt(client) {
  const vasesText = gameState.inventory.length
    ? gameState.inventory
        .map((item) => {
          const meta = FLOWERS_CATALOG[item.typeId];
          if (!meta) return '';
          const price = item.discounted ? Math.round(meta.price * 0.6) : meta.price;
          return `- ${meta.name} (${item.qty} шт., ${price} ₽/шт., свежесть ${item.freshness}%${item.discounted ? ', УЦЕНКА' : ''})`;
        })
        .filter(Boolean)
        .join('\n')
    : 'Сейчас вазы пустые.';

  const bouquetsText = gameState.readyBouquets.length
    ? gameState.readyBouquets
        .map((b, idx) => `${idx + 1}. Готовый букет: ${b.summary} — цена ${b.price} ₽`)
        .join('\n')
    : 'Готовых букетов на витрине пока нет.';

  return `Ты отыгрываешь роль покупателя в цветочном магазине "Fleur Atelier".
ТВОИ ПАРАМЕТРЫ:
- Имя и возраст: ${client.name}, ${client.age} лет.
- Характер: ${client.personality}.
- Повод покупки: ${client.occasion}.
- Максимальный бюджет: ${client.budget} ₽ (можешь торговаться, но не покупай то, что дороже бюджета больше чем на 10%).
- Скрытое предпочтение/запрет: ${client.preference}.
- Текущее настроение: ${client.mood} из 100.

АССОРТИМЕНТ МАГАЗИНА:
${vasesText}
${bouquetsText}

ПРАВИЛА:
1. Пиши строго на русском, живо, коротко (1–3 предложения).
2. Намекай на повод, бюджет или вкус, но естественно.
3. На "[Предложение продавца]":
   - Оцени свежесть (если ниже 40% — возмутись), соответствие вкусу/запрету и цену относительно бюджета ${client.budget} ₽.
   - Подходит — соглашайся ("dealStatus": "bought", "moodChange": +15).
   - Дорого или не тот цветок — торгуйся или проси замену ("dealStatus": "talking", "moodChange": -5).
   - Грубость или игнорирование запрета — уходи ("dealStatus": "left", "moodChange": -20).

ОТВЕЧАЙ СТРОГО ОДНИМ ВАЛИДНЫМ JSON БЕЗ MARKDOWN:
{"reply": "твоя реплика", "moodChange": 0, "dealStatus": "talking"}`;
}

/** Безопасный парсинг ответа ИИ */
export function parseClientJson(rawText) {
  const cleaned = String(rawText || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  if (!cleaned) {
    throw new Error('ИИ вернул пустой ответ. Попробуй ещё раз или переключи провайдера.');
  }

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
      console.warn('Ошибка парсинга JSON от ИИ, пробуем извлечь текст:', err);
    }
  }

  const replyMatch = cleaned.match(/"reply"\s*:\s*"([\s\S]*?)(?:"\s*,|"\s*}|$)/);
  if (replyMatch && replyMatch[1]) {
    return {
      reply: replyMatch[1].replace(/\\"/g, '"').replace(/\\n/g, ' ').trim(),
      moodChange: 0,
      dealStatus: 'talking'
    };
  }

  return {
    reply: cleaned,
    moodChange: 0,
    dealStatus: 'talking'
  };
}

/** Универсальный запрос с таймаутом 12 секунд */
async function fetchWithTimeout(url, options, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Сервер не ответил за 12 сек. Возможно, он заблокирован или перегружен — попробуй Mistral AI или Встроенный режим.');
    }
    throw new Error('Нет связи с сервером (Failed to fetch). Проверь интернет/VPN или выбери Встроенный режим.');
  } finally {
    clearTimeout(timer);
  }
}

/** Универсальный запрос к настроенному ИИ */
export async function callAI(messages) {
  const providerId = aiSettings.provider || 'offline';
  const providerMeta = AI_PROVIDERS[providerId] || AI_PROVIDERS.offline;
  const apiKey = String(aiSettings.apiKey || '').replace(/\s+/g, '');
  const model = String(aiSettings.model || providerMeta.defaultModel || '').trim();
  const baseUrl = String(aiSettings.baseUrl || providerMeta.defaultBaseUrl || '').trim().replace(/\/+$/, '');

  // 0. Встроенный быстрый офлайн-движок
  if (providerId === 'offline') {
    await sleep(280);
    return runOfflineClientAI(messages);
  }

  // 1. Puter.js
  if (providerId === 'puter') {
    if (typeof window.puter === 'undefined' || !window.puter.ai) {
      throw new Error('Puter.js не загружен. Выбери другой режим в «Касса и ИИ».');
    }
    const response = await window.puter.ai.chat(messages, { model: model || 'gpt-4o-mini' });
    if (typeof response === 'string') return response;
    return response?.message?.content || response?.text || '';
  }

  if (!apiKey) {
    throw new Error('Не указан API-ключ. Зайди в «Касса и ИИ» → «Настройки и ИИ» и вставь ключ.');
  }

  // 2. Google Gemini
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
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || `Ошибка Gemini (${res.status})`);
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  // 3. Anthropic Claude
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
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || `Ошибка Claude (${res.status})`);
    return data?.content?.[0]?.text || '';
  }

  // 4. OpenAI-совместимые (Mistral, OpenRouter, Groq, DeepSeek, OpenAI, Custom)
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
      temperature: 0.85,
      max_tokens: 1200
    })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || `Ошибка сервера (${res.status})`;
    if (res.status === 429) {
      throw new Error('Сервер перегружен запросами (429). Подожди 5 секунд или включи Встроенный режим.');
    }
    throw new Error(msg);
  }

  return data?.choices?.[0]?.message?.content || '';
}

/** Локальный умный движок диалогов (работает без интернета и ключей) */
function runOfflineClientAI(messages) {
  const sys = messages.find((m) => m.role === 'system')?.content || '';
  if (!sys) return 'Работаю мгновенно!';

  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  const lower = lastUser.toLowerCase();

  const occasion = (sys.match(/Повод покупки:\s*(.+?)\./) || [])[1] || 'особый случай';
  const budget = Number((sys.match(/Максимальный бюджет:\s*(\d+)/) || [])[1]) || 1000;
  const pref = (sys.match(/Скрытое предпочтение\/запрет:\s*(.+?)\./) || [])[1] || '';
  const isGrumpy = sys.includes('ворчливый') || sys.includes('требовательный');

  // 1. Первое приветствие
  if (lower.includes('ты только что вошёл')) {
    const greet = isGrumpy
      ? `Добрый день. Мне нужен достойный вариант на повод «${occasion}», только без лишней безвкусицы.`
      : `Здравствуйте! Как у вас уютно пахнет цветами. Подбираю что-нибудь красивое — повод: ${occasion}!`;
    return JSON.stringify({ reply: greet, moodChange: 0, dealStatus: 'talking' });
  }

  // 2. Оценка предложения букета или цветка
  if (lastUser.startsWith('[Предложение продавца]')) {
    const offeredPrice = Number((lastUser.match(/за\s+(\d+)\s*₽/) || [])[1]) || 0;
    const freshnessMatch = lastUser.match(/свежесть\s+(\d+)%/);
    const freshness = freshnessMatch ? Number(freshnessMatch[1]) : 90;

    if (freshness < 35) {
      return JSON.stringify({
        reply: `Ой, да эти цветы уже почти завяли (свежесть ${freshness}%)! Я такое брать не буду, предложите свежие.`,
        moodChange: -15,
        dealStatus: 'talking'
      });
    }

    if (pref.includes('ненавидит белые лилии') && lower.includes('лили')) {
      return JSON.stringify({
        reply: 'Только не лилии! У меня от них голова болит. Давайте заменим на другие цветы.',
        moodChange: -12,
        dealStatus: 'talking'
      });
    }

    if (pref.includes('не любит ромашки') && lower.includes('ромаш')) {
      return JSON.stringify({
        reply: 'Ромашки как-то совсем простовато выглядят для меня... Есть что-то поинтереснее?',
        moodChange: -10,
        dealStatus: 'talking'
      });
    }

    if (offeredPrice > budget * 1.15) {
      const target = Math.round(budget * 0.95);
      return JSON.stringify({
        reply: `Дороговато, ${offeredPrice} ₽ я не потяну! Мой потолок около ${target} ₽ — сделаете скидку или подберём скромнее?`,
        moodChange: -5,
        dealStatus: 'talking'
      });
    }

    return JSON.stringify({
      reply: isGrumpy
        ? `Ладно, за ${offeredPrice} ₽ вполне достойно. Беру, заверните аккуратнее!`
        : `Ой, какая красота! Цена ${offeredPrice} ₽ мне идеально подходит — с радостью забираю!`,
      moodChange: 15,
      dealStatus: 'bought'
    });
  }

  // 3. Ответы на обычные сообщения игрока
  if (lower.includes('бюджет') || lower.includes('сумм') || lower.includes('цен') || lower.includes('сколько')) {
    return JSON.stringify({
      reply: `Рассчитываю уложиться примерно в ${budget} ₽. Что можете предложить?`,
      moodChange: 2,
      dealStatus: 'talking'
    });
  }

  if (lower.includes('люб') || lower.includes('хот') || lower.includes('пожел') || lower.includes('вкус') || lower.includes('предпоч')) {
    return JSON.stringify({
      reply: `Если честно, ${pref}. Покажете готовый вариант или соберёте что-нибудь?`,
      moodChange: 5,
      dealStatus: 'talking'
    });
  }

  if (lower.includes('дурак') || lower.includes('уходи') || lower.includes('пошёл')) {
    return JSON.stringify({
      reply: 'Ну знаете! С таким отношением я лучше пойду в другой магазин.',
      moodChange: -20,
      dealStatus: 'left'
    });
  }

  return JSON.stringify({
    reply: `Хорошо! Напоминаю, повод — ${occasion}, бюджет до ${budget} ₽. Нажмите «Предложить букет или цветок», посмотрю ваш вариант!`,
    moodChange: 3,
    dealStatus: 'talking'
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Быстрый тест связи с ИИ из экрана настроек */
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
/** Оценка нового поста в соцсети InstaFlower */
export async function evaluateInstaPost({ type, caption, hashtags, detailsText }) {
  if (aiSettings.provider === 'offline') {
    await sleep(320);
    return runOfflineInstaPost({ type, caption, hashtags, detailsText });
  }

  const prompt = `Ты — симулятор живой аудитории соцсети InstaFlower.
Флорист магазина "Fleur Atelier" (сейчас ${gameState.followers} подписчиков, атмосфера ${gameState.mood}%) выложил пост:
- Что на фото: ${type === 'bouquet' ? 'Собранный букет' : 'Интерьер витрины магазина'} (${detailsText}).
- Текст поста: "${caption || '(без текста)'}".
- Хэштеги: ${hashtags.join(' ') || '(нет)'}.

Оцени пост ЧЕСТНО, как в жизни (пост может не залететь, особенно если нет текста или скучно, а может залететь в рекомендации!):
1. likes: число от 2 до 120.
2. followerDelta: число от -1 до +25 (может быть 0, если пост обычный).
3. verdict: короткий статус ("Залетело в тренды 🔥" / "Тёплый отклик 🌸" / "Скромный охват" / "Не зашло 😕").
4. comments: массив из 2–3 коротких живых комментариев на русском. ВАЖНО: придумывай обычные житейские ники людей (например @elena_94, @artem.k, @dasha_v, @mikhail_spb) — НЕ используй слова flowers/buket/flora в никах!

ОТВЕЧАЙ СТРОГО ОДНИМ ВАЛИДНЫМ JSON БЕЗ MARKDOWN:
{"likes": 12, "followerDelta": 2, "verdict": "Тёплый отклик 🌸", "comments": [{"author": "@elena_94", "text": "Очень нежно!"}]}`;

  try {
    const raw = await callAI([{ role: 'user', content: prompt }]);
    const cleaned = String(raw || '').replace(/```json/gi, '').replace(/```/g, '').trim();
    const s = cleaned.indexOf('{');
    const e = cleaned.lastIndexOf('}');
    if (s !== -1 && e > s) {
      const parsed = JSON.parse(cleaned.slice(s, e + 1));
      return {
        likes: Math.max(0, Number(parsed.likes) || 5),
        followerDelta: Math.max(-3, Math.min(40, Number(parsed.followerDelta) || 0)),
        verdict: String(parsed.verdict || 'Опубликовано'),
        comments: Array.isArray(parsed.comments) ? parsed.comments.slice(0, 3) : []
      };
    }
  } catch (err) {
    console.warn('Fallback оценки поста:', err);
  }
  return runOfflineInstaPost({ type, caption, hashtags, detailsText });
}

function runOfflineInstaPost({ caption, hashtags }) {
  const textLen = (caption || '').trim().length;
  const tagCount = hashtags.length;
  const roll = Math.random();

  if (textLen < 4 && tagCount === 0) {
    return {
      likes: 2 + Math.floor(Math.random() * 5),
      followerDelta: 0,
      verdict: 'Пост не зашёл 😕 (пусто без текста)',
      comments: [{ author: '@masha_99', text: 'А где описание и цена?' }]
    };
  }
  if (roll > 0.72 || (textLen > 20 && tagCount >= 2 && roll > 0.35)) {
    const gain = 4 + Math.floor(Math.random() * 14);
    return {
      likes: 28 + Math.floor(Math.random() * 55) + Math.round(gameState.followers * 0.2),
      followerDelta: gain,
      verdict: 'Залетело в рекомендации 🔥',
      comments: [
        { author: '@kate_m', text: 'Вау, какие нежные оттенки! Подписалась 💐' },
        { author: '@artem_v', text: 'Сохранил себе, скоро забегу за таким же!' }
      ]
    };
  }
  const smallGain = Math.random() > 0.4 ? 1 + Math.floor(Math.random() * 3) : 0;
  return {
    likes: 6 + Math.floor(Math.random() * 16),
    followerDelta: smallGain,
    verdict: 'Спокойный охват 🌸',
    comments: [
      { author: '@olga_sun', text: 'Очень мило и уютно смотрится!' }
    ]
  };
}

/** Генерация нового входящего сообщения в Direct */
export async function generateDirectMessage() {
  const flowerKeys = Object.keys(FLOWERS_CATALOG);
  const randomFlowerId = flowerKeys[Math.floor(Math.random() * flowerKeys.length)];
  const randomFlower = FLOWERS_CATALOG[randomFlowerId];
  const qty = 3 + Math.floor(Math.random() * 3);
  const reward = randomFlower.price * qty + 120;

  if (aiSettings.provider === 'offline') {
    await sleep(250);
    return createFallbackDirectMessage(randomFlowerId, randomFlower.name, qty, reward);
  }

  const prompt = `Сгенерируй одно входящее сообщение в Direct для цветочного магазина "Fleur Atelier" (подписчиков: ${gameState.followers}).
Выбери ОДИН случайный тип:
- "preorder": клиент просит предзаказ на ${qty} шт. "${randomFlower.name}" (награда ${reward} ₽).
- "question": вопрос про доставку, уход за цветами или график работы.
- "review": тёплый отзыв или лёгкий хейт про цены/упаковку.
ВАЖНО: придумай обычный житейский ник (например @alena_k98, @denis_m, @sveta.life) — БЕЗ слов flowers/buket/flora в нике!

ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{
  "senderName": "@обычный_ник",
  "kind": "preorder" | "question" | "review",
  "text": "короткое сообщение клиента 1-2 предложения"
}`;

  try {
    const raw = await callAI([{ role: 'user', content: prompt }]);
    const cleaned = String(raw || '').replace(/```json/gi, '').replace(/```/g, '').trim();
    const s = cleaned.indexOf('{');
    const e = cleaned.lastIndexOf('}');
    if (s !== -1 && e > s) {
      const parsed = JSON.parse(cleaned.slice(s, e + 1));
      const kind = ['preorder', 'question', 'review'].includes(parsed.kind) ? parsed.kind : 'question';
      return {
        id: 'dm_' + Date.now(),
        senderName: String(parsed.senderName || '@alina_k98'),
        kind,
        text: String(parsed.text || 'Здравствуйте! Подскажите, есть ли свежие цветы?'),
        order: kind === 'preorder' ? { typeId: randomFlowerId, qty, reward, done: false } : null,
        replyText: null
      };
    }
  } catch (err) {
    console.warn('Fallback Direct:', err);
  }
  return createFallbackDirectMessage(randomFlowerId, randomFlower.name, qty, reward);
}

function createFallbackDirectMessage(typeId, flowerName, qty, reward) {
  const roll = Math.random();
  if (roll < 0.45) {
    return {
      id: 'dm_' + Date.now(),
      senderName: '@marina_sv',
      kind: 'preorder',
      text: `Здравствуйте! Можно заказать ${qty} шт. «${flowerName}» с оформлением? Готова забрать за ${reward} ₽!`,
      order: { typeId, qty, reward, done: false },
      replyText: null
    };
  }
  if (roll < 0.75) {
    return {
      id: 'dm_' + Date.now(),
      senderName: '@igor_msk',
      kind: 'question',
      text: 'Добрый день! Подскажите, как лучше ухаживать за букетом дома, чтобы дольше стоял?',
      order: null,
      replyText: null
    };
  }
  return {
    id: 'dm_' + Date.now(),
    senderName: '@vika_life',
    kind: 'review',
    text: 'Видела ваши букеты в ленте — цвета красивые, но кажется цены чуть выше средних по району.',
    order: null,
    replyText: null
  };
}
````

## File: js/config.js
````javascript
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
    shortName: 'Роза',
    color: 'красный',
    price: 220,
    wholesalePrice: 110,
    decayPerShift: 8,
    vaseColor: '#EBD9CE'
  },
  peony_pink: {
    id: 'peony_pink',
    name: 'Розовый пион',
    shortName: 'Пион',
    color: 'розовый',
    price: 320,
    wholesalePrice: 165,
    decayPerShift: 10,
    vaseColor: '#DCE6DB'
  },
  tulip_yellow: {
    id: 'tulip_yellow',
    name: 'Жёлтый тюльпан',
    shortName: 'Тюльпан',
    color: 'жёлтый',
    price: 160,
    wholesalePrice: 75,
    decayPerShift: 7,
    vaseColor: '#E9DFCF'
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
  puter: {
    id: 'puter',
    name: 'Puter.js (Если есть аккаунт)',
    needsKey: false,
    defaultBaseUrl: '',
    defaultModel: 'gpt-4o-mini'
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
  { id: 'none', name: 'Без упаковки', price: 0, color: 'transparent', accent: 'transparent' },
  { id: 'craft', name: 'Крафт-бумага', price: 60, color: '#D9B99B', accent: '#C49F7E' },
  { id: 'pink_film', name: 'Пудровая плёнка', price: 90, color: '#F5CBD0', accent: '#E8A9B2' },
  { id: 'sage_paper', name: 'Шалфейная бумага', price: 100, color: '#C6D8C5', accent: '#A6BEA5' }
];

export const RIBBONS = [
  { id: 'none', name: 'Без ленты', price: 0, color: 'transparent' },
  { id: 'twine', name: 'Бечёвка', price: 20, color: '#A88C72' },
  { id: 'satin_rose', name: 'Розовая лента', price: 45, color: '#E07A86' },
  { id: 'gold', name: 'Золотая лента', price: 60, color: '#DFAB4E' }
];
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
    icon: '❄️',
    price: 1900,
    effectText: 'Цветы вянут на 35% медленнее!',
    moodBonus: 8
  },
  {
    id: 'neon_sign',
    name: 'Тёплая вывеска «Fleur»',
    place: 'Магазин',
    icon: '✨',
    price: 750,
    effectText: '+6% к атмосфере и красивее фото витрины',
    moodBonus: 6
  },
  {
    id: 'vintage_wallpaper',
    name: 'Винтажные обои',
    place: 'Магазин',
    icon: '🖼️',
    price: 650,
    effectText: '+5% к уюту магазина',
    moodBonus: 5
  },
  {
    id: 'cozy_lamp',
    name: 'Тёплый торшер',
    place: 'Квартира',
    icon: '🛋️',
    price: 550,
    effectText: 'Уютное освещение дома (+4% к атмосфере)',
    moodBonus: 4
  },
  {
    id: 'cat_bed',
    name: 'Лежанка с игрушкой',
    place: 'Квартира',
    icon: '🧶',
    price: 600,
    effectText: 'Радость для домашнего питомца (+5% к атмосфере)',
    moodBonus: 5
  },
  {
    id: 'bookshelf',
    name: 'Полка с книгами по ботанике',
    place: 'Квартира',
    icon: '📚',
    price: 820,
    effectText: 'Вдохновение и +5% к атмосфере',
    moodBonus: 5
  }
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
  if (m === 2 && d === 14) return { name: 'День Влюблённых (14 Февраля)', demandMult: 3, priceMult: 2 };
  if (m === 3 && d === 8) return { name: 'Праздник Весны (8 Марта)', demandMult: 3, priceMult: 2 };
  return null;
}
````

## File: js/main.js
````javascript
import { WEATHERS, getGameDateObj, getSeasonInfo, getWeatherForSeason } from './config.js';
import { gameState, saveState } from './state.js';
import { renderShopScreen } from './screens/shopScreen.js';
import { renderPhoneScreen } from './screens/phoneScreen.js';
import { renderHomeScreen } from './screens/homeScreen.js';
import { renderFinanceSettingsScreen } from './screens/financeSettingsScreen.js';
import { playClickSound, setAmbientMode } from './sound.js';

const AUTH_UNLOCK_KEY = 'fleur_atelier_unlocked_v1';
const SECRET_PASSWORD = 'ШамильАлияНавсегда';

let ambientStarted = false;

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
            type="password"
            class="form-input"
            id="lock-password-input"
            autocomplete="off"
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
    const hidden = input.type === 'password';
    input.type = hidden ? 'text' : 'password';
    eyeBtn.textContent = hidden ? '🙈' : '👁️';
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
  if (!gameState.isSetupDone) {
    showWelcomeSetupModal();
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

      navButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      screens.forEach((screen) => {
        screen.classList.toggle('active', screen.id === `screen-${target}`);
      });

      if (target === 'shop') {
        renderShopScreen(updateHud, showToast);
      } else if (target === 'phone') {
        renderPhoneScreen(updateHud, showToast);
      } else if (target === 'home') {
        renderHomeScreen(updateHud, showToast);
      } else if (target === 'finance') {
        renderFinanceSettingsScreen(updateHud, showToast);
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
        <input type="text" class="form-input" id="setup-shop-name" value="${escapeAttr(gameState.shopName || 'Fleur Atelier')}" maxlength="24" />
      </div>

      <div class="form-group">
        <label class="form-label" for="setup-insta-handle">Ник канала в InstaFlower</label>
        <input type="text" class="form-input" id="setup-insta-handle" value="${escapeAttr(gameState.instaHandle || '@fleur_atelier')}" maxlength="24" />
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
}

export function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
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
````

## File: js/sound.js
````javascript
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
````

## File: js/state.js
````javascript
import {
  STORAGE_KEY,
  AI_SETTINGS_KEY,
  FLOWERS_CATALOG,
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
    { uid: 'vase_6', typeId: 'lily_white', qty: 6, freshness: 85, discounted: false, wateredThisShift: false }
  ];
}

export function createInitialState() {
  const startDate = '2026-02-08';
  const season = getSeasonInfo(getGameDateObj(startDate, 0));

  return {
    isSetupDone: false,
    shopName: 'Fleur Atelier',
    instaHandle: '@fleur_atelier',
    startDate,
    openHour: 9,
    closeHour: 21,
    money: 3500,
    day: 1,
    timeIndex: 0, // 0: Утро, 1: День, 2: Вечер
    timeMinutes: 9 * 60,
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
    readyBouquets: [],
    savedPhotos: [],
    currentBouquet: {
      stems: [],
      wrappingId: 'craft',
      ribbonId: 'satin_rose'
    },
    instaPosts: [],
    directMessages: [],
    wholesaleDay: 0,
    wholesaleDeals: [],
    energy: 100,
    petName: 'Пискля',
    petMood: 80,
    petFedToday: false,
    powerOutage: false,
    candlesLit: false,
    rentWarning: false,
    decor: []
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
    if (!Array.isArray(state.readyBouquets)) state.readyBouquets = [];
    if (!Array.isArray(state.savedPhotos)) state.savedPhotos = [];
    if (!Array.isArray(state.instaPosts)) state.instaPosts = [];
    if (!Array.isArray(state.directMessages)) state.directMessages = [];
    if (!Array.isArray(state.wholesaleDeals)) state.wholesaleDeals = [];
    if (!Array.isArray(state.decor)) state.decor = [];
    if (!state.currentBouquet || !Array.isArray(state.currentBouquet.stems)) {
      state.currentBouquet = { stems: [], wrappingId: 'craft', ribbonId: 'satin_rose' };
    }
    if (typeof state.timeMinutes !== 'number') {
      state.timeMinutes = (state.openHour || 9) * 60;
    }
    if (!state.petName) state.petName = 'Пискля';
    if (!state.shopName) state.shopName = 'Fleur Atelier';
    if (!state.instaHandle) state.instaHandle = '@fleur_atelier';
    if (!state.startDate) state.startDate = '2026-02-08';

    // Если старый сейв с прогрессом — не мешаем, а если свежий День 1 — покажем окно настройки
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

/** Продвинуть время на следующую смену в рамках часов работы */
export function advanceShift() {
  const openMin = (gameState.openHour || 9) * 60;
  const closeMin = (gameState.closeHour || 21) * 60;
  const midMin = Math.round((openMin + closeMin) / 2);
  const eveMin = Math.max(openMin + 60, closeMin - 90);

  gameState.timeIndex += 1;
  if (gameState.timeIndex > 2) {
    gameState.timeIndex = 0;
    gameState.timeMinutes = openMin;
    gameState.day += 1;
    gameState.daysUntilRent = Math.max(0, gameState.daysUntilRent - 1);
    const season = getSeasonInfo(getGameDateObj(gameState.startDate, gameState.day - 1));
    gameState.weather = getWeatherForSeason(season.id);
  } else {
    gameState.timeMinutes = gameState.timeIndex === 1 ? midMin : eveMin;
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
````

## File: index.html
````html
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
          <div class="top-date" id="hud-date">День 1 • Утро</div>
          <div class="stat-pill" id="hud-weather">☀️ Солнечно</div>
        </div>
        <div class="top-bar-row">
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
````

## File: manifest.json
````json
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
````

## File: sw.js
````javascript
const CACHE_NAME = 'fleur-atelier-v6';
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
  './js/screens/shopScreen.js',
  './js/screens/bouquetMaker.js',
  './js/screens/phoneScreen.js',
  './js/screens/homeScreen.js',
  './js/screens/financeSettingsScreen.js'
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
````
