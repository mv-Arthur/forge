import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import {
    fetchMe,
    login as loginRequest,
    setupFirstUser,
    type AuthSession,
    type AuthUser,
} from "../lib/api";
import { AUTH_LOST, getToken, setToken } from "../lib/session";

interface AuthContextValue {
    user: AuthUser | null;
    ready: boolean;
    login: (email: string, password: string) => Promise<void>;
    setup: (input: {
        email: string;
        password: string;
        name?: string;
    }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [ready, setReady] = useState(false);

    const applySession = useCallback((session: AuthSession) => {
        setToken(session.accessToken);
        setUser(session.user);
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
    }, []);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setReady(true);
            return;
        }
        void fetchMe()
            .then(setUser)
            .catch(() => {
                setToken(null);
                setUser(null);
            })
            .finally(() => setReady(true));
    }, []);

    useEffect(() => {
        function onLost() {
            setUser(null);
        }
        window.addEventListener(AUTH_LOST, onLost);
        return () => window.removeEventListener(AUTH_LOST, onLost);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            ready,
            async login(email, password) {
                applySession(await loginRequest(email, password));
            },
            async setup(input) {
                applySession(await setupFirstUser(input));
            },
            logout,
        }),
        [user, ready, applySession, logout]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth outside AuthProvider");
    return ctx;
}
