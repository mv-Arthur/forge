import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AdminsModule } from "./admins/admins.module.js";
import { AppController } from "./app.controller.js";
import { AuthModule } from "./auth/auth.module.js";
import { BlogModule } from "./blog/blog.module.js";
import { BuiltObjectsModule } from "./built-objects/built-objects.module.js";
import { CertificatesModule } from "./certificates/certificates.module.js";
import { FaqModule } from "./faq/faq.module.js";
import { validateEnv } from "./config/env.validation.js";
import { LeadsModule } from "./leads/leads.module.js";
import { MediaModule } from "./media/media.module.js";
import { PagesModule } from "./pages/pages.module.js";
import { PartnersModule } from "./partners/partners.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { ProjectSelectionsModule } from "./project-selections/project-selections.module.js";
import { ProjectsModule } from "./projects/projects.module.js";
import { PromosModule } from "./promos/promos.module.js";
import { RevalidateModule } from "./revalidate/revalidate.module.js";
import { ReviewsModule } from "./reviews/reviews.module.js";
import { ServiceScenariosModule } from "./service-scenarios/service-scenarios.module.js";
import { ServicesModule } from "./services/services.module.js";
import { SettingsModule } from "./settings/settings.module.js";
import { VacanciesModule } from "./vacancies/vacancies.module.js";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: validateEnv,
        }),
        // Конфиг троттлинга; включается точечно через ThrottlerGuard на публичных
        // эндпоинтах (POST /leads, POST /auth/login). Глобально не вешаем, чтобы
        // не ограничивать SSR/ISR-фетчи www, идущие с одного IP.
        ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
        PrismaModule,
        RevalidateModule,
        AdminsModule,
        AuthModule,
        BlogModule,
        BuiltObjectsModule,
        CertificatesModule,
        FaqModule,
        LeadsModule,
        MediaModule,
        PagesModule,
        PartnersModule,
        ProjectSelectionsModule,
        ProjectsModule,
        PromosModule,
        ReviewsModule,
        ServicesModule,
        ServiceScenariosModule,
        SettingsModule,
        VacanciesModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
