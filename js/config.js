export const STORAGE_KEY = 'fleur_atelier_save_v1';
export const AI_SETTINGS_KEY = 'fleur_atelier_ai_v1';

export const AI_PROVIDERS = {
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter (Рекомендуется)',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'baidu/ernie-5.5-flash-preview:free',
    needsKey: true,
    hint: 'Вставь ключ OpenRouter (sk-or-...). Бесплатные или быстрые модели работают сразу из браузера!'
  },
  puter: {
    id: 'puter',
    name: 'Puter AI (Без API-ключа)',
    baseUrl: '',
    defaultModel: 'gpt-4o-mini',
    needsKey: false,
    hint: 'Работает без API-ключа через Puter.js (вход через всплывающее окно Puter при первом запросе).'
  },
  groq: {
    id: 'groq',
    name: 'Groq (Очень быстрый)',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.1-8b-instant',
    needsKey: true,
    hint: 'Быстрый бесплатный API от Groq (ключ gsk_...).'
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini (Нативный API)',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-2.5-flash',
    needsKey: true,
    hint: 'Ключ от Google AI Studio (AIza...). Используй gemini-2.5-flash или gemini-2.0-flash.'
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-small-latest',
    needsKey: true,
    hint: 'API-ключ от Mistral AI (console.mistral.ai).'
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    needsKey: true,
    hint: 'Ключ от OpenAI (sk-...).'
  },
  custom: {
    id: 'custom',
    name: 'Свой OpenAI-совместимый URL',
    baseUrl: '',
    defaultModel: '',
    needsKey: true,
    hint: 'Любой прокси или локальный сервер с /chat/completions.'
  }
};

export const FLOWERS_CATALOG = {
  rose_red: {
    id: 'rose_red',
    name: 'Красная роза',
    shortName: 'Кр. роза',
    price: 220,
    wholesalePrice: 120,
    decayPerShift: 12,
    color: '#D95364',
    accent: '#9E2B3B',
    stemColor: '#5B875B',
    shape: 'rose',
    desc: 'Классика любви и ярких признаний'
  },
  rose_white: {
    id: 'rose_white',
    name: 'Белая роза',
    shortName: 'Бел. роза',
    price: 230,
    wholesalePrice: 125,
    decayPerShift: 13,
    color: '#FFFDF8',
    accent: '#EADFD5',
    stemColor: '#668E64',
    shape: 'rose',
    desc: 'Нежность для свадеб и чистых намерений'
  },
  rose_pink: {
    id: 'rose_pink',
    name: 'Розовая роза',
    shortName: 'Роз. роза',
    price: 225,
    wholesalePrice: 120,
    decayPerShift: 12,
    color: '#F29AA4',
    accent: '#D46877',
    stemColor: '#5D8A5D',
    shape: 'rose',
    desc: 'Романтичная и мягкая, как закат'
  },
  peony_pink: {
    id: 'peony_pink',
    name: 'Розовый пион',
    shortName: 'Пион',
    price: 340,
    wholesalePrice: 190,
    decayPerShift: 18,
    color: '#F6B1BE',
    accent: '#D87C8F',
    stemColor: '#689365',
    shape: 'peony',
    desc: 'Пышный, ароматный и очень желанный цветок'
  },
  tulip_yellow: {
    id: 'tulip_yellow',
    name: 'Жёлтый тюльпан',
    shortName: 'Тюльпан',
    price: 150,
    wholesalePrice: 80,
    decayPerShift: 15,
    color: '#F6CA51',
    accent: '#D9A023',
    stemColor: '#72A263',
    shape: 'tulip',
    desc: 'Весеннее солнце в ладонях, дарит улыбку'
  },
  chamomile_white: {
    id: 'chamomile_white',
    name: 'Полевая ромашка',
    shortName: 'Ромашка',
    price: 120,
    wholesalePrice: 60,
    decayPerShift: 14,
    color: '#FFFFFF',
    accent: '#F0BD43',
    stemColor: '#76A469',
    shape: 'daisy',
    desc: 'Искренняя, уютная и лёгкая полевая радость'
  },
  lavender_purple: {
    id: 'lavender_purple',
    name: 'Веточка лаванды',
    shortName: 'Лаванда',
    price: 170,
    wholesalePrice: 90,
    decayPerShift: 6,
    color: '#A78CC9',
    accent: '#7D60A6',
    stemColor: '#789A7B',
    shape: 'lavender',
    desc: 'Долго хранится и наполняет комнату Провансом'
  },
  lily_white: {
    id: 'lily_white',
    name: 'Белая лилия',
    shortName: 'Лилия',
    price: 310,
    wholesalePrice: 170,
    decayPerShift: 14,
    color: '#FFFBF3',
    accent: '#E9C66B',
    stemColor: '#5B845B',
    shape: 'lily',
    desc: 'Торжественная, изящная, с сильным ароматом'
  },
  sunflower: {
    id: 'sunflower',
    name: 'Подсолнух',
    shortName: 'Подсолнух',
    price: 210,
    wholesalePrice: 110,
    decayPerShift: 11,
    color: '#F7BD31',
    accent: '#63432D',
    stemColor: '#679256',
    shape: 'sunflower',
    desc: 'Маленькое солнце, заряжающее энергией'
  },
  orchid_purple: {
    id: 'orchid_purple',
    name: 'Сиреневая орхидея',
    shortName: 'Орхидея',
    price: 390,
    wholesalePrice: 220,
    decayPerShift: 10,
    color: '#D58CD4',
    accent: '#9E4B9E',
    stemColor: '#638E63',
    shape: 'orchid',
    desc: 'Экзотический акцент для особых случаев'
  },
  hydrangea_blue: {
    id: 'hydrangea_blue',
    name: 'Голубая гортензия',
    shortName: 'Гортензия',
    price: 420,
    wholesalePrice: 240,
    decayPerShift: 19,
    color: '#93BEEB',
    accent: '#6290C8',
    stemColor: '#618C62',
    shape: 'hydrangea',
    desc: 'Воздушное облако лепестков, но любит воду'
  },
  gypsophila: {
    id: 'gypsophila',
    name: 'Гипсофила',
    shortName: 'Гипсофила',
    price: 130,
    wholesalePrice: 65,
    decayPerShift: 7,
    color: '#FFFFFF',
    accent: '#E9DFD6',
    stemColor: '#7CA37B',
    shape: 'gypsophila',
    desc: 'Воздушная дымка, делающая любой букет нежнее'
  },
  eucalyptus: {
    id: 'eucalyptus',
    name: 'Ветка эвкалипта',
    shortName: 'Эвкалипт',
    price: 140,
    wholesalePrice: 70,
    decayPerShift: 5,
    color: '#88AE8E',
    accent: '#5E8667',
    stemColor: '#64896A',
    shape: 'eucalyptus',
    desc: 'Стильная зелень со свежим ароматом'
  }
};

