<template>
       <div class="tall">
                <div class="header">
                        <div @click="callbackRouter"><van-icon name="arrow-left" /></div>
                        <div>Vue学习交流群({{ grounplist.length }})</div>
                        <div @click="showPopup">
                             <van-icon name="friends-o" size="23"/>
                        </div>
                </div>
                <div class="content">
                          <div  v-for="(item,index) in telllist" :key="index" :class="item.username!=selfmy.username?'item-left':'item-right'">
                                <div class="avatar">
                                       {{ item.username[0] }}
                                </div>
                                <div class="msg">
                                        <div class="username"><p>{{ item.username }}</p> <p v-if="item.username==power">群主</p> </div>
                                        <div class="tallmsg">
                                               {{ item.msg }}
                                        </div>
                                </div>
                          </div>
                          
                          <div class="addlist" v-if="this.addlist.length>=1">
                               <span><van-icon name="volume-o" />{{ otherName }}</span>
                          </div>
                </div>
                <div class="input">
                      <div><input type="text" v-model="text"></div>
                      <div><van-icon name="smile-o" size="23" /></div>
                      <div><button @click="sendGrounpmsg()">{{$t('tallview.bar')}}</button></div>
                </div>
                <van-popup v-model="show" position="right" :style="{ height: '100vh',width:'100%' }">
                       <div class="header">
                              <van-icon name="arrow-left"  @click="showPopup"/>
                       </div>
                       <div class="othercontent">
                                 <div class="infos">
                                         <span><img src="https://cn.vuejs.org/images/logo.png" alt=""></span>
                                         <span>Vue学习交流群</span>
                                 </div>
                                 <div>
                                       <van-cell :title="$t('group.settime')" value="2020/10/26" size="large" />
                                       <van-cell :title="$t('group.power')" :value="power" size="large" />
                                       <van-cell :title="$t('group.recod')" is-link size="large" :label="$t('group.driect')" />
                                 </div>
                                 <div class="title">
                                        {{$t('group.lists')}}
                                 </div>
                                 <div class="userlist">
                                         <div class="userlist-item" v-for="(item,index) in grounplist" :key="index">
                                                 <span>{{ item.username[0] }}</span>
                                                 <span>{{ item.username }}</span> 
                                         </div>
                                 </div>  
                                 <div class="btn">
                                       <button @click="outGroup">{{$t('group.removebar')}}</button>
                                 </div>
                       </div>
                </van-popup>
       </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { Toast } from 'vant';
