<template>
  <div class="wrapper" :class="{ global: isGlobal }">
    <div class="loadingio-spinner-spin-gizaf3juicc">
      <div class="ldio-fvtfslq67l">
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  global: Boolean,
});

const isGlobal = computed(() => {
  return props?.global ?? false;
});
</script>

<style scoped>
.wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
}

.wrapper.global {
  position: absolute;
}

@keyframes ldio-fvtfslq67l {
  0% {
    opacity: 1;
    backface-visibility: hidden;
    transform: translateZ(0) scale(1.5, 1.5);
  }
  100% {
    opacity: 0;
    backface-visibility: hidden;
    transform: translateZ(0) scale(1, 1);
  }
}
.ldio-fvtfslq67l div > div {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--blue-color);
  animation: ldio-fvtfslq67l 1s linear infinite;
}
.ldio-fvtfslq67l div:nth-child(1) > div {
  left: 148px;
  top: 88px;
  animation-delay: -0.875s;
}
.ldio-fvtfslq67l > div:nth-child(1) {
  transform: rotate(0deg);
  transform-origin: 160px 100px;
}
.ldio-fvtfslq67l div:nth-child(2) > div {
  left: 130px;
  top: 130px;
  animation-delay: -0.75s;
}
.ldio-fvtfslq67l > div:nth-child(2) {
  transform: rotate(45deg);
  transform-origin: 142px 142px;
}
.ldio-fvtfslq67l div:nth-child(3) > div {
  left: 88px;
  top: 148px;
  animation-delay: -0.625s;
}
.ldio-fvtfslq67l > div:nth-child(3) {
  transform: rotate(90deg);
  transform-origin: 100px 160px;
}
.ldio-fvtfslq67l div:nth-child(4) > div {
  left: 46px;
  top: 130px;
  animation-delay: -0.5s;
}
.ldio-fvtfslq67l > div:nth-child(4) {
  transform: rotate(135deg);
  transform-origin: 58px 142px;
}
.ldio-fvtfslq67l div:nth-child(5) > div {
  left: 28px;
  top: 88px;
  animation-delay: -0.375s;
}
.ldio-fvtfslq67l > div:nth-child(5) {
  transform: rotate(180deg);
  transform-origin: 40px 100px;
}
.ldio-fvtfslq67l div:nth-child(6) > div {
  left: 46px;
  top: 46px;
  animation-delay: -0.25s;
}
.ldio-fvtfslq67l > div:nth-child(6) {
  transform: rotate(225deg);
  transform-origin: 58px 58px;
}
.ldio-fvtfslq67l div:nth-child(7) > div {
  left: 88px;
  top: 28px;
  animation-delay: -0.125s;
}
.ldio-fvtfslq67l > div:nth-child(7) {
  transform: rotate(270deg);
  transform-origin: 100px 40px;
}
.ldio-fvtfslq67l div:nth-child(8) > div {
  left: 130px;
  top: 46px;
  animation-delay: 0s;
}
.ldio-fvtfslq67l > div:nth-child(8) {
  transform: rotate(315deg);
  transform-origin: 142px 58px;
}
.loadingio-spinner-spin-gizaf3juicc {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  background: #ffffff;
}
.ldio-fvtfslq67l {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.ldio-fvtfslq67l div {
  box-sizing: content-box;
}
/* generated by https://loading.io/ */
</style>
