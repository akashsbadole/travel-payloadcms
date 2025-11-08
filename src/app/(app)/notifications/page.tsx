import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Bell, CheckCheck } from 'lucide-react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function NotificationsPage() {
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

    // Fetch user's notifications
    const notifications = await payload.find({
        collection: 'notifications',
        where: { user: { equals: user.id } },
        limit: 50,
        sort: '-createdAt',
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Notifications</h1>
                        <p className="text-gray-600">Stay updated with your travel requirements</p>
                    </div>
                    {notifications.docs.length > 0 && (
                        <Button variant="outline" size="sm">
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                {notifications.docs.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.docs.map((notification: any) => (
                            <Card key={notification.id} className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-full bg-blue-100 p-3">
                                        <Bell className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{notification.title}</h3>
                                        <p className="text-sm text-gray-600">{notification.message}</p>
                                        <p className="mt-2 text-xs text-gray-500">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center">
                        <Bell className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <h3 className="mb-2 text-lg font-semibold">No notifications yet</h3>
                        <p className="text-gray-600">
                            You'll receive notifications when agents respond to your requirements
                        </p>
                    </Card>
                )}
            </div>
        </div>
    )
}
