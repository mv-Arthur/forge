"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    DETAIL_ALTS_BUILT,
    DETAIL_ALTS_BUILDING,
    DETAIL_ALTS_CODE,
    DETAIL_ALTS_COPIED,
    DETAIL_ALTS_FACADE_CODE,
    DETAIL_ALTS_FACADES,
    DETAIL_ALTS_FACADES_LEAD,
    DETAIL_ALTS_PLANS,
    DETAIL_ALTS_PLANS_LEAD,
    DETAIL_ALTS_TIMELAPSE,
    DETAIL_ALTS_TIMELAPSE_LEAD,
    DETAIL_PLANS_CLOSE,
} from "@/lib/copy";
import type {
    CustomerAltItem,
    CustomerAltStatus,
    ShowcaseCustomerAlts,
} from "@/types/catalog";
import { CloseIcon } from "@/ui/icons";
import styles from "./project-detail__alts.module.css";

export type Tab = "plans" | "facades" | "timelapse";

const TABS: { id: Tab; label: string; lead: string }[] = [
    { id: "plans", label: DETAIL_ALTS_PLANS, lead: DETAIL_ALTS_PLANS_LEAD },
    {
        id: "facades",
        label: DETAIL_ALTS_FACADES,
        lead: DETAIL_ALTS_FACADES_LEAD,
    },
    {
        id: "timelapse",
        label: DETAIL_ALTS_TIMELAPSE,
        lead: DETAIL_ALTS_TIMELAPSE_LEAD,
    },
];

function CopyIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden>
            <path
                fill="currentColor"
                d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
            />
        </svg>
    );
}

function statusLabel(status: CustomerAltStatus): string {
    return status === "built" ? DETAIL_ALTS_BUILT : DETAIL_ALTS_BUILDING;
}

function codeLabelFor(tab: Tab): string {
    return tab === "facades" ? DETAIL_ALTS_FACADE_CODE : DETAIL_ALTS_CODE;
}

