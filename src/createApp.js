/**
 * Created by yunrui001 on 2018-07-13.
 */
import Vue from 'vue'
import App from './App'
import createRouter from './router'
import createStore from './vuex'
import Message from './iview/Message'
Vue.prototype.$Message = Message
export default function createApp() {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return {app, router, store}
}
