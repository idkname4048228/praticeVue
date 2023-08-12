<script setup>
import { ref, onMounted } from 'vue'
import PokerCard from '../components/PokerCard.vue'
import WarningDialog from '../components/dialogs/WarningDialog.vue'
import ChatSwitch from '../components/chat/ChatSwitch.vue'
import ChatRoom from '../components/chat/ChatRoom.vue'

const account = ref('')
const cardsSymbol = [ref('heart'), ref('spade'), ref('club')]
const cardsNumber = [ref('A'), ref('10'), ref('K')]
const cardsIsRed = [ref(false), ref(true), ref(false)]
const cardsIsFlip = [ref(false), ref(false), ref(false)]

const chating = ref(false)

const dialogText = ref('Failed Failed Failed Failed Failed Failed Failed Failed Failed Failed')
const dialogSwitch = ref(false)

function startBet() {
  console.log('start bet')
}
function randomAIcon() {
  cardsSymbol[0].value = 'diamond'
  cardsNumber[0].value = 'J'
}
function changeColor() {
  cardsIsRed[0].value = !cardsIsRed[0].value
  cardsIsRed[1].value = !cardsIsRed[1].value
  cardsIsRed[2].value = !cardsIsRed[2].value
}
function changeflip() {
  cardsIsFlip[0].value = !cardsIsFlip[0].value
  cardsIsFlip[1].value = !cardsIsFlip[1].value
  cardsIsFlip[2].value = !cardsIsFlip[2].value
}

onMounted(() => {
  const token = sessionStorage.getItem('token')
  fetch('http://localhost:3000/api/auth', {
    headers: {
      authorization: `${token}`
    },
    method: 'POST',
    redirect: 'follow'
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("account")
      account.value = result.user
    })
})
</script>

<template>
  <div class="container">
    <!-- <input type="checkbox" id="animation-trigger">
	<label for="animation-trigger"></label> -->

    <div class="header">
      <div id="name-tip">
        User:
        <span id="user-name">{{ account }}</span>
      </div>

      <form id="bet-form" @submit.prevent="startBet">
        <label for="bet-input">Bet:</label>
        <input type="number" id="bet-input" name="bet" maxlength="10" />
        <button id="bet-button">start</button>
      </form>

      <span id="current-bet">$ <span id="bet-number">10000</span><span id="diff"></span></span>
    </div>

    <div class="cards">
      <PokerCard :symbol="cardsSymbol[0].value" :number="cardsNumber[0].value" :isRed="cardsIsRed[0].value" :isFlip="cardsIsFlip[0].value"/>
      <PokerCard :symbol="cardsSymbol[1].value" :number="cardsNumber[1].value" :isRed="cardsIsRed[1].value" :isFlip="cardsIsFlip[1].value"/>
      <PokerCard :symbol="cardsSymbol[2].value" :number="cardsNumber[2].value" :isRed="cardsIsRed[2].value" :isFlip="cardsIsFlip[2].value"/>
    </div>

    <div class="btns">
      <button id="big" @click="randomAIcon">big</button>
      <button id="open" @click="changeColor">open</button>
      <button id="small" @click="changeflip" >small</button>
    </div>
  </div>

  <ChatSwitch :isChating="chating" @chat-end="chating = !chating" />

  <ChatRoom :account="account" :isChating="chating" />

  <WarningDialog :showSwitch="dialogSwitch" @dialog-close="dialogSwitch = false">
    <template v-slot:waringText>
      {{ dialogText }}
    </template>
  </WarningDialog>
</template>

<style scoped>
@import '../assets/InBetween.css';
</style>
