import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    const res = await api.post('/auth/forgot-password', { email });
    if (res.status === 'success') {
      toast.success('Check your email!');
      navigate({ to: '/reset-password', search: { email } });
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Forgot Password?</h2>
          <p className="text-base-content/60 text-sm">
            Enter your email and we'll send you a reset code.
          </p>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered mt-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button
            className="btn btn-primary mt-4"
            onClick={handleSubmit}
            disabled={loading || !email}
          >
            {loading ? <span className="loading loading-spinner" /> : 'Send Code'}
          </button>
          <Link to="/login" className="btn btn-ghost btn-sm">Back to login</Link>
        </div>
      </div>
    </div>
  );
}