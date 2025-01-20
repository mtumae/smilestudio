"use client"

import { Search } from "lucide-react"
import { Input } from "~/components/ui/input"

export function SearchInput({ 
  className, 
  ...props 
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input {...props} className="pl-10 pr-4" />
    </div>
  )
}

