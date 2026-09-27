import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller.js";
import { AuthModule } from "./auth/auth.module.js";
import { validateEnv } from "./config/env.validation.js";
import { FilesModule } from "./files/files.module.js";
import { MediaModule } from "./media/media.module.js";
import { PagesModule } from "./pages/pages.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: validateEnv,
        }),
        PrismaModule,
        AuthModule,
        MediaModule,
        FilesModule,
        PagesModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
