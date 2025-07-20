import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        content: data.content,
        author: data.author,
        category: data.category,
        tags: data.tags || [],
        image: data.image,
        status: data.status,
        featured: data.featured,
        readTime: data.readTime,
        likes: data.likes || [],
        comments: data.comments || [],
        views: data.views || 0,
        slug: data.slug,
      },
    })
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 