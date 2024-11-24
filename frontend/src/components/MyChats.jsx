import { useEffect, useState, memo } from "react";
import { ChatState } from "./Context/ChatProvider";
import { Box, Button, Stack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSenderFullDetail } from "../Config/ChatLogics";
import GroupChatModal from "./Miscellaneous/GroupChatModal";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "./ErrorFallBack";

import ChatsListModal from "./Miscellaneous/ChatsListModal";

import GroupChatDisplay from "./Miscellaneous/GroupChatDisplay";
const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();

  const {
    user,
    setSelectedChat,
    selectedChat,
    chats,
    setChats,
    fetchChatsAgain,
    notification,
    setNotification,
  } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    if (!user) {
      throw new Error("user is not found");
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/chat`, config);

      setChats(data);
    } catch (error) {
      console.log(error);

      toast({
        title: "Failed to load the Chat",
        description: error.response?.data?.error || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [user, fetchChatsAgain]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);

    localStorage.setItem("selectedChatId", chat._id);
  };
  console.log(selectedChat);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        width={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
        h="100%"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "20px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <ErrorBoundary FallbackComponent={ErrorFallBack}>
            <GroupChatModal>
              <Button
                display="flex"
                fontSize={{ base: "12px", md: "12px", lg: "15px" }}
                rightIcon={<AddIcon />}
              >
                New Group Chat
              </Button>
            </GroupChatModal>
          </ErrorBoundary>
        </Box>
        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats?.map((chat) => {
                const getChatIds = notification?.filter((notif) => {
                  return chats?.some((chat) => chat?._id === notif?.chat?._id);
                });

                const notify = getChatIds?.filter((getChatId) => {
                  return getChatId?.chat?._id === chat._id;
                });

                return (
                  <Box
                    onClick={() => {
                      const updatedNotifications = notification?.filter(
                        (notif) => notif.chat._id !== chat._id
                      );
                      handleChatSelect(chat);
                      setNotification(updatedNotifications);
                    }}
                    cursor="pointer"
                    bg={selectedChat?._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat?._id === chat._id ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    _hover={{
                      background: "#38B2AC",
                      color: "white",
                    }}
                    h="100%"
                    // overscrollBehavior="auto"
                    key={chat._id}
                  >
                    <Box display="flex" alignItems="center" position="relative">
                      {!chat?.isGroupChat ? (
                        <ChatsListModal
                          user={getSenderFullDetail(loggedUser, chat?.users)}
                          notify={notify}
                        />
                      ) : (
                        <>
                          <GroupChatDisplay chat={chat} notify={notify} />
                        </>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default memo(MyChats);
