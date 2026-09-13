import Image from "next/image";
import type { ShowcaseDecorItem } from "@/types/catalog";

export function ProjectDetailDecor({ items }: { items: ShowcaseDecorItem[] }) {
    if (items.length === 0) return null;
    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
                <article key={item.id}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-100">
                        <Image
                            src={item.src}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="(min-width:1024px) 30vw, 100vw"
                        />
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold text-ink-950">
                        {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">
                        {item.text}
                    </p>
                </article>
            ))}
        </div>
    );
}
