import mysqldb from "../config/mysqlConfig.js";

export const createOrganization=async(req,res)=>{
    const {name,userId}=req.body;

    let query='insert into organizations (name,admin) values (?,?)';
    let userUpdateQuery='update users set organization_id=? where id=?'
    mysqldb.query(query,[name,userId],(err,results)=>{
        if(err) throw err;
        
        mysqldb.query(userUpdateQuery,[results.insertId,userId],(err,results)=>{
            if(err) throw err;
            
            res.send(results);
        })
    })
}

export const joinOrganization=async(req,res)=>{
    const {name,userId}=req.body;

    let query='select * from organizations where name=?';

    mysqldb.query(query,[name],(err,results)=>{
        if(err) res.status(400).send('databse error');
        
        mysqldb.query('update users set organization_id=? where id=?',[results[0].id,userId],(err,results)=>{
            if(err) res.status(400).send('databse error');

            res.send(results);
        })
      
    })
}