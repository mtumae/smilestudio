"use client"

import React, { useState } from 'react'
import { api } from '~/trpc/react'
import { Button } from '~/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { useToast } from '~/hooks/use-toast'
import { Loader2, MessageCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"

export function StartConversationDialog() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
 
  const createConversation = api.chat.createConversation.useMutation()
  const { toast } = useToast()
  const router = useRouter()

  const handleStartConversation = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a subject and message.",
        variant: "destructive"
      })
      return
    }

    try {
      const result = await createConversation.mutateAsync({ 
        subject: subject.trim(),
        initialMessage: message.trim()
      })
      toast({
        title: "Conversation started",
        description: "Our team will respond to your message shortly!",
      })
      router.push(`/chat/${result.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-ssblue text-ssblue hover:bg-ssblue hover:text-white transition-colors duration-200"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask a Question
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 shadow-lg">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ssblue focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight text-black">
            Ask us a question
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <Input
              placeholder="Subject (e.g. Appointment Question)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-ssblue focus:ring-ssblue"
            />
          </div>
          <div>
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-ssblue focus:ring-ssblue min-h-[120px]"
            />
          </div>
          <Button 
            className="w-full bg-ssblue hover:bg-ssblue/90 text-white transition-colors duration-200"
            onClick={handleStartConversation}
          >
            {createConversation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : null}
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}