"use client";

import { useReducer } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import styles from "./CalculatorWizard.module.css";

interface CalcState {
    step: number;
    floors: number | null;
    area: number;
    foundation: string | null;
    roof: string | null;
    budget: string | null;
    timeline: string | null;
    name: string;
    phone: string;
}

type CalcAction =
    | { type: "SET_FIELD"; field: keyof CalcState; value: unknown }
    | { type: "NEXT" }
    | { type: "PREV" }
    | { type: "SUBMIT" };

const INITIAL: CalcState = {
    step: 0,
    floors: null,
    area: 150,
    foundation: null,
    roof: null,
    budget: null,
    timeline: null,
    name: "",
    phone: "",
};

const TOTAL_STEPS = 7;

function reducer(state: CalcState, action: CalcAction): CalcState {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "NEXT":
            return { ...state, step: Math.min(state.step + 1, TOTAL_STEPS) };
        case "PREV":
            return { ...state, step: Math.max(state.step - 1, 0) };
        case "SUBMIT":
            console.log("Calculator submitted:", state);
            return { ...state, step: TOTAL_STEPS };
        default:
            return state;
    }
}

const FLOOR_OPTIONS = [1, 2, 3];
const FOUNDATION_OPTIONS = [
    "Ленточный",
    "Монолитная плита",
    "Свайно-винтовой",
    "Столбчатый",
];
const ROOF_OPTIONS = [
    "Двускатная",
    "Вальмовая",
    "Плоская",
    "Многоскатная",
];
const BUDGET_OPTIONS = [
    "до 3 млн",
    "3–5 млн",
    "5–8 млн",
    "8–12 млн",
    "от 12 млн",
];
const TIMELINE_OPTIONS = [
    "В ближайший месяц",
    "Через 1–3 месяца",
    "Через 3–6 месяцев",
    "Пока планирую",
];

export function CalculatorWizard() {
    const [state, dispatch] = useReducer(reducer, INITIAL);

    function setField(field: keyof CalcState, value: unknown) {
        dispatch({ type: "SET_FIELD", field, value });
    }

    function renderStep() {
        switch (state.step) {
            case 0:
                return (
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>
                            Сколько этажей?
                        </h3>
                        <div className={styles.options}>
                            {FLOOR_OPTIONS.map((f) => (
                                <button
                                    key={f}
                                    className={`${styles.option} ${state.floors === f ? styles.optionActive : ""}`}
                                    onClick={() => setField("floors", f)}
                                >
                                    {f} {f === 1 ? "этаж" : "этажа"}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>
                            Желаемая площадь: {state.area} м²
                        </h3>
                        <input
                            type="range"
                            min={50}
                            max={500}
                            step={10}
                            value={state.area}
                            onChange={(e) =>
                                setField("area", Number(e.target.value))
                            }
                            className={styles.range}
                        />
                        <div className={styles.rangeLabels}>
                            <span>50 м²</span>
                            <span>500 м²</span>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>Тип фундамента</h3>
                        <div className={styles.options}>
                            {FOUNDATION_OPTIONS.map((f) => (
                                <button
                                    key={f}
                                    className={`${styles.option} ${state.foundation === f ? styles.optionActive : ""}`}
                                    onClick={() =>
                                        setField("foundation", f)
                                    }
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>Тип кровли</h3>
                        <div className={styles.options}>
                            {ROOF_OPTIONS.map((r) => (
                                <button
                                    key={r}
                                    className={`${styles.option} ${state.roof === r ? styles.optionActive : ""}`}
                                    onClick={() => setField("roof", r)}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>
                            Бюджет строительства
                        </h3>
                        <div className={styles.options}>
                            {BUDGET_OPTIONS.map((b) => (
                                <button
                                    key={b}
                                    className={`${styles.option} ${state.budget === b ? styles.optionActive : ""}`}
                                    onClick={() => setField("budget", b)}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>
                            Сроки начала строительства
                        </h3>
                        <div className={styles.options}>
                            {TIMELINE_OPTIONS.map((t) => (
                                <button
                                    key={t}
                                    className={`${styles.option} ${state.timeline === t ? styles.optionActive : ""}`}
                                    onClick={() => setField("timeline", t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>
                            Контактные данные
                        </h3>
                        <div className={styles.inputs}>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Ваше имя"
                                value={state.name}
                                onChange={(e) =>
                                    setField("name", e.target.value)
                                }
                            />
                            <input
                                className={styles.input}
                                type="tel"
                                placeholder="Телефон"
                                value={state.phone}
                                onChange={(e) =>
                                    setField("phone", e.target.value)
                                }
                            />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.success}>
                            <p className={styles.successTitle}>
                                Заявка отправлена
                            </p>
                            <p className={styles.successText}>
                                Мы рассчитаем стоимость и свяжемся с вами.
                            </p>
                        </div>
                    </div>
                );
        }
    }

    const isLast = state.step === 6;
    const isDone = state.step >= TOTAL_STEPS;

    return (
        <section className={styles.section}>
            <Container>
                <SectionHeading
                    label="Калькулятор"
                    title="Рассчитайте стоимость строительства"
                    description="Ответьте на 7 вопросов и получите предварительный расчёт."
                />
                <div className={styles.wizard}>
                    {/* Progress */}
                    {!isDone && (
                        <div className={styles.progress}>
                            <div
                                className={styles.progressBar}
                                style={{
                                    width: `${((state.step + 1) / TOTAL_STEPS) * 100}%`,
                                }}
                            />
                        </div>
                    )}

                    {!isDone && (
                        <p className={styles.stepCounter}>
                            Шаг {state.step + 1} из {TOTAL_STEPS}
                        </p>
                    )}

                    {renderStep()}

                    {!isDone && (
                        <div className={styles.actions}>
                            {state.step > 0 && (
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        dispatch({ type: "PREV" })
                                    }
                                >
                                    Назад
                                </Button>
                            )}
                            {isLast ? (
                                <Button
                                    onClick={() =>
                                        dispatch({ type: "SUBMIT" })
                                    }
                                >
                                    Отправить
                                </Button>
                            ) : (
                                <Button
                                    onClick={() =>
                                        dispatch({ type: "NEXT" })
                                    }
                                >
                                    Далее
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
}
