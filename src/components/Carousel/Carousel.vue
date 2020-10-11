<template>
  <div
    class="carousel"
    ref="carousel"
    :style="{
      backgroundImage: `url(${urls[nextUrl]})`,
    }"
  >
    <div v-for="c in column" :key="`column${c}`" class="outer-div">
      <div
        v-for="r in row"
        :key="`row${r}`"
        class="inner-div"
        :class="{ transition: transition }"
        :style="{
          backgroundImage: `url(${urls[currentUrl]})`,
          backgroundPosition: `${(r - 1) * positionX}px ${
            (c - 1) * positionY
          }px`,
          backgroundSize: `${row * 100}% ${column * 100}%`,
          transform: transition
            ? `translateZ(100px) rotateX(${Math.ceil(
                Math.random() * 1000
              )}deg) rotateY(${Math.ceil(
                Math.random() * 0
              )}deg) rotateZ(${Math.ceil(Math.random() * 0)}deg)`
            : 'none',
        }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    urls: {
      default() {
        return [];
      },
      type: Array,
    },
    interval: {
      default() {
        return 5000;
      },
      type: Number,
    },
    row: {
      default() {
        return 20;
      },
      type: Number,
    },
    column: {
      default() {
        return 10;
      },
      type: Number,
    },
  },
  data() {
    return {
      currentUrl: 0,
      nextUrl: 1,
      transition: false,
      positionX: 0,
      positionY: 0,
    };
  },
  mounted() {
    this.positionX = -this.$refs.carousel.offsetWidth / this.row;
    this.positionY = -this.$refs.carousel.offsetHeight / this.column;

    setInterval(() => {
      this.transition = true;
      setTimeout(() => {
        this.transition = false;
        this.currentUrl = this.nextUrl;
        this.nextUrl = (this.currentUrl + 1) % this.urls.length;
      }, 1000);
    }, this.interval);
  },
};
</script>>
<style rel="stylesheet/less" lang="less" scoped>
.carousel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-size: 100% 100%;
}
.outer-div {
  flex: 1;
  display: flex;
  .inner-div {
    height: 100%;
    flex: 1;
    //transform: rotate3d(1, 1, 1, 145deg);
    &.transition {
      opacity: 0;
      transition: all 1s;
    }
  }
}
</style>>