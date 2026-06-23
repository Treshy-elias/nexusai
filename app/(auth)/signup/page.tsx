'use client'

import { useState } from 'react'
import { signUpWithEmail} from '../actions'
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

  async function handleGoogle() {
    setLoading(true)
    await signInWithGoogle()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600 mb-4">
            <span className="text-white text-xl font-bold">N</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Start chatting with NexusAI</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">

          <GoogleButton />

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-800" />
            <span className="px-3 text-xs text-gray-400">or</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-800" />
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Display Name
              </label>
              <input
                name="display_name"
                type="text"
                required
                placeholder="John Doe"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg px-3 py-2">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-600 hover:text-violet-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}