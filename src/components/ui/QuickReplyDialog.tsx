// components/QuickReplyDialog.tsx
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { ScrollArea } from "~/components/ui/scroll-area"

const QUICK_REPLIES = [
  {
    category: "Greetings",
    replies: [
      "Hello! How can I help you today?",
      "Good morning! How may I assist you?",
      "Hi there! Thank you for reaching out.",
    ]
  },
  {
    category: "Thank You",
    replies: [
      "Thank you for your patience.",
      "Thank you for bringing this to our attention.",
      "Thanks for waiting. I'm looking into this now.",
    ]
  },
  // Add more categories and replies
]

interface QuickReplyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (reply: string) => void
}

export function QuickReplyDialog({
  open,
  onOpenChange,
  onSelect
}: QuickReplyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Quick Replies</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {QUICK_REPLIES.map((category) => (
            <div key={category.category} className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.replies.map((reply) => (
                  <Button
                    key={reply}
                    variant="outline"
                    className="w-full justify-start h-auto whitespace-normal text-left"
                    onClick={() => onSelect(reply)}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}