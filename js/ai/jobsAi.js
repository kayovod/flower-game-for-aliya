/**
 * js/ai/jobsAi.js
 * Полностью уникальная ИИ-генерация соискателей, собеседования и реакции на найм/отказ
 */

import { gameState, aiSettings } from '../state.js';
import {
  callAI,
  stripCodeFences,
  sleep,
  pickRandom,
  generateProceduralNick,
  isRudeText,
  formatMinutesAsTime
} from './aiCore.js';

// Оставлено пустым для совместимости экспортов — шаблонные кандидаты удалены
export const CANDIDATE_PROFILES = [];

function createProceduralFallbackCandidate(jobPosting, usedNamesSet, usedNicksSet) {
  const isFemale = Math.random() < 0.55;
  const femaleNames = [
    'Алина', 'Вика', 'Дарья', 'София', 'Полина', 'Кристина', 'Яна', 'Диана',
    'Олеся', 'Рита', 'Ева', 'Вероника', 'Карина', 'Таисия', 'Лида', 'Надежда',
    'Света', 'Инна', 'Юля', 'Настя', 'Милана', 'Злата'
  ];
  const maleNames = [
    'Арсений', 'Влад', 'Глеб', 'Игорь', 'Роман', 'Денис', 'Никита', 'Стас',
    'Егор', 'Павел', 'Руслан', 'Борис', 'Сергей', 'Костя', 'Матвей', 'Олег',
    'Антон', 'Михаил', 'Виктор', 'Семён', 'Захар', 'Илья'
  ];

  const poolNames = (isFemale ? femaleNames : maleNames).filter(
    (n) => !usedNamesSet.has(n.toLowerCase())
  );
  const name = pickRandom(poolNames.length ? poolNames : isFemale ? femaleNames : maleNames);
  const nick = generateProceduralNick(usedNicksSet);
  const age = 19 + Math.floor(Math.random() * 36);

  const isAssistant = jobPosting.roleId === 'assistant';
  const transports = isAssistant
    ? ['Пешком', 'На метро', 'На велосипеде']
    : ['Пешком с терморюкзаком', 'На электровелосипеде', 'На электросамокате', 'На своём хэтчбеке', 'На личном седане', 'На скутере'];
  const transport = pickRandom(transports);
  const hasCar = !isAssistant && (transport.includes('хэтчбек') || transport.includes('седан'));

  const bios = isAssistant
    ? [
        'Учится на дизайнера интерьеров, давно тренируется собирать композиции дома.',
        'Несколько лет помогала в небольшой мастерской декора, любит аккуратную работу со срезкой.',
        'Любит ботанику и минимализм, быстро схватывает новые техники упаковки.',
        'Раньше работал в кофейне при цветочном корнере и втянулся во флористику.'
      ]
    : [
        'Хорошо знает город и дворы, всегда звонит заранее и бережно держит букеты.',
        'Пунктуальный и спокойный человек, любит быть в движении и общаться с людьми.',
        'Подрабатывает доставкой уже второй год, никогда не путает адреса.',
        'Ценит чёткий маршрут и бережное отношение к хрупким композициям.'
      ];

  const quirks = [
    'дружелюбный и разговорчивый человек с лёгким чувством юмора',
    'немного застенчивый, но очень старательный и аккуратный',
    'деловой, конкретный и любит чёткие договорённости без воды',
    'творческий мечтатель, обращает внимание на атмосферу в коллективе',
    'энергичный и быстрый, не любит сидеть без дела'
  ];

  const reqs = isAssistant
    ? [
        'Просит спокойную обстановку без криков и чёткий список задач на день.',
        'Хочет раз в неделю уходить на час пораньше по личным делам.',
        'Просит, чтобы в лавке был тёплый чай и перчатки для шипов.',
        'Предпочитает работать с нежными пастельными оттенками и не любит спешку.'
      ]
    : [
        'Просит заранее предупреждать, если букет очень тяжёлый или высокий.',
        'Хочет стабильную доплату при выездах в плохую погоду и понятный адрес.',
        'Просит не отправлять в два противоположных конца города одновременно.',
        'Всегда просит контактный телефон получателя перед выездом.'
      ];

  const baseOffered = Math.max(450, Number(jobPosting.salary) || 1200);
  const offset = pickRandom([-200, -100, 0, 100, 200, 300, 400]);
  const askedSalary = Math.max(500, Math.round((baseOffered + offset) / 50) * 50);
  const minAcceptSalary = Math.max(450, Math.round((askedSalary - pickRandom([100, 150, 200, 250])) / 50) * 50);
  const req = pickRandom(reqs);
  const bio = pickRandom(bios);
  const quirk = pickRandom(quirks);

  const ending = isFemale ? 'а' : '';
  const opener = isAssistant
    ? `Здравствуйте! Меня зовут ${name}, увидел${ending} ваше объявление на должность «${jobPosting.roleName}». ${bio} Ориентируюсь на ставку около ${askedSalary} ₽, и для меня важно: ${req.toLowerCase()} Пообщаемся?`
    : `Добрый день! Я ${name}, откликаюсь на вакансию курьера в «${jobPosting.locationName}» (${transport.toLowerCase()}). Хотелось бы около ${askedSalary} ₽ за смену. ${req} Готов${ending} обсудить детали!`;

  return {
    id: 'cand_ai_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    name,
    nick,
    age,
    gender: isFemale ? 'female' : 'male',
    bio,
    quirk,
    requirements: req,
    transport,
    hasCar,
    askedSalary,
    minAcceptSalary,
    opener
  };
}

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
  let cand = null;

  if (aiSettings.provider !== 'offline') {
    const seed = Math.floor(10000 + Math.random() * 89999);
    const prompt = `Придумай С НУЛЯ абсолютно нового, уникального, живого соискателя работы для цветочного магазина "${gameState.shopName || 'Fleur Atelier'}" (seed=${seed}).
Вакансия:
- Должность: ${jobPosting.roleName} (${jobPosting.roleId === 'courier' ? 'доставка букетов' : 'помощь в лавке и с цветами'})
- Точка: «${jobPosting.locationName}»
- График: «${jobPosting.scheduleLabel}»
- Предложенная в объявлении ставка: ${baseOffered} ₽ за смену.

ЗАПРЕЩЕНО повторять уже встречавшихся людей и ники: ${usedNames.join(', ') || 'пока нет'}; ники: ${usedNicks.slice(0, 12).join(', ') || 'пока нет'}.
ЗАПРЕЩЕНО использовать шаблонных персонажей «Лера студентка», «Эстет Макс», «Дядя Саша».

Сделай человека максимально непохожим на других: чередуй пол, возраст (от 18 до 62 лет), социальный статус, характер (может быть скромным, бойким, творческим, ворчливым, прагматичным, весёлым), опыт и КОНКРЕТНЫЕ ЛИЧНЫЕ ТРЕБОВАНИЯ к работе (например: график, аллергия на конкретный цветок, оплата, перерывы, условия доставки, отношение к клиентам и т.п.).

Верни СТРОГО ОДИН валидный JSON без markdown:
{
  "name": "Уникальное имя (можно с фамилией или просто имя)",
  "nick": "@уникальный_ник",
  "age": 26,
  "gender": "female" или "male",
  "bio": "1-2 коротких предложения об опыте и жизни соискателя",
  "quirk": "характер и манера общения",
  "requirements": "главное личное требование или условие к работе",
  "transport": "${jobPosting.roleId === 'courier' ? 'на чём доставляет (пешком / велик / электросамокат / своё авто и модель)' : 'как добирается или особая привычка'}",
  "hasCar": ${jobPosting.roleId === 'courier' ? 'true или false' : 'false'},
  "askedSalary": число (близкое к ${baseOffered}, например от ${Math.max(500, baseOffered - 250)} до ${baseOffered + 500}),
  "minAcceptSalary": число (минимум, на который реально согласится после торга, на 100-350 меньше askedSalary, но >= 450),
  "opener": "первое живое сообщение в Direct (2-3 предложения от первого лица с учётом пола, характера, опыта и своих требований, БЕЗ упоминания кнопок/интерфейса)"
}`;

    try {
      const raw = await callAI([{ role: 'user', content: prompt }]);
      const cleaned = stripCodeFences(raw);
      const s = cleaned.indexOf('{');
      const e = cleaned.lastIndexOf('}');
      if (s !== -1 && e > s) {
        const parsed = JSON.parse(cleaned.slice(s, e + 1));
        let name = String(parsed.name || '').trim();
        if (!name || usedNamesSet.has(name.toLowerCase())) {
          const fallback = createProceduralFallbackCandidate(jobPosting, usedNamesSet, usedNicksSet);
          name = fallback.name;
        }

        let nick = String(parsed.nick || '').trim().replace(/\s+/g, '_');
        if (nick && !nick.startsWith('@')) nick = '@' + nick;
        if (!nick || nick.length < 3 || usedNicksSet.has(nick.toLowerCase())) {
          nick = generateProceduralNick(usedNicksSet);
        }

        const gender = parsed.gender === 'male' ? 'male' : parsed.gender === 'female' ? 'female' : (Math.random() < 0.5 ? 'female' : 'male');
        const age = Math.max(18, Math.min(65, Math.round(Number(parsed.age) || (20 + Math.floor(Math.random() * 25)))));
        const askedSalary = Math.max(500, Math.min(8000, Math.round((Number(parsed.askedSalary) || baseOffered) / 50) * 50));
        const rawMin = Number(parsed.minAcceptSalary) || (askedSalary - 150);
        const minAcceptSalary = Math.max(450, Math.min(askedSalary, Math.round(rawMin / 50) * 50));
        const hasCar = jobPosting.roleId === 'courier' && Boolean(parsed.hasCar);
        const opener = String(parsed.opener || '').trim();

        if (opener.length > 12) {
          cand = {
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
        }
      }
    } catch (err) {
      console.warn('Ошибка генерации ИИ-кандидата, использован резерв:', err);
    }
  }

  if (!cand) {
    cand = createProceduralFallbackCandidate(jobPosting, usedNamesSet, usedNicksSet);
  }

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

  if (aiSettings.provider === 'offline') {
    await sleep(220);
    return runOfflineCandidateInterview(app, playerText);
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

  try {
    const raw = await callAI([{ role: 'user', content: prompt }]);
    const cleaned = stripCodeFences(raw);
    const s = cleaned.indexOf('{');
    const e = cleaned.lastIndexOf('}');
    if (s !== -1 && e > s) {
      const parsed = JSON.parse(cleaned.slice(s, e + 1));
      const nextSalary = Math.max(app.minAcceptSalary, Math.min(10000, Number(parsed.agreedSalary) || app.agreedSalary));
      return {
        reply: String(parsed.reply || 'Договорились!').trim(),
        agreedSalary: nextSalary,
        blockedByClient: false
      };
    }
  } catch (err) {
    console.warn('Fallback собеседования:', err);
  }
  return runOfflineCandidateInterview(app, playerText);
}

function runOfflineCandidateInterview(app, playerText) {
  const lower = String(playerText || '').toLowerCase().trim();
  const isFem = app.gender === 'female';
  const readyWord = isFem ? 'готова' : 'готов';

  const salaryMatch = lower.match(/(\d{3,5})/);
  if (salaryMatch && (lower.includes('₽') || lower.includes('руб') || lower.includes('ставк') || lower.includes('зарпл') || lower.includes('оклад') || lower.includes('за смену') || lower.includes('предлаг') || lower.includes('давай') || lower.includes('устроит'))) {
    const proposed = Number(salaryMatch[1]);
    if (proposed >= app.agreedSalary) {
      return {
        reply: `${proposed} ₽ за смену — это отлично! С такими условиями я ${readyWord} работать у вас с полной отдачей 🌸`,
        agreedSalary: proposed,
        blockedByClient: false
      };
    }
    if (proposed >= app.minAcceptSalary) {
      return {
        reply: `Хорошо, ${proposed} ₽ меня устроит! Главное, чтобы учли моё условие: ${String(app.requirements || 'честные условия').toLowerCase()}`,
        agreedSalary: proposed,
        blockedByClient: false
      };
    }
    const compromise = Math.round(((proposed + app.minAcceptSalary) / 2) / 50) * 50;
    const target = Math.max(app.minAcceptSalary, compromise);
    return {
      reply: app.hasCar
        ? `За ${proposed} ₽ мне даже бензин еле окупится! Давайте хотя бы ${target} ₽ за смену — и договоримся.`
        : `Ой, ${proposed} ₽ всё-таки маловато... Могу подвинуться до ${target} ₽ за смену — как вам?`,
      agreedSalary: target,
      blockedByClient: false
    };
  }

  if (lower.includes('опыт') || lower.includes('умее') || lower.includes('работал') || lower.includes('расскаж')) {
    return {
      reply: `${app.bio} Пожелание у меня простое: ${String(app.requirements || '').toLowerCase()}`,
      agreedSalary: app.agreedSalary,
      blockedByClient: false
    };
  }

  if (lower.includes('график') || lower.includes('когда') || lower.includes('выйти') || lower.includes('время') || lower.includes('смен')) {
    return {
      reply: `График «${app.scheduleLabel}» мне подходит! Если сойдёмся на ${app.agreedSalary} ₽/см., могу выходить на точку «${app.locationName}».`,
      agreedSalary: app.agreedSalary,
      blockedByClient: false
    };
  }

  if (lower.includes('машин') || lower.includes('транспорт') || lower.includes('пробк') || lower.includes('достав')) {
    return {
      reply: `Передвигаюсь так: ${app.transport || (app.hasCar ? 'на своём авто' : 'налегке')}. Букеты довезу аккуратно и без опозданий!`,
      agreedSalary: app.agreedSalary,
      blockedByClient: false
    };
  }

  return {
    reply: pickRandom([
      `Всё понял${isFem ? 'а' : ''}! Мне нравится ваша лавка «${app.locationName}». По ставке ориентируюсь на ${app.agreedSalary} ₽/см.`,
      `Да, это не проблема! А вам подходят мои условия (${String(app.requirements || '').toLowerCase()})?`,
      `Хороший вопрос! Буду рад${isFem ? 'а' : ''} влиться в команду 🌸`
    ]),
    agreedSalary: app.agreedSalary,
    blockedByClient: false
  };
}

export async function generateCandidateHireReaction(dm, accepted, finalSalary) {
  const app = dm.jobApplication;
  const isFem = app?.gender === 'female';

  if (aiSettings.provider !== 'offline' && app) {
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
      console.warn('Fallback реакции на найм:', err);
    }
  }

  if (accepted) {
    return pickRandom([
      `Ура, спасибо за доверие! Очень рад${isFem ? 'а' : ''}, что договорились на ${finalSalary} ₽/см. — скоро приступлю к работе 🌸`,
      `Отлично, договорились на ${finalSalary} ₽ за смену! Обещаю не подвести и работать на совесть.`
    ]);
  }
  return pickRandom([
    `Понял${isFem ? 'а' : ''}, спасибо за честный ответ и уделённое время. Удачи вашей лавке!`,
    `Жаль, но всё равно спасибо за беседу. Хороших продаж вашему магазину!`
  ]);
}