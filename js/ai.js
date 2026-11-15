import { AI_PROVIDERS, FLOWERS_CATALOG, getGameDateObj, getSeasonInfo, getHolidayForDate } from './config.js';
import { aiSettings, gameState } from './state.js';

const CLIENT_TEMPLATES = {
  femaleNames: ['Алиса', 'Марина', 'Елена', 'София', 'Дарья', 'Анна Сергеевна', 'Валерия', 'Ксения', 'Полина', 'Ольга Николаевна'],
  maleNames: ['Артём', 'Дмитрий', 'Максим', 'Игорь', 'Никита', 'Михаил Петрович', 'Кирилл', 'Роман', 'Александр Иванович'],
  skins: ['#FCE0D2', '#F5CBAF', '#E6B394'],
  youngHairColors: ['#4E392E', '#7A543E', '#C98A5B', '#E3C07B', '#2F2928'],
  seniorHairColors: ['#B8B2AD', '#C9C3BE', '#8A847F'],
  shirtColors: ['#D98A7C', '#89A88B', '#8EA8C3', '#D4A5B8', '#DFB66B', '#9D8EB8'],
  bgTints: ['#F7EAE4', '#E9F0E8', '#E9EEF4', '#F5EBF2'],
  personalities: [
    {
      id: 'romantic',
      female: 'вежливая и нежная романтичная натура',
      male: 'вежливый и немного застенчивый романтик'
    },
    {
      id: 'hurry',
      female: 'вечно спешащая деловая леди, ценит лаконичность',
      male: 'вечно спешащий деловой человек, ценит лаконичность'
    },
    {
      id: 'grumpy',
      female: 'ворчливая, но в душе добрая эстетка, любит поторговаться',
      male: 'ворчливый, но в душе добрый эстет, любит поторговаться'
    },
    {
      id: 'cozy',
      female: 'очень эмоциональная и душевная натура, обожает уют',
      male: 'очень душевный и чуткий собеседник, обожает уют'
    },
    {
      id: 'connoisseur',
      female: 'требовательная ценительница стиля с хорошим вкусом',
      male: 'требовательный ценитель стиля с хорошим вкусом'
    },
    {
      id: 'student',
      female: 'приветливая студентка с ограниченным бюджетом, ищет душевный вариант',
      male: 'приветливый студент с ограниченным бюджетом, ищет душевный вариант'
    }
  ],
  maleOccasions: [
    'первое свидание с девушкой',
    'извинение перед девушкой после ссоры',
    'годовщина отношений с любимой',
    'день рождения мамы',
    'выписка жены из роддома',
    'юбилей бабушки',
    'день рождения коллеги',
    'похороны / панихида (нужен строгий траурный букет с чётным числом гвоздик или белых хризантем/роз)'
  ],
  femaleOccasions: [
    'день рождения мамы',
    'юбилей бабушки',
    'подарок лучшей подруге',
    'свадьба подруги (хочет что-то нежное и светлое)',
    'новоселье друзей',
    'выписка сестры из роддома',
    'день рождения учителя / 1 Сентября',
    'просто украсить дом к уютному ужину',
    'похороны / панихида (нужен строгий траурный букет с чётным числом цветов)'
  ],
  monoPreferences: [
    'хочет монобукет из красных или розовых роз',
    'ищет нежные пионы (розовые или коралловые)',
    'хочет солнечный, тёплый монобукет из подсолнухов или жёлтых тюльпанов',
    'любит воздушные белые цветы (ромашки, белые розы или хризантемы)',
    'обожает лаванду или сиреневые тюльпаны',
    'ищет стильную голубую гортензию или синие ирисы'
  ],
  mixPreferences: [
    'хочет сборный (совместный) букет: например, розы или пионы с веточкой гипсофилы и эвкалипта',
    'просит яркий разноцветный микс из 2–3 разных видов цветов в красивой бумаге',
    'хочет нежный пастельный микс (например, белые/розовые цветы с зеленью эвкалипта)',
    'ищет весенний сборный букет из тюльпанов, ирисов и ромашек',
    'ненавидит белые лилии из-за резкого запаха, но любит любые другие смешанные букеты',
    'не любит ромашки — просит собрать микс из более благородных цветов с лентой'
  ]
};

