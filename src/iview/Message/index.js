/**
 * Created by yunrui001 on 2018-09-04.
 */
import Vue from 'vue'
import NoticeWrapper from './NoticeWrapper.vue'
var defaults = {
  top: 20,
  duration: 3
}
var messageInstance

function getMessageInstance() {
  messageInstance = messageInstance || newInstance();
  return messageInstance;
}

function newInstance() {
  const Instance = new Vue({
    render (h) {
      return h(NoticeWrapper);
    }
  });
  const component = Instance.$mount();
  document.body.appendChild(component.$el);
  const notification = Instance.$children[0];
  return {
    notice(options){
      setTimeout(function () {
        Vue.set(options, 'death', true)
      }, options.duration * 1000)
      notification.add(options)
    }
  }
}

function notice(content = '', duration = defaults.duration, type) {
  //const iconType = iconTypes[type];

  // if loading
  //const loadCls = type === 'loading' ? ' ivu-load-loop' : '';

  let instance = getMessageInstance();

  instance.notice({
    duration: duration,
    content: `
            <div>
                <i class="iview-msg-icon-${type}"></i>
                <span>${content}</span>
            </div>
        `,
    type
  });
}

export default {
  name: 'Message',

  info (options) {
    return this.message('info', options);
  },
  success (options) {
    return this.message('success', options);
  },
  warning (options) {
    return this.message('warning', options);
  },
  error (options) {
    return this.message('error', options);
  },
  loading (options) {
    return this.message('loading', options);
  },
  message(type, options){
    if (typeof options === 'string') {
      options = {
        content: options
      };
    }
    return notice(options.content, options.duration, type);
  },
  config (options) {
    if (options.top || options.top === 0) {
      defaults.top = options.top;
    }
    if (options.duration || options.duration === 0) {
      defaults.duration = options.duration;
    }
  }
};

