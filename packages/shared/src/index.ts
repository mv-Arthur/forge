export { renderTemplate } from "./template.js";
export type { TemplateValue, TemplateValues } from "./template.js";
export {
    LEAD_SOURCES,
    MIN_PHONE_DIGITS,
    countPhoneDigits,
    isValidLead,
} from "./lead.js";
export type { LeadSource, LeadRequest } from "./lead.js";
export {
    TECHNOLOGIES,
    PROJECT_STYLES,
    PROJECT_FEATURES,
    PROJECT_LIVING_TYPES,
} from "./project.js";
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
} from "./project.js";
export type { Media } from "./media.js";
export { ROLES } from "./admin.js";
export type { Role, AdminUser } from "./admin.js";
export { SETTING_KEYS } from "./settings.js";
export type {
    SettingKey,
    Setting,
    SettingValues,
    Navigation,
    NavItem,
    NavSubItem,
    Footer,
    FooterLink,
    FooterOffice,
    Contacts,
    ContactPhone,
    ContactAddress,
    ContactSocial,
    BlogPage,
} from "./settings.js";
export type { Article, ArticleSection } from "./blog.js";
export type { Promo } from "./promo.js";
export type { Vacancy } from "./vacancy.js";
export type { FaqItem } from "./faq.js";
export type { Certificate } from "./certificate.js";
export type { Partner } from "./partner.js";
export type { Review } from "./review.js";
export { SELECTION_GROUPS, matchesSelection } from "./project-selection.js";
export type {
    SelectionGroup,
    SelectionFilter,
    ProjectSelection,
} from "./project-selection.js";
export { PAGE_KEYS, PAGE_SECTION_TYPES } from "./page.js";
export type {
    PageKey,
    PageSectionType,
    PageSectionDataMap,
    PageSection,
    Page,
    PageSummary,
    CardItem,
    ValueLabel,
    LabelValue,
    PageLink,
    SectionHeading,
    AboutHeroData,
    ProductionHeroData,
    FinanceHeroData,
    ContactsHeroData,
    WorksHeroData,
    GuaranteeHeroData,
    LegalHeroData,
    SectionHeadingData,
    CardGridData,
    ValueListData,
    StringListData,
    BulletSectionsData,
    RequisitesTableData,
    LeadFormData,
    TeamData,
    TimelineData,
    CtaLinksData,
    LocationCardsData,
    WorksMapData,
    HomeSectionHeading,
    HomeHeroData,
    ProjectPickerData,
    CatalogSectionData,
    PullQuoteData,
    WorksTeaserData,
    StepsSectionData,
    GeographyData,
    ReviewsCarouselData,
    FeaturedProjectData,
    HomeGuaranteeIcon,
    GuaranteeCardsData,
    FaqListData,
    HomeContactData,
} from "./page.js";
