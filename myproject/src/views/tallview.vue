<template>
       <div class="tall">
                <div class="header">
                        <div @click="callbackRouter"><van-icon name="arrow-left" /></div>
                        <div>{{ otherinfo.username }}</div>
                        <div @click="showPopup">
                             <van-icon name="contact" size="23"/>
                        </div>
                </div>
                <div class="content">
                          <div  v-for="(item,index) in telllist" :key="index" :class="item.username!=selfmy.username?'item-left':'item-right'">
                                <div class="avatar">
                                       {{ item.username[0] }}
                                </div>
                                <div class="msg">
                                        <div class="username">{{ item.username }}</div>
                                        <div class="tallmsg">
                                               {{ item.msg }}
                                        </div>
                                </div>
                          </div>
                </div>
                <div class="input">
                      <div><input type="text" v-model="text"></div>
                      <div><van-icon name="smile-o" size="23" /></div>
                      <div><button @click="sendmsg()">{{$t('tallview.bar')}}</button></div>
                </div>
                <van-popup v-model="show" position="right" :style="{ height: '100vh',width:'100%' }">
                       <div class="header">
                              <van-icon name="arrow-left"  @click="showPopup"/>
                       </div>
                       <div class="othercontent">
                               <div class="userinfo">
                                       <div class="userinfo_avatar">
                                               {{ otherinfo.username[0] }}
                                       </div>
                                       <div class="userinfo_username">
                                              <span>{{ $t('other.name') }}：{{ otherinfo.username }}</span>
                                              <span>{{ $t('other.phone') }}：{{ otherinfo.phone }}</span>
                                       </div>
                                       
                               </div>
                                <div class="btn">
                                      <button @click="deletemyFriend">{{ $t('other.bars') }}</button>
                                </div>
                       </div>
                </van-popup>
       </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { Toast } from 'vant';
export default {
    name:'myview',
    data(){
         return{
              show: false,
              telllist:[
                     {
                        username:'小阿帅',
                        msg:'大哥好',
                     }
              ],
              prerouter:'',
              text:'',
              otherinfo:{},
              selfmy:{}
         }
         
    },
    computed:{
          ...mapGetters(['sendTalllist','sendTellList'])
    },
    mounted(){
          
          this.selfmy = JSON.parse(localStorage.getItem('userinfo'));
          this.otherinfo = JSON.parse(localStorage.getItem('otherinfo'));
          this.sockets.listener.subscribe('sendmsgs',res=>{
                  
                  this.telllist.push({
                            username:res.username,
                            time:res.time,
                            msg:res.msg
                  })
      
          })
         
    },
    methods:{
         ...mapMutations(['changeTell','deleteFriend']),
         showPopup() {
               this.show = !this.show;
          },
         //删除好友
         deletemyFriend(){
              let lang = localStorage.getItem('lang');
                Toast.success(lang=='zh'?'移除成功，对方将不会再接收你的消息':'If the removal is successful, the other party will no longer receive your message');
                this.show = !this.show;
                setTimeout(()=>{
                       this.$router.push({
                              path:'/tell'
                         })
                },500)
                
                this['deleteFriend'](this.otherinfo.uid);
                
                
         },
         //接收缓存消息
         getlist(id){
              this.otherinfo = JSON.parse(localStorage.getItem('otherinfo'));
              this.telllist=[];
              if(this.sendTellList[id]){
                       this.sendTellList[id].text.forEach((item,index)=>{
                       this.telllist.push({
                             username:this.otherinfo.username,
                             time:this.sendTellList[id].time,
                             msg:item,
                                
                       });
                  
              })
              }
           
             
           
             
         },
         //返回上级
         callbackRouter(){
         
              this.$router.push({
                   path:localStorage.getItem('preRouter')
              })
         },
         //发送消息 
         sendmsg(){
               let userinfo = JSON.parse(localStorage.getItem('userinfo'));
               let objs = {
                            userinfo:JSON.stringify(userinfo),
                            msg:this.text,
                            toid:this.otherinfo.uid
                         }
               this.$socket.emit('getmsgs',objs);
               this.telllist.push({
                            username:userinfo.username,
                            time:Date.parse(new Date()),
                            msg:this.text
                  })
              this.text='';    
         }
    },
    
    beforeRouteEnter (to, from, next) {
       
       next((vm)=>{
             let other = JSON.parse(localStorage.getItem('otherinfo'));
             localStorage.setItem('preRouter',from.path)
             setTimeout(()=>{
                  vm.getlist(other.uid); 
             },1) 

       })
  },
}
</script>
<style lang="less" scoped>
.tall{
    width: 100%;
    .othercontent{
          width: 100%;
          .userinfo{
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-top: 5rem;
                padding: 1rem .5rem;
                box-sizing: border-box;
                border-bottom: 1px solid #eeeeee;
                &_avatar{
                      width: 3.5rem;
                      height: 3.5rem;
                      text-align: center;
                      line-height: 3.5rem;
                      background: #8fbbe6;
                      color: #fff;
                      border-radius: 50%;
                      font-size: 1.2rem;
                      margin-right: .5rem;
                }
                &_username{
                      display: flex;
                      flex-direction: column;
                      font-size: .9rem;
                      color: #333;
                     
                      &>span:nth-of-type(1){
                           font-size: 1.2rem;
                           font-weight: bold;
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