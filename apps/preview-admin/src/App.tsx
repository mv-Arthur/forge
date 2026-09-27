import { useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { AuthScreen } from "./components/AuthScreen";
import { HomeSlots } from "./components/HomeSlots";
import { Library } from "./components/Library";
import type { AdminView } from "./components/AdminHeader";
import { theme } from "./lib/theme";

function Gate() {
    const { user, ready } = useAuth();
    const [view, setView] = useState<AdminView>("home");
    if (!ready) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }
    if (!user) return <AuthScreen />;
    if (view === "home") {
        return <HomeSlots view={view} onView={setView} />;
    }
    return <Library view={view} onView={setView} />;
}

export function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Gate />
            </AuthProvider>
        </ThemeProvider>
    );
}
