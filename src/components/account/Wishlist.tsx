import { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Eye,
  Star,
  Minus,
  Plus,
  Package,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNGN } from "@/utils/currency";
import useCartStore from "@/store/cart";
import { useCartMutations } from "@/api";
import { useAuthStore } from "@/store/auth";
import { Link } from "react-router-dom";
import { PATH } from "@/routes/paths";

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    description?: string;
    shortDescription?: string;
    price: number;
    comparePrice?: number;
    images: Array<{ id: string; url: string; alt?: string }>;
    _count: { reviews: number };
    isActive: boolean;
  };
  createdAt: string;
}

interface WishlistProps {
  items?: WishlistItem[];
  onRemoveFromWishlist?: (itemId: string) => void;
  onViewProduct?: (productId: string) => void;
}

const Wishlist: React.FC<WishlistProps> = ({
  items = [],
  onRemoveFromWishlist,
  onViewProduct,
}) => {
  const { items: cartItems } = useCartStore();
  const { addToCart, updateQuantity } = useCartMutations();
  const { user } = useAuthStore();

  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const handleRemoveFromWishlist = async (itemId: string) => {
    setRemovingItems((prev) => new Set(prev).add(itemId));
    try {
      await onRemoveFromWishlist?.(itemId);
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleViewProduct = (productId: string) => {
    onViewProduct?.(productId);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center">
            <Heart className="h-12 w-12 text-pink-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-pink-200 flex items-center justify-center">
            <span className="text-xs text-pink-600 font-semibold">0</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Your wishlist is empty
        </h3>
        <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
          Start building your collection of favorite products. Add items you
          love and they'll be waiting here for you.
        </p>
        <Link to={PATH.root}>
          <Button className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Package className="h-5 w-5 mr-2" />
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-full mb-6">
          <Heart className="h-8 w-8 text-pink-600" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
          My Wishlist
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your curated collection of products you love. Keep track of items you
          want to buy later.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Items
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {items.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">
                  Available
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {items.filter((item) => item.product.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  Total Value
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {formatNGN(
                    items.reduce(
                      (sum, item) =>
                        sum + parseFloat(item.product.price.toString()),
                      0
                    )
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-8">
        {items.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white hover:bg-gray-50 w-full"
          >
            <div className="relative">
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden">
                {item.product.images && item.product.images.length > 0 ? (
                  <img
                    src={item.product.images[0].url}
                    alt={item.product.images[0].alt || item.product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-3">📦</div>
                      <div className="text-gray-500 font-medium">No Image</div>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                {!item.product.isActive && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0 shadow-lg">
                    Out of Stock
                  </Badge>
                )}

                {/* Remove Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-4 right-4 h-10 w-10 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  disabled={removingItems.has(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Product Content */}
              <div className="p-3">
                {/* Product Header */}
                <div className="mb-4">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {item.product.shortDescription || item.product.description}
                  </p>
                </div>

                {/* Price and Reviews */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatNGN(item.product.price)}
                    </span>
                    {item.product.comparePrice &&
                      item.product.comparePrice > item.product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatNGN(item.product.comparePrice)}
                        </span>
                      )}
                  </div>

                  {item.product._count.reviews > 0 && (
                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-700">
                        {item.product._count.reviews}
                      </span>
                    </div>
                  )}
                </div>

                {/* Added Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                  <Calendar className="h-3 w-3" />
                  Added{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                    onClick={() => handleViewProduct(item.product.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>

                  {(() => {
                    const cartQuantity =
                      cartItems.find(
                        (cartItem) => cartItem.productId === item.product.id
                      )?.quantity || 0;

                    return cartQuantity >= 1 ? (
                      <div className="flex items-center justify-between flex-shrink-0 w-32 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-pink-500 to-red-500 h-10 shadow-lg">
                        <button
                          className="flex items-center h-full px-3 text-white border-none cursor-pointer bg-transparent hover:bg-white/20 rounded-l-lg transition-colors duration-200"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateQuantity(item.product.id, cartQuantity - 1);
                          }}
                        >
                          <Minus className="h-4" />
                        </button>
                        <span className="text-sm">{cartQuantity}</span>
                        <button
                          className="flex items-center h-full px-3 text-white border-none outline-none cursor-pointer bg-transparent hover:bg-white/20 rounded-r-lg transition-colors duration-200"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateQuantity(item.product.id, cartQuantity + 1);
                          }}
                        >
                          <Plus className="h-4" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        className="flex-1 bg-primary hover:bg-primary-foreground text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart({
                            productId: item.product.id,
                            userId: user?.id,
                            quantity: 1,
                            product: {
                              id: item.product.id,
                              name: item.product.name,
                              price: item.product.price.toString(),
                              images: item.product.images.map((image) => ({
                                id: image.id,
                                url: image.url,
                                alt: item.product.name,
                                sortOrder: 0,
                                isPrimary: true,
                              })),
                              variants: [],
                            },
                          });
                        }}
                        disabled={!item.product.isActive}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    );
                  })()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
