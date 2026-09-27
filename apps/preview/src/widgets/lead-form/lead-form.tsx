import Link from "next/link";
import { CheckIcon } from "@/ui/icons";
import { LEAD_PHONE_LABEL, WORKS_VISIT_LEAD, WORKS_VISIT_SENT } from "@/lib/copy";
import { routes } from "@/lib/routes";
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
    onEmailChange,
    onConsentChange,
    onSubmit,
}: LeadFormProps) {
    const dark = variant === "dark";
    const email = values.email ?? "";
    const triple = layout === "works" || layout === "unique";
    const dialog = layout === "dialog";
    const emailReady = triple || dialog;
    const worksReady =
        values.name.trim().length > 1 &&
        values.phone.replace(/\D/g, "").length >= 11 &&
        (!emailReady ||
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) &&
        values.consent;

    if (sent) {
        if (layout === "works") {
            return (
                <div data-gwd-lead className={styles.worksSent}>
                    <div className={styles.worksSentTitle}>{WORKS_VISIT_SENT}</div>
                    <p className={styles.worksSentText}>{WORKS_VISIT_LEAD}</p>
                </div>
            );
        }
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
        layout === "home"
            ? undefined
            : triple
              ? styles.works
              : dialog
                ? styles.popup
                : inline
                  ? styles.inline
                  : styles.stack;

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
            {dialog ? (
                <>
                    <div>
                        <label className="field-label">Имя</label>
                        <input
                            className="field"
                            placeholder="Имя Фамилия"
                            value={values.name}
                            onChange={(e) => onNameChange(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="field-label">Телефон</label>
                        <input
                            className="field"
                            placeholder="+7(123)456-7890"
                            type="tel"
                            value={values.phone}
                            onChange={(e) => onPhoneChange(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="field-label">E-mail</label>
                        <input
                            className="field"
                            placeholder="example@gmail.com"
                            type="email"
                            value={email}
                            onChange={(e) => onEmailChange?.(e.target.value)}
                            required
                        />
                    </div>
                    <label className={`${styles.consent} ${styles.consentSm}`}>
                        <input
                            type="checkbox"
                            checked={values.consent}
                            onChange={(e) => onConsentChange(e.target.checked)}
                            className={styles.check}
                        />
                        <span>
                            Я согласен на{" "}
                            <Link href={routes.personalData} className={styles.link}>
                                обработку персональных данных
                            </Link>
                        </span>
                    </label>
                    <button
                        type="submit"
                        className={`btn btn-primary ${styles.popupSubmit}`}
                        disabled={!worksReady}
                    >
                        {ctaLabel}
                    </button>
                </>
            ) : triple ? (
                <>
                    <div className={styles.worksFields}>
                        <div>
                            <label className="field-label">Имя</label>
                            <input
                                className="field"
                                placeholder="Имя Фамилия"
                                value={values.name}
                                onChange={(e) => onNameChange(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="field-label">Телефон</label>
                            <input
                                className="field"
                                placeholder="+7(123)456-7890"
                                type="tel"
                                value={values.phone}
                                onChange={(e) => onPhoneChange(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="field-label">E-Mail</label>
                            <input
                                className="field"
                                placeholder="example@gmail.com"
                                type="email"
                                value={email}
                                onChange={(e) => onEmailChange?.(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={`btn btn-primary ${styles.worksSubmit}`}
                        disabled={!worksReady}
                    >
                        {ctaLabel}
                    </button>
                    <label
                        className={`${styles.consent} ${styles.consentSm} ${styles.worksConsent}`}
                    >
                        <input
                            type="checkbox"
                            checked={values.consent}
                            onChange={(e) => onConsentChange(e.target.checked)}
                            className={styles.check}
                        />
                        <span>
                            Я согласен на{" "}
                            <Link href={routes.personalData} className={styles.link}>
                                обработку персональных данных
                            </Link>
                        </span>
                    </label>
                </>
            ) : layout === "home" ? (
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
                            <Link href={routes.personalData} className={styles.link}>
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
                            <Link href={routes.personalData} className={styles.link}>
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
