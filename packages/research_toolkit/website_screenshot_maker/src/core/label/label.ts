export type Labeler = (input: {
    templateId: string;
    sampleUrls: string[];
    slotKinds: string[];
}) => Promise<{
    templateLabel: string;
    slotLabels: Record<string, string>;
}>;

export const heuristicLabeler: Labeler = async (input) => {
    const id = input.templateId || "page";
    const last = id.split("/").filter(Boolean).pop() || "home";
    const slotLabels: Record<string, string> = {};
    for (const kind of input.slotKinds) {
        slotLabels[kind] = kind;
    }
    return { templateLabel: last, slotLabels };
};
