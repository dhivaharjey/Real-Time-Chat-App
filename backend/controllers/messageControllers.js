import expressAsyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
export const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(404).json({ error: "Not Found" });
  }
  const newMessage = {
    sender: req.user.id,
    content: content,
    chat: chatId,
  };
  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name picture");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name picture email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    return res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: "Internal Error" });
  }
});

export const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const reqChatId = req.params.chatId;

    const messages = await Message.find({ chat: reqChatId })
      .populate("sender", "name picture email")
      .populate("chat");
    return res.status(200).json(messages);
  } catch (error) {
    res.status(404).json({ error: "Chat  is not found" });
  }
});
