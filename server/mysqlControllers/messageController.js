import mysqldb from "../config/mysqlConfig.js";

export const addingMessage = async (req, res) => {
  console.log('adding mesage')
  const { chatId,chatType,senderId, message } = req.body;
  let query='insert into messages (chat_id,chat_type,sender_id,message) values (?,?,?,?)';

  mysqldb.query(query,[chatId,chatType,senderId,message],(err,results)=>{
      if(err) throw err;
      console.log(results.insertId)
      mysqldb.query('select * from messages where id=?',[results.insertId],(err,results)=>{
          if(err) throw err;
          res.send(results[0]);
      })
  })
};

export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;
  let query=`select m.id,m.chat_id,m.sender_id,m.message,u.username from messages m
              join users u on m.sender_id=u.id
              where chat_id=?`;

  mysqldb.query(query,[chatId],(err,results)=>{
      if(err) throw err;
      console.log(results);
      res.send(results);
  })
};

export const getGroupChatMessages = async (req, res) => {
  const { groupchatId } = req.params;
  let query='select * from messages where chat_id=?';

  mysqldb.query(query,[chatId],(err,results)=>{
      if(err) throw err;
      console.log(results);
      res.send(results);
  })
};