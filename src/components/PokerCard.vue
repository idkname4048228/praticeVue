<script setup>
import { computed } from 'vue'
import HeartIcon from './icons/PokerIcons/IconHeart.vue'
import ClubIcon from './icons/PokerIcons/IconClub.vue'
import SpadeIcon from './icons/PokerIcons/IconSpade.vue'
import DiamondIcon from './icons/PokerIcons/IconDiamond.vue'

const props = defineProps({
  symbol: String,
  number: String,
  isRed: Boolean,
  isFlip: Boolean
})

const icons = {
  heart: HeartIcon,
  spade: SpadeIcon,
  club: ClubIcon,
  diamond: DiamondIcon
}

const currentIcon = computed(() => icons[props.symbol])
</script>

<template>
  <div class="card" :style="isFlip ? 'transform: rotateY(0deg);' : 'transform: rotateY(-180deg);'">
    <component :is="currentIcon" class="card-icon" :class="{ red: isRed }" />
    <span class="card-num" :class="{ red: isRed }">{{ number }}</span>
  </div>
</template>

<style scoped>
.card {
  background-color: #ccc;
  width: calc(50vh * 2 / 3);
  /* height: 50vh; */
  aspect-ratio: 2/3;
  border-radius: 4vh;
  display: grid;
  grid-template-columns: 35% 30% 35%;
  grid-template-rows: 20% 20% 25% 15% 20%;
  box-shadow: -2px 1px 2px 1px rgba(0, 0, 0, 0.4);
  transform-style: preserve-3d;
  transition:
    transform 0.5s ease-in,
    box-shadow 0.5s ease-in-out;
}

.red {
  color: #d22;
}
.card-icon {
  display: block;
  grid-row: 2/3;
  grid-column: 2/3;
  width: 100%;
  height: auto;
}

.card .card-num {
  grid-row: 4/5;
  grid-column: 2/3;
  font-size: 5vh;
  text-align: center;
}

.card:before {
  content: ' ';
  background-color: #ccc;
  width: calc(50vh * 2 / 3);
  /* height: 50vh; */
  aspect-ratio: 2/3;
  border-radius: 3.4vh;
  transform: translateZ(-1px);

  transform-style: preserve-3d;
}
</style>
