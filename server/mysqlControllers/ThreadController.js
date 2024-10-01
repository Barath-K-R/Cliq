import ThreadMembersModel from "../models/ThreadMembersModel.js";
import ThreadModel from "../models/ThreadModel.js";
import MessageModel from "../models/MessageModel.js";

export const createThread = async (req, res) => {
  const { chat_id, sender_id, head, userIds, message } = req.body;
  try {
    if (head) {
      const message = await MessageModel.findByPk(head);
      if (!message) {
        return res.status(404).json({ error: "Head message not found." });
      }
    }

    const thread = await ThreadModel.create({
      chat_id,
      head,
    });

    // Update the head message to set the thread_id
    await MessageModel.update(
      { thread_id: thread.id },
      { where: { id: head } }
    );

    // Preparing thread members for bulk creation
    const threadMembers = userIds.map((user_id) => ({
      thread_id: thread.id,
      user_id,
    }));
    await ThreadMembersModel.bulkCreate(threadMembers);

    const newMessage = await MessageModel.create({
      chat_id,
      thread_id: thread.id,
      sender_id,
      message,
    });

    return res.status(201).json({ thread, members: threadMembers });
  } catch (error) {
    console.error("Error creating thread:", error);
    return res.status(500).json({ error: "Failed to create thread." });
  }
};

export const addMessageToThread = async (req, res) => {
  const { thread_id, userId, message, chat_id } = req.body;

  if (!thread_id || !userId || !message || !chat_id) {
    return res.status(400).json({ error: "some fields are missing" });
  }

  try {
    //adding new message in the thread
    const newMessage = await MessageModel.create({
      chat_id,
      sender_id: userId,
      thread_id,
      message,
    });

    //checking whether the user already a member in thread'
    const existingMember = await ThreadMembersModel.findOne({
      where: { thread_id, user_id: userId },
    });

    let newThreadMember = null;

    if (!existingMember) {
      newThreadMember = await ThreadMembersModel.create({
        thread_id,
        user_id: userId,
      });
    }

    return res.status(201).json({
      message: "message added successfully.",
      members: newThreadMember,
      message: newMessage,
    });
  } catch (error) {
    console.error("Error adding message to thread:", error);
    return res.status(500).json({ error: "Failed to add message to thread." });
  }
};
