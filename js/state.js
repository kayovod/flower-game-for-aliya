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