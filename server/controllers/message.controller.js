import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;
    const { message } = req.body;

    if (!sender || !receiver) {
      return res
        .status(400)
        .json({ success: false, message: "Sender or receiver missing" });
    }

    let image = "";
    if (req.file) {
      try {
        const uploaded = await uploadOnCloudinary(req.file.path);
        image = uploaded?.url || "";
      } catch (err) {
        return res
          .status(500)
          .json({ success: false, message: "Cloudinary upload failed" });
      }
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    const newMessage = await Message.create({
      sender,
      receiver,
      message,
      image,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId = getReceiverSocketId(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;

    // conversation find with correct spelling "participants"
    const conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("messages");

    if (!conversation) {
      // Pehli baar chat kar rahe ho toh empty messages bhejo
      return res.status(200).json([]);
    }

    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.log("❌ getMessages Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