export const ACCESSORIES_CATALOG = {
  balloon_heart: {
    id: 'balloon_heart',
    name: 'Шар-сердце «Люблю»',
    shortName: 'Шар-сердце',
    category: 'Воздушный шар',
    icon: '🎈',
    wholesalePrice: 90,
    price: 190,
    desc: 'Фольгированный пастельный шар в форме сердца'
  },
  balloon_set: {
    id: 'balloon_set',
    name: 'Связка 3 шаров пастель',
    shortName: 'Связка шаров',
    category: 'Воздушные шары',
    icon: '🎉',
    wholesalePrice: 170,
    price: 340,
    desc: 'Воздушное облако кремовых и пудровых шариков'
  },
  plush_bear: {
    id: 'plush_bear',
    name: 'Плюшевый мишка Тоффи',
    shortName: 'Мишка Тоффи',
    category: 'Мягкая игрушка',
    icon: '🧸',
    wholesalePrice: 260,
    price: 520,
    desc: 'Мягкий карамельный мишка с атласным бантиком'
  },
  plush_bunny: {
    id: 'plush_bunny',
    name: 'Зайка в вязаном шарфе',
    shortName: 'Зайка в шарфе',
    category: 'Мягкая игрушка',
    icon: '🐰',
    wholesalePrice: 280,
    price: 560,
    desc: 'Уютный плюшевый зайчик к нежному букету'
  },
  chocolates_box: {
    id: 'chocolates_box',
    name: 'Конфеты ручной работы',
    shortName: 'Конфеты',
    category: 'Сладости',
    icon: '🍫',
    wholesalePrice: 220,
    price: 450,
    desc: 'Бельгийский трюфель и пралине в подарочной коробке'
  },
  macarons_box: {
    id: 'macarons_box',
    name: 'Коробочка макаронс (6 шт.)',
    shortName: 'Макаронс',
    category: 'Сладости',
    icon: '🧁',
    wholesalePrice: 240,
    price: 490,
    desc: 'Малиновые и фисташковые пирожные к цветам'
  },
  greeting_card: {
    id: 'greeting_card',
    name: 'Дизайнерская открытка',
    shortName: 'Открытка',
    category: 'Открытка',
    icon: '💌',
    wholesalePrice: 40,
    price: 110,
    desc: 'Плотный хлопок и каллиграфия для тёплых слов'
  }
};

export const WRAPPINGS = [
  { id: 'craft', name: 'Крафт-бумага', price: 60, color: '#D7BA98', accent: '#BD9B75' },
  { id: 'pink_film', name: 'Пудровая плёнка', price: 90, color: '#F3C6CD', accent: '#DF9FA9' },
  { id: 'sage_paper', name: 'Шалфейная бумага', price: 85, color: '#C5D9C4', accent: '#9AB79A' },
  { id: 'cream_paper', name: 'Кремовая тишью', price: 95, color: '#FAF0E2', accent: '#E5D3BA' },
  { id: 'newsprint', name: 'Газетный винтаж', price: 75, color: '#E8DFD1', accent: '#C6B9A6' },
  { id: 'none', name: 'Без упаковки', price: 0, color: 'transparent', accent: 'transparent' }
];

