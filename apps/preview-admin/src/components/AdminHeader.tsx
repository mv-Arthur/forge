import { useState, type MouseEvent, type ReactNode } from "react";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useAuth } from "../auth/AuthProvider";

export type AdminView = "library" | "home";

export function AdminHeader({
    view,
    onView,
    actions,
}: {
    view: AdminView;
    onView: (view: AdminView) => void;
    actions?: ReactNode;
}) {
    const { user, logout } = useAuth();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const email = user?.email ?? "";
    const initial = (email[0] ?? "?").toUpperCase();

    return (
        <AppBar position="sticky" color="primary" elevation={1}>
            <Toolbar sx={{ gap: 2, minHeight: 64 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mr: 1 }}>
                    ncottage
                </Typography>
                <Tabs
                    value={view}
                    onChange={(_e, next: AdminView) => onView(next)}
                    textColor="inherit"
                    slotProps={{
                        indicator: {
                            sx: { bgcolor: "common.white" },
                        },
                    }}
                >
                    <Tab value="home" label="Главная" />
                    <Tab value="library" label="Библиотека" />
                </Tabs>
                <Box sx={{ flex: 1 }} />
                {actions}
                <IconButton
                    onClick={(e: MouseEvent<HTMLElement>) =>
                        setAnchor(e.currentTarget)
                    }
                    sx={{ p: 0.5 }}
                >
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "primary.dark",
                            fontSize: 16,
                        }}
                    >
                        {initial}
                    </Avatar>
                </IconButton>
                <Menu
                    anchorEl={anchor}
                    open={Boolean(anchor)}
                    onClose={() => setAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <MenuItem disabled>{email}</MenuItem>
                    <MenuItem
                        onClick={() => {
                            setAnchor(null);
                            logout();
                        }}
                    >
                        Выйти
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
