import { createContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth.api.js';

export const AuthContext = createContext({});

const decodeTokenPayload = (token) => {
    if (!token) return null;
    try {
        const [, payload] = token.split('.');
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(base64);
        const utf8String = decodeURIComponent(
            decoded
                .split('')
                .map((char) => `%${('00' + char.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
        return JSON.parse(utf8String);
    } catch (error) {
        return null;
    }
};

const buildUserFromToken = (token) => {
    const payload = decodeTokenPayload(token);
    if (!payload) return null;

    return {
        userId: payload.sub || payload.userId || null,
        username: payload.username || payload.name || null,
        email: payload.email || null,
        roles: payload.roles || payload.role || [],
    };
};

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const parsedUser = buildUserFromToken(token);
            if (parsedUser) {
                setAccessToken(token);
                setUser(parsedUser);
            } else {
                localStorage.removeItem('accessToken');
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const data = await authApi.login(credentials);
        const token = data.accessToken || data.token || null;
        if (!token) {
            throw new Error('Token no recibido desde el Auth Service');
        }

        const parsedUser = buildUserFromToken(token);
        if (!parsedUser) {
            throw new Error('Token inválido');
        }

        localStorage.setItem('accessToken', token);
        setAccessToken(token);
        setUser(parsedUser);
        return parsedUser;
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setUser(null);
    };

    const isAuthenticated = Boolean(accessToken && user);

    const hasRole = (role) => {
        if (!user?.roles) return false;
        return user.roles.includes(role);
    };

    const contextValue = useMemo(() => ({
        user,
        accessToken,
        loading,
        login,
        logout,
        isAuthenticated,
        hasRole,
    }), [user, accessToken, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
