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