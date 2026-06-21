import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name);

    async onModuleInit() {
        // Не валим старт сервиса, если БД пока недоступна: health-эндпоинт
        // должен отвечать и без подключения. Реальные запросы упадут явно.
        try {
            await this.$connect();
            this.logger.log("Connected to database");
        } catch (error) {
            this.logger.warn(
                `Database connection failed at startup: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
}
