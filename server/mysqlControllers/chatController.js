import mysqldb from "../config/mysqlConfig.js";

export const creatingChat = async (req, res) => {
  const { chatType, name, description, userIds } = req.body;
  if (!chatType || !["direct", "group", "channel"].includes(chatType)) {
    return res.status(400).json({ error: "Invalid chat type" });
  }
  let groupName = "";
  if (chatType === "group" || chatType === "channel") groupName = name;

  let query = "insert into chats (chat_type,name,description) values (?,?,?)";

  mysqldb.query(query, [chatType, groupName, description], (err, results) => {
    if (err) throw err;
    const chatId = results.insertId;

    const values = userIds.map((userId) => [chatId, userId]);
    mysqldb.query(
      "INSERT INTO chat_members (chat_id, user_id) VALUES ?",
      [values],
      (err) => {
        if (err) throw err;
        res.status(200).json({ chatId });
      }
    );
  });
};

export const createChat = async (req, res) => {
  console.log(req.body)
  const { currentUserId, userIds, chatType,name,description} = req.body;

  const chatquery = `
      SELECT cm.chat_id, cm.user_id, c.chat_type, c.name, u.username 
      FROM chat_members cm
      JOIN chats c ON c.id = cm.chat_id
      JOIN users u ON u.id = cm.user_id
      WHERE cm.chat_id IN (
        SELECT cm.chat_id 
        FROM chat_members cm
        WHERE cm.user_id = ?
      ) AND c.chat_type =?
      AND cm.user_id = ?`;
  try {
    //if chat is direct
    if (chatType ==="direct") {
      const [results] = await mysqldb
        .promise()
        .query(chatquery, [currentUserId, chatType, userIds[0]]);

      if (results.length === 0) {
        const [chatResult] = await mysqldb
          .promise()
          .query("INSERT INTO chats (chat_type) VALUES (?)", ["direct"]);

        const chatId = chatResult.insertId;

        await mysqldb
          .promise()
          .query("INSERT INTO chat_members (chat_id, user_id) VALUES ?", [
            [
              [chatId, currentUserId],
              [chatId, userIds[0]],
            ],
          ]);


         const [newChatResults] =await mysqldb.promise().query(chatquery,[currentUserId, chatType, userIds[0]]);

        res.send({ newChat:newChatResults[0], message: "New chat created and users added." });
      } else {
        res.send(results);
      }
    }
    // if it is group
    else if(chatType==='group'){
       const [groupResult]=await mysqldb.query('insert into chats (chat_type,name,description) values (?,?,?)',[chatType,name,description]);

       const groupId=groupResult.insertId;
       const values = userIds.map((userId) => [groupId, userId]);
       await mysqldb.query('insert into chat_members (chat_id,user_id)',[values]);

       res.send({groupId,message:"new group created and the members were added successfully"});
    }
    //if it is channel
    else{
        
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
};

export const getCurrentUserChats = async (req, res) => {
  try {
    const type = req.query.type;
    const { userId } = req.params;
    console.log(type);
    if (!type || !userId) {
      return res.status(400).send({ error: "Missing required parameters" });
    }

    let query;
    const params = [userId];

    if (type === "direct") {
      console.log("Fetching chats");

      query = `
        SELECT cm.chat_id, u.id, u.username, c.name, c.chat_type 
        FROM chat_members cm
        JOIN users u ON u.id = cm.user_id
        JOIN chats c ON cm.chat_id = c.id
        WHERE cm.chat_id IN (
          SELECT chat_id 
          FROM chat_members
          WHERE user_id = ?
        ) 
        AND cm.user_id != ? 
        AND c.chat_type = ?
      `;
      params.push(userId, type);
    } else {
      console.log("Fetching groups");
      console.log(type);
      query = `
        SELECT cm.chat_id, c.name 
        FROM chat_members cm
        JOIN chats c ON cm.chat_id = c.id
        WHERE cm.user_id = ? 
        AND c.chat_type = ?
      `;
      params.push(type);
    }

    // Execute query
    const [results] = await mysqldb.promise().query(query, params);
    res.send(results);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const createGroupchat = async (req, res) => {
  const { name, description, userIds } = req.body;

  if (!name || !Array.isArray(userIds)) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const createGroupSql =
    "insert into groupchat (name,description) values (?,?)";

  mysqldb.query(createGroupSql, [name, description], (err, results) => {
    if (err) throw err;

    const groupId = results.insertId;

    const values = userIds.map((userId) => [groupId, userId]);
    const addUsersSql =
      "INSERT INTO group_members (group_id, user_id) VALUES ?";

    mysqldb.query(addUsersSql, [values], (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Failed to add users to the group" });
      }

      res
        .status(200)
        .json({ message: "Group created and users added successfully" });
    });
  });
};

export const getChatMembers = async (req, res) => {
  const { chatId } = req.params;

  let query = `select cm.chat_id,cm.user_id,u.username,u.email from chat_members cm
                join users u on u.id=cm.user_id
                where cm.chat_id=?`;
  mysqldb.query(query, [chatId], (err, results) => {
    if (err) res.status(500).send("couldnt retrieve the members");

    res.send(results);
  });
};
