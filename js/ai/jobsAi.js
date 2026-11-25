/**
 * js/ai/jobsAi.js
 * Полностью уникальная ИИ-генерация соискателей, собеседования и реакции на найм/отказ
 */

import { gameState } from '../state.js';
import {
  callAI,
  stripCodeFences,
  isRudeText,
  formatMinutesAsTime,
  getBadgeRuleText
} from './aiCore.js';

export const CANDIDATE_PROFILES = [];

export async function generateJobCandidateDm(jobPosting) {
  const existingEmployees = gameState.employees || [];
  const existingApps = (gameState.directMessages || [])
    .filter((m) => m.jobApplication)
    .map((m) => m.jobApplication);

  const usedNames = [
    ...existingEmployees.map((e) => e.name),
    ...existingApps.map((a) => a.candidateName)
  ].filter(Boolean);
  const usedNamesSet = new Set(usedNames.map((n) => String(n).toLowerCase()));

  const usedNicks = [
    ...existingEmployees.map((e) => e.nick),
    ...existingApps.map((a) => a.nick),
    ...(gameState.directMessages || []).map((m) => m.senderName)
  ].filter(Boolean);
  const usedNicksSet = new Set(usedNicks.map((n) => String(n).toLowerCase()));

  const baseOffered = Math.max(450, Number(jobPosting.salary) || 1200);
  const seed = Math.floor(10000 + Math.random() * 89999);
  const prompt = `Придумай С НУЛЯ абсолютно нового, уникального, живого соискателя работы для цветочного магазина "${gameState.shopName || 'Fleur Atelier'}" (seed=${seed}).
Вакансия:
- Должность: ${jobPosting.roleName} (${jobPosting.roleId === 'courier' ? 'доставка букетов' : 'помощь в лавке и с цветами'})
- Точка: «${jobPosting.locationName}»
- График: «${jobPosting.scheduleLabel}»
- Предложенная в объявлении ставка: ${baseOffered} ₽ за смену.
- Работодатель: ${getBadgeRuleText()}

ЗАПРЕЩЕНО повторять уже встречавшихся людей и ники: ${usedNames.join(', ') || 'пока нет'}; ники: ${usedNicks.slice(0, 12).join(', ') || 'пока нет'}.
ЗАПРЕЩЕНО выдумывать несуществующие или склеенные имена (строго обычные реальные имена!).

Сделай человека максимально непохожим на других: чередуй пол, возраст (от 18 до 62 лет), социальный статус, характер, опыт и КОНКРЕТНЫЕ ЛИЧНЫЕ ТРЕБОВАНИЯ к работе.

Верни СТРОГО ОДИН валидный JSON без markdown:
{
  "name": "Реальное имя (можно с фамилией или просто имя)",
  "nick": "@уникальный_ник",
  "age": 26,
  "gender": "female" или "male",
  "bio": "1-2 коротких предложения об опыте и жизни соискателя",
  "quirk": "характер и манера общения",
  "requirements": "главное личное требование или условие к работе",
  "transport": "${jobPosting.roleId === 'courier' ? 'на чём доставляет (пешком / велик / электросамокат / своё авто и модель)' : 'как добирается или особая привычка'}",
  "hasCar": ${jobPosting.roleId === 'courier' ? 'true или false' : 'false'},
  "askedSalary": ${baseOffered},
  "minAcceptSalary": ${Math.max(450, baseOffered - 150)},
  "opener": "первое живое сообщение в Direct (2-3 предложения от первого лица с учётом пола, характера, опыта и своих требований, БЕЗ упоминания кнопок/интерфейса)"
}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const cleaned = stripCodeFences(raw);
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s === -1 || e <= s) {
    throw new Error('ИИ не вернул JSON анкеты соискателя');
  }

  const parsed = JSON.parse(cleaned.slice(s, e + 1));
  const name = String(parsed.name || '').trim();
  const opener = String(parsed.opener || '').trim();
  if (!name || usedNamesSet.has(name.toLowerCase()) || opener.length < 10) {
    throw new Error('ИИ вернул некорректную анкету соискателя, попробуй ещё раз');
  }

  let nick = String(parsed.nick || '').trim().replace(/\s+/g, '_');
  if (nick && !nick.startsWith('@')) nick = '@' + nick;
  if (!nick || nick.length < 3 || nick.toLowerCase().includes('уникальный')) {
    throw new Error('ИИ не сгенерировал ник соискателя');
  }
  if (usedNicksSet.has(nick.toLowerCase())) {
    nick = `${nick}_${10 + Math.floor(Math.random() * 89)}`;
  }

  const gender = parsed.gender === 'male' ? 'male' : 'female';
  const age = Math.max(18, Math.min(65, Math.round(Number(parsed.age) || 25)));
  const askedSalary = Math.max(500, Math.min(8000, Math.round((Number(parsed.askedSalary) || baseOffered) / 50) * 50));
  const rawMin = Number(parsed.minAcceptSalary) || (askedSalary - 150);
  const minAcceptSalary = Math.max(450, Math.min(askedSalary, Math.round(rawMin / 50) * 50));
  const hasCar = jobPosting.roleId === 'courier' && Boolean(parsed.hasCar);

  const cand = {
    id: 'cand_ai_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    name,
    nick,
    age,
    gender,
    bio: String(parsed.bio || 'Живой и инициативный соискатель.').trim(),
    quirk: String(parsed.quirk || 'естественный и честный в общении').trim(),
    requirements: String(parsed.requirements || 'Ценит уважительное отношение и честную оплату.').trim(),
    transport: String(parsed.transport || (hasCar ? 'Личный автомобиль' : 'Пешком / общественный транспорт')).trim(),
    hasCar,
    askedSalary,
    minAcceptSalary,
    opener
  };

  const nowLabel = formatMinutesAsTime(gameState.timeMinutes || 540);
  return {
    id: 'dm_job_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
    senderName: `${cand.name} (${cand.nick})`,
    kind: 'job',
    text: cand.opener,
    read: false,
    blockedByPlayer: false,
    blockedByClient: false,
    day: gameState.day,
    createdTimeLabel: nowLabel,
    thread: [{ sender: 'client', text: cand.opener }],
    order: null,
    replyText: null,
    jobApplication: {
      jobId: jobPosting.id,
      candidateId: cand.id,
      candidateName: cand.name,
      nick: cand.nick,
      age: cand.age,
      gender: cand.gender,
      roleId: jobPosting.roleId,
      roleName: jobPosting.roleName,
      roleIcon: jobPosting.roleIcon,
      bio: cand.bio,
      quirk: cand.quirk,
      requirements: cand.requirements,
      transport: cand.transport,
      locationId: jobPosting.locationId,
      locationName: jobPosting.locationName,
      scheduleId: jobPosting.scheduleId,
      scheduleLabel: jobPosting.scheduleLabel,
      offeredSalary: baseOffered,
      askedSalary: cand.askedSalary,
      agreedSalary: cand.askedSalary,
      minAcceptSalary: cand.minAcceptSalary,
      hasCar: Boolean(cand.hasCar),
      status: 'interviewing'
    }
  };
}

export async function generateCandidateInterviewReply(dm, playerText) {
  const app = dm.jobApplication;
  if (!app) return { reply: 'Спасибо!', agreedSalary: 1200, blockedByClient: false };

  if (isRudeText(playerText)) {
    return {
      reply: 'Извините, но в таком тоне я даже не хочу дальше обсуждать работу. Всего доброго.',
      agreedSalary: app.agreedSalary,
      blockedByClient: true
    };
  }

  const threadText = (dm.thread || [])
    .map((m) => `${m.sender === 'player' ? 'Работодатель' : m.sender === 'system' ? 'Система' : app.candidateName}: ${m.text}`)
    .join('\n');

  const prompt = `Ты проходишь живое собеседование в Direct на должность «${app.roleName}» в цветочном магазине "${gameState.shopName || 'Fleur Atelier'}".
ТВОЙ ПЕРСОНАЖ:
- Имя и возраст: ${app.candidateName}, ${app.age} лет (${app.gender === 'female' ? 'женщина — пиши строго в женском роде' : 'мужчина — пиши строго в мужском роде'}).
- О тебе: ${app.bio}
- Характер: ${app.quirk}
- Твои личные требования: ${app.requirements || 'обычные адекватные условия'}
- Транспорт: ${app.transport || (app.hasCar ? 'свой автомобиль' : 'пешком')}
- Точка и график: «${app.locationName}», ${app.scheduleLabel}.
- Работодатель: ${getBadgeRuleText()}
- Желаемая ставка: ${app.askedSalary} ₽/смену, сейчас обсуждается ${app.agreedSalary} ₽, твой крайний минимум: ${app.minAcceptSalary} ₽ (ниже этого не соглашайся, предлагай компромисс!).
ПЕРЕПИСКА:
${threadText}
ПОСЛЕДНЕЕ СООБЩЕНИЕ РАБОТОДАТЕЛЯ: "${playerText}"

ПРАВИЛА:
1. Отвечай живо, искренне, со своим характером и упоминай свои реальные требования, если речь заходит об условиях (1–3 предложения). Никаких шаблонов!
2. НИКОГДА не упоминай кнопки, «нажмите принять» или интерфейс! Общайся как реальный соискатель в чате.
3. Если работодатель торгуется и предлагает конкретную зарплату >= ${app.minAcceptSalary}, соглашайся и ставь эту сумму в "agreedSalary". Если сумма ниже минимума — по-своему поспорь и назови свой минимум/середину.

ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{"reply": "твой живой ответ", "agreedSalary": ${app.agreedSalary}}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const cleaned = stripCodeFences(raw);
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s === -1 || e <= s) {
    throw new Error('ИИ не вернул JSON ответа на собеседовании');
  }

  const parsed = JSON.parse(cleaned.slice(s, e + 1));
  const nextSalary = Math.max(app.minAcceptSalary, Math.min(10000, Number(parsed.agreedSalary) || app.agreedSalary));
  return {
    reply: String(parsed.reply || '').trim() || 'Понятно, спасибо!',
    agreedSalary: nextSalary,
    blockedByClient: false
  };
}

