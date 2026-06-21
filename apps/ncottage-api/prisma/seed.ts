import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Prisma, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import type { Project } from "@forge/shared";

const prisma = new PrismaClient();

async function seedAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
        console.log("ADMIN_EMAIL/ADMIN_PASSWORD not set, skipping admin seed");
        return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.admin.upsert({
        where: { email },
        create: { email, passwordHash },
        update: { passwordHash },
    });
    console.log(`Seeded admin ${email}`);
}

function toJson(
    value: unknown
): Prisma.InputJsonValue | typeof Prisma.JsonNull {
    return value == null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
}

function toData(p: Project): Prisma.ProjectUncheckedCreateInput {
    return {
        slug: p.slug,
        name: p.name,
        technology: p.technology,
        area: p.area,
        floors: p.floors,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        price: p.price,
        image: p.image,
        style: p.style,
        livingType: p.livingType,
        featured: p.featured,
        description: p.description,
        pdfUrl: p.pdfUrl ?? null,
        images: p.images,
        features: p.features,
        relatedObjectIds: p.relatedObjectIds ?? [],
        specs: toJson(p.specs),
        floorPlans: toJson(p.floorPlans),
        packages: toJson(p.packages),
        options: toJson(p.options),
    };
}

async function main() {
    const file = resolve(__dirname, "seed-data/projects.json");
    const projects = JSON.parse(readFileSync(file, "utf-8")) as Project[];

    for (const project of projects) {
        const data = toData(project);
        await prisma.project.upsert({
            where: { slug: project.slug },
            create: data,
            update: data,
        });
    }

    console.log(`Seeded ${projects.length} projects`);

    await seedAdmin();
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
