<template>
     <div class="bars">
            <van-tabbar v-model="active">
                <van-tabbar-item  v-for="(item,index) in barlist" :key="index" :icon="item.icon" :badge="item.badge?item.badge:''"  @click="toRouter(item.link)">{{$t(item.name)}}</van-tabbar-item>
                
            </van-tabbar>
     </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name:'bars',
    data(){
        return{
              active:0,
              barlist:[
                   {
                        name:'bars.tell',
                        icon:'chat-o',
                        link:'/tell',
                        badge:''
                   },{
                        name:'bars.friends',
                        icon:'friends-o',
                        link:'/friends',
                        badge:''
                   },{
                        name:'bars.myview',
                        icon:'contact',
                        link:'/my',
                        badge:''
                   }
              ],
              count:0
        }
    },
    computed:{
         ...mapGetters(['sendnewUsers','sendTellCount','sendTalllist'])
    },
  
    mounted(){
         let routerNames = this.$route.path;
         // 遍历高亮底部导航
         this.barlist.forEach((item,index)=>{
                 if(item.link==routerNames){
                      this.active=index;
                 }
         })
         //每次有人添加都会被放入到状态里 进行监听
         //这里时通过监听时间来改变Bar的值
         this.$store.subscribe((mutation,state)=>{
                 
                 if(mutation.type == 'addNewusers'||mutation.type == 'chengeStatu'){
                          this.afilter();
                          
                 }
         }) 
    },
    methods:{
        getcount(){
             let count=0;
              for(var key in this.sendTalllist){
                     count+=this.sendTalllist[key].length;
                    
              }
              this.barlist[0].badge=count;
        },  
        afilter(){
                  let count=0;
                  this.sendnewUsers.forEach((item,index)=>{
                          if(!item.statu){
                                  count++;
                          }
                  })
                  this.barlist[1].badge = count==0?'':count;
                 
          }, 
        toRouter(pathname){
              if(this.$route.path==pathname){
                    return false;
              }
              this.$router.push({
                   path:pathname
              })
        }
    }
}
</script>

<style>

</style>