import Filter from "@/components/filter";
import { Product } from "@/components/product";
import { ImageSlider } from "@/components/shared";
import heroOne from "@/assets/images/hero-1.jpg";
import heroTwo from "@/assets/images/hero-2.jpg";
import React, { useState } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { useSelectedCategory } from "@/store";
import { useCategory } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";

const Home: React.FC = () => {
  const selectedCategory = useSelectedCategory();
  const { data: category, isLoading } = useCategory(
    selectedCategory === "All" ? "" : selectedCategory
  );
  useScrollToTop();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Dummy images for the slider
  const images = [
    {
      src: heroOne,
      alt: "E-commerce Banner 1",
    },
    {
      src: heroTwo,
      alt: "E-commerce Banner 2",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-10 pb-20">
        {/* Mobile & Tablet Layout */}
        <div className="lg:hidden flex flex-col gap-4">
          <div className="hidden  md:grid grid-cols-12 gap-6 lg:gap-8">
            <div className="col-span-12">
              <ImageSlider images={images} className="w-full" />
            </div>
          </div>
          {/* Mobile Products */}
          <div className="py-0">
            <Product />
          </div>
        </div>

        {/* Desktop Layout - Optimized for different screen sizes grid-cols-12 gap-6 lg:gap-8 */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)] gap-[30px] min-h-[calc(100vh-10px)] pb-10 ">
            {/* Filter Sidebar - Left side  col-span-3 lg:col-span-4 xl:col-span-2 2xl:col-span-3*/}
            <div className="">
              <div className="sticky top-[120px] h-[calc(100vh-120px)] ">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Categories
                  </h2>
                  <Filter />
                </div>
              </div>
            </div>
            {/* col-span-9 lg:col-span-8 xl:col-span-10 2xl:col-span-9 overflow-y-auto flex flex-col gap-4 */}

            {/* Main Content Area - Center */}
            <main className="flex flex-col gap-4">
              <ImageSlider images={images} className="w-full" />

              {/* Desktop Header with View Toggle */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-semibold text-gray-900">
                      Products
                    </h1>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {isLoading ? (
                        <Skeleton className="w-20 h-4" />
                      ) : (
                        category?.name || "All Categories"
                      )}
                    </span>
                  </div>

                  {/* Enhanced View Mode Toggle */}
                  <div className="flex items-center space-x-4">
                    {/* View Options */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 font-medium">
                        View:
                      </span>
                      <div className="flex bg-gray-100 rounded-lg p-1">
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className={`h-9 px-4 transition-all duration-200 ${
                            viewMode === "grid"
                              ? "bg-primary hover:bg-primary-foreground shadow-sm text-white"
                              : "hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <Grid className="w-4 h-4 mr-2" />
                          Grid
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className={`h-9 px-4 transition-all duration-200 ${
                            viewMode === "list"
                              ? "bg-primary hover:bg-primary-foreground shadow-sm text-white"
                              : "hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <List className="w-4 h-4 mr-2" />
                          List
                        </Button>
                      </div>
                    </div>

                    {/* Sort Options */}
                  </div>
                </div>
              </div>

              {/* Desktop Products */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Product viewMode={viewMode} />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
