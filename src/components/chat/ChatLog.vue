<script setup>
import { reactive } from 'vue'

var id = 0
const messages = reactive([])
// message = {
//  id:       Number,
//  content:  String,
//  user:     Boolean.
//  isPicture:Boolean
//}
function botSendMessage(content) {
  // content = content.replace(/\n/g, '<br />')
  messages.push({
    id: id++,
    content: content,
    user: false,
    isPicture: false
  })
  // chatAnimation()
}

function botSendPicture(source) {
  messages.push({
    id: id++,
    content: source,
    user: false,
    isPicture: true
  })
}

// TODO
// 你已經死了、小遊戲、rickroll
function userSendMessage(message) {
  if (message.length == 0 || !/[\S]/.test(message)) {
    // 測試是否所有字元都是空白字符（空格、換行等）
    return false
  }
  messages.push({
    id: id++,
    content: message,
    user: true
  })
  return true
}

defineExpose({
  botSendMessage,
  botSendPicture,
  userSendMessage
})
</script>

<template>
  <div id="chat-logs">
    <transition-group name="message">
      <template v-for="message in messages.slice().reverse()" :key="message.id">
        <div v-if="message.isPicture" class="text-log" :class="[message.user ? 'user' : 'bot']">
          <img :src="message.content" alt="never gonna give you up" />
        </div>
        <div v-else class="text-log" :class="[message.user ? 'user' : 'bot']">
          {{ message.content }}
        </div>
      </template>
    </transition-group>
  </div>
</template>

<style scoped>
#chat-logs {
  grid-column: 3/4;
  grid-row: 1/2;
  padding: 10px 0px;

  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  overflow-y: auto;
  transition: bottom 0.5s ease-in-out;
}

#chat-logs::-webkit-scrollbar {
  display: none;
}

.text-log {
  font-size: 3vh;
  padding: 1vh;
  margin: 1vh 1.5vw;
  border-radius: 1vh;
  white-space: pre-wrap;
}

img {
  width: 100%;
  aspect-ratio: 4/3;
}

.user {
  background-color: #dddddd;
  position: relative;
  align-self: flex-end;
}

.bot {
  background-color: #00bb00;
  position: relative;
  align-self: flex-start;
}

.user:after,
.bot::after {
  content: '';
  position: absolute;
  top: 0px;
  width: 1.5vw;
  height: 5%;
  border-width: 0;
  border-style: solid;
  border-bottom-width: 1vw;
}

.user:after {
  left: 100%;
  color: #dddddd;
  margin-left: -0.5vw;
  border-radius: 0 0 5vh 0;
}

.bot::after {
  right: 100%;
  color: #00bb00;
  margin-right: -0.5vw;
  border-radius: 0 0 0 5vh;
}

.message-enter-active,
.message-leave-active,
.message-move {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.message-leave-active {
  position: absolute;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 1;
  transform: translateY(-20px);
}
</style>
