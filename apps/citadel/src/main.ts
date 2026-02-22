import { NestFactory } from '@nestjs/core';
import type {
    NestFastifyApplication} from '@nestjs/platform-fastify';
import {
    FastifyAdapter
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module.js';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    const port = Number(process.env.PORT) || 3001;
    const host = '0.0.0.0';

    await app.listen({ port, host });

    console.log(`🏰 Citadel is running on: http://localhost:${port}`);
}

bootstrap().then();
