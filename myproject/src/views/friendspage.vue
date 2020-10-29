<template>
         <div class="content">
                <div class="container_header">
                 <div class="container_header-title">
                         {{$t('header.friendheader')}}
                 </div>
               
         </div> 
         <van-cell is-link @click="showPopup">
              <!-- 使用 title 插槽来自定义标题 -->
              <template #title>
                     <span class="custom-title">{{$t('friends.cell[0]')}}</span>
                     <van-tag type="danger" v-if="noaddUser.length>=1">{{ noaddUser.length }}</van-tag>
              </template>
         </van-cell>
         <!-- 群聊 -->
          <van-collapse v-model="activeNames">
              <van-collapse-item :title="$t('friends.cell[1]')" name="1">
                            <div class="groups">
                                        <div class="item" @click="toGroupRouter">
                                           <img src="//www.runoob.com/wp-content/uploads/2017/01/vue.png" alt="">
                                           <div class="disrite">
                                              Vue学习交流群    
                                           </div>  
                                        </div>
                                         
                            </div>
              </van-collapse-item>
          </van-collapse>
               <div class="nofriend" v-if="letterArr.length<1">
                        <van-empty :description="$t('friends.description')" />
               </div> 
               <div class="firends">
                  <div class="firends-group">
                              <div class="firends-group-cell" ref="cell" v-for="(item,index) in letterArr" :key="index" >
                                          <div class="title" ref="listitem">
                                                {{ item }}
                                          </div>
                                          <div class="cellitems" v-for="(items,ind) in userObj[item]" :key="ind" @click="addlistfun(items)">
                                                <span>{{ items.username[0] }}</span>
                                                <span>{{ items.username }}</span>
                                          </div>
                                </div> 
                        </div> 

                        <div class="silderbar">
                                    <div class="silderbar-item">
                                          #
                                    </div>
                                    <div class="silderbar-item" v-for="(item,ind2) in letterArr" :key="ind2" @click="toScrollfun(item)">
                                          {{ item }}
                                    </div>
                        </div>
                  
                  
            </div>
                <van-popup 
                     v-model="show"
                     closeable
                     :style="{ height: '100%',width:'100%' }"
                     >
                     <div class="searchuser">
                            <div class="title">
                                   {{$t('friends.cell[1]')}}
                            </div>
                            
                            <div class="result-list">
                                   <div class="nolist" v-if="sendnewUsers.length<1">
                                               {{$t('friends.nolist')}}  
                                   </div>
                                   <div class="item" v-for="(item,index) in sendnewUsers" :key="index">
                                                <div class="avatar">{{ item.username[0] }}</div>
                                                 <div class="username">{{ item.username }}</div>
                                                 <div class="bar">
                                                 <van-button v-if="!item.statu" icon="plus" type="primary" size="mini" @click="onAddfirend(item.uid,index)">{{$t('friends.successbar')}}</van-button>
                                                 <p v-if="item.statu">{{$t('friends.success')}}</p>
                                                </div>
                                   </div>
                            </div>
                     </div>  
                     </van-popup>
         </div>
             
</template>