export const RIBBONS = [
  { id: 'satin_rose', name: 'Пыльная роза', price: 35, color: '#D98A7C' },
  { id: 'sage', name: 'Оливковая лента', price: 35, color: '#7D9E7F' },
  { id: 'cream', name: 'Молочный шёлк', price: 45, color: '#EFE5D5' },
  { id: 'twine', name: 'Джутовый шпагат', price: 20, color: '#B4926B' },
  { id: 'none', name: 'Без ленты', price: 0, color: 'transparent' }
];

export const TIME_PERIODS = ['Утро', 'День', 'Вечер'];

export const INSTA_HASHTAGS = [
  '#флористика',
  '#уютнаялавка',
  '#свежиецветы',
  '#букетдня',
  '#цветыназаказ',
  '#доставкацветов',
  '#подароклюбимым',
  '#нежность'
];

export const DECOR_CATALOG = [
  {
    id: 'fridge',
    name: 'Цветочный холодильник',
    place: 'Магазин',
    category: 'Оборудование',
    icon: '❄️',
    price: 2200,
    effectText: 'Цветы вянут на 35% медленнее',
    moodBonus: 8
  },
  {
    id: 'garland',
    name: 'Тёплая гирлянда',
    place: 'Магазин',
    category: 'Обычный',
    icon: '✨',
    price: 450,
    effectText: '+5% атмосферы и огонёк уюта',
    moodBonus: 5
  },
  {
    id: 'neon_sign',
    name: 'Вывеска для лавки',
    place: 'Магазин',
    category: 'Обычный',
    icon: '✨',
    price: 850,
    effectText: 'Привлекает внимание прохожих (+6%)',
    moodBonus: 6
  },
  {
    id: 'wallpaper',
    name: 'Уютные обои в цветок',
    place: 'Магазин',
    category: 'Обычный',
    icon: '🌸',
    price: 680,
    effectText: 'Стены зала становятся светлее (+5%)',
    moodBonus: 5
  },
  {
    id: 'cat_bed',
    name: 'Лежанка для Пискли',
    place: 'Квартира',
    category: 'Питомец',
    icon: '🛏️',
    price: 550,
    effectText: 'Кошка спит слаще (+8% энергии при сне)',
    moodBonus: 4
  },
  {
    id: 'cat_ball',
    name: 'Мячик для Пискли',
    place: 'Квартира',
    category: 'Питомец',
    icon: '🧶',
    price: 250,
    effectText: 'Игрушка на полу: нажми, чтобы Пискля побежала!',
    moodBonus: 4
  },
  {
    id: 'cat_tower',
    name: 'Домик-когтеточка для кошки',
    place: 'Квартира',
    category: 'Питомец',
    icon: '🏰',
    price: 1100,
    effectText: 'Высокий мягкий игровой комплекс у стены',
    moodBonus: 7
  },
  {
    id: 'floor_lamp',
    name: 'Торшер с тёплым светом',
    place: 'Квартира',
    category: 'Обычный',
    icon: '🛋️',
    price: 750,
    effectText: 'Тёплое свечение в комнате по вечерам',
    moodBonus: 5
  },
  {
    id: 'home_sofa',
    name: 'Уютный плюшевый диван',
    place: 'Квартира',
    category: 'Обычный',
    icon: '🛋️',
    price: 1400,
    effectText: 'Мягкий диван с подушками в комнате (+7%)',
    moodBonus: 7
  },
  {
    id: 'home_rug',
    name: 'Мягкий пудровый коврик',
    place: 'Квартира',
    category: 'Обычный',
    icon: '🧶',
    price: 520,
    effectText: 'Тёплый круглый коврик в центре комнаты',
    moodBonus: 4
  },
  {
    id: 'home_curtains',
    name: 'Кружевные шторы',
    place: 'Квартира',
    category: 'Обычный',
    icon: '🎀',
    price: 490,
    effectText: 'Нежные занавески на окне дома',
    moodBonus: 4
  },
  {
    id: 'home_bookshelf',
    name: 'Книжная полка с плющом',
    place: 'Квартира',
    category: 'Обычный',
    icon: '📚',
    price: 680,
    effectText: 'Ботанические атласы и свисающий плющ',
    moodBonus: 5
  },
  {
    id: 'home_plant',
    name: 'Фикус в керамическом кашпо',
    place: 'Квартира',
    category: 'Обычный',
    icon: '🌿',
    price: 590,
    effectText: 'Большое живое растение в углу комнаты',
    moodBonus: 5
  },
  {
    id: 'home_fairy_lights',
    name: 'Гирлянда-штора дома',
    place: 'Квартира',
    category: 'Обычный',
    icon: '✨',
    price: 620,
    effectText: 'Мягкие огонёчки под потолком квартиры',
    moodBonus: 5
  },
  {
    id: 'shop_arch',
    name: 'Цветочная арка у входа',
    place: 'Магазин',
    category: 'Обычный',
    icon: '🌿',
    price: 920,
    effectText: 'Роскошная зелёная арка над прилавком (+7%)',
    moodBonus: 7
  },
  {
    id: 'shop_pumpkins',
    name: 'Декоративные тыковки (Осень)',
    place: 'Магазин',
    category: 'Сезонный',
    icon: '🎃',
    price: 380,
    effectText: 'Осенний уют на деревянной полке (+4%)',
    moodBonus: 4
  },
  {
    id: 'shop_xmas_tree',
    name: 'Нарядная ёлочка (Зима)',
    place: 'Магазин',
    category: 'Сезонный',
    icon: '🎄',
    price: 890,
    effectText: 'Зимнее волшебство в лавке (+7%)',
    moodBonus: 7
  },
  {
    id: 'shop_hearts',
    name: 'Гирлянда из сердечек (Праздники)',
    place: 'Магазин',
    category: 'Сезонный',
    icon: '💕',
    price: 420,
    effectText: 'Романтичное украшение для особых дат (+5%)',
    moodBonus: 5
  },
  {
    id: 'home_pumpkins',
    name: 'Осенний декор (тыковки дома)',
    place: 'Квартира',
    category: 'Сезонный',
    icon: '🍂',
    price: 340,
    effectText: 'Тёплая осенняя композиция на полу',
    moodBonus: 4
  },
  {
    id: 'home_xmas_tree',
    name: 'Домашняя мини-ёлка с гирляндой',
    place: 'Квартира',
    category: 'Сезонный',
    icon: '🎄',
    price: 790,
    effectText: 'Новогодний огонёк для тебя и Пискли',
    moodBonus: 6
  },
  {
    id: 'home_hearts',
    name: 'Сердечки-подвески дома',
    place: 'Квартира',
    category: 'Сезонный',
    icon: '💖',
    price: 350,
    effectText: 'Милые сердечки на стене комнаты',
    moodBonus: 4
  },
  {
    id: 'vintage_gramophone',
    name: 'Винтажный граммофон',
    place: 'Магазин',
    category: 'Антиквариат',
    isRare: true,
    icon: '📻',
    price: 1650,
    effectText: 'Редкий антикварный шарм (+8% атмосферы)',
    moodBonus: 8
  },
  {
    id: 'crystal_vase_rare',
    name: 'Хрустальная ваза XIX века',
    place: 'Магазин',
    category: 'Антиквариат',
    isRare: true,
    icon: '🏺',
    price: 1450,
    effectText: 'Роскошный антиквариат на полке (+7%)',
    moodBonus: 7
  },
  {
    id: 'gold_frame_art',
    name: 'Картина с пионами в золотой раме',
    place: 'Магазин',
    category: 'Антиквариат',
    isRare: true,
    icon: '🖼️',
    price: 1350,
    effectText: 'Настоящее масло на стене лавки (+7%)',
    moodBonus: 7
  },
  {
    id: 'antique_cashbox',
    name: 'Медный винтажный кассовый аппарат',
    place: 'Магазин',
    category: 'Антиквариат',
    isRare: true,
    icon: '🗝️',
    price: 1900,
    effectText: 'Гордость прилавка и удача в торгах (+8%)',
    moodBonus: 8
  },
  {
    id: 'porcelain_swan',
    name: 'Фарфоровый лебедь',
    place: 'Магазин',
    category: 'Антиквариат',
    isRare: true,
    icon: '🦢',
    price: 1200,
    effectText: 'Хрупкая коллекционная статуэтка (+6%)',
    moodBonus: 6
  },
  {
    id: 'tiffany_lamp_rare',
    name: 'Витражная лампа Тиффани',
    place: 'Квартира',
    category: 'Антиквариат',
    isRare: true,
    icon: '🪔',
    price: 1750,
    effectText: 'Цветные отблески на стенах комнаты (+7%)',
    moodBonus: 7
  },
  {
    id: 'vintage_mirror',
    name: 'Резное трюмо с зеркалом',
    place: 'Квартира',
    category: 'Антиквариат',
    isRare: true,
    icon: '✨',
    price: 1600,
    effectText: 'Антикварное зеркало дома (+7% атмосферы)',
    moodBonus: 7
  },
  {
    id: 'music_box_rare',
    name: 'Музыкальная шкатулка с балериной',
    place: 'Квартира',
    category: 'Антиквариат',
    isRare: true,
    icon: '🎼',
    price: 1300,
    effectText: 'Убаюкивающая мелодия перед сном (+6%)',
    moodBonus: 6
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
  },
  // --- Новый декор для Магазина ---
  {
    id: 'dried_flowers_bundle',
    name: 'Связка сухоцветов под потолок',
    place: 'Магазин',
    category: 'Прованс',
    icon: '🌾',
    price: 540,
    effectText: 'Лаванда, лагурус и злаки на балке (+5% атмосферы)',
    moodBonus: 5
  },
  {
    id: 'birdcage_decor',
    name: 'Ажурная клетка со свечами',
    place: 'Магазин',
    category: 'Винтаж',
    icon: '🕊️',
    price: 780,
    effectText: 'Романтичная винтажная клетка с огоньком (+6%)',
    moodBonus: 6
  },
  {
    id: 'brass_scales',
    name: 'Латунные старинные весы',
    place: 'Магазин',
    category: 'Антиквариат',
    isRare: true,
    icon: '⚖️',
    price: 1290,
    effectText: 'Декоративные весы на прилавок (+7% атмосферы)',
    moodBonus: 7
  },
  {
    id: 'cafe_bistro_table',
    name: 'Кофейный столик для гостей',
    place: 'Магазин',
    category: 'Уют',
    icon: '☕',
    price: 1150,
    effectText: 'Пока букет собирается, гости отдыхают (+7%)',
    moodBonus: 7
  },
  {
    id: 'watering_can_copper',
    name: 'Медная винтажная лейка',
    place: 'Магазин',
    category: 'Флористика',
    icon: '🚿',
    price: 490,
    effectText: 'Блестящая рабочая лейка на полке (+4%)',
    moodBonus: 4
  },
  {
    id: 'wall_clock_retro',
    name: 'Вокзальные резные часы',
    place: 'Магазин',
    category: 'Антиквариат',
    isRare: true,
    icon: '🕰️',
    price: 1420,
    effectText: 'Тёплое тиканье старинных часов (+7% атмосферы)',
    moodBonus: 7
  },
  {
    id: 'stained_glass_sun',
    name: 'Витражный ловец солнца',
    place: 'Магазин',
    category: 'Декор',
    icon: '🌈',
    price: 620,
    effectText: 'Разноцветные солнечные зайчики по залу (+5%)',
    moodBonus: 5
  },
  {
    id: 'terracotta_shelf',
    name: 'Этажерка с суккулентами',
    place: 'Магазин',
    category: 'Ботаника',
    icon: '🌵',
    price: 840,
    effectText: 'Мини-кактусы в глиняных горшочках (+6%)',
    moodBonus: 6
  },
  {
    id: 'macrame_hanger',
    name: 'Макраме-кашпо с папоротником',
    place: 'Магазин',
    category: 'Бохо',
    icon: '🪢',
    price: 580,
    effectText: 'Плетёный подвес с пышной зеленью (+5%)',
    moodBonus: 5
  },
  {
    id: 'open_closed_sign',
    name: 'Резная табличка «Рады гостям»',
    place: 'Магазин',
    category: 'Уют',
    icon: '🪧',
    price: 410,
    effectText: 'Деревянная вывеска с цветочным узором (+4%)',
    moodBonus: 4
  },
  // --- Новый декор для Квартиры ---
  {
    id: 'cat_fountain',
    name: 'Питьевой фонтанчик для кошки',
    place: 'Квартира',
    category: 'Питомец',
    icon: '⛲',
    price: 890,
    effectText: 'Свежая журчащая водичка для Пискли (+6%)',
    moodBonus: 6
  },
  {
    id: 'tea_tray_home',
    name: 'Поднос с чаем и круассаном',
    place: 'Квартира',
    category: 'Уют',
    icon: '🥐',
    price: 460,
    effectText: 'Уютный вечерний перекус дома (+4%)',
    moodBonus: 4
  },
  {
    id: 'star_projector',
    name: 'Ночник-проектор звёздного неба',
    place: 'Квартира',
    category: 'Атмосфера',
    icon: '🌌',
    price: 980,
    effectText: 'Мягкое сияние звёздочек под потолком (+6%)',
    moodBonus: 6
  },
  {
    id: 'wall_tapestry',
    name: 'Тканый гобелен с лугами',
    place: 'Квартира',
    category: 'Бохо',
    icon: '🧶',
    price: 760,
    effectText: 'Ботанический гобелен ручной работы (+5%)',
    moodBonus: 5
  },
  {
    id: 'aquarium_home',
    name: 'Круглый аквариум с рыбкой',
    place: 'Квартира',
    category: 'Живой уголок',
    isRare: true,
    icon: '🐠',
    price: 1380,
    effectText: 'Золотая рыбка, за которой любит следить кошка (+7%)',
    moodBonus: 7
  },
  {
    id: 'herbarium_frame',
    name: 'Гербарий в стеклянной раме',
    place: 'Квартира',
    category: 'Ботаника',
    icon: '🍂',
    price: 530,
    effectText: 'Засушенные пионы и папоротник под стеклом (+5%)',
    moodBonus: 5
  },
  {
    id: 'acoustic_guitar',
    name: 'Акустическая гитара у стены',
    place: 'Квартира',
    category: 'Хобби',
    icon: '🎸',
    price: 1450,
    effectText: 'Тёплые аккорды после закрытия лавки (+7%)',
    moodBonus: 7
  },
  {
    id: 'hanging_chair',
    name: 'Подвесное кресло-кокон',
    place: 'Квартира',
    category: 'Антиквариат',
    isRare: true,
    icon: '🧺',
    price: 2100,
    effectText: 'Плетёное кресло с мягкими подушками (+8%)',
    moodBonus: 8
  },
  {
    id: 'scented_candles_set',
    name: 'Аромасвечи «Лаванда и мёд»',
    place: 'Квартира',
    category: 'Уют',
    icon: '🕯️',
    price: 390,
    effectText: 'Расслабляющий аромат перед сном (+4%)',
    moodBonus: 4
  },
  {
    id: 'cat_scratcher_cactus',
    name: 'Когтеточка-кактус с помпоном',
    place: 'Квартира',
    category: 'Питомец',
    icon: '🌵',
    price: 680,
    effectText: 'Стильная зелёная когтеточка для Пискли (+5%)',
    moodBonus: 5
  },
  // --- Ещё 10 уникальных украшений для Магазина ---
  {
    id: 'chalkboard_menu',
    name: 'Грифельная доска с ценами мелом',
    place: 'Магазин',
    category: 'Уют',
    icon: '📝',
    price: 520,
    effectText: 'Меловой штендер с акциями дня (+5% атмосферы)',
    moodBonus: 5
  },
  {
    id: 'bicycle_planter',
    name: 'Ретро-велосипед с корзиной цветов',
    place: 'Магазин',
    category: 'Прованс',
    isRare: true,
    icon: '🚲',
    price: 1790,
    effectText: 'Белый декоративный велосипед у витрины (+8%)',
    moodBonus: 8
  },
  {
    id: 'candle_lantern_floor',
    name: 'Высокий напольный фонарь со свечой',
    place: 'Магазин',
    category: 'Уют',
    icon: '🏮',
    price: 740,
    effectText: 'Тёплый свет стеклянного фонаря у входа (+6%)',
    moodBonus: 6
  },
  {
    id: 'ribbon_stand',
    name: 'Стойка с катушками атласных лент',
    place: 'Магазин',
    category: 'Флористика',
    icon: '🎀',
    price: 630,
    effectText: 'Яркие бобины шёлковых лент на полке (+5%)',
    moodBonus: 5
  },
  {
    id: 'botanical_atlas_stand',
    name: 'Мольберт с ботанической гравюрой',
    place: 'Магазин',
    category: 'Антиквариат',
    isRare: true,
    icon: '🎨',
    price: 1380,
    effectText: 'Художественный этюд садовых роз (+7%)',
    moodBonus: 7
  },
  {
    id: 'mirror_arch_shop',
    name: 'Арочное зеркало для фото букетов',
    place: 'Магазин',
    category: 'Стиль',
    icon: '✨',
    price: 1120,
    effectText: 'Расширяет пространство и даёт шикарный свет (+7%)',
    moodBonus: 7
  },
  {
    id: 'ceramic_pitchers_set',
    name: 'Набор расписных кувшинов',
    place: 'Магазин',
    category: 'Винтаж',
    icon: '🍶',
    price: 590,
    effectText: 'Керамика ручной лепки на полке (+5%)',
    moodBonus: 5
  },
  {
    id: 'wooden_crate_display',
    name: 'Винтажный деревянный ящик с розами',
    place: 'Магазин',
    category: 'Прованс',
    icon: '📦',
    price: 460,
    effectText: 'Ящик из состаренной сосны для композиций (+4%)',
    moodBonus: 4
  },
  {
    id: 'brass_bell_counter',
    name: 'Латунный звонок на прилавок',
    place: 'Магазин',
    category: 'Антиквариат',
    icon: '🔔',
    price: 430,
    effectText: 'Мелодичный «дзинь!» для новых гостей (+4%)',
    moodBonus: 4
  },
  {
    id: 'herb_drying_rack',
    name: 'Подвесная сушилка с мятой и ромашкой',
    place: 'Магазин',
    category: 'Ботаника',
    icon: '🌿',
    price: 670,
    effectText: 'Ароматный пучок свежих и сухих трав сверху (+5%)',
    moodBonus: 5
  },
  // --- Ещё 10 уникальных украшений для Квартиры ---
  {
    id: 'record_wall_home',
    name: 'Стена с коллекцией виниловых пластинок',
    place: 'Квартира',
    category: 'Атмосфера',
    icon: '🎶',
    price: 720,
    effectText: 'Музыкальное панно с ретро-обложками (+5%)',
    moodBonus: 5
  },
  {
    id: 'cat_hammock_window',
    name: 'Оконный гамак для Пискли',
    place: 'Квартира',
    category: 'Питомец',
    icon: '🐱',
    price: 840,
    effectText: 'Тёплое местечко под самым солнцем у окна (+6%)',
    moodBonus: 6
  },
  {
    id: 'linen_armchair',
    name: 'Кресло-качалка с вязаным пледом',
    place: 'Квартира',
    category: 'Уют',
    isRare: true,
    icon: '🛋️',
    price: 1680,
    effectText: 'Уютное кресло для чтения и отдыха (+8%)',
    moodBonus: 8
  },
  {
    id: 'stained_lamp_moon',
    name: 'Ночник-полумесяц на тумбе',
    place: 'Квартира',
    category: 'Атмосфера',
    icon: '🌙',
    price: 590,
    effectText: 'Мягкий лунный свет перед сном (+5%)',
    moodBonus: 5
  },
  {
    id: 'indoor_bonsai',
    name: 'Миниатюрный бонсай в плошке',
    place: 'Квартира',
    category: 'Ботаника',
    isRare: true,
    icon: '🌳',
    price: 1490,
    effectText: 'Дзен-деревце, приносящее спокойствие (+7%)',
    moodBonus: 7
  },
  {
    id: 'ceramic_tea_set',
    name: 'Чайный сервиз с ромашками',
    place: 'Квартира',
    category: 'Уют',
    icon: '🍵',
    price: 540,
    effectText: 'Фарфоровый заварник и две тёплые чашки (+5%)',
    moodBonus: 5
  },
  {
    id: 'woven_basket_yarn',
    name: 'Корзинка с клубками для кошки',
    place: 'Квартира',
    category: 'Питомец',
    icon: '🧶',
    price: 380,
    effectText: 'Плетёная корзинка с мягкой пряжей (+4%)',
    moodBonus: 4
  },
  {
    id: 'vintage_typewriter',
    name: 'Старинная печатная машинка',
    place: 'Квартира',
    category: 'Антиквариат',
    isRare: true,
    icon: '⌨️',
    price: 1560,
    effectText: 'Винтажный раритет для дневника флориста (+7%)',
    moodBonus: 7
  },
  {
    id: 'dreamcatcher_boho',
    name: 'Ловец снов с бусинами',
    place: 'Квартира',
    category: 'Бохо',
    icon: '💫',
    price: 450,
    effectText: 'Плетёный оберег над головой для добрых снов (+4%)',
    moodBonus: 4
  },
  {
    id: 'indoor_citrus_tree',
    name: 'Мандариновое деревце в кадке',
    place: 'Квартира',
    category: 'Ботаника',
    icon: '🍊',
    price: 990,
    effectText: 'Яркие плоды и цитрусовый аромат дома (+6%)',
    moodBonus: 6
  }
];

