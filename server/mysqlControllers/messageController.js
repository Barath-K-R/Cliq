import mysqldb from "../config/mysqlConfig.js";

export const addingMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  let query='insert into messages (chat_id,sender_id,text) values (?,?,?)';

  mysqldb.query(query,[chatId,senderId,text],(err,results)=>{
      if(err) throw err;
      
      mysqldb.query('select * from messages where id=?',[results.insertId],(err,results)=>{
          if(err) throw err;
          res.send(results[0]);
      })
  })
};

export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;
  let query=`select m.id,m.chat_id,m.sender_id,m.text,u.username from messages m
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