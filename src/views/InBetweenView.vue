<script setup>
import { ref, onMounted } from 'vue'
import PokerCard from '../components/PokerCard.vue'
import WarningDialog from '../components/dialogs/WarningDialog.vue'
import ChatSwitch from '../components/chat/ChatSwitch.vue'
import ChatRoom from '../components/chat/ChatRoom.vue'
import Vue3autocounter from 'vue3-autocounter'
import GameDialog from '../components/dialogs/GameDialog.vue'
import PictureDialog from '../components/dialogs/PictureDialog.vue'

const account = ref('')
const money = ref(0)
const nextMoney = ref(0)
const moneyDiff = ref('')
const counter = ref(null)

const betNumber = ref('')
const start = ref(false)
const guessing = ref(false)

const cards = [
  ref({
    number: 51,
    flip: false
  }),
  ref({
    number: 34,
    flip: false
  }),
  ref({
    number: 23,
    flip: false
  })
]

const sameGate = ref(false)

const chating = ref(false)

const dialogText = ref('Failed Failed Failed Failed Failed Failed Failed Failed Failed Failed')
const dialogButton = ref('close')
const dialogRef = ref()

const pictureDialogRef = ref()
const imgSrc = ref('')

const littleGame = ref()

function startBet() {
  console.log('start')
  cards[0].value.flip = false
  cards[2].value.flip = false
  const token = sessionStorage.getItem('token')
  let data = {
    betNumber: betNumber.value
  }
  fetch('http://localhost:3000/api/play/draw', {
    method: 'POST',
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.valid) {
        start.value = true
        sameGate.value = result.sameGate
        cards[0].value.number = result.gates[0]
        cards[0].value.flip = true
        cards[2].value.number = result.gates[1]
        cards[2].value.flip = true
      } else {
        dialogText.value = result.tip
        dialogRef.value.open()
      }
    })
    .catch((error) => {
      dialogText.value = error
      dialogRef.value.open()
    })
}

function guess(mode) {
  console.log('guess')
  let data = {
    mode: mode,
    betNumber: betNumber.value
  }
  const token = sessionStorage.getItem('token')
  fetch('http://localhost:3000/api/play/guess', {
    method: 'POST',
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((result) => {
      guessing.value = true

      gainMoney(result.diff)
      cards[1].value.number = result.target
      cards[1].value.flip = true
      setTimeout(() => {
        cards[0].value.flip = false
        cards[1].value.flip = false
        cards[2].value.flip = false
        start.value = false
        guessing.value = false
      }, 1500)
    })
    .catch((error) => {
      dialogText.value = error
      dialogRef.value.open()
    })
}

function gainMoney(diff) {
  moneyDiff.value = 0 + diff
  nextMoney.value = 0 + money.value + 0 + moneyDiff.value
  console.log(money.value, nextMoney.value)
  setTimeout(() => {
    moneyDiff.value = ''
  }, 1500)
}

function gameShowDialog(mainText, buttonText) {
  dialogText.value = mainText
  dialogButton.value = buttonText

  dialogRef.value.open()
}

function ChatRoomShowDialog(newImgSrc, buttonText) {
  imgSrc.value = newImgSrc
  dialogButton.value = buttonText

  pictureDialogRef.value.open()
}

function littleGameStart(size) {
  littleGame.value.initGame(size)
  littleGame.value.open()
}

onMounted(() => {
  const token = sessionStorage.getItem('token')
  fetch('http://localhost:3000/api/user/auth', {
    headers: {
      authorization: `${token}`
    },
    method: 'POST',
    redirect: 'follow'
  })
    .then((response) => response.json())
    .then((result) => {
      console.log('account')
      account.value = result.user
      money.value = 0 + result.money
      nextMoney.value = money.value
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
        <input type="number" id="bet-input" v-model="betNumber" :readonly="start" name="bet" />
        <button id="bet-button" :disabled="start" :style="[!start ? '' : 'opacity: 0.5;']">
          start
        </button>
      </form>

      <span id="current-bet"
        >$
        <Vue3autocounter
          ref="counter"
          :startAmount="money"
          :endAmount="nextMoney"
          :duration="1"
          :autoinit="true"
          @finished="money = nextMoney"
        />
        <span id="diff" :style="[moneyDiff > 0 ? 'color: #2bdd2b;' : 'color: #ff4444;']">{{
          moneyDiff > 0 ? '+' + moneyDiff : moneyDiff
        }}</span></span
      >
    </div>

    <div class="cards">
      <PokerCard :attribute="cards[0].value" />
      <PokerCard :attribute="cards[1].value" />
      <PokerCard :attribute="cards[2].value" />
    </div>

    <div class="btns">
      <button
        id="big"
        @click="guess('big')"
        :style="[sameGate ? '' : 'opacity: 0.5;', start ? '' : 'opacity: 0.5;']"
        :disabled="!(start || guessing)"
      >
        big
      </button>
      <button
        id="open"
        @click="guess('mid')"
        :style="[sameGate ? 'opacity: 0.5;' : '', start ? '' : 'opacity: 0.5;']"
        :disabled="!(start || guessing)"
      >
        open
      </button>
      <button
        id="small"
        @click="guess('small')"
        :style="[sameGate ? '' : 'opacity: 0.5;', start ? '' : 'opacity: 0.5;']"
        :disabled="!(start || guessing)"
      >
        small
      </button>
    </div>
  </div>

  <ChatSwitch :isChating="chating" @chat-end="chating = !chating" />

  <ChatRoom :account="account" :isChating="chating" @little-game-start="littleGameStart" @show-dialog="ChatRoomShowDialog"/>

  <GameDialog
    ref="littleGame"
    @show-dialog="gameShowDialog"
    @gain-money="
      (money) => {
        gainMoney(money)
      }
    "
  />

  <WarningDialog ref="dialogRef">
    <template v-slot:waringText>
      {{ dialogText }}
    </template>
    <template v-slot:buttonText>
      {{ dialogButton }}
    </template>
  </WarningDialog>

  <PictureDialog ref="pictureDialogRef" :src="imgSrc">
    <template v-slot:buttonText>
      {{ dialogButton }}
    </template>
  </PictureDialog>
</template>

<style scoped>
@import '../assets/InBetween.css';
</style>

<style>
#app {
  background-color: #fff;
}
</style>
