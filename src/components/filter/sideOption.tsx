import React from "react";
import {
  SprayCan,
  Milk,
  ChefHat,
  PieChart,
  Wine,
  Heart,
  CarFront,
  Book,
  Unplug,
  Handbag,
  Rose,
  Bike,
  Shapes,
  Coffee,
} from "lucide-react";

interface SideOptionItem {
  category: string;
  icon: React.ReactNode;
}

export const data: SideOptionItem[] = [
  {
    category: "automotive",
    icon: <CarFront strokeWidth={0.9} className="h-12 w-12 " />,
  },
  {
    category: "books-media",
    icon: <Book strokeWidth={0.9} className="h-12 w-12" />,
  },
  {
    category: "electronics",
    icon: <Unplug strokeWidth={0.9} className="h-12 w-12" />,
  },
  {
    category: "fashion",
    icon: <Handbag strokeWidth={0.9} className="h-12 w-12" />,
  },
  {
    category: "health-beauty",
    icon: <Handbag strokeWidth={0.9} className="h-12 w-12" />,
  },
  {
    category: "home-garden",
    icon: <Rose strokeWidth={0.9} className="h-12 w-12" />,
  },
  {
    category: "sports-outdoors",
    icon: <Bike strokeWidth={0.9} className="h-12 w-12 " />,
  },
  {
    category: "toys-games",
    icon: <Shapes strokeWidth={0.9} className="h-12 w-12 " />,
  },
  // {
  //   category: "Beverage",
  //   icon: <Coffee strokeWidth={0.5} className="h-8 w-8 " />,
  // },
  // {
  //   category: "Beauty & Health",
  //   icon: <Heart strokeWidth={0.5} className="h-8 w-8 " />,
  // },
];
