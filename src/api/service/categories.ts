import { axiosInstance } from "@/lib";
import type { Category } from "@/types";

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

const fetchCategory = async (id: string): Promise<Category> => {
  const response = await axiosInstance.get(`/categories/${id}`);
  return response.data;
};

export const categoryApi = {
  fetchCategories,
  fetchCategory,
};
