import { plainToInstance, Type } from "class-transformer";
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
    MinLength,
    Validate,
    ValidatorConstraint,
    type ValidatorConstraintInterface,
    validateSync,
} from "class-validator";

enum NodeEnv {
    development = "development",
    production = "production",
    test = "test",
}

const WEAK_SECRETS = [
    "change-me",
    "changeme",
    "local-dev-secret-change-me",
    "secret",
    "your-secret",
    "jwt-secret",
];

@ValidatorConstraint({ name: "strongSecret", async: false })
class StrongSecretConstraint implements ValidatorConstraintInterface {
    validate(value: unknown): boolean {
        if (typeof value !== "string") return false;
        const normalized = value.trim().toLowerCase();
        return !WEAK_SECRETS.includes(normalized);
    }

    defaultMessage(): string {
        return "JWT_SECRET must not be a known placeholder value";
    }
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
    PORT = 4010;

    @IsString()
    DATABASE_URL!: string;

    @IsOptional()
    @IsString()
    CORS_ORIGIN?: string;

    @IsOptional()
    @IsString()
    MEDIA_ROOT?: string;

    @IsString()
    @MinLength(32, {
        message: "JWT_SECRET must be at least 32 characters long",
    })
    @Validate(StrongSecretConstraint)
    JWT_SECRET!: string;

    @IsOptional()
    @IsString()
    JWT_EXPIRES_IN = "12h";

    @IsOptional()
    @IsString()
    APP_ORIGIN = "http://localhost:4011";

    @IsOptional()
    @IsString()
    MAIL_HOST = "127.0.0.1";

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(65535)
    MAIL_PORT = 1025;

    @IsOptional()
    @IsString()
    MAIL_FROM = "noreply@ncottage.local";

    @IsOptional()
    @IsString()
    MAIL_USER?: string;

    @IsOptional()
    @IsString()
    MAIL_PASS?: string;
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
