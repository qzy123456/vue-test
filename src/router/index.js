import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import Server from '../components/system/state.vue'
import Log from '../components/system/Log.vue'
import Home2 from '../components/charts/Home2'
import axios from 'axios'
import {MessageBox} from "element-ui";
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [
      { path: '/home', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/server', component: Server },
      { path: '/log', component: Log },
      { path: '/home2', component: Home2 },
    ] }

]

const router = new VueRouter({
  routes,
    mode :"history"//除去#号
})

// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作 next('/login')强制跳转login
router.beforeEach((to, from, next) => {
  // 访问登录页，放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token, 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})
//与后端定义状态是-1是token类错误
axios.interceptors.response.use(
    response => {
        console.log(response.data)
        //返回token相关
        if (response.data.status === -1) {
            MessageBox.alert('token已过期,请重新登陆','token过期',{
                confirmButtonText:"跳转到登陆页面",
                callback:action=>{
                    window.location.href = "/login"
                }
            })
        }
        return response;
    }
)
export default router
