"use client";

import Link from "next/link";

type ServiceCtaAction = "request" | "call";

interface ServiceCtaLinkProps {
    href: string;
    className?: string;
    serviceSlug: string;
    serviceTitle: string;
    action: ServiceCtaAction;
    placement: string;
    children: string;
}

type AnalyticsWindow = Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (
        command: "event",
        eventName: string,
        params: Record<string, unknown>
    ) => void;
};

function isInternalHref(href: string) {
    return href.startsWith("/") || href.startsWith("#");
}

function trackServiceCta({
    href,
    serviceSlug,
    serviceTitle,
    action,
    placement,
}: Omit<ServiceCtaLinkProps, "className" | "children">) {
    const eventName = "service_cta_click";
    const payload = {
        serviceSlug,
        serviceTitle,
        action,
        placement,
        href,
    };
    const analyticsWindow = window as AnalyticsWindow;

    analyticsWindow.dataLayer?.push({ event: eventName, ...payload });
    analyticsWindow.gtag?.("event", eventName, payload);
    analyticsWindow.dispatchEvent(
        new CustomEvent(eventName, { detail: payload })
    );
}

export function ServiceCtaLink({
    href,
    className,
    serviceSlug,
    serviceTitle,
    action,
    placement,
    children,
}: ServiceCtaLinkProps) {
    const analyticsAttrs = {
        "data-analytics-event": "service_cta_click",
        "data-analytics-service": serviceSlug,
        "data-analytics-action": action,
        "data-analytics-placement": placement,
    };
    const handleClick = () => {
        trackServiceCta({
            href,
            serviceSlug,
            serviceTitle,
            action,
            placement,
        });
    };

    if (isInternalHref(href)) {
        return (
            <Link
                className={className}
                href={href}
                onClick={handleClick}
                {...analyticsAttrs}
            >
                {children}
            </Link>
        );
    }

    return (
        <a
            className={className}
            href={href}
            onClick={handleClick}
            {...analyticsAttrs}
        >
            {children}
        </a>
    );
}
