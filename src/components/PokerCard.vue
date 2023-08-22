<script setup>
import { computed } from 'vue'
import HeartIcon from './icons/PokerIcons/IconHeart.vue'
import ClubIcon from './icons/PokerIcons/IconClub.vue'
import SpadeIcon from './icons/PokerIcons/IconSpade.vue'
import DiamondIcon from './icons/PokerIcons/IconDiamond.vue'

const props = defineProps({
  attribute: Object
})

const icons = {
  0: SpadeIcon,
  1: HeartIcon,
  2: DiamondIcon,
  3: ClubIcon
}

const iconIndex = computed(() => Math.floor(props.attribute.number / 13))
const currentIcon = computed(() => icons[iconIndex.value])
const number = computed(() => {
  let rank = (props.attribute.number % 13) + 1
  if (rank == 1) {
    return 'A'
  }
  if (rank == 11) {
    return 'J'
  }
  if (rank == 12) {
    return 'Q'
  }
  if (rank == 13) {
    return 'K'
  }
  return rank
})
const isRed = computed(() => iconIndex.value == 1 || iconIndex.value == 2)
const isFlip = computed(() => props.attribute.flip)
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