export default {
    name:'groupview',
    data(){
         return{
              show: false,
              telllist:[
                     {
                        username:'系统',
                        msg:'系统已自动将你拉入该群，如有问题可以向作者留言进行反馈，作者QQ邮箱1925357372,欢迎加入该讨论组。',
                     }
              ],
              power:'andy9652',
              prerouter:'',
              text:'',
              otherinfo:{},
              selfmy:{},
              time:null,
              otherName:'',
              addlist:[
                  
              ],
              grounplist:[
                   
              ]
         }
         
    },
    computed:{
          ...mapGetters(['sendTalllist','sendTellList'])
    },
    mounted(){
         this.selfmy=JSON.parse(localStorage.getItem('userinfo'));
         //在群里的用户列表
         this.sockets.listener.subscribe('addlist',res=>{
                    this.grounplist=res;
         })
         // 加入房间
          this.sockets.listener.subscribe('addinfo',res=>{
                      this.addListFun(`欢迎用户${res.username}加入该群聊！`);
                      this.grounplist.push(res);
          })
         // 离开房间 
         // 用户离开房间 和 加入房间都是使用的同一个接口函数
          this.sockets.listener.subscribe('leaveinfo',res=>{
                        this.addListFun(`刚刚用户${res.username}离开了该群聊！`);
                        this.grounplist.forEach((item,index) => {
                                   if(item.uid==res.uid){
                                           this.grounplist.splice(index,1);
                                   }
                        });
               })
        // 获取群聊信息
         this.sockets.listener.subscribe('sendgroupmsg',res=>{
                
                     this.telllist.push(res);
         })  
         
    },
    methods:{
         ...mapMutations(['changeTell','deleteFriend']),
         outGroup(){
               let lang = localStorage.getItem('lang');
               Toast.fail(lang=='zh'?'禁止该操作':'Disable the operation');
         },
         //展示弹窗 
         showPopup(){
               this.show = !this.show;
          },
         //添加到列表 
         addListFun(res){
                this.addlist.push(res);
                  // 后台有去重 所以不用担心 会有重复的用户
                this.otherName = this.addlist[0];
                this.time = setInterval(()=>{
                         this.otherName = this.addlist[0];
                         setTimeout(()=>{
                              this.addlist.splice(0,1);
                              if(this.addlist.length<1){ 
                                   clearInterval(this.time);
                                   return false;
                              }
                              
                         },1000); 
                },1200)  
         },
         //返回上一级
         callbackRouter(){
             
              this.$router.push({
                   path:'/'
              })
         }, 
     //     发送消息
         sendGrounpmsg(){
               
               if(!this.text){
                     let lang = localStorage.getItem('lang');
                     Toast(lang=='zh'?'输入内容不能为空哦！':'The input content cannot be empty!');   
                     return false;
               }

               let infoObj = {
                     username:this.selfmy.username,
                     uid:this.selfmy.uid,
                     gid:'yes9652',
                     msg:this.text,
               }  
               this.text='';
               this.telllist.push(infoObj);
               this.$socket.emit('getgroupmsg',infoObj);
         },
         
     //   进入页面之前加入房间  
        onJoinroom(){
           let selfinfo = JSON.parse(localStorage.getItem('userinfo'));
           // 加入后将 自己加入到列表中去
           this.grounplist.push(selfinfo);
           this.$socket.emit('joinroom',{
                 username:selfinfo.username,
                 uid:selfinfo.uid,
                 gid:'yes9652'
           });  
        },
     // 离开房间 
      onLeaveRoom(){
           
           let selfinfo = JSON.parse(localStorage.getItem('userinfo'));
           // 离开时 将自己从列表移除
           this.grounplist.forEach((item,index) => {
                                   if(item.uid==selfinfo.uid){
                                           this.grounplist.splice(index,1);
                                   }
                        });
           this.$socket.emit('leaveroom',{
                 username:selfinfo.username,
                 uid:selfinfo.uid,
                 gid:'yes9652'
           });  
      }   
        
    },
  
    beforeRouteEnter (to, from, next) {
       
       next((vm)=>{
              vm.onJoinroom();

       })
  },
    beforeRouteLeave (to, from, next) {
         this.onLeaveRoom();
         next()
  }
}
</script>
<style lang="less" scoped>
.tall{
    width: 100%;
    .othercontent{
          width: 100%;
          .infos{
                 display: flex;
                 flex-direction: column;
                 justify-content: center;
                 align-items: center;
                 margin-top: 5rem;
                 color: #273849;
                 &>span:nth-of-type(1){
                      display: inline-block;
                      width: 4rem;
                      height: 4rem;
                      border-radius: 50%;
                      padding: .5rem .5rem;
                      box-sizing: border-box;
                      
                      
                      img{
                           width: 100%;
                           margin: auto;
                      }
                 }
                 &>span:nth-of-type(2){
                       font-size: 1.3rem;
                       color: #304455;
                       font-weight: bold     ;
                 }
          }
          .title{
               font-size: .5rem;
               padding: .3rem .5rem;
               font-size: 1rem;
               border-bottom: 1px solid #eeeeee;
               color: #304455;
             
               margin: 1rem .5rem;
               
          }
          .userlist{  
                width: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                padding: .5rem .5rem;
                box-sizing: border-box;
                border-bottom: 1px solid #eeeeee;
                &-item{
                      width: 4rem;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      margin: .3rem .5rem;
                      &>span:nth-of-type(1){
                             background: #475050;
                             color:#fff;
                             width: 2.6rem;
                             height: 2.6rem;
                             text-align: center;
                             line-height: 2.6rem;
                             border-radius: 50%;

                      }
                      &>span:nth-of-type(2){
                             width: 4rem;
                             text-overflow: ellipsis;
                             overflow: hidden;
                             white-space: nowrap;
                             font-size: .8rem;
                             text-align: center;
                      }
                }
          }
          .btn{
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                margin: 1rem 0;
                button{
                      width: 90%;
                      background: brown;
                      outline: none;
                      border: none;
                      border-radius: 4px;
                      padding: .5rem .5rem;
                      box-sizing: border-box;
                      color: #fff;
                }
          }
    }
     .header{
          width: 100%;
          height: 50px;
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: row;
          align-items: center;
          background: #fff;
          border-bottom: 1px solid #eeeeee;
          padding: 0 .5rem;
          box-sizing: border-box;
          &>div{
               &:nth-of-type(2){
                   flex: 1;
                   text-align: center;
                   font-size: .9rem;
                   
               }
               &:nth-of-type(3){
                    margin-right: .5rem;
               }

          }
     }
    
     .content{
          width: 100%;
          display: flex;
          flex-direction: column;
          padding-top: 50px;
          background: #eeeeee;
          min-height: 560px;
    
           .addlist{
               position: absolute;
               top: 3.1rem;
               width: 100%;
               &>span{
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    background: #ff440080;
                    color: #fff;
                    padding: .2rem 0;
                    box-sizing: border-box;
               }
          }
          .item-left{
               width: 100%;
               display: flex;
               flex-direction: row;
               padding: .5rem .5rem;
               box-sizing: border-box;
            
               .avatar{
                    width: 2.5rem;
                    height: 2.3rem;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #8fbbe6;
                    color: #fff;
                    text-align: center;
                    line-height: 2.3rem;
               }
               .msg{
                    width: 100%;
                    margin-left: .5rem;
                      
                    .username{
                         color: #333;
                         font-size: .9rem;
                         margin-top: .5rem;
                         display: flex;
                         flex-direction: row;
                         align-items: center;
                         &>p{
                              margin: 0;
                             &:nth-of-type(2){
                                  background: chocolate;
                                  margin-left: .5rem;
                                  color: #fff;
                                  padding: .1rem .3rem;
                                  border-radius: 2px;
                             }    
                         }
                    }
                    .tallmsg{
                         max-width: 50%;
                         display: inline-block;
                         font-size: .9rem;
                         background:#fff;  
                         padding: .3rem .3rem;
                         box-sizing: border-box;
                         border-radius: 5px;
                         margin-top: .5rem;
                         position: relative;
                         &::before{
                              content: '';
                              display: inline-block;
                              width: .8rem;
                              height: .8rem;
                              background: #fff;
                              position: absolute;
                              top:-.4rem;
                              left: .5rem;
                              transform: rotate(45deg);
                         }
                    }
               }
          }  
          .item-right{
                .item-left();
                justify-content: flex-end;
                .avatar{
                    order: 2;
                }
                .msg{
                    order: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    margin-left: 0;
                    margin-right: .5rem;
                    .tallmsg{
                         position: relative;
                         &::before{
                              content: '';
                              background: transparent;
                         }
                         &::after{
                              content: '';
                              display: inline-block;
                              width: .8rem;
                              height: .8rem;
                              background: #fff;
                              position: absolute;
                              top:-.4rem;
                              right: .5rem;
                              transform: rotate(45deg);
                         }
                    }
                }
          }
           
     }
     .input{
        width: 100%; 
        display: flex;
        flex-direction: row;
        position: fixed;
        align-items: center;
        bottom: 0;  
        background: #fff;
        padding: .5rem .5rem;
        box-sizing: border-box;
        &>div{
             &:nth-of-type(1){
                  border: 1px solid #eeeeee;
                  padding: .3rem .3rem;
                  box-sizing: border-box;
                  flex: 1;
                  border-radius: .3rem;
                    input{
                        border: none; 
                        outline-style: none;
                        background: transparent;
                        font-size: .9rem;
                        font-family: Georgia, 'Times New Roman', Times, serif;
                    } 
             }
             &:nth-of-type(2){
                  margin: .5rem .3rem;
             }
             button{
                  outline-style: none;
                  border: none;
                  background: #4cb69b;
                  color: #fff;
                  font-size: .8rem;
                  padding: .3rem .5rem;
                  border-radius: 4px;
             }

        }
     }
}
</style>