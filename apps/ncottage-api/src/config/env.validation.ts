import { plainToInstance, Type } from "class-transformer";
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
    validateSync,
} from "class-validator";

enum NodeEnv {
    development = "development",
    production = "production",
    test = "test",
}

class EnvVars {
    @IsOptional()
    @IsEnum(NodeEnv)
    NODE_ENV: NodeEnv = NodeEnv.development;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(65535)
    PORT = 3002;

    @IsString()
    DATABASE_URL!: string;

    @IsOptional()
    @IsString()
    CORS_ORIGIN?: string;

    @IsString()
    JWT_SECRET!: string;

    @IsOptional()
    @IsString()
    JWT_EXPIRES_IN = "12h";

    // S3-совместимое хранилище медиа (локально — MinIO).
    @IsString()
    S3_ENDPOINT!: string;

    @IsOptional()
    @IsString()
    S3_REGION = "us-east-1";

    @IsString()
    S3_BUCKET!: string;

    @IsString()
    S3_ACCESS_KEY!: string;

    @IsString()
    S3_SECRET_KEY!: string;

    // Публичная база для построения URL файлов. Пусто — берётся S3_ENDPOINT.
    @IsOptional()
    @IsString()
    S3_PUBLIC_URL?: string;

    // Path-style адресация (нужна MinIO). "false" — virtual-hosted (AWS S3).
    @IsOptional()
    @IsString()
    S3_FORCE_PATH_STYLE = "true";

    // Доставка лидов (опционально; провайдер активен только при заданных кредах).
    @IsOptional()
    @IsString()
    TELEGRAM_BOT_TOKEN?: string;

    @IsOptional()
    @IsString()
    TELEGRAM_CHAT_ID?: string;

    @IsOptional()
    @IsString()
    SMTP_HOST?: string;

    @IsOptional()
    @IsString()
    SMTP_PORT?: string;

    @IsOptional()
    @IsString()
    SMTP_SECURE?: string;

    @IsOptional()
    @IsString()
    SMTP_USER?: string;

    @IsOptional()
    @IsString()
    SMTP_PASS?: string;

    @IsOptional()
    @IsString()
    SMTP_FROM?: string;

    @IsOptional()
    @IsString()
    SMTP_TO?: string;

    // On-demand ISR публичного сайта (опционально).
    @IsOptional()
    @IsString()
    WWW_REVALIDATE_URL?: string;

    @IsOptional()
    @IsString()
    WWW_REVALIDATE_SECRET?: string;
}

export function validateEnv(config: Record<string, unknown>): EnvVars {
    const validated = plainToInstance(EnvVars, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validated, {
        skipMissingProperties: false,
    });
    if (errors.length > 0) {
        throw new Error(
            `Invalid environment variables:\n${errors
                .map((e) => Object.values(e.constraints ?? {}).join(", "))
                .join("\n")}`
        );
    }
    return validated;
}
