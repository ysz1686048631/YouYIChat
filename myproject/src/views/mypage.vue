<template>
     <div class="userinfo">
      
            <div class="userinfo-list">
                   <div class="avater">
                          A
                   </div>
                   <div class="username">
                           <span>{{ userinfo.username }}</span>
                   </div>    
            </div> 
             <div>
                   <van-cell :title="$t('mypage.cell[0]')" icon="user-o"/> 
                   <van-cell is-link :title="$t('mypage.cell[1]')" @click="showAboutMe"  icon="info-o"/>
                
             </div>
             <van-cell is-link :title="$t('mypage.cell[2]')" @click="show = true"  icon="setting-o"/>
                      
             <van-action-sheet
              v-model="show"
              :actions="actions"
              :cancel-text="$t('mypage.cancel')"
              :description="$t('mypage.cell[0]')"
              @select="onSelect"
              />
     </div>
</template>

<script>
import { Dialog } from 'vant';

export default {
    name:'mypage',
    data(){
          return{
                  show: false,
                  actions: [
                     { name: '修改信息' },
                     { name: '退出' },
                     { name: '切换语言',subname:'切换至英文'}
                  ],
                  userinfo:{}
          }  
    },
    mounted(){
          this.userinfo = JSON.parse(localStorage.getItem('userinfo'));
          this.changeLang();      
    },
    methods:{
            showAboutMe(){
                    let lang = localStorage.getItem('lang');
                     Dialog.alert({
                        title: lang=='zh'?'来了 老弟🎉🎉🎉':'Here we are, brother 🎉🎉🎉',
                        message: lang=='zh'?'其实就这么个事！邮箱1925357372@qq.com ！':"In fact, that's it! mailbox 1925357372@qq.com !",
                        theme: 'round-button',
                        }).then(() => {
                        // on close
                    });
            },
            onSelect(e){
                     
                    if(e.name=='修改信息'||e.name=='Modify information'){
                            Dialog({ message: '临时用户不能修改信息' });
                    }else if(e.name=='退出'||e.name=='Sign out'){
                        localStorage.clear();
                        this.$router.push({
                                 path:'/login'
                        })     
                    }else{
                        // 切换系统语言 国际化
                        let lang = localStorage.getItem('lang');
                        this.actions[2].subname = lang =='zh'?'Switch to Chinese':'切换至英文';
                        this.$i18n.locale=lang=='zh'?'en':'zh';
                        localStorage.setItem('lang',this.$i18n.locale); 
                        this.changeLang();  
                    }
            },
            changeLang(){
                     let lang = localStorage.getItem('lang');
                     this.actions = lang=='zh'?[
                                { name: '修改信息' },
                                { name: '退出' },
                                { name: '切换语言',subname:'切换至英文'}
                        ]:[
                                { name: 'Modify information' },
                                { name: 'Sign out' },
                                { name: 'Switch English',subname:'Switch to Chinese'}
                        ];
            }
    }
}
</script>
<style lang="less" scoped>
.userinfo{
        width: 100%;
        .headerfix{
                position: fixed;
                top: 0;
                width: 100%;
                text-align: end;
                padding: 1rem 1rem;
                box-sizing: border-box;
                &>div{
                       display:inline-block;
                }
        }
        &-list{
                width: 100%;
                height: 200px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                
                .avater{
                      width: 4rem;
                      height: 4rem;
                      background: rgb(196, 64, 64);
                      border-radius: 50%;
                      text-align: center;
                      line-height:4rem;
                      color: #fff;
                      font-size: 1.5rem;
                }
                .username{
                        font-size: 1.2rem;
                        color: #333;
                        font-weight: bold;
                }
                &>div{
                       margin: .5rem 0;
                       font-size: 1rem;
                       color: #333;
                }


        }
}
</style>