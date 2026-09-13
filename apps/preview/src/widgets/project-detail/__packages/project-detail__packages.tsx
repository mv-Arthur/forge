"use client";

import { useState } from "react";
import type {
    MergedProject,
    ProjectMaterialVariant,
    Technology,
} from "@/types/catalog";
import {
    formatPrice,
    formatTechnologyBrand,
    formatMonthlyShort,
    formatMillions,
} from "@/lib/format";
import { ShieldIcon } from "@/ui/icons";
import { LeadForm } from "@/widgets/lead-form/lead-form";
import styles from "./project-detail__packages.module.css";

interface Props {
    project: MergedProject;
}

export function ProjectDetailPackages({ project }: Props) {
    const [activeTech, setActiveTech] = useState<Technology>(
        project.variants[0]?.technology ?? "gas_concrete",
    );
    const [activePkg, setActivePkg] = useState(1);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [consent, setConsent] = useState(true);
    const [sent, setSent] = useState(false);
    const activeVariant: ProjectMaterialVariant | undefined =
        project.variants.find((v) => v.technology === activeTech) ??
        project.variants[0];

    if (!activeVariant) return null;

    const activePackage =
        activeVariant.packages[activePkg] ?? activeVariant.packages[0];

    return (
        <div className={styles.stack}>
            <div>
                <div className={styles.headRow}>
                    <div>
                        <div className="eyebrow">Материал стен</div>
                        <h3 className={styles.title}>Из чего построить</h3>
                    </div>
                    {project.variants.length > 1 ? (
                        <div className={styles.hint}>Цена зависит от материала</div>
                    ) : null}
                </div>
                <div className={styles.techs}>
                    {project.variants.map((v) => {
                        const isActive = v.technology === activeTech;
                        return (
                            <button
                                key={v.technology}
                                type="button"
                                onClick={() => setActiveTech(v.technology)}
                                className={`${styles.tech} ${isActive ? styles.techOn : ""}`}
                            >
                                <div className={styles.techName}>
                                    {formatTechnologyBrand(v.technology)}
                                </div>
                                <div className={styles.techLabel}>Под ключ от</div>
                                <div className={styles.techPrice}>
                                    {formatMillions(v.priceFrom)}
                                </div>
                                <div className={styles.techMonth}>
                                    от {formatMonthlyShort(v.priceFrom)}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div id="chto-vhodit" className={styles.box}>
                <div className={styles.boxHead}>
                    <div className={styles.boxHeadRow}>
                        <div>
                            <div className="eyebrow">Комплектации</div>
                            <h3 className={styles.title}>Комплектации и цена</h3>
                        </div>
                        <div className={styles.boxHint}>Всё прописано в договоре</div>
                    </div>
                </div>

                <div className={styles.pkgs}>
                    {activeVariant.packages.map((pkg, i) => {
                        const isSelected = i === activePkg;
                        return (
                            <button
                                key={pkg.name}
                                type="button"
                                onClick={() => setActivePkg(i)}
                                className={`${styles.pkg} ${isSelected ? styles.pkgOn : ""}`}
                            >
                                <div className={styles.pkgName}>{pkg.name}</div>
                                <div className={styles.pkgPriceRow}>
                                    <span className={styles.pkgPrice}>
                                        {formatPrice(pkg.price)}
                                    </span>
                                </div>
                                <div className={styles.pkgMonth}>
                                    {formatMonthlyShort(pkg.price)} в ипотеку
                                </div>
                                <div className={styles.pkgPick}>
                                    {isSelected ? "Выбрано" : "Выбрать"}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className={styles.estimate}>
                    <div className={styles.estimateHead}>
                        <div>
                            <div className="eyebrow">Смета</div>
                            <div className={styles.estimateName}>
                                {activePackage.name} ·{" "}
                                {formatTechnologyBrand(activeVariant.technology)}
                            </div>
                        </div>
                        <div className={styles.estimateRight}>
                            <div className={styles.estimateLabel}>Стоимость</div>
                            <div className={styles.estimateSum}>
                                {formatPrice(activePackage.price)}
                            </div>
                        </div>
                    </div>
                    <div className={styles.totals}>
                        <div className={styles.tile}>
                            <div className={styles.estimateLabel}>
                                Итого «под ключ»
                            </div>
                            <div className={styles.tileSum}>
                                {formatPrice(activePackage.price)}
                            </div>
                            <div className={styles.tileNote}>
                                Ипотека от {formatMonthlyShort(activePackage.price)} ·
                                6% на 20 лет
                            </div>
                        </div>
                        <div className={styles.tile}>
                            <ShieldIcon className={styles.shield} />
                            <div className={styles.tileTitle}>Гарантия 7 лет</div>
                            <div className={styles.tileNote}>
                                Договор с фикс. сметой
                            </div>
                        </div>
                    </div>
                    <div className={styles.formBox}>
                        <div className={styles.formTitle}>
                            Отправить смету на «
                            {formatTechnologyBrand(activeVariant.technology)}» ·{" "}
                            {activePackage.name}
                        </div>
                        <p className={styles.formLead}>
                            Пришлём смету в мессенджер.
                        </p>
                        <div className={styles.form}>
                            <LeadForm
                                source="project-calc"
                                prefill={`Смета: ${project.displayName} · ${formatTechnologyBrand(activeVariant.technology)} · ${activePackage.name} · ${formatPrice(activePackage.price)}`}
                                ctaLabel="Получить смету"
                                variant="light"
                                inline
                                values={{ name, phone, consent }}
                                sent={sent}
                                onNameChange={setName}
                                onPhoneChange={setPhone}
                                onConsentChange={setConsent}
                                onSubmit={() => {
                                    if (!phone || !consent) return;
                                    setSent(true);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
