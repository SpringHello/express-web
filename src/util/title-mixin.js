/**
 * Created by yunrui001 on 2018-09-10.
 */
// title-mixin.js

function getTitle(vm) {
  // 组件可以提供一个 `title` 选项
  // 此选项可以是一个字符串或函数
  const {title, keywords, description} = vm.$options
  if (title) {
    return {
      title: typeof title === 'function'
        ? title.call(vm)
        : title,
      keywords: typeof keywords === 'function'
        ? keywords.call(vm)
        : keywords,
      description: typeof description === 'function'
        ? description.call(vm)
        : description
    }
  }
}

const serverTitleMixin = {
  created () {
    const {title, keywords, description} = getTitle(this)
    if (title) {
      this.$ssrContext.title = title
      this.$ssrContext.keywords = keywords
      this.$ssrContext.description = description
    }
  }
}

const clientTitleMixin = {
  mounted () {
    const {title} = getTitle(this)
    if (title) {
      document.title = title
    }
  }
}

// 可以通过 `webpack.DefinePlugin` 注入 `VUE_ENV`
export default process.env.VUE_ENV === 'server'
  ? serverTitleMixin
  : clientTitleMixin
