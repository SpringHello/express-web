import Vue from 'vue'
import Router from 'vue-router'

import App from '@/App'

import Home from '@/page/Home'



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
            path: '/*',
            name: 'home',
            component: Home,
          },
        ]
      }
    ]
  })
}
