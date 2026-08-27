import styles from "./Container.module.css";


interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function Container({ children, className }: ContainerProps) {
    return (
        <div
            className={
                className
                    ? `${styles.container} ${className}`
                    : styles.container
            }
        >
            {children}
        </div>
    );
}
