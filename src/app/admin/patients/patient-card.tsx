"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardFooter } from "~/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { CalendarIcon, PhoneIcon, UserIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { useRouter } from "next/navigation"
import type { Patient } from "~/types/patient"

export function PatientCard({ patient }: { patient: Patient }) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02] bg-gradient-to-b from-white to-gray-50/50">
        <CardHeader className="pb-4 pt-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16 ring-2 ring-primary/10 ring-offset-2">
              <AvatarImage src={patient.image ?? undefined} />
              <AvatarFallback className="text-lg font-medium bg-primary/5 text-primary">
                {patient.name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold tracking-tight">
                {patient.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {patient.email}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 pb-6">
          <div className="flex items-center group">
            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center mr-3 group-hover:bg-primary/10 transition-colors">
              <PhoneIcon className="h-4 w-4 text-primary/70" />
            </div>
            <span className="font-medium">{patient.phone ?? "No phone number"}</span>
          </div>
          <div className="flex items-center group">
            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center mr-3 group-hover:bg-primary/10 transition-colors">
              <UserIcon className="h-4 w-4 text-primary/70" />
            </div>
            <span className="font-medium">
              <span className="text-lg mr-1">{patient.appointmentCount ?? 0}</span>
              {(patient.appointmentCount === 1) ? "visit" : "visits"} total
            </span>
          </div>
          <div className="flex items-center group">
            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center mr-3 group-hover:bg-primary/10 transition-colors">
              <CalendarIcon className="h-4 w-4 text-primary/70" />
            </div>
            <span className="font-medium">
              Member since{" "}
              <time dateTime={patient.createdAt.toISOString()} className="text-primary/70">
                {new Date(patient.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </span>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50/50 pt-6 pb-6">
          <Button 
            className="w-full"
            onClick={() => router.push(`/patients/${patient.id}`)}
            variant="default"
          >
            View Profile
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}