export const SHOP_LOCATIONS = [
  {
    id: 'shop_basement',
    name: 'Уютный подвальчик',
    price: 0,
    maxVases: 6,
    maxWallDecor: 999,
    windowView: 'Тротуар тихой улочки',
    desc: 'Небольшой камерный зал: вид на тротуар, безлимитный декор и стартовая витрина.'
  },
  {
    id: 'shop_pavilion',
    name: 'Светлый павильон в сквере',
    price: 12000,
    maxVases: 9,
    maxWallDecor: 999,
    windowView: 'Цветущий парк и фонтан',
    desc: 'Панорамные окна в пол, вид на парк и фонтан, полка под подарки, 9 ваз и любой декор.'
  },
  {
    id: 'shop_boutique',
    name: 'Бутик на главной улице',
    price: 35000,
    maxVases: 12,
    maxWallDecor: 999,
    windowView: 'Исторический проспект',
    desc: 'Старинный кирпич, лепнина, золотые рейлы, вид на проспект, 12 ваз и место для всех коллекций.'
  }
];

export const HOME_LOCATIONS = [
  {
    id: 'home_studio',
    name: 'Уютная студия',
    price: 0,
    energyBonus: 0,
    desc: 'Маленькая студия рядом с лавкой, где тепло и слышно мурлыканье.'
  },
  {
    id: 'home_balcony',
    name: 'Двушка с балконом',
    price: 14000,
    energyBonus: 8,
    desc: 'Просторная светлая квартира со стеклянным выходом на уютный балкон (+8% к отдыху).'
  },
  {
    id: 'home_loft',
    name: 'Тёплая мансарда с камином',
    price: 42000,
    energyBonus: 18,
    desc: 'Роскошная, светлая, очень тёплая мансарда с живым камином и видом на небо (+18% к отдыху).'
  }
];

