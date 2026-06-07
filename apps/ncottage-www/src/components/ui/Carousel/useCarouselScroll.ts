import { useEffect, useRef, useState } from "react";

const EDGE_TOLERANCE = 1;
const INNER_SELECTOR = "[data-carousel-inner]";

function getStartScrollLeft(node: HTMLDivElement) {
    const inner = node.querySelector<HTMLElement>(INNER_SELECTOR);
    const firstItem = inner?.firstElementChild;
    if (!firstItem) return 0;

    const item = firstItem as HTMLElement;

    return (
        item.getBoundingClientRect().left -
        node.getBoundingClientRect().left +
        node.scrollLeft
    );
}

export function useCarouselScroll(scrollStep: number) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    useEffect(() => {
        const node = trackRef.current;
        if (!node) return;

        function update() {
            if (!node) return;

            const startScrollLeft = Math.max(0, getStartScrollLeft(node));
            const maxScrollLeft = Math.max(
                0,
                node.scrollWidth - node.clientWidth
            );

            setAtStart(node.scrollLeft <= startScrollLeft + EDGE_TOLERANCE);
            setAtEnd(node.scrollLeft >= maxScrollLeft - EDGE_TOLERANCE);
        }

        update();
        node.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);

        return () => {
            node.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    function scrollBy(direction: 1 | -1) {
        trackRef.current?.scrollBy({
            left: direction * scrollStep,
            behavior: "smooth",
        });
    }

    return { trackRef, atStart, atEnd, scrollBy };
}
