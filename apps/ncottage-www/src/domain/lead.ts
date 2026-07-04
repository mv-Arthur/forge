// Контракт лида живёт в @forge/shared, чтобы фронт, прокси-route и backend
// использовали один источник правды. Реэкспорт сохраняет существующие
// импорты `@/domain/lead` без изменений.
export {
    LEAD_SOURCES,
    MIN_PHONE_DIGITS,
    countPhoneDigits,
    isValidLead,
} from "@forge/shared";
export type { LeadRequest } from "@forge/shared";
