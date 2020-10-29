var express = require('express'),
    http = require('http');
var app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
var server = app.listen(5005);   
var io = require('socket.io').listen(server);
var users = [{
         username:'asdasd1',
         phone:'1883262563',
         uid:'t819t82cb3'
            },
            {
            username:'asdasd2',
            phone:'1883262563',
            uid:'t819t82cb5'
           }
      ];
 //用户进入即储存用户信息 防止每次刷新 多次提示
 //用户名，手机好，uid     
var grouplist = [

]      
var getid = require('./getid');
//请求头放在开始位置
app.all('*',function (req, res, next) {

       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Credentials", "true")
       res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
       res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
       res.header("Content-Type: application/x-www-form-urlencoded;charset=utf-8");  
       res.header("X-Powered-By",' 3.2.1')
       res.header("Content-Type", "application/json;charset=utf-8");
       next();
 })
io.sockets.on('connection', (socket) => {
       //登录--进入频道
      socket.on('login',(data)=>{
            socket.join(data.uid);
      })
      //群聊-用户加入房间提示
      socket.on('joinroom',(data)=>{
            let reglist = grouplist.filter((item,index)=>{
                   if(item.uid==data.uid){
                          return item;
                   }
            })
            if(!reglist.length>0){
                  grouplist.push(data);
                  socket.emit('addlist',grouplist);
                  socket.join(data.gid);
                  
                  
                  socket.to(data.gid).emit('addinfo',data);
                
            }
        
         
      })
      //离开群聊
      socket.on('leaveroom',(data)=>{
               grouplist.forEach((item,index)=>{
                      if(item.uid==data.uid){
                        grouplist.splice(index,1);
                      }
               })
               console.log(data);
            //  加入到房间--
               socket.join(data.gid);
               socket.to(data.gid).emit('leaveinfo',data); 
               socket.to(data.gid).emit('addlist',grouplist);

      })
      //群聊-获取用户列表
      socket.on('initinfo',(data)=>{
            
            socket.emit('userlen',{len:users})
      })
      //添加用户
      socket.on('adduser',(data)=>{
             socket.join(data.otherid);
             socket.to(data.otherid).emit('addusercall',data.sender)
      })
      //成功添加用户
      socket.on('successadd',(data)=>{
            console.log(data);
            socket.to(data.friendid).emit('successaddcall',data.sender)
      })
      //搜索好友
      socket.on('searchuser',(data)=>{
            let reguser = users.filter((item,index)=>{
                  if(item.username==data.othername){
                          return item;
                  }
           })
      //添加好友
           socket.emit('getuser',reguser)
      })
      //发送信息--群聊
      socket.on('getgroupmsg',(data)=>{
               socket.join(data.gid);
               socket.to(data.gid).emit('sendgroupmsg',{
                      msg:data.msg,
                      username:data.username,
                      uid:data.uid,
                      gid:data.gid,
               });
      })
      //发送信息--私聊
      socket.on('getmsgs',(data)=>{
        
            let userinfo = JSON.parse(data.userinfo);
            socket.join(data.toid)
            socket.to(data.toid).emit('sendmsgs', {
                  msg:data.msg,
                  username:userinfo.username,
                  uid:userinfo.uid,
                  time:Date.parse(new Date())
            })
            

      })
});
app.post('/login',(req,res)=>{
       
      let infos = req.body;
      let reguser = users.filter((item,index)=>{
               if(item.username==infos.username){
                       return item;
               }
      })
//       console.log()
      if(reguser.length>0){
             res.json({
                     statu:'0',
                     msg:'用户已存在'
             })
             return false;
      }else{
             let obj = {
              username:infos.username,
              phone:infos.phone,
              uid:getid()
             }
             users.push(obj);
             res.json({
                    statu:'1',
                    msg:'登录成功',
                    uid:obj.uid
                    
             }) 
      }
      
})





