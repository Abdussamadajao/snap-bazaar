import React from "react";
import { Outlet } from "react-router-dom";

import { useCartQuery } from "@/api";
import { Header } from "@/components/layout";

const ProtectedLayout: React.FC = () => {
  useCartQuery();
  return (
    <div className="min-h-screen bg-primary-DEFAULT">
      <Header />
      <div className=" ">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