// Каталог филиалов франшизы (Этап 2)
export const FRANCHISE_CATALOG = [
  {
    id: 'branch_mall_island',
    name: 'Островок в ТЦ «Мегаполис»',
    icon: '🏬',
    price: 18000,
    weeklyRent: 2400,
    minDailyRevenue: 1500,
    maxDailyRevenue: 2400,
    themeClass: 'branch-mall',
    interiorDesc: 'Светлый стеклянный островок в центре галереи ТЦ: витрина с подсветкой, эскалатор позади и поток посетителей с пакетами.',
    desc: 'Компактная точка в торговом центре. Быстрая окупаемость и стабильный поток покупателей.'
  },
  {
    id: 'branch_metro_pavilion',
    name: 'Павильон у метро «Центральная»',
    icon: '🚇',
    price: 32000,
    weeklyRent: 4200,
    minDailyRevenue: 2500,
    maxDailyRevenue: 3900,
    themeClass: 'branch-metro',
    interiorDesc: 'Бойкий городской павильон с панорамным стеклом, неоновой вывеской «24/7 Свежие цветы» и огнями проспекта.',
    desc: 'Высокий уличный трафик с утра до вечера. Отлично берут готовые букеты на бегу.'
  },
  {
    id: 'branch_center_boutique',
    name: 'Элитный бутик «На Бульваре»',
    icon: '🏛️',
    price: 65000,
    weeklyRent: 7800,
    minDailyRevenue: 4700,
    maxDailyRevenue: 7400,
    themeClass: 'branch-boutique',
    interiorDesc: 'Просторный салон с мраморной стойкой, золотыми арками, хрустальной люстрой и ароматическими диффузорами.',
    desc: 'Премиальная точка в центре города. Высокий средний чек, корпоративные и VIP-заказы.'
  }
];

