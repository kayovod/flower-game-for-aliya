/**
 * Генератор векторных портретов клиентов с учётом пола, возраста и эмоций
 */

export function getClientAvatarSvg(appearance, mood = 65) {
  const {
    gender = 'female',
    age = 28,
    skin = '#F9D9C6',
    hairStyle = 'bob',
    hairColor = '#6B4C3B',
    shirtColor = '#D98A7C',
    hasGlasses = false,
    hasBeard = false,
    bgTint = '#F2E7DC'
  } = appearance || {};

  const isMale = gender === 'male';
  const isSenior = age >= 52;
  const isHappy = mood >= 65;
  const isAngry = mood < 35;

  // Брови
  const browLeft = isAngry
    ? '<path d="M33 40 L43 43" stroke="#4A3E39" stroke-width="2" stroke-linecap="round"/>'
    : isHappy
    ? '<path d="M33 41 Q38 38 43 40" stroke="#4A3E39" stroke-width="1.8" stroke-linecap="round" fill="none"/>'
    : '<path d="M33 41 L43 41" stroke="#4A3E39" stroke-width="1.8" stroke-linecap="round"/>';

  const browRight = isAngry
    ? '<path d="M67 40 L57 43" stroke="#4A3E39" stroke-width="2" stroke-linecap="round"/>'
    : isHappy
    ? '<path d="M57 40 Q62 38 67 41" stroke="#4A3E39" stroke-width="1.8" stroke-linecap="round" fill="none"/>'
    : '<path d="M57 41 L67 41" stroke="#4A3E39" stroke-width="1.8" stroke-linecap="round"/>';

  // Ротик (у мужчин без помады, поспокойнее)
  const mouthColor = isMale ? '#7D5851' : '#B5625D';
  const mouth = isHappy
    ? `<path d="M43 60 Q50 65 57 60" stroke="${mouthColor}" stroke-width="2.1" stroke-linecap="round" fill="none"/>`
    : isAngry
    ? `<path d="M44 63 Q50 58 56 63" stroke="${mouthColor}" stroke-width="2.1" stroke-linecap="round" fill="none"/>`
    : `<path d="M45 61 L55 61" stroke="${mouthColor}" stroke-width="2" stroke-linecap="round"/>`;

  // Задний слой волос (только у женщин)
  let hairBack = '';
  if (!isMale) {
    if (hairStyle === 'long') {
      hairBack = `<path d="M23 42 Q21 76 29 88 L71 88 Q79 76 77 42 Q75 15 50 15 Q25 15 23 42 Z" fill="${hairColor}"/>`;
    } else if (hairStyle === 'bob') {
      hairBack = `<path d="M25 42 Q24 68 33 74 L67 74 Q76 68 75 42 Q73 16 50 16 Q27 16 25 42 Z" fill="${hairColor}"/>`;
    } else if (hairStyle === 'bun') {
      hairBack = `
        <circle cx="50" cy="13" r="11" fill="${hairColor}"/>
        <circle cx="50" cy="40" r="24" fill="${hairColor}"/>
      `;
    }
  }

  // Передние волосы
  let hairFront = '';
  if (isMale) {
    if (hairStyle === 'quiff') {
      hairFront = `<path d="M26 42 Q26 18 46 14 Q67 12 74 36 Q74 42 71 42 Q66 26 49 26 Q33 27 26 42 Z" fill="${hairColor}"/>`;
    } else if (hairStyle === 'buzz') {
      hairFront = `<path d="M27 38 Q28 19 50 19 Q72 19 73 38 Q65 28 50 28 Q35 28 27 38 Z" fill="${hairColor}"/>`;
    } else {
      hairFront = `<path d="M26 41 Q26 17 50 17 Q74 17 74 41 Q66 27 50 28 Q34 27 26 41 Z" fill="${hairColor}"/>`;
    }
  } else {
    hairFront = `<path d="M26 43 Q28 18 50 18 Q72 18 74 43 Q63 31 54 27 Q43 34 26 43 Z" fill="${hairColor}"/>`;
  }

  // Плечи (у мужчин шире)
  const shouldersSvg = isMale
    ? `<path d="M12 100 Q16 74 50 74 Q84 74 88 100 Z" fill="${shirtColor}"/>
       <path d="M40 73 L60 73 L50 84 Z" fill="#FFFDF9" opacity="0.7"/>`
    : `<path d="M18 100 Q22 76 50 76 Q78 76 82 100 Z" fill="${shirtColor}"/>`;

  // Румянец (только женщинам) и реснички
  const blushSvg = !isMale
    ? `<ellipse cx="35" cy="54" rx="4.5" ry="2.4" fill="#F29E9D" opacity="0.45"/>
       <ellipse cx="65" cy="54" rx="4.5" ry="2.4" fill="#F29E9D" opacity="0.45"/>
       <path d="M36 45 L33 43 M64 45 L67 43" stroke="#4A3E39" stroke-width="1.3" stroke-linecap="round"/>`
    : '';

  // Бородка/усы или морщины
  const beardSvg =
    isMale && hasBeard
      ? `<path d="M31 56 Q33 74 50 74 Q67 74 69 56 Q64 65 50 65 Q36 65 31 56 Z" fill="${hairColor}" opacity="0.82"/>`
      : '';

  const wrinklesSvg = isSenior
    ? `<path d="M42 29 L58 29" stroke="#C5A38D" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
       <path d="M32 52 Q34 55 34 59 M68 52 Q66 55 66 59" stroke="#C5A38D" stroke-width="1" fill="none" opacity="0.55"/>`
    : '';

  const glassesSvg = hasGlasses
    ? `
      <g stroke="#5E4F48" stroke-width="1.6" fill="rgba(255,255,255,0.22)">
        <circle cx="39" cy="47" r="7"/>
        <circle cx="61" cy="47" r="7"/>
        <line x1="46" y1="47" x2="54" y2="47"/>
      </g>
    `
    : '';

  // Форма лица: у мужчин чуть шире подбородок
  const faceRx = isMale ? 17 : 22;

  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${bgTint}"/>
      ${hairBack}
      ${shouldersSvg}
      <path d="M42 72 L58 72 L56 82 Q50 85 44 82 Z" fill="${skin}"/>
      <circle cx="27" cy="49" r="4.5" fill="${skin}"/>
      <circle cx="73" cy="49" r="4.5" fill="${skin}"/>
      <rect x="28" y="24" width="44" height="49" rx="${faceRx}" fill="${skin}"/>
      ${blushSvg}
      ${beardSvg}
      ${wrinklesSvg}
      <circle cx="39" cy="47" r="2.7" fill="#4A3E39"/>
      <circle cx="61" cy="47" r="2.7" fill="#4A3E39"/>
      <circle cx="38" cy="46" r="0.9" fill="#FFFFFF"/>
      <circle cx="60" cy="46" r="0.9" fill="#FFFFFF"/>
      ${browLeft}
      ${browRight}
      ${mouth}
      ${glassesSvg}
      ${hairFront}
    </svg>
  `;
}