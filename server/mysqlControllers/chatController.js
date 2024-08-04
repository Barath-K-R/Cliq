import mysqldb from '../config/mysqlConfig.js'

export const creatingChat = async (req, res) => {
  const {senderId,receiverId}=req.body;
  let query='insert into chats (is_group_chat) values (?)'

  mysqldb.query(query,[false],(err,results)=>{
    if(err) throw err;
    const chatId = results.insertId;

    mysqldb.query('INSERT INTO chat_members (chat_id, user_id) VALUES (?, ?), (?, ?)', [chatId, senderId, chatId, receiverId], (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).json({ chatId });
    });
})

};

export const getUserChats = async (req, res) => {
  const {userId}=req.params;
   let query=`SELECT cm.chat_id,u.user_id,u.username from chat_members cm
              join users u on u.user_id=cm.user_id
              where cm.chat_id in (
                select chat_id from chat_members
                where user_id=?
              ) and cm.user_id!=?;`;

   mysqldb.query(query,[userId,userId],(err,results)=>{
       if(err) throw err;
       res.send(results);
   })
};

