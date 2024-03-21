import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const sendMessage = catchAsync(async (req, res, next) => {
  //Check if the message or receiverId provided is valid
  if (!req.body.message || !req.params.id) {
    return next(new AppError("Please provide a message and receiverId", 400));
  }
  const { message } = req.body;
  const { id: receiverId } = req.params;
  const { _id: senderId } = req.user;

  //1.Check if the conversation exists
  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  //2.if the conversation doesn't exist, create it
  if (!conversation) {
    const newConversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  //3.if the conversation exists, add the message to the conversation

  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });
  if (newMessage) {
    console.log(conversation.messages.push(newMessage._id));
    conversation.messages.push(newMessage._id);
  }
  //4.save the conversation and the message, they both run in parallel
  await Promise.all([conversation.save(), newMessage.save()]);

  //5.Socket functionality will go here
  res.status(201).json({
    message: "Message sent successfully",
    newMessage,
  });

  next();
});

export const getMessages = catchAsync(async (req, res, next) => {
  const { id: userToChatId } = req.params;
  const { _id: senderId } = req.user;

  //1.Check if the conversation exists
  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, userToChatId] },
  }).populate("messages");
  if (!conversation) return res.status(200).json([]);

  const messages = conversation.messages;
  res.status(200).json({
    messages,
  });
});

const messageController = {
  sendMessage,
  getMessages,
};

export default messageController;