<script>
import pinyin from 'pinyin';
import Header from '../layout/header';
import { mapGetters, mapMutations } from 'vuex';
export default {
    name:'friendspage',
    data(){
           return{
                  activeNames: ['1'],
                 userlist:[
                        {

                           username:'赵小六',
                           id:'asd123'    
                        },
                        
                 ],
                 userObj:{},
                 letterArr:[],
                 show:false, 
                 addlist:[
                    
                 ], 
                 noaddUser:[] 
           }
    }, components:{
         Header
   },
   
   filters:{
          afilter(arr){
                  let count=0;
                  arr.forEach((item,index)=>{
                          if(!item.statu){
                                  count++;
                          }
                  })
                  return count;
          }
   },
   computed:{
           ...mapGetters(['sendnewUsers','sendFriends'])
   },
    mounted(){
      this.getallfriend();
      this.getnoAdd();
      
      this.$store.subscribe((mutation,state)=>{
             //监听新用户好友申请
              if(mutation.type=='addNewusers'){
                     this.getnoAdd();
             ////监听对方是否同意添加好友        
              }else if(mutation.type=='addFriends'){
                     this.getallfriend();
              }else if(mutation.type=='deleteFriend'){
                     this.deleteUserlist();
                     // 删除好友
              }
      })
       
    },
    methods:{
           ...mapMutations(['addFriends','chengeStatu','addtellList']),
           //跳转到群聊界面
           toGroupRouter(){
              let objs = {
                      username:'Vue学习交流群',
                      gid:'yes9652',
                      avatar:'https://cn.vuejs.org/images/logo.png'
              }
              localStorage.setItem('groupinfo',JSON.stringify(objs));
              this['addtellList'](objs); 
              this.$router.push({
                      path:'/groupview/yes9652'
              })       
           },
           //删除好友
           deleteUserlist(){
                    let otherinfo = JSON.parse(localStorage.getItem('otherinfo'));
                     this.userlist.forEach((item,index)=>{
                                if(item.uid==otherinfo.uid){
                                    this.userlist.splice(index,1);
                                }
                     })
                     this.toCode();
           },
           // 获取没有添加的
           addlistfun(item){
               
                localStorage.setItem('otherinfo',JSON.stringify(item));
                     this.$router.push({
                            path:`/tallview/${item.uid}`
                     }) 
                this['addtellList'](item);                  
           },
           getnoAdd(){
                  
                   this.noaddUser=[];
                   this.sendnewUsers.forEach((item,index)=>{
                           if(!item.statu){
                                  this.noaddUser.push(item);
                               
                           }
                   })
           },
           // 对方同意后刷新界面
           getallfriend(){
                  this.userlist=[];
                  
                  this.sendFriends.forEach((item,index)=>{
                          this.userlist.push(item)
                  })   
                  this.toCode();
           },
           // 文字转大写排列
          toCode(){
           this.userObj={};  
           this.letterArr=[];
             
           this.userlist.forEach((item) => {
                let fristWord = pinyin(item.username, { style: pinyin.STYLE_NORMAL, heteronym: true })[0][0].substring(0, 1).toUpperCase();
                
                if(!this.userObj[fristWord]){
                       this.letterArr.push(fristWord)
                       this.userObj[fristWord] = [{username:item.username,uid:item.uid,letter:fristWord,phone:item.phone}]
                              
                        }else{
                              this.userObj[fristWord].push({username:item.username,uid:item.uid,letter:fristWord,phone:item.phone})
                        }
                              
                  });
              
            },
           showPopup(){
             this.show = true;
           },
           //同意添加并将好友添加到我的列表
           onAddfirend(id,index){
                  
                 
                  this['chengeStatu'](index); //改变申请状态
                  this.sendnewUsers.forEach((item,index)=>{
                          if(item.uid==id){
                                  // 查找id 将其传递给状态
                                  this.userlist.push(item);
                                  this['addFriends'](item);
                                  this['addtellList'](item);
                          }
                  })  
                  this.toCode();  //重新按首字母排列
                  this.getnoAdd(); //重新查找位被添加的
                  //     successadd
                  //发送websocket   
                  this.$socket.emit('successadd',{
                          friendid:id,
                          sender:JSON.parse(localStorage.getItem('userinfo'))
                  });
                    
           },
           // 调整滚动条位置
          toScrollfun(item){
                 let client = document.documentElement.clientHeight;
                 let index = this.letterArr.indexOf(item);
                 let domeTop = this.$refs['listitem'][index].offsetTop;
                 let selfH = this.$refs['cell'][index].clientHeight;
                 if(domeTop>client){
                     document.documentElement.scrollTop=parseInt(domeTop-client)+selfH;   
                 }else{
                      document.documentElement.scrollTop=0  
                 }
                 
                
            }
    }

}
</script>

<style lang="less" scoped>
.groups{
      
       .item{
            display: flex;
            flex-direction: row;
            align-items: center    ;
            img{
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
            }    
            .disrite{
                    
            }
       } 
}
.searchuser{
       margin-top: 2rem;
       .title{
               width: 100%;
               text-align: center;
               color: #333;
               font-size: .9rem;
               border-bottom: 1px solid #eeeeee;
               padding: .5rem 0;
       }
      .result-list{
             .nolist{
                    text-align: center;
                    font-size: .8rem;
                    color: #ccc;
                    margin-top: 1rem;
             }
            .item{
                 display: flex;
                 flex-direction: row;
                 align-items: center;
                 padding: .5rem 1rem;
                 box-sizing: border-box;
                  .avatar{
                    width: 2.5rem;
                    height: 2.5rem;
                    background: #ccc;
                    color: #333;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 2.5rem;
               }
               .username{
                     color: #333;
                     font-size: .9rem;
                     margin-left: .5rem;
                     flex: 1;
               }
               .bar{
                       &>p{
                               font-size: .8rem;
                       color: #ccc;
                       }
               }

            }
      }
}
.container_header{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background: #fff;
            border-bottom: 1px solid #eeeeee;
            padding: 1rem .5rem;
            box-sizing: border-box;
            position: fixed;
            top: 0;
            &-title{
                 font-size: .9rem;
                 font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            }
       }
.content{
      overflow: auto;
       .firends{
       width: 100%;
       background: #eeeeee;
       &-group{
              display: flex;
              flex-direction: column;
              &-cell{
                    
                    .title{
                           
                           color: #777;
                           padding: .5rem .5rem;
                           box-sizing: border-box;
                           font-size: .8rem;
                    }  
                    .cellitems{
                           background: #fff;
                           color: #333;
                           display: flex;
                           flex-direction: row;
                           align-items: center;
                           padding: .5rem .5rem;
                           box-sizing: border-box;
                           border: 1px solid #eeeeee;
                           &>span{
                                  display: inline-block;
                                  &:nth-of-type(1){
                                         width: 2rem;
                                         height: 2rem;
                                         border-radius: 50%;
                                         overflow: hidden;
                                         text-align: center;
                                         line-height: 2rem;
                                         font-size: .9rem;
                                         background: #8fbbe6;
                                         color: #fff;
                                  }
                                  &:nth-of-type(2){
                                         font-size: .9rem;
                                         margin-left: .5rem;
                                  }
                           }
                           
                    }
              }
       }
       .silderbar{
              position: fixed;
              top: 15%;
              right: .9rem;
              width: 13px;
              text-align: center;
             
              border-radius: 15px;
              font-size: .8rem;
            
              color: #333;
              padding: .5rem 0;
              box-sizing: border-box;
              .silderbar-item{
                     margin: .5rem 0;
              }
       }
}
}
</style>