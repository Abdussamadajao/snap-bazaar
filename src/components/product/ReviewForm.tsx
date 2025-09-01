import React, { useState } from "react";
import { Star, MessageSquare, Edit3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSubmit: (data: {
    productId: string;
    rating: number;
    title?: string;
    comment?: string;
  }) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  existingReview?: {
    id: string;
    rating: number;
    title?: string;
    comment?: string;
  } | null;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  productName,
  onSubmit,
  onCancel,
  isLoading = false,
  existingReview,
}) => {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [hoveredRating, setHoveredRating] = useState(0);

  const isEditing = !!existingReview;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }

    if (rating < 1) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await onSubmit({
        productId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim() || undefined,
      });

      // Reset form after successful submission
      if (!isEditing) {
        setRating(5);
        setTitle("");
        setComment("");
      }

      toast.success(
        isEditing
          ? "Review updated successfully!"
          : "Review submitted successfully!"
      );
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      // Reset to original values when editing
      setRating(existingReview.rating);
      setTitle(existingReview.title || "");
      setComment(existingReview.comment || "");
    } else {
      // Reset to defaults when creating new
      setRating(5);
      setTitle("");
      setComment("");
    }
    onCancel?.();
  };

  if (!user) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
        <CardContent className="p-6 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Sign in to leave a review
          </h3>
          <p className="text-gray-600 mb-4">
            Share your thoughts about this product with other customers
          </p>
          <Button
            onClick={() => {
              /* Navigate to login */
            }}
            className="bg-primary hover:bg-primary-foreground"
          >
            Sign In to Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Your Review" : "Write a Review"}
          </CardTitle>
          {isEditing && (
            <Badge variant="secondary" className="text-xs">
              Editing
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">
          Reviewing:{" "}
          <span className="font-medium text-gray-900">{productName}</span>
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  <Star
                    className={`h-8 w-8 transition-all duration-200 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </div>
          </div>

          {/* Title Field */}
          <div className="space-y-2">
            <Label
              htmlFor="review-title"
              className="text-sm font-medium text-gray-700"
            >
              Review Title (Optional)
            </Label>
            <Input
              id="review-title"
              type="text"
              placeholder="Summarize your experience..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="border-gray-300 focus:border-primary focus:ring-primary"
            />
            <div className="text-xs text-gray-500 text-right">
              {title.length}/100
            </div>
          </div>

          {/* Comment Field */}
          <div className="space-y-2">
            <Label
              htmlFor="review-comment"
              className="text-sm font-medium text-gray-700"
            >
              Review Comment (Optional)
            </Label>
            <Textarea
              id="review-comment"
              placeholder="Share your detailed thoughts about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
              className="border-gray-300 focus:border-primary focus:ring-primary resize-none"
            />
            <div className="text-xs text-gray-500 text-right">
              {comment.length}/500
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading || rating < 1}
              className="flex-1 bg-primary hover:bg-primary-foreground"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isEditing ? "Updating..." : "Submitting..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <Edit3 className="h-4 w-4" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                  {isEditing ? "Update Review" : "Submit Review"}
                </div>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
