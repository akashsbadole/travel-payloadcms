import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import {
    MessageSquare,
    Search
} from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function MessagesListPage() {
    const payload = await getPayloadHMR({ config: configPromise })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')

    if (!token) {
        redirect('/login')
    }

    const headers = new Headers()
    headers.set('cookie', `payload-token=${token.value}`)

    const { user } = await payload.auth({ headers })

    if (!user) {
        redirect('/login')
    }

    // Fetch user's requirements with messages
    const requirements = await payload.find({
        collection: 'requirements',
        where: { user: { equals: user.id } },
        sort: '-createdAt',
        depth: 1,
    })

    // Get message counts for each requirement
    const requirementsWithMessages = await Promise.all(
        requirements.docs.map(async (req: any) => {
            const messages = await payload.find({
                collection: 'messages',
                where: {
                    requirement: { equals: req.id },
                },
                limit: 1,
                sort: '-createdAt',
            })

            const unreadCount = await payload.count({
                collection: 'messages',
                where: {
                    requirement: { equals: req.id },
                    receiver: { equals: user.id },
                    read: { equals: false },
                },
            })

            return {
                ...req,
                lastMessage: messages.docs[0] || null,
                unreadCount: unreadCount.totalDocs,
            }
        })
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold">Messages</h1>
                    <p className="text-gray-600">Chat with travel agents about your requirements</p>
                </div>

                {/* Search */}
                <Card className="mb-6 p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input placeholder="Search conversations..." className="pl-10" />
                    </div>
                </Card>

                {/* Conversations List */}
                {requirementsWithMessages.length > 0 ? (
                    <div className="space-y-4">
                        {requirementsWithMessages.map((req: any) => (
                            <Link key={req.id} href={`/messages/${req.id}`}>
                                <Card className="p-4 transition-all hover:shadow-lg">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                            <MessageSquare className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="mb-1 flex items-center justify-between">
                                                <h3 className="font-semibold capitalize">
                                                    {req.serviceType.replace('-', ' ')} Requirement
                                                </h3>
                                                {req.unreadCount > 0 && (
                                                    <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                                                        {req.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            {req.lastMessage ? (
                                                <>
                                                    <p className="mb-1 text-sm text-gray-600 line-clamp-1">
                                                        {req.lastMessage.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(req.lastMessage.createdAt).toLocaleString()}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-sm text-gray-500">No messages yet</p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center">
                        <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <h3 className="mb-2 text-lg font-semibold">No conversations yet</h3>
                        <p className="mb-4 text-gray-600">
                            Submit a requirement to start chatting with travel agents
                        </p>
                        <Link href="/requirements/new">
                            <Button>Submit Requirement</Button>
                        </Link>
                    </Card>
                )}
            </div>
        </div>
    )
}
