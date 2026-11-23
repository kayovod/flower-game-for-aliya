/**
 * js/ai/socialAi.js
 * 100% живой ИИ для соцсетей: посты/комментарии в InstaFlower и уникальные заказы/чаты в Direct
 */

import { FLOWERS_CATALOG, ACCESSORIES_CATALOG } from '../config.js';
import { gameState } from '../state.js';
import {
  callAI,
  stripCodeFences,
  pickRandom,
  generateProceduralNick,
  isRudeText,
  formatMinutesAsTime,
  detectMentionedFlowers,
  resolvePlayerGender,
  getBadgeRuleText
} from './aiCore.js';

export async function evaluateInstaPost({ type, caption, hashtags, detailsText }) {
  const hasPromoToday = gameState.activePromo && gameState.activePromo.day === gameState.day;
  const seed = Math.floor(10000 + Math.random() * 89999);

  const prompt = `Ты — симулятор живой аудитории соцсети InstaFlower (seed=${seed}).
Флорист магазина "${gameState.shopName || 'Fleur Atelier'}" (сейчас ${gameState.followers} подписчиков, атмосфера ${gameState.mood}%${hasPromoToday ? `, запущена промо-акция «${gameState.activePromo.title}»` : ''}) выложил пост:
- Что на фото: ${type === 'bouquet' ? 'Собранный букет' : 'Интерьер витрины магазина'} (${detailsText}).
- Текст поста: "${caption || '(без текста)'}".
- Хэштеги: ${hashtags.join(' ') || '(нет)'}.

Оцени пост ЧЕСТНО, как в жизни (пост может не залететь, особенно если нет текста или скучно, а может залететь в рекомендации!):
1. likes: число от 2 до 140.
2. followerDelta: число от -1 до +30 (может быть 0, если пост обычный).
3. verdict: короткий статус ("Залетело в тренды 🔥" / "Тёплый отклик 🌸" / "Скромный охват" / "Не зашло 😕").
4. comments: массив из 2–3 живых комментариев на русском от СОВЕРШЕННО РАЗНЫХ людей. Сам придумай 2–3 уникальных реалистичных ника (чередуй пол и стиль, без повторов, без фамилии Смирнова и без слов flowers/buket/flora).

ОТВЕЧАЙ СТРОГО ОДНИМ ВАЛИДНЫМ JSON БЕЗ MARKDOWN:
{"likes": 12, "followerDelta": 2, "verdict": "Тёплый отклик 🌸", "comments": [{"author": "@уникальный_ник", "text": "Очень нежно!"}]}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const cleaned = stripCodeFences(raw);
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s === -1 || e <= s) throw new Error('ИИ не вернул JSON оценки поста');

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

export async function generateInstaCommentReply(post, comment, playerReply) {
  if (isRudeText(playerReply)) {
    return {
      shouldReply: true,
      replyText: 'Ну и манеры у вас... Отписываюсь 😕',
      bonusLikes: 0,
      followerDelta: -1
    };
  }

  const prompt = `Пользователь ${comment.author} оставил под постом цветочного магазина "${gameState.shopName || 'Fleur Atelier'}" комментарий:
"${comment.text}"
Владелец магазина ответил ему:
"${playerReply}"

Реши, ответит ли подписчик повторно (примерно в 70% случаев отвечает тепло, если ему ответили нормально; если нахамили — отвечает резко; если ответ сухой «ок», может не отвечать).
ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{"shouldReply": true, "replyText": "живой короткий ответ подписчика", "bonusLikes": 2, "followerDelta": 1}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const cleaned = stripCodeFences(raw);
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s === -1 || e <= s) throw new Error('ИИ не вернул JSON ответа на комментарий');

  const parsed = JSON.parse(cleaned.slice(s, e + 1));
  return {
    shouldReply: Boolean(parsed.shouldReply),
    replyText: String(parsed.replyText || '').trim(),
    bonusLikes: Math.max(0, Math.min(5, Number(parsed.bonusLikes) || 1)),
    followerDelta: Math.max(-1, Math.min(2, Number(parsed.followerDelta) || 0))
  };
}

