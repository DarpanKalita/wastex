'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi'

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
  comments: string[]
  views: number
  slug: string
  createdAt: string
  updatedAt: string
}

const defaultNewPost: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  content: '',
  author: '',
  category: '',
  tags: [],
  image: '',
  status: 'draft',
  featured: false,
  readTime: 5,
  likes: [],
  comments: [],
  views: 0,
  slug: '',
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [newPost, setNewPost] = useState<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>({ ...defaultNewPost })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      })
      if (response.ok) {
        setNewPost({ ...defaultNewPost })
        setTagInput('')
        fetchPosts()
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error deleting blog post:', error)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !newPost.tags.includes(tagInput.trim())) {
      setNewPost(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNewPost(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Blog Posts</h1>

      {/* New Post Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Post</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              rows={6}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Author
              </label>
              <input
                type="text"
                value={newPost.author}
                onChange={(e) => setNewPost(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={newPost.category}
                onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={newPost.image}
                onChange={(e) => setNewPost(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                placeholder="Add tag"
              />
              <button type="button" onClick={handleAddTag} className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newPost.tags.map((tag) => (
                <span key={tag} className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded px-2 py-1 text-xs flex items-center">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-red-500">&times;</button>
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={newPost.status}
                onChange={(e) => setNewPost(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Featured
              </label>
              <input
                type="checkbox"
                checked={newPost.featured}
                onChange={(e) => setNewPost(prev => ({ ...prev, featured: e.target.checked }))}
                className="mr-2"
              />
              <span>{newPost.featured ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Read Time (min)
              </label>
              <input
                type="number"
                value={newPost.readTime}
                onChange={(e) => setNewPost(prev => ({ ...prev, readTime: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                min={1}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug
            </label>
            <input
              type="text"
              value={newPost.slug}
              onChange={(e) => setNewPost(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              placeholder="e.g. tips-for-success"
            />
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Add Post
          </button>
        </div>
      </div>

      {/* Existing Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Posts</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{post.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {post.author} • {new Date(post.createdAt).toLocaleDateString()} • {post.category}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded px-2 py-1 text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{post.content.slice(0, 120)}{post.content.length > 120 ? '...' : ''}</p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2 gap-4">
                    <span>Status: {post.status}</span>
                    <span>Featured: {post.featured ? 'Yes' : 'No'}</span>
                    <span>Read time: {post.readTime} min</span>
                    <span>Views: {post.views}</span>
                  </div>
                  <span className="text-xs text-gray-400">Slug: {post.slug}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 