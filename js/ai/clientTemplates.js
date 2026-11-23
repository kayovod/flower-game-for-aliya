/**
 * js/ai/clientTemplates.js
 * Процедурные генераторы параметров, имён, поводов и характеров клиентов
 */

import { FLOWERS_CATALOG } from '../config.js';
import { pickRandom } from './aiCore.js';

export const SKINS = ['#FCE0D2', '#F5CBAF', '#E6B394'];
export const YOUNG_HAIR = ['#4E392E', '#7A543E', '#C98A5B', '#E3C07B', '#2F2928'];
export const SENIOR_HAIR = ['#B8B2AD', '#C9C3BE', '#8A847F'];
export const SHIRT_COLORS = ['#D98A7C', '#89A88B', '#8EA8C3', '#D4A5B8', '#DFB66B', '#9D8EB8'];
export const BG_TINTS = ['#F7EAE4', '#E9F0E8', '#E9EEF4', '#F5EBF2'];

export const SEASONAL_PREFERENCES = {
  winter: 'хочет зимний атмосферный букет: красные или белые розы, гвоздики, хризантемы и эвкалипт',
  'early-spring': 'ищет свежий весенний букет из тюльпанов, синих ирисов и лаванды',
  summer: 'хочет яркий летний хит из пионов, подсолнухов, ромашек или гортензии',
  autumn: 'хочет уютный осенний букет из подсолнухов, белых хризантем, коралловых пионов и эвкалипта'
};

export function generateProceduralClientName(gender) {
  const femaleFirst = ['Алис', 'Мар', 'Елен', 'Соф', 'Дар', 'Анн', 'Валер', 'Ксен', 'Полин', 'Ольг', 'Карин', 'Динар', 'Алин', 'Ян', 'Виктори', 'Ульян', 'Милан', 'Арин', 'Кир', 'Злат'];
  const femaleEnd = ['а', 'ия', 'ена', 'ушка', 'ечка', 'очка', 'яна'];
  const maleFirst = ['Артём', 'Дмитрий', 'Максим', 'Игорь', 'Никита', 'Михаил', 'Кирилл', 'Роман', 'Александр', 'Тимур', 'Артур', 'Марк', 'Денис', 'Павел', 'Егор', 'Глеб', 'Влад', 'Руслан', 'Савва', 'Лев'];
  const seniorLasts = ['Петрович', 'Сергеевич', 'Иванович', 'Андреевич', 'Михайлович', 'Николаевич'];

  if (gender === 'female') {
    return `${pickRandom(femaleFirst)}${pickRandom(femaleEnd)}`;
  }
  const name = pickRandom(maleFirst);
  if (Math.random() < 0.22) {
    return `${name} ${pickRandom(seniorLasts)}`;
  }
  return name;
}

export function generateProceduralOccasion(gender, holiday, season) {
  const recipients = gender === 'female'
    ? ['маме', 'подруге', 'сестре', 'бабушке', 'любимому преподавателю', 'коллеге', 'дочке']
    : ['девушке', 'жене', 'маме', 'бабушке', 'коллеге', 'лучшему другу'];
  
  const events = [
    'на день рождения',
    'на годовщину отношений',
    'в знак примирения после ссоры',
    'просто чтобы поднять настроение без повода',
    'на новоселье',
    'на выписку из роддома',
    'на первое свидание',
    'для уютного домашнего вечера',
    'в знак искренней благодарности'
  ];

  if (holiday && Math.random() < 0.6) {
    return `подарок к празднику (${holiday.name})`;
  }
  return `подарок для ${pickRandom(recipients)} (${pickRandom(events)}, сезон: ${season.label})`;
}

export function generateProceduralPreference() {
  const flowers = Object.values(FLOWERS_CATALOG);
  const f1 = pickRandom(flowers);
  let f2 = pickRandom(flowers);
  while (f2.id === f1.id) f2 = pickRandom(flowers);

  const styles = [
    `хочет нежный монобукет из свежих ${f1.name.toLowerCase()}`,
    `ищет стильный сборный микс из ${f1.name.toLowerCase()} и ${f2.name.toLowerCase()}`,
    `просит собрать воздушную композицию с акцентом на ${f1.name.toLowerCase()} в красивой упаковке`,
    `хочет яркий авторский букет, где главные цветы — ${f2.name.toLowerCase()}`
  ];
  return pickRandom(styles);
}

export function generateProceduralQuirk() {
  const quirks = [
    'говорит живо и с лёгкой иронией, любит подшучивать',
    'немного застенчивый, смущается и делает искренние комплименты',
    'прямолинейный и резковатый, ценит честность без лишней воды',
    'болтливый мечтатель, легко уходит в личные истории',
    'кокетливый и обаятельный, может пофлиртовать или пригласить на кофе при тёплом общении',
    'спокойный философ, рассуждает о жизни и настроении',
    'импульсивный, решает на эмоциях и любит неожиданные сочетания'
  ];
  return pickRandom(quirks);
}

export function generateProceduralPersonality(gender) {
  const traits = [
    { female: 'вежливая и нежная романтичная натура', male: 'вежливый и немного застенчивый романтик' },
    { female: 'вечно спешащая деловая леди, ценит лаконичность', male: 'вечно спешащий деловой человек, ценит лаконичность' },
    { female: 'ворчливая, но в душе добрая эстетка, любит поторговаться', male: 'ворчливый, но в душе добрый эстет, любит поторговаться' },
    { female: 'очень эмоциональная и душевная натура, обожает уют', male: 'очень душевный и чуткий собеседник, обожает уют' },
    { female: 'требовательная ценительница стиля с хорошим вкусом', male: 'требовательный ценитель стиля с хорошим вкусом' },
    { female: 'приветливый человек с ограниченным бюджетом, ищет душевный вариант', male: 'приветливый студент с ограниченным бюджетом, ищет душевный вариант' }
  ];
  const obj = pickRandom(traits);
  return gender === 'female' ? obj.female : obj.male;
}