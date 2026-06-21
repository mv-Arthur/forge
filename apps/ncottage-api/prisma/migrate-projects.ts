// One-shot data migration: legacy JSON/array columns -> normalized tables.
// Runs in the "expand" window (both old and new columns present). Idempotent.
// Usage: pnpm --filter @forge/ncottage-api exec tsx prisma/migrate-projects.ts
import { PrismaClient } from "@prisma/client";
import type {
    ProjectFloorPlan,
    ProjectOption,
    ProjectPackage,
    ProjectSpecs,
} from "@forge/shared";

const prisma = new PrismaClient();

async function main() {
    const projects = await prisma.project.findMany();
    let migrated = 0;

    for (const p of projects) {
        const specs = (p.specs ?? {}) as unknown as Partial<ProjectSpecs>;
        const floorPlans = (p.floorPlans ??
            []) as unknown as ProjectFloorPlan[];
        const packages = (p.packages ?? []) as unknown as ProjectPackage[];
        const options = (p.options ?? []) as unknown as ProjectOption[];

        // Idempotent: clear any previously migrated children.
        await prisma.projectImage.deleteMany({ where: { projectId: p.id } });
        await prisma.projectFloorPlan.deleteMany({
            where: { projectId: p.id },
        });
        await prisma.projectPackage.deleteMany({ where: { projectId: p.id } });
        await prisma.projectOption.deleteMany({ where: { projectId: p.id } });
        await prisma.projectRelation.deleteMany({ where: { projectId: p.id } });

        await prisma.project.update({
            where: { id: p.id },
            data: {
                specsDimensions: specs.dimensions ?? "",
                specsRoofType: specs.roofType ?? "",
                specsFoundation: specs.foundation ?? "",
                specsWallMaterial: specs.wallMaterial ?? "",
                specsBuildTime: specs.buildTime ?? "",
                imageItems: {
                    create: p.images.map((url, order) => ({ url, order })),
                },
                relations: {
                    create: p.relatedObjectIds.map((relatedSlug, order) => ({
                        relatedSlug,
                        order,
                    })),
                },
                optionItems: {
                    create: options.map((o, order) => ({
                        label: o.label,
                        price: o.price,
                        note: o.note ?? null,
                        order,
                    })),
                },
                floorPlanItems: {
                    create: floorPlans.map((fp, order) => ({
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
                packageItems: {
                    create: packages.map((pkg, order) => ({
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
            },
        });
        migrated++;
    }

    console.log(`Migrated ${migrated} projects to the normalized model`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
