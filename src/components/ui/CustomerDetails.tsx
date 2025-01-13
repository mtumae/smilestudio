// components/CustomerDetails.tsx
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Separator } from "~/components/ui/separator"
import { api } from '~/trpc/react'
import { Mail, Phone, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface CustomerDetailsProps {
  open: boolean
  onClose: () => void
  customerId: string | null
}

export function CustomerDetails({
  open,
  onClose,
  customerId
}: CustomerDetailsProps) {
  const { data: customer } = api.customers.getDetails.useQuery(
    { customerId: customerId ?? '' },
    { enabled: !!customerId }
  )

  if (!customer) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Customer Details</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full py-4">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={customer.image ?? undefined} />
                <AvatarFallback>{customer.name?.[0] ?? 'C'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{customer.name}</h3>
                <div className="space-y-1 mt-1">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {customer.email}
                  </p>
                  // components/CustomerDetails.tsx (continued)
                  {customer.phone && (
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {customer.phone}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Customer since {format(new Date(customer.createdAt), 'MMMM yyyy')}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Conversation Stats */}
            <div>
              <h4 className="font-medium mb-3">Conversation History</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-semibold">{customer.stats.totalConversations}</div>
                  <div className="text-sm text-gray-500">Total conversations</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-semibold">
                    {customer.stats.averageResponseTime}m
                  </div>
                  <div className="text-sm text-gray-500">Avg. response time</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="font-medium mb-3">Recent Activity</h4>
              <div className="space-y-4">
                {customer.recentActivity.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(activity.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            {customer.additionalDetails && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">Additional Information</h4>
                  <dl className="space-y-2">
                    {Object.entries(customer.additionalDetails).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm text-gray-500">{key}</dt>
                        <dd className="text-sm text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}