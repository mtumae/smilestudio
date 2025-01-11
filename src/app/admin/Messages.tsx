'use client'

import React, { useState, useEffect } from 'react'
import { api } from '~/trpc/react'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Loader2, Search, Send, Bell, MoreVertical, PhoneCall, Mail } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from "~/lib/utils"
import { pusherClient } from '~/lib/pusher'
import { useToast } from "~/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

type Message = {
  id: number
  content: string
  customerId: number
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  status: 'read' | 'unread'
  createdAt: string
  responseContent?: string
}

type PusherMessage = Message

export default function AdminMessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()
  
  const { data: messages, refetch, setData } = api.messages.getMessages.useQuery({
    limit: 50,
    search: searchQuery
  })

  useEffect(() => {
    const channel = pusherClient.subscribe('business-inbox')

    channel.bind('new-message', (newMessage: PusherMessage) => {
      setData((currentMessages) => {
        if (!currentMessages) return [newMessage]
        return [newMessage, ...currentMessages]
      })
      
      toast({
        title: "New Message",
        description: `New message from ${newMessage.customerName || `Patient #${newMessage.customerId}`}`,
      })
    })

    channel.bind('message-updated', (updatedMessage: PusherMessage) => {
      setData((currentMessages) => {
        if (!currentMessages) return [updatedMessage]
        return currentMessages.map(msg => 
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      })
    })

    channel.bind('new-reply', (messageWithReply: PusherMessage) => {
      setData((currentMessages) => {
        if (!currentMessages) return [messageWithReply]
        return currentMessages.map(msg =>
          msg.id === messageWithReply.id ? messageWithReply : msg
        )
      })
    })

    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe('business-inbox')
    }
  }, [setData, toast])

  const sendReply = api.messages.respondToMessage.useMutation({
    onSuccess: (response, variables) => {
      setReplyContent('')
      
      setData((currentMessages) => {
        if (!currentMessages) return currentMessages
        return currentMessages.map(msg =>
          msg.id === variables.messageId 
            ? { ...msg, responseContent: variables.content, status: 'read' }
            : msg
        )
      })

      toast({
        title: "Reply sent",
        description: "Your response has been sent to the patient.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive"
      })
    }
  })

  const markAsRead = api.messages.markMessageAsRead.useMutation({
    onSuccess: (_, messageId) => {
      setData((currentMessages) => {
        if (!currentMessages) return currentMessages
        return currentMessages.map(msg =>
          msg.id === messageId 
            ? { ...msg, status: 'read' }
            : msg
        )
      })
    }
  })

  const selectedMessageData = messages?.find(m => m.id === selectedMessage)
  const unreadCount = messages?.filter(m => m.status === 'unread').length || 0

  return (
    <div className="h-[100dvh] flex flex-col bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patient Messages</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[400px] border-r bg-white flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="pl-9 bg-gray-50 border-0"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {messages?.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg.id)
                  if (msg.status === 'unread') {
                    markAsRead.mutate(msg.id)
                  }
                }}
                className={cn(
                  "w-full text-left p-4 border-b transition-colors",
                  selectedMessage === msg.id 
                    ? "bg-blue-50 hover:bg-blue-50" 
                    : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {msg.customerName?.[0] ?? 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">
                        {msg.customerName || `Patient #${msg.customerId}`}
                      </p>
                      <span className="text-xs text-gray-500">
                        {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {msg.content}
                    </p>
                    {msg.status === 'unread' && (
                      <Badge variant="default" className="mt-2 bg-blue-100 text-blue-600 hover:bg-blue-100">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white">
          {selectedMessageData ? (
            <>
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {selectedMessageData.customerName?.[0] ?? 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-lg">
                        {selectedMessageData.customerName || `Patient #${selectedMessageData.customerId}`}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {format(new Date(selectedMessageData.createdAt), 'MMMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedMessageData.customerPhone && (
                      <Button variant="outline" size="sm">
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    )}
                    {selectedMessageData.customerEmail && (
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View patient history</DropdownMenuItem>
                        <DropdownMenuItem>Mark as urgent</DropdownMenuItem>
                        <DropdownMenuItem>Transfer conversation</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{selectedMessageData.content}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {selectedMessageData.responseContent && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Previous Response:</p>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="whitespace-pre-wrap">{selectedMessageData.responseContent}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-white">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (replyContent.trim()) {
                      sendReply.mutate({
                        messageId: selectedMessage,
                        content: replyContent.trim()
                      })
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Input
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1"
                    />
                    <Button 
                      type="submit"
                      disabled={!replyContent.trim() || sendReply.isPending}
                      className="px-6"
                    >
                      {sendReply.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Reply
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a message to view and reply
            </div>
          )}
        </div>
      </div>
    </div>
  )
}