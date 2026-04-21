"use client";

import { useReducer } from "react";
import { Container } from "@/components/ui/Container";
import type { QuizSectionContent, QuizStep } from "@/lib/constants";
import styles from "./QuizSection.module.css";

export type QuizAnswer = string | number | null;

export type QuizData = {
    values: Record<string, QuizAnswer>;
    consultation: Record<string, boolean>;
    name: string;
    phone: string;
};

interface QuizSectionProps {
    title: QuizSectionContent["title"];
    speaker: QuizSectionContent["speaker"];
    steps: QuizSectionContent["steps"];
    consultationLabel: QuizSectionContent["consultationLabel"];
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
    consultation: Record<string, boolean>;
    name: string;
    phone: string;
    submitted: boolean;
}

type QuizAction =
    | { type: "SET_VALUE"; fieldId: string; value: QuizAnswer }
    | { type: "TOGGLE_CONSULTATION"; fieldId: string }
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
        consultation: {},
        name: "",
        phone: "",
        submitted: false,
    };
}

function reducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
        case "SET_VALUE":
            return {
                ...state,
                values: { ...state.values, [action.fieldId]: action.value },
            };
        case "TOGGLE_CONSULTATION":
            return {
                ...state,
                consultation: {
                    ...state.consultation,
                    [action.fieldId]: !state.consultation[action.fieldId],
                },
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

function formatPercent(current: number, total: number) {
    return `${Math.round((current / total) * 100)}%`;
}

export function QuizSection({
    title,
    speaker,
    steps,
    consultationLabel,
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

    function handleSubmit() {
        onSubmit?.({
            values: state.values,
            consultation: state.consultation,
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
                                            <span
                                                className={
                                                    styles.imageChoiceImage
                                                }
                                            >
                                                <img
                                                    src={option.image}
                                                    alt={option.label}
                                                />
                                            </span>
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
                        {step.showConsultation && (
                            <label className={styles.consultation}>
                                <input
                                    type="checkbox"
                                    checked={Boolean(
                                        state.consultation[step.fieldId]
                                    )}
                                    onChange={() =>
                                        dispatch({
                                            type: "TOGGLE_CONSULTATION",
                                            fieldId: step.fieldId,
                                        })
                                    }
                                />
                                <span>{consultationLabel}</span>
                            </label>
                        )}
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
                        <span className={styles.stepCounterText}>
                            {lastStepLabel}
                        </span>
                    ) : (
                        <>
                            <span className={styles.stepCounterText}>
                                {stepNumber} шаг
                            </span>
                            <span className={styles.stepCounterText}>
                                из {questionCount}
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
            <Container>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.quiz}>
                    <div className={styles.progress}>
                        <span className={styles.progressLabel}>
                            {formatPercent(state.step, totalSteps - 1)}
                        </span>
                        <span className={styles.progressSep}> - </span>
                        <span className={styles.progressSteps}>
                            Step {state.step + 1} of {totalSteps}
                        </span>
                        <div className={styles.progressBarWrap}>
                            <div
                                className={styles.progressBar}
                                style={{
                                    width: `${((state.step + 1) / totalSteps) * 100}%`,
                                }}
                            />
                        </div>
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
