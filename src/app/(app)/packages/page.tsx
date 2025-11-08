import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Heart, MapPin, Search, Star, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

export default function PackagesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Explore Curated Holiday Packages
            </h1>
            <p className="mb-8 text-lg text-blue-100">
              650+ verified travel agents | 40 lakh+ happy travelers | Fully customizable packages
            </p>

            {/* Search Filters */}
            <Card className="bg-white p-6 text-gray-900">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Destination</label>
                  <Input placeholder="Where to?" className="w-full" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Duration</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-5">3-5 Days</SelectItem>
                      <SelectItem value="6-8">6-8 Days</SelectItem>
                      <SelectItem value="9+">9+ Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Budget</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget (₹10k-30k)</SelectItem>
                      <SelectItem value="mid">Mid-range (₹30k-70k)</SelectItem>
                      <SelectItem value="luxury">Luxury (₹70k+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Themes */}
      <section className="bg-[#e8e8e4]-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Browse by Theme</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {themes.map((theme) => (
              <Link key={theme.slug} href={`/packages/${theme.slug}`}>
                <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl">
                  <div className={`relative h-48 bg-linear-to-br ${theme.gradient}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <theme.icon className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 font-semibold">{theme.name}</h3>
                    <p className="text-sm text-gray-600">{theme.count} packages</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* International Packages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">International Tour Packages</h2>
              <p className="text-gray-600">Explore exotic destinations worldwide</p>
            </div>
            <Link href="/packages/international">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {internationalPackages.map((pkg, index) => (
              <PackageCard key={index} {...pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Domestic Packages */}
      <section className="bg-[#e8e8e4]-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Domestic Tour Packages</h2>
              <p className="text-gray-600">Discover incredible India</p>
            </div>
            <Link href="/packages/domestic">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {domesticPackages.map((pkg, index) => (
              <PackageCard key={index} {...pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Book With Us?</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-blue-100 p-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-linear-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Can&apos;t Find What You&apos;re Looking For?</h2>
          <p className="mb-8 text-lg text-blue-100">
            Get free quotes from 650+ verified travel experts
          </p>
          <Link href="/requirements/new?type=tour-package">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Get Custom Package
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function PackageCard({ name, destination, duration, price, rating, reviews, image }: any) {
  return (
    <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl">
      <div className="relative h-48 bg-linear-to-br from-gray-200 to-gray-300">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="h-16 w-16 text-gray-400" />
        </div>
        <div className="absolute right-2 top-2">
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-1 font-semibold">{name}</h3>
        <p className="mb-2 text-sm text-gray-600">{destination}</p>
        <div className="mb-3 flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {duration}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {rating} ({reviews})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Starting from</div>
            <div className="text-xl font-bold text-blue-600">₹{price.toLocaleString()}</div>
          </div>
          <Button size="sm" className="outline-solid border">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  )
}

const themes = [
  {
    name: 'Honeymoon',
    slug: 'honeymoon',
    icon: Heart,
    count: 150,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Family',
    slug: 'family',
    icon: Users,
    count: 200,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Adventure',
    slug: 'adventure',
    icon: TrendingUp,
    count: 120,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    name: 'Budget',
    slug: 'budget',
    icon: Calendar,
    count: 180,
    gradient: 'from-green-500 to-emerald-500',
  },
]

const internationalPackages = [
  {
    name: 'Maldives Paradise',
    destination: 'Maldives',
    duration: '5D/4N',
    price: 85000,
    rating: 4.9,
    reviews: 890,
  },
  {
    name: 'Dubai Luxury',
    destination: 'Dubai, UAE',
    duration: '6D/5N',
    price: 65000,
    rating: 4.8,
    reviews: 1250,
  },
  {
    name: 'Bali Adventure',
    destination: 'Bali, Indonesia',
    duration: '7D/6N',
    price: 55000,
    rating: 4.7,
    reviews: 980,
  },
]

const domesticPackages = [
  {
    name: 'Kerala Backwaters',
    destination: 'Kerala',
    duration: '5D/4N',
    price: 25000,
    rating: 4.8,
    reviews: 1500,
  },
  {
    name: 'Leh-Ladakh Expedition',
    destination: 'Ladakh',
    duration: '8D/7N',
    price: 35000,
    rating: 4.9,
    reviews: 1200,
  },
  {
    name: 'Goa Beach Escape',
    destination: 'Goa',
    duration: '4D/3N',
    price: 15000,
    rating: 4.6,
    reviews: 2100,
  },
]

const features = [
  { icon: Users, title: '650+ Verified Agents', description: 'Trusted local travel experts' },
  { icon: Heart, title: '40L+ Happy Travelers', description: 'Proven track record' },
  { icon: Star, title: 'Fully Customizable', description: 'Tailor every detail' },
  { icon: TrendingUp, title: 'Best Price Guarantee', description: 'Competitive rates' },
]
