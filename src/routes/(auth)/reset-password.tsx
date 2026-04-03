import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';
import z from 'zod';

export const Route = createFileRoute('/(auth)/reset-password')({
  validateSearch: z.object({ email: z.string().catch('') }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const res = await api.post('/auth/reset-password', { email, code, password });
    if (res.status === 'success') {
      toast.success('Password reset! Please login.');
      navigate({ to: '/login' });
    } else {
      toast.error(res.message ?? 'Failed to reset password');
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Reset Password</h2>
          <p className="text-sm text-base-content/60">
            Code sent to <strong>{email}</strong>
          </p>

          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            className="input input-bordered text-center text-2xl tracking-widest mt-2"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))} //* Only number
          />

          <input
            type="password"
            placeholder="New password"
            className="input input-bordered mt-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button
            className="btn btn-primary mt-4"
            onClick={handleReset}
            disabled={loading || code.length !== 6 || password.length < 8}
          >
            {loading ? <span className="loading loading-spinner" /> : 'Reset Password'}
          </button>
        </div>
      </div>
    </div>
  );
}