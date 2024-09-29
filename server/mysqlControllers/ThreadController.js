import ThreadMembersModel from "../models/ThreadMembersModel.js";
import ThreadModel from "../models/ThreadModel.js";
import MessageModel from "../models/MessageModel.js";

export const createThread = async (req, res) => {
  const { chat_id, thread_id, sender_id, head, userIds, message } = req.body;
  let thread=null;
  try {
    if (head) {
      const message = await MessageModel.findByPk(head);
      if (!message) {
        return res.status(404).json({ error: "Head message not found." });
      }
    }

    if (!thread_id) {
      thread = await ThreadModel.create({
        chat_id,
        head,
      });
    }

    if (userIds.length == 0) {
      // Preparing thread members for bulk creation
      const threadMembers = userIds.map((user_id) => ({
        thread_id: thread.id,
        user_id,
      }));
      await ThreadMembersModel.bulkCreate(threadMembers);
    }

    if (!thread_id) {
      // Update the head message to set the thread_id
      await MessageModel.update(
        { thread_id: thread.id }, 
        { where: { id: head } } 
      );
    }

    const newMessage=await MessageModel.create({
      chat_id,thread_id,sender_id,message
    })

    return res.status(201).json({ thread, members: threadMembers });
  } catch (error) {
    console.error("Error creating thread:", error);
    return res.status(500).json({ error: "Failed to create thread." });
  }
};

export const addThreadMembers = async (req, res) => {
  const { thread_id, userIds } = req.body;

  if (!thread_id || !Array.isArray(userIds) || userIds.length === 0) {
    return res
      .status(400)
      .json({ error: "thread_id and user_ids are required." });
  }

  try {
    // Prepare thread members for bulk creation
    const threadMembers = userIds.map((user_id) => ({
      thread_id,
      user_id,
    }));

    // Create thread members using bulkCreate
    await ThreadMembersModel.bulkCreate(threadMembers);

    return res
      .status(201)
      .json({ message: "Members added successfully.", members: threadMembers });
  } catch (error) {
    console.error("Error adding members to thread:", error);
    return res.status(500).json({ error: "Failed to add members to thread." });
  }
};
