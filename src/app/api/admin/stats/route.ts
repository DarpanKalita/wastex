import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

interface GroupByResult {
  createdAt: Date
  _count: number
}

export async function GET() {
  try {
    // Get total users count
    const totalUsers = await prisma.user.count()

    // Get users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    })

    // Get total services count
    const totalServices = await prisma.servicePage.count()

    // Get total quotes count
    const totalQuotes = await prisma.quote.count()

    // Get quotes by status
    const quotesByStatus = await prisma.quote.groupBy({
      by: ['status'],
      _count: true,
    })

    // Get total blog posts count
    const totalBlogPosts = await prisma.blogPost.count()

    // Get recent activity (last 5 quotes)
    const recentQuotes = await prisma.quote.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        name: true,
        email: true,
      },
    })

    // Get user growth data (last 7 days)
    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      _count: true,
      orderBy: {
        createdAt: 'asc',
      },
      take: 7,
    })

    // Get waste pickup stats (last 7 days)
    const pickupStats = await prisma.wastePickup.groupBy({
      by: ['createdAt'],
      _count: true,
      orderBy: {
        createdAt: 'asc',
      },
      take: 7,
    })

    // Get litter report stats (last 7 days)
    const reportStats = await prisma.litterReport.groupBy({
      by: ['createdAt'],
      _count: true,
      orderBy: {
        createdAt: 'asc',
      },
      take: 7,
    })

    // Format dates for charts
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }

    return NextResponse.json({
      totalUsers,
      usersByRole,
      totalServices,
      totalQuotes,
      quotesByStatus,
      totalBlogPosts,
      recentQuotes: recentQuotes.map(quote => ({
        id: quote.id,
        status: quote.status,
        createdAt: quote.createdAt,
        user: {
          name: quote.name,
          email: quote.email,
        },
      })),
      userGrowth: userGrowth.map((item: GroupByResult) => ({
        date: formatDate(item.createdAt),
        count: item._count,
      })),
      pickupStats: pickupStats.map((item: GroupByResult) => ({
        date: formatDate(item.createdAt),
        count: item._count,
      })),
      reportStats: reportStats.map((item: GroupByResult) => ({
        date: formatDate(item.createdAt),
        count: item._count,
      })),
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 