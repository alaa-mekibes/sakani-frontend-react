import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';
import { z } from 'zod';

export const Route = createFileRoute('/(auth)/verify-email')({
    validateSearch: z.object({ email: z.string().catch('') }),
    component: VerifyEmailPage,
});

function VerifyEmailPage() {
    const { email } = Route.useSearch();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const handleVerify = async () => {
        if (code.length !== 6) return toast.error('Enter the 6-digit code');
        setLoading(true);

        const res = await api.post('/auth/verify-email', { email, code });

        if (res.status === 'success') {
            toast.success('Email verified! 🎉');
            navigate({ to: '/' });
        } else {
            toast.error(res.message ?? 'Invalid code');
        }
        setLoading(false);
    };


    const handleResend = async () => {
        const res = await api.post('/auth/resend-code', { email });
        if (res.status === 'success') {
            toast.success('Code resent!');
            setCooldown(60);
            const timer = setInterval(() => {
                setCooldown(prev => {
                    if (prev <= 1) { clearInterval(timer); return 0; }
                    return prev - 1;
                });
            }, 1000);
        } else {
            toast.error(res.message ?? 'Failed to resend');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body text-center">
                    <h2 className="card-title justify-center text-2xl">Check your email</h2>
                    <p className="text-base-content/60 text-sm">
                        We sent a 6-digit code to <strong>{email}</strong>
                    </p>

                    <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        className="input input-bordered text-center text-2xl tracking-widest mt-4"
                        value={code}
                        onChange={e => setCode(e.target.value.replace(/\D/g, ''))} //* numbers only
                    />

                    <button
                        className="btn btn-primary mt-4"
                        onClick={handleVerify}
                        disabled={loading || code.length !== 6}
                    >
                        {loading ? <span className="loading loading-spinner" /> : 'Verify'}
                    </button>
                    <button
                        className="btn btn-ghost btn-sm mt-2"
                        onClick={handleResend}
                        disabled={cooldown > 0}
                    >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                    </button>
                </div>
            </div>
        </div>
    );
}