import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
     state:{
         //通讯录列表--数组
          friend:[
             
          ],
          //用户申请列表
          newUsers:[
           
          ],
          //首页消息展示--对象
          tellList:{
                
         },
         //缓存
         talls:{}

         
     },
     getters:{
            sendnewUsers(state){
                 return state.newUsers;
            },
            sendFriends(state){
                 return state.friend;
            },
            sendTellList(state){
                return state.tellList;
            },
            sendTalllist(state){
                 return state.talls;
            }
     },
     mutations:{
            //用户申请列表
            addNewusers(state,val){
                let Arrs = state.newUsers;
                
                   if(Arrs.length==0){
                        state.newUsers.push({
                             username:val.username,
                             uid:val.uid,
                             statu:false,
                             phone:val.phone
                        });  
                   }else{
                     
                     let regs = state.newUsers.filter((item,index)=>{
                     
                           if(item.username==val.username){      
                               return item;
                           }
                        
                       })
                      if(regs.length==0){
                            state.newUsers.push({
                                username:val.username,
                                uid:val.uid,
                                statu:false,
                                phone:val.phone
                         }); 
                      } 
                   }  
                    
            },
            //当添加好友成功后--添加消息用户
            addtellList(state,val){
                     let id = val.uid || val.gid;  
                     if(!state.tellList[id]){
                        state.tellList[id]={
                            username:val.username,
                            uid:id,
                            phone:val.phone,
                            time:'2020/10/22',
                            avatar:val.avatar?val.avatar:'',
                            text:[val.uid?'你们已经成为好友':'你们已经成为该群的成员下面就开始于其他小伙伴聊天的吧！'], 
                        } 
                     }
                   
            },
            //改变申请状态
            chengeStatu(state,index){
                   state.newUsers[index].statu=true;
            },
            //添加用户
            addFriends(state,val){
                let regs = state.friend.filter((item,index)=>{
                      if(item.username==val.username){
                            return item
                      }
                })
                if(!regs.length>0){
                    state.friend.push(val);
                }
                 
                
            },
            //改变状态 接收用户消息
            changeTell(state,val){
                if(state.tellList[val.uid]){
                    state.tellList[val.uid].text.push(val.msg);
                    state.tellList[val.uid].time = val.time;
                }
                
              
            },
            //这里是使用的本地删除 好友  毫无反馈效果  
            //需要重新添加好友 才能进行聊天
            deleteFriend(state,id){
               state.friend.forEach((item,index)=>{
                      if(item.uid==id){
                            state.friend.splice(index,1); 
                      }
               })
               state.newUsers.forEach((item,index)=>{
                      if(item.uid==id){
                            state.newUsers.splice(index,1); 
                       }
               })
               delete state.tellList[id];
            },
            deleteTellLists(state,id){
                
                delete state.tellList[id];
            }
            
               
     }
})

export default store;

