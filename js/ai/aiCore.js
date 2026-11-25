/**
 * js/ai/aiCore.js
 * Ядро ИИ: сетевые запросы (Gemini, OpenRouter, Groq, Puter и др.), таймауты и парсинг JSON
 */

import { AI_PROVIDERS, FLOWERS_CATALOG } from '../config.js';
import { gameState, aiSettings } from '../state.js';

export function formatApiError(status, rawText) {
  let msg = '';
  try {
    const parsed = JSON.parse(rawText);
    msg = parsed?.error?.message || parsed?.message || '';
  } catch (e) {
    msg = String(rawText || '').slice(0, 140);
  }
  const lower = msg.toLowerCase();

  if (status === 429 || lower.includes('quota') || lower.includes('rate limit') || lower.includes('resource_exhausted')) {
    return 'Превышен лимит запросов к ИИ (квота 429). Подожди 20–30 секунд или проверь лимиты ключа.';
  }
  if (status === 401 || status === 403 || lower.includes('api key')) {
    return 'Неверный или заблокированный API-ключ. Проверь ключ в «Касса и ИИ».';
  }
  if (status === 404 || lower.includes('not found')) {
    return 'Указанная модель ИИ не найдена. Проверь название модели в «Касса и ИИ».';
  }
  return `Ошибка ИИ (${status}): ${msg || 'сервер не смог обработать запрос'}`;
}

export async function fetchWithTimeout(url, options, timeoutMs = 35000) {
  const controller = new AbortController();
  const effectiveMs = Math.max(Number(timeoutMs) || 35000, 35000);
  const timerId = setTimeout(() => controller.abort(), effectiveMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Сервер ИИ не успел ответить (таймаут). Попробуй ещё раз!');
    }
    throw err;
  } finally {
    clearTimeout(timerId);
  }
}

