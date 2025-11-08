import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Calendar, Clock, MapPin, Search, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function HolidayIdeasPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-linear-to-br from-purple-600 to-blue-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Holiday Ideas & Travel Inspiration
            </h1>
            <p className="mb-8 text-lg text-purple-100">
              Expert guides, destination tips, and travel stories to inspire your next adventure
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Search destinations, tips, guides..."
                className="flex-1 bg-white text-gray-900"
              />
              <Button className="bg-white text-purple-600 hover:bg-purple-50">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h2 className="text-3xl font-bold">Trending Now</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredArticles.map((article, index) => (
              <ArticleCard key={index} {...article} featured />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#e8e8e4]-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Browse by Category</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.slug} href={`/holiday-ideas/${category.slug}`}>
                <Card className="group cursor-pointer p-6 transition-all hover:shadow-lg">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-600">
                    <category.icon className="h-6 w-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <h3 className="mb-1 font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} articles</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destination Guides */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Destination Guides</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinationGuides.map((guide, index) => (
              <ArticleCard key={index} {...guide} />
            ))}
          </div>
        </div>
      </section>

      {/* Travel Tips */}
      <section className="bg-[#e8e8e4]-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Travel Tips & Hacks</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {travelTips.map((tip, index) => (
              <ArticleCard key={index} {...tip} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-linear-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Plan Your Trip?</h2>
          <p className="mb-8 text-lg text-blue-100">
            Get personalized recommendations from our AI assistant or browse curated packages
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/ai-assistant">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Chat with AI Assistant
              </Button>
            </Link>
            <Link href="/packages">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10"
              >
                Browse Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function ArticleCard({ title, excerpt, category, readTime, image, featured }: any) {
  return (
    <Card
      className={`group cursor-pointer overflow-hidden transition-all hover:shadow-xl ${featured ? 'md:col-span-1' : ''}`}
    >
      <div className="relative h-48 bg-linear-to-br from-gray-200 to-gray-300">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="h-16 w-16 text-gray-400" />
        </div>
        {category && (
          <div className="absolute left-2 top-2">
            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
              {category}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-2 font-semibold line-clamp-2">{title}</h3>
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">{excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {readTime} min read
          </span>
          <span className="text-blue-600 group-hover:underline">Read more →</span>
        </div>
      </div>
    </Card>
  )
}

const featuredArticles = [
  {
    title: 'Top 10 Budget International Destinations for 2025',
    excerpt: "Discover affordable international destinations that won't break the bank",
    category: 'Budget Travel',
    readTime: 8,
  },
  {
    title: 'Complete Guide to Leh-Ladakh Bike Trip',
    excerpt: 'Everything you need to know for an epic Ladakh motorcycle adventure',
    category: 'Adventure',
    readTime: 12,
  },
  {
    title: 'Best Honeymoon Destinations in Maldives',
    excerpt: 'Romantic islands, luxury resorts, and unforgettable experiences',
    category: 'Honeymoon',
    readTime: 10,
  },
]

const categories = [
  { name: 'Destination Guides', slug: 'destinations', icon: MapPin, count: 150 },
  { name: 'Travel Tips', slug: 'tips', icon: TrendingUp, count: 80 },
  { name: 'Budget Travel', slug: 'budget', icon: Calendar, count: 60 },
  { name: 'Adventure', slug: 'adventure', icon: TrendingUp, count: 45 },
]

const destinationGuides = [
  {
    title: 'Kerala Backwaters: A Complete Travel Guide',
    excerpt: 'Explore the serene backwaters, houseboats, and local culture',
    category: 'India',
    readTime: 15,
  },
  {
    title: 'Dubai Travel Guide: Best Time, Places & Tips',
    excerpt: 'Everything you need for a perfect Dubai vacation',
    category: 'International',
    readTime: 12,
  },
  {
    title: 'Goa Beyond Beaches: Hidden Gems',
    excerpt: 'Discover the lesser-known attractions of Goa',
    category: 'India',
    readTime: 10,
  },
]

const travelTips = [
  {
    title: 'How to Pack Light for Long Trips',
    excerpt: 'Expert packing tips to travel with just a carry-on',
    category: 'Tips',
    readTime: 6,
  },
  {
    title: 'Best Travel Insurance Options in India',
    excerpt: 'Compare and choose the right travel insurance',
    category: 'Planning',
    readTime: 8,
  },
  {
    title: 'Solo Travel Safety Tips for Women',
    excerpt: 'Stay safe while exploring the world alone',
    category: 'Safety',
    readTime: 7,
  },
]
