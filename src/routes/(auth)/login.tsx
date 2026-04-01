import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'
import { loginSchema } from '../../validation'
import { useForm } from '@tanstack/react-form'
import { useAuth } from '../../context/AuthContext'
import { FieldInfo } from '../../components/layout/FieldInfo'
import { LockKeyhole, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import LoginImage from '../../components/images/LoginImage'

export const Route = createFileRoute('/(auth)/login')({
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      const res = await login(value.email, value.password)

      if (res.status === 'success') {
        toast.success('Welcome back!')
        setTimeout(() => {
          navigate({ to: '/' });
        }, 2000);
      } else {
        toast.error(res.message ?? 'Login failed')
      }
    },
  })

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-200">
      {/* Left */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-linear-to-br from-primary/20 to-secondary/20">
        <h2 className="text-5xl font-bold mb-6">Welcome Back !</h2>
        <p className="text-base-content/70 mb-8 text-center max-w-md">
          Sign in to continue your journey.
        </p>
        <LoginImage />
      </div>

      {/* Right */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="card bg-base-100 shadow-2xl border border-base-300">
            <div className="card-body">
              <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

              <fieldset className="space-y-4">
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
                        'Login'
                      )}
                    </button>
                  )}
                </form.Subscribe>
              </fieldset>

              <p className="text-center text-sm mt-4 text-base-content/70">
                Don’t have an account? <Link to='/signup' className="link">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
