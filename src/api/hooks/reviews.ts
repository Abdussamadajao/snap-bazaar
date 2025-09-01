import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "../service";

// Get user's reviews
export const useReviews = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["reviews", page, limit],
    queryFn: () => reviewsApi.getReviews(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get reviews for a specific product
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ["reviews", "product", productId],
    queryFn: () => reviewsApi.getProductReviews(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get reviews for a specific product with user's own review (authenticated)
export const useProductReviewsWithUser = (
  productId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["reviews", "product", "user", productId],
    queryFn: () => reviewsApi.getProductReviewsWithUser(productId),
    enabled: !!productId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get a specific review
export const useReview = (reviewId: string) => {
  return useQuery({
    queryKey: ["reviews", reviewId],
    queryFn: () => reviewsApi.getReview(reviewId),
    enabled: !!reviewId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get review statistics
export const useReviewStats = () => {
  return useQuery({
    queryKey: ["reviews", "stats"],
    queryFn: reviewsApi.getReviewStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create review mutation
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsApi.createReview,
    onSuccess: (data) => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "stats"] });
      // Invalidate product-specific reviews
      queryClient.invalidateQueries({
        queryKey: ["reviews", "product", data.review.productId],
      });
      // Invalidate user-specific product reviews
      queryClient.invalidateQueries({
        queryKey: ["reviews", "product", "user", data.review.productId],
      });
    },
    onError: (error) => {
      console.error("Failed to create review:", error);
    },
  });
};

// Update review mutation
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: any }) =>
      reviewsApi.updateReview(reviewId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "stats"] });
      // Invalidate product-specific reviews
      queryClient.invalidateQueries({
        queryKey: ["reviews", "product", data.review.productId],
      });
      // Invalidate user-specific product reviews
      queryClient.invalidateQueries({
        queryKey: ["reviews", "product", "user", data.review.productId],
      });

      // Update specific review in cache
      queryClient.setQueryData(["reviews", variables.reviewId], {
        review: data?.review || null,
      });
    },
    onError: (error) => {
      console.error("Failed to update review:", error);
    },
  });
};

// Delete review mutation
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsApi.deleteReview,
    onSuccess: (data, variables) => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "stats"] });
      // Invalidate product-specific reviews (we need the productId from the deleted review)
      // This will be handled by the component that calls this hook
    },
    onError: (error) => {
      console.error("Failed to delete review:", error);
    },
  });
};

// Optimistic review operations
export const useReviewMutations = () => {
  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();
  const deleteMutation = useDeleteReview();

  return {
    createReview: createMutation.mutate,
    updateReview: updateMutation.mutate,
    deleteReview: deleteMutation.mutate,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};

// Product review mutations with proper cache invalidation
export const useProductReviewMutations = (productId: string) => {
  const queryClient = useQueryClient();
  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();
  const deleteMutation = useDeleteReview();

  const createProductReview = async (data: {
    productId: string;
    rating: number;
    title?: string;
    comment?: string;
  }) => {
    return createMutation.mutateAsync(data);
  };

  const updateProductReview = async (
    reviewId: string,
    data: {
      rating: number;
      title?: string;
      comment?: string;
    }
  ) => {
    return updateMutation.mutateAsync({ reviewId, data });
  };

  const deleteProductReview = async (reviewId: string) => {
    const result = await deleteMutation.mutateAsync(reviewId);
    // Invalidate product-specific reviews after deletion
    queryClient.invalidateQueries({
      queryKey: ["reviews", "product", productId],
    });
    // Invalidate user-specific product reviews after deletion
    queryClient.invalidateQueries({
      queryKey: ["reviews", "product", "user", productId],
    });
    return result;
  };

  return {
    createReview: createProductReview,
    updateReview: updateProductReview,
    deleteReview: deleteProductReview,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};
