"use client";

import { useMemo, useReducer } from "react";
import { Container } from "@/components/ui/Container";
import type { QuizSectionContent, QuizStep } from "@/lib/constants";
import styles from "./QuizSection.module.css";

export type QuizAnswer = string | number | null;

export type QuizData = {
    values: Record<string, QuizAnswer>;
    name: string;
    phone: string;
};

interface QuizSectionProps {
    title: QuizSectionContent["title"];
    speaker: QuizSectionContent["speaker"];
    steps: QuizSectionContent["steps"];
    prevLabel: QuizSectionContent["prevLabel"];
    nextLabel: QuizSectionContent["nextLabel"];
    submitLabel: QuizSectionContent["submitLabel"];
    lastStepLabel: QuizSectionContent["lastStepLabel"];
    successTitle: QuizSectionContent["successTitle"];
    successText: QuizSectionContent["successText"];
    onSubmit?: (data: QuizData) => void;
}

interface QuizState {
    step: number;
    values: Record<string, QuizAnswer>;
    name: string;
    phone: string;
    submitted: boolean;
}

type QuizAction =
    | { type: "SET_VALUE"; fieldId: string; value: QuizAnswer }
    | { type: "SET_NAME"; value: string }
    | { type: "SET_PHONE"; value: string }
    | { type: "NEXT"; max: number }
    | { type: "PREV" }
    | { type: "SUBMIT" };

function createInitialState(steps: QuizStep[]): QuizState {
    const values: Record<string, QuizAnswer> = {};
    for (const step of steps) {
        if (step.kind === "range") {
            values[step.fieldId] = step.default;
        } else if (step.kind !== "contact") {
            values[step.fieldId] = null;
        }
    }
    return {
        step: 0,
        values,
        name: "",
        phone: "",
        submitted: false,
    };
}

function isStepComplete(step: QuizStep, state: QuizState): boolean {
    switch (step.kind) {
        case "image-choice":
        case "text-radio": {
            const value = state.values[step.fieldId];
            return typeof value === "string" && value.length > 0;
        }
        case "range":
            return true;
        case "contact":
            return state.name.trim() !== "" && state.phone.trim() !== "";
    }
}

function reducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
        case "SET_VALUE":
            return {
                ...state,
                values: { ...state.values, [action.fieldId]: action.value },
            };
        case "SET_NAME":
            return { ...state, name: action.value };
        case "SET_PHONE":
            return { ...state, phone: action.value };
        case "NEXT":
            return { ...state, step: Math.min(state.step + 1, action.max) };
        case "PREV":
            return { ...state, step: Math.max(state.step - 1, 0) };
        case "SUBMIT":
            return { ...state, submitted: true };
    }
}

