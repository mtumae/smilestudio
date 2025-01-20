"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"

interface SortOption {
  value: string
  label: string
}

interface SortSelectProps {
  options: SortOption[]
  value: string
  onValueChange: (value: string) => void
}

export function SortSelect({ options, value, onValueChange }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

