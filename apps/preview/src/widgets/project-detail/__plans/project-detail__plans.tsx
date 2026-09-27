"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { PlanLayer, ProjectFloorPlan } from "@/types/catalog";
import {
    DETAIL_PLANS_CLOSE,
    DETAIL_PLANS_HEADING,
    DETAIL_PLANS_LAYER_2D,
    DETAIL_PLANS_LAYER_3D,
    DETAIL_PLANS_LAYER_WALLS,
    DETAIL_PLANS_NEXT,
    DETAIL_PLANS_NOTE,
    DETAIL_PLANS_PREV,
    DETAIL_PLANS_CUSTOMERS,
} from "@/lib/copy";
import type { ShowcaseCustomerAlts } from "@/types/catalog";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/ui/icons";
import { ProjectDetailAlts } from "../__alts/project-detail__alts";
import styles from "./project-detail__plans.module.css";

const LAYERS: { id: PlanLayer; label: string }[] = [
    { id: "2d", label: DETAIL_PLANS_LAYER_2D },
    { id: "3d", label: DETAIL_PLANS_LAYER_3D },
    { id: "walls", label: DETAIL_PLANS_LAYER_WALLS },
];

function layerOf(plan: ProjectFloorPlan): PlanLayer {
    return plan.layer ?? "2d";
}

function formatFloorArea(value: number): string {
    return `${value}м²`;
}

function PlanImage({
    plan,
    className,
    sizes,
}: {
    plan: ProjectFloorPlan;
    className: string;
    sizes?: string;
}) {
    return (
        <Image
            src={plan.url}
            alt={plan.floor}
            width={1400}
            height={1000}
            unoptimized={plan.url.startsWith("/media/")}
            className={className}
            sizes={sizes}
        />
    );
}

export function ProjectDetailPlans({
    plans,
    alts = null,
}: {
    plans: ProjectFloorPlan[];
    alts?: ShowcaseCustomerAlts | null;
}) {
    const byLayer = useMemo(() => {
        const map = new Map<PlanLayer, ProjectFloorPlan[]>();
        for (const plan of plans) {
            const layer = layerOf(plan);
            const list = map.get(layer) ?? [];
            list.push(plan);
            map.set(layer, list);
        }
        return map;
    }, [plans]);

    const available = LAYERS.filter(
        (layer) => (byLayer.get(layer.id)?.length ?? 0) > 0,
    );
    const fallback = available[0]?.id ?? "2d";
    const preferred = byLayer.has("3d") ? "3d" : fallback;
    const [layer, setLayer] = useState<PlanLayer>(preferred);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [altsOpen, setAltsOpen] = useState(false);
    const activeLayer = byLayer.has(layer) ? layer : preferred;
    const floors = byLayer.get(activeLayer) ?? [];
    const openPlan =
        openIndex !== null ? (floors[openIndex] ?? null) : null;

    useEffect(() => {
        if (openIndex === null || altsOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenIndex(null);
            if (e.key === "ArrowLeft") {
                setOpenIndex((i) =>
                    i === null ? i : (i - 1 + floors.length) % floors.length,
                );
            }
            if (e.key === "ArrowRight") {
                setOpenIndex((i) =>
                    i === null ? i : (i + 1) % floors.length,
                );
            }
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [openIndex, floors.length, altsOpen]);

    if (floors.length === 0) return null;

    const viewer =
        openPlan && openIndex !== null
            ? createPortal(
                  <div
                      className={styles.overlay}
                      role="dialog"
                      aria-modal="true"
                      aria-label={openPlan.floor}
                  >
                      <button
                          type="button"
                          className={styles.backdrop}
                          aria-label={DETAIL_PLANS_CLOSE}
                          onClick={() => setOpenIndex(null)}
                      />
                      <div className={styles.stage}>
                          <div className={styles.frame}>
                              <button
                                  type="button"
                                  className={styles.close}
                                  aria-label={DETAIL_PLANS_CLOSE}
                                  onClick={() => setOpenIndex(null)}
                              >
                                  <CloseIcon className={styles.closeIcon} />
                              </button>
                              {floors.length > 1 ? (
                                  <>
                                      <button
                                          type="button"
                                          className={`${styles.nav} ${styles.prev}`}
                                          aria-label={DETAIL_PLANS_PREV}
                                          onClick={() =>
                                              setOpenIndex(
                                                  (openIndex -
                                                      1 +
                                                      floors.length) %
                                                      floors.length,
                                              )
                                          }
                                      >
                                          <ChevronLeftIcon
                                              className={styles.navIcon}
                                          />
                                      </button>
                                      <button
                                          type="button"
                                          className={`${styles.nav} ${styles.next}`}
                                          aria-label={DETAIL_PLANS_NEXT}
                                          onClick={() =>
                                              setOpenIndex(
                                                  (openIndex + 1) %
                                                      floors.length,
                                              )
                                          }
                                      >
                                          <ChevronRightIcon
                                              className={styles.navIcon}
                                          />
                                      </button>
                                  </>
                              ) : null}
                              <PlanImage
                                  plan={openPlan}
                                  className={styles.viewerImage}
                                  sizes="90vw"
                              />
                              <div className={styles.caption}>
                                  <span className={styles.captionFloor}>
                                      {openPlan.floor}
                                  </span>
                                  {openPlan.area ? (
                                      <span className={styles.captionArea}>
                                          {formatFloorArea(openPlan.area)}
                                      </span>
                                  ) : null}
                              </div>
                              {floors.length > 1 ? (
                                  <div className={styles.thumbs}>
                                      {floors.map((plan, i) => (
                                          <button
                                              key={plan.url}
                                              type="button"
                                              className={styles.thumb}
                                              aria-current={i === openIndex}
                                              aria-label={plan.floor}
                                              onClick={() => setOpenIndex(i)}
                                          >
                                              <PlanImage
                                                  plan={plan}
                                                  className={styles.thumbImage}
                                              />
                                          </button>
                                      ))}
                                  </div>
                              ) : null}
                          </div>
                      </div>
                  </div>,
                  document.body,
              )
            : null;

    return (
        <div>
            <div className={styles.header}>
                <h2 className={styles.heading}>
                    {DETAIL_PLANS_HEADING}
                    <small className={styles.note}>{DETAIL_PLANS_NOTE}</small>
                </h2>
                {available.length > 1 ? (
                    <div className={styles.layers} role="tablist">
                        {available.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                role="tab"
                                className={styles.layer}
                                aria-selected={item.id === activeLayer}
                                onClick={() => {
                                    setLayer(item.id);
                                    setOpenIndex(null);
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                ) : null}
                {alts ? (
                    <button
                        type="button"
                        className={styles.alt}
                        onClick={() => setAltsOpen(true)}
                    >
                        {DETAIL_PLANS_CUSTOMERS}
                    </button>
                ) : null}
            </div>
            {altsOpen && alts
                ? createPortal(
                      <ProjectDetailAlts
                          alts={alts}
                          onClose={() => setAltsOpen(false)}
                      />,
                      document.body,
                  )
                : null}
            <div className={styles.view}>
                {floors.map((plan, i) => (
                    <button
                        key={`${activeLayer}-${plan.floor}-${plan.url}`}
                        type="button"
                        className={styles.floor}
                        onClick={() => setOpenIndex(i)}
                    >
                        <PlanImage plan={plan} className={styles.image} />
                        <span className={styles.label}>{plan.floor}</span>
                        {plan.area ? (
                            <span className={styles.area}>
                                {formatFloorArea(plan.area)}
                            </span>
                        ) : null}
                    </button>
                ))}
            </div>
            {viewer}
        </div>
    );
}
