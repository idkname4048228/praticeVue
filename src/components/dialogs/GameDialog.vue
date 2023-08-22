<script setup>
import littleGame from '@/assets/littleGame.js'
import { ref, reactive, watch } from 'vue'

const emit = defineEmits(['show-dialog', 'gain-money'])

const infoModal = ref()
const board = reactive(new littleGame())

const nowSize = ref()

function open() {
  infoModal.value.showModal()
}

function close() {
  infoModal.value.close()
  emit('show-dialog', 'HAIYAA \n 輸得徹徹底底', 'failure')
}

function initGame(size) {
  nowSize.value = size
  board.init(size)
}

function addMoney(step) {
  const token = sessionStorage.getItem('token')
  fetch('http://localhost:3000/api/command/littleGameWin', {
    method: 'POST',
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ size: nowSize.value })
  })
    .then((response) => response.json())
    .then((result) => {
      emit(
        'show-dialog',
        `You ... you're not failure.
you cost ${step} steps to solve this problem.
you get $${result.result} 刀了.`,
        'O...Okay'
      )
      emit('gain-money', result.result)
    })
    .catch((error) => {
      console.log(error)
    })
}

function victory(step) {
  infoModal.value.close()

  addMoney(step)
}

watch(
  board,
  (newState, oldState) => {
    console.log('watch', newState, oldState, newState.win)
    if (newState.win) {
      victory(newState.step)
    }
  },
  { deep: true }
)

defineExpose({
  initGame,
  open
})
</script>

<template>
  <dialog id="info-modal" ref="infoModal">
    <div class="game-container">
      <div id="game"></div>
    </div>
    <button id="dialog-button" @click="close"><slot name="buttonText">投降輸一半</slot></button>
  </dialog>
</template>

<style scoped>
@import '../../assets/DialogForm.css';
@import '../../assets/littleGame.css';

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
  grid-template-rows: 5% 70% 5% 15% 5%;
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
#game {
  height: 100%;
  aspect-ratio: 1/1;
  border-width: 0px;
  border-style: solid;
  border-color: #999;
  background-color: #bbb;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-content: center;
}

#game.hidden {
  display: none;
}

.cell {
  width: calc((100% / var(--size)) - 1px);
  aspect-ratio: 1/1;

  border-width: 1px;
  border-style: solid;
  border-color: #bbb;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #ddd;
}
.pipe {
  width: 100%;
  aspect-ratio: 1/1;
}
</style>
