'use client'

import { useState } from 'react'
import { signUpWithEmail } from '../actions'
import Link from 'next/link'
import GoogleButton from '@/components/auth/GoogleButton'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    const result = await signUpWithEmail(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-zinc-950 antialiased selection:bg-cyan-500/20">

      {/* LEFT PANE */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:max-w-xl bg-zinc-900 border-r border-zinc-800 z-10">
        <div className="w-full max-w-sm lg:w-96">

          {/* Logo & Header */}
          <div className="text-center lg:text-left mb-8">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 mb-5">
              <span className="text-cyan-400 text-lg font-bold tracking-wide">N</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Create your account
            </h1>
            <p className="text-zinc-500 mt-1.5 text-sm">
              Join NexusAI and start building today
            </p>
          </div>

          {/* Social Auth */}
          <div className="space-y-3">
            <GoogleButton />
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-zinc-800" />
            <span className="px-3 text-xs font-medium text-zinc-600 uppercase tracking-widest">
              or continue with email
            </span>
            <div className="flex-1 border-t border-zinc-800" />
          </div>

          {/* Form */}
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input
                name="display_name"
                type="text"
                required
                placeholder="John Doe"
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-150"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-150"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-150"
              />
              <p className="mt-1.5 text-xs text-zinc-600">Minimum 6 characters</p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center space-x-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center space-x-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3.5 py-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{success}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-zinc-950 text-sm font-bold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-zinc-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center lg:text-left text-sm text-zinc-500 mt-7">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>

        </div>
      </div>

      {/* RIGHT PANE */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-zinc-950 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        {/* Neon glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl" />
        {/* Neon border accent line */}
        <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent" />

        <div className="max-w-md px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-semibold text-cyan-400 tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Free to get started
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight leading-snug">
            Your AI workspace, ready in seconds
          </h2>
          <p className="mt-4 text-base text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Set up your account and get instant access to context-aware AI tools built for teams that move fast.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
            {[
              'Unlimited AI conversations',
              'Connect your data pipelines',
              'Team collaboration built in',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm text-zinc-400">
                <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                {feature}
              </div>
            ))}
          </div>

          {/* Trust signals */}
          <div className="mt-10 flex items-center justify-center gap-6 text-zinc-600 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              SOC 2 Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              99.9% Uptime
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              GDPR Ready
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}