export function QuizSection({
    title,
    speaker,
    steps,
    prevLabel,
    nextLabel,
    submitLabel,
    lastStepLabel,
    successTitle,
    successText,
    onSubmit,
}: QuizSectionProps) {
    const [state, dispatch] = useReducer(reducer, steps, createInitialState);

    const totalSteps = steps.length;
    const questionCount = steps.filter((s) => s.kind !== "contact").length;
    const currentStep = steps[state.step];
    const isLast = state.step === totalSteps - 1;
    const canAdvance = isStepComplete(currentStep, state);

    const preloadImages = useMemo(() => {
        const urls: string[] = [];
        for (const s of steps) {
            if (s.kind === "image-choice") {
                for (const option of s.options) {
                    if (option.image) urls.push(option.image);
                }
            }
        }
        return urls;
    }, [steps]);

    function handleSubmit() {
        onSubmit?.({
            values: state.values,
            name: state.name,
            phone: state.phone,
        });
        dispatch({ type: "SUBMIT" });
    }

    function renderContent(step: QuizStep) {
        switch (step.kind) {
            case "image-choice": {
                const selected = state.values[step.fieldId];
                return (
                    <>
                        <label className={styles.fieldLabel}>
                            {step.label}
                        </label>
                        <ul className={styles.imageChoices}>
                            {step.options.map((option) => {
                                const isSelected = selected === option.value;
                                return (
                                    <li
                                        key={option.value}
                                        className={
                                            isSelected
                                                ? `${styles.imageChoice} ${styles.imageChoiceSelected}`
                                                : styles.imageChoice
                                        }
                                    >
                                        <label
                                            className={styles.imageChoiceLabel}
                                        >
                                            {option.image ? (
                                                <span
                                                    className={
                                                        styles.imageChoiceImage
                                                    }
                                                >
                                                    <img
                                                        src={option.image}
                                                        alt={option.label}
                                                        decoding="sync"
                                                    />
                                                </span>
                                            ) : (
                                                <span
                                                    className={
                                                        styles.imageChoiceImagePlaceholder
                                                    }
                                                    aria-hidden="true"
                                                >
                                                    ?
                                                </span>
                                            )}
                                            <input
                                                type="radio"
                                                name={step.fieldId}
                                                value={option.value}
                                                checked={isSelected}
                                                onChange={() =>
                                                    dispatch({
                                                        type: "SET_VALUE",
                                                        fieldId: step.fieldId,
                                                        value: option.value,
                                                    })
                                                }
                                                className={styles.srOnly}
                                            />
                                            <span
                                                className={
                                                    styles.imageChoiceText
                                                }
                                            >
                                                {option.label}
                                            </span>
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                );
            }
            case "range": {
                const value = Number(
                    state.values[step.fieldId] ?? step.default
                );
                const percent =
                    ((value - step.min) / (step.max - step.min)) * 100;
                return (
                    <>
                        <label className={styles.fieldLabel}>
                            {step.label}
                        </label>
                        <input
                            type="range"
                            className={styles.range}
                            min={step.min}
                            max={step.max}
                            step={step.step}
                            value={value}
                            onChange={(e) =>
                                dispatch({
                                    type: "SET_VALUE",
                                    fieldId: step.fieldId,
                                    value: Number(e.target.value),
                                })
                            }
                            style={{
                                backgroundSize: `${percent}% 100%`,
                            }}
                        />
                        <div className={styles.rangeHint}>
                            <b>{value}</b> {step.unit}
                        </div>
                    </>
                );
            }
            case "text-radio": {
                const selected = state.values[step.fieldId];
                return (
                    <>
                        <label className={styles.fieldLabel}>
                            {step.label}
                            {step.required && (
                                <span className={styles.required}>*</span>
                            )}
                        </label>
                        <ul className={styles.textRadios}>
                            {step.options.map((option) => (
                                <li key={option.value}>
                                    <label className={styles.textRadioLabel}>
                                        <input
                                            type="radio"
                                            name={step.fieldId}
                                            value={option.value}
                                            checked={selected === option.value}
                                            required={step.required}
                                            onChange={() =>
                                                dispatch({
                                                    type: "SET_VALUE",
                                                    fieldId: step.fieldId,
                                                    value: option.value,
                                                })
                                            }
                                        />
                                        <span>{option.label}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </>
                );
            }
            case "contact": {
                return (
                    <>
                        <p className={styles.contactHeading}>{step.heading}</p>
                        <div className={styles.contactInputs}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder={step.namePlaceholder}
                                aria-label={step.nameLabel}
                                value={state.name}
                                required
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_NAME",
                                        value: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="tel"
                                className={styles.input}
                                placeholder={step.phonePlaceholder}
                                aria-label={step.phoneLabel}
                                value={state.phone}
                                required
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_PHONE",
                                        value: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </>
                );
            }
        }
    }

    function renderSidebar(step: QuizStep) {
        const stepNumber = state.step + 1;
        return (
            <aside className={styles.sidebar}>
                <div className={styles.speaker}>
                    <div className={styles.speakerInfo}>
                        <span className={styles.speakerName}>
                            {speaker.name}
                        </span>
                        <span className={styles.speakerRole}>
                            {speaker.role}
                        </span>
                    </div>
                    <img
                        src={speaker.avatar}
                        alt={speaker.name}
                        className={styles.speakerAvatar}
                    />
                </div>
                <div className={styles.cloud}>{step.cloud}</div>
                <div className={styles.stepCounter}>
                    {step.kind === "contact" ? (
                        <span className={styles.stepCounterFinal}>
                            {lastStepLabel}
                        </span>
                    ) : (
                        <>
                            <span className={styles.stepCounterNumber}>
                                {stepNumber}
                            </span>
                            <span className={styles.stepCounterLabel}>
                                шаг из {questionCount}
                            </span>
                        </>
                    )}
                </div>
            </aside>
        );
    }

    if (state.submitted) {
        return (
            <section className={styles.section}>
                <Container>
                    <h2 className={styles.title}>{title}</h2>
                    <div className={styles.success}>
                        <p className={styles.successTitle}>{successTitle}</p>
                        <p className={styles.successText}>{successText}</p>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div aria-hidden="true" className={styles.preload}>
                {preloadImages.map((src) => (
                    <img key={src} src={src} alt="" />
                ))}
            </div>
            <Container>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.quiz}>
                    <div className={styles.progressBarWrap}>
                        <div
                            className={styles.progressBar}
                            style={{
                                width: `${((state.step + 1) / totalSteps) * 100}%`,
                            }}
                        />
                    </div>
                    <div className={styles.layout}>
                        <div className={styles.main}>
                            {renderContent(currentStep)}
                            <div className={styles.actions}>
                                {state.step > 0 && (
                                    <button
                                        type="button"
                                        className={`${styles.navButton} ${styles.navPrev}`}
                                        onClick={() =>
                                            dispatch({ type: "PREV" })
                                        }
                                    >
                                        {prevLabel}
                                    </button>
                                )}
                                {isLast ? (
                                    <button
                                        type="button"
                                        className={`${styles.navButton} ${styles.navSubmit}`}
                                        onClick={handleSubmit}
                                        disabled={!canAdvance}
                                    >
                                        {submitLabel}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className={`${styles.navButton} ${styles.navNext}`}
                                        onClick={() =>
                                            dispatch({
                                                type: "NEXT",
                                                max: totalSteps - 1,
                                            })
                                        }
                                        disabled={!canAdvance}
                                    >
                                        {nextLabel}
                                    </button>
                                )}
                            </div>
                        </div>
                        {renderSidebar(currentStep)}
                    </div>
                </div>
            </Container>
        </section>
    );
}
