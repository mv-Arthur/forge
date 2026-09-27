import {
    DETAIL_CALC_CTA,
    DETAIL_CALC_LEAD,
    DETAIL_CALC_TITLE,
} from "@/lib/copy";
import styles from "./project-detail-calc.module.css";

function ThermometerIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.59967 11.5496C6.84844 11.8808 6.78162 12.351 6.45043 12.5997C5.41646 13.3764 4.75 14.6104 4.75 16.0004C4.75 18.3476 6.65279 20.2504 9 20.2504C11.3472 20.2504 13.25 18.3476 13.25 16.0004C13.25 14.6104 12.5835 13.3764 11.5496 12.5997C11.2184 12.351 11.1516 11.8808 11.4003 11.5496C11.6491 11.2184 12.1192 11.1516 12.4504 11.4004C13.8454 12.4481 14.75 14.1187 14.75 16.0004C14.75 19.176 12.1756 21.7504 9 21.7504C5.82436 21.7504 3.25 19.176 3.25 16.0004C3.25 14.1187 4.15464 12.4481 5.54957 11.4004C5.88076 11.1516 6.35091 11.2184 6.59967 11.5496Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.25 3C5.25 2.58579 5.58579 2.25 6 2.25H12C12.4142 2.25 12.75 2.58579 12.75 3V12C12.75 12.4142 12.4142 12.75 12 12.75C11.5858 12.75 11.25 12.4142 11.25 12V3.75H6.75V12C6.75 12.4142 6.41421 12.75 6 12.75C5.58579 12.75 5.25 12.4142 5.25 12V3Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.25 3C11.25 2.58579 11.5858 2.25 12 2.25L14 2.25C14.4142 2.25 14.75 2.58579 14.75 3C14.75 3.41421 14.4142 3.75 14 3.75L12 3.75C11.5858 3.75 11.25 3.41421 11.25 3Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.25 6C11.25 5.58579 11.5858 5.25 12 5.25L14 5.25C14.4142 5.25 14.75 5.58579 14.75 6C14.75 6.41421 14.4142 6.75 14 6.75L12 6.75C11.5858 6.75 11.25 6.41421 11.25 6Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.25 9C11.25 8.58579 11.5858 8.25 12 8.25H14C14.4142 8.25 14.75 8.58579 14.75 9C14.75 9.41421 14.4142 9.75 14 9.75H12C11.5858 9.75 11.25 9.41421 11.25 9Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 3.75C18.3096 3.75 17.75 4.30964 17.75 5C17.75 5.69036 18.3096 6.25 19 6.25C19.6904 6.25 20.25 5.69036 20.25 5C20.25 4.30964 19.6904 3.75 19 3.75ZM16.25 5C16.25 3.48122 17.4812 2.25 19 2.25C20.5188 2.25 21.75 3.48122 21.75 5C21.75 6.51878 20.5188 7.75 19 7.75C17.4812 7.75 16.25 6.51878 16.25 5Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 10.25C9.41421 10.25 9.75 10.5858 9.75 11V13.3535C10.9043 13.68 11.75 14.7412 11.75 16C11.75 17.5188 10.5188 18.75 9 18.75C7.48122 18.75 6.25 17.5188 6.25 16C6.25 14.7412 7.09575 13.68 8.25 13.3535V11C8.25 10.5858 8.58579 10.25 9 10.25ZM9 14.75C8.30964 14.75 7.75 15.3096 7.75 16C7.75 16.6904 8.30964 17.25 9 17.25C9.69036 17.25 10.25 16.6904 10.25 16C10.25 15.3096 9.69036 14.75 9 14.75Z"
                fill="white"
            />
        </svg>
    );
}

export function ProjectDetailCalc({ onCta }: { onCta: () => void }) {
    return (
        <div className={styles.root}>
            <div className={styles.text}>
                <span className={styles.icon}>
                    <ThermometerIcon />
                </span>
                <h3 className={styles.title}>{DETAIL_CALC_TITLE}</h3>
                <p className={styles.lead}>{DETAIL_CALC_LEAD}</p>
            </div>
            <button type="button" className={styles.btn} onClick={onCta}>
                {DETAIL_CALC_CTA}
            </button>
        </div>
    );
}
