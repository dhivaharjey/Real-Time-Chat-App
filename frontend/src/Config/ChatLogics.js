export const getSender = (loggedUser, users) => {
  if (!loggedUser || !users) return null;
  return users[0]?._id === loggedUser._id ? users[1]?.name : users[0]?.name;
};

export const getSenderFullDetail = (loggedUser, users) => {
  if (!loggedUser || !users) return null;
  return users[0]?._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, msg, i, userId) => {
  return (
    i < messages.length - 1 &&
    messages[i + 1].sender?._id !== msg.sender?._id &&
    msg.sender?._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender?._id !== userId &&
    messages[messages.length - 1].sender?._id
  );
};

export const isSameSenderMargin = (messages, msg, i, userId) => {
  const isSameSenderNext =
    i < messages.length - 1 &&
    messages[i + 1]?.sender?._id === msg?.sender?._id;

  const isFromLoggedInUser = msg.sender?._id === userId;

  if (!isSameSenderNext && !isFromLoggedInUser) {
    return "0px";
  }

  if (isSameSenderNext && !isFromLoggedInUser) {
    return "33px";
  }

  return "auto";
};

export const isSameUser = (messages, msg, i) => {
  return i > 0 && messages[i - 1]?.sender?._id === msg?.sender?._id;
};
