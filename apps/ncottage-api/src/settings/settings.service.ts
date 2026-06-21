import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Prisma, type Setting as SettingRow } from "@prisma/client";
import { type Setting, SETTING_KEYS, type SettingKey } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { RevalidateService } from "../revalidate/revalidate.service.js";
import { SETTING_SCHEMAS } from "./settings.schemas.js";

function isSettingKey(key: string): key is SettingKey {
    return (SETTING_KEYS as readonly string[]).includes(key);
}

function toDomain(row: SettingRow): Setting {
    return {
        key: row.key as SettingKey,
        value: row.value as unknown as Setting["value"],
        updatedAt: row.updatedAt.toISOString(),
    };
}

@Injectable()
export class SettingsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly revalidate: RevalidateService
    ) {}

    async getAll(): Promise<Setting[]> {
        const rows = await this.prisma.setting.findMany();
        return rows.map(toDomain);
    }

    async get(key: string): Promise<Setting> {
        if (!isSettingKey(key)) {
            throw new NotFoundException(`Unknown setting: ${key}`);
        }
        const row = await this.prisma.setting.findUnique({ where: { key } });
        if (!row) {
            throw new NotFoundException(`Setting not found: ${key}`);
        }
        return toDomain(row);
    }

    async upsert(key: string, value: unknown): Promise<Setting> {
        if (!isSettingKey(key)) {
            throw new NotFoundException(`Unknown setting: ${key}`);
        }
        const parsed = SETTING_SCHEMAS[key].safeParse(value);
        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.issues
                    .map((i) => `${i.path.join(".")}: ${i.message}`)
                    .join("; ")
            );
        }
        const json = parsed.data as Prisma.InputJsonValue;
        const row = await this.prisma.setting.upsert({
            where: { key },
            create: { key, value: json },
            update: { value: json },
        });
        this.revalidate.revalidate({
            tags: ["settings", `settings:${key}`],
        });
        return toDomain(row);
    }
}
