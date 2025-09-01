import React, { useState } from "react";
import {
  Star,
  MessageSquare,
  Edit3,
  Trash2,
  Calendar,
  User,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import ReviewForm from "./ReviewForm";
import type { Review } from "@/types";

interface ProductReviewsProps {
  productId: string;
  productName: string;
  reviews: Review[];
  onAddReview: (data: {
    productId: string;
    rating: number;
    title?: string;
    comment?: string;
  }) => Promise<any>;
  onUpdateReview: (
    reviewId: string,
    data: {
      rating: number;
      title?: string;
      comment?: string;
    }
  ) => Promise<any>;
  onDeleteReview: (reviewId: string) => Promise<any>;
  isLoading?: boolean;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productName,
  reviews,
  onAddReview,
  onUpdateReview,
  onDeleteReview,
  isLoading = false,
}) => {
  const { user } = useAuthStore();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReviews, setDeletingReviews] = useState<Set<string>>(
    new Set()
  );

  // Filter reviews: approved reviews for display, user's review (including pending) for actions
  const approvedReviews = reviews.filter((review) => review.isApproved);
  const userReview = reviews.find((review) => review.userId === user?.id);
  const pendingReviews =
    userReview && !userReview.isApproved ? [userReview] : [];

  const averageRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) /
        approvedReviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: approvedReviews.filter((review) => review.rating === rating).length,
    percentage:
      approvedReviews.length > 0
        ? (approvedReviews.filter((review) => review.rating === rating).length /
            approvedReviews.length) *
          100
        : 0,
  }));

  const handleAddReview = async (data: {
    productId: string;
    rating: number;
    title?: string;
    comment?: string;
  }) => {
    try {
      await onAddReview(data);
      setShowReviewForm(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateReview = async (data: {
    rating: number;
    title?: string;
    comment?: string;
  }) => {
    if (!editingReview) return;

    try {
      await onUpdateReview(editingReview.id, data);
      setEditingReview(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setDeletingReviews((prev) => new Set(prev).add(reviewId));
    try {
      await onDeleteReview(reviewId);
      if (editingReview?.id === reviewId) {
        setEditingReview(null);
      }
    } finally {
      setDeletingReviews((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    setShowReviewForm(false);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleCancelAdd = () => {
    setShowReviewForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <p className="text-gray-600 mt-1">
            {approvedReviews.length} review
            {approvedReviews.length !== 1 ? "s" : ""} •{" "}
            {averageRating.toFixed(1)} average rating
          </p>
        </div>

        {user && !userReview && (
          <Button
            onClick={() => setShowReviewForm(true)}
            className="bg-primary hover:bg-primary-foreground"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Rating Summary */}
      {approvedReviews.length > 0 && (
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {approvedReviews.length} review
                  {approvedReviews.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <span className="text-sm text-gray-600">{rating}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-[40px] text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          productId={productId}
          productName={productName}
          onSubmit={handleAddReview}
          onCancel={handleCancelAdd}
          isLoading={isLoading}
        />
      )}

      {/* Edit Review Form */}
      {editingReview && (
        <ReviewForm
          productId={productId}
          productName={productName}
          onSubmit={handleUpdateReview}
          onCancel={handleCancelEdit}
          isLoading={isLoading}
          existingReview={editingReview}
        />
      )}

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <ThumbsUp className="h-5 w-5" />
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 text-sm">
              You have {pendingReviews.length} review
              {pendingReviews.length !== 1 ? "s" : ""} pending approval.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {approvedReviews.length > 0 ? (
        <div className="space-y-4">
          {approvedReviews.map((review) => (
            <Card key={review.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {review.userId === user?.id
                          ? "You"
                          : "Anonymous Customer"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {user?.id === review.userId && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(review)}
                        className="h-8 w-8 p-0 text-gray-600 hover:text-primary"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={deletingReviews.has(review.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {deletingReviews.has(review.id) ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {review.rating} out of 5
                  </span>
                </div>

                {/* Title */}
                {review.title && (
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {review.title}
                  </h4>
                )}

                {/* Comment */}
                {review.comment && (
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                )}

                {/* Updated indicator */}
                {review.updatedAt !== review.createdAt && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Updated {new Date(review.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* No Reviews State */
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Be the first to share your thoughts about this product. Your
              review will help other customers make informed decisions.
            </p>
            {user ? (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-primary hover:bg-primary-foreground"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Write the First Review
              </Button>
            ) : (
              <Button
                onClick={() => {
                  /* Navigate to login */
                }}
                className="bg-primary hover:bg-primary-foreground"
              >
                Sign In to Review
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductReviews;
