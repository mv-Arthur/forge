"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { ShowcaseCustomerAlts, ShowcaseVideo } from "@/types/catalog";
import { ProjectDetailAlts } from "../__alts/project-detail__alts";
import {
    DETAIL_VIDEO_CLOSE,
    DETAIL_VIDEO_PLAY,
    DETAIL_VIDEO_REVIEW,
    DETAIL_VIDEO_REVIEW_LEAD,
    DETAIL_VIDEO_REVIEW_NOTE,
    DETAIL_VIDEO_REVIEW_NOTE_LINK,
    DETAIL_VIDEO_TIMELAPSE,
    DETAIL_VIDEO_TIMELAPSE_BADGE,
    DETAIL_VIDEO_TIMELAPSE_BADGE_SUB,
    DETAIL_VIDEO_TIMELAPSE_LEAD,
    DETAIL_VIDEO_TIMELAPSE_NOTE,
    DETAIL_VIDEOS_HEADING,
} from "@/lib/copy";
import { routes } from "@/lib/routes";
import { CloseIcon, PlayCircleIcon } from "@/ui/icons";
import styles from "./project-detail__videos.module.css";

export function ProjectDetailVideos({
    videos,
    projectName,
    alts = null,
}: {
    videos: ShowcaseVideo[];
    projectName: string;
    alts?: ShowcaseCustomerAlts | null;
}) {
    const [open, setOpen] = useState<ShowcaseVideo | null>(null);
    const [altsOpen, setAltsOpen] = useState(false);
    const hasTimelapseAlts = Boolean(alts?.timelapses.length);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(null);
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (videos.length === 0) return null;

    const dialog =
        open && typeof document !== "undefined"
            ? createPortal(
                  <div
                      className={styles.viewer}
                      role="dialog"
                      aria-modal="true"
                      aria-label={labelFor(open.kind, projectName).title}
                  >
                      <button
                          type="button"
                          className={styles.backdrop}
                          aria-label={DETAIL_VIDEO_CLOSE}
                          onClick={() => setOpen(null)}
                      />
                      <button
                          type="button"
                          className={styles.close}
                          aria-label={DETAIL_VIDEO_CLOSE}
                          onClick={() => setOpen(null)}
                      >
                          <CloseIcon className={styles.closeIcon} />
                      </button>
                      <video
                          className={styles.player}
                          src={open.src}
                          poster={open.poster}
                          controls
                          autoPlay
                          playsInline
                      />
                  </div>,
                  document.body
              )
            : null;

    return (
        <div>
            <h2 className={styles.heading}>{DETAIL_VIDEOS_HEADING}</h2>
            <div className={styles.row}>
                {videos.map((video) => {
                    const copy = labelFor(video.kind, projectName);
                    return (
                        <article
                            key={video.kind}
                            className={styles.item}
                            data-kind={video.kind}
                        >
                            <button
                                type="button"
                                className={styles.preview}
                                aria-label={`${DETAIL_VIDEO_PLAY}: ${copy.title}`}
                                onClick={() => {
                                    if (
                                        video.kind === "timelapse" &&
                                        hasTimelapseAlts
                                    ) {
                                        setAltsOpen(true);
                                        return;
                                    }
                                    setOpen(video);
                                }}
                            >
                                <Image
                                    src={video.poster}
                                    alt=""
                                    fill
                                    unoptimized={video.poster.startsWith(
                                        "/media/"
                                    )}
                                    className={styles.poster}
                                    sizes="(min-width:768px) 28vw, 100vw"
                                />
                                {video.kind === "timelapse" ? (
                                    <span className={styles.brand} aria-hidden>
                                        <span className={styles.brandTitle}>
                                            {DETAIL_VIDEO_TIMELAPSE_BADGE}
                                        </span>
                                        <span className={styles.brandSub}>
                                            {DETAIL_VIDEO_TIMELAPSE_BADGE_SUB}
                                        </span>
                                    </span>
                                ) : null}
                                <PlayCircleIcon className={styles.play} />
                            </button>
                            <h3 className={styles.title}>{copy.title}</h3>
                            <p className={styles.lead}>{copy.lead}</p>
                            <p className={styles.note}>
                                {copy.note}{" "}
                                {copy.href ? (
                                    <Link href={copy.href}>{copy.link}</Link>
                                ) : null}
                            </p>
                        </article>
                    );
                })}
            </div>
            {dialog}
            {altsOpen && alts
                ? createPortal(
                      <ProjectDetailAlts
                          alts={alts}
                          initialTab="timelapse"
                          onClose={() => setAltsOpen(false)}
                      />,
                      document.body
                  )
                : null}
        </div>
    );
}

function labelFor(kind: ShowcaseVideo["kind"], projectName: string) {
    if (kind === "timelapse") {
        return {
            title: DETAIL_VIDEO_TIMELAPSE,
            lead: DETAIL_VIDEO_TIMELAPSE_LEAD,
            note: DETAIL_VIDEO_TIMELAPSE_NOTE,
            href: undefined,
            link: undefined,
        };
    }
    return {
        title: DETAIL_VIDEO_REVIEW,
        lead: `${DETAIL_VIDEO_REVIEW_LEAD} ${projectName}`,
        note: DETAIL_VIDEO_REVIEW_NOTE,
        href: routes.about,
        link: DETAIL_VIDEO_REVIEW_NOTE_LINK,
    };
}
