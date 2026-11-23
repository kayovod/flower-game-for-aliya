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