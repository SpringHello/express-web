/**
 * Created by yunrui001 on 2018-09-26.
 */
import Vue from 'vue'
import ImgBox from './ImgBox.vue'

var getBox = (function () {
  var box = null
  return function () {
    box = document.createElement('div')
    box.setAttribute('id', 'iview-imgBox')
    document.body.appendChild(box)
    return box
  }
})()

export default function (target) {
  var imgBox = getBox()
  var img = document.createElement('img')
  img.setAttribute('src', target.getAttribute('src'))
  imgBox.addEventListener('click', function () {
    document.body.removeChild(imgBox)
  })
  imgBox.appendChild(img)
}
