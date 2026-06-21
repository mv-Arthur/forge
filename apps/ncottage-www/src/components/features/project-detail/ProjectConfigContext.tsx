"use client";

import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

interface ProjectConfigValue {
    summary: string | null;
    setSummary: (summary: string | null) => void;
}

const ProjectConfigContext = createContext<ProjectConfigValue>({
    summary: null,
    setSummary: () => {},
});

export function ProjectConfigProvider({ children }: { children: ReactNode }) {
    const [summary, setSummary] = useState<string | null>(null);
    const value = useMemo(() => ({ summary, setSummary }), [summary]);
    return (
        <ProjectConfigContext.Provider value={value}>
            {children}
        </ProjectConfigContext.Provider>
    );
}

export function useProjectConfig(): ProjectConfigValue {
    return useContext(ProjectConfigContext);
}
