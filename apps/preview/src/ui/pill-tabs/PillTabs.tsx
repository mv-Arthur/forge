import styles from "./PillTabs.module.css";

export function PillTabs({
    items,
    value,
    onChange,
}: {
    items: Array<{ id: string; label: string }>;
    value: string;
    onChange: (id: string) => void;
}) {
    return (
        <div className={styles.track} role="tablist">
            {items.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    role="tab"
                    className={styles.tab}
                    aria-selected={item.id === value}
                    onClick={() => onChange(item.id)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
