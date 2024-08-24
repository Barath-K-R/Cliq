import mysqldb from '../config/mysqlConfig.js'
import UserModel from "../models/UserModel.js";

export const addingUser=async(req,res)=>{
    const {username,email,password}=req.body;
    
    let query="insert into users (username,password,email) values (?,?,?)";

    mysqldb.query(query,[username,password,email],(err,results)=>{
       if(err) throw err;
       res.status(200).send(results);
    })
}

export const logingUser=async(req,res)=>{
    const {username,password}=req.body;

    let query="select * from users where username=?";

    mysqldb.query(query,[username],(err,results)=>{
        if(err) throw err;
        if(results.length===0){
             res.status(401).send('user not found')
        }
        else{
            if(results[0].password===password)
                res.send(results[0]);
            else
               res.status(401).send('password not matched');
        }
    })
}

export const gettingUser=async(req,res)=>{
    const {id}=req.params;
    let query='select * from users where user_id=?'

    mysqldb.query(query,[id],(err,results)=>{
        if(err) throw err;
        res.send(results[0]);
    })
}

export const getAllOrgusers=async(req,res)=>{
    const {orgId}=req.params;
    let query='select * from users where organization_id=?'

    mysqldb.query(query,[orgId],(err,results)=>{
        if(err) throw err;
        res.send(results);
    })
}