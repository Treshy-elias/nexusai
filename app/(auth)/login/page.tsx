'use client'

import { useState } from 'react'
import { signInWithEmail } from '../actions'
import GoogleButton from '@/components/auth/GoogleButton'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signInWithEmail(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 antialiased selection:bg-violet-500/30">
      
      {/* LEFT PANE: Authentication Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:max-w-xl bg-white dark:bg-gray-900 border-r border-transparent lg:dark:border-gray-800/50 lg:border-gray-200/80 shadow-2xl z-10">
        <div className="w-full max-w-sm lg:w-96">
          
          {/* Logo & Header */}
          <div className="text-center lg:text-left mb-8">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 mb-5 shadow-lg shadow-violet-500/20">
              <span className="text-white text-xl font-black tracking-wider">N</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Sign in to your NexusAI account to continue
            </p>
          </div>

          {/* Social Auth Providers */}
          <div className="space-y-3">
            <GoogleButton />
          </div>

          {/* Elegant Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-800" />
            <span className="px-3 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
              or use email
            </span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-800" />
          </div>

          {/* Credentials Form */}
          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 dark:focus:border-violet-500 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 dark:focus:border-violet-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Error Message Notification */}
            {error && (
              <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex justify-center items-center py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-violet-500/10 hover:shadow-xl hover:shadow-violet-500/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.99]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying credentials...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <p className="text-center lg:text-left text-sm text-gray-500 dark:text-gray-400 mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-semibold transition-colors">
              Create an account
            </Link>
          </p>

        </div>
      </div>

      {/* RIGHT PANE: Modern Feature Banner (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 overflow-hidden">
        {/* Decorative Grid Patterns & Glow Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl mix-blend-screen animate-pulse duration-4000" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl mix-blend-screen animate-pulse duration-4000 delay-1000" />

        <div className="max-w-md p-8 text-center relative z-20">
          <div className="inline-flex px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs font-semibold text-violet-300 tracking-wide mb-6 uppercase">
            Now Live: Nexus Engine v2.4
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Supercharge your workflow with intelligence
          </h2>
          <p className="mt-4 text-base text-slate-400 max-w-sm mx-auto">
            Connect your workflows, analyze data pipelines, and ship products faster with our context-aware AI workspace.
          </p>
        </div>
      </div>

    </div>
  )
}