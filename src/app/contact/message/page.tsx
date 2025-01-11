'use client'

import React, { useState, useEffect, useRef } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { api } from '~/trpc/react'
import { pusherClient } from '~/lib/pusher'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent } from "~/components/ui/card"
import { Loader2, MessageSquare, Send, Phone } from 'lucide-react'
import { useToast } from '~/hooks/use-toast'
import { cn } from "~/lib/utils"
import Image from 'next/image'

export default function ContactPage() {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const { data: messages, refetch: refetchMessages } = api.messages.getCustomerMessages.useQuery(
    undefined,
    { enabled: !!session }
  )

  const sendMessage = api.messages.createCustomerMessage.useMutation({
    onSuccess: () => {
      setMessage('')
      void refetchMessages()
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    },
  })

  useEffect(() => {
    if (!session?.user?.id) return;
    const channel = pusherClient.subscribe(`customer-${session.user.id}`)
    channel.bind('new-message', () => void refetchMessages())
    return () => pusherClient.unsubscribe(`customer-${session.user.id}`)
  }, [session?.user?.id, refetchMessages])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0
    }
  }, [messages])

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={180}
                height={60}
                className="mx-auto mb-6 hover:scale-105 transition-transform duration-300"
              />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
              <p className="text-gray-600 mb-8">Please sign in to contact our team</p>
              <Button 
                onClick={() => signIn("google", { callbackUrl: '/chat' })}
                className="w-full bg-ssblue hover:bg-ssblue/90 text-lg py-6"
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-[100dvh] bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto shadow-xl">
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={40}
              className="hover:scale-105 transition-transform duration-300"
            />
            <div className="h-6 w-px bg-gray-200" />
            <span className="text-gray-600">Chat with our team</span>
          </div>
          <a 
            href="tel:123-456-7890" 
            className="flex items-center text-ssblue hover:text-ssblue/80 transition-colors"
          >
            <Phone className="h-4 w-4 mr-2" />
            <span className="font-medium">123-456-7890</span>
          </a>
        </div>

        {/* Messages - Inverted scroll */}
        <div 
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto flex flex-col-reverse p-4 bg-gray-50"
        >
          {messages?.slice().map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex mb-4 items-end",
                msg.responseContent ? "justify-start" : "justify-end"
              )}
            >
              {msg.responseContent && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/logo.png" />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                msg.responseContent 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "bg-ssblue text-white"
              )}>
                <p className="whitespace-pre-wrap">
                  {msg.responseContent ?? msg.content}
                </p>
                <span className={cn(
                  "text-xs block mt-1",
                  msg.responseContent ? "text-gray-500" : "text-white/80"
                )}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            if (message.trim()) {
              sendMessage.mutate({ content: message.trim() })
            }
          }} 
          className="p-4 bg-white border-t"
        >
          <div className="flex items-center gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="h-12 px-4 transition-all duration-300 focus:ring-2 focus:ring-ssblue"
            />
            <Button 
              type="submit" 
              disabled={!message.trim() || sendMessage.isPending}
              className="h-12 px-6 bg-ssblue hover:bg-ssblue/90 transition-all duration-300"
            >
              {sendMessage.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}