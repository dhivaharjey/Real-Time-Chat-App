import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  });
  const [selectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState();
  const [fetchChatsAgain, setFetchChatsAgain] = useState(false);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();

  const validateToken = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const res = await axios.get("/api/user/check-auth", config);
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
        localStorage.removeItem("userInfo");
        localStorage.removeItem("selectedChatId");
      }
    }
  };
  useEffect(() => {
    if (user) validateToken();
  }, [user, selectedChat, chats, fetchChatsAgain, navigate]);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      setUser(userInfo);
    } else if (
      !userInfo &&
      user?.token &&
      window.location.pathname !== "/reset-password/:token"
    ) {
      navigate("/", { replace: true });
    }
  }, []);
  useEffect(() => {
    const savedChatId = localStorage.getItem("selectedChatId");

    if (savedChatId && chats) {
      const selected = chats?.find((chat) => chat._id === savedChatId);

      setSelectedChat(selected);
    }
  }, [chats, selectedChat]);
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchChatsAgain,
        setFetchChatsAgain,
        notification,
        setNotification,
        api,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};
