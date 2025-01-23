'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '~/trpc/react'
import { StartConversationDialog } from '../../components/StartConversation'
import { Button } from '../../components/ui/button'
import { ScrollArea } from "../../components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Loader2, MessageSquare, Menu, X } from 'lucide-react'
import { cn } from "../../lib/utils"
import Image from 'next/image'
import { pusherClient } from '~/lib/pusher'

export default function ChatPage() {
  const router = useRouter()
  const { data: conversations, isLoading, refetch: refetchConversations } = api.chat.getConversations.useQuery()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Subscribe to all conversations for updates
    conversations?.forEach((conv) => {
      const channel = pusherClient.subscribe(`chat-${conv.conversation.id}`)
      channel.bind('new-message', () => {
        void refetchConversations()
      })
    })

    return () => {
      // Cleanup subscriptions
      conversations?.forEach((conv) => {
        pusherClient.unsubscribe(`chat-${conv.conversation.id}`)
      })
    }
  }, [conversations, refetchConversations])

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
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-black flex items-center">
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
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-ssblue" />
            </div>
          ) : conversations && conversations.length > 0 ? (
            <div className="p-2">
              {conversations.map((conv) => (
                <button
                  key={conv.conversation.id}
                  onClick={() => {
                    router.push(`/chat/${conv.conversation.id}`)
                    setIsSidebarOpen(false)
                  }}
                  className={cn(
                    "flex items-center w-full p-3 rounded-lg mb-1 transition-colors text-black",
                    "hover:bg-gray-50 active:bg-gray-100"
                  )}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={conv.otherUser.image ?? undefined} />
                    <AvatarFallback className="bg-gray-200 text-black">
                      {conv.otherUser.name?.[0] ?? 'SS'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left min-w-0">
                    <p className="font-medium truncate text-black">{conv.otherUser.name}</p>
                    <p className="text-xs text-gray-600 truncate">
                      {conv.conversation.subject ?? 'No subject'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {conv.lastMessage?.content ?? 'No messages yet'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-gray-600 mb-4">No conversations yet</p>
              <StartConversationDialog />
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2 text-black"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-black truncate">Welcome to Chat</h1>
          </div>
          <StartConversationDialog />
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg w-full">
              <div className="bg-blue-50 rounded-full p-4 mb-6 inline-block">
                <Image src="/logo.png" alt="Chat" width={100} height={100} />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-black">Start a Conversation</h2>
              <p className="text-base text-gray-600 mb-6">
                Talk to our support team through instant messaging.
              </p>
              <div className="space-y-4">
                <StartConversationDialog />
                {conversations && conversations.length > 0 && (
                  <p className="text-sm text-gray-600">
                    or select a conversation from the sidebar to continue chatting
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}