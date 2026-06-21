import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
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
    // Первый суперюзер — всегда роль admin (миграция существующей учётки).
    await prisma.admin.upsert({
        where: { email },
        create: { email, passwordHash, role: "admin" },
        update: { passwordHash, role: "admin" },
    });
    console.log(`Seeded admin ${email} (role: admin)`);
}

function scalars(p: Project) {
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
        features: p.features,
        specsDimensions: p.specs.dimensions,
        specsRoofType: p.specs.roofType,
        specsFoundation: p.specs.foundation,
        specsWallMaterial: p.specs.wallMaterial,
        specsBuildTime: p.specs.buildTime,
    };
}

function childrenCreate(p: Project) {
    return {
        images: {
            create: p.images.map((url, order) => ({ url, order })),
        },
        relations: {
            create: (p.relatedObjectIds ?? []).map((relatedSlug, order) => ({
                relatedSlug,
                order,
            })),
        },
        floorPlans: {
            create: (p.floorPlans ?? []).map((fp, order) => ({
                label: fp.label,
                image: fp.image,
                area: fp.area ?? null,
                order,
                rooms: {
                    create: (fp.rooms ?? []).map((r, roomOrder) => ({
                        name: r.name,
                        area: r.area,
                        order: roomOrder,
                    })),
                },
            })),
        },
        packages: {
            create: (p.packages ?? []).map((pkg, order) => ({
                name: pkg.name,
                price: pkg.price,
                tagline: pkg.tagline ?? null,
                highlighted: pkg.highlighted ?? false,
                order,
                includes: {
                    create: pkg.includes.map((inc, incOrder) => ({
                        label: inc.label,
                        value: inc.value,
                        order: incOrder,
                    })),
                },
            })),
        },
        options: {
            create: (p.options ?? []).map((o, order) => ({
                label: o.label,
                price: o.price,
                note: o.note ?? null,
                order,
            })),
        },
    };
}

async function main() {
    const file = resolve(__dirname, "seed-data/projects.json");
    const projects = JSON.parse(readFileSync(file, "utf-8")) as Project[];

    for (const project of projects) {
        const children = childrenCreate(project);
        await prisma.project.upsert({
            where: { slug: project.slug },
            create: { ...scalars(project), ...children },
            update: {
                ...scalars(project),
                images: { deleteMany: {}, ...children.images },
                relations: { deleteMany: {}, ...children.relations },
                floorPlans: { deleteMany: {}, ...children.floorPlans },
                packages: { deleteMany: {}, ...children.packages },
                options: { deleteMany: {}, ...children.options },
            },
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
