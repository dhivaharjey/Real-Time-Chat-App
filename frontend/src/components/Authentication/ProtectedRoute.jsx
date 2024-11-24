import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Outlet } from "react-router-dom";
import SessionLogOut from "../Context/SessionLogOut";

const ProtectedRoute = () => {
  const { user } = ChatState();

  return user ? <Outlet /> : <SessionLogOut />;
};

export default ProtectedRoute;
