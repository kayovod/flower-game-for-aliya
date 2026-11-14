/**
 * Генератор милых векторных портретов клиентов с эмоциями
 */

export function getClientAvatarSvg(appearance, mood = 65) {
  const {
    gender = 'female',
    skin = '#F9D9C6',
    hairStyle = 'bob',
    hairColor = '#6B4C3B',
    shirtColor = '#D98A7C',
    hasGlasses = false,
    bgTint = '#F2E7DC'
  } = appearance || {};

  const isHappy = mood >= 65;
  const isAngry = mood < 35;

  // Глаза и брови в зависимости от настроения
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

  // Ротик
  const mouth = isHappy
    ? '<path d="M43 60 Q50 66 57 60" stroke="#A65E58" stroke-width="2.2" stroke-linecap="round" fill="none"/>'
    : isAngry
    ? '<path d="M44 63 Q50 58 56 63" stroke="#A65E58" stroke-width="2.2" stroke-linecap="round" fill="none"/>'
    : '<path d="M45 61 L55 61" stroke="#A65E58" stroke-width="2" stroke-linecap="round"/>';

  // Задний слой волос
  let hairBack = '';
  if (hairStyle === 'long') {
    hairBack = `<path d="M24 42 Q22 76 30 88 L70 88 Q78 76 76 42 Q74 16 50 16 Q26 16 24 42 Z" fill="${hairColor}"/>`;
  } else if (hairStyle === 'bob') {
    hairBack = `<path d="M25 42 Q24 68 33 74 L67 74 Q76 68 75 42 Q73 16 50 16 Q27 16 25 42 Z" fill="${hairColor}"/>`;
  } else if (hairStyle === 'bun') {
    hairBack = `
      <circle cx="50" cy="14" r="11" fill="${hairColor}"/>
      <circle cx="50" cy="40" r="24" fill="${hairColor}"/>
    `;
  }

  // Передняя чёлка/причёска
  let hairFront = '';
  if (gender === 'male' || hairStyle === 'short') {
    hairFront = `
      <path d="M26 42 Q26 17 50 17 Q74 17 74 42 Q66 28 50 29 Q34 28 26 42 Z" fill="${hairColor}"/>
    `;
  } else {
    hairFront = `
      <path d="M26 43 Q28 18 50 18 Q72 18 74 43 Q63 31 54 27 Q43 34 26 43 Z" fill="${hairColor}"/>
    `;
  }

  const glassesSvg = hasGlasses
    ? `
      <g stroke="#5E4F48" stroke-width="1.6" fill="rgba(255,255,255,0.22)">
        <circle cx="39" cy="47" r="7"/>
        <circle cx="61" cy="47" r="7"/>
        <line x1="46" y1="47" x2="54" y2="47"/>
      </g>
    `
    : '';

  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${bgTint}"/>
      ${hairBack}
      <!-- Плечи и свитер -->
      <path d="M18 100 Q22 76 50 76 Q78 76 82 100 Z" fill="${shirtColor}"/>
      <path d="M42 74 L58 74 L56 82 Q50 85 44 82 Z" fill="${skin}"/>
      <!-- Ушки -->
      <circle cx="27" cy="49" r="4.5" fill="${skin}"/>
      <circle cx="73" cy="49" r="4.5" fill="${skin}"/>
      <!-- Лицо -->
      <rect x="28" y="24" width="44" height="49" rx="22" fill="${skin}"/>
      <!-- Румянец -->
      <ellipse cx="35" cy="54" rx="4.5" ry="2.5" fill="#F29E9D" opacity="0.5"/>
      <ellipse cx="65" cy="54" rx="4.5" ry="2.5" fill="#F29E9D" opacity="0.5"/>
      <!-- Глазки -->
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