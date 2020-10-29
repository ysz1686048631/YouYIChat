<template>
   <div>
       <div class="container_header">
                 <div class="container_header-title">
                        {{$t('header.tellheader')}}({{ telllist.length }})
                 </div>
                 <div class="container_header-adduser" @click="showPopup">
                        <van-icon name="search" size='23'/>
                 </div>
         </div> 
     <div class="tellcontent">
          <div v-if="!telllist.length>0" class="nolist">{{$t('tellpage.text')}}</div>
         <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
             <div class="tellitems">
                     <van-skeleton  avatar :row="2" :loading="isLoading">
                         <van-swipe-cell v-for="(item,index) in telllist" :key="index" >
                          
                             <div v-if="item.uid=='yes9652'" class="tellitem" @click="toGroupRouter(item)">
                                     <div>
                                          <img v-if="item.avatar" :src="item.avatar" alt="">
                                     </div>
                                     <div>
                                          <span>{{ item.username }}</span>
                                          <span>{{ item.text[item.text.length-1] }}</span>
                                     </div> 
                                     <div>
                                         
                                          <span>今天{{ item.time | filtersA }}</span>
                                     </div>
                                   
                             </div>
                              <div v-else class="tellitem" @click="toTallview(item)">
                                     <div>
                                        {{ item.username[0] }}
                                      
                                     </div>
                                     <div>
                                          <span>{{ item.username }}</span>
                                          <span>{{ item.text[item.text.length-1] }}</span>
                                     </div> 
                                     <div>
                                         
                                          <span>今天{{ item.time | filtersA }}</span>
                                     </div>
                                   
                             </div>
                            <template #right>
                                 <van-button square text="置顶" type="default" class="delete-button" />
                                 <van-button @click="deletetells(item)" square text="删除" type="danger" class="delete-button" />
                            </template>
                            
                         </van-swipe-cell>
                    </van-skeleton>
             </div>
           </van-pull-refresh>
    </div>
    <van-popup 
    v-model="show"
    :style="{ height: '100%',width:'100%' }"
    >
      <div class="searchuser">
             <div class="searchinput">
                      <div>
                           <van-search
                         v-model="value"
                         :placeholder="$t('tellpage.searchinput')"
                         @search="onSearch"
                         @cancel="onCancel"
                       />
                      </div>
                      <div @click="onCancel">
                           {{$t('tellpage.serchbar')}}
                     </div>   
             </div>
             <div class="result-list">
                    <div class="item" v-for="(item,index) in addlist" :key="index">
                            <div class="avatar">
                                {{ item.username[0] }}
                            </div>
                            <div class="username">{{ item.username }}</div>
                            <div class="btn">
                                <van-button v-if="showaddbtn" icon="plus" type="primary" size="small" @click="adduserFun(item.uid)">{{$t('tellpage.addbar')}}</van-button>
                                <p v-if="!showaddbtn">{{$t('tellpage.clickadd')}}</p>
                            </div>
                    </div>
             </div>
             <div class="infos">
                  {{$t('tellpage.sertags')}}
             </div>
      </div>  
    </van-popup>
   </div>
   
</template>

