import Vue from 'vue'
import Router from 'vue-router'

import App from '../App'

import Home from '../components/Home'
import JavaScript from '../components/JavaScript'
import Art from '../components/Art'


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
            name: Home.name,
            component: Home,
          },
          {
            path: '/:page(\\d*)',
            name: 'homePage',
            component: Home,
          },
          {
            path: '/javascript',
            name: JavaScript.name,
            component: JavaScript,
          },
          {
            path: '/javascript/:page(\\d*)',
            name: 'jsPage',
            component: JavaScript,
          },
          {
            path: '/art/:aid',
            name: Art.name,
            component: Art
          }
        ]
      }
    ]
  })
}
