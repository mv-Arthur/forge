// /                    src/app/page.tsx
// /catalog             src/app/catalog/page.tsx
// /catalog/drawings    src/app/catalog/drawings/page.tsx
// /projects            src/app/projects/page.tsx
// /projects/[slug]     src/app/projects/[slug]/page.tsx
// /works               src/app/works/page.tsx
// /works#stages        src/app/works/page.tsx
// /works#map           src/app/works/page.tsx
// /works/gallery       src/app/works/gallery/page.tsx
// /works/stages        src/app/works/stages/page.tsx
// /works/stages/[tech] src/app/works/stages/[tech]/page.tsx
// /works/stages/[tech]/[section]/[subsection]
//                      src/app/works/stages/[tech]/[section]/[subsection]/page.tsx
// /about               src/app/about/page.tsx
// /about/[...slug]     src/app/about/[...slug]/page.tsx
// /contacts            src/app/contacts/page.tsx
// /contacts/[...slug]  src/app/contacts/[...slug]/page.tsx
// /services            src/app/services/page.tsx
// /services/individual-planning
//                      src/app/services/individual-planning/page.tsx
// /services/site-survey
//                      src/app/services/site-survey/page.tsx
// /services/engineering/heating
//                      src/app/services/engineering/heating/page.tsx
// /services/engineering/external
//                      src/app/services/engineering/external/page.tsx
// /services/engineering/ventilation
//                      src/app/services/engineering/ventilation/page.tsx
// /services/engineering/plumbing
//                      src/app/services/engineering/plumbing/page.tsx
// /services/construction/wood
//                      src/app/services/construction/wood/page.tsx
// /services/construction/stone
//                      src/app/services/construction/stone/page.tsx
// /services/finishing/paint
//                      src/app/services/finishing/paint/page.tsx
// /services/finishing/exterior
//                      src/app/services/finishing/exterior/page.tsx
// /services/finishing/facade
//                      src/app/services/finishing/facade/page.tsx
// /services/[...slug]  src/app/services/[...slug]/page.tsx
// /technology          src/app/technology/page.tsx
// /technology/faq      src/app/technology/faq/page.tsx
// /technology/heat-calc src/app/technology/heat-calc/page.tsx
// /technology/methods  src/app/technology/methods/page.tsx
// /technology/[...slug] src/app/technology/[...slug]/page.tsx
// /offer               src/app/offer/page.tsx
// /privacy             src/app/privacy/page.tsx
// /personal-data       src/app/personal-data/page.tsx
// /media/[...path]     src/app/media/[...path]/route.ts

function withQuery(
    path: string,
    query: Record<string, string | undefined>
): string {
    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value) sp.set(key, value);
    }
    const q = sp.toString();
    return q ? `${path}?${q}` : path;
}

export const routes = {
    home: "/",
    lead: "/#lead",
    catalog: "/catalog",
    catalogDrawings: "/catalog/drawings",
    projects(query?: {
        kind?: string;
        tech?: string;
        line?: string;
        collection?: string;
        areaMax?: string;
    }) {
        return query ? withQuery("/projects", query) : "/projects";
    },
    project(slug: string) {
        return `/projects/${slug}`;
    },
    works: "/works",
    worksGallery(query?: {
        tech?: string;
        location?: string;
        status?: string;
    }) {
        return query ? withQuery("/works/gallery", query) : "/works/gallery";
    },
    worksStagesHub: "/works/stages",
    worksMap: "/works#map",
    worksStages(tech: string, section?: string, subsection?: string) {
        if (section && subsection) {
            return `/works/stages/${tech}/${section}/${subsection}`;
        }
        return `/works/stages/${tech}`;
    },
    about: "/about",
    aboutPage(slug: string) {
        return `/about/${slug}`;
    },
    contacts: "/contacts",
    contactsOffice(slug: string) {
        return `/contacts/${slug}`;
    },
    services: "/services",
    service(slug: string) {
        return `/services/${slug}`;
    },
    technology: "/technology",
    technologyPage(slug: string) {
        return `/technology/${slug}`;
    },
    offer: "/offer",
    privacy: "/privacy",
    personalData: "/personal-data",
};

export function isCatalogNav(pathname: string) {
    return (
        pathname === routes.catalog ||
        pathname.startsWith(`${routes.catalog}/`) ||
        pathname === routes.projects() ||
        pathname.startsWith(`${routes.projects()}/`)
    );
}
