"use client";

import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/trpc/react";
import { formatDistanceToNow } from "date-fns";
import { type RouterOutputs } from "~/trpc/react";

type TopReviewsOutput = RouterOutputs["review"]["getTopReviews"];
type Review = TopReviewsOutput[number];

interface ReviewCardProps {
  review: Review;
}

export function TopReviews() {
  
  const { data: reviews, isLoading } = api.review.getTopReviews.useQuery()

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Patients Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews?.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-[320px] relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>

          <div className="mb-6">
            <p className="text-gray-700 line-clamp-4">
              {review.feedback}
            </p>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.user?.image ?? undefined} />
                <AvatarFallback>
                  <User className="w-5 h-5 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">
                  {review.user?.name ?? "Anonymous User"}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Patients Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-[320px] animate-pulse">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="w-5 h-5 rounded-full bg-gray-200" />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                      <div className="h-3 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}