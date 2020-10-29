<template>
     <div class="loginView">
              <div class="logo">
                  YOUYI
              </div>
              <div class="content">
                     <div>
                         <span><van-icon name="user-o" size="20"/></span>
                         <span><input type="text" v-model="username" :placeholder="$t('login.username')"></span>
                     </div>
                     <div>
                         <span><van-icon name="phone-o" size="20"/></span>
                         <span>
                             <input type="text" v-model="phone" :placeholder="$t('login.phone')">
                         </span>
                     </div>
                     <div><button @click="onSubmit">{{$t('login.bar')}}</button></div>
                     <div>
                     <p class="tag">{{$t('login.ps')}}</p>
              </div>
           </div>  
     </div>
</template>

<script>
import Qs from 'qs';
import { Notify } from 'vant';
export default {
   name:'login',
   data(){
        return{
             disable:'.5',
             checked:false,
             username:'',
             phone:''
        }
   },
   mounted(){
        this.$socket.emit('connection');
        this.sockets.listener.subscribe('userlen', (data) => {
            console.log('++++++++++',data)
         })
   },
   methods:{
        onSubmit(){
            console.log((/^1(3|4|5|6|7|8|9)\d{9}$/.test(12732625963)))
             if(!this.username){
                    this.notifyfun('warning','用户名不能为空');
                    return false;
             }else if(this.username.length<6){
                    this.notifyfun('warning','用户名长度不能少于6位');
                    return false;
             }
             if(!this.phone){
                 this.notifyfun('warning','手机号不能为空');
                 return false;
             }else if(!/^1(3|5|8|7)\d{9}$/.test(this.phone)){
                  this.notifyfun('warning','请输入正确手机号'); 
                  return false;  
             }   
             

             let obj = {
                   username:this.username,
                   phone:this.phone
             }
             this.$http.post('/login',Qs.stringify(obj)).then((res)=>{
                   
                   if(!parseInt(res.data.statu)){
                      this.notifyfun('warning','用户已经存在')
                   }else{
                       let obj = {
                             username:this.username,
                             phone:this.phone,
                             uid:res.data.uid
                       }
                       this.$socket.emit('connection');
                       this.$socket.emit('login',obj);
                       localStorage.setItem('userinfo',JSON.stringify(obj))
                       this.$router.push({
                             path:'/my'
                       }) 
                   }
             }) 
        },
        notifyfun(type,message){
             Notify({ type, message });
        }
   }
}
</script>

<style lang="less" scoped>
.tag{
    font-size: .8rem;
}
.loginView{
     width: 100vw;
     height: 100vh;
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     .logo{
         width: 100%;
         text-align: center;
         margin-bottom: 5rem;
         font-family: century gothic,texgyreadventor,stheiti,sans-serif;
         font-size: 2rem;
         color: #333;
         font-weight: bold;
         text-shadow: 0 3px 6px rgba(0,0,0,0.3);
     }
     .content{
          width: 70%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          &>div{
              width: 100%;
              margin: .5rem 0;
              display: flex;
              flex-direction: row;
              align-items: center;
             &>span>input[type='text']{
               border: none;
               font-size: .9rem;
               padding: .3rem .3rem;
               box-sizing: border-box;
             }
             &:not(:last-child){
                 border-bottom: 1px solid #eeeeee;
             }
             &>button{
                  width: 100%;
                  background: #34ccab;
                  border: none;
                  border-radius: 4px;
                  color: #fff;
                  padding: .5rem 0;
                  box-sizing: border-box;
             }
          }
          

     }
}
</style>