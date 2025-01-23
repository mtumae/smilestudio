'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { MessageSquare, Mail, Phone, Clock } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

export default function ContactPage() {
  const [showChatDialog, setShowChatDialog] = useState(false)
  const router = useRouter()

  const contactMethods = [
    {
      title: 'Live Chat',
      description: 'Instant support from our team',
      icon: <MessageSquare className="h-10 w-10 text-white" />,
      action: () => router.push('/chat'),
      bgColor: 'bg-gradient-to-br from-ssblue to-blue-600',
      textColor: 'text-ssblue',
      shadowColor: 'shadow-blue-500/20'
    },
    {
      title: 'WhatsApp',
      description: 'Quick responses',
      icon: <FaWhatsapp className="h-10 w-10 text-ssblue" />,
      action: () => window.open('https://wa.me/+254711279035', '_blank'),
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      textColor: 'text-green-600',
      shadowColor: 'shadow-green-500/20'
    },
    {
      title: 'Email',
      description: 'Detailed inquiries',
      icon: <Mail className="h-10 w-10 text-ssblue" />,
      action: () => window.open('mailto:support@smilestudio.com'),
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      shadowColor: 'shadow-blue-500/20'
    },
    {
      title: 'Phone',
      description: 'Direct assistance',
      icon: <Phone className="h-10 w-10 text-ssblue" />,
      action: () => window.open('tel:+254712345678'),
      bgColor: 'bg-gradient-to-br from-violet-500 to-violet-600',
      textColor: 'text-violet-600',
      shadowColor: 'shadow-violet-500/20'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
        {/* Header */}
        <div className="text-center">
          <Image 
            src="/logo.png" 
            alt="Smile Studio Logo" 
            width={200} 
            height={80} 
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Contact Our Support Team
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            We&apos;re here to help! Choose the most convenient way to connect with us.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {contactMethods.map((method) => (
            <motion.div
              key={method.title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative overflow-hidden
                bg-white rounded-2xl p-6 text-center 
                transition-all duration-300 
                border border-gray-100
                shadow-lg ${method.shadowColor}
                hover:shadow-xl
              `}
              onClick={method.action}
            >
              <div className={`
                w-20 h-20 rounded-full mb-4 mx-auto 
                flex items-center justify-center
                ${method.bgColor}
                shadow-lg group-hover:shadow-xl 
                transition-all duration-300
              `}>
                {method.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${method.textColor}`}>
                {method.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {method.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Live Chat Highlight */}
        <div className="bg-gradient-to-br from-ssblue/5 to-blue-500/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-blue-100/50">
          <div className="max-w-2xl mx-auto">
            <MessageSquare className="mx-auto h-16 w-16 text-ssblue mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="text-gray-600 mb-6">
              Our live chat support is available to help you right away. Get instant answers to your questions.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/chat')}
              className="
                bg-gradient-to-r from-ssblue to-blue-600
                text-white px-8 py-3 rounded-full 
                font-semibold shadow-lg hover:shadow-xl 
                transition-all duration-300
              "
            >
              Start Live Chat
            </motion.button>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 text-center border border-gray-100 shadow-lg">
          <Clock className="mx-auto h-12 w-12 text-ssblue mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Business Hours
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p className="font-bold">Weekdays</p>
              <p>Monday - Friday</p>
              <p>8:30 AM - 5:00 PM</p>
            </div>
            <div>
              <p className="font-bold">Weekend</p>
              <p>Saturday: 8:30 AM - 1:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Dialog */}
      {showChatDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          {/* Add your StartConversationDialog component here */}
        </div>
      )}
    </div>
  )
}