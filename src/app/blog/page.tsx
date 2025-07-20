import { Metadata } from 'next'
import { FiCalendar, FiUser, FiTag, FiEye } from 'react-icons/fi'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Blog - WasteX',
  description: 'Latest news, tips, and insights about waste management and sustainability.',
}

interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  image: string
  status: string
  featured: boolean
  readTime: number
  likes: string[]
  comments: any
  views: number
  slug: string
  createdAt: string
  updatedAt: string
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
  })
  // Convert createdAt and updatedAt to strings for type compatibility
  return posts.map((post: any) => ({
    ...post,
    createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
    updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt,
    comments: post.comments,
  }))
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-background dark:bg-primary-dark pt-0">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary-dark dark:text-background mb-8">
            WasteX Blog
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {posts.map((post) => (
              <article key={post.id} className="bg-primary-light dark:bg-primary-dark rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-primary-light dark:bg-primary-dark">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover z-0"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-primary-dark mb-4">
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <FiUser className="w-4 h-4 mr-2" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <FiTag className="w-4 h-4 mr-2" />
                      <span>{post.category}</span>
                    </div>
                    <div className="flex items-center">
                      <FiEye className="w-4 h-4 mr-2" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-primary-dark dark:text-background mb-2">
                    {post.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags && post.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-primary-light text-primary-dark rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-primary-dark mb-4">
                    {post.content.slice(0, 120)}{post.content.length > 120 ? '...' : ''}
                  </p>
                  <div className="flex items-center text-xs text-primary-dark mb-2">
                    <span>Read time: {post.readTime} min</span>
                    {post.featured && <span className="ml-4 px-2 py-1 bg-yellow-200 text-yellow-800 rounded">Featured</span>}
                  </div>
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="bg-background dark:bg-primary-dark rounded-lg shadow-lg p-6 mb-12">
            <h2 className="text-2xl font-semibold text-primary-dark dark:text-background mb-6">
              Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from(new Set(posts.map(post => post.category))).map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-primary-light text-primary-dark rounded-lg hover:bg-primary transition-colors duration-200"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-background dark:bg-primary-dark rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-primary-dark dark:text-background mb-6">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-primary-dark mb-6">
              Stay updated with the latest news, tips, and insights about waste management and sustainability.
            </p>
            <form className="flex space-x-4">
              <input
                type="email"
                className="flex-1 px-4 py-2 border border-primary-light rounded-lg focus:ring-2 focus:ring-primary bg-primary-light text-primary-dark"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-background font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 