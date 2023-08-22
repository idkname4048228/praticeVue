<script setup>
import { ref, watch } from 'vue'

const infoModal = ref()
const imgSrc = ref('')

const props = defineProps({
  src: String
})

function open() {
  infoModal.value.showModal();
}

function close() {
  infoModal.value.close();
}

defineExpose({
  open,
  close
})


watch(
  () => props.src,
  (newVal) => {
    imgSrc.value = `http://localhost:3000/img/${newVal}`
    
  }
)

</script>

<template>
  <dialog id="info-modal" ref="infoModal">
    <span id="dialog-text">
      <img :src="imgSrc" >
    </span>
    <button id="dialog-button" @click="close"><slot name="buttonText">close</slot></button>
  </dialog>
</template>

<style scoped>
@import '../../assets/DialogForm.css';

img {
  width: 100%;
  aspect-ratio: 4/3;
}

#dialog-button {
  width: 70%;
  padding: 1.5vh;
  font-size: 2.5vh;
}

dialog {
  position: fixed;
  left: 50%;
  top: 50%;

  width: 50%;
  aspect-ratio: 1/0.8;

  border: none;
  box-shadow: 0 2px 6px #ccc;
  border-radius: 2vh;
  transform: translate(-50%, -50%);
}

dialog[open] {
  display: grid;
  grid-template-columns: 10% 80% 10%;
  grid-template-rows: 5% 75% 5% 10% 5%;
  justify-items: center;
  background-color: #ededed;
}

#dialog-text {
  grid-column: 2/3;
  grid-row: 2/3;
  width: 100%;
  overflow-y: scroll;
  white-space: normal;
  text-align: center;
}

#dialog-text::-webkit-scrollbar {
  display: none;
}

#dialog-button {
  grid-column: 2/3;
  grid-row: 4/5;
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>

<style>
body {
    font-size: 4vh;
}
</style>