function parseTimeMinutesFromText(text) {
  const str = String(text || '');
  const hmMatch = str.match(/\b([01]?\d|2[0-3])\s*[:.-]\s*([0-5]\d)\b/);
  if (hmMatch) return Number(hmMatch[1]) * 60 + Number(hmMatch[2]);
  const hourMatch = str.match(/(?:\b(?:к|в|до|на)\s+)([01]?\d|2[0-3])\b(?:\s*(?:час|ч\b|утра|дня|вечера))?/i);
  if (hourMatch) {
    const h = Number(hourMatch[1]);
    if (h >= 7 && h <= 23) return h * 60;
  }
  return null;
}

function parseQtyFromText(text) {
  const str = String(text || '');
  const m =
    str.match(/(\d{1,2})\s*(?:шт|штук|цветов|цветк|стебл|роз|пион|тюльпан|хризантем|гвоздик|лили|ирис|подсолнух|ромаш)/i) ||
    str.match(/из\s+(\d{1,2})\b/i);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 1 && n <= 51 ? n : null;
}

function parsePriceFromText(text) {
  const str = String(text || '');
  const m = str.match(/(\d{3,5})\s*(?:₽|руб|р\b)/i);
  if (!m) return null;
  const p = Number(m[1]);
  return p >= 100 && p <= 50000 ? p : null;
}

function resolveDueSlotFromContext(preferredLabel, existingOrder, avoidTimesSet = new Set()) {
  const openMin = (gameState.openHour || 9) * 60;
  const closeMin = (gameState.closeHour || 21) * 60;
  const curMin = Math.max(openMin, gameState.timeMinutes || openMin);
  const minSlot = curMin + 22;
  const maxSlot = closeMin - 10;

  if (maxSlot - minSlot < 10) return null;

  const parsedMin = parseTimeMinutesFromText(preferredLabel);
  if (parsedMin !== null && parsedMin >= minSlot && parsedMin <= maxSlot) {
    const label = formatMinutesAsTime(parsedMin);
    if (!avoidTimesSet.has(label)) {
      return { dueMinutes: parsedMin, dueTimeLabel: label };
    }
  }

  if (existingOrder && existingOrder.dueMinutes >= curMin + 5 && existingOrder.dueMinutes <= maxSlot) {
    return {
      dueMinutes: existingOrder.dueMinutes,
      dueTimeLabel: formatMinutesAsTime(existingOrder.dueMinutes)
    };
  }

  for (let i = 0; i < 16; i++) {
    const span = maxSlot - minSlot;
    const rawMin = minSlot + Math.floor(Math.random() * span);
    const stepped = Math.min(maxSlot, Math.max(minSlot, Math.round(rawMin / 5) * 5));
    const label = formatMinutesAsTime(stepped);
    if (!avoidTimesSet.has(label)) {
      return { dueMinutes: stepped, dueTimeLabel: label };
    }
  }

  const fallbackMin = Math.min(maxSlot, minSlot + Math.floor(Math.random() * Math.max(10, maxSlot - minSlot)));
  return {
    dueMinutes: fallbackMin,
    dueTimeLabel: formatMinutesAsTime(fallbackMin)
  };
}

function buildDirectOrderData({ parsedOrder, playerText, replyText, existingOrder }) {
  const combinedText = `${playerText || ''} ${replyText || ''}`;
  const mentioned = detectMentionedFlowers(combinedText);
  const parsedTypeId = parsedOrder?.typeId && FLOWERS_CATALOG[parsedOrder.typeId] ? parsedOrder.typeId : null;
  const typeId = parsedTypeId || mentioned[0] || existingOrder?.typeId || 'rose_red';
  const meta = FLOWERS_CATALOG[typeId] || FLOWERS_CATALOG.rose_red;

  const qtyFromText = parseQtyFromText(replyText) ?? parseQtyFromText(playerText);
  const qty = Math.max(1, Math.min(51, Number(parsedOrder?.qty) || qtyFromText || existingOrder?.qty || 5));

  const priceFromText = parsePriceFromText(replyText) ?? parsePriceFromText(playerText);
  const defaultReward = meta.price * qty + 140;
  const reward = Math.max(100, Number(parsedOrder?.reward) || priceFromText || existingOrder?.reward || defaultReward);

  const timeCandidate = parsedOrder?.dueTime || replyText || playerText || existingOrder?.dueTimeLabel || '';
  const dueSlot = resolveDueSlotFromContext(timeCandidate, existingOrder);
  if (!dueSlot) return null;

  return {
    typeId: meta.id,
    flowerName: meta.name,
    qty,
    reward,
    dueMinutes: dueSlot.dueMinutes,
    dueTimeLabel: dueSlot.dueTimeLabel
  };
}

