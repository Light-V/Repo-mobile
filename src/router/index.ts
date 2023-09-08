// https://router.vuejs.org/zh/
import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入路由组件
import mian from '@/views/index.vue'
import mock from '@/views/mock/index.vue'
import charts from '@/views/charts/index.vue'
import inbound from '@/views/inbound/index.vue'
import outbound from '@/views/outbound/index.vue'
import login from '@/views/login/index.vue'
import inbound_detail from '@/views/inbound_detail/index.vue'
import outbound_detail from '@/views/outbound_detail/index.vue'

NProgress.configure({ showSpinner: true, parent: '#app' })

// 定义路由，每个路由都需要映射到一个组件
const routes = [
  {
    path: '/',
    name: 'main',
    component: mian,
  },
  {
    path: '/mock',
    name: 'mock',
    component: mock,
  },
  {
    path: '/charts',
    name: 'charts',
    component: charts,
  },
  {
    path: '/inbound',
    name: 'inbound',
    component: inbound,
  },
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  {
    path: '/inbound_detail/:id',
    name: 'inbound_detail',
    component: inbound_detail,
  },
  {
    path: '/outbound',
    name: 'outbound',
    component: outbound,
  },
  {
    path: '/outbound_detail/:id',
    name: 'outbound_detail',
    component: outbound_detail,
  },
]

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
  routes,
})

router.beforeEach((_to, _from, next) => {
  NProgress.start() // start progress bar
  next()
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

// 导出路由实例，并在 `main.ts` 挂载
export default router
