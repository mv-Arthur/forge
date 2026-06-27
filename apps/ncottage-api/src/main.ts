import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import multipart from "@fastify/multipart";
import { AppModule } from "./app.module.js";
import { AllExceptionsFilter } from "./common/all-exceptions.filter.js";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter()
    );

    await app.register(multipart, {
        limits: { fileSize: 15 * 1024 * 1024, files: 1 },
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        })
    );

    app.useGlobalFilters(new AllExceptionsFilter());

    const config = app.get(ConfigService);
    const corsOrigin = config.get<string>("CORS_ORIGIN");
    if (corsOrigin) {
        app.enableCors({
            origin: corsOrigin.split(",").map((o) => o.trim()),
        });
    }

    const port = config.get<number>("PORT") ?? 3002;
    const host = "0.0.0.0";
    await app.listen({ port, host });
    console.log(`🏗️  ncottage-api is running on: http://localhost:${port}`);
}

bootstrap().then();
