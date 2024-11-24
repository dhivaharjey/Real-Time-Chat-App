import { Avatar, Box, Tooltip } from "@chakra-ui/react";
import React, { memo } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../Config/ChatLogics.js";
import { ChatState } from "./Context/ChatProvider";
import ScrollableFeed from "react-scrollable-feed";
import "./UsersList/SingleChats/Style.css";
const MessageContent = ({ messages }) => {
  const { user } = ChatState();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString("en-IN", options);
  };

  let lastTimestamp = null;
  return (
    <ScrollableFeed className="messages">
      {messages &&
        messages?.map((msg, index) => {
          return (
            <div key={msg._id}>
              {index > 0 &&
                Math.abs(new Date(msg.createdAt).getTime() - lastTimestamp) >
                  1800000 && (
                  <span
                    // key={msg._id}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "gray",
                      }}
                    >
                      {formatDate(msg.createdAt)}
                    </span>
                  </span>
                )}

              <div style={{ display: "none" }}>
                {index > 0 &&
                  Math.abs(new Date(msg.createdAt).getTime() - lastTimestamp) >
                    1800000 &&
                  (lastTimestamp = new Date(msg.createdAt).getTime())}
              </div>
              <div style={{ display: "flex" }}>
                {(isSameSender(messages, msg, index, user?._id) ||
                  isLastMessage(messages, index, user._id)) && (
                  <Tooltip
                    label={msg?.sender?.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      border="1px solid grey"
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={msg.sender?.name}
                      src={msg.sender?.picture}
                    />
                  </Tooltip>
                )}

                <span
                  style={{
                    backgroundColor: `${
                      msg.sender?._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    marginLeft: isSameSenderMargin(
                      messages,
                      msg,
                      index,
                      user._id
                    ),
                    // marginTop: "3px",
                    marginTop: isSameUser(messages, msg, index, user._id)
                      ? 3
                      : 10,
                  }}
                >
                  {msg?.content}
                </span>
              </div>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default memo(MessageContent);
