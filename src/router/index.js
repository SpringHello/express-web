import Vue from 'vue'
import Router from 'vue-router'

import App from '@/App'

//import Home from '@/page/Home'
const Home = () => import('@/page/Home')
//import Sitemap from '@/page/Sitemap'
const Sitemap = () => import('@/page/Sitemap')
//import Carousel from '@/page/vueDemo/Carousel'
const Carousel = () => import('@/page/vueDemo/Carousel')

const Slider = () => import('@/page/vueDemo/Slider')

Vue.use(Router)

export default function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: App,

        children: [
          {
            path: '/',
            name: 'main',
            redirect: '/c/01.html',
          },
          {
            path: '/sitemap',
            name: 'sitemap',
            component: Sitemap,
          },
          {
            path: '/vueDemo/01.html',
            name: 'Carousel',
            component: Carousel,
          },
          {
            path: '/vueDemo/02.html',
            name: 'Slider',
            component: Slider,
          },
          {
            path: '/*',
            name: 'home',
            component: Home,
          },
        ]
      }
    ]
  })
}
