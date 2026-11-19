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