import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import UserBadgeItem from "../UsersList/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UsersList/UserListItem";
const UpdateGroupChatModal = ({ fetchMesaages }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    fetchChatsAgain,
    setFetchChatsAgain,
  } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [renameLoading, setRenameLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleRename = async () => {
    if (!groupChatName) return;
    const isGroupAdmin = selectedChat?.groupAdmin._id === user._id;
    if (!isGroupAdmin) {
      toast({
        title: "Only admins can Change Name",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const payload = {
        chatId: selectedChat._id,
        chatName: groupChatName,
      };
      const { data } = await axios.put(
        "api/chat/rename-group",
        payload,
        config
      );
      if (data) {
        setRenameLoading(false);
        setGroupChatName("");
        setFetchChatsAgain(!fetchChatsAgain);
        setSelectedChat(data);
        toast({
          title: "Success",
          description: "Group Name Changed Successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      console.log(error);

      toast({
        title: "Failed to update the  Group Chat Name",
        description: error.response?.data?.error || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      setRenameLoading(false);
    }
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get(`/api/user?search=${search}`, config);

      if (res.status === 200) {
        setLoading(false);
        setSearchResult(res.data);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!!",
        description:
          error.response?.data?.error || error?.response?.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
    }
  };
  const handleAddNewUserToGroup = async (newUser) => {
    const isUserExists = selectedChat?.users?.find(
      (u) => u._id === newUser._id
    );
    const isGroupAdmin = selectedChat?.groupAdmin._id === user._id;

    if (isUserExists) {
      toast({
        title: "User is Already in the group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }
    if (!isGroupAdmin) {
      toast({
        title: "Only admins can add members",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const payload = {
        chatId: selectedChat._id,
        userId: newUser._id,
      };

      const res = await axios.put("api/chat/add-to-group", payload, config);
      console.log(res);

      if (res.status === 200) {
        console.log("added user", res);
        toast({
          title: "User is Added in the group",
          description: `Added user: ${newUser.name}`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-center",
        });

        setLoading(false);
        setSelectedChat(res.data);
        setFetchChatsAgain(!fetchChatsAgain);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        title: "Error Occured!!",
        description:
          error.response?.data?.error || error?.response?.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
    }
  };
  const handleClose = () => {
    onClose();
    setSearchResult([]);
  };

  const handleRemove = async (currentUser) => {
    const isRemoveUser =
      selectedChat?.groupAdmin._id !== user._id && currentUser._id !== user._id;

    if (isRemoveUser) {
      toast({
        title: "Only Admin can remove user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const payload = {
        chatId: selectedChat._id,
        userId: currentUser._id,
      };
      const res = await axios.put(
        "api/chat/remove-from-group",
        payload,
        config
      );

      if (res.status === 200) {
        toast({
          title: "User is removed from the group",
          description: `Removed User : ${currentUser.name}`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-center",
        });
        currentUser._id === user._id
          ? setSelectedChat(null)
          : setSelectedChat(res.data);

        setFetchChatsAgain(!fetchChatsAgain);
        fetchMesaages();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        title: "Error Occured!!",
        description:
          error.response?.data?.error || error?.response?.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
    }
  };
  const isAdmin = user?._id === selectedChat?.groupAdmin?._id;
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily="Work sans"
            fontSize="35px"
            display="flex"
            justifyContent="center"
          >
            {selectedChat?.chatName}
          </ModalHeader>
          <ModalCloseButton />

          {isAdmin ? (
            <ModalBody>
              <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                {selectedChat?.users?.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </Box>
              <FormControl display="flex">
                <Input
                  placeholder="Chat Name"
                  // w="70%"

                  mb={3}
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                  variant="solid"
                  colorScheme="teal"
                  ml={1}
                  isLoading={renameLoading}
                  onClick={handleRename}
                >
                  Update
                </Button>
              </FormControl>
              <FormControl display="flex">
                <Input
                  placeholder="Add user to Group"
                  // w="70%"

                  mb={3}
                  // value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>

              {loading ? (
                <Spinner size="lg" />
              ) : (
                searchResult
                  ?.slice(0, 4)
                  ?.map((u) => (
                    <UserListItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleAddNewUserToGroup(u)}
                    />
                  ))
              )}
            </ModalBody>
          ) : (
            <ModalBody>
              {selectedChat?.users.map((user) => (
                <UserListItem key={user._id} user={user} />
              ))}
            </ModalBody>
          )}

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={-2}
              onClick={() => handleRemove(user)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
