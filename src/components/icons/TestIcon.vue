<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
const props = defineProps({
  iconClass: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: () => '',
  },
})

const iconName = computed(() => {
  console.log(`#icon-${props.iconClass}`);
  return `#icon-${props.iconClass}`
})
const svgClass = computed(() => {
  return props.className ? 'svg-icon ' + props.className : 'svg-icon';
})

</script>
<style scoped lang="scss">
.svg-icon {
  fill: currentColor;
}
</style>

作者：_DoubleL
链接：https://juejin.cn/post/7221750009141002277
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。