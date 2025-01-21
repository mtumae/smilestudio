"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"

interface SortOption {
  value: string
  label: string
}

interface SortSelectProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onValueChange: (value: T) => void;
}

export function SortSelect<T extends string>({ options, value, onValueChange }: SortSelectProps<T>) {
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

