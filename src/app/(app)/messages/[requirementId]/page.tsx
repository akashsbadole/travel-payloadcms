import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { ArrowLeft, Paperclip, Send } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function MessagesPage({ params }: { params: { requirementId: string } }) {
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

  // Fetch requirement
  const requirement = await payload.findByID({
    collection: 'requirements',
    id: params.requirementId,
    depth: 2,
  })

  if (!requirement) {
    notFound()
  }

  // Fetch messages for this requirement
  const messages = await payload.find({
    collection: 'messages',
    where: {
      requirement: {
        equals: params.requirementId,
      },
    },
    sort: 'createdAt',
    depth: 2,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href={`/dashboard/requirements/${params.requirementId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-sm text-gray-600">
              Requirement: {requirement.serviceType.replace('-', ' ').toUpperCase()}
            </p>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="flex h-[600px] flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.docs.length > 0 ? (
              <div className="space-y-4">
                {messages.docs.map((message: any) => {
                  const isCurrentUser =
                    typeof message.sender === 'object'
                      ? message.sender.id === user.id
                      : message.sender === user.id

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-4 ${
                          isCurrentUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#e8e8e4]-100 text-gray-900'
                        }`}
                      >
                        <div className="mb-1 text-xs opacity-75">
                          {typeof message.sender === 'object'
                            ? message.sender.name || 'User'
                            : 'User'}
                        </div>
                        <div className="break-words">{message.message}</div>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 flex gap-2">
                            {message.attachments.map((attachment: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1 rounded bg-white/20 px-2 py-1 text-xs"
                              >
                                <Paperclip className="h-3 w-3" />
                                File {idx + 1}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-1 text-xs opacity-75">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="mb-2">No messages yet</p>
                  <p className="text-sm">Start the conversation below</p>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <form className="flex gap-2">
              <Button type="button" variant="outline" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input placeholder="Type your message..." className="flex-1" />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="mt-4 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Use this chat to communicate with the travel agent about your
            requirement. All messages are saved and you'll receive notifications for new messages.
          </p>
        </Card>
      </div>
    </div>
  )
}
