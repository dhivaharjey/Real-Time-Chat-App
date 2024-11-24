import React, { lazy, Suspense } from "react";
import { ChatState } from "./Context/ChatProvider";
import { Box, Spinner } from "@chakra-ui/react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "./ErrorFallBack";

const SingleChat = lazy(() => import("./UsersList/SingleChats/SingleChat"));

const ChatBox = () => {
  const { selectedChat } = ChatState();

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Box
          display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
          alignItems="center"
          flexDir="column"
          p={3}
          w={{ base: "100%", md: "68%" }}
          bg="white"
          borderRadius="lg"
          borderWidth="1px"
        >
          <ErrorBoundary FallbackComponent={ErrorFallBack}>
            <SingleChat />
          </ErrorBoundary>
        </Box>
      </Suspense>
    </>
  );
};

export default ChatBox;
