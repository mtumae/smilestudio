"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { useToast } from "~/hooks/use-toast"
import { Loader2, Send } from "lucide-react"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Message sent",
      description: "We'll get back to you as soon as possible.",
    })

    setName("")
    setEmail("")
    setMessage("")
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-ssblue">Send us a message</h2>
      <div className="space-y-6">
        <div>
          <Input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-ssblue focus:ring-ssblue"
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-ssblue focus:ring-ssblue"
          />
        </div>
        <div>
          <Textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-ssblue focus:ring-ssblue min-h-[150px]"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-ssblue hover:bg-ssblue/90 text-white transition-colors duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Send className="h-5 w-5 mr-2" />}
          Send Message
        </Button>
      </div>
    </form>
  )
}

