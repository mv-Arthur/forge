import Link from "next/link";
import Image from "next/image";
import type { BuiltObject } from "@/domain/project";
import { formatArea } from "@/lib/utils";
import styles from "./ProjectShowroom.module.css";

interface ProjectShowroomProps {
    objects: BuiltObject[];
}

export function ProjectShowroom({ objects }: ProjectShowroomProps) {
    return (
        <div className={styles.grid}>
            {objects.map((obj) => (
                <Link
                    key={obj.id}
                    href={obj.href}
                    className={styles.card}
                    aria-label={`Построенный объект: ${obj.title}`}
                >
                    <div className={styles.image}>
                        <Image
                            src={obj.image}
                            alt={obj.title}
                            fill
                            sizes="(max-width: 900px) 100vw, 50vw"
                            className={styles.imageInner}
                        />
                    </div>
                    <div className={styles.body}>
                        <p className={styles.eyebrow}>Построенный объект</p>
                        <h3 className={styles.title}>{obj.title}</h3>
                        <div className={styles.meta}>
                            {obj.location && (
                                <span className={styles.location}>
                                    {obj.location}
                                </span>
                            )}
                            {obj.area && (
                                <span className={styles.area}>
                                    {formatArea(obj.area)}
                                </span>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
