export const ROOT_AUTH = "/auth";
export const ROOT_PRODUCTS = "/products";
export const ROOT_CART = "/cart";
export const ROOT_CHECKOUT = "/checkout";
export const ROOT_ACCOUNT = "/account";
export const ROOT_HELP = "/help";
export const ROOT_OFFERS = "/offers";
export const ROOT_PAYMENT = "/payment";

function paths(root: string, route: string) {
  return `${root}${route}`;
}

export const PATH_AUTH = {
  root: ROOT_AUTH,
  login: paths(ROOT_AUTH, "/login"),
  signup: paths(ROOT_AUTH, "/signup"),
  forgotPassword: paths(ROOT_AUTH, "/forgot-password"),
  resetPassword: paths(ROOT_AUTH, "/reset-password"),
  verification: paths(ROOT_AUTH, "/verification"),
} as const;

export const PATH = {
  root: "/",
  products: {
    root: ROOT_PRODUCTS,
    single: (id: string | number) => {
      return paths(ROOT_PRODUCTS, `/${id}`);
    },
  },
  cart: ROOT_CART,
  checkout: ROOT_CHECKOUT,
  help: ROOT_HELP,
  offers: ROOT_OFFERS,
  account: {
    root: ROOT_ACCOUNT,
    settings: paths(ROOT_ACCOUNT, "/settings"),
    orders: paths(ROOT_ACCOUNT, "/orders"),
    orderDetails: (id: string | number) => {
      return paths(ROOT_ACCOUNT, `/orders/${id}`);
    },
    profile: paths(ROOT_ACCOUNT, "/profile"),
    wishlist: paths(ROOT_ACCOUNT, "/wishlist"),
    reviews: paths(ROOT_ACCOUNT, "/reviews"),
  },
  payment: {
    root: ROOT_PAYMENT,
    order: (id: string | number) => {
      return paths(ROOT_PAYMENT, `/${id}`);
    },
    success: paths(ROOT_PAYMENT, "/success"),
  },
} as const;
