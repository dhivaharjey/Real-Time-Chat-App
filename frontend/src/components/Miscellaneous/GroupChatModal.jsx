import {
  Box,
  Button,
  FormControl,
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
import React, { memo, useCallback } from "react";
import { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UsersList/UserListItem";
import UserBadgeItem from "../UsersList/UserBadgeItem";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "../ErrorFallBack";

const GroupChatModal = ({ children }) => {
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { api, chats, user, setChats } = ChatState();
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
        description: error.response.data?.error || error.response.data?.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
    }
  };
  const handleCloseModal = () => {
    onClose();
    setSearchResult([]);
    setSelectedUsers([]);
  };
  const handleGroup = useCallback(
    (addUser) => {
      if (selectedUsers.includes(addUser)) {
        toast({
          title: "User already added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-center",
        });
      } else {
        setSelectedUsers([...selectedUsers, addUser]);
      }
    },
    [selectedUsers]
  );
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill All the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const payload = {
        name: groupChatName,
        users: JSON.stringify(selectedUsers?.map((u) => u._id)),
      };
      const { data } = await axios.post(`/api/chat/group`, payload, config);

      setChats([data, ...chats]);
      handleCloseModal();
      toast({
        title: "New Group Chat is created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
    } catch (error) {
      toast({
        title: "Failed to create Chat",
        description: error?.response?.data?.error,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
    }
  };

  const handleDelete = useCallback(
    (deleteUser) => {
      console.log("input id", deleteUser);

      setSelectedUsers(
        selectedUsers?.filter((select) => {
          return select._id !== deleteUser._id;
        })
      );
    },
    [selectedUsers]
  );
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                type="text"
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Add users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers?.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            {loading ? (
              <Spinner />
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <ErrorBoundary FallbackComponent={ErrorFallBack}>
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                </ErrorBoundary>
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default memo(GroupChatModal);
