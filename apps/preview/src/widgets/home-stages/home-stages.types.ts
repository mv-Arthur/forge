export type HomeStageItem = {
    id: string;
    title: string;
    text: string;
    image: string;
};

export type HomeStagesViewProps = {
    heading: string;
    lead: string;
    items: HomeStageItem[];
    activeId: string;
    openId: string | null;
    onActivate: (id: string) => void;
    onListLeave: () => void;
    onToggle: (id: string) => void;
};
