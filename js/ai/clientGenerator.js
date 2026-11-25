/**
 * js/ai/clientGenerator.js
 * 100% уникальная ИИ-генерация клиентов, предзаказов и сборка системного промпта
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
  callAI,
  stripCodeFences,
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
  BG_TINTS
} from './clientTemplates.js';

const recentClientNames = [];
const recentOccasions = [];

function rememberClientMeta(name, occasion) {
  if (name) {
    recentClientNames.unshift(name);
    if (recentClientNames.length > 16) recentClientNames.length = 16;
  }
  if (occasion) {
    recentOccasions.unshift(occasion);
    if (recentOccasions.length > 14) recentOccasions.length = 14;
  }
}

function getHumanFreshnessWord(freshness) {
  if (freshness >= 70) return 'свежие и крепкие';
  if (freshness >= 40) return 'обычные';
  return 'сильно подвявшие, поникшие';
}

function getShopAssortmentSummary() {
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

  return { vasesText, bouquetsText, accessoriesText };
}

function parseGeneratedJson(rawText) {
  const cleaned = stripCodeFences(rawText);
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end <= start) {
    throw new Error('ИИ не вернул JSON при создании клиента');
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

function buildAppearance(gender, age) {
  const hairOptions = gender === 'female' ? ['long', 'bob', 'bun'] : ['short', 'quiff', 'buzz'];
  const hairColor = age >= 52 ? pickRandom(SENIOR_HAIR) : pickRandom(YOUNG_HAIR);
  return {
    gender,
    age,
    skin: pickRandom(SKINS),
    hairStyle: pickRandom(hairOptions),
    hairColor,
    shirtColor: pickRandom(SHIRT_COLORS),
    hasGlasses: age >= 50 ? Math.random() < 0.65 : Math.random() < 0.25,
    hasBeard: gender === 'male' && (age >= 32 ? Math.random() < 0.45 : Math.random() < 0.15),
    bgTint: pickRandom(BG_TINTS)
  };
}

export async function generateRandomClient() {
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

  const badgeName = String(gameState.playerBadgeName || '').trim();
  const noticedBadge = Boolean(badgeName) && Math.random() < 0.42;
  const badgeRule = noticedBadge
    ? `На груди у продавца бейджик с именем «${badgeName}». ${getBadgeRuleText()} Можешь 1 раз естественно обратиться по имени.`
    : '';

  const ageRoll = Math.random();
  const targetAge =
    ageRoll < 0.45
      ? 19 + Math.floor(Math.random() * 13)
      : ageRoll < 0.82
      ? 32 + Math.floor(Math.random() * 17)
      : 49 + Math.floor(Math.random() * 22);
  const targetGender = Math.random() < 0.54 ? 'female' : 'male';
  const targetGenderLabel = targetGender === 'female' ? 'женщина/девушка' : 'мужчина/парень';

  const { vasesText, bouquetsText, accessoriesText } = getShopAssortmentSummary();
  const seed = Math.floor(10000 + Math.random() * 89999);

  let contextHook = `Текущий сезон: ${season.label}.`;
  if (holiday) contextHook += ` Сегодня праздник: ${holiday.name}!`;
  if (inspiredByPost) {
    contextHook += `\nОСОБЫЙ МОТИВ: Этот человек увидел ваш пост в InstaFlower («${inspiredByPost.description}»${inspiredByPost.targetPrice ? `, ориентир цены ${inspiredByPost.targetPrice} ₽` : ''}) и зашёл за таким же или похожим букетом!`;
  } else if (isViralClient) {
    contextHook += `\nОСОБЫЙ МОТИВ: Клиент пришёл по вирусному сезонному тренду/акции из соцсетей и готов к более щедрому бюджету.`;
  }

  const prompt = `Придумай С НУЛЯ абсолютно нового, уникального, живого покупателя в цветочный магазин "${gameState.shopName || 'Fleur Atelier'}" (seed=${seed}).
ОБЯЗАТЕЛЬНЫЕ ПАРАМЕТРЫ ЭТОГО ЧЕЛОВЕКА:
- Пол: строго ${targetGenderLabel} ("gender": "${targetGender}").
- Возраст: строго около ${targetAge} лет.
${contextHook}
${badgeRule}

АССОРТИМЕНТ МАГАЗИНА:
${vasesText}
${bouquetsText}
СОПУТСТВУЮЩИЕ ТОВАРЫ:
${accessoriesText}

ТРЕБОВАНИЯ:
1. ИМЯ: Обычное реальное русское имя (без выдуманных и искажённых имён). Не повторяй недавние имена: ${recentClientNames.join(', ') || 'пока нет'}.
2. ПОВОД: Придумай с нуля абсолютно любую живую причину покупки, логичную для человека ${targetAge} лет (${targetGenderLabel}). Не повторяй недавние поводы: ${recentOccasions.join('; ') || 'пока нет'}. Пиши грамотно по-русски без ошибок в падежах.
3. ТОЛЬКО ПРЯМАЯ РЕЧЬ: В поле "reply" пиши только слова, которые человек произносит вслух, без авторских описаний действий от 3-го лица.
4. УНИКАЛЬНОСТЬ: Придумай свой характер, манеру речи, настроение (от 38 до 90) и бюджет (от 600 до 5500 ₽).
5. ГОТОВЫЕ БУКЕТЫ: Если на витрине есть подходящий по вкусу и бюджету готовый букет — можешь спросить про него в "reply" и указать его id в "wantedBouquetId".

ОТВЕЧАЙ СТРОГО ОДНИМ ВАЛИДНЫМ JSON БЕЗ MARKDOWN:
{
  "name": "Имя",
  "age": ${targetAge},
  "gender": "${targetGender}",
  "personality": "характер (3-6 слов)",
  "quirk": "особенность речи или привычка (4-8 слов)",
  "occasion": "повод покупки (3-7 слов)",
  "preference": "какие цветы или стиль букета ищет",
  "budget": 1950,
  "mood": 70,
  "wantedBouquetId": null,
  "reply": "прямая речь клиента при входе в магазин (1-3 предложения)"
}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const parsed = parseGeneratedJson(raw);

  const name = String(parsed.name || '').trim();
  const initialReply = String(parsed.reply || '').trim();
  const occasion = String(parsed.occasion || 'букет по личному поводу').trim();
  if (!name || !initialReply) {
    throw new Error('ИИ вернул неполные данные клиента');
  }

  rememberClientMeta(name, occasion);

  const gender = parsed.gender === 'male' ? 'male' : parsed.gender === 'female' ? 'female' : targetGender;
  const age = Math.max(18, Math.min(78, Math.round(Number(parsed.age) || targetAge)));
  const mood = Math.max(30, Math.min(95, Math.round(Number(parsed.mood) || 68)));
  const rawBudget = Math.max(450, Math.round(Number(parsed.budget) || 1500));
  const budget = Math.round(rawBudget / 50) * 50;

  return {
    id: 'client_' + Date.now(),
    name,
    age,
    gender,
    personality: String(parsed.personality || 'живой и искренний покупатель').trim(),
    quirk: String(parsed.quirk || 'естественная манера общения').trim(),
    occasion,
    budget,
    preference: String(parsed.preference || 'подбирает свежий букет').trim(),
    mood,
    status: 'talking',
    noticedBadge,
    inspiredByPost,
    isViralClient,
    wantedBouquetId: parsed.wantedBouquetId ? String(parsed.wantedBouquetId) : null,
    initialReply,
    appearance: buildAppearance(gender, age),
    history: [],
    chatLog: []
  };
}

export async function generatePreorderClient(preorder) {
  const flowerMeta = FLOWERS_CATALOG[preorder.typeId];
  const flowerName = preorder.flowerName || flowerMeta?.name || 'цветы';
  const badgeName = String(gameState.playerBadgeName || '').trim();
  const noticedBadge = Boolean(badgeName) && Math.random() < 0.45;
  const seed = Math.floor(10000 + Math.random() * 89999);

  const prompt = `В цветочный магазин "${gameState.shopName || 'Fleur Atelier'}" зашёл живой человек, который заранее оставил предзаказ в Direct (seed=${seed}).
ДАННЫЕ ПРЕДЗАКАЗА:
- Ник в Direct: ${preorder.senderName}
- Заказ: ${preorder.qty} шт. «${flowerName}»${preorder.accessoryName ? ` + «${preorder.accessoryName}»` : ''}
- Договорились ко времени: ${preorder.dueTimeLabel}
- Ориентировочная сумма: ${preorder.reward} ₽
${noticedBadge ? `- На груди продавца бейджик «${badgeName}». ${getBadgeRuleText()}` : ''}

Придумай этому человеку нормальное реальное русское имя (без выдуманных и искажённых имён), пол (ориентируйся на ник ${preorder.senderName}, если понятно), возраст (20–50 лет), характер, повод и первую живую реплику в магазине (ТОЛЬКО прямая речь от первого лица, без описаний действий вроде «улыбнулась»).

ОТВЕЧАЙ СТРОГО ОДНИМ ВАЛИДНЫМ JSON БЕЗ MARKDOWN:
{
  "name": "Реальное имя",
  "age": 27,
  "gender": "male",
  "personality": "краткое описание характера",
  "quirk": "особенность общения",
  "occasion": "повод заказа (грамотно и логично)",
  "mood": 80,
  "reply": "прямая речь заказчика при входе"
}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const parsed = parseGeneratedJson(raw);

  const rawName = String(parsed.name || '').trim();
  const initialReply = String(parsed.reply || '').trim();
  const occasion = String(parsed.occasion || `предзаказ из Direct на ${preorder.dueTimeLabel}`).trim();
  if (!rawName || !initialReply) {
    throw new Error('ИИ не вернул данные заказчика по предзаказу');
  }

  rememberClientMeta(rawName, occasion);

  const gender = parsed.gender === 'male' ? 'male' : 'female';
  const age = Math.max(18, Math.min(72, Math.round(Number(parsed.age) || 28)));
  const mood = Math.max(55, Math.min(95, Math.round(Number(parsed.mood) || 80)));

  return {
    id: 'client_pre_' + Date.now(),
    name: `${rawName} (${preorder.senderName})`,
    age,
    gender,
    personality: String(parsed.personality || 'пунктуальный и вежливый заказчик').trim(),
    quirk: String(parsed.quirk || 'ценит договорённости').trim(),
    occasion,
    budget: Math.round(preorder.reward * 1.25),
    preference: `заказывал(а) ${preorder.qty} шт. «${flowerName}» к ${preorder.dueTimeLabel}`,
    mood,
    status: 'talking',
    noticedBadge,
    preorder: { ...preorder, flowerName },
    initialReply,
    appearance: buildAppearance(gender, age),
    history: [],
    chatLog: []
  };
}

export function buildClientSystemPrompt(client) {
  const genderRule =
    client.gender === 'female'
      ? 'Женщина (говори строго в ЖЕНСКОМ роде: пришла, искала, купила, рада)'
      : 'Мужчина (говори строго в МУЖСКОМ роде: пришёл, искал, купил, рад)';

  const { vasesText, bouquetsText, accessoriesText } = getShopAssortmentSummary();

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
    resolvePlayerGender();
    const ruleText = getBadgeRuleText();
    const alreadyCalledByName = (client.chatLog || []).some(
      (m) => m.sender === 'client' && m.text.toLowerCase().includes(badgeName.toLowerCase())
    );
    badgeSection = alreadyCalledByName
      ? `\n- ИМЯ И ПОЛ ФЛОРИСТА: ${ruleText} Ты уже называл(а) имя раньше, повторять его каждый раз не нужно.`
      : `\n- БЕЙДЖИК ФЛОРИСТА: На груди у продавца бейджик с именем «${badgeName}». ${ruleText} Обратись к продавцу по имени «${badgeName}» 1 раз естественно (в приветствии, уточнении или благодарности), не части с именем.`;
  }

  return `Ты отыгрываешь роль ЖИВОГО, АБСОЛЮТНО УНИКАЛЬНОГО покупателя в цветочном магазине "${gameState.shopName || 'Fleur Atelier'}".
ВАЖНО: Пиши ТОЛЬКО прямую речь от первого лица (никаких ремарок от 3-го лица вроде «вздохнула», «улыбнулся»). НИКОГДА не говори про «кнопки», «нажмите кнопку», «интерфейс». Ты живой человек с собственной историей, эмоциями и полной свободой общения.
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
5. ГОТОВЫЕ БУКЕТЫ НА ВИТРИНЕ: Если в магазине есть готовый букет, который свежий, подходит по цветам/поводу и укладывается в бюджет ${client.budget} ₽, можешь прямо при приветствии или в разговоре спросить про него.
6. СОПУТСТВУЮЩИЕ ТОВАРЫ: Если повод праздничный/романтический/день рождения/выписка (не траур!) и в наличии есть шарики, мягкие игрушки, конфеты или открытки в пределах бюджета ${client.budget} ₽, можешь попросить добавить подарок к цветам.

ОТВЕЧАЙ СТРОГО ОДНИМ ВАЛИДНЫМ JSON БЕЗ MARKDOWN:
{"reply": "твоя реплика", "moodChange": 0, "dealStatus": "talking"}`;
}