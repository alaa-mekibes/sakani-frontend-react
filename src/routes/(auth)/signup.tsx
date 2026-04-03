import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'
import { registerSchema } from '../../validation'
import { useForm } from '@tanstack/react-form'
import { useAuth } from '../../context/AuthContext'
import { FieldInfo } from '../../components/layout/FieldInfo'
import { LockKeyhole, Mail, User } from 'lucide-react'
import toast from 'react-hot-toast'
import RegisterImage from '../../components/images/RegisterImage'

export const Route = createFileRoute('/(auth)/signup')({
    beforeLoad: ({ context }) => {
        if (context.isAuthenticated) {
            throw redirect({ to: '/' })
        }
    },
    component: RegisterPage,
})

function RegisterPage() {
    const { register } = useAuth()
    const navigate = useNavigate()

    const form = useForm({
        defaultValues: { email: '', password: '', name: '' },
        validators: { onSubmit: registerSchema },
        onSubmit: async ({ value }) => {
            const res = await register(value)

            if (res.status === 'success') {
                toast.success('High five! 🙌')
                setTimeout(() => {
                    navigate({ to: '/verify-email', search: { email: value.email } });
                }, 2000);
            } else {
                toast.error(res.message ?? 'Sign up failed')
            }
        },
    })

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-base-200">
            {/* Right */}
            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="card bg-base-100 shadow-2xl border border-base-300">
                        <div className="card-body">
                            <h2 className="text-3xl font-semibold text-center mb-6">Sign up</h2>

                            <fieldset className="space-y-4">
                                <form.Field
                                    name="name"
                                    children={(field) => (
                                        <div>
                                            <label className="input input-bordered flex items-center gap-2 w-full">
                                                <User size={16} />
                                                <input
                                                    type="text"
                                                    className="grow"
                                                    placeholder="Name"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                />
                                            </label>
                                            <FieldInfo field={field} />
                                        </div>
                                    )}
                                />

                                <form.Field
                                    name="email"
                                    children={(field) => (
                                        <div>
                                            <label className="input input-bordered flex items-center gap-2 w-full">
                                                <Mail size={16} />
                                                <input
                                                    type="text"
                                                    className="grow"
                                                    placeholder="Email"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                />
                                            </label>
                                            <FieldInfo field={field} />
                                        </div>
                                    )}
                                />

                                <form.Field
                                    name="password"
                                    children={(field) => (
                                        <div>
                                            <label className="input input-bordered flex items-center gap-2 w-full">
                                                <LockKeyhole size={16} />
                                                <input
                                                    type="password"
                                                    className="grow"
                                                    placeholder="Password"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                />
                                            </label>
                                            <FieldInfo field={field} />
                                        </div>
                                    )}
                                />

                                <form.Subscribe selector={(state) => state.isSubmitting}>
                                    {(isSubmitting) => (
                                        <button
                                            className="btn btn-primary w-full mt-4"
                                            onClick={form.handleSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <span className="loading loading-spinner" />
                                            ) : (
                                                'Register'
                                            )}
                                        </button>
                                    )}
                                </form.Subscribe>
                            </fieldset>

                            <p className="text-center text-sm mt-4 text-base-content/70">
                                have an account? <Link to='/login' className="link">Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left */}
            <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-linear-to-br from-primary/20 to-secondary/20">
                <h2 className="text-5xl font-bold mb-6">Welcome to the crew!</h2>
                <p className="text-base-content/70 mb-8 text-center max-w-md">
                    Woohoo! You're officially part of the family. 🎊
                </p>
                <RegisterImage />
            </div>
        </div>
    )
}
