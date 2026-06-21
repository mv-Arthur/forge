import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller.js";
import { validateEnv } from "./config/env.validation.js";
import { LeadsModule } from "./leads/leads.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: validateEnv,
        }),
        PrismaModule,
        LeadsModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