export async function generateDirectMessage() {
  const hasCourier = (gameState.employees || []).some((e) => e.roleId === 'courier');
  const openMin = (gameState.openHour || 9) * 60;
  const closeMin = (gameState.closeHour || 21) * 60;
  const curMin = Math.max(openMin, gameState.timeMinutes || openMin);
  const canPreorder = closeMin - curMin >= 35;
  const canDelivery = hasCourier && canPreorder;

  const usedNicks = (gameState.directMessages || [])
    .slice(0, 15)
    .map((m) => m.senderName)
    .filter(Boolean);
  const usedSet = new Set(usedNicks.map((n) => n.toLowerCase()));

  const usedTimes = (gameState.directMessages || [])
    .filter((m) => m.order && !m.order.done && !m.order.rejected)
    .map((m) => m.order.dueTimeLabel)
    .filter(Boolean);
  const usedTimesSet = new Set(usedTimes);

  const flowersListText = Object.values(FLOWERS_CATALOG)
    .map((f) => `${f.id} («${f.name}», ~${f.price} ₽/шт)`)
    .join('; ');
  const accListText = Object.values(ACCESSORIES_CATALOG)
    .map((a) => `${a.id} («${a.name}», ~${a.price} ₽)`)
    .join('; ');

  const minWindow = formatMinutesAsTime(curMin + 25);
  const maxWindow = formatMinutesAsTime(closeMin - 15);
  const badgeName = String(gameState.playerBadgeName || '').trim();
  const knowsMasterName = Boolean(badgeName) && Math.random() < 0.35;
  const seed = Math.floor(10000 + Math.random() * 89999);

  const prompt = `Сгенерируй ОДНО совершенно уникальное входящее сообщение в Direct для цветочного магазина "${gameState.shopName || 'Fleur Atelier'}" (подписчиков: ${gameState.followers}, сейчас время: ${formatMinutesAsTime(curMin)}, seed=${seed}).

Выбери ОДИН случайный тип:
${canDelivery ? `- "delivery": клиент просит ДОСТАВКУ КУРЬЕРОМ НА ДОМ к конкретному времени (придумай сам адрес, повод, заметку для курьера, сорт и разное количество цветов: может быть 1, 3, 7, 9, 11, 15, 21 и т.д.!).` : ''}
${canPreorder ? `- "preorder": клиент просит САМОВЫВОЗ к конкретному времени (сам выбери цветок, любое количество стеблей от 1 до 25 и адекватный бюджет).` : ''}
- "question": живой нестандартный вопрос про уход, наличие, доставку, букеты или подарки.
- "review": живой отзыв или комментарий о магазине.

ПРАВИЛА ДЛЯ ЗАКАЗОВ (если kind="delivery" или "preorder"):
- typeId: выбери любой подходящий из каталога: ${flowersListText}.
- qty: ПРИДУМАЙ РАЗНОЕ количество (НЕ пиши всем одинаково, чередуй маленькие, средние и пышные букеты!).
- accessoryId: иногда (примерно в 25% случаев) добавь подарок: ${accListText}, иначе null.
- dueTime: выбери ЛЮБОЕ точное время в формате "HH:MM" в интервале от ${minWindow} до ${maxWindow} (не округляй постоянно к :15! Можно 10:40, 12:25, 15:10, 18:45 и т.п.). ИЗБЕГАЙ уже занятого времени: ${usedTimes.join(', ') || 'нет'}.
- reward: посчитай реалистичный бюджет клиента в рублях (примерно цена цветов * qty + 150..350 ₽ за оформление${canDelivery ? ' + ~250 ₽ за доставку если delivery' : ''}).
- В самом "text" сообщения обязательно живым языком назови, что хочешь, к какому времени, бюджет и (если delivery) адрес!

Никаких шаблонов и упоминаний кнопок! Придумай каждый раз абсолютно новый ник обычного человека (без повторов: ${usedNicks.join(', ') || 'нет'}, без Смирновой и слов flowers/buket/flora).

ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{
  "senderName": "@уникальный_ник",
  "kind": "${canDelivery ? 'delivery | preorder | question | review' : canPreorder ? 'preorder | question | review' : 'question | review'}",
  "typeId": "rose_red",
  "qty": 7,
  "accessoryId": null,
  "dueTime": "14:40",
  "reward": 1850,
  "address": "ул. Сиреневая, д. 8, кв. 19 (только если kind=delivery, иначе пустая строка)",
  "recipientNote": "примечание для курьера (только если kind=delivery, иначе пустая строка)",
  "text": "живое сообщение клиента (1-3 предложения)"
}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const cleaned = stripCodeFences(raw);
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s === -1 || e <= s) throw new Error('ИИ не вернул JSON сообщения Direct');

  const parsed = JSON.parse(cleaned.slice(s, e + 1));
  const allowedKinds = ['delivery', 'preorder', 'question', 'review'];
  let kind = allowedKinds.includes(parsed.kind) ? parsed.kind : 'question';
  if (kind === 'delivery' && !canDelivery) kind = canPreorder ? 'preorder' : 'question';
  if (kind === 'preorder' && !canPreorder) kind = 'question';

  let senderName = String(parsed.senderName || '').trim().replace(/\s+/g, '_');
  if (senderName && !senderName.startsWith('@')) senderName = '@' + senderName;
  const lowerSender = senderName.toLowerCase();
  if (!senderName || senderName.length < 3 || lowerSender.includes('уникальный') || lowerSender.includes('smirnova') || lowerSender.includes('смирнова')) {
    senderName = generateProceduralNick(usedSet);
  } else if (usedSet.has(lowerSender)) {
    senderName = `${senderName}${10 + Math.floor(Math.random() * 89)}`;
  }

  const msgText = String(parsed.text || '').trim();
  if (!msgText) throw new Error('ИИ вернул пустой текст сообщения');

  let orderObj = null;
  if (kind === 'preorder' || kind === 'delivery') {
    const isDeliv = kind === 'delivery';
    const typeId = FLOWERS_CATALOG[parsed.typeId] ? parsed.typeId : pickRandom(Object.keys(FLOWERS_CATALOG));
    const flowerMeta = FLOWERS_CATALOG[typeId];
    const qty = Math.max(1, Math.min(51, Math.round(Number(parsed.qty) || (3 + Math.floor(Math.random() * 9)))));
    const accMeta = parsed.accessoryId && ACCESSORIES_CATALOG[parsed.accessoryId] ? ACCESSORIES_CATALOG[parsed.accessoryId] : null;

    const slot = resolveDueSlotFromContext(parsed.dueTime || msgText, null, usedTimesSet);
    if (!slot) {
      kind = 'question';
    } else {
      const baseCalc = flowerMeta.price * qty + 150 + (accMeta ? accMeta.price : 0) + (isDeliv ? 260 : 0);
      const aiReward = Math.round(Number(parsed.reward) || 0);
      const reward = aiReward >= Math.round(baseCalc * 0.6) && aiReward <= Math.round(baseCalc * 2.2) ? aiReward : baseCalc;

      orderObj = {
        typeId: flowerMeta.id,
        flowerName: flowerMeta.name,
        qty,
        reward,
        dueMinutes: slot.dueMinutes,
        dueTimeLabel: slot.dueTimeLabel,
        isDelivery: isDeliv,
        address: isDeliv ? String(parsed.address || 'ул. Парковая, д. 14, кв. 28').trim() : '',
        recipientNote: isDeliv ? String(parsed.recipientNote || 'Позвонить перед вручением').trim() : '',
        accessoryId: accMeta ? accMeta.id : null,
        accessoryName: accMeta ? accMeta.name : null,
        accepted: false,
        rejected: false,
        done: false
      };
    }
  }

  return {
    id: 'dm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
    senderName,
    kind,
    text: msgText,
    read: false,
    knowsMasterName,
    blockedByPlayer: false,
    blockedByClient: false,
    day: gameState.day,
    createdTimeLabel: formatMinutesAsTime(curMin),
    thread: [{ sender: 'client', text: msgText }],
    order: orderObj,
    replyText: null
  };
}

export async function generateDirectRejectionReply(dm, reason, isSilent) {
  const cleanReason = String(reason || '').trim();
  const rLower = cleanReason.toLowerCase();
  const canTryRaise = Boolean(dm.order && !dm.order.budgetRaisedOnce);
  const isBudgetReason =
    canTryRaise &&
    !isSilent &&
    (rLower.includes('бюджет') || rLower.includes('мал') || rLower.includes('дорог') || rLower.includes('дешев') || rLower.includes('хватает'));

  const orderInfo = dm.order
    ? `${dm.order.qty} шт. «${dm.order.flowerName}» к ${dm.order.dueTimeLabel} (бюджет ${dm.order.reward} ₽)`
    : 'предзаказ';

  const prompt = `Ты — уникальный живой клиент ${dm.senderName} в переписке Direct с цветочным магазином "${gameState.shopName || 'Fleur Atelier'}".
Ты просил(а) заказ: ${orderInfo}.
Флорист ответил отказом: ${isSilent ? '«К сожалению, не сможем взять заказ» (без объяснения причины).' : `«К сожалению, не сможем взять заказ (${cleanReason})».`}

Реагируй естественно и без заученных клише, никогда не упоминай никакие кнопки (1–2 предложения на русском):
${isBudgetReason
  ? '- Так как отказ из-за бюджета, можешь (если хочешь) ОДИН раз попробовать предложить доплатить 300 ₽ ("raisedBudgetAmount": 300), либо просто попрощаться ("raisedBudgetAmount": 0).'
  : '- Это окончательный отказ, так что попрощайся в своём характере и не предлагай доплат ("raisedBudgetAmount": 0).'}

ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{"reply": "ответ клиента", "moodDelta": -1, "raisedBudgetAmount": 0}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const cleaned = stripCodeFences(raw);
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s === -1 || e <= s) throw new Error('ИИ не вернул JSON ответа на отказ');

  const parsed = JSON.parse(cleaned.slice(s, e + 1));
  const raised = isBudgetReason ? Math.max(0, Math.min(500, Number(parsed.raisedBudgetAmount) || 0)) : 0;
  return {
    reply: String(parsed.reply || '').trim(),
    moodDelta: Math.max(-5, Math.min(2, Number(parsed.moodDelta) || -1)),
    raisedBudgetAmount: raised
  };
}

