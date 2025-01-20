"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { api } from "~/trpc/react"
import { useDebounce } from "~/hooks/use-debounce"
import { PatientCard } from "./patient-card"
import { SearchInput } from "~/components/ui/search-input"
import { SortSelect } from "~/components/ui/sort-select"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Skeleton } from "~/components/ui/skeleton"
import type { Patient } from "~/types/patient"

const sortOptions = [
  { value: "createdAt", label: "Date Added" },
  { value: "name", label: "Name" },
  { value: "appointmentCount", label: "Visit Count" },
] as const

export function PatientsListComponent() {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<(typeof sortOptions)[number]["value"]>("createdAt")
  const debouncedSearch = useDebounce(search, 500)
  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = api.patient.getPatients.useInfiniteQuery(
    {
      limit: 12,
      search: debouncedSearch,
      sortBy: sort,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  if (inView && hasNextPage && !isFetchingNextPage) {
    void fetchNextPage()
  }

  return (
    <div className="h-full w-full space-y-8 px-4 md:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96"
        />
        <SortSelect
          options={sortOptions}
          value={sort}
          onValueChange={setSort}
          
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <PatientsSkeleton />
          ) : (
            data?.pages.map((page) =>
              page.items.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))
            )
          )}
        </AnimatePresence>
      </div>

      <div ref={ref} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
        )}
      </div>
    </div>
  )
}

function PatientsSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-4 pt-6">
              <div className="flex items-center gap-5">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 pb-6">
              <div className="flex items-center">
                <Skeleton className="mr-3 h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center">
                <Skeleton className="mr-3 h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center">
                <Skeleton className="mr-3 h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  )
}