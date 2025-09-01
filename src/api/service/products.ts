import { axiosInstance } from "@/lib";
import { Product, ProductsQueryParams, ProductsResponse } from "@/types";

const fetchProducts = async ({
  pageParam = 1,
  queryKey,
}: any): Promise<ProductsResponse> => {
  const [, params] = queryKey;
  const searchParams = new URLSearchParams();

  searchParams.append("page", pageParam.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.category) searchParams.append("category", params.category);
  if (params.search) searchParams.append("search", params.search);
  if (params.minPrice)
    searchParams.append("minPrice", params.minPrice.toString());
  if (params.maxPrice)
    searchParams.append("maxPrice", params.maxPrice.toString());
  if (params.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

  const response = await axiosInstance.get(
    `/products?${searchParams.toString()}`
  );
  return response.data;
};

const fetchProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const productApi = {
  fetchProducts,
  fetchProductById,
};