export const WEATHERS = [
  { id: 'sunny', label: 'Ясно', icon: '☀️', cssClass: 'weather-sunny' },
  { id: 'rainy', label: 'Дождик', icon: '🌧️', cssClass: 'weather-rainy' },
  { id: 'frost', label: 'Мороз', icon: '❄️', cssClass: 'weather-frost' }
];

export const SEASONS = {
  winter: { id: 'winter', name: 'Зима', label: 'Зима', icon: '❄️' },
  early_spring: { id: 'early_spring', name: 'Ранняя весна', label: 'Ранняя весна', icon: '🌱' },
  spring: { id: 'spring', name: 'Весна', label: 'Весна', icon: '🌸' },
  summer: { id: 'summer', name: 'Лето', label: 'Лето', icon: '☀️' },
  autumn: { id: 'autumn', name: 'Осень', label: 'Осень', icon: '🍂' }
};

export const HOLIDAYS = [
  { month: 1, day: 1, name: 'Новый год', note: 'Праздничные букеты и двойные цены!' },
  { month: 2, day: 14, name: 'День святого Валентина', note: 'Ажиотаж на красные розы! Спрос и цены x2!' },
  { month: 3, day: 8, name: '8 Марта', note: 'Главный цветочный день года! Тюльпаны и пионы x2!' },
  { month: 5, day: 1, name: 'Праздник весны', note: 'Лёгкие весенние композиции нарасхват!' },
  { month: 9, day: 1, name: 'День знаний', note: 'Школьный бум! Букеты и опт x2!' },
  { month: 10, day: 5, name: 'День учителя', note: 'Подарочные букеты учителям нарасхват!' },
  { month: 11, day: 24, name: 'День матери', note: 'Нежные букеты для мам и открытки x2!' },
  { month: 12, day: 31, name: 'Новогодний сочельник', note: 'Ёлочные композиции и подарки x2!' }
];

