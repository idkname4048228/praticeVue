<script setup>

defineProps({
  isChating: Boolean
})

const emit = defineEmits(['chatEnd'])

function chatEnd() {
  emit('chatEnd')
}

</script>

<template>
  <div id="chat-switch" @click="chatEnd">
    <font-awesome-icon v-if="isChating" class="chat-icon" icon="fa-solid fa-comment-slash" />
    <font-awesome-icon v-else class="chat-icon" icon="fa-solid fa-comment" />
  </div>
</template>

<style scoped>
#chat-switch {
  width: 7vh;
  /* height: 5rem; */
  aspect-ratio: 1/1;
  background-color: #00dd00;

  display: flex;
  place-content: center;
  align-items: center;

  border-radius: 50%;
  position: fixed;
  top: 50%;
  right: 5%;
  transform: translate(0%, -50%);

  z-index: 3;
  transition: background-color 0.3s ease-out;
}

#chat-switch:hover {
  cursor: pointer;
  background-color: #00bb00;
}

.chat-icon {
  color: #fff;
  font-size: 4.3vh;
}

#chat-switch:hover #chat-icon {
  color: #ddd;
}
</style>
