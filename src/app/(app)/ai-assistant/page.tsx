'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Bot, Calendar, DollarSign, Loader2, MapPin, Send, Sparkles, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type Message = {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type TravelRequirement = {
  destination?: string
  dates?: string
  budget?: string
  travelers?: number
  preferences?: string[]
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "👋 Hi! I'm your AI travel assistant. I can help you plan your perfect trip! Tell me where you'd like to go, when, and what kind of experience you're looking for.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [requirement, setRequirement] = useState<TravelRequirement>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Call AI API
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          requirement,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setRequirement(data.updatedRequirement)
      } else {
        toast.error('Failed to get response')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to get response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-linear-to-br from-purple-500 to-blue-500 p-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold">AI Travel Assistant</h1>
          <p className="text-gray-600">
            Chat with our AI to plan your perfect trip and get personalized itineraries
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="flex h-[600px] flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          message.role === 'user'
                            ? 'bg-blue-600'
                            : 'bg-linear-to-br from-purple-500 to-blue-500'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#e8e8e4]-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                        <p
                          className={`mt-1 text-xs ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-blue-500">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="rounded-2xl bg-[#e8e8e4]-100 px-4 py-3">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t p-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="text-xs"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="min-h-[60px] resize-none"
                    disabled={loading}
                  />
                  <Button onClick={handleSend} disabled={loading || !input.trim()} size="lg">
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Travel Details */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Your Travel Details</h3>
              <div className="space-y-4">
                {requirement.destination && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Destination</p>
                      <p className="text-sm text-gray-600">{requirement.destination}</p>
                    </div>
                  </div>
                )}
                {requirement.dates && (
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Dates</p>
                      <p className="text-sm text-gray-600">{requirement.dates}</p>
                    </div>
                  </div>
                )}
                {requirement.budget && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="mt-1 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Budget</p>
                      <p className="text-sm text-gray-600">₹{requirement.budget}</p>
                    </div>
                  </div>
                )}
                {!requirement.destination && (
                  <p className="text-sm text-gray-500">
                    Start chatting to fill in your travel details
                  </p>
                )}
              </div>
            </Card>

            <Card className="bg-linear-to-br from-purple-50 to-blue-50 p-6">
              <h3 className="mb-2 font-semibold">💡 Pro Tip</h3>
              <p className="text-sm text-gray-600">
                Be specific about your preferences! Mention things like budget, travel style,
                must-see attractions, and dietary requirements.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const quickActions = [
  'Plan a beach vacation',
  'Weekend getaway',
  'Family trip',
  'Adventure travel',
  'Honeymoon package',
  'Budget travel',
]
