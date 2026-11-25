/**
 * js/ai/teamAi.js
 * 100% ИИ для команды: живое общение в Direct, отчёты флориста, уникальные форс-мажоры, отчёты курьера и реакция на зарплату
 */

import { WEATHERS } from '../config.js';
import { gameState } from '../state.js';
import {
  callAI,
  stripCodeFences,
  formatMinutesAsTime,
  getBadgeRuleText
} from './aiCore.js';

function getEmployeeContext(emp) {
  const genderWord = emp.gender === 'female' ? 'женщина, пиши строго в женском роде' : 'мужчина, пиши строго в мужском роде';
  const weatherLabel = WEATHERS.find((w) => w.id === gameState.weather)?.label || 'Ясно';
  return `Сотрудник: ${emp.name}, ${emp.age} лет (${genderWord}).
Должность: ${emp.roleName} в магазине «${gameState.shopName || 'Fleur Atelier'}» (точка «${emp.locationName}»).
Текущая зарплата: ${emp.salary} ₽/смену.
Руководитель: ${getBadgeRuleText()} Никогда не выдумывай руководителю другое имя и не путай пол!
О сотруднике: ${emp.bio || 'сотрудник цветочной лавки'}.
Характер: ${emp.quirk || 'живой, естественный и искренний'}.
Личные особенности/требования: ${emp.requirements || 'нет особых требований'}.
Транспорт: ${emp.transport || (emp.hasCar ? 'свой автомобиль' : 'пешком')}.
Сейчас на улице: ${weatherLabel}, время ${formatMinutesAsTime(gameState.timeMinutes || 540)}.`;
}

export async function generateEmployeeSpontaneousDm(employee, recentThread = []) {
  const seed = Math.floor(10000 + Math.random() * 89999);
  const recentText = (recentThread || [])
    .slice(-8)
    .map((m) => `${m.sender === 'player' ? 'Руководитель' : m.sender === 'system' ? 'Система' : employee.name}: ${m.text}`)
    .join('\n');

  const prompt = `Ты — живой сотрудник цветочного магазина, сам решаешь написать руководителю в Direct (seed=${seed}).
${getEmployeeContext(employee)}

Недавняя переписка (учитывай её и НИКОГДА не повторяй темы, вопросы или просьбы, которые уже обсуждались!):
${recentText || '(переписки ещё не было)'}

На твоё усмотрение (полностью свободно и без шаблонов):
- можешь просто поболтать о чём-то из жизни, наблюдениях или поделиться мыслью;
- или задать вопрос по работе лавки, цветам, витрине, заказам;
- или рассказать о неожиданной реальной ситуации / заминке, которая только что произошла с тобой на смене или в пути, и спросить совета.

Напиши короткое, живое сообщение (1–3 предложения) от первого лица, без JSON!`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const clean = stripCodeFences(raw).trim();
  if (!clean) throw new Error('ИИ вернул пустое сообщение от сотрудника');
  return clean;
}

