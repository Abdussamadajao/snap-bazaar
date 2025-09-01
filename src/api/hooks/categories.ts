import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCategory = (id: string | null) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["category", id],
    queryFn: () => categoryApi.fetchCategory(id ?? ""),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
