import React, { lazy, Suspense } from "react";
import { ChatState } from "../components/Context/ChatProvider";
import { Box } from "@chakra-ui/react";

const MyChats = lazy(() => import("../components/MyChats"));
const ChatBox = lazy(() => import("../components/ChatBox"));
const HeaderAndSideDrawer = lazy(() =>
  import("../components/Miscellaneous/HeaderAndSideDrawer")
);
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "../components/ErrorFallBack";
import PageLoader from "../Utils/Page Loading/PageLoader";

const ChatPage = () => {
  const { user } = ChatState();
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <div style={{ width: "100%" }}>
          {user && (
            <ErrorBoundary FallbackComponent={ErrorFallBack}>
              <HeaderAndSideDrawer />
            </ErrorBoundary>
          )}
          <Box
            display="flex"
            justifyContent="space-between"
            w="100%"
            h="91.5vh"
            p="10px"
          >
            {user && (
              <ErrorBoundary FallbackComponent={ErrorFallBack}>
                <MyChats />
              </ErrorBoundary>
            )}

            {user && (
              <ErrorBoundary FallbackComponent={ErrorFallBack}>
                <ChatBox />
              </ErrorBoundary>
            )}
          </Box>
        </div>
      </Suspense>
    </>
  );
};

export default ChatPage;