export async function generateDirectFollowUp(dm, playerText, attachedPhoto = null) {
  if (isRudeText(playerText)) {
    return {
      reply: 'Ну знаете, так общаться — перебор! Всего доброго, отправляю ваш профиль в чёрный список.',
      moodDelta: -5,
      followerDelta: -1,
      blockedByClient: true,
      proposedOrder: null
    };
  }

  const badgeName = String(gameState.playerBadgeName || '').trim();
  if (typeof dm.knowsMasterName !== 'boolean') {
    dm.knowsMasterName = Boolean(badgeName) && Math.random() < 0.35;
  }

  const threadText = (dm.thread || [])
    .map((m) => `${m.sender === 'player' ? 'Флорист' : m.sender === 'system' ? 'Система' : dm.senderName}: ${m.photoDesc ? `[Отправил фото: ${m.photoDesc}] ` : ''}${m.text}`)
    .join('\n');

  const nowTime = formatMinutesAsTime(gameState.timeMinutes || 540);
  const closeTime = formatMinutesAsTime((gameState.closeHour || 21) * 60);

  let orderStatusStr = 'Заявки на предзаказ пока нет (идёт живое общение).';
  if (dm.order) {
    const delivNote = dm.order.isDelivery ? ` (ДОСТАВКА КУРЬЕРОМ по адресу: ${dm.order.address})` : ' (самовывоз)';
    if (dm.order.accepted) {
      orderStatusStr = `Заказ УЖЕ согласован и принят в работу${delivNote}: ${dm.order.qty} шт. «${dm.order.flowerName}» к ${dm.order.dueTimeLabel} за ${dm.order.reward} ₽.`;
    } else if (dm.order.rejected) {
      orderStatusStr = `Заявка ранее была отклонена (${dm.order.qty} шт. «${dm.order.flowerName}»).`;
    } else {
      orderStatusStr = `Есть активная заявка в ожидании ответа флориста${delivNote}: ${dm.order.qty} шт. «${dm.order.flowerName}» к ${dm.order.dueTimeLabel} за ${dm.order.reward} ₽.`;
    }
  }

  const flowerListHint = Object.values(FLOWERS_CATALOG)
    .map((f) => `${f.id}:${f.name}`)
    .join(', ');

  let badgeHint = '';
  if (badgeName && dm.knowsMasterName) {
    const playerGender = resolvePlayerGender();
    const alreadyNamed = (dm.thread || []).some(
      (m) => m.sender === 'client' && m.text.toLowerCase().includes(badgeName.toLowerCase())
    );
    if (!alreadyNamed) {
      badgeHint = `\nИмя флориста: «${badgeName}». ${getBadgeRuleText(badgeName, playerGender)}`;
    }
  }

  const photoPromptPart = attachedPhoto
    ? `\nК ЭТОМУ СООБЩЕНИЮ ФЛОРИСТ ПРИКРЕПИЛ ФОТО: "${attachedPhoto.description || 'Авторский букет'}"${attachedPhoto.price ? ` (стоимость примерно ${attachedPhoto.price} ₽)` : ''}. Отреагируй абсолютно естественно и по-своему!`
    : '';

  const prompt = `Ты — абсолютно уникальный, живой клиент ${dm.senderName} в Direct цветочного магазина "${gameState.shopName || 'Fleur Atelier'}".
Сейчас время: ${nowTime}, лавка открыта до ${closeTime}.
Статус заявки: ${orderStatusStr}${badgeHint}${photoPromptPart}

Переписка:
${threadText}
Последнее сообщение флориста: "${playerText || '(отправил фото без текста)'}"

ВАЖНЕЙШИЕ ПРАВИЛА:
1. Никаких шаблонных фраз. Веди себя как реальный человек со своим настроением и характером.
2. НИКОГДА не говори про «кнопки», «нажмите принять/отказать», «интерфейс». Общайся естественно словами!
3. Если заказа ещё вообще не было, но в диалоге вы с флористом договорились на букет к конкретному времени до закрытия — заполни "proposeOrder": {"typeId": "rose_red", "qty": 5, "reward": 1200, "dueTime": "18:00"}, иначе null.
4. "blockedByClient": true ТОЛЬКО при прямых грубых оскорблениях и матах.
Доступные id цветов: ${flowerListHint}.

ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{"reply": "твой живой ответ", "moodDelta": 1, "followerDelta": 0, "blockedByClient": false, "proposeOrder": null}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const cleaned = stripCodeFences(raw);
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s === -1 || e <= s) throw new Error('ИИ не вернул JSON ответа в Direct');

  const parsed = JSON.parse(cleaned.slice(s, e + 1));
  const reply = String(parsed.reply || '').trim();
  let proposedOrder = null;

  if (!dm.order && parsed.proposeOrder && typeof parsed.proposeOrder === 'object') {
    proposedOrder = buildDirectOrderData({
      parsedOrder: parsed.proposeOrder,
      playerText,
      replyText: reply,
      existingOrder: null
    });
  }

  return {
    reply,
    moodDelta: Math.max(-5, Math.min(5, Number(parsed.moodDelta) || 0)),
    followerDelta: Math.max(-1, Math.min(2, Number(parsed.followerDelta) || 0)),
    blockedByClient: Boolean(parsed.blockedByClient),
    proposedOrder
  };
}

export async function generatePostDeliveryClientFeedback(dm, delivery) {
  const seed = Math.floor(10000 + Math.random() * 89999);
  const hadIssue = Boolean(delivery?.issueTriggered);
  const prompt = `Ты — клиент ${dm.senderName}, только что получил(а) букет от курьера цветочного магазина "${gameState.shopName || 'Fleur Atelier'}" (seed=${seed}).
Детали заказа: «${delivery.bouquetSummary || delivery.flowerName}» (${delivery.qty} шт.), привезли по адресу ${delivery.address}.
${hadIssue ? `В пути была заминка (${delivery.issueTitle || 'заминка'}), которую решили: ${delivery.resolutionNote || 'курьер договорился'}.` : 'Доставка доехала вовремя.'}

Напиши короткое спонтанное сообщение в Direct после получения букета (1–2 предложения).
Реакция может быть разной (на твоё усмотрение с долей случайности):
- чаще — тёплая благодарность за свежесть, аромат и красивый вид;
- иногда (особенно если была заминка) — лёгкое ворчание или честное замечание (чуть подзадержались, хотелось пышнее и т.п.), а иногда наоборот восхищение сервисом.
Оцени настроение: "moodDelta" (-3..+4), "followerDelta" (0 или 1).
ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{"reply": "сообщение клиента", "moodDelta": 2, "followerDelta": 1}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const cleaned = stripCodeFences(raw);
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s === -1 || e <= s) throw new Error('ИИ не вернул отзыв после доставки');
  const parsed = JSON.parse(cleaned.slice(s, e + 1));
  return {
    reply: String(parsed.reply || '').trim(),
    moodDelta: Math.max(-4, Math.min(4, Number(parsed.moodDelta) || 1)),
    followerDelta: Math.max(0, Math.min(1, Number(parsed.followerDelta) || 0))
  };
}