import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import type {
    Article,
    BuiltObject,
    Certificate,
    FaqItem,
    Partner,
    Project,
    Promo,
    Review,
    Vacancy,
} from "@forge/shared";

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

async function seedReviews() {
    const file = resolve(__dirname, "seed-data/reviews.json");
    const items = JSON.parse(readFileSync(file, "utf-8")) as Review[];
    for (const item of items) {
        const data = {
            id: item.id,
            author: item.author,
            date: item.date,
            text: item.text,
            type: item.type ?? null,
            image: item.image ?? null,
            videoUrl: item.videoUrl ?? null,
            featured: item.featured,
        };
        await prisma.review.upsert({
            where: { id: item.id },
            create: data,
            update: data,
        });
    }
    console.log(`Seeded ${items.length} reviews`);
}

async function seedPromos() {
    const file = resolve(__dirname, "seed-data/promos.json");
    const promos = JSON.parse(readFileSync(file, "utf-8")) as Promo[];
    for (const promo of promos) {
        await prisma.promo.upsert({
            where: { slug: promo.slug },
            create: promo,
            update: promo,
        });
    }
    console.log(`Seeded ${promos.length} promos`);
}

async function seedBuiltObjects() {
    const file = resolve(__dirname, "seed-data/built-objects.json");
    const items = JSON.parse(readFileSync(file, "utf-8")) as BuiltObject[];
    for (const item of items) {
        const data = {
            slug: item.id,
            title: item.title,
            image: item.image,
            href: item.href,
            area: item.area ?? null,
            location: item.location ?? null,
            coordsLat: item.coords?.lat ?? null,
            coordsLng: item.coords?.lng ?? null,
        };
        await prisma.builtObject.upsert({
            where: { slug: item.id },
            create: data,
            update: data,
        });
    }
    console.log(`Seeded ${items.length} built objects`);
}

async function seedPartners() {
    const file = resolve(__dirname, "seed-data/partners.json");
    const items = JSON.parse(readFileSync(file, "utf-8")) as Partner[];
    for (const item of items) {
        await prisma.partner.upsert({
            where: { slug: item.slug },
            create: { ...item, href: item.href ?? null },
            update: { ...item, href: item.href ?? null },
        });
    }
    console.log(`Seeded ${items.length} partners`);
}

async function seedCertificates() {
    const file = resolve(__dirname, "seed-data/certificates.json");
    const items = JSON.parse(readFileSync(file, "utf-8")) as Certificate[];
    for (const item of items) {
        await prisma.certificate.upsert({
            where: { slug: item.slug },
            create: item,
            update: item,
        });
    }
    console.log(`Seeded ${items.length} certificates`);
}

async function seedFaq() {
    const file = resolve(__dirname, "seed-data/faq.json");
    const items = JSON.parse(readFileSync(file, "utf-8")) as FaqItem[];
    for (const item of items) {
        await prisma.faqItem.upsert({
            where: { slug: item.slug },
            create: item,
            update: item,
        });
    }
    console.log(`Seeded ${items.length} faq items`);
}

async function seedVacancies() {
    const file = resolve(__dirname, "seed-data/vacancies.json");
    const vacancies = JSON.parse(readFileSync(file, "utf-8")) as Vacancy[];
    for (const vacancy of vacancies) {
        await prisma.vacancy.upsert({
            where: { slug: vacancy.slug },
            create: vacancy,
            update: vacancy,
        });
    }
    console.log(`Seeded ${vacancies.length} vacancies`);
}

async function seedSettings() {
    const file = resolve(__dirname, "seed-data/settings.json");
    const settings = JSON.parse(readFileSync(file, "utf-8")) as Record<
        string,
        unknown
    >;
    for (const [key, value] of Object.entries(settings)) {
        await prisma.setting.upsert({
            where: { key },
            create: { key, value: value as object },
            update: { value: value as object },
        });
    }
    console.log(`Seeded ${Object.keys(settings).length} settings`);
}

async function seedArticles() {
    const file = resolve(__dirname, "seed-data/articles.json");
    const articles = JSON.parse(readFileSync(file, "utf-8")) as Article[];
    for (const article of articles) {
        const data = {
            slug: article.slug,
            title: article.title,
            description: article.description,
            category: article.category,
            date: article.date,
            readTime: article.readTime,
            heroNote: article.heroNote,
            highlights: article.highlights,
            sections: article.sections as object,
            checklist: article.checklist,
            relatedSlugs: article.relatedSlugs,
        };
        await prisma.article.upsert({
            where: { slug: article.slug },
            create: data,
            update: data,
        });
    }
    console.log(`Seeded ${articles.length} articles`);
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

    await seedArticles();
    await seedReviews();
    await seedPromos();
    await seedBuiltObjects();
    await seedPartners();
    await seedCertificates();
    await seedFaq();
    await seedVacancies();
    await seedSettings();
    await seedAdmin();
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
