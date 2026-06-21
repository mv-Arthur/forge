import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

export function Button({
    children,
    variant = "primary",
    size = "md",
    className,
    ...props
}: ButtonProps) {
    const cls = [styles.button, styles[variant], styles[size], className]
        .filter(Boolean)
        .join(" ");

    return (
        <button className={cls} {...props}>
            {children}
        </button>
    );
}