const SEASONAL_PREFERENCES = {
  winter: 'хочет зимний атмосферный букет: красные или белые розы, гвоздики, хризантемы и эвкалипт',
  'early-spring': 'ищет свежий весенний букет из тюльпанов, синих ирисов и лаванды',
  summer: 'хочет яркий летний хит из пионов, подсолнухов, ромашек или гортензии',
  autumn: 'хочет уютный осенний букет из подсолнухов, белых хризантем, коралловых пионов и эвкалипта'
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickUnused(arr, prevReplies = []) {
  const fresh = arr.filter((item) => !prevReplies.some((prev) => prev === item));
  return pickRandom(fresh.length ? fresh : arr);
}

/** Процедурный генератор случайных ников (используется ТОЛЬКО в оффлайне или при сбое/дубле у API) */
function generateProceduralNick(excludeSet = new Set()) {
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

function isRudeText(text) {
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

export function generateRandomClient() {
  const gender = Math.random() < 0.56 ? 'female' : 'male';
  const name = pickRandom(gender === 'female' ? CLIENT_TEMPLATES.femaleNames : CLIENT_TEMPLATES.maleNames);
  const isSeniorName = name.includes(' ');
  const age = isSeniorName ? 54 + Math.floor(Math.random() * 15) : 20 + Math.floor(Math.random() * 22);

  let personalityObj = pickRandom(CLIENT_TEMPLATES.personalities);
  if (isSeniorName && personalityObj.id === 'student') {
    personalityObj = CLIENT_TEMPLATES.personalities.find((p) => p.id === 'connoisseur') || personalityObj;
  }
  const personality = gender === 'female' ? personalityObj.female : personalityObj.male;

  const curDate = getGameDateObj(gameState.startDate, gameState.day - 1);
  const season = getSeasonInfo(curDate);
  const holiday = getHolidayForDate(curDate);
  const hasPromoToday = gameState.activePromo && gameState.activePromo.day === gameState.day;

  const bouquetPosts = (gameState.instaPosts || []).filter(
    (p) => p.type === 'bouquet' || (Array.isArray(p.items) && p.items.length > 0)
  );
  const viralPosts = (gameState.instaPosts || []).filter(
    (p) =>
      String(p.verdict || '').includes('тренд') ||
      String(p.verdict || '').includes('рекомендац') ||
      (p.likes || 0) >= 25
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

  const occasionPool = gender === 'female' ? CLIENT_TEMPLATES.femaleOccasions : CLIENT_TEMPLATES.maleOccasions;
  let occasion = pickRandom(occasionPool);
  if (inspiredByPost) {
    occasion = 'увидел(а) ваш пост в InstaFlower и хочет такой же букет'.replace(
      'увидел(а)',
      gender === 'female' ? 'увидела' : 'увидел'
    );
  } else if (isViralClient) {
    occasion = holiday
      ? `сезонный виральный заказ к празднику (${holiday.name})`
      : `сезонный тренд из соцсетей (${season.label})`;
  } else if (holiday && Math.random() < 0.55) {
    occasion = `подарок к празднику (${holiday.name})`;
  }

  const isMix = Math.random() < 0.5;
  let preference = pickRandom(isMix ? CLIENT_TEMPLATES.mixPreferences : CLIENT_TEMPLATES.monoPreferences);

  if (inspiredByPost) {
    preference = `хочет точно такой же букет, как в вашем посте: ${inspiredByPost.description}`;
  } else if (isViralClient) {
    preference = SEASONAL_PREFERENCES[season.id] || preference;
  } else if (occasion.includes('похороны')) {
    preference = 'строгий траурный вариант: чётное количество красных гвоздик, белых хризантем или роз без ярких бантиков';
  } else if (occasion.includes('свадьба')) {
    preference = 'нежный пастельный букет из белых или розовых роз, пионов, гортензии или гипсофилы';
  }

  let baseBudget = 600 + Math.floor(Math.random() * 1900);
  if (personalityObj.id === 'student') baseBudget = 450 + Math.floor(Math.random() * 600);
  if (personalityObj.id === 'connoisseur') baseBudget = 1300 + Math.floor(Math.random() * 2200);
  if (inspiredByPost && inspiredByPost.targetPrice > 0) {
    baseBudget = Math.max(baseBudget, Math.round(inspiredByPost.targetPrice * 1.25));
  }
  if (isViralClient) baseBudget = Math.round(baseBudget * 1.25);
  if (holiday) baseBudget = Math.round(baseBudget * 1.35);

  const hairOptions = gender === 'female' ? ['long', 'bob', 'bun'] : ['short', 'quiff', 'buzz'];
  const hairColor = age >= 52 ? pickRandom(CLIENT_TEMPLATES.seniorHairColors) : pickRandom(CLIENT_TEMPLATES.youngHairColors);

  return {
    id: 'client_' + Date.now(),
    name,
    age,
    gender,
    personalityId: personalityObj.id,
    personality,
    occasion,
    budget: Math.round(baseBudget / 50) * 50,
    preference,
    mood: inspiredByPost || isViralClient ? 75 : 65,
    status: 'talking',
    inspiredByPost,
    isViralClient,
    appearance: {
      gender,
      age,
      skin: pickRandom(CLIENT_TEMPLATES.skins),
      hairStyle: pickRandom(hairOptions),
      hairColor,
      shirtColor: pickRandom(CLIENT_TEMPLATES.shirtColors),
      hasGlasses: age >= 50 ? Math.random() < 0.65 : Math.random() < 0.25,
      hasBeard: gender === 'male' && (age >= 32 ? Math.random() < 0.45 : Math.random() < 0.15),
      bgTint: pickRandom(CLIENT_TEMPLATES.bgTints)
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
  const name = pickRandom(gender === 'female' ? CLIENT_TEMPLATES.femaleNames.slice(0, 8) : CLIENT_TEMPLATES.maleNames.slice(0, 7));
  const age = 22 + Math.floor(Math.random() * 16);
  const personalityObj = pickRandom(CLIENT_TEMPLATES.personalities.filter((p) => p.id !== 'grumpy'));
  const hairOptions = gender === 'female' ? ['long', 'bob', 'bun'] : ['short', 'quiff', 'buzz'];
  const flowerMeta = FLOWERS_CATALOG[preorder.typeId];
  const flowerName = preorder.flowerName || flowerMeta?.name || 'цветы';

  return {
    id: 'client_pre_' + Date.now(),
    name: `${name} (${preorder.senderName})`,
    age,
    gender,
    personalityId: personalityObj.id,
    personality: gender === 'female' ? personalityObj.female : personalityObj.male,
    occasion: `предзаказ из Direct на ${preorder.dueTimeLabel}`,
    budget: Math.round(preorder.reward * 1.25),
    preference: `заказывал(а) ${preorder.qty} шт. «${flowerName}» к ${preorder.dueTimeLabel}`,
    mood: 80,
    status: 'talking',
    preorder: { ...preorder, flowerName },
    appearance: {
      gender,
      age,
      skin: pickRandom(CLIENT_TEMPLATES.skins),
      hairStyle: pickRandom(hairOptions),
      hairColor: pickRandom(CLIENT_TEMPLATES.youngHairColors),
      shirtColor: pickRandom(CLIENT_TEMPLATES.shirtColors),
      hasGlasses: Math.random() < 0.25,
      hasBeard: gender === 'male' && Math.random() < 0.25,
      bgTint: pickRandom(CLIENT_TEMPLATES.bgTints)
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
        .map((b, idx) => `${idx + 1}. Готовый букет: ${b.summary} — цена ${b.price} ₽`)
        .join('\n')
    : 'Готовых букетов на витрине пока нет.';

  const preorderSection = client.preorder
    ? `\nОСОБЫЙ СТАТУС — ЭТО ПРЕДЗАКАЗ ИЗ DIRECT:
- ПРЕДЗАКАЗ: typeId=${client.preorder.typeId} flowerName="${client.preorder.flowerName}" qty=${client.preorder.qty} reward=${client.preorder.reward} due="${client.preorder.dueTimeLabel}"
- Ты заранее заказал(а) в Direct ${client.preorder.qty} шт. «${client.preorder.flowerName}» к ${client.preorder.dueTimeLabel} за ${client.preorder.reward} ₽.
- Оценивай полученный букет АДЕКВАТНО и дружелюбно: не придирайся к добавленной зелени/гипсофиле/упаковке, если есть заказанные цветы! Если нужные цветы свежие и количество совпадает или больше — смело покупай ("dealStatus": "bought", "moodChange": 18).`
    : '';

  const postSection = client.inspiredByPost
    ? `\nКЛИЕНТ ПО ПОСТУ ИЗ INSTAFLOWER:
- ПОСТ_БУКЕТ: items=${(client.inspiredByPost.items || []).join(',')} desc="${client.inspiredByPost.description}" targetPrice=${client.inspiredByPost.targetPrice || 0}
- Ты увидел(а) этот букет в соцсети InstaFlower и хочешь точно такой же (или максимально близкий по основным цветам).`
    : '';

  return `Ты отыгрываешь роль покупателя в цветочном магазине "${gameState.shopName || 'Fleur Atelier'}".
ТВОИ ПАРАМЕТРЫ:
- Имя и возраст: ${client.name}, ${client.age} лет.
- ПОЛ И РОД РЕЧИ: ${genderRule}. Никогда не путай свой род!
- Характер: ${client.personality}.
- Повод покупки: ${client.occasion}.
- Максимальный бюджет: ${client.budget} ₽ (можешь торговаться, но не покупай то, что дороже бюджета больше чем на 10%).
- Пожелание/вкус: ${client.preference}.
- Текущее настроение: ${client.mood} из 100.${preorderSection}${postSection}

АССОРТИМЕНТ МАГАЗИНА:
${vasesText}
${bouquetsText}

ПРАВИЛА:
1. Пиши строго на русском, живо, коротко (1–3 предложения). Никогда не называй проценты свежести цифрами (человек не знает процентов, он просто видит глазами, если цветок поникший и вялый).
2. Намекай на повод, бюджет или вкус естественно.
3. На "[Предложение продавца]":
   - Оцени свежесть (возмущайся ТОЛЬКО если указано, что цветы подвявшие/вялые), соответствие вкусу/поводу и цену относительно бюджета ${client.budget} ₽.
   - Подходит — соглашайся ("dealStatus": "bought", "moodChange": 15). ВАЖНО: если ставишь "bought", ты УЖЕ оплатил и забрал покупку — только поблагодари и попрощайся, НЕ проси в этой же реплике что-то проверить, поменять или исправить! Если сомневаешься или просишь проверить/заменить — ставь "dealStatus": "talking".
   - Дорого или не тот цветок — торгуйся или проси замену ("dealStatus": "talking", "moodChange": -5).
   - Грубость или игнорирование запрета — уходи ("dealStatus": "left", "moodChange": -20).
4. На "[Отказ продавца]" (если продавец отказывается от заказа и указывает причину):
   - ОБЯЗАТЕЛЬНО покажи в ответе, что ты увидел(а) и понял(а) названную причину!
   - Если причина серьёзная (магазин закрывается, совсем нет времени/очередь, или это уже повторный отказ) — вежливо или с сожалением попрощайся и уйди ("dealStatus": "left", "moodChange": -10).
   - Если отказ первый и причина — нехватка конкретного цветка или слишком маленький бюджет, иногда можешь попытаться 1 раз спасти заказ: предложить замену на другой цветок из лавки или поднять бюджет ("dealStatus": "talking", "moodChange": -4).

ОТВЕЧАЙ СТРОГО ОДНИМ ВАЛИДНЫМ JSON БЕЗ MARKDOWN:
{"reply": "твоя реплика", "moodChange": 0, "dealStatus": "talking"}`;
}

function stripCodeFences(str) {
  return String(str || '')
    .replace(new RegExp('\x60\x60\x60json', 'gi'), '')
    .replace(new RegExp('\x60\x60\x60', 'g'), '')
    .trim();
}

export function parseClientJson(rawText) {
  const cleaned = stripCodeFences(rawText);

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

function formatApiError(status, rawMsg) {
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

async function fetchWithTimeout(url, options, timeoutMs = 12000) {
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
    return runOfflineClientAI(messages);
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

function getPreferredFlowerIds(pref, isFuneral) {
  if (isFuneral) return ['carnation_red', 'chrysanthemum_white', 'rose_white', 'rose_red'];
  if (pref.includes('красных или розовых роз')) return ['rose_red', 'rose_pink'];
  if (pref.includes('пионы')) return ['peony_pink', 'peony_coral'];
  if (pref.includes('подсолнухов или жёлтых тюльпанов')) return ['sunflower', 'tulip_yellow'];
  if (pref.includes('воздушные белые')) return ['chamomile_white', 'rose_white', 'chrysanthemum_white', 'gypsophila'];
  if (pref.includes('лаванду или сиреневые тюльпаны')) return ['lavender_purple', 'tulip_purple'];
  if (pref.includes('гортензию или синие ирисы')) return ['hydrangea_blue', 'iris_blue'];
  if (pref.includes('тюльпанов, ирисов и ромашек')) return ['tulip_yellow', 'tulip_red', 'tulip_purple', 'iris_blue', 'chamomile_white'];
  if (pref.includes('пастельный')) return ['rose_white', 'rose_pink', 'peony_pink', 'gypsophila', 'eucalyptus', 'chrysanthemum_white'];
  if (pref.includes('розы или пионы')) return ['rose_red', 'rose_white', 'rose_pink', 'peony_pink', 'peony_coral', 'gypsophila', 'eucalyptus'];
  return Object.keys(FLOWERS_CATALOG).filter((id) => {
    if (pref.includes('ненавидит белые лилии') && id === 'lily_white') return false;
    if (pref.includes('не любит ромашки') && id === 'chamomile_white') return false;
    return true;
  });
}

function parseAvailableVasesFromSys(sys) {
  const lines = sys.split('\n');
  const vases = [];
  for (const line of lines) {
    const m = line.match(/^- (.+?) \((\d+) шт\., (\d+) ₽\/шт\., состояние: ([^,)]+)/);
    if (!m) continue;
    const name = m[1].trim();
    const qty = Number(m[2]);
    const price = Number(m[3]);
    const state = m[4].trim();
    const entry = Object.values(FLOWERS_CATALOG).find((f) => f.name.toLowerCase() === name.toLowerCase());
    vases.push({
      id: entry ? entry.id : null,
      name,
      qty,
      price,
      isWilted: state.includes('подвявш') || state.includes('поникш')
    });
  }
  return vases;
}

function getPrevAssistantReplies(messages) {
  return messages
    .filter((m) => m.role === 'assistant')
    .map((m) => {
      try {
        return JSON.parse(m.content).reply || '';
      } catch {
        return m.content || '';
      }
    })
    .filter(Boolean);
}

function parsePreorderFromSys(sys) {
  const m = sys.match(/ПРЕДЗАКАЗ:\s*typeId=(\S+)\s+flowerName="([^"]+)"\s+qty=(\d+)\s+reward=(\d+)\s+due="([^"]+)"/);
  if (!m) return null;
  return {
    typeId: m[1],
    flowerName: m[2],
    qty: Number(m[3]),
    reward: Number(m[4]),
    dueTimeLabel: m[5]
  };
}

function parsePostRefFromSys(sys) {
  const m = sys.match(/ПОСТ_БУКЕТ:\s*items=([^\s]*)\s+desc="([^"]*)"\s+targetPrice=(\d+)/);
  if (!m) return null;
  return {
    items: m[1] ? m[1].split(',').filter(Boolean) : [],
    desc: m[2],
    targetPrice: Number(m[3]) || 0
  };
}

function runOfflineClientAI(messages) {
  const sys = messages.find((m) => m.role === 'system')?.content || '';
  if (!sys) return 'Работаю мгновенно!';

  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  const lower = lastUser.toLowerCase().trim();
  const prevReplies = getPrevAssistantReplies(messages);
  const lastBotReply = (prevReplies[prevReplies.length - 1] || '').toLowerCase();

  const isFemale = sys.includes('Женщина');
  const rawOccasion = (sys.match(/Повод покупки:\s*(.+?)\./) || [])[1] || 'особый случай';
  const occasion = rawOccasion.replace(/\s*\([^)]*\)/g, '').trim();
  const budget = Number((sys.match(/Максимальный бюджет:\s*(\d+)/) || [])[1]) || 1000;
  const pref = (sys.match(/Пожелание\/вкус:\s*(.+?)\./) || [])[1] || '';
  const mood = Number((sys.match(/Текущее настроение:\s*(\d+)/) || [])[1]) || 65;
  const preorder = parsePreorderFromSys(sys);
  const postRef = parsePostRefFromSys(sys);

  const isGrumpy = sys.includes('ворчлив') || sys.includes('требовательн');
  const isHurry = sys.includes('спешащ');
  const isRomantic = sys.includes('романт') || sys.includes('уют');
  const isFuneral = rawOccasion.includes('похороны');
  const wantsMix = pref.includes('сборный') || pref.includes('микс') || pref.includes('смешан') || pref.includes('нежный пастельный');

  const availableVases = parseAvailableVasesFromSys(sys);
  const preferredIds = postRef?.items?.length ? postRef.items : getPreferredFlowerIds(pref, isFuneral);
  const hasPreferredInShop = availableVases.some((v) => v.id && preferredIds.includes(v.id) && !v.isWilted);

  const came = isFemale ? 'зашла' : 'зашёл';
  const wanted = isFemale ? 'хотела' : 'хотел';
  const glad = isFemale ? 'рада' : 'рад';
  const ready = isFemale ? 'готова' : 'готов';
  const looked = isFemale ? 'посмотрела' : 'посмотрел';
  const said = isFemale ? 'сказала' : 'сказал';
  const noticed = isFemale ? 'заметила' : 'заметил';
  const wrote = isFemale ? 'писала' : 'писал';
  const ordered = isFemale ? 'заказывала' : 'заказывал';
  const saw = isFemale ? 'увидела' : 'увидел';

  if (lower.includes('ты только что вошёл')) {
    if (preorder) {
      return JSON.stringify({
        reply: `Здравствуйте! Это я ${wrote} вам в Direct насчёт предзаказа на ${preorder.dueTimeLabel} — ${preorder.qty} шт. «${preorder.flowerName}». Уже готово?`,
        moodChange: 0,
        dealStatus: 'talking'
      });
    }

    if (postRef) {
      return JSON.stringify({
        reply: `Здравствуйте! Я ${saw} ваш пост в InstaFlower и прямо влюбил${isFemale ? 'ась' : 'ся'}! Хочу точно такой же букет (${postRef.desc})!`,
        moodChange: 4,
        dealStatus: 'talking'
      });
    }

    const greetings = isGrumpy
      ? [
          `Добрый день. Надеюсь, у вас тут есть действительно свежие цветы — повод серьёзный: ${occasion}.`,
          `Здравствуйте. Не люблю долгих вступлений: мне нужен достойный букет, повод — ${occasion}.`,
          `Приветствую. ${isFemale ? 'Заглянула' : 'Заглянул'} оценить ваш ассортимент — ищу хороший вариант на повод «${occasion}».`
        ]
      : isHurry
      ? [
          `Здравствуйте! Очень тороплюсь, помогите быстро подобрать цветы — у меня ${occasion}!`,
          `Добрый день! Буквально на пару минут ${came}: нужен красивый вариант, повод — ${occasion}.`
        ]
      : [
          `Здравствуйте! Какой у вас здесь чудесный аромат! Подбираю цветы, повод: ${occasion}.`,
          `Добрый день! ${came.charAt(0).toUpperCase() + came.slice(1)} за красивым букетом — у меня ${occasion}. Что посоветуете?`,
          `Привет! Так уютно в вашей лавке. Поможете выбрать что-нибудь душевное на повод «${occasion}»?`
        ];
    return JSON.stringify({ reply: pickUnused(greetings, prevReplies), moodChange: 0, dealStatus: 'talking' });
  }

  if (lastUser.startsWith('[Отказ продавца]')) {
    const reasonText = lastUser.replace(/^\[Отказ продавца\]:\s*/i, '').trim();
    const rLower = reasonText.toLowerCase();
    const rejectCount = messages.filter((m) => m.role === 'user' && m.content.startsWith('[Отказ продавца]')).length;

    const isClosing = rLower.includes('закры') || rLower.includes('поздн') || rLower.includes('конец дня');
    const isBusy = rLower.includes('успе') || rLower.includes('много заказ') || rLower.includes('очеред') || rLower.includes('завал') || rLower.includes('занят');
    const isNoFlowers = rLower.includes('нет ') || rLower.includes('наличи') || rLower.includes('законч') || rLower.includes('раскуп') || rLower.includes('кончил');
    const isBudgetSmall = rLower.includes('бюджет') || rLower.includes('мал') || rLower.includes('дорог') || rLower.includes('денег') || rLower.includes('хватает');

    if (rejectCount >= 2 || isClosing) {
      const bye = isClosing
        ? `Эх, жалко, что вы уже закрываетесь... Ладно, тогда загляну в другой раз. Доброго вечера!`
        : `Всё, понял${isFemale ? 'а' : ''}, раз так — не буду задерживать. Спасибо, что честно сказали!`;
      return JSON.stringify({ reply: bye, moodChange: -10, dealStatus: 'left' });
    }

    if (isNoFlowers) {
      if (availableVases.length > 0 && Math.random() < 0.58) {
        const sample = availableVases.find((v) => !v.isWilted) || availableVases[0];
        return JSON.stringify({
          reply: `Ох, жалко, что нужных цветов сейчас нет... А может тогда соберём что-то похожее из того, что есть — например «${sample.name}»? Очень надо выручить на «${occasion}»!`,
          moodChange: -4,
          dealStatus: 'talking'
        });
      }
      return JSON.stringify({
        reply: `Понимаю, раз этих цветов нет в наличии — ничего не поделаешь. Пойду поищу тогда в соседнем квартале, спасибо!`,
        moodChange: -8,
        dealStatus: 'left'
      });
    }

    if (isBudgetSmall) {
      if (Math.random() < 0.58) {
        return JSON.stringify({
          reply: `Погодите, не отпускайте сразу! Раз бюджет маловат — я могу накинуть ещё около 300 ₽, чтобы получилось красиво. Договоримся?`,
          moodChange: -3,
          dealStatus: 'talking'
        });
      }
      return JSON.stringify({
        reply: `Эх, понятно... Мой бюджет правда ограничен, больше не потяну. Ладно, попробую найти вариант попроще, всего доброго!`,
        moodChange: -8,
        dealStatus: 'left'
      });
    }

    if (isBusy) {
      if (Math.random() < 0.35 && !preorder) {
        return JSON.stringify({
          reply: `Ого, вижу, что у вас много заказов! А если взять уже готовый букет или пару стеблей без сложной сборки — так быстрее получится?`,
          moodChange: -4,
          dealStatus: 'talking'
        });
      }
      return JSON.stringify({
        reply: `Понимаю, когда столько заказов — тяжело всё успеть! Не буду отвлекать, загляну к вам в другой раз.`,
        moodChange: -7,
        dealStatus: 'left'
      });
    }

    if (Math.random() < 0.38) {
      return JSON.stringify({
        reply: `Услышал${isFemale ? 'а' : ''} вас («${reasonText}»). А если упростим состав или подберём другой вариант — всё равно никак не получится?`,
        moodChange: -4,
        dealStatus: 'talking'
      });
    }

    return JSON.stringify({
      reply: `Понятно, раз причина такая («${reasonText}») — не буду настаивать. Спасибо за честный ответ, хорошего дня!`,
      moodChange: -9,
      dealStatus: 'left'
    });
  }

  if (lastUser.startsWith('[Предложение продавца]')) {
    const offeredPrice = Number((lastUser.match(/за\s+(\d+)\s*₽/) || [])[1]) || 0;
    const stemsMatch = lastUser.match(/(\d+)\s*шт\./);
    const stemsCount = stemsMatch ? Number(stemsMatch[1]) : 1;
    const isBouquet = lastUser.includes('готовый букет');
    const isWilted = lower.includes('подвявш') || lower.includes('поникш') || lower.includes('вял');
    const offeredFlowers = detectMentionedFlowers(lastUser);

    if (isWilted) {
      const wiltedReplies = [
        'Ой, посмотрите на лепестки — эти цветы уже совсем поникли. Дарить такое неловко, давайте что-нибудь посвежее!',
        'Нет-нет, сразу видно, что бутоны уже уставшие. Мне бы свежих цветов, которые простоят хотя бы несколько дней.'
      ];
      return JSON.stringify({ reply: pickUnused(wiltedReplies, prevReplies), moodChange: -15, dealStatus: 'talking' });
    }

    if (preorder) {
      const hasOrderedFlower = offeredFlowers.includes(preorder.typeId);
      const alreadyMentionedSub = prevReplies.some((r) => r.includes('замена') || r.includes('заказывал'));

      if (!hasOrderedFlower && !alreadyMentionedSub) {
        return JSON.stringify({
          reply: `Ой, а я в Direct ${ordered} «${preorder.flowerName}» — это замена? Если тех нет, предупредите меня или добавьте их, пожалуйста!`,
          moodChange: -3,
          dealStatus: 'talking'
        });
      }

      if (stemsCount < Math.max(1, preorder.qty - 1) && !isBouquet) {
        return JSON.stringify({
          reply: `Погодите, в предзаказе было ${preorder.qty} шт. «${preorder.flowerName}», а здесь всего ${stemsCount} шт. Соберёте всё количество?`,
          moodChange: -3,
          dealStatus: 'talking'
        });
      }

      if (offeredPrice > preorder.reward * 1.28) {
        return JSON.stringify({
          reply: `Мы в Direct договаривались примерно на ${preorder.reward} ₽! За ${offeredPrice} ₽ уже ощутимо дороже, сделаете поближе к нашей договорённости?`,
          moodChange: -4,
          dealStatus: 'talking'
        });
      }

      return JSON.stringify({
        reply: `Вот это сервис! Всё готово ровно к ${preorder.dueTimeLabel} и выглядит восхитительно! Забираю за ${offeredPrice} ₽ и оставляю вам чаевые за заботу ❤️`,
        moodChange: 18,
        dealStatus: 'bought'
      });
    }

    if (postRef) {
      const postItems = postRef.items.length ? postRef.items : detectMentionedFlowers(postRef.desc);
      const hasPostMatch = postItems.length === 0 || offeredFlowers.some((id) => postItems.includes(id));
      const alreadyAskedPostMatch = prevReplies.some((r) => r.includes('на фото') || r.includes('в посте'));
      const postFlowersInShop = postItems.some((id) => availableVases.some((v) => v.id === id && !v.isWilted));

      if (!hasPostMatch && postFlowersInShop && !alreadyAskedPostMatch) {
        return JSON.stringify({
          reply: `Красиво, но на фото в вашем посте были другие цветы (${postRef.desc}) — а вижу, что в вазах они у вас есть! Соберёте как в посте?`,
          moodChange: -3,
          dealStatus: 'talking'
        });
      }
    }

    if (pref.includes('ненавидит белые лилии') && offeredFlowers.includes('lily_white')) {
      return JSON.stringify({
        reply: 'Ох, только не белые лилии! У меня от их запаха сразу голова кружится. Давайте без них, пожалуйста.',
        moodChange: -12,
        dealStatus: 'talking'
      });
    }

    if (pref.includes('не любит ромашки') && offeredFlowers.includes('chamomile_white')) {
      return JSON.stringify({
        reply: 'Ромашки для этого случая мне кажутся слишком простыми... Подберём что-то без них?',
        moodChange: -10,
        dealStatus: 'talking'
      });
    }

    if (isFuneral && stemsCount % 2 !== 0) {
      return JSON.stringify({
        reply: `Погодите, тут ${stemsCount} шт. — нечётное число! На такой печальный повод принято брать строго чётное количество.`,
        moodChange: -8,
        dealStatus: 'talking'
      });
    }

    if (isFuneral && offeredFlowers.some((id) => ['sunflower', 'peony_coral', 'peony_pink', 'rose_pink', 'tulip_yellow'].includes(id))) {
      return JSON.stringify({
        reply: 'Для траурного случая это выглядит слишком ярко и празднично. Мне бы строгие гвоздики, белые хризантемы или белые/красные розы без ярких лент.',
        moodChange: -8,
        dealStatus: 'talking'
      });
    }

    if (wantsMix && !isBouquet && stemsCount === 1 && budget >= 700 && availableVases.length >= 2) {
      return JSON.stringify({
        reply: `Один цветочек — это слишком скромно, мне бы ${wanted} собрать красивый смешанный букет из нескольких видов. Соберёте микс?`,
        moodChange: -4,
        dealStatus: 'talking'
      });
    }

    const isStrictMono = !postRef && !wantsMix && !isFuneral && preferredIds.length <= 4;
    const matchesPreferred = offeredFlowers.some((id) => preferredIds.includes(id));
    const alreadyComplainedWrongFlower = prevReplies.some((r) => r.includes('изначально') || r.includes('других цветов'));
    if (isStrictMono && !matchesPreferred && hasPreferredInShop && !alreadyComplainedWrongFlower) {
      const wantedHint = availableVases.find((v) => v.id && preferredIds.includes(v.id) && !v.isWilted);
      return JSON.stringify({
        reply: `Красиво, но я вообще изначально ${wanted} бы чего-то ближе к своему вкусу — например, вижу у вас есть ${wantedHint ? `«${wantedHint.name}»` : 'подходящие цветы'}. Покажете такой вариант?`,
        moodChange: -3,
        dealStatus: 'talking'
      });
    }

    const maxAcceptable = Math.round(budget * (mood >= 75 ? 1.15 : 1.1));
    if (offeredPrice > maxAcceptable) {
      const target = Math.round((budget * 0.95) / 10) * 10;
      const priceyReplies = [
        `Красиво, не спорю, но ${offeredPrice} ₽ для меня сейчас кусается. Вот около ${target} ₽ — это мой предел. Уступите или чуть уменьшим состав?`,
        `Эх, дороговато — рассчитываю примерно на ${target} ₽. Можем сделать небольшую скидку или подобрать что-то поскромнее?`,
        `За ${offeredPrice} ₽ я не потяну, бюджет у меня до ${budget} ₽. Давайте подумаем, как уложиться.`
      ];
      return JSON.stringify({ reply: pickUnused(priceyReplies, prevReplies), moodChange: -5, dealStatus: 'talking' });
    }

    const happyBought = postRef
      ? [
          `Вау, прямо один в один как на фото из InstaFlower! Забираю за ${offeredPrice} ₽, вы настоящие волшебники 💐`,
          `Идеально, даже лучше, чем в посте! С радостью оплачиваю ${offeredPrice} ₽, спасибо!`
        ]
      : isGrumpy
      ? [
          `Хм, за ${offeredPrice} ₽ вполне достойная работа. Забираю, благодарю за внимание!`,
          `Ладно, выглядит крепко и со вкусом, и цена ${offeredPrice} ₽ разумная. Оформляйте, я ${glad} покупке.`
        ]
      : [
          `Ой, какая красота! И по цене ${offeredPrice} ₽ мне отлично подходит. С огромным удовольствием забираю, спасибо вам!`,
          `Просто прелесть, прямо в точку! Забираю за ${offeredPrice} ₽, спасибо за помощь и тёплый приём!`,
          `Идеально! Очень ${glad}, что ${came} именно к вам. Оплачиваю ${offeredPrice} ₽ и бегу!`
        ];

    return JSON.stringify({ reply: pickUnused(happyBought, prevReplies), moodChange: 15, dealStatus: 'bought' });
  }

  if (isRudeText(lower)) {
    return JSON.stringify({
      reply: 'Ну знаете! Я к вам со всей душой, а вы так грубите. Пойду-ка я в другой цветочный.',
      moodChange: -25,
      dealStatus: 'left'
    });
  }

  if (preorder && (lower.includes('готов') || lower.includes('держ') || lower.includes('забир') || lower.includes('сейчас'))) {
    return JSON.stringify({
      reply: `Отлично! Нажмите кнопку «💐 Предложить букет», чтобы я ${looked} и оплатил${isFemale ? 'а' : ''} заказ.`,
      moodChange: 4,
      dealStatus: 'talking'
    });
  }

  if (
    lower.includes('как дела') ||
    lower.includes('как вы') ||
    lower.includes('как настроение') ||
    lower.includes('как день') ||
    lower.includes('как жизнь') ||
    lower.includes('всё хорошо')
  ) {
    const moodReplies = isGrumpy
      ? [
          `День суматошный, пока ничего толкового не ${isFemale ? 'нашла' : 'нашёл'}. Надеюсь, у вас дела лучше и цветы свежие!`,
          `Бывало и лучше, но как заходишь в цветочный — сразу дышится приятнее. Давайте к делу!`
        ]
      : isHurry
      ? [
          `Спасибо, всё на бегу! Главное успеть подобрать букет на повод «${occasion}».`,
          `Дела кипят! Надеюсь, у вас получится быстро собрать мне что-нибудь эффектное.`
        ]
      : [
          `Спасибо, всё замечательно! А у вас в лавке так пахнет цветами, что настроение сразу вверх идёт!`,
          `Чудесно, особенно когда выбираешь красивые цветы. Кстати, мой повод — ${occasion}!`
        ];
    return JSON.stringify({ reply: pickUnused(moodReplies, prevReplies), moodChange: 4, dealStatus: 'talking' });
  }

  if (/^(да|ага|угу|конечно|хорошо|ладно|ок|окей|договорились|уступлю|сделаю|соберу|можно|без проблем)[!.]?$/.test(lower)) {
    if (lastBotReply.includes('скид') || lastBotReply.includes('уступ') || lastBotReply.includes('дорог') || lastBotReply.includes('бюджет') || lastBotReply.includes('накинуть')) {
      return JSON.stringify({
        reply: `Отлично, спасибо за понимание! Тогда нажмите «💐 Предложить букет» и поставьте удобную цену — я сразу оплачу.`,
        moodChange: 5,
        dealStatus: 'talking'
      });
    }
    if (lastBotReply.includes('микс') || lastBotReply.includes('собер') || lastBotReply.includes('покаж') || lastBotReply.includes('вариант') || lastBotReply.includes('замен') || lastBotReply.includes('посте')) {
      return JSON.stringify({
        reply: `Супер! Буду ждать — как будет готово, покажите мне вариант через кнопку предложения.`,
        moodChange: 4,
        dealStatus: 'talking'
      });
    }
  }

  const priceMentionMatch = lower.match(/(?:за|до|цена|руб|₽)?\s*(\d{3,5})\s*(?:₽|руб|р\b)?/);
  const hasPriceContext = lower.includes('₽') || lower.includes('руб') || lower.includes('за ') || lower.includes('скин') || lower.includes('отдам') || lower.includes('цен');
  const mentionedFlowers = detectMentionedFlowers(lastUser);

  if (priceMentionMatch && hasPriceContext && !lower.includes('бюджет') && mentionedFlowers.length === 0) {
    const mentionedPrice = Number(priceMentionMatch[1]);
    if (mentionedPrice <= budget * 1.08) {
      return JSON.stringify({
        reply: pickUnused([
          `${mentionedPrice} ₽ — это звучит очень хорошо! Нажмите кнопку предложения с этой ценой, и я сразу заберу.`,
          `За ${mentionedPrice} ₽ я с радостью соглашусь! Оформляйте предложение через витрину.`
        ], prevReplies),
        moodChange: 5,
        dealStatus: 'talking'
      });
    }
    const target = Math.round((budget * 0.95) / 10) * 10;
    return JSON.stringify({
      reply: `Ох, ${mentionedPrice} ₽ всё-таки чуть тяжеловато — мне бы уложиться хотя бы в ${target}–${budget} ₽. Получится?`,
      moodChange: -2,
      dealStatus: 'talking'
    });
  }

  if (mentionedFlowers.length > 0) {
    if (pref.includes('ненавидит белые лилии') && mentionedFlowers.includes('lily_white')) {
      return JSON.stringify({
        reply: 'Только без белых лилий, пожалуйста — у меня от их аромата сразу голова начинает болеть.',
        moodChange: -4,
        dealStatus: 'talking'
      });
    }
    if (pref.includes('не любит ромашки') && mentionedFlowers.includes('chamomile_white')) {
      return JSON.stringify({
        reply: 'Ромашки мне не очень нравятся — для этого повода хочется что-то более нарядное.',
        moodChange: -3,
        dealStatus: 'talking'
      });
    }
    if (isFuneral && mentionedFlowers.some((id) => ['sunflower', 'peony_coral', 'peony_pink', 'rose_pink', 'tulip_yellow'].includes(id))) {
      return JSON.stringify({
        reply: 'Для траурного букета это слишком яркие оттенки... Лучше красные гвоздики, белые хризантемы или спокойные розы.',
        moodChange: -3,
        dealStatus: 'talking'
      });
    }

    const matchingNames = mentionedFlowers
      .map((id) => FLOWERS_CATALOG[id]?.name)
      .filter(Boolean);
    const uniqueNames = [...new Set(matchingNames)].slice(0, 3).join(', ');
    const fitsTaste = mentionedFlowers.some((id) => preferredIds.includes(id));

    if (fitsTaste) {
      return JSON.stringify({
        reply: pickUnused([
          `О, ${uniqueNames.toLowerCase()} — это как раз то, что нужно! По бюджету у меня до ${budget} ₽ — покажете готовое предложение?`,
          `Отличный выбор (${uniqueNames.toLowerCase()})! Очень подходит под «${occasion}». Давайте посмотрим, как оформим!`
        ], prevReplies),
        moodChange: 6,
        dealStatus: 'talking'
      });
    }

    return JSON.stringify({
      reply: pickUnused([
        `${uniqueNames} звучит неплохо! Вообще мне по душе больше ${pref.replace(/^хочет |^ищет |^любит |^обожает |^просит /i, '')}, но если по цене в пределах ${budget} ₽ — давайте посмотрим вариант!`,
        `Интересная идея с «${uniqueNames.toLowerCase()}». Главное, чтобы уложились в ${budget} ₽ и выглядело свежо!`
      ], prevReplies),
      moodChange: 2,
      dealStatus: 'talking'
    });
  }

  if (
    lower.includes('посовет') ||
    lower.includes('подскаж') ||
    lower.includes('предлож') ||
    lower.includes('помочь') ||
    lower.includes('люб') ||
    lower.includes('хот') ||
    lower.includes('вкус') ||
    lower.includes('предпоч') ||
    lower.includes('какие') ||
    lower.includes('состав') ||
    lower.includes('микс') ||
    lower.includes('вариант')
  ) {
    if (postRef) {
      return JSON.stringify({
        reply: `Мне прямо запал в душу букет с вашего фото в InstaFlower (${postRef.desc}). Если есть все цветы — соберите такой же до ${budget} ₽, пожалуйста!`,
        moodChange: 4,
        dealStatus: 'talking'
      });
    }

    const goodVases = availableVases.filter((v) => !v.isWilted && v.id && preferredIds.includes(v.id));
    if (goodVases.length >= 2 && wantsMix) {
      return JSON.stringify({
        reply: pickUnused([
          `Смотрю на ваши вазы — мне очень нравятся «${goodVases[0].name}» и «${goodVases[1].name}»! Было бы здорово собрать из них букет в пределах ${budget} ₽.`,
          `Если по моему вкусу (${pref}), я бы ${pickedWord(isFemale)} сочетание из «${goodVases[0].name}» и «${goodVases[1].name}»!`
        ], prevReplies),
        moodChange: 5,
        dealStatus: 'talking'
      });
    }
    if (goodVases.length >= 1) {
      return JSON.stringify({
        reply: pickUnused([
          `Я ${noticed} у вас на витрине «${goodVases[0].name}» (${goodVases[0].price} ₽/шт.) — как раз в моём вкусе! Соберёте красивый вариант до ${budget} ₽?`,
          `Если честно по душе: ${pref}. Очень приглянулись «${goodVases[0].name}» — подойдёт нам под повод «${occasion}»!`
        ], prevReplies),
        moodChange: 5,
        dealStatus: 'talking'
      });
    }
    return JSON.stringify({
      reply: pickUnused([
        `Если честно по душе: ${pref}. Но если именно таких нет, покажите что-то свежее и подходящее до ${budget} ₽ — я не капризн${isFemale ? 'ая' : 'ый'}!`,
        `Мне бы очень подошло что-то такое: ${pref}. Что из свеженького у вас сейчас лучше всего сочетается?`
      ], prevReplies),
      moodChange: 4,
      dealStatus: 'talking'
    });
  }

  if (lower.includes('сколько штук') || lower.includes('сколько стеб') || lower.includes('количеств') || lower.includes('штук')) {
    if (isFuneral) {
      return JSON.stringify({
        reply: `Строго чётное количество — 4, 6 или 8 штук, в зависимости от цены, чтобы уложиться в ${budget} ₽.`,
        moodChange: 2,
        dealStatus: 'talking'
      });
    }
    const approxCount = budget >= 1500 ? '5–7' : budget >= 900 ? '3–5' : '1–3';
    return JSON.stringify({
      reply: `Думаю, оптимально ${approxCount} стеблей — так, чтобы смотрелось гармонично и уложилось в мой бюджет около ${budget} ₽.`,
      moodChange: 3,
      dealStatus: 'talking'
    });
  }

  if (lower.includes('упаков') || lower.includes('бумаг') || lower.includes('пленк') || lower.includes('плёнк') || lower.includes('лент') || lower.includes('оформ')) {
    const packReply = isFuneral
      ? 'Оформление нужно самое сдержанное, без ярких бантиков и блестящих плёнок.'
      : isRomantic
      ? 'Обожаю нежную матовую бумагу или кремовую/розовую ленточку — так букет смотрится особенно тепло и трогательно!'
      : pickUnused([
          'Люблю, когда упаковка выглядит аккуратно и со вкусом — матовая бумага или крафт с лентой всегда добавляют шарма!',
          'Доверяю вашему вкусу в оформлении! Прозрачная плёнка или стильная бумага в тон бутонам будут супер.'
        ], prevReplies);
    return JSON.stringify({ reply: packReply, moodChange: 4, dealStatus: 'talking' });
  }

  if (lower.includes('бюджет') || lower.includes('сумм') || lower.includes('цен') || lower.includes('сколько') || lower.includes('денег') || lower.includes('почём')) {
    return JSON.stringify({
      reply: pickUnused([
        `Рассчитываю уложиться примерно в ${budget} ₽. Если букет прямо очень зацепит, смогу чуть-чуть подвинуться.`,
        `Мой бюджет около ${budget} ₽ — ${wanted} бы найти золотую середину между красотой и ценой.`
      ], prevReplies),
      moodChange: 2,
      dealStatus: 'talking'
    });
  }

  if (lower.includes('повод') || lower.includes('кому') || lower.includes('зачем') || lower.includes('праздник') || lower.includes('случай')) {
    return JSON.stringify({
      reply: pickUnused([
        `Повод у меня такой: ${occasion}. Очень хочется, чтобы цветы передали нужное настроение!`,
        `Выбираю букет на «${occasion}» — важно, чтобы выглядело уместно и со вкусом.`
      ], prevReplies),
      moodChange: 3,
      dealStatus: 'talking'
    });
  }

  if (lower.includes('скид') || lower.includes('уцен') || lower.includes('торг') || lower.includes('дешев')) {
    return JSON.stringify({
      reply: pickUnused([
        'Скидки я люблю, но главное, чтобы сами бутоны не были вялыми! Покажете вариант и цену?',
        'Если сделаете приятную скидку в пределах моего бюджета — с радостью посмотрю!'
      ], prevReplies),
      moodChange: 4,
      dealStatus: 'talking'
    });
  }

  if (lower.includes('привет') || lower.includes('здравств') || lower.includes('добр')) {
    return JSON.stringify({
      reply: pickUnused([
        `Здравствуйте ещё раз! Как я уже ${said}, ищу цветы на повод «${occasion}». Есть какие-нибудь красивые идеи?`,
        `Добрый день! Очень приятно общаться. Расскажите, что у вас сегодня самое свежее в наличии?`
      ], prevReplies),
      moodChange: 3,
      dealStatus: 'talking'
    });
  }

  if (lower.includes('погод') || lower.includes('дожд') || lower.includes('мороз') || lower.includes('снег') || lower.includes('холод') || lower.includes('тепл')) {
    return JSON.stringify({
      reply: `Да, на улице погода переменчивая, зато у вас в магазине настоящее цветочное тепло! Покажете, что можно выбрать?`,
      moodChange: 4,
      dealStatus: 'talking'
    });
  }

  if (lower.includes('красив') || lower.includes('лучш') || lower.includes('постара') || lower.includes('спасиб')) {
    return JSON.stringify({
      reply: pickUnused([
        'Ой, спасибо за заботу! Верю в ваш вкус — нажимайте «Предложить букет», когда всё будет готово.',
        'Приятно иметь дело с профи! С нетерпением жду, что вы мне покажете.'
      ], prevReplies),
      moodChange: 5,
      dealStatus: 'talking'
    });
  }

  const genericReplies = [
    `Понятно! Напомню: у меня ${occasion}, бюджет примерно до ${budget} ₽. ${looked.charAt(0).toUpperCase() + looked.slice(1)} бы на ваш вариант!`,
    `Хорошо, я ${ready} выбрать! Если предложите подходящий букет или цветок по цене до ${budget} ₽, я сразу оценю.`,
    `Звучит интересно! Покажите мне готовый букет или конкретный цветок через кнопку предложения — посмотрим, как смотрится.`,
    `Ага, ${isFemale ? 'поняла' : 'понял'} вашу мысль. Главное для меня сейчас — свежесть и настроение под «${occasion}». Что предложите?`,
    `Если соберёте что-то на столе сборки или подберёте с витрины в рамках ${budget} ₽ — я с удовольствием посмотрю!`
  ];

  return JSON.stringify({
    reply: pickUnused(genericReplies, prevReplies),
    moodChange: 2,
    dealStatus: 'talking'
  });
}

function pickedWord(isFemale) {
  return isFemale ? 'выбрала' : 'выбрал';
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  const latestMin = closeMin - 20;

  if (latestMin - curMin < 55) return null;

  const rawOffset = 60 + Math.floor(Math.random() * 95);
  const clamped = Math.min(latestMin, curMin + rawOffset);
  const rounded = Math.round(clamped / 15) * 15;
  const finalMin = Math.max(curMin + 35, Math.min(latestMin, rounded));
  return {
    dueMinutes: finalMin,
    dueTimeLabel: formatMinutesAsTime(finalMin)
  };
}

export async function generateDirectMessage() {
  const flowerKeys = Object.keys(FLOWERS_CATALOG);
  const randomFlowerId = pickRandom(flowerKeys);
  const randomFlower = FLOWERS_CATALOG[randomFlowerId];
  const qty = 3 + Math.floor(Math.random() * 5);
  const reward = randomFlower.price * qty + 140;
  const dueSlot = computePreorderDueSlot();

  if (aiSettings.provider === 'offline') {
    await sleep(220);
    return createFallbackDirectMessage(randomFlowerId, randomFlower.name, qty, reward, dueSlot);
  }

  const usedNicks = (gameState.directMessages || [])
    .slice(0, 15)
    .map((m) => m.senderName)
    .filter(Boolean);
  const usedSet = new Set(usedNicks.map((n) => n.toLowerCase()));
  const canPreorder = Boolean(dueSlot);
  const randomSeedHint = Math.floor(1000 + Math.random() * 9000);

  const prompt = `Сгенерируй одно входящее сообщение в Direct для цветочного магазина "${gameState.shopName || 'Fleur Atelier'}" (только самовывоз, курьерской доставки нет; подписчиков: ${gameState.followers}, время: ${formatMinutesAsTime(gameState.timeMinutes || 540)}, seed=${randomSeedHint}).
Выбери ОДИН случайный тип:
${canPreorder ? `- "preorder": клиент просит предзаказ на ${qty} шт. "${randomFlower.name}", заберёт сам ровно к ${dueSlot.dueTimeLabel} (бюджет ${reward} ₽). Обязательно упомяни время ${dueSlot.dueTimeLabel}!` : ''}
- "question": вопрос про самовывоз, уход за цветами, наличие сортов или график работы (не проси доставку курьером на улицу).
- "review": тёплый отзыв или лёгкая критика про цены/упаковку.
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
        // Если ИИ всё же повторил ник, делаем его уникальным добавлением числа
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
  return createFallbackDirectMessage(randomFlowerId, randomFlower.name, qty, reward, dueSlot);
}

function createFallbackDirectMessage(typeId, flowerName, qty, reward, dueSlot) {
  const roll = Math.random();
  const usedSet = new Set((gameState.directMessages || []).map((m) => String(m.senderName || '').toLowerCase()));
  const sender = generateProceduralNick(usedSet);
  const nowLabel = formatMinutesAsTime(gameState.timeMinutes || 540);

  if (dueSlot && roll < 0.48) {
    const texts = [
      `Здравствуйте! Можно оформить предзаказ на ${qty} шт. «${flowerName}» с получением к ${dueSlot.dueTimeLabel}? Бюджет ${reward} ₽!`,
      `Добрый день! Очень нужен букетик из ${qty} шт. (${flowerName}), смогу забрать ровно в ${dueSlot.dueTimeLabel}. Сделаете за ${reward} ₽?`
    ];
    const msgText = pickRandom(texts);
    return {
      id: 'dm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      senderName: sender,
      kind: 'preorder',
      text: msgText,
      read: false,
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
        accepted: false,
        rejected: false,
        done: false
      },
      replyText: null
    };
  }
  if (roll < 0.78) {
    const questions = [
      'Добрый день! Подскажите, как лучше ухаживать за букетом дома, чтобы дольше стоял?',
      'Здравствуйте! Вы подрезаете стебли перед сборкой и можно ли выбрать прозрачную плёнку?',
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
    blockedByPlayer: false,
    blockedByClient: false,
    day: gameState.day,
    createdTimeLabel: nowLabel,
    thread: [{ sender: 'client', text: msgText }],
    order: null,
    replyText: null
  };
}

export async function generateDirectFollowUp(dm, playerText, action = 'reply') {
  if (isRudeText(playerText)) {
    return {
      reply: 'Ну знаете, так с клиентами не разговаривают! Всего доброго, отправляю ваш профиль в чёрный список.',
      moodDelta: -5,
      followerDelta: -1,
      persuadeAttempt: false,
      blockedByClient: true,
      newOrder: null
    };
  }

  if (aiSettings.provider === 'offline') {
    await sleep(220);
    return runOfflineDirectFollowUp(dm, playerText, action);
  }

  const threadText = (dm.thread || [])
    .map((m) => `${m.sender === 'player' ? 'Флорист' : dm.senderName}: ${m.text}`)
    .join('\n');

  const dueSlot = !dm.order ? computePreorderDueSlot() : null;
  const orderInfo = dm.order
    ? `Предзаказ: ${dm.order.qty} шт. «${dm.order.flowerName}» к ${dm.order.dueTimeLabel} за ${dm.order.reward} ₽. Попыток отказа уже было: ${dm.rejectAttempts || 0}.`
    : 'Предзаказа пока нет (идёт обычный разговор на вопрос/отзыв).';

  const flowerListHint = Object.values(FLOWERS_CATALOG)
    .map((f) => `${f.id}:${f.name}`)
    .join(', ');

  const prompt = `Ты — пользователь ${dm.senderName}, переписываешься в Direct с цветочным магазином "${gameState.shopName || 'Fleur Atelier'}".
Контекст: ${orderInfo}
История переписки:
${threadText}
Новое сообщение флориста (${action === 'reject' ? 'ОТКАЗ от заказа с указанием причины' : 'ответ в чате'}): "${playerText}"

ПРАВИЛА:
1. Отвечай живо, коротко (1–2 предложения) на русском, прямо учитывая то, что написал флорист!
2. Блокировка: ТОЛЬКО если флорист явно хамит, оскорбляет или издевается — поставь "blockedByClient": true и попрощайся! На вежливый ответ или честный отказ НЕ блокируй ("blockedByClient": false).
3. ${action === 'reject'
    ? 'Если это ОТКАЗ от предзаказа: при серьёзной причине или 2-м отказе попрощайся ("persuadeAttempt": false). При 1-м отказе из-за нехватки цветов/времени/бюджета в ~40% случаев попробуй договориться ("persuadeAttempt": true).'
    : `Если предзаказа ещё нет${dueSlot ? ` и флорист ответил тепло/полезно, ты можешь в ~40% случаев прямо посреди разговора решить оформить предзаказ ко времени ${dueSlot.dueTimeLabel}! Тогда заполни "newOrder": {"typeId": "один из id", "qty": 3..7}` : ''}.`}
Доступные цветы: ${flowerListHint}.

ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{"reply": "ответ собеседника", "moodDelta": 2, "followerDelta": 0, "persuadeAttempt": false, "blockedByClient": false, "newOrder": null}`;

  try {
    const raw = await callAI([{ role: 'user', content: prompt }]);
    const cleaned = stripCodeFences(raw);
    const s = cleaned.indexOf('{');
    const e = cleaned.lastIndexOf('}');
    if (s !== -1 && e > s) {
      const parsed = JSON.parse(cleaned.slice(s, e + 1));
      let builtOrder = null;
      if (!dm.order && action === 'reply' && dueSlot && parsed.newOrder && FLOWERS_CATALOG[parsed.newOrder.typeId]) {
        const fMeta = FLOWERS_CATALOG[parsed.newOrder.typeId];
        const qty = Math.max(1, Math.min(11, Number(parsed.newOrder.qty) || 5));
        builtOrder = {
          typeId: fMeta.id,
          flowerName: fMeta.name,
          qty,
          reward: fMeta.price * qty + 140,
          dueMinutes: dueSlot.dueMinutes,
          dueTimeLabel: dueSlot.dueTimeLabel
        };
      }

      return {
        reply: String(parsed.reply || 'Спасибо за ответ!').trim(),
        moodDelta: Math.max(-5, Math.min(5, Number(parsed.moodDelta) || 0)),
        followerDelta: Math.max(-1, Math.min(2, Number(parsed.followerDelta) || 0)),
        persuadeAttempt: action === 'reject' && (dm.rejectAttempts || 0) === 0 ? Boolean(parsed.persuadeAttempt) : false,
        blockedByClient: Boolean(parsed.blockedByClient),
        newOrder: builtOrder
      };
    }
  } catch (err) {
    console.warn('Fallback ответа в Direct:', err);
  }

  return runOfflineDirectFollowUp(dm, playerText, action);
}

function runOfflineDirectFollowUp(dm, playerText, action) {
  const lower = String(playerText || '').toLowerCase();

  if (action === 'reject') {
    const attempts = dm.rejectAttempts || 0;
    const isClosing = lower.includes('закры') || lower.includes('поздн');
    const isNoFlowers = lower.includes('нет ') || lower.includes('наличи') || lower.includes('законч') || lower.includes('не хват');
    const isBusy = lower.includes('успе') || lower.includes('много заказ') || lower.includes('завал') || lower.includes('времени');
    const isBudget = lower.includes('бюджет') || lower.includes('мал') || lower.includes('дорог') || lower.includes('цен');

    if (attempts === 0 && !isClosing && dm.order) {
      if (isNoFlowers && Math.random() < 0.55) {
        return {
          reply: `Ох, очень жаль, что «${dm.order.flowerName}» нет... А можно заменить на похожие свежие цветы, какие у вас сейчас есть? Я бы всё равно забрал(а) к ${dm.order.dueTimeLabel}!`,
          moodDelta: 0,
          followerDelta: 0,
          persuadeAttempt: true,
          blockedByClient: false,
          newOrder: null
        };
      }
      if (isBusy && Math.random() < 0.45) {
        return {
          reply: `Понимаю, когда много заказов! А если я подойду на часик попозже — успеете собрать? Очень хочется букет именно от вас!`,
          moodDelta: 0,
          followerDelta: 0,
          persuadeAttempt: true,
          shiftMinutes: 45,
          blockedByClient: false,
          newOrder: null
        };
      }
      if (isBudget && Math.random() < 0.55) {
        return {
          reply: `Погодите, не отказывайте сразу! Если я доплачу ещё +150 ₽ (итого ${dm.order.reward + 150} ₽), возьмёте заказ в работу?`,
          moodDelta: 0,
          followerDelta: 0,
          persuadeAttempt: true,
          offerTipBoost: 150,
          blockedByClient: false,
          newOrder: null
        };
      }
    }

    if (isClosing) {
      return {
        reply: 'Понял(а), раз уже к закрытию не успеваете — спасибо, что предупредили заранее! Загляну к вам завтра 🌸',
        moodDelta: -1,
        followerDelta: 0,
        persuadeAttempt: false,
        blockedByClient: false,
        newOrder: null
      };
    }
    if (isNoFlowers) {
      return {
        reply: 'Эх, жалко, что нужных цветов нет в наличии... Буду знать, спасибо за быстрый ответ!',
        moodDelta: -1,
        followerDelta: 0,
        persuadeAttempt: false,
        blockedByClient: false,
        newOrder: null
      };
    }
    if (isBusy) {
      return {
        reply: 'Ого, у вас сегодня горячий день! Ничего страшного, успехов с заказами, напишу в другой раз 😊',
        moodDelta: 0,
        followerDelta: 0,
        persuadeAttempt: false,
        blockedByClient: false,
        newOrder: null
      };
    }
    return {
      reply: `Хорошо, спасибо, что честно предупредили («${playerText}»). Обращусь тогда в другой день, удачной смены!`,
      moodDelta: -1,
      followerDelta: 0,
      persuadeAttempt: false,
      blockedByClient: false,
      newOrder: null
    };
  }

  const dueSlot = !dm.order ? computePreorderDueSlot() : null;
  const isNegativeAnswer = lower.includes('нет') || lower.includes('не смож') || lower.includes('закры') || lower.includes('законч');
  if (!dm.order && dueSlot && playerText.trim().length >= 5 && !isNegativeAnswer) {
    const mentioned = detectMentionedFlowers(playerText);
    const invitesOrder =
      mentioned.length > 0 ||
      lower.includes('собер') ||
      lower.includes('заказ') ||
      lower.includes('приход') ||
      lower.includes('есть') ||
      lower.includes('свеж') ||
      lower.includes('ждём') ||
      lower.includes('ждем');
    const orderChance = invitesOrder ? 0.68 : 0.42;

    if (Math.random() < orderChance) {
      const pool = mentioned.length ? mentioned : Object.keys(FLOWERS_CATALOG);
      const chosenId = pickRandom(pool);
      const meta = FLOWERS_CATALOG[chosenId] || FLOWERS_CATALOG.rose_red;
      const qty = 3 + Math.floor(Math.random() * 5);
      const reward = meta.price * qty + 140;

      return {
        reply: `Ой, вы так здорово и тепло отвечаете! Давайте я прямо сейчас оформлю предзаказ на ${qty} шт. «${meta.name}» к ${dueSlot.dueTimeLabel} за ${reward} ₽ — примете? 💐`,
        moodDelta: 3,
        followerDelta: 1,
        persuadeAttempt: false,
        blockedByClient: false,
        newOrder: {
          typeId: meta.id,
          flowerName: meta.name,
          qty,
          reward,
          dueMinutes: dueSlot.dueMinutes,
          dueTimeLabel: dueSlot.dueTimeLabel
        }
      };
    }
  }

  if (dm.kind === 'review') {
    if (lower.includes('спасиб') || lower.includes('рад') || lower.includes('приятн') || lower.includes('ждём') || lower.includes('ждем')) {
      return {
        reply: 'И вам спасибо за такую душевную атмосферу! Уже подписалась и советую вашу лавку друзьям ❤️',
        moodDelta: 3,
        followerDelta: 1,
        persuadeAttempt: false,
        blockedByClient: false,
        newOrder: null
      };
    }
    return {
      reply: 'Так приятно, когда магазин читает сообщения и отвечает лично! Обязательно загляну скоро за новым букетом ✨',
      moodDelta: 2,
      followerDelta: 1,
      persuadeAttempt: false,
      blockedByClient: false,
      newOrder: null
    };
  }

  if (dm.kind === 'question') {
    if (lower.includes('вод') || lower.includes('подрез') || lower.includes('прохлад') || lower.includes('менять') || lower.includes('уход')) {
      return {
        reply: 'Ого, спасибо за такой полезный совет по уходу! Обязательно сохраню и загляну к вам за свежими цветочками 🌸',
        moodDelta: 3,
        followerDelta: 1,
        persuadeAttempt: false,
        blockedByClient: false,
        newOrder: null
      };
    }
    if (lower.includes('до ') || lower.includes(':00') || lower.includes('работ') || lower.includes('открыт') || lower.includes('приход')) {
      return {
        reply: 'Отлично, тогда точно успеваю заскочить! До скорой встречи в вашей лавке!',
        moodDelta: 2,
        followerDelta: 1,
        persuadeAttempt: false,
        blockedByClient: false,
        newOrder: null
      };
    }
    if (lower.includes('есть') || lower.includes('свеж') || lower.includes('можем') || lower.includes('пленк') || lower.includes('бумаг')) {
      return {
        reply: 'Супер, это как раз то, что нужно! Уже присматриваю вариант к ближайшему поводу ✨',
        moodDelta: 2,
        followerDelta: 1,
        persuadeAttempt: false,
        blockedByClient: false,
        newOrder: null
      };
    }
    if (isNegativeAnswer) {
      return {
        reply: 'Понял(а), спасибо, что подсказали! Тогда посмотрю, что ещё интересного у вас появится в ленте.',
        moodDelta: 1,
        followerDelta: 0,
        persuadeAttempt: false,
        blockedByClient: false,
        newOrder: null
      };
    }
  }

  if (dm.order && dm.order.accepted) {
    return {
      reply: `Договорились! Буду ровно к ${dm.order.dueTimeLabel}, уже в предвкушении букета 💐`,
      moodDelta: 2,
      followerDelta: 0,
      persuadeAttempt: false,
      blockedByClient: false,
      newOrder: null
    };
  }

  return {
    reply: 'Большое спасибо за быстрый и тёплый ответ! Будем на связи 🌸',
    moodDelta: 2,
    followerDelta: 1,
    persuadeAttempt: false,
    blockedByClient: false,
    newOrder: null
  };
}