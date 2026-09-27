import { useEffect, useState, type FormEvent } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAuth } from "../auth/AuthProvider";
import { fetchSetup } from "../lib/api";
import { EmailField } from "./EmailField";

export function AuthScreen() {
    const auth = useAuth();
    const [needsSetup, setNeedsSetup] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        void fetchSetup()
            .then((s) => setNeedsSetup(s.needsSetup))
            .catch(() => setNeedsSetup(false));
    }, []);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Введи корректный email");
            return;
        }
        setEmailError("");
        if (needsSetup && password !== confirm) {
            setError("Пароли не совпадают");
            return;
        }
        setBusy(true);
        try {
            if (needsSetup) {
                await auth.setup({
                    email,
                    password,
                    name: name || undefined,
                });
            } else {
                await auth.login(email, password);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setBusy(false);
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                p: 2,
            }}
        >
            <Card sx={{ width: "100%", maxWidth: 420 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="overline" color="primary">
                        ncottage
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {needsSetup ? "Первый вход" : "Вход"}
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={onSubmit}
                        noValidate
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        {needsSetup ? (
                            <FormControl>
                                <FormLabel htmlFor="name">Имя</FormLabel>
                                <TextField
                                    id="name"
                                    name="name"
                                    placeholder="Иван"
                                    autoComplete="name"
                                    fullWidth
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </FormControl>
                        ) : null}
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <EmailField
                                id="email"
                                value={email}
                                error={Boolean(emailError)}
                                helperText={emailError}
                                onChange={(next) => {
                                    setEmail(next);
                                    if (emailError) setEmailError("");
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Пароль</FormLabel>
                            <TextField
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete={
                                    needsSetup
                                        ? "new-password"
                                        : "current-password"
                                }
                                helperText={
                                    needsSetup
                                        ? "Минимум 8 символов"
                                        : undefined
                                }
                            />
                        </FormControl>
                        {needsSetup ? (
                            <FormControl>
                                <FormLabel htmlFor="confirm">
                                    Повтори пароль
                                </FormLabel>
                                <TextField
                                    id="confirm"
                                    name="confirm"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    fullWidth
                                    value={confirm}
                                    onChange={(e) =>
                                        setConfirm(e.target.value)
                                    }
                                    autoComplete="new-password"
                                />
                            </FormControl>
                        ) : null}
                        {error ? <Alert severity="error">{error}</Alert> : null}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={busy}
                        >
                            {busy
                                ? "…"
                                : needsSetup
                                  ? "Создать"
                                  : "Войти"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
