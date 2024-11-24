import React, { memo, useCallback, useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";

import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { getSender, getSenderFullDetail } from "../../../Config/ChatLogics";
import ProfileModel from "../../Miscellaneous/ProfileModel";
import UpdateGroupChatModal from "../../Miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./Style.css";
import MessageContent from "../../MessageContent";
import { io } from "socket.io-client";

import Loader from "../../../Utils/Loader/Loader";
const URL = import.meta.env.VITE_API_URL;
var socket, selectedChatCompare;
const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    fetchChatsAgain,
    setFetchChatsAgain,
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();
  const toast = useToast();

  useEffect(() => {
    socket = io(URL);
    socket.emit("setup", user);
    socket.on("connection", () => {
      setSocketConnected(true);
    });

    socket.on("typing", (typingUserId) => {
      if (typingUserId !== user._id) {
        setIsTyping(true);
      }
    });

    socket.on("stop-typing", (typingUserId) => {
      if (typingUserId !== user._id) {
        setIsTyping(false);
      }
    });
  }, []);
  const fetchMesaages = useCallback(async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get(`/api/message/${selectedChat._id}`, config);
      if (res.status === 200) {
        setLoading(false);
        setMessages(res.data);
        socket.emit("join-chat", selectedChat?._id);
      }
    } catch (error) {
      console.log(error);

      toast({
        title: "Error Occured, Failed !!",
        description:
          error.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to fetch Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
    }
  }, [selectedChat]);

  useEffect(() => {
    fetchMesaages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("stop-typing", selectedChat._id, user._id);
      try {
        setNewMessage("");
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const payload = {
          content: newMessage,
          chatId: selectedChat._id,
        };

        const res = await axios.post(`/api/message`, payload, config);
        if (res.status === 200) {
          setNewMessage("");
          socket.emit("send-new-message", res.data);
          setMessages([...messages, res.data]);
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Error Occured, Failed !!",
          description:
            error.response?.data?.error ||
            error?.response?.data?.message ||
            "Failed to send Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-center",
        });
      }
    }
  };
  useEffect(() => {
    socket.on("newMessage-received", (newMessageReceived) => {
      const isNewMessage =
        // selectedChatCompare &&
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id;
      if (isNewMessage) {
        if (!notification.includes(newMessageReceived)) {
          setNotification(notification.concat(newMessageReceived));
          setFetchChatsAgain(!fetchChatsAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
    return () => {
      socket.off("newMessage-received");
    };
  }, [messages, notification, selectedChatCompare]);

  const messageTypingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id, user._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 4000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        setTyping(false);
        socket.emit("stop-typing", selectedChat._id, user._id);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "flex" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat("");
                localStorage.removeItem("selectedChatId");
              }}
            />
            {!selectedChat?.isGroupChat ? (
              <>
                {getSender(user, selectedChat?.users)}
                <ProfileModel
                  user={getSenderFullDetail(user, selectedChat?.users)}
                />
              </>
            ) : (
              <>
                {selectedChat?.chatName.toUpperCase()}

                <UpdateGroupChatModal fetchMesaages={fetchMesaages} />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#e8e8e8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                h={20}
                w={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <>
                <div className="messages">
                  <MessageContent messages={messages} />
                </div>
              </>
            )}
            <FormControl isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Loader />
                </div>
              ) : (
                <></>
              )}
              <InputGroup>
                <Input
                  type="text"
                  variant="filled"
                  placeholder="Enter Message Here..."
                  value={newMessage}
                  onChange={messageTypingHandler}
                  onKeyDown={handleKeyDown}
                />
                <InputRightElement paddingRight="25px">
                  <Button
                    bg="blue.600"
                    height="1.55rem"
                    size="sm"
                    paddingInline="25px"
                    onClick={sendMessage}
                    _hover={{
                      bgColor: "blue.400",
                    }}
                  >
                    <ArrowForwardIcon boxSize={5} color="whiteAlpha.900" />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="xl" pb={3} fontFamily="Work sans">
            Click on User to start Chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default memo(SingleChat);
