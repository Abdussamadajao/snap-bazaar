export interface Product {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  images: Array<{
    id: string;
    url: string;
    sortOrder: number;
  }>;
  category: {
    id: string;
    name: string;
  };
  variants?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  attributes?: Array<{
    id: string;
    name: string;
    value: string;
  }>;
  _count: {
    reviews: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
