<script setup>
import { ref } from 'vue'

const message = ref('')

const emit = defineEmits(['send-message'])

function sendMessage() {
  emit('send-message', message.value)
}

function clearTypeArea() {
  message.value = ''
}

defineExpose({
  clearTypeArea
})
</script>

<template>
  <div id="type-div">
    <textarea
      id="typearea"
      v-model="message"
      @keydown.enter.exact.prevent="sendMessage"
      @keydown.enter.shift.exact.prevent="message += '\n'"
      placeholder="Write some words..."
    ></textarea>
    <div id="send-div">
      <font-awesome-icon @click="sendMessage" id="send-icon" icon="fa-solid fa-paper-plane" />
    </div>
  </div>
</template>

<style scoped>
#type-div {
  grid-column: 3/4;
  grid-row: 2/3;
  width: 100%;
  height: 100%;

  position: relative;
}

#typearea {
  width: 100%;
  height: 100%;
  border-radius: 2vh;
  padding: 1vh 7vh 1vh 1vh;
  font-size: 2.5vh;
  resize: none;
}

#typearea::-webkit-scrollbar {
  display: none;
}

#send-div {
  height: 50%;
  aspect-ratio: 1/1;
  position: absolute;
  top: 50%;
  right: 1vh;
  transform: translate(0, -50%);
  background-color: #00dd00;
  display: flex;
  place-content: center;
  align-items: center;
  border-radius: 2vh;
}

#send-div:hover {
  cursor: pointer;
  background-color: #00bb00;
}

#send-icon {
  color: #fff;
  font-size: 2vh;
}

#send-div:hover #send-icon {
  color: #ddd;
}
</style>
