'use client'

import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const posts = [
  {
    slug: 'massachusetts-adu-compliance-gap',
    title: 'Why Permit Numbers Don\'t Tell the Full Story: Inside Massachusetts\' ADU Compliance Gap',
    description: 'Permit counts measure activity, not access. A provision-by-provision analysis of 28 Massachusetts towns reveals how local bylaws still conflict with state ADU law — even in towns issuing permits.',
    date: '2026-02-22',
    readTime: '8 min read',
    featured: true,
  },
  {
    slug: 'boston-adu-exemption',
    title: 'Boston Is the Only MA Town Exempt from the State ADU Law. Here\'s What That Means.',
    description: 'Boston doesn\'t operate under G.L. c. 40A, making it the only municipality where the statewide ADU by-right law doesn\'t apply. Here\'s what that means for homeowners and builders.',
    date: '2026-02-13',
    readTime: '8 min read',
    featured: false,
  },
  {
    slug: 'ag-disapprovals-sudbury-leicester-canton',
    title: '3 Towns the AG Struck Down — What Sudbury, Leicester, and Canton Had Disapproved',
    description: 'Sudbury, Leicester, and Canton had 7 ADU bylaw provisions disapproved by the Massachusetts Attorney General. Here\'s what they tried, why it failed, and what every town should learn.',
    date: '2026-02-13',
    readTime: '9 min read',
    featured: false,
  },
  {
    slug: 'massachusetts-adu-national-comparison',
    title: 'How Massachusetts Stacks Up in America\'s ADU Boom',
    description: 'Massachusetts ranks 11th nationally with ADUs making up 27% of new residential construction. How the state\'s first-year numbers compare to 2.8 million permits nationwide.',
    date: '2026-02-11',
    readTime: '7 min read',
    featured: false,
  },
  {
    slug: 'grandparent-adu-massachusetts',
    title: 'The Grandparent ADU: Why Massachusetts Boomers Are Building to Be Closer to Family',
    description: 'Baby boomers control $19 trillion in housing wealth. A growing number are using it to build ADUs — and it\'s changing the housing conversation in Massachusetts.',
    date: '2026-02-07',
    readTime: '7 min read',
    featured: false,
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