<script>
import { Toast,Dialog } from 'vant';
import Header from '../layout/header';
import { mapGetters, mapMutations } from 'vuex';
export default {
   name:'tellpage',
   data(){
       return{
            isLoading:false,
            show:false,
            value:'',
            addlist:[],
            telllist:[],
            showaddbtn:true
       }
   },
   components:{
         Header
   },
   filters:{
         filtersA(val){
               
               var date = new Date(parseInt(val) * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
               var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours());
               var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes());
               var str = `${h}:${m}`;
               return str
         }
   },
   computed:{
        /**
         * sendTellList 消息列表
         * sendTalllist 缓存消息
         * 
         */
        ...mapGetters(['sendTellList','sendTalllist','sendTalllist']),
       
   },
   mounted(){
        this.initUserlist();
        //获取搜索到的用户
        this.sockets.listener.subscribe('getuser',res=>{
                     if(res.length<1){
                           Toast('用户不存在');   
                     }else{
                            this.showaddbtn=true;
                            this.addlist=res;
                     }
                    
                     
          })
          this.$store.subscribe((mutation,state)=>{
              if(mutation.type=='addtellList'){
                     this.initUserlist();
              }else if(mutation.type=='deleteFriend'){
                     this.deleteUserlist();
                     // 删除好友
              }
      })
 
   },
   methods:{
        ...mapMutations(['deleteTellLists']),
        //删除好友
        deleteUserlist(){
            let otherinfo = JSON.parse(localStorage.getItem('otherinfo'));
            this.telllist.forEach((item,index)=>{
                     if(item.uid==otherinfo.uid){
                           this.telllist.splice(index,1);
                     }
            })
        },
        //删除对话
        deletetells(item){
                   let lang = localStorage.getItem('lang');
                   Dialog.confirm({
                         title:lang=='zh'?'提示':'Tips',
                         message: lang=='zh'?'你确定要删除该聊天吗，删除后聊天记录将不会被保留':'Are you sure you want to delete the chat? After deleting, the chat record will not be kept',
                    })
                    .then(() => {
                          this['deleteTellLists'](item.uid || item.gid);
                          this.initUserlist();
                    })
               
        },
        // 初始化 消息界面
        initUserlist(){
                this.telllist=[];
            
                for(var key in this.sendTellList){
                         this.telllist.push(this.sendTellList[key]);
                }  
        },
        //向用户发送申请
        adduserFun(id){
                let sender = JSON.parse(localStorage.getItem('userinfo'));
                if(sender.uid==id){
                      Toast('不能添加自己为好友哦！');
                      return false;
                }
                Toast('成功发送请求');
                this.showaddbtn=false;
               this.$socket.emit('adduser',{
                     sender, //自己的信息
                     otherid:id    //给接收方Id
               });    
        },
        //刷新
       onRefresh(){
             setTimeout(() => {
                Toast('刷新成功');
                this.isLoading = false;
            }, 1000);
       },
       //如果是群聊条转到群聊界面
       toGroupRouter(item){
              localStorage.setItem('groupinfo',JSON.stringify(item));
              this.$router.push({
                      path:'/groupview/yes9652'
              })       
           },
       //跳转到聊天界面
       toTallview(item){
              localStorage.setItem('otherinfo',JSON.stringify(item))
              this.$router.push({
                     path:`/tallview/${item.uid}`
              })
       },
       //添加好友界面
       showPopup(){
          this.show = true;
       },
       //搜索对象只能是用户  群搜索不到
        onSearch(val){
         
          let userinfo = JSON.parse(localStorage.getItem('userinfo'));
          let obj = {
                othername:val,
                uid:userinfo.uid
          }
          this.$socket.emit('searchuser',obj);
       },
       onCancel(){
           this.show=false;
       },
   }
} 
</script>
<style lang="less" scoped>
.searchuser{
     .searchinput{
           display: flex;
           flex-direction: row;
           align-items: center;
           &>div:nth-of-type(1){
                 flex: 1;
           }
           &>div:nth-of-type(2){
                 font-size: .9rem;
                 margin-right: 1rem;   
           }
     }
     .infos{
           font-size: .8rem;
           color: #ccc;
           text-align: center;
           
     }
      .result-list{
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
               .btn{
                    font-size: .8rem;
                    color: #ccc;
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
.tellcontent{
    width: 100%;
    padding: .5rem 0;
    box-sizing: border-box;
     height: 200px;
    //  background: red;
    .nolist{
          width: 100%;
          text-align: center;
          padding: .5rem .5rem;
          box-sizing: border-box;
          background: -webkit-gradient(linear, left top, right top, color-stop(0, #f22), 
          color-stop(0.15, #f2f),
          color-stop(0.3, #22f));
      
           -webkit-background-clip: text;
          -moz-background-clip: text;
          -ms-background-clip: text;
           color: transparent;
           font-size: .8rem;

    }
    .tellitems{
        .tellitem{
             display: flex;
             flex-direction: row;
             align-items: center;
             padding: .3rem .3rem;
             box-sizing: border-box;
             .dot{
                  margin-left: 2rem;
               display: inline-block;
                      width: 1rem;
                      height: 1rem;
                      background: red; 
                      text-align: center;
                       line-height: 1rem;
                       border-radius: 50%;
                       color: #fff;
                       font-size: .8rem;
             }
             &>div{
                  &:nth-of-type(1){
                       width: 3rem;
                       height: 3rem;
                       display: inline-block;
                       border-radius: 50%;
                       overflow: hidden;
                       background: #8fbbe6;
                       color: #fff;
                       text-align: center;
                       line-height: 3rem;
                    //    padding: .5rem .5rem;
                       box-sizing: border-box;
                       img{
                            width:100%;
                       }
                       
                  }
                  &:nth-of-type(2){
                       width: 40%;
                       display: flex;
                       flex-direction: column;
                       margin-left: .5rem;
                    
                       span{
                            &:nth-of-type(1){
                                 font-size: 1rem;
                            }
                            &:nth-of-type(2){
                                 font-size: .8rem;
                                 color: #777;
                                 width: 80%;
                                 overflow: hidden;
                                 text-overflow: ellipsis;
                                 white-space: nowrap;
                                 font-size: .7rem;
                            }
                       }
                  }
                  &:nth-of-type(3){
                       display: flex;
                       flex-direction: column;
                       margin-left: 5rem;
                      
                       span{
                            text-align: end;
                            
                            &:nth-of-type(1){
                                 font-size: .7rem;
                                 color: #777;
                            }
                       }
                  }
             }
        }
    }
}
.van-skeleton__avatar{
     width: 3rem !important;
     height: 3rem !important;
}
  .delete-button {
      background: rgb(206, 85, 85);
    //   border-radius: 4px;
      border: none;
      height: 60%;
      margin-top: .5rem;
      margin-right: 0rem;
      &:nth-of-type(1){
          background: #ccc;
          color: #777;
          
      }
      

  }
</style>