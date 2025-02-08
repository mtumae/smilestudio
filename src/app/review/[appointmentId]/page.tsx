"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Star, SendHorizontal, CheckCircle2 } from "lucide-react";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

export default function ReviewPage({ 
  params 
}: { 
  params: { appointmentId: string } 
}) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitReviewMutation = api.review.submitReview.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Thank you for your feedback!",
        description: "Your review has been submitted successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to submit review",
        description: error.message || "Please try again later.",
      });
    },
  });

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Please select a rating",
      });
      return;
    }

    submitReviewMutation.mutate({
      rating,
      feedback: feedback || undefined,
    });
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-50 py-12 px-4">
      <motion.div 
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <Card className="border-0 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <motion.div className="space-y-8">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-ssblue to-blue-600 bg-clip-text text-transparent mb-3">
                      How Was Your Experience?
                    </h1>
                    <p className="text-gray-600">
                      Your feedback helps us improve our services
                    </p>
                  </div>

                  <div className="flex justify-center space-x-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHoveredRating(value)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className={`relative p-2 cursor-pointer focus:outline-none transition-transform ${
                          rating === value ? 'scale-110' : ''
                        }`}
                      >
                        <Star 
                          size={48}
                          className={`transition-all duration-200 ${
                            value <= (hoveredRating || rating)
                              ? "fill-yellow-500 text-yellow-500 drop-shadow-lg"
                              : "text-gray-300"
                          } ${
                            value <= rating 
                              ? "scale-105 transform-gpu"
                              : ""
                          }`}
                          style={{
                            fill: value <= (hoveredRating || rating) ? '#EAB308' : 'none',
                            stroke: value <= (hoveredRating || rating) ? '#EAB308' : 'currentColor'
                          }}
                        />
                        {value <= rating && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 bg-yellow-400/20 rounded-full blur-sm -z-10"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {rating > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <span className="text-lg font-medium text-gray-700">
                        {rating === 5 ? "Excellent!" : 
                         rating === 4 ? "Very Good!" :
                         rating === 3 ? "Good" :
                         rating === 2 ? "Fair" : "Poor"}
                      </span>
                      <div className="flex justify-center mt-2 space-x-1">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className="fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm text-gray-600 mb-2">
                      Additional Feedback (Optional)
                    </label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share your thoughts with us..."
                      className="min-h-[120px] bg-white/50 border-gray-200 focus:bg-white transition-all"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={submitReviewMutation.isPending}
                    className="w-full bg-ssblue hover:bg-blue-600 text-white py-6 rounded-xl shadow-lg transition-all"
                  >
                    {submitReviewMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <SendHorizontal className="w-5 h-5" />
                        Submit Review
                      </div>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Thank You for Your Feedback!
              </h2>
              <p className="text-xl text-gray-600">
                We appreciate you taking the time to share your experience with us.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}