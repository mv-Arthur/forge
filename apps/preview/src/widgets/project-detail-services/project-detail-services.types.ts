export type ServicesKind = "visit" | "site" | "architect";

export type ProjectDetailServicesProps = {
    onOpen: (kind: ServicesKind) => void;
};
