import { useCartQuery } from "@/api";
import { Cart } from "@/components/cart";
import React from "react";
import { Outlet } from "react-router-dom";

const CartLayout: React.FC = () => {
  const { data: cart } = useCartQuery();
  return (
    <div className="min-h-screen bg-primary-DEFAULT">
      <Outlet />
      {cart && <Cart />}
    </div>
  );
};

export default CartLayout;
