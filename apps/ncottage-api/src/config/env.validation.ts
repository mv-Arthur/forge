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
