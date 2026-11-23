/**
 * js/ai/franchiseAi.js
 * ИИ для сети филиалов: уникальные случайные события на точках и живые беседы с сотрудником
 */

import { WEATHERS } from '../config.js';
import { gameState } from '../state.js';
import { callAI, stripCodeFences, formatMinutesAsTime } from './aiCore.js';

function getBranchContext(branchMeta, branchState, emp) {
  const weatherLabel = WEATHERS.find((w) => w.id === gameState.weather)?.label || 'Ясно';
  const genderWord = emp.gender === 'female' ? 'женщина (пиши в женском роде)' : 'мужчина (пиши в мужском роде)';
  return `Сеть цветочных магазинов «${gameState.shopName || 'Fleur Atelier'}».
Филиал: «${branchMeta.name}» (${branchMeta.interiorDesc}).
Сотрудник на точке: ${emp.name}, ${emp.age} лет (${genderWord}), должность: ${emp.roleName}, характер: ${emp.quirk || 'живой и ответственный'}.
На улице: ${weatherLabel}, время ${formatMinutesAsTime(gameState.timeMinutes || 540)}, заработано сегодня на точке: ${branchState.todayEarned || 0} ₽.`;
}

export async function generateBranchVisitEvent(branchMeta, branchState, emp) {
  const seed = Math.floor(10000 + Math.random() * 89999);
  const prompt = `Владелец цветочной сети приехал с личным визитом на свой филиал! Придумай С НУЛЯ одно уникальное, интересное, нешаблонное событие, которое происходит прямо сейчас (seed=${seed}).
${getBranchContext(branchMeta, branchState, emp)}

Идеи для ориентира (НЕ копируй дословно, придумай свою оригинальную ситуацию под место):
- для ТЦ: визит управляющего ТЦ по декору, съёмка блогера, корпоративный заказ соседнего бутика, очередь перед эскалатором;
- для метро: спешащий жених с особым запросом, сбой оплаты/упаковки в час пик, порыв ветра у входа, внезапный оптовик с редкой партией;
- для элитного бутика: VIP-гость на мероприятие, критик стиля, съёмка журнала, просьба оформить банкетную зону.

Опиши ситуацию ярко в 2–3 предложениях и добавь живую реплику сотрудника (${emp.name}), который спрашивает твоё решение.

Верни СТРОГО ОДИН JSON без markdown:
{
  "title": "короткий заголовок события (3-5 слов)",
  "description": "что происходит на точке сейчас (2-3 предложения)",
  "employeePrompt": "реплика сотрудника ${emp.name} с вопросом к владельцу (1-2 предложения)"
}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const cleaned = stripCodeFences(raw);
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s === -1 || e <= s) {
    throw new Error('ИИ не вернул JSON события на филиале');
  }
  const parsed = JSON.parse(cleaned.slice(s, e + 1));
  return {
    title: String(parsed.title || 'Событие на точке').trim(),
    description: String(parsed.description || '').trim(),
    employeePrompt: String(parsed.employeePrompt || 'Как поступим, шеф?').trim()
  };
}

export async function resolveBranchEventDecision(branchMeta, branchState, emp, eventObj, playerDecision) {
  const prompt = `Владелец принял решение по случайному событию на своём филиале.
${getBranchContext(branchMeta, branchState, emp)}
Событие: ${eventObj.title} — ${eventObj.description}
Сотрудник спрашивал: "${eventObj.employeePrompt}"
Решение владельца: "${playerDecision}"

Оцени решение реалистично и справедливо:
- "outcomeText": живой итог ситуации (2–3 предложения: как отреагировал сотрудник, что получилось в итоге);
- "moneyDelta": финансовый эффект в рублях (от -1200 до +3500; если решение щедрое/затратное — может быть минус или большой плюс от нового заказа; если умное — прибыль);
- "moodDelta": влияние на настроение/атмосферу (от -10 до +12);
- "followersDelta": прирост подписчиков в соцсети (от -2 до +14).

Верни СТРОГО ОДИН JSON без markdown:
{"outcomeText": "...", "moneyDelta": 850, "moodDelta": 5, "followersDelta": 2}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const cleaned = stripCodeFences(raw);
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s === -1 || e <= s) {
    throw new Error('ИИ не вернул JSON итога события');
  }
  const parsed = JSON.parse(cleaned.slice(s, e + 1));
  return {
    outcomeText: String(parsed.outcomeText || 'Ситуация успешно разрешена!').trim(),
    moneyDelta: Math.max(-2500, Math.min(5000, Math.round(Number(parsed.moneyDelta) || 0))),
    moodDelta: Math.max(-15, Math.min(15, Math.round(Number(parsed.moodDelta) || 0))),
    followersDelta: Math.max(-5, Math.min(20, Math.round(Number(parsed.followersDelta) || 0)))
  };
}

export async function generateBranchEmployeeChatReply(branchMeta, branchState, emp, history, playerText) {
  const recent = (history || [])
    .slice(-8)
    .map((m) => `${m.sender === 'player' ? 'Владелец' : emp.name}: ${m.text}`)
    .join('\n');

  const prompt = `Владелец зашёл на свой филиал и болтает с тобой за прилавком.
${getBranchContext(branchMeta, branchState, emp)}
Недавний разговор:
${recent}
Владелец сказал: "${playerText}"

Ответь живо, тепло и со своим характером в 1–2 предложениях. Без JSON!`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  return stripCodeFences(raw).trim();
}