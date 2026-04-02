import { createContext, useContext, useEffect, useState } from 'react';
import { api, type ApiResponse } from '../lib/api';
import type { IUser } from '../interfaces';
import type { ISignup } from '../validation';

interface IAuthContext {
    user: IUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    register: (body: ISignup) => Promise<ApiResponse<IUser>>;
    login: (email: string, password: string) => Promise<ApiResponse<IUser>>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get<IUser>('/auth/me')
            .then(res => {
                if (res.status === 'success') setUser(res.data ?? null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const register = async (body: ISignup) => {
        const res = await api.post<IUser>('/auth/register', body);
        if (res.status === 'success') setUser(res.data ?? null);
        return res;
    };

    const login = async (email: string, password: string) => {
        const res = await api.post<IUser>('/auth/login', { email, password });
        if (res.status === 'success') setUser(res.data ?? null);
        return res;
    };

    const logout = async () => {
        await api.post('/auth/logout', {});
        window.location.replace('/login');
        setUser(null);
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg" />
        </div>
    );

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);