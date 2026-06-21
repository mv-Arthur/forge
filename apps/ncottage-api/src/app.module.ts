import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AdminsModule } from "./admins/admins.module.js";
import { AppController } from "./app.controller.js";
import { AuthModule } from "./auth/auth.module.js";
import { validateEnv } from "./config/env.validation.js";
import { LeadsModule } from "./leads/leads.module.js";
import { MediaModule } from "./media/media.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { ProjectsModule } from "./projects/projects.module.js";
import { RevalidateModule } from "./revalidate/revalidate.module.js";
import { SettingsModule } from "./settings/settings.module.js";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: validateEnv,
        }),
        PrismaModule,
        RevalidateModule,
        AdminsModule,
        AuthModule,
        LeadsModule,
        MediaModule,
        ProjectsModule,
        SettingsModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