export async function generateSalaryChangeReaction(employee, oldSalary, newSalary, recentThread = []) {
  const seed = Math.floor(10000 + Math.random() * 89999);
  const recentText = (recentThread || [])
    .slice(-6)
    .map((m) => `${m.sender === 'player' ? 'Руководитель' : m.sender === 'system' ? 'Система' : employee.name}: ${m.text}`)
    .join('\n');

  const prompt = `Руководитель только что изменил твою ставку в настройках зарплаты (seed=${seed}):
Было: ${oldSalary} ₽/смену → Стало: ${newSalary} ₽/смену.
${getEmployeeContext(employee)}

Недавняя переписка:
${recentText || '(пока не общались)'}

Реши абсолютно естественно, как реальный человек со своим характером:
- Если ставку повысили — можешь тепло поблагодарить, обрадоваться или скромно принять к сведению.
- Если ставку урезали — можешь расстроиться, возмутиться, спросить почему так или сдержанно промолчать.
- Если изменение совсем небольшое или ты занят(а) — можешь вообще ничего не писать ("shouldMessage": false).

ОТВЕЧАЙ СТРОГО ОДНИМ JSON БЕЗ MARKDOWN:
{"shouldMessage": true, "reply": "живое сообщение руководителю в Direct (или пустая строка если shouldMessage=false)"}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const cleaned = stripCodeFences(raw);
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s === -1 || e <= s) return { shouldMessage: false, reply: '' };

  const parsed = JSON.parse(cleaned.slice(s, e + 1));
  return {
    shouldMessage: Boolean(parsed.shouldMessage) && Boolean(String(parsed.reply || '').trim()),
    reply: String(parsed.reply || '').trim()
  };
}

export async function generateEmployeeChatReply(dm, employee, playerText) {
  const threadText = (dm.thread || [])
    .slice(-10)
    .map((m) => `${m.sender === 'player' ? 'Руководитель' : m.sender === 'system' ? 'Система' : employee.name}: ${m.text}`)
    .join('\n');

  const prompt = `Ты переписываешься с руководителем в Direct как обычный живой человек. Отвечай ПО СУТИ, учитывая имя и пол руководителя!
${getEmployeeContext(employee)}

Недавняя переписка:
${threadText}
Новое сообщение руководителя: "${playerText}"

ПРАВИЛА:
1. Отвечай живо и по делу (1–3 предложения) в своём характере, без шаблонных отписок.
2. Помни, о чём вы договорились выше. Никакого JSON и упоминаний игры!`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const clean = stripCodeFences(raw).trim();
  if (!clean) throw new Error('ИИ не смог сгенерировать ответ сотрудника');
  return clean;
}

export async function generateFloristPurchaseReport(employee, flowerName, qty, cost) {
  const prompt = `Ты — флорист-помощник ${employee.name} (${employee.gender === 'female' ? 'женщина' : 'мужчина'}, характер: ${employee.quirk || 'ответственный'}).
Руководитель: ${getBadgeRuleText()}
Ты только что съездил на оптовую базу по поручению руководителя, купил ${qty} шт. «${flowerName}» за ${cost} ₽ и расставил цветы по вазам в лавке.
Напиши живой короткий отчёт руководителю в Direct (1–2 предложения, в своём роде и характере). Без JSON!`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  return stripCodeFences(raw).trim();
}

export async function generateCourierForceMajeure(courier, delivery) {
  const weatherLabel = WEATHERS.find((w) => w.id === gameState.weather)?.label || 'Ясно';
  const seed = Math.floor(10000 + Math.random() * 89999);

  const prompt = `Ты — курьер цветочного магазина, едешь на реальную доставку и попал в НЕОЖИДАННЫЙ ЖИЗНЕННЫЙ ФОРС-МАЖОР (seed=${seed}).
${getEmployeeContext(courier)}
Детали доставки:
- Заказчик: ${delivery.senderName}
- Адрес: ${delivery.address}
- К какому времени: ${delivery.dueTimeLabel}
- Что везёшь: ${delivery.bouquetSummary || delivery.flowerName}
- Примечание: ${delivery.recipientNote || 'обычная доставка'}
- Погода: ${weatherLabel}.

ПРИДУМАЙ С НУЛЯ абсолютно уникальную, правдоподобную, нешаблонную проблему, которая случилась прямо сейчас в пути или на месте.
Напиши сообщение руководителю в Direct (2–3 предложения): опиши что случилось и ОБЯЗАТЕЛЬНО спроси, как поступить, потому что ты ждёшь ответа.

Верни СТРОГО ОДИН JSON без markdown:
{"issueTitle": "коротко суть (3-5 слов)", "message": "живое сообщение курьера в Direct с вопросом"}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const cleaned = stripCodeFences(raw);
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s === -1 || e <= s) throw new Error('ИИ не вернул JSON форс-мажора');
  const parsed = JSON.parse(cleaned.slice(s, e + 1));
  return {
    issueTitle: String(parsed.issueTitle || 'Ситуация на доставке').trim(),
    message: String(parsed.message || '').trim()
  };
}

