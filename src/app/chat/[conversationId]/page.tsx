'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '~/trpc/react'
import { pusherClient } from '~/lib/pusher'
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { StartConversationDialog } from '../../../components/StartConversation'
import { Loader2, MessageSquare, Send, Menu, X } from 'lucide-react'
import { useToast } from '../../../hooks/use-toast'
import { cn } from "../../../lib/utils"
import Image from 'next/image'

export default function ResponsiveChatPage() {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const conversationId = params?.conversationId ? parseInt(params.conversationId as string) : undefined

  const { data: conversations, isLoading: isLoadingConversations, refetch: refetchConversations } = api.chat.getConversations.useQuery()
  const { data: currentConversation } = api.chat.getConversation.useQuery(
    { conversationId: conversationId ?? 0 },
    { enabled: !!conversationId }
  )
  const { data: messages, isLoading: isLoadingMessages, refetch: refetchMessages } = api.chat.getMessages.useQuery({
    conversationId: conversationId ?? 0,
    limit: 50,
  }, {
    enabled: !!conversationId,
    retry: 3,
    refetchInterval: false,
    refetchOnWindowFocus: false
  })

  const sendMessage = api.chat.sendMessage.useMutation({
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
    if (conversationId) {
      const channel = pusherClient.subscribe(`chat-${conversationId}`)
      channel.bind('new-message', () => {
        void refetchMessages()
        void refetchConversations()
      })
      return () => {
        pusherClient.unsubscribe(`chat-${conversationId}`)
      }
    }
  }, [conversationId, refetchMessages, refetchConversations])

  useEffect(() => {
    if (messages?.length) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [messages?.length])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && conversationId) {
      sendMessage.mutate({
        conversationId,
        content: message.trim(),
      })
    }
  }

  return (
    <div className="flex h-[100dvh] bg-white text-black overflow-hidden">
  
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}


      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-full max-w-[280px] bg-white border-r border-gray-200",
        "transform transition-transform duration-200 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0"
      )}>
        <div className="flex justify-between items-center p-3 md:p-4 border-b border-gray-200">
          <h2 className="text-base md:text-lg font-semibold text-black flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-ssblue" />
            Conversations
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-black"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100dvh-4rem)]">
          {isLoadingConversations ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-ssblue" />
            </div>
          ) : (
            <div className="p-2">
              {conversations?.map((conv) => (
                <button
                  key={conv.conversation.id}
                  onClick={() => {
                    router.push(`/chat/${conv.conversation.id}`)
                    setIsSidebarOpen(false)
                  }}
                  className={cn(
                    "flex items-center w-full p-2 rounded-lg mb-1 transition-colors text-black",
                    conversationId === conv.conversation.id ? "bg-gray-100" : "hover:bg-gray-50 active:bg-gray-100"
                  )}
                >
                  <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                    <AvatarImage src={conv.otherUser.image ?? undefined} />
                    <AvatarFallback className="text-black">{conv.otherUser.name?.[0] ?? 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="text-left min-w-0">
                    <p className="font-medium truncate text-black">{conv.otherUser.name}</p>
                    <p className="text-xs text-gray-600 truncate">
                      {conv.lastMessage?.content ?? 'No messages yet'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>


      <div className="flex-1 flex flex-col min-w-0">

        <div className="bg-white border-b border-gray-200 p-3 md:p-4 flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2 flex-shrink-0 text-black"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {currentConversation ? (
              <div className="flex items-center min-w-0">
                <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                  <AvatarImage src={currentConversation.user.image ?? undefined} />
                  <AvatarFallback className="text-black">{currentConversation.user.name?.[0] ?? 'U'}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <span className="font-semibold truncate text-black block">{currentConversation.user.name}</span>
                  <span className="text-sm text-gray-600 truncate block">{currentConversation.conversation.subject}</span>
                </div>
              </div>
            ) : (
              <span className="font-semibold truncate text-black">Select a conversation</span>
            )}
          </div>
          <StartConversationDialog />
        </div>

        <ScrollArea className="flex-1 p-3 md:p-4">
          {isLoadingMessages ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-ssblue" />
            </div>
          ) : messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex mb-3 items-end gap-2",
                  msg.senderId === session?.user?.id ? "justify-end" : "justify-start"
                )}
              >
                {msg.senderId !== session?.user?.id && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src="/logo.png"
                      alt="SS"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className={cn(
                  "max-w-[85%] md:max-w-[70%] rounded-lg p-2 md:p-3",
                  msg.senderId === session?.user?.id
                    ? "bg-ssblue text-white"
                    : "bg-blue-50 text-black border border-blue-100"
                )}>
                  <p className="break-words text-sm md:text-base">{msg.content}</p>
                  <span className={cn(
                    "text-[10px] md:text-xs block mt-1",
                    msg.senderId === session?.user?.id ? "text-white/70" : "text-black/70"
                  )}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                {msg.senderId === session?.user?.id && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                    {msg.senderImage ? (
                      <Image
                        src={msg.senderImage}
                        alt="C"
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-medium">
                        C
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 text-sm">No messages yet</p>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>


        {conversationId && (
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-50 border-gray-200 text-black text-sm md:text-base h-10"
              />
              <Button 
                type="submit" 
                disabled={!message.trim() || sendMessage.isPending}
                className="h-10 px-3 md:px-4"
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}