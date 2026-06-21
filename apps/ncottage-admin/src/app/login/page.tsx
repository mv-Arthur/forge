"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";

const initial: LoginState = {};

export default function LoginPage() {
    const [state, action, pending] = useActionState(loginAction, initial);

    return (
        <div style={{ maxWidth: 360, margin: "4rem auto" }}>
            <h1>Вход в админку</h1>
            <form action={action}>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="username"
                        required
                    />
                </div>
                <div className="field">
                    <label htmlFor="password">Пароль</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                    />
                </div>
                {state.error && <p className="error">{state.error}</p>}
                <button type="submit" disabled={pending}>
                    {pending ? "Вход…" : "Войти"}
                </button>
            </form>
        </div>
    );
}
