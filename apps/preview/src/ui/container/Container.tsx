import styles from "./Container.module.css";


interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    narrow?: boolean;
}

export function Container({ children, className, narrow }: ContainerProps) {
    const names = [styles.container];
    if (narrow) names.push(styles.narrow);
    if (className) names.push(className);
    return <div className={names.join(" ")}>{children}</div>;
}
