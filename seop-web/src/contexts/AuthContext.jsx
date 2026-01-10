import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function loadStorageData() {
            const token = localStorage.getItem("seop_token");
            const login = localStorage.getItem("seop_user");
            const role = localStorage.getItem("seop_role");
            const id = localStorage.getItem("seop_id");

            if (token && login && id) {
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                setUser({ login, role, id })
            }
            setLoading(false);
        }
        loadStorageData();
    }, []);

    async function signIn(login, senha) {
        try {
            const response = await api.post("/login", { login, senha });

            const { token, role, id } = response.data;

            localStorage.setItem("seop_token", token);
            localStorage.setItem("seop_user", login);
            localStorage.setItem("seop_role", role);
            localStorage.setItem("seop_id", id);

            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser({ login, role, id });

        } catch (error) {
            throw error;
        }
    }

    function signOut() {
        localStorage.clear();
        setUser(null);
        window.location.href = "/login";
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
}