<script setup>
import { ref, watch } from 'vue'
import ChatLog from './ChatLog.vue'
import TypeArea from './TypeArea.vue'
import router from '../../router'

const emit = defineEmits(['little-game-start', 'show-dialog'])

const props = defineProps({
  account: String,
  isChating: Boolean
})

const logRef = ref()
const typeRef = ref()

const userMessage = ref('')

function handleMessage(content) {
  userMessage.value = content
  let result = logRef.value.userSendMessage(content)
  if (result) {
    typeRef.value.clearTypeArea()
    const token = sessionStorage.getItem('token')
    setTimeout(() => {
      fetch(`http://localhost:3000/api/command/${userMessage.value.split(' ')[0]}`, {
        method: 'POST',
        headers: {
          authorization: `${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ target: userMessage.value.split(' ')[1] })
      })
        .then((response) => response.json())
        .then((result) => handleResult(result))
        .catch((error) => {
          console.log(error)
        })
    }, 500)
  }
}

function handleResult(result) {
  if (result.imgSrc && !result.content) {
    logRef.value.botSendPicture(`http://localhost:3000/img/${result.imgSrc}`)
  } else {
    logRef.value.botSendMessage(result.content)
    emit('show-dialog', result.imgSrc, "Huh?")
  }

  if (result.game) {
    emit('little-game-start', result.size)
  }
  if (result.requireRefreshing) {
    setTimeout(() => {
      router.push('/login')
      sessionStorage.clear('token')
    }, 500)
  }
}

watch(
  () => props.account,
  (newVal) => {
    if (newVal !== '') {
      logRef.value.botSendMessage(`Hello ${props.account}, what can I help you?`)
    }
  }
)
</script>

<template>
  <div
    id="chat-room-container"
    class="darkBgFilter"
    :style="[isChating ? 'opacity: 1' : '', isChating ? 'z-index: 2' : '']"
  >
    <div id="chat-room" :style="isChating ? 'left: -2%' : ''">
      <ChatLog ref="logRef" />
      <TypeArea ref="typeRef" @send-message="handleMessage" />
    </div>
  </div>
</template>

<style scoped>
#chat-room-container {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
  transition:
    opacity 0.5s ease-in-out,
    z-index 0.5s ease-in-out;
}

#chat-room {
  position: fixed;
  left: -50%;
  top: 0%;

  width: 50%;
  height: 100%;

  border: none;
  box-shadow: 0 2px 6px #ccc;
  border-radius: 0 20px 20px 0;

  display: grid;
  grid-template-columns: 4% 4% 88% 4%;
  grid-template-rows: 87% 10% 3%;
  justify-items: center;

  backdrop-filter: blur(30px);
  /* 设置模糊效果的程度，可以根据需要调整 */
  background-color: rgba(0, 0, 0, 0.5);
  /* 设置背景颜色和透明度，这里的 rgba 值表示白色背景的透明度为 0.5 */
  /* 设置整个元素的透明度 */

  transition: left 0.5s cubic-bezier(0.37, 0.14, 0.44, 1.23);
}

.darkBgFilter {
  backdrop-filter: blur(10px);
  /* 设置模糊效果的程度，可以根据需要调整 */
  background-color: rgba(0, 0, 0, 0.2);
  /* 设置背景颜色和透明度，这里的 rgba 值表示白色背景的透明度为 0.5 */
  /* 设置整个元素的透明度 */
}
</style>
