<template>
     <div class="container">
        

         <div class="container_view">    
                 <router-view :key="key"></router-view>     
         </div>
           <Bars/>
     </div>
</template>

<script>
import Bars from '../layout/bars';

import { mapMutations } from 'vuex';
export default {
  name:'index',
  data(){
       return{
             transitionName: '',
          
       }
  },
  computed:{
	    key(){
              return this.$route.path + Math.random();
          }
  },
  mounted(){
        //国际化
        if(localStorage.getItem('lang')){
                this.$i18n.locale = localStorage.getItem('lang'); 
        }else{
                localStorage.setItem('lang','zh')
        }
        if(localStorage.getItem('userinfo')){
              
              this.$socket.emit('connection');
              this.$socket.emit('login',JSON.parse(localStorage.getItem('userinfo')));
            // 获取添加好友信息
              this.sockets.listener.subscribe('addusercall',res=>{
                     this['addNewusers'](res);
               })
               this.sockets.listener.subscribe('successaddcall',res=>{
                      this['addFriends'](res);
                      this['addtellList'](res);
               })
               this.sockets.listener.subscribe('sendmsgs',res=>{
                    
                       this['changeTell'](res);
               })
        }
  },
 
  components:{
       Bars
  },
  methods:{
        ...mapMutations(['addNewusers','addFriends','addtellList','changeTell'])
  }

}
</script>

<style lang="less" scoped>
  .container{
      
       
       &_view{
             margin-top: 56.4px;
             margin-bottom: 50px;
       }
  }

</style>