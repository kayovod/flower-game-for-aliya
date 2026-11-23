/**
 * js/ai.js
 * Главный фасад ИИ-модуля игры.
 * Аккумулирует и экспортирует весь функционал из подмодулей ai/
 */

// 1. Базовые сетевые вызовы ИИ, парсинг JSON и системные утилиты
export {
  callAI,
  testAiConnection,
  stripCodeFences,
  parseClientJson,
  formatApiError,
  fetchWithTimeout,
  sleep,
  isRudeText,
  formatMinutesAsTime,
  resolvePlayerGender,
  getBadgeRuleText,
  detectMentionedFlowers,
  pickRandom,
  pickUnused,
  generateProceduralNick
} from './ai/aiCore.js';

// 2. Генерация клиентов зала и системные промпты
export {
  generateRandomClient,
  generatePreorderClient,
  buildClientSystemPrompt
} from './ai/clientGenerator.js';

// 3. Соцсеть InstaFlower (посты, комменты) и переписка Direct (предзаказы, торг, фото)
export {
  evaluateInstaPost,
  generateInstaCommentReply,
  generateDirectMessage,
  generateDirectRejectionReply,
  generateDirectFollowUp,
  generatePostDeliveryClientFeedback
} from './ai/socialAi.js';

// 4. Вакансии, анкеты соискателей и живые собеседования в Direct
export {
  CANDIDATE_PROFILES,
  generateJobCandidateDm,
  generateCandidateInterviewReply,
  generateCandidateHireReaction
} from './ai/jobsAi.js';

// 5. Команда: живое общение в Direct и лавке, доставка и форс-мажоры курьера
export {
  generateEmployeeSpontaneousDm,
  generateEmployeeChatReply,
  generateCourierForceMajeure,
  resolveCourierForceMajeureReply,
  generateCourierDeliveryReport,
  generateShopEmployeeTalkReply
} from './ai/teamAi.js';

// 6. Франшиза: случайные ИИ-события и беседы на филиалах сети
export {
  generateBranchVisitEvent,
  resolveBranchEventDecision,
  generateBranchEmployeeChatReply
} from './ai/franchiseAi.js';