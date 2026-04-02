import { useEffect, useState } from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dracula'>(
        () => (localStorage.getItem('theme') as 'light' | 'dracula') ?? 'dracula'
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'light' ? 'dracula' : 'light');

    return { theme, toggleTheme };
};