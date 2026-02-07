'use client'

import Link from 'next/link'
import TownNav from '@/components/TownNav'

const posts = [
  {
    slug: 'grandparent-adu-massachusetts',
    title: 'The Grandparent ADU: Why Massachusetts Boomers Are Building to Be Closer to Family',
    description: 'Baby boomers control $19 trillion in housing wealth. A growing number are using it to build ADUs — and it\'s changing the housing conversation in Massachusetts.',
    date: '2026-02-07',
    readTime: '7 min read',
    featured: true,
  },
  {
    slug: 'massachusetts-adu-year-one',
    title: 'What 1,224 ADU Permits Taught Me About Massachusetts Housing',
    description: 'One year into MA\'s ADU law: what\'s working, what\'s not, and what the permit data reveals about housing in the state.',
    date: '2026-02-06',
    readTime: '6 min read',
    featured: false,
  },
]

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADU Pulse</span>
            </Link>
            <TownNav current="Blog" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Blog</h1>
        <p className="text-gray-400 mb-8">Analysis and insights from Massachusetts ADU permit data.</p>

        {posts.filter(p => p.featured).map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-6 mb-8 hover:border-blue-500/50 transition-colors"
          >
            <div className="text-blue-400 text-sm font-medium mb-2">Featured</div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{post.title}</h2>
            <p className="text-gray-400 mb-4">{post.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </Link>
        ))}

        {posts.filter(p => !p.featured).map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block border border-gray-700 rounded-xl p-6 mb-4 hover:border-gray-600 transition-colors"
          >
            <h2 className="text-lg md:text-xl font-bold text-white mb-2">{post.title}</h2>
            <p className="text-gray-400 mb-3 text-sm">{post.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </Link>
        ))}
      </main>

      <footer className="border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-500">
            <div>© 2026 ADU Pulse</div>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/statewide" className="hover:text-white">Data</Link>
              <Link href="/estimate" className="hover:text-white">Estimator</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