export async function resolveCourierForceMajeureReply(dm, courier, delivery, playerText) {
  const threadText = (dm.thread || [])
    .slice(-8)
    .map((m) => `${m.sender === 'player' ? 'Руководитель' : courier.name}: ${m.text}`)
    .join('\n');

  const prompt = `Ты — курьер, который столкнулся с проблемой на доставке и получил указание от руководителя!
${getEmployeeContext(courier)}
Доставка: ${delivery.address}, к ${delivery.dueTimeLabel}, букет: ${delivery.bouquetSummary || delivery.flowerName}.
Проблема была: ${delivery.issueTitle || 'форс-мажор на адресе'}.
Переписка:
${threadText}
Ответ руководителя: "${playerText}"

Отреагируй живо в своём характере (1–2 предложения): прими решение к действию и скажи, как выкрутишься. Оцени совет руководителя:
- "extraMinutes": на сколько игровых минут это сдвинет доставку (от 5 до 20).
- "tipBonus": изменение возможных чаевых от -50 до +120.
- "resolutionNote": коротко (до 10 слов) как в итоге решили ситуацию.

Верни СТРОГО ОДИН JSON без markdown:
{"reply": "ответ курьера", "extraMinutes": 10, "tipBonus": 50, "resolutionNote": "удачно договорился и передал"}`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  const cleaned = stripCodeFences(raw);
  const s = cleaned.indexOf('{');
  const e = cleaned.lastIndexOf('}');
  if (s === -1 || e <= s) throw new Error('ИИ не вернул JSON решения форс-мажора');
  const parsed = JSON.parse(cleaned.slice(s, e + 1));
  return {
    reply: String(parsed.reply || '').trim(),
    extraMinutes: Math.max(5, Math.min(25, Number(parsed.extraMinutes) || 10)),
    tipBonus: Math.max(-50, Math.min(150, Number(parsed.tipBonus) || 0)),
    resolutionNote: String(parsed.resolutionNote || 'ситуация решена').trim()
  };
}

export async function generateCourierDeliveryReport(courier, delivery) {
  const baseTip = Math.max(0, Number(delivery.tipBonus) || 0);
  const randomTip = Math.random() < 0.6 ? 50 + Math.floor(Math.random() * 3) * 30 : 0;
  const totalTip = Math.max(0, baseTip + randomTip);

  const prompt = `Ты — курьер, только что вручил букет получателю и пишешь короткий отчёт руководителю в Direct.
${getEmployeeContext(courier)}
Доставка: адрес ${delivery.address}, букет «${delivery.bouquetSummary || delivery.flowerName}», стоимость ${delivery.reward} ₽.
${delivery.resolutionNote ? `В пути была заминка, но её решили: ${delivery.resolutionNote}.` : 'Дорога прошла спокойно.'}
${totalTip > 0 ? `Получатель оставил +${totalTip} ₽ чаевых!` : 'Без дополнительных чаевых, но поблагодарили.'}

Напиши живой, атмосферный отчёт в 1–2 предложения (опиши реакцию получателя). Без JSON!`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  return {
    message: stripCodeFences(raw).trim(),
    tip: totalTip
  };
}

export async function generateShopEmployeeTalkReply(employee, history, playerText) {
  const recentText = (history || [])
    .slice(-8)
    .map((m) => `${m.sender === 'player' ? 'Руководитель' : employee.name}: ${m.text}`)
    .join('\n');

  const prompt = `Вы с руководителем общаетесь вживую во время смены в цветочном магазине.
${getEmployeeContext(employee)}

Недавняя беседа:
${recentText}
Руководитель сказал: "${playerText}"

Ответь живо, тепло и по сути (1–2 предложения) в своём характере. Без JSON!`;

  const raw = await callAI([{ role: 'user', content: prompt }]);
  return stripCodeFences(raw).trim();
}