export const JOB_ROLES = [
  {
    id: 'assistant',
    name: 'Флорист-помощник',
    icon: '🌷',
    baseSalary: 1400,
    desc: 'Меняет воду, помогает с закупками и собирает базовые букеты'
  },
  {
    id: 'courier',
    name: 'Курьер',
    icon: '🚚',
    baseSalary: 1100,
    desc: 'Развозит заказы из Direct по всему городу и привозит чаевые'
  }
];

export const JOB_SCHEDULES = [
  { id: 'full', label: 'Полная смена (9:00–21:00)' },
  { id: 'morning_half', label: 'Утро (9:00–15:00)' },
  { id: 'evening_half', label: 'Вечер (15:00–21:00)' },
  { id: 'flexible', label: 'Плавающий 2/2' }
];

export const CLIENT_MOODS = ['Вежливый', 'Торопится', 'Романтик', 'Придирчивый', 'Вдохновлённый'];

export function getGameDateObj(startDateStr = '2026-02-08', dayOffset = 0) {
  const parts = String(startDateStr || '2026-02-08').split('-').map(Number);
  const y = parts[0] || 2026;
  const m = (parts[1] || 2) - 1;
  const d = parts[2] || 8;
  return new Date(y, m, d + Math.max(0, dayOffset));
}

