'use client'

import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

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
      <NavBar current="Blog" />

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Blog</h1>
        <p className="text-gray-400 mb-8">Analysis and insights from Massachusetts ADU permit data.</p>

        <Link
          href="/quiz"
          className="block bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-5 mb-8 hover:border-emerald-500/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🏡</span>
            <div>
              <div className="text-emerald-400 text-sm font-medium mb-1">New: ADU Decision Tree</div>
              <h2 className="text-lg font-bold text-white">Not sure where to start? Take the 2-minute quiz →</h2>
              <p className="text-gray-400 text-sm mt-1">Get a personalized ADU plan based on your goals, budget, and town.</p>
            </div>
          </div>
        </Link>

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
      <Footer />
    </div>
  )
}
