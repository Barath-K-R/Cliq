import ThreadMembersModel from "../models/ThreadMembersModel.js";
import ThreadModel from "../models/ThreadModel.js";
import MessageModel from "../models/MessageModel.js";

export const createThread = async (req, res) => {
  console.log(req.body);
  const { chatId, sender_id, head, userIds, message } = req.body;
  try {
    if (head) {
      const message = await MessageModel.findByPk(head);
      if (!message) {
        return res.status(404).json({ error: "Head message not found." });
      }
    }

    const thread = await ThreadModel.create({
      chat_id: chatId,
      head,
    });

    // Update the head message to set the thread_id
    await MessageModel.update(
      { thread_id: thread.id, is_thread_head: true },
      { where: { id: head } }
    );

    // Preparing thread members for bulk creation
    const threadMembers = userIds.map((user_id) => ({
      thread_id: thread.id,
      user_id,
    }));
    await ThreadMembersModel.bulkCreate(threadMembers);

    const newMessage = await MessageModel.create({
      chat_id: chatId,
      thread_id: thread.id,
      sender_id,
      message,
    });

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error creating thread:", error);
    return res.status(500).json({ error: "Failed to create thread." });
  }
};

export const addMessageToThread = async (req, res) => {
  const { thread_id, sender_id, message, chatId } = req.body;

  if (!thread_id || !sender_id || !message || !chatId) {
    return res.status(400).json({ error: "some fields are missing" });
  }

  try {
    //adding new message in the thread
    const newMessage = await MessageModel.create({
      chat_id: chatId,
      sender_id,
      thread_id,
      message,
    });

    //checking whether the user already a member in thread'
    const existingMember = await ThreadMembersModel.findOne({
      where: { thread_id, user_id: sender_id },
    });

    let newThreadMember = null;

    if (!existingMember) {
      newThreadMember = await ThreadMembersModel.create({
        thread_id,
        user_id: sender_id,
      });
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error adding message to thread:", error);
    return res.status(500).json({ error: "Failed to add message to thread." });
  }
};