export async function generateCandidateHireReaction(dm, accepted, finalSalary) {
  const app = dm.jobApplication;
  const isFem = app?.gender === 'female';
  if (!app) return accepted ? 'Спасибо!' : 'Понятно, спасибо.';

  const prompt = `Ты — ${app.candidateName} (${app.age} лет, характер: ${app.quirk}), только что прошёл собеседование в цветочный магазин «${gameState.shopName || 'Fleur Atelier'}».
${accepted
  ? `Тебя ПРИНЯЛИ на работу (${app.roleName}) со ставкой ${finalSalary} ₽ за смену!`
  : `Тебе ОТКАЗАЛИ в приёме на работу.`}
Напиши короткую, живую реакцию в 1–2 предложения от первого лица (соблюдай пол: ${isFem ? 'женский род' : 'мужской род'}). Никакого JSON и никаких упоминаний кнопок.`;

  try {
    const raw = await callAI([{ role: 'user', content: prompt }]);
    const clean = stripCodeFences(raw).trim();
    if (clean && !clean.startsWith('{')) return clean;
  } catch (err) {
    console.warn('Не удалось получить реакцию ИИ на найм:', err);
  }
  return accepted
    ? `Спасибо, договорились на ${finalSalary} ₽ за смену!`
    : 'Понятно, спасибо за беседу и уделённое время.';
}