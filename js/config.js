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