export function formatGameDate(dateObj) {
  const months = [
    'янв', 'фев', 'мар', 'апр', 'май', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
  ];
  return `${dateObj.getDate()} ${months[dateObj.getMonth()]}`;
}

export function getSeasonInfo(dateObj) {
  const m = dateObj.getMonth() + 1;
  const d = dateObj.getDate();
  if (m === 12 || m === 1 || m === 2) return SEASONS.winter;
  if (m === 3 && d <= 20) return SEASONS.early_spring;
  if (m === 3 || m === 4 || m === 5) return SEASONS.spring;
  if (m === 6 || m === 7 || m === 8) return SEASONS.summer;
  return SEASONS.autumn;
}

export function getWeatherForSeason(seasonId) {
  const r = Math.random();
  if (seasonId === 'winter') return r < 0.72 ? 'frost' : 'sunny';
  if (seasonId === 'early_spring') return r < 0.35 ? 'frost' : r < 0.65 ? 'rainy' : 'sunny';
  if (seasonId === 'spring') return r < 0.35 ? 'rainy' : 'sunny';
  if (seasonId === 'summer') return r < 0.2 ? 'rainy' : 'sunny';
  return r < 0.55 ? 'rainy' : 'sunny';
}

export function getHolidayForDate(dateObj) {
  const m = dateObj.getMonth() + 1;
  const d = dateObj.getDate();
  return HOLIDAYS.find((h) => h.month === m && h.day === d) || null;
}