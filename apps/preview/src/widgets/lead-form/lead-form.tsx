import Link from "next/link";
import { CheckIcon } from "@/ui/icons";
import { LEAD_PHONE_LABEL } from "@/lib/copy";
import type { LeadFormProps } from "./lead-form.types";
import styles from "./lead-form.module.css";

export function LeadForm({
    source,
    prefill,
    ctaLabel,
    variant,
    layout = "full",
    inline = false,
    values,
    sent,
    onNameChange,
    onPhoneChange,
    onConsentChange,
    onSubmit,
}: LeadFormProps) {
    const dark = variant === "dark";

    if (sent) {
        return (
            <div data-gwd-lead className={styles.sent}>
                <span className={styles.sentIcon}>
                    <CheckIcon className={styles.icon} />
                </span>
                <div className={styles.sentCopy}>
                    <div className={styles.sentTitle}>Спасибо за заявку!</div>
                    <p className={styles.sentText}>
                        В ближайшее время с вами свяжется менеджер.
                    </p>
                </div>
            </div>
        );
    }

    const formClass =
        layout === "home" ? undefined : inline ? styles.inline : styles.stack;

    return (
        <form
            data-gwd-lead
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className={formClass}
            data-source={source}
        >
            {prefill ? (
                <input type="hidden" name="prefill" value={prefill} />
            ) : null}
            <input type="hidden" name="source" value={source} />
            {layout === "home" ? (
                <>
                    <div>
                        <label className="field-label">{LEAD_PHONE_LABEL}</label>
                        <input
                            className="field"
                            placeholder="+7"
                            type="tel"
                            value={values.phone}
                            onChange={(e) => onPhoneChange(e.target.value)}
                            required
                        />
                    </div>
                    <label className={styles.consent}>
                        <input
                            type="checkbox"
                            checked={values.consent}
                            onChange={(e) => onConsentChange(e.target.checked)}
                            className={styles.check}
                        />
                        <span>
                            Я согласен на{" "}
                            <Link href="/personal-data" className={styles.link}>
                                обработку персональных данных
                            </Link>
                        </span>
                    </label>
                    <button type="submit" className="btn btn-primary">
                        {ctaLabel}
                    </button>
                </>
            ) : (
                <>
                    <div className={styles.row}>
                        <div>
                            <label
                                className={
                                    dark
                                        ? `field-label ${styles.labelDark}`
                                        : "field-label"
                                }
                            >
                                Имя
                            </label>
                            <input
                                className={
                                    dark
                                        ? `field ${styles.fieldDark}`
                                        : "field"
                                }
                                placeholder="Иван"
                                value={values.name}
                                onChange={(e) => onNameChange(e.target.value)}
                            />
                        </div>
                        <div>
                            <label
                                className={
                                    dark
                                        ? `field-label ${styles.labelDark}`
                                        : "field-label"
                                }
                            >
                                Телефон
                            </label>
                            <input
                                className={
                                    dark
                                        ? `field ${styles.fieldDark}`
                                        : "field"
                                }
                                placeholder="+7 (___) ___-__-__"
                                type="tel"
                                value={values.phone}
                                onChange={(e) => onPhoneChange(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={`btn btn-primary btn-lg ${styles.submitWide}`}
                    >
                        {ctaLabel}
                    </button>
                    <label
                        className={`${styles.consent} ${styles.consentSm} ${
                            dark ? styles.consentDark : ""
                        }`}
                    >
                        <input
                            type="checkbox"
                            checked={values.consent}
                            onChange={(e) => onConsentChange(e.target.checked)}
                            className={styles.check}
                        />
                        <span>
                            Согласен на{" "}
                            <Link href="/personal-data" className={styles.link}>
                                обработку персональных данных
                            </Link>
                            .
                        </span>
                    </label>
                </>
            )}
        </form>
    );
}