export async function callAI(messages) {
  const provider = aiSettings.provider || 'openrouter';
  const providerMeta = AI_PROVIDERS[provider] || AI_PROVIDERS.openrouter;

  if (provider === 'puter') {
    if (!window.puter || !window.puter.ai) {
      throw new Error('Puter.js не загрузился. Проверь интернет или переключи провайдера в «Касса и ИИ».');
    }
    const model = aiSettings.model || 'gpt-4o-mini';
    const response = await window.puter.ai.chat(messages, { model });
    if (typeof response === 'string') return response;
    return response?.message?.content?.[0]?.text || response?.message?.content || String(response);
  }

  const apiKey = (aiSettings.apiKey || '').trim();
  if (providerMeta.needsKey && !apiKey) {
    throw new Error('Не указан API-ключ в разделе «Касса и ИИ → Настройки и ИИ»!');
  }

  if (provider === 'gemini') {
    const baseUrl = (aiSettings.baseUrl || providerMeta.baseUrl).replace(/\/+$/, '');
    const model = (aiSettings.model || providerMeta.defaultModel).trim();
    const url = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const systemMsg = messages.find((m) => m.role === 'system')?.content || '';
    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    if (systemMsg && contents.length > 0) {
      contents[0].parts[0].text = `[ИНСТРУКЦИЯ]\n${systemMsg}\n\n[ДИАЛОГ]\n${contents[0].parts[0].text}`;
    }

    const generationConfig = {
      temperature: 0.88,
      maxOutputTokens: 1500
    };
    if (model.includes('2.5')) {
      generationConfig.thinkingConfig = { thinkingBudget: 0 };
    }

    const res = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig })
      },
      24000
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(formatApiError(res.status, errText));
    }

    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts
      .filter((p) => !p.thought && p.text)
      .map((p) => p.text)
      .join('')
      .trim();
    if (!text) throw new Error('ИИ вернул пустой ответ');
    return text;
  }

  const baseUrl = (aiSettings.baseUrl || providerMeta.baseUrl || 'https://openrouter.ai/api/v1').replace(/\/+$/, '');
  const model = (aiSettings.model || providerMeta.defaultModel || 'baidu/ernie-5.5-flash-preview:free').trim();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`
  };

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'Fleur Atelier Game';
  }

  const res = await fetchWithTimeout(
    `${baseUrl}/chat/completions`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.88,
        max_tokens: 1200
      })
    },
    24000
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(formatApiError(res.status, errText));
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('ИИ вернул пустой ответ');
  return text.trim();
}

export async function testAiConnection() {
  try {
    const reply = await callAI([
      { role: 'user', content: 'Ответь одной короткой тёплой фразой по-русски (до 7 слов), что ты на связи и готова помогать в цветочном магазине!' }
    ]);
    return { ok: true, reply };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export function stripCodeFences(str) {
  return String(str || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
}

export function parseClientJson(rawText) {
  const cleaned = stripCodeFences(rawText);
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    try {
      const obj = JSON.parse(cleaned.slice(start, end + 1));
      const moodVal = Number(obj.moodChange ?? obj.moodDelta);
      const rawStatus = obj.dealStatus || obj.decision;
      let dealStatus = 'talking';
      if (rawStatus === 'bought' || rawStatus === 'accept_offer') dealStatus = 'bought';
      else if (rawStatus === 'left' || rawStatus === 'leave') dealStatus = 'left';

      return {
        reply: String(obj.reply || '').trim() || 'Спасибо за ответ!',
        moodChange: Number.isFinite(moodVal) ? moodVal : 0,
        dealStatus,
        wantedBouquetId: obj.wantedBouquetId ? String(obj.wantedBouquetId) : null
      };
    } catch (e) {
      // ignore
    }
  }
  return { reply: cleaned || 'Угу, понятно!', moodChange: 0, dealStatus: 'talking', wantedBouquetId: null };
}

export function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export function isRudeText(text) {
  const t = String(text || '').toLowerCase();
  const badWords = [
    'дура', 'дурак', 'идиот', 'тупая', 'тупой', 'дебил', 'мраз', 'тварь',
    'сука', 'бля', 'нахер', 'нахуй', 'пошёл', 'пошел', 'пошла', 'отвали',
    'заткнись', 'вали', 'урод', 'козёл', 'козел', 'сдохни', 'лох', 'чмо', 'пизд', 'хуй', 'еба'
  ];
  return badWords.some((w) => t.includes(w));
}

export function formatMinutesAsTime(totalMins) {
  const m = Math.max(0, Math.round(totalMins || 0)) % 1440;
  const hh = String(Math.floor(m / 60)).padStart(2, '0');
  const mm = String(m % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function resolvePlayerGender() {
  const g = gameState.playerBadgeGender || 'auto';
  if (g === 'female' || g === 'male') return g;
  const name = String(gameState.playerBadgeName || '').trim().toLowerCase();
  if (!name) return 'neutral';
  if (name.endsWith('а') || name.endsWith('я') || name.endsWith('ия') || name.endsWith('ь')) {
    if (['никита', 'илья', 'данила', 'миша', 'саша', 'женя', 'ваня', 'дима', 'коля', 'петя', 'вова', 'серёжа', 'лёша', 'артём', 'шамиль', 'руслан', 'тимур'].includes(name)) {
      return name === 'шамиль' ? 'male' : 'neutral';
    }
    return 'female';
  }
  return 'male';
}

export function getBadgeRuleText() {
  const badgeName = String(gameState.playerBadgeName || '').trim();
  if (!badgeName) return 'На бейджике продавца имя не указано — НЕ выдумывай имя продавца.';
  const g = resolvePlayerGender();
  const genderHint =
    g === 'female'
      ? 'это девушка/женщина (обращайся в женском роде: «флористка», «вы помогли/подсказали»)'
      : g === 'male'
      ? 'это парень/мужчина (обращайся в мужском роде: «флорист», «вы помогли/подсказали»)'
      : 'пол не уточнён, обращайся нейтрально на «вы»';
  return `На груди продавца бейджик с именем «${badgeName}» (${genderHint}). Иногда естественно обращайся по имени «${badgeName}».`;
}

export function detectMentionedFlowers(text) {
  const lower = String(text || '').toLowerCase();
  const hits = [];
  if (lower.includes('красн') && lower.includes('роз')) hits.push('rose_red');
  if (lower.includes('бел') && lower.includes('роз')) hits.push('rose_white');
  if (lower.includes('розов') && lower.includes('роз')) hits.push('rose_pink');
  if (hits.length === 0 && lower.includes('роз')) hits.push('rose_red', 'rose_white', 'rose_pink');
  if (lower.includes('пион')) hits.push('peony_pink');
  if (lower.includes('тюльпан')) hits.push('tulip_yellow');
  if (lower.includes('ромаш')) hits.push('chamomile_white');
  if (lower.includes('лаванд')) hits.push('lavender_purple');
  if (lower.includes('лили')) hits.push('lily_white');
  if (lower.includes('подсолн')) hits.push('sunflower');
  if (lower.includes('орхид')) hits.push('orchid_purple');
  if (lower.includes('гортенз')) hits.push('hydrangea_blue');
  if (lower.includes('гипсоф')) hits.push('gypsophila');
  if (lower.includes('эвкалипт')) hits.push('eucalyptus');
  return Array.from(new Set(hits)).filter((id) => Boolean(FLOWERS_CATALOG[id]));
}

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickUnused(pool, usedList) {
  const fresh = pool.filter((item) => !usedList.includes(item));
  const source = fresh.length > 0 ? fresh : pool;
  return pickRandom(source);
}