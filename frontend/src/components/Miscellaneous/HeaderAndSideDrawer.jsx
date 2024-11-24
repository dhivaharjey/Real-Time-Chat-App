import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { memo, useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";

import UserListItem from "../UsersList/UserListItem";

import { getSender } from "../../Config/ChatLogics";

const HeaderAndSideDrawer = () => {
  const [search, setSearch] = useState("");

  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("selectedChatId");
    navigate("/", { replace: true });
  };

  const handleSearch = async () => {
    setSearchResult([]);
    if (!search) {
      toast({
        title: "Please Enter Something in Search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }

    try {
      setLoading(true);
      console.log("loading", loading);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get(`/api/user?search=${search}`, config);

      if (res.status === 200) {
        setSearchResult(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);

      toast({
        title: "Error occured",
        description: error?.response?.data.error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDrawerClose = () => {
    setSearchResult([]);
    setSearch("");
    setLoadingChat(false);
    onClose();
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats?.find((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      handleDrawerClose();
    } catch (error) {
      console.log(error);

      toast({
        title: "Error Fetching the Chat",
        description: error.response.data.error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        background="white"
        width="100%"
        padding="5px 10px 5px 10px"
        borderRadius="5px"
      >
        <Tooltip label="Search User to chat" hasArrow placement="bottom-start">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text paddingInline="2" display={{ base: "none", md: "flex" }}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Connect-with-people
        </Text>
        <div>
          <Menu>
            <MenuButton padding={1}>
              <BellIcon fontSize="2xl" m={1} />
              {notification?.length > 0 ? (
                <Badge
                  paddingInline="6px"
                  position="absolute"
                  right="80px"
                  top="3px"
                  borderRadius="50%"
                  color="whiteAlpha.900"
                  bgColor="red.500"
                >
                  {notification?.length}
                </Badge>
              ) : null}
            </MenuButton>
            <MenuList pl={2}>
              {!notification?.length && "No New Messages"}
              {notification?.map((notifn) => (
                <MenuItem
                  key={notifn._id}
                  onClick={() => {
                    setSelectedChat(notifn.chat);
                    setNotification(notification.filter((n) => n !== notifn));
                  }}
                >
                  {notifn?.chat.isGroupChat
                    ? `New Mesage in ${notifn.chat.chatName}`
                    : `New Mesage from ${getSender(user, notifn.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton padding={1} as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={user?.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logOutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={handleDrawerClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default memo(HeaderAndSideDrawer);
