import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { productApi } from "../service/products";
import type { Product, ProductsQueryParams, ProductsResponse } from "@/types";

export const useProducts = (params: ProductsQueryParams = {}) => {
  return useInfiniteQuery({
    queryKey: ["infiniteProducts", params],
    queryFn: productApi.fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.fetchProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProductsByCategory = (category: string, limit: number = 10) => {
  return useQuery({
    queryKey: ["products", "category", category, limit],
    queryFn: () => productApi.fetchProducts({ category, limit }),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSearchProducts = (searchQuery: string, limit: number = 10) => {
  return useQuery({
    queryKey: ["products", "search", searchQuery, limit],
    queryFn: () => productApi.fetchProducts({ search: searchQuery, limit }),
    enabled: !!searchQuery.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRelatedProducts = (productId: string, limit: number = 4) => {
  const { data: productData, isLoading: productLoading } =
    useProduct(productId);

  return useQuery({
    queryKey: [
      "products",
      "related",
      productId,
      productData?.category?.id,
      limit,
    ],
    queryFn: async () => {
      if (!productData?.category?.id) {
        return {
          products: [],
          pagination: { page: 1, limit, total: 0, pages: 0 },
        };
      }

      const result = await productApi.fetchProducts({
        category: productData.category.id,
        limit: limit + 1, // +1 to account for excluding current product
      });
      return result;
    },
    enabled: !!productId && !!productData?.category?.id && !productLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    select: (data: ProductsResponse | undefined) => {
      if (!data?.products) {
        return {
          products: [],
          pagination: { page: 1, limit, total: 0, pages: 0 },
        };
      }

      const filtered = data.products
        .filter((product: Product) => product.id !== productId)
        .slice(0, limit);

      console.log(filtered);

      return {
        ...data,
        products: filtered,
      };
    },
  });
};
