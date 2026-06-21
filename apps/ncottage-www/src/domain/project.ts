// Доменные типы проекта живут в @forge/shared (общие с backend ncottage-api).
// Реэкспорт сохраняет существующие импорты `@/domain/project`.
export type {
    Technology,
    ProjectStyle,
    ProjectFeature,
    ProjectLivingType,
    ProjectSpecs,
    ProjectFloorPlan,
    ProjectPackage,
    ProjectOption,
    Project,
    BuiltObject,
} from "@forge/shared";
