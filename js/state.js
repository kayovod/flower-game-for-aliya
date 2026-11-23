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
    deliveries: [],
    floristTasks: [],
    jobPostings: [],
    employees: [],
    franchises: [],
    franchiseLedger: [],
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
    if (!Array.isArray(state.deliveries)) state.deliveries = [];
    if (!Array.isArray(state.floristTasks)) state.floristTasks = [];
    if (!Array.isArray(state.jobPostings)) state.jobPostings = [];
    if (!Array.isArray(state.employees)) state.employees = [];
    state.employees = state.employees.map((e) => ({ branchId: null, ...e }));
    if (!Array.isArray(state.franchises)) state.franchises = [];
    if (!Array.isArray(state.franchiseLedger)) state.franchiseLedger = [];
    if (typeof state.lastAutoDmKey !== 'string') state.lastAutoDmKey = '';
    state.directMessages = state.directMessages.map((dm) => ({
      read: Boolean(dm.replyText || dm.rejected || (dm.order && dm.order.done)),
      thread: Array.isArray(dm.thread) ? dm.thread : [],
      blockedByPlayer: Boolean(dm.blockedByPlayer),
      blockedByClient: Boolean(dm.blockedByClient),
      jobApplication: dm.jobApplication || null,
      employeeId: dm.employeeId || null,
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
  const count = Math.min(shuffled.length, Math.random() < 0.5 ? 5 : 6);
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

export function isShopClosedNow() {
  const closeMin = (gameState.closeHour || 21) * 60;
  return (gameState.timeMinutes || 540) >= closeMin;
}

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