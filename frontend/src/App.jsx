import "./App.css";
import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import axios from "axios";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "./components/ErrorFallBack";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";
import PageLoader from "./Utils/Page Loading/PageLoader";

const HomePage = lazy(() => import("./pages/HomePage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const ForgetPassword = lazy(() =>
  import("./components/Authentication/ForgetPassword")
);
const ResetPassword = lazy(() =>
  import("./components/Authentication/ResetPassword")
);
const apiBaseUrl = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = apiBaseUrl;

const App = () => {
  return (
    <>
      <div className="app">
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/forget-passowrd" element={<ForgetPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route
                index
                path="/"
                element={<HomePage />}
                errorElement={ErrorFallBack}
              />

              <Route element={<ProtectedRoute />}>
                <Route path="/chats" element={<ChatPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default App;
