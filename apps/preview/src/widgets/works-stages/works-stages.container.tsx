"use client";

import { useMemo, useState } from "react";
import type { WorksStagePayload } from "@/types/catalog";
import { WorksStagesChips } from "./__chips/works-stages__chips";
import { WorksStagesGallery } from "./__gallery/works-stages__gallery";
import { WorksStagesLightbox } from "./__lightbox/works-stages__lightbox";
import { WorksStagesMenu } from "./__menu/works-stages__menu";
import { WorksStagesSecret } from "./__secret/works-stages__secret";
import { WorksStagesTags } from "./__tags/works-stages__tags";
import { WorksStages } from "./works-stages";
import type { WorksStagesCols } from "./works-stages.types";

export function WorksStagesContainer({
    payload,
}: {
    payload: WorksStagePayload;
}) {
    const firstTag = payload.tags[0];
    const [tagId, setTagId] = useState(firstTag ? firstTag.id : "");
    const [cols, setCols] = useState<WorksStagesCols>(2);
    const [open, setOpen] = useState<number | null>(null);

    const tag = useMemo(
        () => payload.tags.find((item) => item.id === tagId) || firstTag,
        [payload.tags, tagId, firstTag],
    );
    const photos = tag ? tag.photos : [];

    return (
        <WorksStages
            payload={payload}
            menu={
                <WorksStagesMenu
                    title={payload.techTitle}
                    items={payload.menu}
                />
            }
            chips={<WorksStagesChips items={payload.chips} />}
            secret={
                payload.secretVideo ? (
                    <WorksStagesSecret src={payload.secretVideo} />
                ) : null
            }
            tags={
                <WorksStagesTags
                    items={payload.tags}
                    activeId={tag ? tag.id : ""}
                    onSelect={(id) => {
                        setTagId(id);
                        setOpen(null);
                    }}
                />
            }
            gallery={
                <WorksStagesGallery
                    title={tag ? tag.title : ""}
                    photos={photos}
                    cols={cols}
                    onCols={setCols}
                    onOpen={setOpen}
                />
            }
            lightbox={
                open != null && tag ? (
                    <WorksStagesLightbox
                        photos={photos}
                        index={open}
                        caption={tag.title}
                        onIndex={setOpen}
                        onClose={() => setOpen(null)}
                    />
                ) : null
            }
        />
    );
}