export function ProjectDetailAlts({
    alts,
    onClose,
    initialTab = "plans",
}: {
    alts: ShowcaseCustomerAlts;
    onClose: () => void;
    initialTab?: Tab;
}) {
    const availableTabs = TABS.filter((item) => {
        if (item.id === "plans") return alts.plans.length > 0;
        if (item.id === "facades") return alts.facades.length > 0;
        return alts.timelapses.length > 0;
    });
    const startTab = availableTabs.some((item) => item.id === initialTab)
        ? initialTab
        : (availableTabs[0]?.id ?? "plans");
    const [tab, setTab] = useState<Tab>(startTab);
    const [copied, setCopied] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const tabsRef = useRef<HTMLDivElement>(null);
    const meta = TABS.find((t) => t.id === tab) ?? TABS[0];

    useEffect(() => {
        const selected = tabsRef.current?.querySelector(
            '[aria-selected="true"]'
        );
        selected?.scrollIntoView({ inline: "center", block: "nearest" });
    }, [tab]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            if (preview) {
                setPreview(null);
                return;
            }
            onClose();
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose, preview]);

    async function copyCode(code: string) {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(code);
            window.setTimeout(
                () => setCopied((c) => (c === code ? null : c)),
                1600
            );
        } catch {
            /* ignore */
        }
    }

    return (
        <div className={styles.overlay}>
            <button
                type="button"
                className={styles.backdrop}
                aria-label={DETAIL_PLANS_CLOSE}
                onClick={onClose}
            />
            <div
                className={styles.shell}
                role="dialog"
                aria-modal="true"
                aria-labelledby="alts-title"
            >
                <button
                    type="button"
                    className={styles.close}
                    aria-label={DETAIL_PLANS_CLOSE}
                    onClick={onClose}
                >
                    <CloseIcon />
                </button>
                <div className={styles.menu}>
                    <div ref={tabsRef} className={styles.tabs} role="tablist">
                        {availableTabs.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                role="tab"
                                className={styles.tab}
                                aria-selected={item.id === tab}
                                onClick={() => setTab(item.id)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.scroll}>
                    <div className={styles.intro}>
                        <h2 id="alts-title" className={styles.title}>
                            {meta.label}
                        </h2>
                        <p className={styles.lead}>{meta.lead}</p>
                    </div>
                    <div className={styles.view}>
                        {tab === "plans"
                            ? alts.plans.map((item) => (
                                  <AltCard
                                      key={item.code}
                                      item={item}
                                      codeLabel={codeLabelFor(tab)}
                                      copied={copied === item.code}
                                      onCopy={() => copyCode(item.code)}
                                      onOpen={setPreview}
                                  />
                              ))
                            : null}
                        {tab === "facades"
                            ? alts.facades.map((item) => (
                                  <AltCard
                                      key={item.code}
                                      item={item}
                                      codeLabel={codeLabelFor(tab)}
                                      copied={copied === item.code}
                                      onCopy={() => copyCode(item.code)}
                                      onOpen={setPreview}
                                  />
                              ))
                            : null}
                        {tab === "timelapse"
                            ? alts.timelapses.map((item) => (
                                  <article
                                      key={item.code}
                                      className={styles.card}
                                  >
                                      <AltHead
                                          item={item}
                                          codeLabel={codeLabelFor(tab)}
                                          copied={copied === item.code}
                                          onCopy={() => copyCode(item.code)}
                                      />
                                      <video
                                          className={styles.video}
                                          poster={item.poster}
                                          src={item.src}
                                          controls
                                          playsInline
                                      />
                                  </article>
                              ))
                            : null}
                    </div>
                </div>
            </div>
            {preview ? (
                <div className={styles.preview}>
                    <button
                        type="button"
                        className={styles.backdrop}
                        aria-label={DETAIL_PLANS_CLOSE}
                        onClick={() => setPreview(null)}
                    />
                    <Image
                        src={preview}
                        alt=""
                        width={1400}
                        height={1000}
                        unoptimized={preview.startsWith("/media/")}
                        className={styles.previewImg}
                    />
                </div>
            ) : null}
        </div>
    );
}

function AltHead({
    item,
    codeLabel,
    copied,
    onCopy,
}: {
    item: { code: string; title: string; status: CustomerAltStatus };
    codeLabel: string;
    copied: boolean;
    onCopy: () => void;
}) {
    return (
        <div className={styles.head}>
            <h3 className={styles.name}>{item.title}</h3>
            <span className={styles.badge} data-status={item.status}>
                {statusLabel(item.status)}
            </span>
            <span className={styles.code}>
                {codeLabel}: {item.code}
            </span>
            <button
                type="button"
                className={styles.copy}
                onClick={onCopy}
                aria-label={`${codeLabel} ${item.code}`}
            >
                <CopyIcon />
                {copied ? (
                    <span className={styles.copied}>{DETAIL_ALTS_COPIED}</span>
                ) : null}
            </button>
        </div>
    );
}

function AltCard({
    item,
    codeLabel,
    copied,
    onCopy,
    onOpen,
}: {
    item: CustomerAltItem;
    codeLabel: string;
    copied: boolean;
    onCopy: () => void;
    onOpen: (src: string) => void;
}) {
    return (
        <article className={styles.card}>
            <AltHead
                item={item}
                codeLabel={codeLabel}
                copied={copied}
                onCopy={onCopy}
            />
            <div className={styles.images} data-count={item.images.length}>
                {item.images.map((src) => (
                    <button
                        key={src}
                        type="button"
                        className={styles.thumb}
                        onClick={() => onOpen(src)}
                    >
                        <Image
                            src={src}
                            alt=""
                            width={600}
                            height={420}
                            unoptimized={src.startsWith("/media/")}
                            className={styles.img}
                        />
                    </button>
                ))}
            </div>
        </article>
    );
}
