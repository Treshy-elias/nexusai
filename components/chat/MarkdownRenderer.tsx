'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-zinc-700">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-widest">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.8rem',
          background: '#18181b', // zinc-900
        }}
        PreTag="div"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '')
          const isBlock = !props.inline && match

          if (isBlock) {
            return (
              <CodeBlock
                language={match[1]}
                code={String(children).replace(/\n$/, '')}
              />
            )
          }

          return (
            <code
              className="px-1.5 py-0.5 rounded-md bg-zinc-800 text-cyan-400 text-xs font-mono border border-zinc-700"
              {...props}
            >
              {children}
            </code>
          )
        },
        p({ children }) {
          return <p className="mb-3 last:mb-0 leading-relaxed text-zinc-300">{children}</p>
        },
        ul({ children }) {
          return <ul className="mb-3 ml-4 space-y-1 list-disc text-zinc-300">{children}</ul>
        },
        ol({ children }) {
          return <ol className="mb-3 ml-4 space-y-1 list-decimal text-zinc-300">{children}</ol>
        },
        li({ children }) {
          return <li className="leading-relaxed">{children}</li>
        },
        h1({ children }) {
          return <h1 className="text-xl font-bold mb-3 mt-4 text-white tracking-tight">{children}</h1>
        },
        h2({ children }) {
          return <h2 className="text-lg font-semibold mb-2 mt-4 text-white tracking-tight">{children}</h2>
        },
        h3({ children }) {
          return <h3 className="text-base font-semibold mb-2 mt-3 text-zinc-100">{children}</h3>
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-cyan-500/40 pl-4 my-3 text-zinc-500 italic bg-cyan-500/5 py-2 rounded-r-lg">
              {children}
            </blockquote>
          )
        },
        strong({ children }) {
          return <strong className="font-semibold text-white">{children}</strong>
        },
        a({ children, href }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
            >
              {children}
            </a>
          )
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border border-zinc-700 rounded-lg text-sm">
                {children}
              </table>
            </div>
          )
        },
        th({ children }) {
          return (
            <th className="px-4 py-2 bg-zinc-800 font-semibold text-left text-zinc-300 border-b border-zinc-700 text-xs uppercase tracking-wider">
              {children}
            </th>
          )
        },
        td({ children }) {
          return (
            <td className="px-4 py-2 border-b border-zinc-800 text-zinc-400">
              {children}
            </td>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}