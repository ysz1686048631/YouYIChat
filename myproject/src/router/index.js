import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
const Index = () => import('../views/index.vue');
const routes = [
     {
         path:'/',
         component:Index,
         redirect:'/tell',
         children:[
               {
                   path:'tell',
                   name:'tell',
                   component:() => import('../views/tellpage.vue')
               },
               {
                path:'friends',
                name:'friends',
                component:() => import('../views/friendspage.vue')
               },{
                path:'my',
                name:'my',
                component:() => import('../views/mypage.vue')
                }
         ]
     },
     {
        path:'/tallview/:id',
        name:'tallview',
        component:() => import('../views/tallview.vue')
    },
    {
        path:'/groupview/:id',
        name:'groupview',
        component:() => import('../views/groupview.vue')
    },
    {
        path:'/login',
        name:'login',
        component:() => import('../views/login.vue')
    }
]

const route = new VueRouter({
       routes
})
export default route;